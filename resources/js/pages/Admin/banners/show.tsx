import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit2, Image } from 'lucide-react';

interface Banner {
    id: number;
    title: string;
    subtitle: string;
    image: string | null;
}

interface ShowProps {
    banner: Banner;
}

export default function Show({ banner }: ShowProps) {
    return (
        <>
            <Head title={`Admin - ${banner.title}`} />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 border-b border-[#D1E8F2]/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/banners"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">
                                {banner.title}
                            </h1>
                            <p className="mt-1 text-sm text-[#0D2535]/50">
                                Banner preview and details.
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/admin/banners/${banner.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E6F8F] px-4 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E5A7A] hover:shadow-md active:translate-y-0"
                    >
                        <Edit2 size={16} />
                        Edit Banner
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#2E6F8F]/15 bg-white shadow-sm">
                    {banner.image ? (
                        <img
                            src={normalizeImageUrl(banner.image)}
                            alt={banner.title}
                            className="h-72 w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-72 w-full items-center justify-center bg-[#F7FAFB] text-[#2E6F8F]/40">
                            <Image size={40} />
                        </div>
                    )}
                    <div className="space-y-3 p-6">
                        <h2 className="text-xl font-black text-[#0D2535]">
                            {banner.title}
                        </h2>
                        <p className="text-sm leading-relaxed text-[#0D2535]/60">
                            {banner.subtitle}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

function normalizeImageUrl(image: string) {
    if (/^(https?:)?\/\//.test(image) || image.startsWith('/')) {
        return image;
    }

    return `/storage/${image}`;
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Banners', href: '/admin/banners' },
        { title: 'Details', href: '#' },
    ],
};
