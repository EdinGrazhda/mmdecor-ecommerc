import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { BannerFields, type DiscountedProduct } from './create';

interface BannerProduct {
    id: number;
    name: string;
    image: string | null;
}

interface Banner {
    id: number;
    title: string;
    subtitle: string;
    image: string | null;
    product_id: number | null;
    product?: BannerProduct | null;
}

interface EditProps {
    banner: Banner;
    discountedProducts: DiscountedProduct[];
}

export default function Edit({ banner, discountedProducts }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put' as const,
        title: banner.title,
        subtitle: banner.subtitle,
        product_id: (banner.product_id ?? '') as string | number,
        image: null as File | null,
    });

    const selectedProduct = useMemo(
        () => discountedProducts.find((p) => p.id === Number(data.product_id)) ?? null,
        [data.product_id, discountedProducts],
    );

    const previewUrl = useMemo(
        () =>
            data.image
                ? URL.createObjectURL(data.image)
                : selectedProduct?.image ?? banner.image,
        [banner.image, data.image, selectedProduct],
    );

    useEffect(
        () => () => {
            if (data.image && previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        },
        [data.image, previewUrl],
    );

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admin/banners/${banner.id}`, {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title={`Admin - Edit ${banner.title}`} />
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
                            Edit Banner
                        </h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Update the banner shown on the storefront.
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
                            discountedProducts={discountedProducts}
                            selectedProduct={selectedProduct}
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
                                {processing ? 'Saving...' : 'Update Banner'}
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
        { title: 'Banners', href: '/admin/banners' },
        { title: 'Edit', href: '#' },
    ],
};
