import { memo, useCallback, useMemo, useState } from 'react';
import { ChevronRight, Heart, Search, ShoppingCart, X } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { normalizeImageUrl } from '@/lib/media';
import { CATEGORIES, PRODUCTS } from './data';
import { TagBadge } from './TagBadge';
import { StarRating } from './StarRating';
import type { Category, Product } from './types';

interface CatalogSectionProps {
    categories?: Category[];
    products?: Product[];
    catSidebarOpen: boolean;
    setCatSidebarOpen: (open: boolean) => void;
    onAddToCart: (product: Product) => void;
}

export function CatalogSection({
    categories = CATEGORIES,
    products = PRODUCTS,
    catSidebarOpen,
    setCatSidebarOpen,
    onAddToCart,
}: CatalogSectionProps) {
    const categoryItems = Array.isArray(categories) ? categories : CATEGORIES;
    const productItems = Array.isArray(products) ? products : PRODUCTS;
    const [activeCategoryId, setActiveCategoryId] = useState(0);
    const [sortBy, setSortBy] = useState('featured');
    const [wishlist, setWishlist] = useState<number[]>([]);

    const activeCategory = useMemo(
        () => categoryItems.find((c) => c.id === activeCategoryId),
        [activeCategoryId, categoryItems],
    );

    const visibleProducts = useMemo(() => {
        let list =
            activeCategoryId === 0
                ? productItems
                : productItems.filter(
                      (p) => p.category === activeCategory?.label,
                  );
        if (sortBy === 'price-asc')
            list = [...list].sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc')
            list = [...list].sort((a, b) => b.price - a.price);
        if (sortBy === 'rating')
            list = [...list].sort((a, b) => b.rating - a.rating);
        return list;
    }, [activeCategory?.label, activeCategoryId, productItems, sortBy]);

    const wishlistSet = useMemo(() => new Set(wishlist), [wishlist]);

    const toggleWishlist = useCallback((id: number) => {
        setWishlist((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    }, []);

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex gap-6">
                {/* Mobile overlay */}
                {catSidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                        onClick={() => setCatSidebarOpen(false)}
                    />
                )}

                {/* Category sidebar */}
                <aside
                    className={`fixed top-0 left-0 z-40 h-full w-64 overflow-y-auto bg-[#2E6F8F] pt-6 pb-8 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:sticky lg:top-20 lg:z-auto lg:h-fit lg:w-52 lg:shrink-0 lg:translate-x-0 lg:rounded-xl lg:shadow-none ${
                        catSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {/* Mobile close button */}
                    <div className="flex items-center justify-between border-b border-white/15 px-5 pb-4 lg:hidden">
                        <span className="text-sm font-black tracking-wider text-white uppercase">
                            Categories
                        </span>
                        <button
                            onClick={() => setCatSidebarOpen(false)}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Desktop heading */}
                    <p className="hidden px-5 pt-1 pb-3 text-[11px] font-black tracking-[0.2em] text-white/60 uppercase lg:block">
                        Categories
                    </p>

                    <ul className="mt-2 lg:mt-0">
                        {categoryItems.map((cat) => (
                            <li key={cat.id}>
                                <button
                                    onClick={() => {
                                        setActiveCategoryId(cat.id);
                                        setCatSidebarOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between border-l-[3px] px-5 py-3 text-sm transition-all ${
                                        activeCategoryId === cat.id
                                            ? 'border-l-white bg-white/20 font-black text-white'
                                            : 'border-l-transparent font-semibold text-white/70 hover:border-l-white/30 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <span>{cat.label}</span>
                                    <span
                                        className={`text-[11px] ${activeCategoryId === cat.id ? 'text-white/80' : 'text-white/40'}`}
                                    >
                                        {cat.count.toLocaleString()}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Products column */}
                <div className="min-w-0 flex-1">
                    {/* Header row */}
                    <div className="mb-5 flex items-center justify-between gap-2">
                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-black text-[#0D2535] sm:text-xl">
                                <span className="h-5 w-[3px] shrink-0 rounded-full bg-[#2E6F8F]" />
                                {activeCategory?.label ?? 'All Parts'}
                            </h2>
                            <p className="mt-0.5 pl-[11px] text-xs text-[#0D2535]/40">
                                {visibleProducts.length} parts found
                            </p>
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="cursor-pointer rounded-lg border border-[#D1E8F2] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0D2535] transition-colors hover:border-[#2E6F8F]/50 focus:border-[#2E6F8F] focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-asc">Price ↑</option>
                            <option value="price-desc">Price ↓</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>

                    {/* Empty state */}
                    {visibleProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#D1E8F2] bg-white/70 py-20 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF3F7]">
                                <Search
                                    size={22}
                                    className="text-[#2E6F8F]/50"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-[#0D2535]/55">
                                    No parts in this category yet
                                </p>
                                <p className="mt-1 text-sm text-[#0D2535]/35">
                                    Try browsing a different category
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveCategoryId(0)}
                                className="flex items-center gap-1.5 rounded-full border border-[#2E6F8F]/30 px-5 py-2 text-sm font-bold text-[#2E6F8F] transition-all hover:border-[#2E6F8F] hover:bg-[#EBF3F7]"
                            >
                                View all parts <ChevronRight size={13} />
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                            {visibleProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    isWishlisted={wishlistSet.has(p.id)}
                                    onAddToCart={onAddToCart}
                                    onToggleWishlist={toggleWishlist}
                                />
                            ))}
                        </div>
                    )}

                    {/* Load more */}
                    {visibleProducts.length > 0 && (
                        <div className="mt-10 flex justify-center">
                            <button className="group flex items-center gap-2 rounded-full border border-[#D1E8F2] bg-white px-8 py-3 text-sm font-bold text-[#2E6F8F] transition-all hover:border-[#2E6F8F] hover:bg-[#EBF3F7] active:scale-95">
                                <span>Load More Parts</span>
                                <ChevronRight
                                    size={14}
                                    className="transition-transform group-hover:translate-x-0.5"
                                />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

interface ProductCardProps {
    product: Product;
    isWishlisted: boolean;
    onAddToCart: (product: Product) => void;
    onToggleWishlist: (id: number) => void;
}

const ProductCard = memo(function ProductCard({
    product,
    isWishlisted,
    onAddToCart,
    onToggleWishlist,
}: ProductCardProps) {
    const discountPct =
        product.discountPercent ??
        (product.originalPrice
            ? Math.round((1 - product.price / product.originalPrice) * 100)
            : null);
    const originalPrice = product.originalPrice;
    const isOnSale =
        product.tag === 'SALE' && originalPrice !== null && discountPct !== null;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#2E6F8F]/20 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#2E6F8F]/55 hover:shadow-[0_12px_40px_-8px_rgba(46,111,143,0.18)]">
            {/* Clickable area — image + info (not the action buttons) */}
            <Link
                href={`/products/${product.id}`}
                className="flex flex-col"
                aria-label={`View ${product.name}`}
            >
            <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-[#EBF3F7] to-[#D0E8F2] sm:h-48">
                <div className="catalog-product-pattern pointer-events-none absolute inset-0 opacity-[0.35]" />
                <span className="pointer-events-none absolute right-2 bottom-2 text-[9px] font-black tracking-widest text-[#2E6F8F]/20 uppercase select-none">
                    #{String(product.id).padStart(4, '0')}
                </span>
                {product.image ? (
                    <img
                        src={normalizeImageUrl(product.image) ?? undefined}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="relative h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#2E6F8F]/10 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20 sm:rounded-2xl">
                        <ShoppingCart
                            size={20}
                            className="text-[#2E6F8F]/30 sm:hidden"
                        />
                        <ShoppingCart
                            size={26}
                            className="hidden text-[#2E6F8F]/30 sm:block"
                        />
                    </div>
                )}
                {product.tag && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <TagBadge tag={product.tag} />
                    </div>
                )}
                {isOnSale && (
                    <div className="absolute right-2 bottom-2 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-black text-white shadow-md sm:right-3 sm:bottom-3">
                        -{discountPct}%
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-3 sm:p-4">
                <div className="mb-1 flex items-center justify-between gap-1">
                    <p className="text-[9px] font-black tracking-widest text-[#2E6F8F] uppercase sm:text-[10px]">
                        {product.brand}
                    </p>
                    <p className="truncate text-[9px] text-[#0D2535]/30 sm:text-[10px]">
                        {product.category}
                    </p>
                </div>

                <p className="mb-1.5 line-clamp-2 text-[12px] leading-snug font-bold text-[#0D2535] sm:mb-2 sm:text-[13px]">
                    {product.name}
                </p>

                <div className="mb-2 flex items-center gap-1 sm:mb-3 sm:gap-1.5">
                    <StarRating rating={product.rating} />
                    <span className="text-[10px] text-[#0D2535]/35 sm:text-[11px]">
                        ({product.reviews})
                    </span>
                </div>

                <p className="mb-3 hidden text-[11px] leading-relaxed text-[#0D2535]/40 sm:block">
                    Compatible with most {product.category.toLowerCase()}{' '}
                    applications.
                </p>
            </div>
            </Link>

            {/* Action row — outside the Link so buttons don't trigger navigation */}
            <div className="flex items-center justify-between border-t border-[#F0F7FB] px-3 py-2.5 sm:px-4 sm:pt-3">
                <div className="min-w-0">
                    <span
                        className={`text-sm font-black sm:text-base ${
                            isOnSale ? 'text-red-500' : 'text-[#0D2535]'
                        }`}
                    >
                        ${product.price.toFixed(2)}
                    </span>
                    {isOnSale && (
                        <span className="ml-1.5 text-[11px] font-bold text-[#0D2535]/35 line-through sm:text-xs">
                            ${originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EBF3F7] shadow-sm transition-all hover:scale-110 active:scale-90"
                    >
                        <Heart
                            size={11}
                            className={`transition-transform ${
                                isWishlisted
                                    ? 'scale-110 fill-red-500 text-red-500'
                                    : 'text-[#0D2535]/30'
                            }`}
                        />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                        className="flex shrink-0 items-center gap-1 rounded-full bg-[#2E6F8F] px-2.5 py-1.5 text-[10px] font-black text-white transition-all hover:bg-[#1E5A7A] active:scale-90 sm:gap-1.5 sm:px-3 sm:text-[11px]"
                    >
                        <ShoppingCart size={10} />
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
});
