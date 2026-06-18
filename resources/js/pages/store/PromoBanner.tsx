import { Award, HeadphonesIcon, RotateCcw, Truck } from 'lucide-react';
import { memo } from 'react';

const TRUST_PILLARS = [
    {
        icon: Award,
        title: 'Genuine Parts',
        desc: 'Every part is OEM or OE-quality. No counterfeits, no compromises.',
    },
    {
        icon: Truck,
        title: 'Fast Shipping',
        desc: 'Same-day dispatch on orders placed before 2 PM. Free over $75.',
    },
    {
        icon: RotateCcw,
        title: 'Easy Returns',
        desc: '60-day hassle-free returns. No questions asked, no hidden fees.',
    },
    {
        icon: HeadphonesIcon,
        title: 'Expert Support',
        desc: 'Real specialists available by phone or chat to help you find the right part.',
    },
];

export const PromoBanner = memo(function PromoBanner() {
    return (
        <section className="relative overflow-hidden bg-[#0D2535] py-14">
            <div className="promo-stripe-pattern pointer-events-none absolute inset-0 opacity-[0.04]" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="mb-10 text-center">
                    <p className="mb-1.5 text-[11px] font-black tracking-[0.3em] text-[#5AAFD4] uppercase">
                        Why Choose Us
                    </p>
                    <h3 className="text-2xl font-black text-white lg:text-3xl">
                        The MMDECOR{' '}
                        <span className="text-[#2E6F8F]">Difference</span>
                    </h3>
                </div>

                {/* 4-column grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {TRUST_PILLARS.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="group flex flex-col items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.04] p-6 transition-all duration-300 hover:border-[#2E6F8F]/50 hover:bg-white/[0.07]"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2E6F8F]/25 ring-1 ring-[#2E6F8F]/30 transition-colors group-hover:bg-[#2E6F8F]/40">
                                <Icon size={20} className="text-[#5AAFD4]" />
                            </div>
                            <div>
                                <p className="mb-1 text-[14px] font-black text-white">
                                    {title}
                                </p>
                                <p className="text-[13px] leading-relaxed text-white/45">
                                    {desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});
