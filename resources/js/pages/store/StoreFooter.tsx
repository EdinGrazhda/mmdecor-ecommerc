
import { Phone } from 'lucide-react';
import { memo } from 'react';

const FOOTER_COLUMNS = [
    {
        title: 'Shop',
        links: [
            'Engine Parts',
            'Brake Systems',
            'Suspension',
            'Electrical',
            'All Parts',
        ],
    },
    {
        title: 'Support',
        links: [
            'FAQ',
            'Shipping Info',
            'Returns Policy',
            'Contact Us',
            'Live Chat',
        ],
    },
    {
        title: 'Orders',
        links: ['Track Order', 'Returns', 'Warranty Claims', 'Bulk Orders'],
    },
];

export const StoreFooter = memo(function StoreFooter() {
    return (
        <footer className="border-t border-[#E2EEF4] bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
                    {/* Brand column */}
                    <div className="col-span-2 space-y-4">
                        <img
                            src="/images/mmdecor.png"
                            alt="MMDECOR Auto Car Decor"
                            className="h-12 w-auto"
                        />
                        <p className="max-w-xs text-sm leading-relaxed text-[#0D2535]/45">
                            Your trusted source for OEM and performance car
                            parts. Fast shipping, genuine quality.
                        </p>
                        <a
                            href="tel:+18005551234"
                            className="flex items-center gap-1.5 text-sm font-semibold text-[#0D2535]/55 transition-colors hover:text-[#2E6F8F]"
                        >
                            <Phone size={13} /> 1-800-555-1234
                        </a>
                    </div>

                    {/* Link columns */}
                    {FOOTER_COLUMNS.map((col) => (
                        <div key={col.title} className="space-y-3">
                            <h4 className="text-[11px] font-black tracking-[0.2em] text-[#0D2535] uppercase">
                                {col.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="inline-flex items-center text-sm text-[#0D2535]/45 transition-all hover:translate-x-0.5 hover:text-[#2E6F8F]"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#E2EEF4] pt-8 sm:flex-row">
                    <p className="text-xs text-[#0D2535]/35">
                        © 2026 AutoParts. All rights reserved.
                    </p>
                    <div className="flex gap-5">
                        {['Privacy', 'Terms', 'Cookies'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-xs text-[#0D2535]/35 hover:text-[#2E6F8F]"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
});
