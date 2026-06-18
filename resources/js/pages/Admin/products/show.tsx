import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit2, Package } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    product_id: string;
    image: string | null;
    name: string;
    price: number | string;
    stock: number;
    category_id: number;
    category?: Category | null;
}

interface ShowProps {
    product: Product;
}

export default function Show({ product }: ShowProps) {
    return (
        <>
            <Head title={`Admin - ${product.name}`} />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 border-b border-[#D1E8F2]/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/products"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">
                                {product.name}
                            </h1>
                            <p className="mt-1 text-sm text-[#0D2535]/50">
                                Product details and inventory overview.
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E6F8F] px-4 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#1E5A7A] hover:shadow-md active:translate-y-0"
                    >
                        <Edit2 size={16} />
                        Edit Product
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                    <section className="overflow-hidden rounded-2xl border border-[#2E6F8F]/15 bg-white shadow-sm">
                        {product.image ? (
                            <img
                                src={normalizeImageUrl(product.image)}
                                alt={product.name}
                                className="h-80 w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-80 w-full items-center justify-center bg-[#F7FAFB] text-[#2E6F8F]/40">
                                <Package size={44} />
                            </div>
                        )}
                    </section>

                    <section className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 border-b border-[#F0F7FB] pb-4 font-black text-[#0D2535]">
                            Product Information
                        </h2>
                        <dl className="grid gap-5 text-sm sm:grid-cols-2">
                            <Detail label="SKU" value={product.product_id} />
                            <Detail
                                label="Category"
                                value={product.category?.name ?? 'Uncategorized'}
                            />
                            <Detail
                                label="Price"
                                value={`$${Number(product.price).toFixed(2)}`}
                            />
                            <Detail
                                label="Stock"
                                value={`${product.stock} in stock`}
                            />
                        </dl>
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

function normalizeImageUrl(image: string) {
    if (/^(https?:)?\/\//.test(image) || image.startsWith('/')) {
        return image;
    }

    return `/storage/${image}`;
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Products', href: '/admin/products' },
        { title: 'Details', href: '#' },
    ],
};
