import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit2 } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    category: Category;
}

export default function Show({ category }: ShowProps) {
    return (
        <>
            <Head title={`Admin - Category ${category.name}`} />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#D1E8F2]/60 pb-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/categories"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] hover:bg-[#EBF3F7] transition-all hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">
                                Category Details
                            </h1>
                            <p className="mt-1 text-sm text-[#0D2535]/50">
                                Detailed information about category #{category.id}.
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E6F8F] px-4 py-2.5 text-sm font-black text-white transition-all hover:bg-[#1E5A7A] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md"
                    >
                        <Edit2 size={15} />
                        Edit Category
                    </Link>
                </div>

                {/* Details Card */}
                <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xs font-black tracking-wider text-[#2E6F8F] uppercase">Name</h3>
                        <p className="mt-1.5 text-lg font-bold text-[#0D2535]">{category.name}</p>
                    </div>

                    <div className="border-t border-[#F0F7FB] pt-4">
                        <h3 className="text-xs font-black tracking-wider text-[#2E6F8F] uppercase">Description</h3>
                        <p className="mt-1.5 text-sm text-[#0D2535]/70 leading-relaxed whitespace-pre-wrap">
                            {category.description || 'No description provided.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-[#F0F7FB] pt-4">
                        <div>
                            <h3 className="text-xs font-black tracking-wider text-[#2E6F8F] uppercase">Created At</h3>
                            <p className="mt-1.5 text-xs font-semibold text-[#0D2535]/65">
                                {new Date(category.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xs font-black tracking-wider text-[#2E6F8F] uppercase">Last Updated</h3>
                            <p className="mt-1.5 text-xs font-semibold text-[#0D2535]/65">
                                {new Date(category.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Categories', href: '/admin/categories' },
        { title: 'Details', href: '#' }
    ]
};
