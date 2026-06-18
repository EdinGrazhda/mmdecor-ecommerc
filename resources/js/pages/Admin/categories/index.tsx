import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Folder } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    description: string;
    products_count?: number;
    created_at: string;
}

interface PaginatedCategories {
    data: Category[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}

interface IndexProps {
    categories: PaginatedCategories;
    filters: { search?: string };
}

export default function Index({ categories, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/categories', { search }, { preserveState: true });
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this category? All related products will be deleted.')) {
            router.delete(`/admin/categories/${id}`);
        }
    }

    return (
        <>
            <Head title="Admin - Categories" />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#D1E8F2]/60 pb-6 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl flex items-center gap-2">
                            <span className="h-6 w-[3px] rounded-full bg-[#2E6F8F]" />
                            Categories Management
                        </h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Create, update, and manage your product categories. Total: {categories.total} categories.
                        </p>
                    </div>
                    <Link
                        href="/admin/categories/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E6F8F] px-4 py-2.5 text-sm font-black text-white transition-all hover:bg-[#1E5A7A] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md"
                    >
                        <Plus size={16} />
                        Create Category
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-[#D1E8F2] bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-[#0D2535] placeholder-[#0D2535]/40 transition-colors focus:border-[#2E6F8F] focus:outline-none"
                        />
                        <Search className="absolute left-3.5 top-3 text-[#0D2535]/40" size={16} />
                    </form>
                </div>

                {/* Table Card */}
                <div className="overflow-hidden rounded-2xl border border-[#2E6F8F]/15 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#F0F7FB] bg-[#F7FAFB] text-xs font-black tracking-wider text-[#2E6F8F] uppercase">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F7FB] text-sm text-[#0D2535]">
                                {categories.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-[#0D2535]/40 font-bold">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Folder size={28} className="text-[#2E6F8F]/40" />
                                                No categories found.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    categories.data.map((category) => (
                                        <tr key={category.id} className="transition-colors hover:bg-[#F7FAFB]/50">
                                            <td className="px-6 py-4 font-bold text-[#2E6F8F]">
                                                #{String(category.id).padStart(3, '0')}
                                            </td>
                                            <td className="px-6 py-4 font-bold">{category.name}</td>
                                            <td className="px-6 py-4 text-[#0D2535]/60 max-w-xs truncate">
                                                {category.description}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/admin/categories/${category.id}/edit`}
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] text-[#2E6F8F] hover:bg-[#EBF3F7] transition-all hover:scale-105 active:scale-95"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={13} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
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
                    {categories.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-[#F0F7FB] bg-[#F7FAFB]/40 px-6 py-4">
                            <span className="text-xs font-semibold text-[#0D2535]/50">
                                Page {categories.current_page} of {categories.last_page}
                            </span>
                            <div className="flex gap-2">
                                <Link
                                    href={categories.prev_page_url || '#'}
                                    disabled={!categories.prev_page_url}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] bg-white transition-all ${
                                        categories.prev_page_url 
                                            ? 'text-[#2E6F8F] hover:bg-[#EBF3F7] active:scale-95' 
                                            : 'cursor-not-allowed text-[#0D2535]/20 opacity-50'
                                    }`}
                                >
                                    <ChevronLeft size={16} />
                                </Link>
                                <Link
                                    href={categories.next_page_url || '#'}
                                    disabled={!categories.next_page_url}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1E8F2] bg-white transition-all ${
                                        categories.next_page_url 
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
        { title: 'Categories', href: '/admin/categories' }
    ]
};
