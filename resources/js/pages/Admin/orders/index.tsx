import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Edit2,
    Eye,
    PackageCheck,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
}

interface Order {
    id: number;
    unique_id: string;
    customer_full_name: string;
    customer_email: string;
    customer_phone: string;
    customer_country: string;
    product_id: number;
    product_name: string;
    quantity: number;
    total_amount: number | string;
    status: OrderStatus;
    created_at: string;
    product?: Product | null;
}

type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
}

interface IndexProps {
    orders: PaginatedOrders;
    filters: {
        search?: string;
        status?: string;
        country?: string;
    };
}

const statuses: Array<{ value: string; label: string }> = [
    { value: '', label: 'All statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

const countries = [
    { value: '', label: 'All countries' },
    { value: 'albania', label: 'Albania' },
    { value: 'kosovo', label: 'Kosovo' },
    { value: 'macedonia', label: 'Macedonia' },
];

export default function Index({ orders, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [country, setCountry] = useState(filters.country || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(
            '/admin/orders',
            { search, status, country },
            { preserveState: true },
        );
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this order?')) {
            router.delete(`/admin/orders/${id}`);
        }
    }

    return (
        <>
            <Head title="Admin - Orders" />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 border-b border-[#D1E8F2]/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black text-[#0D2535] sm:text-3xl">
                            <span className="h-6 w-[3px] rounded-full bg-[#2E6F8F]" />
                            Orders Management
                        </h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Review and update customer orders. Total:{' '}
                            {orders.total} orders.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="mb-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_auto]"
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search order ID, customer, phone, or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-[#D1E8F2] bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-[#0D2535] placeholder-[#0D2535]/40 transition-colors focus:border-[#2E6F8F] focus:outline-none"
                        />
                        <Search
                            className="absolute top-3 left-3.5 text-[#0D2535]/40"
                            size={16}
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-xl border border-[#D1E8F2] bg-white px-3 py-2.5 text-sm font-semibold text-[#0D2535] focus:border-[#2E6F8F] focus:outline-none"
                    >
                        {statuses.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="rounded-xl border border-[#D1E8F2] bg-white px-3 py-2.5 text-sm font-semibold text-[#0D2535] focus:border-[#2E6F8F] focus:outline-none"
                    >
                        {countries.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E6F8F] px-4 py-2.5 text-sm font-black text-white transition-all hover:bg-[#1E5A7A] active:scale-95"
                    >
                        <Search size={16} />
                        Filter
                    </button>
                </form>

                <div className="overflow-hidden rounded-2xl border border-[#2E6F8F]/15 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#F0F7FB] bg-[#F7FAFB] text-xs font-black tracking-wider text-[#2E6F8F] uppercase">
                                    <th className="px-6 py-4">Order</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F7FB] text-sm text-[#0D2535]">
                                {orders.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-10 text-center font-bold text-[#0D2535]/40"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <PackageCheck
                                                    size={28}
                                                    className="text-[#2E6F8F]/40"
                                                />
                                                No orders found.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.data.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="transition-colors hover:bg-[#F7FAFB]/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-black text-[#2E6F8F]">
                                                    {order.unique_id}
                                                </div>
                                                <div className="text-xs text-[#0D2535]/35">
                                                    {formatDate(
                                                        order.created_at,
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold">
                                                    {
                                                        order.customer_full_name
                                                    }
                                                </div>
                                                <div className="text-xs text-[#0D2535]/50">
                                                    {order.customer_phone}
                                                </div>
                                            </td>
                                            <td className="max-w-xs px-6 py-4">
                                                <div className="truncate font-semibold">
                                                    {order.product_name ||
                                                        order.product?.name ||
                                                        `Product #${order.product_id}`}
                                                </div>
                                                <div className="text-xs text-[#0D2535]/45">
                                                    Qty {order.quantity}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-black">
                                                {formatCurrency(
                                                    order.total_amount,
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    status={order.status}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] text-[#0D2535]/50 transition-all hover:scale-105 hover:bg-[#F7FAFB] active:scale-95"
                                                        title="View"
                                                    >
                                                        <Eye size={13} />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/orders/${order.id}/edit`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={13} />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                order.id,
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

                    {orders.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-[#F0F7FB] bg-[#F7FAFB]/40 px-6 py-4">
                            <span className="text-xs font-semibold text-[#0D2535]/50">
                                Page {orders.current_page} of{' '}
                                {orders.last_page}
                            </span>
                            <div className="flex gap-2">
                                <Link
                                    href={orders.prev_page_url || '#'}
                                    disabled={!orders.prev_page_url}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] bg-white transition-all ${
                                        orders.prev_page_url
                                            ? 'text-[#2E6F8F] hover:bg-[#EBF3F7] active:scale-95'
                                            : 'cursor-not-allowed text-[#0D2535]/20 opacity-50'
                                    }`}
                                >
                                    <ChevronLeft size={16} />
                                </Link>
                                <Link
                                    href={orders.next_page_url || '#'}
                                    disabled={!orders.next_page_url}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] bg-white transition-all ${
                                        orders.next_page_url
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

export function StatusBadge({ status }: { status: OrderStatus }) {
    const styles: Record<OrderStatus, string> = {
        pending: 'bg-amber-50 text-amber-700 ring-amber-200',
        confirmed: 'bg-sky-50 text-sky-700 ring-sky-200',
        processing: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
        shipped: 'bg-blue-50 text-blue-700 ring-blue-200',
        delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        cancelled: 'bg-red-50 text-red-700 ring-red-200',
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black capitalize ring-1 ${styles[status]}`}
        >
            {status}
        </span>
    );
}

export function formatCurrency(value: number | string) {
    return `$${Number(value).toFixed(2)}`;
}

export function formatDate(value: string | null) {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleDateString();
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Orders', href: '/admin/orders' },
    ],
};
