import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit2, PackageCheck } from 'lucide-react';
import { StatusBadge, formatCurrency, formatDate } from './index';

type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

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
    customer_address: string;
    customer_city: string;
    customer_country: string;
    product_id: number;
    product_name: string;
    product_price: number | string;
    product_image: string | null;
    product_size: string | null;
    product_color: string | null;
    quantity: number;
    total_amount: number | string;
    payment_method: string;
    status: OrderStatus;
    notes: string | null;
    confirmed_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    product?: Product | null;
}

interface ShowProps {
    order: Order;
}

export default function Show({ order }: ShowProps) {
    return (
        <>
            <Head title={`Admin - Order ${order.unique_id}`} />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 border-b border-[#D1E8F2]/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/orders"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">
                                Order {order.unique_id}
                            </h1>
                            <p className="mt-1 text-sm text-[#0D2535]/50">
                                Customer, product, and fulfillment details.
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/admin/orders/${order.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E6F8F] px-4 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E5A7A] hover:shadow-md active:translate-y-0"
                    >
                        <Edit2 size={16} />
                        Edit Order
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                    <section className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#F0F7FB] pb-4">
                            <h2 className="font-black text-[#0D2535]">
                                Customer Information
                            </h2>
                            <StatusBadge status={order.status} />
                        </div>
                        <dl className="grid gap-4 text-sm sm:grid-cols-2">
                            <Detail label="Name" value={order.customer_full_name} />
                            <Detail label="Email" value={order.customer_email} />
                            <Detail label="Phone" value={order.customer_phone} />
                            <Detail
                                label="Country"
                                value={capitalize(order.customer_country)}
                            />
                            <Detail
                                label="City"
                                value={order.customer_city}
                            />
                            <Detail
                                label="Address"
                                value={order.customer_address}
                            />
                        </dl>
                    </section>

                    <section className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 border-b border-[#F0F7FB] pb-4 font-black text-[#0D2535]">
                            Timeline
                        </h2>
                        <dl className="space-y-4 text-sm">
                            <Detail
                                label="Confirmed"
                                value={formatDate(order.confirmed_at)}
                            />
                            <Detail
                                label="Shipped"
                                value={formatDate(order.shipped_at)}
                            />
                            <Detail
                                label="Delivered"
                                value={formatDate(order.delivered_at)}
                            />
                        </dl>
                    </section>

                    <section className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm lg:col-span-2">
                        <h2 className="mb-5 border-b border-[#F0F7FB] pb-4 font-black text-[#0D2535]">
                            Product Information
                        </h2>
                        <div className="flex flex-col gap-5 sm:flex-row">
                            {order.product_image ? (
                                <img
                                    src={normalizeImageUrl(order.product_image)}
                                    alt={order.product_name}
                                    className="h-32 w-32 rounded-xl border border-[#D1E8F2] object-cover"
                                />
                            ) : (
                                <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#D1E8F2] bg-[#F7FAFB] text-[#2E6F8F]/40">
                                    <PackageCheck size={30} />
                                </div>
                            )}
                            <dl className="grid flex-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                                <Detail
                                    label="Product"
                                    value={
                                        order.product_name ||
                                        order.product?.name ||
                                        `Product #${order.product_id}`
                                    }
                                />
                                <Detail
                                    label="Unit Price"
                                    value={formatCurrency(order.product_price)}
                                />
                                <Detail
                                    label="Quantity"
                                    value={String(order.quantity)}
                                />
                                <Detail
                                    label="Total"
                                    value={formatCurrency(order.total_amount)}
                                />
                                <Detail
                                    label="Size"
                                    value={order.product_size || '-'}
                                />
                                <Detail
                                    label="Color"
                                    value={order.product_color || '-'}
                                />
                                <Detail
                                    label="Payment"
                                    value={capitalize(order.payment_method)}
                                />
                                <Detail
                                    label="Notes"
                                    value={order.notes || '-'}
                                />
                            </dl>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-black tracking-wide text-[#2E6F8F] uppercase">
                {label}
            </dt>
            <dd className="mt-1 font-semibold text-[#0D2535]/70">{value}</dd>
        </div>
    );
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
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
        { title: 'Orders', href: '/admin/orders' },
        { title: 'Details', href: '#' },
    ],
};
