import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { StatusBadge } from './index';

type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

interface Order {
    id: number;
    unique_id: string;
    customer_full_name: string;
    product_name: string;
    status: OrderStatus;
    notes: string | null;
}

interface EditProps {
    order: Order;
}

const statuses: Array<{ value: OrderStatus; label: string }> = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function Edit({ order }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        status: order.status,
        notes: order.notes || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/orders/${order.id}`);
    }

    return (
        <>
            <Head title={`Admin - Edit Order ${order.unique_id}`} />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-4 border-b border-[#D1E8F2]/60 pb-6">
                    <Link
                        href="/admin/orders"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">
                            Edit Order
                        </h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            {order.unique_id} for {order.customer_full_name}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-col gap-2 rounded-xl bg-[#F7FAFB] p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-black text-[#0D2535]">
                                {order.product_name}
                            </p>
                            <p className="text-xs font-semibold text-[#0D2535]/45">
                                Current status
                            </p>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-black text-[#0D2535]"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData(
                                        'status',
                                        e.target.value as OrderStatus,
                                    )
                                }
                                className={`mt-1.5 w-full rounded-xl border ${
                                    errors.status
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                } bg-white px-4 py-3 text-sm font-semibold text-[#0D2535] transition-colors focus:outline-none`}
                            >
                                {statuses.map((item) => (
                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {errors.status && (
                                <p className="mt-1.5 text-xs font-semibold text-red-500">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="notes"
                                className="block text-sm font-black text-[#0D2535]"
                            >
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                rows={5}
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                className={`mt-1.5 w-full rounded-xl border ${
                                    errors.notes
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] transition-colors focus:outline-none`}
                                placeholder="Internal notes for this order..."
                            />
                            {errors.notes && (
                                <p className="mt-1.5 text-xs font-semibold text-red-500">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-[#F0F7FB] pt-6">
                            <Link
                                href="/admin/orders"
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
                                {processing ? 'Saving...' : 'Update Order'}
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
        { title: 'Orders', href: '/admin/orders' },
        { title: 'Edit', href: '#' },
    ],
};
