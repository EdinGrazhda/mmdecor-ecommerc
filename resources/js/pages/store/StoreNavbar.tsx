import { Link } from '@inertiajs/react';
import { Menu, Phone, Search, ShoppingCart, Tag } from 'lucide-react';
import { memo } from 'react';

interface StoreNavbarProps {
    cartCount: number;
    onCartClick: () => void;
    onMenuClick: () => void;
}

export const StoreNavbar = memo(function StoreNavbar({
    cartCount,
    onCartClick,
    onMenuClick,
}: StoreNavbarProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-[#E2EEF4] bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                <div className="py-2 lg:hidden">
                    <div className="flex h-11 items-center gap-3">
                        <button
                            type="button"
                            onClick={onMenuClick}
                            className="flex shrink-0 items-center justify-center rounded-lg p-2 text-[#2E6F8F] hover:bg-[#EBF3F7]"
                            aria-label="Open categories"
                        >
                            <Menu size={20} />
                        </button>

                        <Link
                            href="/"
                            className="flex min-w-0 shrink-0 items-center"
                        >
                            <img
                                src="/images/mmdecor.png"
                                alt="MMDECOR Auto Car Decor"
                                className="h-9 w-auto sm:h-10"
                            />
                        </Link>

                        <button
                            type="button"
                            className="relative ml-auto rounded-md p-2 text-[#0D2535]/65 hover:bg-[#EBF3F7] hover:text-[#2E6F8F]"
                            onClick={onCartClick}
                            aria-label="Cart"
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && <CartCount count={cartCount} />}
                        </button>
                    </div>

                    <div className="relative mt-2 flex items-center">
                        <Search
                            size={15}
                            className="pointer-events-none absolute left-4 text-[#0D2535]/35"
                        />
                        <input
                            type="text"
                            placeholder="Search parts, brands or part numbers..."
                            className="w-full rounded-full border border-[#D1E8F2] bg-[#F0F7FB] py-2.5 pr-4 pl-11 text-[13px] text-[#0D2535] transition placeholder:text-[#0D2535]/40 focus:border-[#2E6F8F] focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,111,143,0.1)] focus:outline-none"
                        />
                    </div>
                </div>

                <div className="hidden h-16 items-center gap-5 lg:flex">
                    <Link href="/" className="flex shrink-0 items-center">
                        <img
                            src="/images/mmdecor.png"
                            alt="MMDECOR Auto Car Decor"
                            className="h-12 w-auto"
                        />
                    </Link>

                    <div className="relative flex min-w-0 flex-1 items-center">
                        <Search
                            size={15}
                            className="pointer-events-none absolute left-4 text-[#0D2535]/35"
                        />
                        <input
                            type="text"
                            placeholder="Search parts, brands or part numbers..."
                            className="w-full rounded-full border border-[#D1E8F2] bg-[#F0F7FB] py-2.5 pr-4 pl-11 text-[13px] text-[#0D2535] transition placeholder:text-[#0D2535]/40 focus:border-[#2E6F8F] focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,111,143,0.1)] focus:outline-none"
                        />
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        <a
                            href="#"
                            className="flex items-center gap-1.5 rounded-full bg-red-50 px-3.5 py-1.5 text-[12px] font-black text-red-500 ring-1 ring-red-200 transition-all hover:bg-red-500 hover:text-white hover:ring-red-500"
                        >
                            <Tag size={12} />
                            Today's Deals
                        </a>

                        <div className="mx-1.5 h-5 w-px bg-[#E2EEF4]" />

                        <a
                            href="tel:+18005551234"
                            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold text-[#0D2535]/45 transition-colors hover:bg-[#EBF3F7] hover:text-[#2E6F8F]"
                        >
                            <Phone size={13} />
                            1-800-555-1234
                        </a>

                        <button
                            type="button"
                            className="relative rounded-md p-2 text-[#0D2535]/65 hover:bg-[#EBF3F7] hover:text-[#2E6F8F]"
                            onClick={onCartClick}
                            aria-label="Cart"
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && <CartCount count={cartCount} />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
});

function CartCount({ count }: { count: number }) {
    return (
        <span
            key={count}
            className="animate-cart-pop absolute -top-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#2E6F8F] text-[10px] font-black text-white"
        >
            {count}
        </span>
    );
}
