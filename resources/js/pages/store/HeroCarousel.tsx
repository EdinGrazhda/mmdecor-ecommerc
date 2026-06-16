import { useState } from 'react';
import { ChevronRight, Wrench } from 'lucide-react';
import { HERO_SLIDES } from './data';
import { StarRating } from './StarRating';

interface HeroCarouselProps {
    onAddToCart: () => void;
}

export function HeroCarousel({ onAddToCart }: HeroCarouselProps) {
    const [slide, setSlide] = useState(0);
    const current = HERO_SLIDES[slide];

    return (
        <section className="relative overflow-hidden bg-[#0D2535]">
            {/* Grid texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                    backgroundSize: '52px 52px',
                }}
            />
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
                        {current.chips.map((chip) => (
                            <button
                                key={chip}
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
                            onClick={onAddToCart}
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
                            <div
                                className="pointer-events-none absolute inset-0 opacity-[0.25]"
                                style={{
                                    backgroundImage:
                                        'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
                                    backgroundSize: '9px 9px',
                                }}
                            />
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-105">
                                <Wrench size={26} className="text-white/50" />
                            </div>
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
                            onClick={onAddToCart}
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
                {HERO_SLIDES.map((s, i) => (
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
}
