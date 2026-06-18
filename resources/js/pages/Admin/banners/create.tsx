import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        subtitle: '',
        image: null as File | null,
    });
    const previewUrl = useMemo(
        () => (data.image ? URL.createObjectURL(data.image) : null),
        [data.image],
    );

    useEffect(
        () => () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        },
        [previewUrl],
    );

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/banners', { forceFormData: true });
    }

    return (
        <>
            <Head title="Admin - Create Banner" />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-4 border-b border-[#D1E8F2]/60 pb-6">
                    <Link
                        href="/admin/banners"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">
                            Create Banner
                        </h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Add a new homepage banner for the storefront.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <BannerFields
                            data={data}
                            errors={errors}
                            setData={setData}
                            previewUrl={previewUrl}
                        />

                        <div className="flex justify-end gap-3 border-t border-[#F0F7FB] pt-6">
                            <Link
                                href="/admin/banners"
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
                                {processing ? 'Saving...' : 'Save Banner'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

interface BannerFormData {
    title: string;
    subtitle: string;
    image: File | null;
}

interface BannerFieldsProps {
    data: BannerFormData;
    errors: Partial<Record<keyof BannerFormData, string>>;
    setData: (field: keyof BannerFormData, value: string | File | null) => void;
    previewUrl?: string | null;
}

export function BannerFields({ data, errors, setData, previewUrl }: BannerFieldsProps) {
    return (
        <>
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-black text-[#0D2535]"
                >
                    Banner Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className={`mt-1.5 w-full rounded-xl border ${
                        errors.title
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                    } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] transition-colors focus:outline-none`}
                    placeholder="e.g., Summer Upgrade Event"
                />
                {errors.title && (
                    <p className="mt-1.5 text-xs font-semibold text-red-500">
                        {errors.title}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="subtitle"
                    className="block text-sm font-black text-[#0D2535]"
                >
                    Subtitle
                </label>
                <textarea
                    id="subtitle"
                    rows={3}
                    value={data.subtitle}
                    onChange={(e) => setData('subtitle', e.target.value)}
                    className={`mt-1.5 w-full rounded-xl border ${
                        errors.subtitle
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                    } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] transition-colors focus:outline-none`}
                    placeholder="Short supporting text shown in the hero carousel."
                />
                {errors.subtitle && (
                    <p className="mt-1.5 text-xs font-semibold text-red-500">
                        {errors.subtitle}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="image"
                    className="block text-sm font-black text-[#0D2535]"
                >
                    Banner Image
                </label>
                <input
                    id="image"
                    type="file"
                    accept="image/webp,image/png,image/jpeg,image/avif"
                    onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                    className={`mt-1.5 w-full rounded-xl border ${
                        errors.image
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                    } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] transition-colors focus:outline-none`}
                />
                <p className="mt-1.5 text-xs text-[#0D2535]/45">
                    Upload JPG, PNG, AVIF, or WebP. Storefront delivery uses an optimized WebP conversion.
                </p>
                {errors.image && (
                    <p className="mt-1.5 text-xs font-semibold text-red-500">
                        {errors.image}
                    </p>
                )}
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Banner preview"
                        className="mt-3 h-32 w-56 rounded-xl border border-[#D1E8F2] object-cover"
                    />
                )}
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Banners', href: '/admin/banners' },
        { title: 'Create', href: '/admin/banners/create' },
    ],
};
