import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Edit2, Eye, Plus, Search, Trash2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
}

interface Campaign {
    id: number;
    campaign_name: string;
    description: string;
    price: number | string;
    start_date: string;
    end_date: string;
    product_id: number;
    product?: Product | null;
}

interface PaginatedCampaigns {
    data: Campaign[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
}

interface IndexProps {
    campaigns: PaginatedCampaigns;
    filters: { search?: string };
}

export default function Index({ campaigns, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/campaigns', { search }, { preserveState: true });
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this campaign?')) {
            router.delete(`/admin/campaigns/${id}`);
        }
    }

    return (
        <>
            <Head title="Admin - Campaigns" />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 border-b border-[#D1E8F2]/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black text-[#0D2535] sm:text-3xl">
                            <span className="h-6 w-[3px] rounded-full bg-[#2E6F8F]" />
                            Campaigns Management
                        </h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Create, update, and manage promotional campaigns. Total: {campaigns.total} campaigns.
                        </p>
                    </div>
                    <Link
                        href="/admin/campaigns/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E6F8F] px-4 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E5A7A] hover:shadow-md active:translate-y-0"
                    >
                        <Plus size={16} />
                        Create Campaign
                    </Link>
                </div>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="relative max-w-md flex-1">
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-[#D1E8F2] bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-[#0D2535] placeholder-[#0D2535]/40 transition-colors focus:border-[#2E6F8F] focus:outline-none"
                        />
                        <Search className="absolute left-3.5 top-3 text-[#0D2535]/40" size={16} />
                    </form>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#2E6F8F]/15 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#F0F7FB] bg-[#F7FAFB] text-xs font-black uppercase tracking-wider text-[#2E6F8F]">
                                    <th className="px-6 py-4">Campaign</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Discount</th>
                                    <th className="px-6 py-4">Active Period</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F7FB] text-sm text-[#0D2535]">
                                {campaigns.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center font-bold text-[#0D2535]/40">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <CalendarDays size={28} className="text-[#2E6F8F]/40" />
                                                No campaigns found.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    campaigns.data.map((campaign) => (
                                        <tr key={campaign.id} className="transition-colors hover:bg-[#F7FAFB]/50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold">{campaign.campaign_name}</div>
                                                <div className="max-w-xs truncate text-xs text-[#0D2535]/50">
                                                    {campaign.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#0D2535]/60">
                                                {campaign.product?.name ?? `Product #${campaign.product_id}`}
                                            </td>
                                            <td className="px-6 py-4 font-extrabold text-[#0D2535]">
                                                {Number(campaign.price).toFixed(2)}%
                                            </td>
                                            <td className="px-6 py-4 text-[#0D2535]/60">
                                                <div>{campaign.start_date}</div>
                                                <div>{campaign.end_date}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/admin/campaigns/${campaign.id}`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] text-[#0D2535]/50 transition-all hover:scale-105 hover:bg-[#F7FAFB] active:scale-95"
                                                        title="View"
                                                    >
                                                        <Eye size={13} />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/campaigns/${campaign.id}/edit`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={13} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(campaign.id)}
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

                    {campaigns.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-[#F0F7FB] bg-[#F7FAFB]/40 px-6 py-4">
                            <span className="text-xs font-semibold text-[#0D2535]/50">
                                Page {campaigns.current_page} of {campaigns.last_page}
                            </span>
                            <div className="flex gap-2">
                                <Link
                                    href={campaigns.prev_page_url || '#'}
                                    disabled={!campaigns.prev_page_url}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] bg-white transition-all ${
                                        campaigns.prev_page_url
                                            ? 'text-[#2E6F8F] hover:bg-[#EBF3F7] active:scale-95'
                                            : 'cursor-not-allowed text-[#0D2535]/20 opacity-50'
                                    }`}
                                >
                                    <ChevronLeft size={16} />
                                </Link>
                                <Link
                                    href={campaigns.next_page_url || '#'}
                                    disabled={!campaigns.next_page_url}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] bg-white transition-all ${
                                        campaigns.next_page_url
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

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Campaigns', href: '/admin/campaigns' },
    ],
};
