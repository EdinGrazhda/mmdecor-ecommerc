import { memo, useState } from 'react';
import { ChevronRight, Wrench } from 'lucide-react';
import { normalizeImageUrl } from '@/lib/media';
import { HERO_SLIDES } from './data';
import { StarRating } from './StarRating';
import type { Banner, Campaign, Product } from './types';

interface HeroCarouselProps {
    banners?: Banner[];
    campaigns?: Campaign[];
    products?: Product[];
    onAddToCart: (product: Product) => void;
}

export const HeroCarousel = memo(function HeroCarousel({
    banners = [],
    campaigns = [],
    products = [],
    onAddToCart,
}: HeroCarouselProps) {
    const slides = buildSlides(
        Array.isArray(banners) ? banners : [],
        Array.isArray(campaigns) ? campaigns : [],
        Array.isArray(products) ? products : [],
    );
    const [slide, setSlide] = useState(0);
    const current = slides[slide] ?? slides[0];

    return (
        <section className="relative overflow-hidden bg-[#0D2535]">
            {/* Grid texture */}
            <div className="hero-grid-pattern pointer-events-none absolute inset-0 opacity-[0.035]" />
            {/* Blue accent stripe */}
            <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#2E6F8F]" />

            <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-5 py-8 sm:px-6 sm:py-12 lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:py-16">
                {/* ── LEFT: text block ── */}
                <div className="flex-1 space-y-5">
                    {/* Eyebrow badge */}
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#2E6F8F]/40 bg-[#2E6F8F]/15 px-3 py-1 text-[11px] font-black tracking-widest text-[#7EC4DF] uppercase">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4AAFD4]" />
                        {current.eyebrow}
                    </span>

                    {/* Headline */}
                    <h1
                        className="text-3xl leading-[1.05] font-black tracking-tight text-white sm:text-4xl lg:text-[clamp(2.4rem,4vw,3.8rem)]"
                        style={{ whiteSpace: 'pre-line' }}
                    >
                        {current.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-sm text-sm leading-relaxed text-white/50 sm:text-[15px]">
                        {current.sub}
                    </p>

                    {/* Starting price strip */}
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold tracking-wide text-white/40 uppercase">
                            Starting from
                        </span>
                        <span className="text-base font-black text-white">
                            ${current.featured.price.toFixed(2)}
                        </span>
                        <span className="text-[12px] text-white/30 line-through">
                            ${current.featured.originalPrice.toFixed(2)}
                        </span>
                        <span className="rounded bg-red-500 px-1.5 py-px text-[10px] font-black text-white">
                            −{current.featured.discountPct}%
                        </span>
                    </div>

                    {/* Category quick chips */}
                    <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                        {current.chips.map((chip, i) => (
                            <button
                                key={i}
                                className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/65 transition-all hover:border-[#5AAFD4]/50 hover:bg-[#2E6F8F]/25 hover:text-white"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            className="group/btn flex items-center gap-2 rounded-lg bg-[#2E6F8F] px-6 py-3 text-sm font-black tracking-wide text-white transition-all hover:bg-[#3A86AB] active:scale-95"
                            onClick={() => current.featured.product && onAddToCart(current.featured.product)}
                        >
                            {current.cta}
                            <ChevronRight
                                size={14}
                                className="transition-transform group-hover/btn:translate-x-1"
                            />
                        </button>
                        <button className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white/65 transition-colors hover:border-white/45 hover:text-white">
                            {current.ctaAlt}
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: featured product card ── */}
                <div className="mx-auto mt-8 w-full max-w-xs lg:mx-0 lg:mt-0 lg:w-[280px] lg:shrink-0 xl:w-[296px]">
                    <div className="group relative rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.085]">
                        {/* Discount corner badge */}
                        <div className="absolute -top-3 -right-3 flex h-12 w-12 flex-col items-center justify-center rounded-full bg-red-500 shadow-lg ring-2 ring-[#0D2535]">
                            <span className="text-[11px] leading-none font-black text-white">
                                −{current.featured.discountPct}%
                            </span>
                            <span className="text-[8px] font-bold tracking-wide text-red-200 uppercase">
                                off
                            </span>
                        </div>

                        {/* Image area */}
                        <div className="relative mb-4 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#163345] to-[#1e5470]">
                            <div className="hero-product-pattern pointer-events-none absolute inset-0 opacity-[0.25]" />
                            {current.featured.image ? (
                                <img
                                    src={normalizeImageUrl(
                                        current.featured.image,
                                    ) ?? undefined}
                                    alt={current.featured.name}
                                    loading="eager"
                                    fetchPriority="high"
                                    decoding="async"
                                    className="relative h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-105">
                                    <Wrench
                                        size={26}
                                        className="text-white/50"
                                    />
                                </div>
                            )}
                            <span className="absolute right-2.5 bottom-2 text-[9px] font-black tracking-[0.18em] text-white/20 uppercase select-none">
                                {current.featured.brand}
                            </span>
                        </div>

                        {/* Brand + stock */}
                        <div className="mb-2 flex items-center justify-between">
                            <span className="rounded bg-[#2E6F8F]/50 px-2 py-px text-[10px] font-black tracking-wider text-[#7EC4DF] uppercase">
                                {current.featured.brand}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                In Stock
                            </span>
                        </div>

                        {/* Name */}
                        <p className="mb-0.5 text-[13px] leading-snug font-bold text-white">
                            {current.featured.name}
                        </p>

                        {/* Fitment */}
                        <p className="mb-2.5 text-[11px] text-white/35">
                            {current.featured.fitment}
                        </p>

                        {/* Rating */}
                        <div className="mb-3 flex items-center gap-1">
                            <StarRating
                                rating={current.featured.rating}
                                variant="amber"
                                size={11}
                            />
                            <span className="ml-1 text-[11px] font-bold text-white/55">
                                {current.featured.rating}
                            </span>
                            <span className="text-[11px] text-white/30">
                                ({current.featured.reviews.toLocaleString()})
                            </span>
                        </div>

                        {/* Price row */}
                        <div className="mb-4 flex items-end gap-2 border-t border-white/10 pt-3">
                            <span className="text-2xl font-black text-white">
                                ${current.featured.price.toFixed(2)}
                            </span>
                            <span className="mb-0.5 text-sm text-white/30 line-through">
                                ${current.featured.originalPrice.toFixed(2)}
                            </span>
                            <span className="mb-0.5 ml-auto rounded bg-emerald-600/70 px-1.5 py-px text-[10px] font-black text-emerald-200">
                                SAVE $
                                {(
                                    current.featured.originalPrice -
                                    current.featured.price
                                ).toFixed(0)}
                            </span>
                        </div>

                        {/* Add to Cart */}
                        <button
                            className="mb-2 w-full rounded-lg bg-[#2E6F8F] py-2.5 text-sm font-black text-white transition-all hover:bg-[#3A86AB] active:scale-[0.98]"
                            onClick={() => current.featured.product && onAddToCart(current.featured.product)}
                        >
                            Add to Cart
                        </button>

                        {/* View Details */}
                        <button className="w-full rounded-lg border border-white/15 py-2 text-[12px] font-semibold text-white/50 transition-colors hover:border-white/30 hover:text-white/80">
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Slide indicators */}
            <div className="flex flex-wrap items-center justify-center gap-2 px-4 pb-6">
                {slides.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setSlide(i)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-300 ${
                            i === slide
                                ? 'bg-[#2E6F8F] text-white shadow-md'
                                : 'border border-white/15 text-white/40 hover:border-white/30 hover:text-white/65'
                        }`}
                    >
                        <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${i === slide ? 'bg-white' : 'bg-white/30'}`}
                        />
                        {s.slideLabel}
                    </button>
                ))}
            </div>
        </section>
    );
});

type HeroFeatured = {
    product?: Product;
    name: string;
    brand: string;
    image?: string | null;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    fitment: string;
    discountPct: number;
};

type HeroDisplaySlide = {
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    ctaAlt: string;
    chips: string[];
    slideLabel: string;
    featured: HeroFeatured;
};

function buildSlides(
    banners: Banner[],
    campaigns: Campaign[],
    products: Product[],
): HeroDisplaySlide[] {
    const campaignSlides = campaigns
        .filter((campaign) => campaign.product)
        .slice(0, 3)
        .map((campaign) => {
            const product = campaign.product as Product;
            const originalPrice = product.originalPrice ?? product.price;

            return {
                eyebrow: `${campaign.price}% off active campaign`,
                title: campaign.campaing_name,
                sub: campaign.description,
                cta: 'Shop Campaign',
                ctaAlt: 'Browse All Parts',
                chips: [product.category, product.brand, 'In Stock'].filter(
                    Boolean,
                ),
                slideLabel: campaign.campaing_name,
                featured: toFeaturedProduct(product, originalPrice),
            };
        });

    if (banners.length > 0) {
        return banners.slice(0, 3).map((banner, index) => {
            const product = products[index % Math.max(products.length, 1)];
            const fallback = HERO_SLIDES[index % HERO_SLIDES.length];

            return {
                eyebrow: 'Featured Store Banner',
                title: banner.title,
                sub: banner.subtitle,
                cta: 'Shop Now',
                ctaAlt: 'Browse All Parts',
                chips: products.slice(0, 4).map((item) => item.category),
                slideLabel: banner.title,
                featured: product
                    ? {
                          ...toFeaturedProduct(
                              product,
                              product.originalPrice ?? product.price,
                          ),
                          image: banner.image ?? product.image,
                      }
                    : {
                          ...fallback.featured,
                          image: banner.image,
                      },
            };
        });
    }

    if (campaignSlides.length > 0) {
        return campaignSlides;
    }

    if (products.length > 0) {
        return products.slice(0, 3).map((product) => ({
            eyebrow: product.tag ? `${product.tag} product` : 'Latest product',
            title: product.name,
            sub: `Browse ${product.category.toLowerCase()} from ${product.brand}.`,
            cta: 'Add Featured Product',
            ctaAlt: 'Browse All Parts',
            chips: [product.category, product.brand, 'In Stock'].filter(
                Boolean,
            ),
            slideLabel: product.category,
            featured: toFeaturedProduct(
                product,
                product.originalPrice ?? product.price,
            ),
        }));
    }

    return HERO_SLIDES;
}

function toFeaturedProduct(
    product: Product,
    originalPrice: number,
): HeroFeatured {
    return {
        name: product.name,
        product,
        brand: product.brand,
        image: product.image,
        price: product.price,
        originalPrice,
        rating: product.rating,
        reviews: product.reviews,
        fitment: product.category,
        discountPct:
            originalPrice > product.price
                ? Math.round((1 - product.price / originalPrice) * 100)
                : 0,
    };
}
