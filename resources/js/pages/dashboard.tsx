import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    BarChart2,
    CheckCircle2,
    DollarSign,
    Layers,
    Package,
    ShoppingCart,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import { dashboard } from '@/routes';

type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

interface Stats {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
    totalCategories: number;
}

interface StatusCount {
    status: OrderStatus;
    count: number;
}

interface LowStockProduct {
    id: number;
    name: string;
    stock: number;
    price: number;
    image: string | null;
}

interface BestSellingProduct {
    product_id: number;
    product_name: string;
    total_sold: number;
    total_revenue: number;
}

interface RecentOrder {
    id: number;
    unique_id: string;
    customer_full_name: string;
    product_name: string;
    total_amount: number;
    status: OrderStatus;
    created_at: string;
    quantity: number;
}

interface RevenuePoint {
    date: string;
    revenue: number;
    orders_count: number;
}

interface DashboardProps {
    stats: Stats;
    orderStatusBreakdown: StatusCount[];
    lowStockProducts: LowStockProduct[];
    bestSellingProducts: BestSellingProduct[];
    recentOrders: RecentOrder[];
    revenueChart: RevenuePoint[];
    period: 7 | 30 | 90;
}

const statusStyles: Record<OrderStatus, string> = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    confirmed: 'bg-sky-50 text-sky-700 ring-sky-200',
    processing: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    shipped: 'bg-blue-50 text-blue-700 ring-blue-200',
    delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    cancelled: 'bg-red-50 text-red-700 ring-red-200',
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
    pending: <AlertTriangle size={12} />,
    confirmed: <CheckCircle2 size={12} />,
    processing: <BarChart2 size={12} />,
    shipped: <ArrowRight size={12} />,
    delivered: <CheckCircle2 size={12} />,
    cancelled: <XCircle size={12} />,
};

function StatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black capitalize ring-1 ${statusStyles[status]}`}
        >
            {statusIcons[status]}
            {status}
        </span>
    );
}

function formatCurrency(value: number | string) {
    return `$${Number(value).toFixed(2)}`;
}

function formatDate(value: string | null) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString();
}

export default function Dashboard({
    stats,
    orderStatusBreakdown,
    lowStockProducts,
    bestSellingProducts,
    recentOrders,
    revenueChart,
    period,
}: DashboardProps) {
    const maxRevenue = Math.max(...revenueChart.map((d) => d.revenue), 1);

    function setPeriod(p: number) {
        router.get('/dashboard', { period: p }, { preserveState: false });
    }

    const totalChartRevenue = revenueChart.reduce(
        (sum, d) => sum + Number(d.revenue),
        0,
    );
    const totalChartOrders = revenueChart.reduce(
        (sum, d) => sum + Number(d.orders_count),
        0,
    );

    const statCards = [
        {
            label: 'Total Revenue',
            value: formatCurrency(stats.totalRevenue),
            icon: DollarSign,
            color: 'bg-emerald-50 text-emerald-600',
            border: 'border-emerald-100',
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'bg-blue-50 text-blue-600',
            border: 'border-blue-100',
        },
        {
            label: 'Pending Orders',
            value: stats.pendingOrders,
            icon: AlertTriangle,
            color: 'bg-amber-50 text-amber-600',
            border: 'border-amber-100',
        },
        {
            label: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'bg-indigo-50 text-indigo-600',
            border: 'border-indigo-100',
        },
        {
            label: 'Categories',
            value: stats.totalCategories,
            icon: Layers,
            color: 'bg-purple-50 text-purple-600',
            border: 'border-purple-100',
        },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="w-full space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="border-b border-[#D1E8F2]/60 pb-6">
                    <h1 className="flex items-center gap-2 text-2xl font-black text-[#0D2535] sm:text-3xl">
                        <span className="h-6 w-[3px] rounded-full bg-[#2E6F8F]" />
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-[#0D2535]/50">
                        Overview of your store performance and key metrics.
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.label}
                                className={`flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-sm ${card.border}`}
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}
                                >
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-[#0D2535]">
                                        {card.value}
                                    </div>
                                    <div className="text-xs font-semibold text-[#0D2535]/50">
                                        {card.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Revenue Chart + Order Status */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Revenue Chart with period selector */}
                    <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp
                                    size={18}
                                    className="text-[#2E6F8F]"
                                />
                                <h2 className="text-base font-black text-[#0D2535]">
                                    Revenue — Last {period} Days
                                </h2>
                            </div>
                            <div className="flex items-center gap-1 rounded-xl border border-[#D1E8F2] bg-[#F7FAFB] p-1">
                                {([7, 30, 90] as const).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-black transition-all ${
                                            period === p
                                                ? 'bg-[#2E6F8F] text-white shadow-sm'
                                                : 'text-[#0D2535]/50 hover:text-[#2E6F8F]'
                                        }`}
                                    >
                                        {p}d
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Summary row */}
                        <div className="mb-4 flex gap-4 text-sm">
                            <div>
                                <span className="font-black text-[#0D2535]">
                                    {formatCurrency(totalChartRevenue)}
                                </span>
                                <span className="ml-1 text-xs text-[#0D2535]/40">
                                    revenue
                                </span>
                            </div>
                            <div className="w-px bg-[#D1E8F2]" />
                            <div>
                                <span className="font-black text-[#0D2535]">
                                    {totalChartOrders}
                                </span>
                                <span className="ml-1 text-xs text-[#0D2535]/40">
                                    orders
                                </span>
                            </div>
                        </div>

                        {revenueChart.length === 0 ? (
                            <div className="flex h-36 items-center justify-center text-sm font-semibold text-[#0D2535]/30">
                                No revenue data for this period.
                            </div>
                        ) : (
                            <>
                                <div className="relative flex h-40 items-end gap-[3px] border-b border-[#D1E8F2] pb-2">
                                    {/* horizontal grid lines */}
                                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-2">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="border-t border-dashed border-[#D1E8F2]/60"
                                            />
                                        ))}
                                    </div>
                                    {revenueChart.map((point) => {
                                        const height = Math.max(
                                            4,
                                            Math.round(
                                                (Number(point.revenue) /
                                                    maxRevenue) *
                                                    140,
                                            ),
                                        );
                                        return (
                                            <div
                                                key={point.date}
                                                className="group relative flex min-w-[6px] flex-1 flex-col items-center justify-end"
                                            >
                                                <div
                                                    className="w-full rounded-t-md bg-[#2E6F8F] opacity-75 transition-all group-hover:opacity-100"
                                                    style={{
                                                        height: `${height}px`,
                                                    }}
                                                />
                                                <div className="pointer-events-none absolute bottom-full z-10 mb-1 hidden rounded-lg border border-[#D1E8F2] bg-white px-2 py-1 text-xs font-bold whitespace-nowrap text-[#0D2535] shadow-md group-hover:block">
                                                    {formatCurrency(
                                                        point.revenue,
                                                    )}
                                                    <br />
                                                    <span className="font-normal text-[#0D2535]/50">
                                                        {Number(
                                                            point.orders_count,
                                                        )}{' '}
                                                        order
                                                        {Number(
                                                            point.orders_count,
                                                        ) !== 1
                                                            ? 's'
                                                            : ''}
                                                    </span>
                                                    <br />
                                                    <span className="font-normal text-[#0D2535]/40">
                                                        {formatDate(point.date)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* X-axis: first, middle, last date */}
                                <div className="mt-1 flex justify-between text-[10px] font-semibold text-[#0D2535]/35">
                                    <span>
                                        {formatDate(revenueChart[0].date)}
                                    </span>
                                    {revenueChart.length > 2 && (
                                        <span>
                                            {formatDate(
                                                revenueChart[
                                                    Math.floor(
                                                        revenueChart.length / 2,
                                                    )
                                                ].date,
                                            )}
                                        </span>
                                    )}
                                    <span>
                                        {formatDate(
                                            revenueChart[
                                                revenueChart.length - 1
                                            ].date,
                                        )}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Order Status Breakdown */}
                    <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <BarChart2 size={18} className="text-[#2E6F8F]" />
                            <h2 className="text-base font-black text-[#0D2535]">
                                Order Status
                            </h2>
                        </div>
                        {orderStatusBreakdown.length === 0 ? (
                            <div className="flex h-36 items-center justify-center text-sm font-semibold text-[#0D2535]/30">
                                No orders yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orderStatusBreakdown.map((item) => {
                                    const total = orderStatusBreakdown.reduce(
                                        (sum, i) => sum + Number(i.count),
                                        0,
                                    );
                                    const pct =
                                        total > 0
                                            ? Math.round(
                                                  (Number(item.count) / total) *
                                                      100,
                                              )
                                            : 0;
                                    return (
                                        <div key={item.status}>
                                            <div className="mb-1 flex items-center justify-between text-xs font-bold text-[#0D2535]">
                                                <span className="capitalize">
                                                    {item.status}
                                                </span>
                                                <span className="text-[#0D2535]/50">
                                                    {item.count} ({pct}%)
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0F7FB]">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${
                                                        item.status ===
                                                        'delivered'
                                                            ? 'bg-emerald-500'
                                                            : item.status ===
                                                                'cancelled'
                                                              ? 'bg-red-400'
                                                              : item.status ===
                                                                  'pending'
                                                                ? 'bg-amber-400'
                                                                : item.status ===
                                                                    'shipped'
                                                                  ? 'bg-blue-500'
                                                                  : item.status ===
                                                                      'confirmed'
                                                                    ? 'bg-sky-500'
                                                                    : 'bg-indigo-500'
                                                    }`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Low Stock + Best Sellers */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Low Stock Products */}
                    <div className="rounded-2xl border border-red-100 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-red-50 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle
                                    size={18}
                                    className="text-red-500"
                                />
                                <h2 className="text-base font-black text-[#0D2535]">
                                    Low Stock Products
                                </h2>
                            </div>
                            <Link
                                href="/admin/products"
                                className="text-xs font-bold text-[#2E6F8F] hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                        {lowStockProducts.length === 0 ? (
                            <div className="flex h-32 items-center justify-center text-sm font-semibold text-[#0D2535]/30">
                                All products are well stocked 🎉
                            </div>
                        ) : (
                            <div className="divide-y divide-[#F0F7FB]">
                                {lowStockProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between px-6 py-3"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-9 w-9 rounded-lg border border-[#D1E8F2] object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0F7FB]">
                                                    <Package
                                                        size={14}
                                                        className="text-[#2E6F8F]/50"
                                                    />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-bold text-[#0D2535]">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-[#0D2535]/50">
                                                    {formatCurrency(
                                                        product.price,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-black ring-1 ${
                                                product.stock === 0
                                                    ? 'bg-red-50 text-red-700 ring-red-200'
                                                    : product.stock <= 5
                                                      ? 'bg-orange-50 text-orange-700 ring-orange-200'
                                                      : 'bg-amber-50 text-amber-700 ring-amber-200'
                                            }`}
                                        >
                                            {product.stock === 0
                                                ? 'Out of stock'
                                                : `${product.stock} left`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Best Selling Products */}
                    <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-[#F0F7FB] px-6 py-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp
                                    size={18}
                                    className="text-[#2E6F8F]"
                                />
                                <h2 className="text-base font-black text-[#0D2535]">
                                    Best Selling Products
                                </h2>
                            </div>
                            <Link
                                href="/admin/orders"
                                className="text-xs font-bold text-[#2E6F8F] hover:underline"
                            >
                                View orders
                            </Link>
                        </div>
                        {bestSellingProducts.length === 0 ? (
                            <div className="flex h-32 items-center justify-center text-sm font-semibold text-[#0D2535]/30">
                                No sales data yet.
                            </div>
                        ) : (
                            <div className="divide-y divide-[#F0F7FB]">
                                {bestSellingProducts.map((product, index) => (
                                    <div
                                        key={product.product_id}
                                        className="flex items-center gap-4 px-6 py-3"
                                    >
                                        <span
                                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                                index === 0
                                                    ? 'bg-amber-400 text-white'
                                                    : index === 1
                                                      ? 'bg-slate-300 text-slate-700'
                                                      : index === 2
                                                        ? 'bg-orange-300 text-white'
                                                        : 'bg-[#F0F7FB] text-[#2E6F8F]'
                                            }`}
                                        >
                                            {index + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-bold text-[#0D2535]">
                                                {product.product_name}
                                            </div>
                                            <div className="text-xs text-[#0D2535]/50">
                                                {formatCurrency(
                                                    product.total_revenue,
                                                )}{' '}
                                                revenue
                                            </div>
                                        </div>
                                        <span className="shrink-0 text-sm font-black text-[#2E6F8F]">
                                            {product.total_sold} sold
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#F0F7FB] px-6 py-4">
                        <div className="flex items-center gap-2">
                            <ShoppingCart
                                size={18}
                                className="text-[#2E6F8F]"
                            />
                            <h2 className="text-base font-black text-[#0D2535]">
                                Recent Orders
                            </h2>
                        </div>
                        <Link
                            href="/admin/orders"
                            className="text-xs font-bold text-[#2E6F8F] hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="flex h-32 items-center justify-center text-sm font-semibold text-[#0D2535]/30">
                            No orders yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-[#F0F7FB] bg-[#F7FAFB] text-xs font-black tracking-wider text-[#2E6F8F] uppercase">
                                        <th className="px-6 py-3">Order</th>
                                        <th className="px-6 py-3">Customer</th>
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-6 py-3">Total</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F0F7FB] text-[#0D2535]">
                                    {recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="transition-colors hover:bg-[#F7FAFB]/50"
                                        >
                                            <td className="px-6 py-3 font-black text-[#2E6F8F]">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="hover:underline"
                                                >
                                                    {order.unique_id}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-3 font-semibold">
                                                {order.customer_full_name}
                                            </td>
                                            <td className="max-w-[180px] truncate px-6 py-3 text-[#0D2535]/70">
                                                {order.product_name}
                                                <span className="ml-1 text-xs text-[#0D2535]/40">
                                                    ×{order.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 font-black">
                                                {formatCurrency(
                                                    order.total_amount,
                                                )}
                                            </td>
                                            <td className="px-6 py-3">
                                                <StatusBadge
                                                    status={order.status}
                                                />
                                            </td>
                                            <td className="px-6 py-3 text-xs text-[#0D2535]/50">
                                                {formatDate(order.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
