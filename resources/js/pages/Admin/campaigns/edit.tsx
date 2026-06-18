import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

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
}

interface EditProps {
    campaign: Campaign;
    products: Product[];
}

export default function Edit({ campaign, products }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        campaing_name: campaign.campaing_name,
        description: campaign.description,
        price: String(campaign.price),
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        product_id: String(campaign.product_id),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/campaigns/${campaign.id}`);
    }

    return (
        <>
            <Head title={`Admin - Edit ${campaign.campaing_name}`} />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-4 border-b border-[#D1E8F2]/60 pb-6">
                    <Link
                        href="/admin/campaigns"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">Edit Campaign</h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Update the campaign details, product, and active dates.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="campaing_name" className="block text-sm font-black text-[#0D2535]">
                                Campaign Name
                            </label>
                            <input
                                id="campaing_name"
                                type="text"
                                value={data.campaing_name}
                                onChange={(e) => setData('campaing_name', e.target.value)}
                                className={`mt-1.5 w-full rounded-xl border ${
                                    errors.campaing_name ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                            />
                            {errors.campaing_name && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.campaing_name}</p>}
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
                                />
                                {errors.price && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.price}</p>}
                            </div>
                        </div>

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
                                {processing ? 'Saving...' : 'Update Campaign'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Campaigns', href: '/admin/campaigns' },
        { title: 'Edit', href: '#' },
    ],
};
