import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Eye, Package } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    product_id: string; // SKU
    name: string;
    image: string;
    price: number;
    stock: number;
    category_id: number;
    category?: { name: string };
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
}

interface IndexProps {
    products: PaginatedProducts;
    categories: Category[];
    filters: { search?: string; category_id?: string };
}

export default function Index({ products, categories, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');

    function handleFilter(e?: React.FormEvent) {
        if (e) e.preventDefault();
        router.get('/admin/products', { search, category_id: categoryId }, { preserveState: true });
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/admin/products/${id}`);
        }
    }

    return (
        <>
            <Head title="Admin - Products" />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#D1E8F2]/60 pb-6 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl flex items-center gap-2">
                            <span className="h-6 w-[3px] rounded-full bg-[#2E6F8F]" />
                            Products Management
                        </h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Create, update, and manage your inventory. Total: {products.total} products.
                        </p>
                    </div>
                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E6F8F] px-4 py-2.5 text-sm font-black text-white transition-all hover:bg-[#1E5A7A] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md"
                    >
                        <Plus size={16} />
                        Create Product
                    </Link>
                </div>

                {/* Filters */}
                <form onSubmit={handleFilter} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-[#D1E8F2] bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-[#0D2535] placeholder-[#0D2535]/40 transition-colors focus:border-[#2E6F8F] focus:outline-none"
                        />
                        <Search className="absolute left-3.5 top-3 text-[#0D2535]/40" size={16} />
                    </div>

                    <div className="w-full sm:w-48">
                        <select
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                // Trigger route change directly on select select
                                router.get('/admin/products', { search, category_id: e.target.value }, { preserveState: true });
                            }}
                            className="w-full rounded-xl border border-[#D1E8F2] bg-white px-3 py-2.5 text-sm font-medium text-[#0D2535] focus:border-[#2E6F8F] focus:outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="rounded-xl border border-[#2E6F8F]/40 bg-[#EBF3F7] px-5 py-2.5 text-sm font-bold text-[#2E6F8F] hover:bg-[#D0E8F2] transition-all"
                    >
                        Filter
                    </button>
                </form>

                {/* Table Card */}
                <div className="overflow-hidden rounded-2xl border border-[#2E6F8F]/15 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#F0F7FB] bg-[#F7FAFB] text-xs font-black tracking-wider text-[#2E6F8F] uppercase">
                                    <th className="px-6 py-4">Image</th>
                                    <th className="px-6 py-4">SKU / ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F7FB] text-sm text-[#0D2535]">
                                {products.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-[#0D2535]/40 font-bold">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Package size={28} className="text-[#2E6F8F]/40" />
                                                No products found.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    products.data.map((product) => (
                                        <tr key={product.id} className="transition-colors hover:bg-[#F7FAFB]/50">
                                            <td className="px-6 py-3">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-10 w-10 rounded-lg object-cover border border-[#D1E8F2]"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=80&q=80';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D1E8F2] bg-[#F7FAFB] text-[#2E6F8F]/40">
                                                        <Package size={16} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-[#2E6F8F]">{product.product_id}</td>
                                            <td className="px-6 py-4 font-bold">{product.name}</td>
                                            <td className="px-6 py-4 text-[#0D2535]/60">
                                                {product.category?.name ?? 'Uncategorized'}
                                            </td>
                                            <td className="px-6 py-4 font-extrabold text-[#0D2535]">
                                                ${Number(product.price).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black uppercase ${
                                                        product.stock > 10
                                                            ? 'bg-emerald-50 text-emerald-600'
                                                            : product.stock > 0
                                                              ? 'bg-amber-50 text-amber-600'
                                                              : 'bg-red-50 text-red-500'
                                                    }`}
                                                >
                                                    {product.stock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] text-[#0D2535]/50 hover:bg-[#F7FAFB] transition-all hover:scale-105 active:scale-95"
                                                        title="View"
                                                    >
                                                        <Eye size={13} />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] text-[#2E6F8F] hover:bg-[#EBF3F7] transition-all hover:scale-105 active:scale-95"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={13} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-all hover:scale-105 active:scale-95"
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

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-[#F0F7FB] bg-[#F7FAFB]/40 px-6 py-4">
                            <span className="text-xs font-semibold text-[#0D2535]/50">
                                Page {products.current_page} of {products.last_page}
                            </span>
                            <div className="flex gap-2">
                                <Link
                                    href={products.prev_page_url || '#'}
                                    disabled={!products.prev_page_url}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] bg-white transition-all ${
                                        products.prev_page_url 
                                            ? 'text-[#2E6F8F] hover:bg-[#EBF3F7] active:scale-95' 
                                            : 'cursor-not-allowed text-[#0D2535]/20 opacity-50'
                                    }`}
                                >
                                    <ChevronLeft size={16} />
                                </Link>
                                <Link
                                    href={products.next_page_url || '#'}
                                    disabled={!products.next_page_url}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] bg-white transition-all ${
                                        products.next_page_url 
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
        { title: 'Products', href: '/admin/products' }
    ]
};
