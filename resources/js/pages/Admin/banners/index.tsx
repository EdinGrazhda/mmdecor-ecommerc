import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Edit2,
    Image,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Banner {
    id: number;
    title: string;
    subtitle: string;
    image: string | null;
    created_at: string;
}

interface PaginatedBanners {
    data: Banner[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
}

interface IndexProps {
    banners: PaginatedBanners;
    filters: { search?: string };
}

export default function Index({ banners, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/banners', { search }, { preserveState: true });
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this banner?')) {
            router.delete(`/admin/banners/${id}`);
        }
    }

    return (
        <>
            <Head title="Admin - Banners" />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 border-b border-[#D1E8F2]/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black text-[#0D2535] sm:text-3xl">
                            <span className="h-6 w-[3px] rounded-full bg-[#2E6F8F]" />
                            Banners Management
                        </h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Create, update, and manage homepage banners. Total:{' '}
                            {banners.total} banners.
                        </p>
                    </div>
                    <Link
                        href="/admin/banners/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E6F8F] px-4 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E5A7A] hover:shadow-md active:translate-y-0"
                    >
                        <Plus size={16} />
                        Create Banner
                    </Link>
                </div>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <form
                        onSubmit={handleSearch}
                        className="relative max-w-md flex-1"
                    >
                        <input
                            type="text"
                            placeholder="Search banners..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-[#D1E8F2] bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-[#0D2535] placeholder-[#0D2535]/40 transition-colors focus:border-[#2E6F8F] focus:outline-none"
                        />
                        <Search
                            className="absolute top-3 left-3.5 text-[#0D2535]/40"
                            size={16}
                        />
                    </form>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#2E6F8F]/15 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#F0F7FB] bg-[#F7FAFB] text-xs font-black tracking-wider text-[#2E6F8F] uppercase">
                                    <th className="px-6 py-4">Preview</th>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Subtitle</th>
                                    <th className="px-6 py-4 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F7FB] text-sm text-[#0D2535]">
                                {banners.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-10 text-center font-bold text-[#0D2535]/40"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Image
                                                    size={28}
                                                    className="text-[#2E6F8F]/40"
                                                />
                                                No banners found.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    banners.data.map((banner) => (
                                        <tr
                                            key={banner.id}
                                            className="transition-colors hover:bg-[#F7FAFB]/50"
                                        >
                                            <td className="px-6 py-4">
                                                {banner.image ? (
                                                    <img
                                                        src={normalizeImageUrl(
                                                            banner.image,
                                                        )}
                                                        alt={banner.title}
                                                        className="h-14 w-24 rounded-lg border border-[#D1E8F2] object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-14 w-24 items-center justify-center rounded-lg border border-dashed border-[#D1E8F2] bg-[#F7FAFB] text-[#2E6F8F]/40">
                                                        <Image size={20} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                {banner.title}
                                            </td>
                                            <td className="max-w-xs truncate px-6 py-4 text-[#0D2535]/60">
                                                {banner.subtitle}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/admin/banners/${banner.id}/edit`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={13} />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                banner.id,
                                                            )
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-500 transition-all hover:scale-105 hover:bg-red-50 active:scale-95"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {banners.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-[#F0F7FB] bg-[#F7FAFB]/40 px-6 py-4">
                            <span className="text-xs font-semibold text-[#0D2535]/50">
                                Page {banners.current_page} of{' '}
                                {banners.last_page}
                            </span>
                            <div className="flex gap-2">
                                <Link
                                    href={banners.prev_page_url || '#'}
                                    disabled={!banners.prev_page_url}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] bg-white transition-all ${
                                        banners.prev_page_url
                                            ? 'text-[#2E6F8F] hover:bg-[#EBF3F7] active:scale-95'
                                            : 'cursor-not-allowed text-[#0D2535]/20 opacity-50'
                                    }`}
                                >
                                    <ChevronLeft size={16} />
                                </Link>
                                <Link
                                    href={banners.next_page_url || '#'}
                                    disabled={!banners.next_page_url}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] bg-white transition-all ${
                                        banners.next_page_url
                                            ? 'text-[#2E6F8F] hover:bg-[#EBF3F7] active:scale-95'
                                            : 'cursor-not-allowed text-[#0D2535]/20 opacity-50'
                                    }`}
                                >
                                    <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    )}
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

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Banners', href: '/admin/banners' },
    ],
};
