import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, MessageCircle, Package, ShoppingCart, Star, Tag, XCircle } from 'lucide-react';
import { normalizeImageUrl } from '@/lib/media';
import { useMemo, useState } from 'react';
import type { Product } from './types';
import { StoreNavbar } from './StoreNavbar';
import { StoreFooter } from './StoreFooter';
import { CartProvider, useCart } from './CartContext';

interface ProductShowProps {
    product: Product | { data: Product };
    whatsappPhone?: string;
}

interface ProductShowContentProps {
    product: Product;
    whatsappPhone?: string;
}

function toFiniteNumber(value: number | string | null | undefined): number | null {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
}

function formatCurrency(value: number | string | null | undefined): string {
    const numericValue = toFiniteNumber(value);
    return (numericValue ?? 0).toFixed(2);
}

function toAbsoluteUrl(url: string | null | undefined): string | undefined {
    if (!url) {
        return undefined;
    }

    if (/^https?:\/\//.test(url)) {
        return url;
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

function buildWhatsAppUrl(phone: string, product: Product, pageUrl: string): string {
    const productName = product.name ?? 'Product';
    const categoryName = product.category ?? 'Uncategorized';
    const price = formatCurrency(product.price);
    const sku = product.product_id ? ` (SKU: ${product.product_id})` : '—';

    const message =
        `Hi MMDECOR! I am interested in this product:\n\n` +
        `*Product:* ${productName}\n` +
        `*Price:* $${price}\n` +
        `*Category:* ${categoryName}\n` +
        `*SKU:* ${sku}\n\n` +
        `*Product Link:* ${pageUrl}`;

    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export default function ProductShow({ product, whatsappPhone }: ProductShowProps) {
    const resolvedProduct = 'data' in product ? product.data : product;

    return (
        <CartProvider>
            <ProductShowContent product={resolvedProduct} whatsappPhone={whatsappPhone} />
        </CartProvider>
    );
}

function ProductShowContent({ product, whatsappPhone }: ProductShowContentProps) {
    const { cartCount, setCartOpen, handleAddToCart, cartBusy } = useCart();

    const productName = product.name ?? 'Product';
    const categoryName = product.category ?? 'Uncategorized';
    const categoryLowerName = categoryName.toLowerCase();
    const brandName = product.brand ?? '—';
    const priceValue = toFiniteNumber(product.price) ?? 0;
    const originalPriceValue = toFiniteNumber(product.originalPrice);
    const imageGallery = useMemo(() => {
        const gallery = product.images?.length
            ? product.images
            : product.image
                ? [{ url: product.image, thumb: product.image }]
                : [];

        return gallery
            .map((image) => ({
                url: normalizeImageUrl(image.url) ?? undefined,
                thumb: normalizeImageUrl(image.thumb) ?? normalizeImageUrl(image.url) ?? undefined,
            }))
            .filter((image): image is { url: string; thumb: string } => Boolean(image.url && image.thumb));
    }, [product.image, product.images]);
    const [selectedImageUrl, setSelectedImageUrl] = useState(() => imageGallery[0]?.url);
    const imageUrl = selectedImageUrl ?? imageGallery[0]?.url;
    const absoluteImageUrl = toAbsoluteUrl(imageGallery[0]?.url);
    const isInStock = (product.stock ?? 0) > 0;
    const isOnSale =
        product.tag === 'SALE' &&
        originalPriceValue !== null &&
        product.discountPercent !== null;

    const discountPct =
        product.discountPercent ??
        (originalPriceValue
            ? Math.round((1 - priceValue / originalPriceValue) * 100)
            : null);

    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const whatsappUrl =
        whatsappPhone
            ? buildWhatsAppUrl(whatsappPhone, product, pageUrl)
            : null;

    return (
        <>
            <Head>
                <title>{productName}</title>
                <meta name="description" content={`Compatible with most ${categoryLowerName} applications. High-quality part with guaranteed fitment.`} />
                <meta property="og:title" content={productName} />
                <meta property="og:description" content={`Interested in ${productName}? Price: $${formatCurrency(priceValue)}. Category: ${categoryName}.`} />
                {absoluteImageUrl && <meta property="og:image" content={absoluteImageUrl} />}
                <meta property="og:type" content="product" />
                <meta property="og:url" content={pageUrl} />
            </Head>

            <StoreNavbar
                cartCount={cartCount}
                onCartClick={() => setCartOpen(true)}
                onMenuClick={() => router.visit('/')}
            />

            {/* Main */}
            <main className="min-h-screen bg-[#F5FAFE] pb-24">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

                    {/* Breadcrumb & Back Link */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <nav className="flex items-center gap-2 text-xs text-[#0D2535]/40">
                            <Link href="/" className="hover:text-[#2E6F8F]">Home</Link>
                            <span>/</span>
                            <span className="text-[#2E6F8F]">{categoryName}</span>
                            <span>/</span>
                            <span className="truncate font-medium text-[#0D2535]/70">{productName}</span>
                        </nav>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#2E6F8F] transition hover:text-[#1E5A7A] self-start"
                        >
                            <ArrowLeft size={16} />
                            Back to store
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                        {/* ── Image panel ── */}
                        <div className="relative overflow-hidden rounded-2xl border border-[#D1E8F2] bg-gradient-to-br from-[#EBF3F7] to-[#D0E8F2] shadow-sm">
                            {/* Discount badge */}
                            {isOnSale && discountPct && (
                                <div className="absolute top-4 left-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-black text-white shadow">
                                    -{discountPct}%
                                </div>
                            )}
                            {/* Tag badge */}
                            {product.tag && product.tag !== 'SALE' && (
                                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-[#2E6F8F] px-3 py-1 text-[10px] font-black tracking-wider text-white shadow">
                                    <Tag size={9} />
                                    {product.tag}
                                </div>
                            )}

                            {imageUrl ? (
                                <>
                                    <img
                                        src={imageUrl}
                                        alt={productName}
                                        className="aspect-square w-full object-cover"
                                    />
                                    {imageGallery.length > 1 && (
                                        <div className="grid grid-cols-4 gap-2 border-t border-[#D1E8F2] bg-white p-2">
                                            {imageGallery.map((image, index) => (
                                                <button
                                                    key={`${image.thumb}-${index}`}
                                                    type="button"
                                                    onClick={() => setSelectedImageUrl(image.url)}
                                                    className={`aspect-square overflow-hidden rounded-lg border-2 bg-[#F5FAFE] transition ${
                                                        imageUrl === image.url ? 'border-[#2E6F8F]' : 'border-transparent hover:border-[#D1E8F2]'
                                                    }`}
                                                    aria-label={`Show product image ${index + 1}`}
                                                >
                                                    <img
                                                        src={image.thumb}
                                                        alt={`${productName} thumbnail ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex aspect-square w-full items-center justify-center">
                                    <ShoppingCart size={64} className="text-[#2E6F8F]/20" />
                                </div>
                            )}
                        </div>

                        {/* ── Info panel ── */}
                        <div className="flex flex-col gap-5">

                            {/* Category + brand */}
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[#EBF3F7] px-3 py-1 text-[11px] font-black tracking-widest text-[#2E6F8F] uppercase">
                                    {categoryName}
                                </span>
                                {product.brand && (
                                    <span className="rounded-full bg-[#F0F7FB] px-3 py-1 text-[11px] font-semibold text-[#0D2535]/50">
                                        {brandName}
                                    </span>
                                )}
                            </div>

                            {/* Name */}
                            <h1 className="text-2xl font-black leading-tight text-[#0D2535] sm:text-3xl">
                                {productName}
                            </h1>

                            {/* SKU */}
                            {product.product_id && (
                                <p className="text-xs font-semibold text-[#0D2535]/35 uppercase tracking-wider">
                                    SKU: {product.product_id}
                                </p>
                            )}

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={
                                                i < Math.round(product.rating ?? 0)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-[#D1E8F2]'
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-[#0D2535]/40">
                                    {(product.rating ?? 0).toFixed(1)} ({product.reviews} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 rounded-xl bg-white p-4 shadow-sm border border-[#EBF3F7]">
                                <span
                                    className={`text-3xl font-black sm:text-4xl ${
                                        isOnSale ? 'text-red-500' : 'text-[#0D2535]'
                                    }`}
                                >
                                    ${formatCurrency(priceValue)}
                                </span>
                                {isOnSale && originalPriceValue !== null && (
                                    <span className="text-lg font-bold text-[#0D2535]/30 line-through">
                                        ${formatCurrency(originalPriceValue)}
                                    </span>
                                )}
                            </div>

                            {/* Stock */}
                            <div className="flex items-center gap-2">
                                {isInStock ? (
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-sm font-semibold text-emerald-600">
                                            In Stock
                                            {product.stock !== undefined && (
                                                <span className="ml-1 font-normal text-[#0D2535]/40">
                                                    ({product.stock} units available)
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <XCircle size={16} className="text-red-400" />
                                        <span className="text-sm font-semibold text-red-500">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Description placeholder */}
                            <p className="text-sm leading-relaxed text-[#0D2535]/55">
                                Compatible with most {categoryLowerName} applications.
                                High-quality part with guaranteed fitment. Contact us via WhatsApp
                                for compatibility questions before ordering.
                            </p>

                            {/* CTA buttons */}
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={() => void handleAddToCart(product)}
                                    disabled={cartBusy || !isInStock}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2E6F8F] px-6 py-3.5 text-sm font-black text-white shadow transition hover:bg-[#1E5A7A] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <ShoppingCart size={16} />
                                    {cartBusy ? 'Adding…' : 'Add to Cart'}
                                </button>

                                {whatsappUrl && (
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-white px-6 py-3.5 text-sm font-black text-[#25D366] shadow transition hover:bg-[#25D366] hover:text-white active:scale-95"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="h-5 w-5 shrink-0"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Ask on WhatsApp
                                    </a>
                                )}
                            </div>

                            {/* Details table */}
                            <div className="rounded-xl border border-[#EBF3F7] bg-white p-4 shadow-sm">
                                <p className="mb-3 flex items-center gap-1.5 text-[11px] font-black tracking-widest text-[#0D2535]/40 uppercase">
                                    <Package size={11} />
                                    Product Details
                                </p>
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    {[
                                        ['Category', categoryName],
                                        ['Brand', brandName],
                                        ['SKU', product.product_id ?? '—'],
                                        ['Stock', isInStock ? `${product.stock ?? '—'} units` : 'Out of stock'],
                                        ['Price', `$${formatCurrency(priceValue)}`],
                                        ['Condition', 'New'],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex flex-col">
                                            <dt className="text-[11px] font-bold text-[#0D2535]/40 uppercase tracking-wider">{label}</dt>
                                            <dd className="font-semibold text-[#0D2535]">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <StoreFooter />
        </>
    );
}
