import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Pencil } from 'lucide-react';

interface Product {
    id: number;
    name: string;
}

interface Campaign {
    id: number;
    campaing_name: string;
    description: string;
    price: number | string;
    start_date: string;
    end_date: string;
    product_id: number;
    product?: Product | null;
}

interface ShowProps {
    campaign: Campaign;
}

export default function Show({ campaign }: ShowProps) {
    return (
        <>
            <Head title={`Admin - ${campaign.campaing_name}`} />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 border-b border-[#D1E8F2]/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/campaigns"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">{campaign.campaing_name}</h1>
                            <p className="mt-1 text-sm text-[#0D2535]/50">Campaign details and active promotion window.</p>
                        </div>
                    </div>
                    <Link
                        href={`/admin/campaigns/${campaign.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E6F8F] px-4 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E5A7A] hover:shadow-md active:translate-y-0"
                    >
                        <Pencil size={16} />
                        Edit Campaign
                    </Link>
                </div>

                <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-xl border border-[#F0F7FB] bg-[#F7FAFB]/60 p-4">
                            <div className="text-xs font-black uppercase tracking-wider text-[#2E6F8F]">Campaign Name</div>
                            <div className="mt-2 text-lg font-bold text-[#0D2535]">{campaign.campaing_name}</div>
                        </div>
                        <div className="rounded-xl border border-[#F0F7FB] bg-[#F7FAFB]/60 p-4">
                            <div className="text-xs font-black uppercase tracking-wider text-[#2E6F8F]">Product</div>
                            <div className="mt-2 text-lg font-bold text-[#0D2535]">
                                {campaign.product?.name ?? `Product #${campaign.product_id}`}
                            </div>
                        </div>
                        <div className="rounded-xl border border-[#F0F7FB] bg-[#F7FAFB]/60 p-4">
                            <div className="text-xs font-black uppercase tracking-wider text-[#2E6F8F]">Discount</div>
                            <div className="mt-2 text-lg font-bold text-[#0D2535]">{Number(campaign.price).toFixed(2)}%</div>
                        </div>
                        <div className="rounded-xl border border-[#F0F7FB] bg-[#F7FAFB]/60 p-4">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#2E6F8F]">
                                <CalendarDays size={14} />
                                Active Dates
                            </div>
                            <div className="mt-2 text-lg font-bold text-[#0D2535]">
                                {campaign.start_date} to {campaign.end_date}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-[#F0F7FB] bg-[#F7FAFB]/60 p-4">
                        <div className="text-xs font-black uppercase tracking-wider text-[#2E6F8F]">Description</div>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#0D2535]/70">{campaign.description}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Campaigns', href: '/admin/campaigns' },
        { title: 'Details', href: '#' },
    ],
};
