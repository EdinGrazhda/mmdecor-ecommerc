import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { normalizeImageUrl } from '@/lib/media';
import type { Product } from './types';

export interface CartItem {
    id: number;
    product_id: number;
    name: string;
    image?: string | null;
    quantity: number;
    price: number;
    total: number;
}

export interface CartPayload {
    items: CartItem[];
    count: number;
    total: number;
}

export interface CheckoutForm {
    customer_full_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    customer_country: 'albania' | 'kosovo' | 'macedonia';
    notes: string;
}

function validateCheckoutForm(form: CheckoutForm): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!form.customer_full_name.trim()) errors.customer_full_name = 'Name and surname are required.';
    if (!form.customer_email.trim()) errors.customer_email = 'Email is required.';
    if (!form.customer_phone.trim()) errors.customer_phone = 'Phone number is required.';
    if (!form.customer_address.trim()) errors.customer_address = 'Address is required.';
    if (!form.customer_city.trim()) errors.customer_city = 'City is required.';

    return errors;
}

class CheckoutError extends Error {
    errors: Record<string, string>;

    constructor(errors: Record<string, string>) {
        super('Checkout validation failed.');
        this.errors = errors;
    }
}

async function cartRequest(path: string, options: RequestInit = {}) {
    const csrfToken = typeof document !== 'undefined'
        ? document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
        : '';

    console.log('Cart request:', { method: options.method || 'GET', path, csrfToken: csrfToken ? 'present' : 'missing' });

    const response = await fetch(path, {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            ...(options.headers ?? {}),
        },
        ...options,
    });

    let payload;
    try {
        payload = await response.json();
    } catch {
        payload = { message: `Failed to parse response: ${response.statusText}` };
    }

    console.log('Cart response:', { status: response.status, ok: response.ok, payload });

    if (!response.ok) {
        if (response.status === 422 && payload.errors) {
            const errors = Object.fromEntries(
                Object.entries(payload.errors).map(([key, value]) => [
                    key,
                    Array.isArray(value) ? String(value[0]) : String(value),
                ]),
            );
            throw new CheckoutError(errors);
        }

        const errorMsg = payload.message ?? payload.exception ?? `HTTP ${response.status}: ${response.statusText}`;
        console.error('Cart request error details:', { status: response.status, message: errorMsg, payload });
        throw new Error(errorMsg);
    }

    return payload;
}

interface CartContextType {
    cartCount: number;
    cartItems: CartItem[];
    cartTotal: number;
    cartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    checkoutOpen: boolean;
    setCheckoutOpen: (open: boolean) => void;
    confirmCheckoutOpen: boolean;
    setConfirmCheckoutOpen: (open: boolean) => void;
    cartBusy: boolean;
    orderMessage: string;
    setOrderMessage: (msg: string) => void;
    checkoutErrors: Record<string, string>;
    checkoutForm: CheckoutForm;
    setCheckoutForm: React.Dispatch<React.SetStateAction<CheckoutForm>>;
    handleAddToCart: (product: Product) => Promise<void>;
    updateCartItem: (item: CartItem, quantity: number) => Promise<void>;
    removeCartItem: (item: CartItem) => Promise<void>;
    submitCheckout: (e?: React.FormEvent | React.MouseEvent) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [confirmCheckoutOpen, setConfirmCheckoutOpen] = useState(false);
    const [cartBusy, setCartBusy] = useState(false);
    const [orderMessage, setOrderMessage] = useState('');
    const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>({});
    const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
        customer_full_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        customer_city: '',
        customer_country: 'albania',
        notes: '',
    });

    const syncCart = useCallback((cart: CartPayload) => {
        setCartItems(cart.items);
        setCartCount(cart.count);
        setCartTotal(cart.total);
    }, []);

    // Initial fetch to sync cart with session
    useEffect(() => {
        cartRequest('/cart')
            .then(syncCart)
            .catch(() => undefined);
    }, [syncCart]);

    const handleAddToCart = useCallback(async (product: Product) => {
        setCartBusy(true);
        setOrderMessage('');

        try {
            const cart = await cartRequest('/cart', {
                method: 'POST',
                body: JSON.stringify({ product_id: product.id, quantity: 1 }),
            });

            syncCart(cart);
            setCartOpen(true);
            setOrderMessage(`${product.name} added to cart!`);
        } catch (error) {
            console.error('Add to cart error:', error);
            setOrderMessage(`Failed to add item to cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setCartBusy(false);
        }
    }, [syncCart]);

    const updateCartItem = useCallback(async (item: CartItem, quantity: number) => {
        try {
            const cart = await cartRequest(`/cart/${item.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ quantity }),
            });
            syncCart(cart);
        } catch (error) {
            console.error('Update cart item error:', error);
        }
    }, [syncCart]);

    const removeCartItem = useCallback(async (item: CartItem) => {
        try {
            const cart = await cartRequest(`/cart/${item.id}`, {
                method: 'DELETE',
            });
            syncCart(cart);
        } catch (error) {
            console.error('Remove cart item error:', error);
        }
    }, [syncCart]);

    const submitCheckout = useCallback(async (e?: React.FormEvent | React.MouseEvent) => {
        e?.preventDefault();
        const validationErrors = validateCheckoutForm(checkoutForm);

        if (Object.keys(validationErrors).length > 0) {
            setCheckoutErrors(validationErrors);
            setConfirmCheckoutOpen(false);
            setCheckoutOpen(true);
            setCartOpen(true);
            return;
        }

        setCartBusy(true);
        setConfirmCheckoutOpen(false);
        setCheckoutErrors({});
        setOrderMessage('');

        try {
            const response = await cartRequest('/checkout', {
                method: 'POST',
                body: JSON.stringify(checkoutForm),
            });

            syncCart(response.cart);
            setCheckoutOpen(false);
            setOrderMessage('Your order was placed successfully.');
            setCheckoutForm({
                customer_full_name: '',
                customer_email: '',
                customer_phone: '',
                customer_address: '',
                customer_city: '',
                customer_country: 'albania',
                notes: '',
            });
        } catch (error) {
            if (error instanceof CheckoutError) {
                setCheckoutErrors(error.errors);
                setCartOpen(true);
            }
        } finally {
            setCartBusy(false);
        }
    }, [checkoutForm, syncCart]);

    const value = useMemo(() => ({
        cartCount,
        cartItems,
        cartTotal,
        cartOpen,
        setCartOpen,
        checkoutOpen,
        setCheckoutOpen,
        confirmCheckoutOpen,
        setConfirmCheckoutOpen,
        cartBusy,
        orderMessage,
        setOrderMessage,
        checkoutErrors,
        checkoutForm,
        setCheckoutForm,
        handleAddToCart,
        updateCartItem,
        removeCartItem,
        submitCheckout,
    }), [
        cartCount,
        cartItems,
        cartTotal,
        cartOpen,
        checkoutOpen,
        confirmCheckoutOpen,
        cartBusy,
        orderMessage,
        checkoutErrors,
        checkoutForm,
        handleAddToCart,
        updateCartItem,
        removeCartItem,
        submitCheckout,
    ]);

    return (
        <CartContext.Provider value={value}>
            {children}
            <CartDrawer />
            <Dialog
                open={confirmCheckoutOpen}
                onOpenChange={(open) => {
                    setConfirmCheckoutOpen(open);
                    if (!open && checkoutOpen && cartItems.length > 0 && !cartBusy) {
                        setCartOpen(true);
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogTitle>Confirm your order</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to place this order now? Your checkout details and cart items will be submitted.
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="rounded-xl border border-[#D1E8F2] px-4 py-2 text-sm font-bold text-[#0D2535] transition hover:bg-[#EBF3F7]"
                            >
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            disabled={cartBusy}
                            onClick={(e) => void submitCheckout(e)}
                            className="rounded-xl bg-[#2E6F8F] px-4 py-2 text-sm font-black text-white disabled:opacity-60"
                        >
                            {cartBusy ? 'Placing order...' : 'Confirm order'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CartContext.Provider>
    );
}

function CartDrawer() {
    const {
        cartBusy,
        cartItems,
        cartOpen,
        setCartOpen,
        cartTotal,
        checkoutErrors,
        checkoutForm,
        setCheckoutForm,
        checkoutOpen,
        setCheckoutOpen,
        orderMessage,
        removeCartItem,
        setConfirmCheckoutOpen,
        submitCheckout,
        updateCartItem,
    } = useCart();

    if (!cartOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[80]">
            <button className="absolute inset-0 bg-[#0D2535]/45" onClick={() => setCartOpen(false)} aria-label="Close cart" />
            <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#E2EEF4] px-5 py-4">
                    <div>
                        <h2 className="text-lg font-black text-[#0D2535]">Cart</h2>
                        <p className="text-xs font-semibold text-[#0D2535]/45">{cartItems.length} items</p>
                    </div>
                    <button onClick={() => setCartOpen(false)} className="rounded-lg p-2 text-[#0D2535]/50 hover:bg-[#EBF3F7]">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {orderMessage && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                            <CheckCircle2 size={16} />
                            {orderMessage}
                        </div>
                    )}

                    {cartItems.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-[#0D2535]/45">
                            <ShoppingCart size={34} />
                            <p className="font-bold">Your cart is empty.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cartItems.map((item) => (
                                <div key={item.id} className="rounded-xl border border-[#E2EEF4] p-3">
                                    <div className="flex gap-3">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EBF3F7]">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <ShoppingCart size={18} className="text-[#2E6F8F]/40" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-2 text-sm font-black text-[#0D2535]">{item.name}</p>
                                            <p className="mt-1 text-xs font-bold text-[#2E6F8F]">${item.price.toFixed(2)}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex items-center rounded-full border border-[#D1E8F2]">
                                                    <button
                                                        className="p-1.5 text-[#2E6F8F] disabled:text-[#0D2535]/20"
                                                        disabled={item.quantity <= 1}
                                                        onClick={() => void updateCartItem(item, item.quantity - 1)}
                                                    >
                                                        <Minus size={13} />
                                                    </button>
                                                    <span className="min-w-7 text-center text-xs font-black">{item.quantity}</span>
                                                    <button className="p-1.5 text-[#2E6F8F]" onClick={() => void updateCartItem(item, item.quantity + 1)}>
                                                        <Plus size={13} />
                                                    </button>
                                                </div>
                                                <button className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" onClick={() => void removeCartItem(item)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {checkoutOpen && cartItems.length > 0 && (
                        <form
                            id="checkout-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setCartOpen(false);
                                setConfirmCheckoutOpen(true);
                            }}
                            className="mt-5 space-y-3 border-t border-[#E2EEF4] pt-5"
                        >
                            <CheckoutInput required label="Name Surname" value={checkoutForm.customer_full_name} error={checkoutErrors.customer_full_name} onChange={(value) => setCheckoutForm({ ...checkoutForm, customer_full_name: value })} />
                            <CheckoutInput required label="Email" type="email" value={checkoutForm.customer_email} error={checkoutErrors.customer_email} onChange={(value) => setCheckoutForm({ ...checkoutForm, customer_email: value })} />
                            <CheckoutInput required label="Phone number" value={checkoutForm.customer_phone} error={checkoutErrors.customer_phone} onChange={(value) => setCheckoutForm({ ...checkoutForm, customer_phone: value })} />
                            <CheckoutInput required label="Address" value={checkoutForm.customer_address} error={checkoutErrors.customer_address} onChange={(value) => setCheckoutForm({ ...checkoutForm, customer_address: value })} />
                            <CheckoutInput required label="City" value={checkoutForm.customer_city} error={checkoutErrors.customer_city} onChange={(value) => setCheckoutForm({ ...checkoutForm, customer_city: value })} />
                            <div>
                                <label className="text-xs font-black uppercase text-[#0D2535]/60">Country</label>
                                <select
                                    value={checkoutForm.customer_country}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, customer_country: e.target.value as CheckoutForm['customer_country'] })}
                                    className="mt-1 w-full rounded-xl border border-[#D1E8F2] px-3 py-2.5 text-sm font-semibold focus:border-[#2E6F8F] focus:outline-none"
                                >
                                    <option value="albania">Albania</option>
                                    <option value="kosovo">Kosovo</option>
                                    <option value="macedonia">Macedonia</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-black uppercase text-[#0D2535]/60">Notes</label>
                                <textarea
                                    rows={3}
                                    value={checkoutForm.notes}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                                    className="mt-1 w-full rounded-xl border border-[#D1E8F2] px-3 py-2.5 text-sm font-semibold focus:border-[#2E6F8F] focus:outline-none"
                                />
                            </div>
                        </form>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="border-t border-[#E2EEF4] p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-bold text-[#0D2535]/55">Total</span>
                            <span className="text-xl font-black text-[#0D2535]">${cartTotal.toFixed(2)}</span>
                        </div>
                        {checkoutOpen ? (
                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={cartBusy}
                                className="w-full rounded-xl bg-[#2E6F8F] py-3 text-sm font-black text-white disabled:opacity-60"
                            >
                                {cartBusy ? 'Placing order...' : 'Place order'}
                            </button>
                        ) : (
                            <button onClick={() => setCheckoutOpen(true)} className="w-full rounded-xl bg-[#2E6F8F] py-3 text-sm font-black text-white">
                                Proceed to checkout
                            </button>
                        )}
                    </div>
                )}
            </aside>
        </div>
    );
}

function CheckoutInput({
    error,
    label,
    onChange,
    required = false,
    type = 'text',
    value,
}: {
    error?: string;
    label: string;
    onChange: (value: string) => void;
    required?: boolean;
    type?: string;
    value: string;
}) {
    return (
        <div>
            <label className="text-xs font-black uppercase text-[#0D2535]/60">{label}</label>
            <input
                type={type}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-semibold focus:outline-none ${error ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'}`}
            />
            {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
        </div>
    );
}
