import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number | string;
}

interface CreateProps {
    products: Product[];
}

export default function Create({ products }: CreateProps) {
    const today = new Date().toISOString().slice(0, 10);
    const { data, setData, post, processing, errors } = useForm({
        campaign_name: '',
        description: '',
        price: '',
        start_date: today,
        end_date: '',
        product_id: '',
    });
    const selectedProduct = products.find(
        (product) => String(product.id) === String(data.product_id),
    );
    const originalPrice = selectedProduct ? Number(selectedProduct.price) : null;
    const discountPercent = Number(data.price);
    const hasPricePreview =
        originalPrice !== null &&
        Number.isFinite(originalPrice) &&
        Number.isFinite(discountPercent);
    const discountedPrice = hasPricePreview
        ? originalPrice * (1 - discountPercent / 100)
        : null;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/campaigns');
    }

    return (
        <>
            <Head title="Admin - Create Campaign" />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-4 border-b border-[#D1E8F2]/60 pb-6">
                    <Link
                        href="/admin/campaigns"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">Create Campaign</h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Add a new product promotion and define its active date range.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="campaign_name" className="block text-sm font-black text-[#0D2535]">
                                Campaign Name
                            </label>
                            <input
                                id="campaign_name"
                                type="text"
                                value={data.campaign_name}
                                onChange={(e) => setData('campaign_name', e.target.value)}
                                className={`mt-1.5 w-full rounded-xl border ${
                                    errors.campaign_name ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                                placeholder="e.g., Summer Sale 2026"
                            />
                            {errors.campaign_name && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.campaign_name}</p>}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-black text-[#0D2535]">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={`mt-1.5 w-full rounded-xl border ${
                                    errors.description ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                                placeholder="Write a short summary of the promotion..."
                            />
                            {errors.description && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="product_id" className="block text-sm font-black text-[#0D2535]">
                                    Product
                                </label>
                                <select
                                    id="product_id"
                                    value={data.product_id}
                                    onChange={(e) => setData('product_id', e.target.value)}
                                    className={`mt-1.5 w-full rounded-xl border ${
                                        errors.product_id ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                    } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                                >
                                    <option value="">Select a product</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.product_id && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.product_id}</p>}
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-black text-[#0D2535]">
                                    Discount Percent
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className={`mt-1.5 w-full rounded-xl border ${
                                        errors.price ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                    } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                                    placeholder="e.g., 20"
                                />
                                {errors.price && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.price}</p>}
                            </div>
                        </div>

                        {selectedProduct && (
                            <div className="grid gap-4 rounded-2xl border border-[#D1E8F2] bg-[#F7FAFB] p-4 sm:grid-cols-3">
                                <PricePreviewItem
                                    label="Original Price"
                                    value={formatCurrency(originalPrice)}
                                />
                                <PricePreviewItem
                                    label="Discount"
                                    value={`${Number.isFinite(discountPercent) ? discountPercent : 0}%`}
                                />
                                <PricePreviewItem
                                    label="Campaign Price"
                                    value={
                                        discountedPrice !== null
                                            ? formatCurrency(discountedPrice)
                                            : '-'
                                    }
                                    highlight
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-black text-[#0D2535]">
                                    Start Date
                                </label>
                                <input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className={`mt-1.5 w-full rounded-xl border ${
                                        errors.start_date ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                    } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                                />
                                {errors.start_date && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.start_date}</p>}
                            </div>

                            <div>
                                <label htmlFor="end_date" className="block text-sm font-black text-[#0D2535]">
                                    End Date
                                </label>
                                <input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className={`mt-1.5 w-full rounded-xl border ${
                                        errors.end_date ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                    } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                                />
                                {errors.end_date && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.end_date}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-[#F0F7FB] pt-6">
                            <Link
                                href="/admin/campaigns"
                                className="rounded-xl border border-[#D1E8F2] bg-white px-5 py-2.5 text-sm font-bold text-[#0D2535]/70 transition-all hover:bg-[#F7FAFB] active:scale-95"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#2E6F8F] px-5 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E5A7A] hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save size={16} />
                                {processing ? 'Saving...' : 'Save Campaign'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

function PricePreviewItem({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div>
            <p className="text-xs font-black tracking-wide text-[#2E6F8F] uppercase">
                {label}
            </p>
            <p
                className={`mt-1 text-lg font-black ${
                    highlight ? 'text-emerald-600' : 'text-[#0D2535]'
                }`}
            >
                {value}
            </p>
        </div>
    );
}

function formatCurrency(value: number | null) {
    if (value === null || !Number.isFinite(value)) {
        return '-';
    }

    return `$${Math.max(value, 0).toFixed(2)}`;
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Campaigns', href: '/admin/campaigns' },
        { title: 'Create', href: '/admin/campaigns/create' },
    ],
};
