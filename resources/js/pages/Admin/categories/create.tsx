import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/categories');
    }

    return (
        <>
            <Head title="Admin - Create Category" />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-[#D1E8F2]/60 pb-6 mb-8">
                    <Link
                        href="/admin/categories"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] hover:bg-[#EBF3F7] transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">
                            Create Category
                        </h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Add a new product category to organize your catalogue.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-black text-[#0D2535]">
                                Category Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`mt-1.5 w-full rounded-xl border ${
                                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] transition-colors focus:outline-none`}
                                placeholder="e.g., Engine Parts"
                            />
                            {errors.name && (
                                <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
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
                                } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] transition-colors focus:outline-none`}
                                placeholder="Write a short overview of what products belong in this category..."
                            />
                            {errors.description && (
                                <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.description}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 border-t border-[#F0F7FB] pt-6">
                            <Link
                                href="/admin/categories"
                                className="rounded-xl border border-[#D1E8F2] bg-white px-5 py-2.5 text-sm font-bold text-[#0D2535]/70 hover:bg-[#F7FAFB] transition-all active:scale-95"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#2E6F8F] px-5 py-2.5 text-sm font-black text-white transition-all hover:bg-[#1E5A7A] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                            >
                                <Save size={16} />
                                {processing ? 'Saving...' : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Categories', href: '/admin/categories' },
        { title: 'Create', href: '/admin/categories/create' }
    ]
};
