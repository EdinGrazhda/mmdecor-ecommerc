import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { precacheImages } from '@/lib/media';
import { CatalogSection } from './store/CatalogSection';
import { HeroCarousel } from './store/HeroCarousel';
import { PromoBanner } from './store/PromoBanner';
import { StoreFooter } from './store/StoreFooter';
import { StoreNavbar } from './store/StoreNavbar';
import type { Banner, Campaign, Category, Product } from './store/types';

interface WelcomeProps {
    products?: Product[] | { data?: Product[] };
    categories?: Category[] | { data?: Category[] };
    banners?: Banner[] | { data?: Banner[] };
    campaigns?: Campaign[] | { data?: Campaign[] };
}

interface CartItem {
    id: number;
    product_id: number;
    name: string;
    image?: string | null;
    quantity: number;
    price: number;
    total: number;
}

interface CartPayload {
    items: CartItem[];
    count: number;
    total: number;
}

interface CheckoutForm {
    customer_full_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    customer_country: 'albania' | 'kosovo' | 'macedonia';
    notes: string;
}

export default function Welcome({
    products = [],
    categories = [],
    banners = [],
    campaigns = [],
}: WelcomeProps) {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
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
    const [catSidebarOpen, setCatSidebarOpen] = useState(false);
    const syncCart = useCallback((cart: CartPayload) => {
        setCartItems(cart.items);
        setCartCount(cart.count);
        setCartTotal(cart.total);
    }, []);
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
        } finally {
            setCartBusy(false);
        }
    }, [syncCart]);
    const handleOpenCategories = useCallback(() => setCatSidebarOpen(true), []);
    const productItems = resolveResourceArray(products);
    const categoryItems = resolveResourceArray(categories);
    const bannerItems = resolveResourceArray(banners);
    const campaignItems = resolveResourceArray(campaigns);
    const pricedProductItems = useMemo(
        () => applyCampaignPricing(productItems, campaignItems),
        [campaignItems, productItems],
    );

    useEffect(() => {
        precacheImages([
            ...bannerItems.slice(0, 3).map((banner) => banner.image),
            ...pricedProductItems.slice(0, 6).map((product) => product.image),
            ...campaignItems.slice(0, 3).map((campaign) => campaign.product?.image),
        ]);
    }, [bannerItems, campaignItems, pricedProductItems]);

    useEffect(() => {
        cartRequest('/cart')
            .then(syncCart)
            .catch(() => undefined);
    }, [syncCart]);

    async function updateCartItem(item: CartItem, quantity: number) {
        const cart = await cartRequest(`/cart/${item.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        });

        syncCart(cart);
    }

    async function removeCartItem(item: CartItem) {
        const cart = await cartRequest(`/cart/${item.id}`, {
            method: 'DELETE',
        });

        syncCart(cart);
    }

    async function submitCheckout(e: React.FormEvent | React.MouseEvent) {
        e.preventDefault();
        setCartBusy(true);
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
            }
        } finally {
            setCartBusy(false);
        }
    }

    const storeCategories = [
        {
            id: 0,
            label: 'All Parts',
            count: pricedProductItems.length,
        },
        ...categoryItems,
    ];

    return (
        <>
            <Head title="AutoParts - OEM & Performance Parts" />
            <div className="min-h-screen bg-[#F7FAFB] font-sans text-[#0D2535] antialiased">
                <StoreNavbar
                    cartCount={cartCount}
                    onCartClick={() => setCartOpen(true)}
                    onMenuClick={handleOpenCategories}
                />
                <HeroCarousel
                    banners={bannerItems}
                    campaigns={campaignItems}
                    products={pricedProductItems}
                    onAddToCart={handleAddToCart}
                />
                <CatalogSection
                    categories={storeCategories}
                    products={pricedProductItems}
                    catSidebarOpen={catSidebarOpen}
                    setCatSidebarOpen={setCatSidebarOpen}
                    onAddToCart={handleAddToCart}
                />
                <PromoBanner />
                <StoreFooter />
                <CartDrawer
                    cartBusy={cartBusy}
                    cartItems={cartItems}
                    cartOpen={cartOpen}
                    cartTotal={cartTotal}
                    checkoutErrors={checkoutErrors}
                    checkoutForm={checkoutForm}
                    checkoutOpen={checkoutOpen}
                    orderMessage={orderMessage}
                    onCheckoutChange={setCheckoutForm}
                    onClose={() => setCartOpen(false)}
                    onRemove={removeCartItem}
                    onSubmitCheckout={submitCheckout}
                    onToggleCheckout={setCheckoutOpen}
                    onUpdateQuantity={updateCartItem}
                />
            </div>
        </>
    );
}

function CartDrawer({
    cartBusy,
    cartItems,
    cartOpen,
    cartTotal,
    checkoutErrors,
    checkoutForm,
    checkoutOpen,
    orderMessage,
    onCheckoutChange,
    onClose,
    onRemove,
    onSubmitCheckout,
    onToggleCheckout,
    onUpdateQuantity,
}: {
    cartBusy: boolean;
    cartItems: CartItem[];
    cartOpen: boolean;
    cartTotal: number;
    checkoutErrors: Record<string, string>;
    checkoutForm: CheckoutForm;
    checkoutOpen: boolean;
    orderMessage: string;
    onCheckoutChange: (form: CheckoutForm) => void;
    onClose: () => void;
    onRemove: (item: CartItem) => void;
    onSubmitCheckout: (e: React.FormEvent | React.MouseEvent) => void;
    onToggleCheckout: (open: boolean) => void;
    onUpdateQuantity: (item: CartItem, quantity: number) => void;
}) {
    if (!cartOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[80]">
            <button className="absolute inset-0 bg-[#0D2535]/45" onClick={onClose} aria-label="Close cart" />
            <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#E2EEF4] px-5 py-4">
                    <div>
                        <h2 className="text-lg font-black text-[#0D2535]">Cart</h2>
                        <p className="text-xs font-semibold text-[#0D2535]/45">{cartItems.length} items</p>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-2 text-[#0D2535]/50 hover:bg-[#EBF3F7]">
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
                                                        onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                                                    >
                                                        <Minus size={13} />
                                                    </button>
                                                    <span className="min-w-7 text-center text-xs font-black">{item.quantity}</span>
                                                    <button className="p-1.5 text-[#2E6F8F]" onClick={() => onUpdateQuantity(item, item.quantity + 1)}>
                                                        <Plus size={13} />
                                                    </button>
                                                </div>
                                                <button className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" onClick={() => onRemove(item)}>
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
                        <form onSubmit={onSubmitCheckout} className="mt-5 space-y-3 border-t border-[#E2EEF4] pt-5">
                            <CheckoutInput label="Name Surname" value={checkoutForm.customer_full_name} error={checkoutErrors.customer_full_name} onChange={(value) => onCheckoutChange({ ...checkoutForm, customer_full_name: value })} />
                            <CheckoutInput label="Email" type="email" value={checkoutForm.customer_email} error={checkoutErrors.customer_email} onChange={(value) => onCheckoutChange({ ...checkoutForm, customer_email: value })} />
                            <CheckoutInput label="Phone number" value={checkoutForm.customer_phone} error={checkoutErrors.customer_phone} onChange={(value) => onCheckoutChange({ ...checkoutForm, customer_phone: value })} />
                            <CheckoutInput label="Address" value={checkoutForm.customer_address} error={checkoutErrors.customer_address} onChange={(value) => onCheckoutChange({ ...checkoutForm, customer_address: value })} />
                            <CheckoutInput label="City" value={checkoutForm.customer_city} error={checkoutErrors.customer_city} onChange={(value) => onCheckoutChange({ ...checkoutForm, customer_city: value })} />
                            <div>
                                <label className="text-xs font-black uppercase text-[#0D2535]/60">Country</label>
                                <select
                                    value={checkoutForm.customer_country}
                                    onChange={(e) => onCheckoutChange({ ...checkoutForm, customer_country: e.target.value as CheckoutForm['customer_country'] })}
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
                                    onChange={(e) => onCheckoutChange({ ...checkoutForm, notes: e.target.value })}
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
                            <button disabled={cartBusy} onClick={onSubmitCheckout} className="w-full rounded-xl bg-[#2E6F8F] py-3 text-sm font-black text-white disabled:opacity-60">
                                {cartBusy ? 'Placing order...' : 'Place order'}
                            </button>
                        ) : (
                            <button onClick={() => onToggleCheckout(true)} className="w-full rounded-xl bg-[#2E6F8F] py-3 text-sm font-black text-white">
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
    type = 'text',
    value,
}: {
    error?: string;
    label: string;
    onChange: (value: string) => void;
    type?: string;
    value: string;
}) {
    return (
        <div>
            <label className="text-xs font-black uppercase text-[#0D2535]/60">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-semibold focus:outline-none ${error ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'}`}
            />
            {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
        </div>
    );
}

function resolveResourceArray<T>(resource: T[] | { data?: T[] } | undefined) {
    if (Array.isArray(resource)) {
        return resource;
    }

    if (Array.isArray(resource?.data)) {
        return resource.data;
    }

    return [];
}

class CheckoutError extends Error {
    errors: Record<string, string>;

    constructor(errors: Record<string, string>) {
        super('Checkout validation failed.');
        this.errors = errors;
    }
}

async function cartRequest(path: string, options: RequestInit = {}) {
    const response = await fetch(path, {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN':
                document
                    .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
                    ?.getAttribute('content') ?? '',
            ...(options.headers ?? {}),
        },
        ...options,
    });

    const payload = await response.json().catch(() => ({}));

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

        throw new Error(payload.message ?? 'Cart request failed.');
    }

    return payload;
}

function applyCampaignPricing(products: Product[], campaigns: Campaign[]) {
    const campaignByProductId = new Map<number, Campaign>();

    campaigns.forEach((campaign) => {
        campaignByProductId.set(campaign.product_id, campaign);
    });

    return products.map((product) => {
        const campaign = campaignByProductId.get(product.id);

        if (!campaign) {
            return product;
        }

        const originalPrice = product.originalPrice ?? product.price;
        const discountPercent = Number(campaign.price);
        const discountedPrice = Math.max(
            originalPrice * (1 - discountPercent / 100),
            0,
        );

        return {
            ...product,
            price: Number(discountedPrice.toFixed(2)),
            originalPrice,
            discountPercent,
            tag: 'SALE',
        };
    });
}
