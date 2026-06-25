import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    product_id: string; // SKU
    name: string;
    image: string | null;
    images?: Array<{ url: string; thumb: string }>;
    price: number;
    stock: number;
    category_id: number;
}

interface EditProps {
    product: Product | { data: Product };
    categories: Category[];
}

export default function Edit({ product, categories }: EditProps) {
    const resolvedProduct = 'data' in product ? product.data : product;
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put' as const,
        product_id: resolvedProduct.product_id,
        name: resolvedProduct.name,
        images: [] as File[],
        price: String(resolvedProduct.price),
        stock: String(resolvedProduct.stock),
        category_id: String(resolvedProduct.category_id),
    });
    const previewUrls = useMemo(
        () => data.images.map((image) => URL.createObjectURL(image)),
        [data.images],
    );
    const currentImages = resolvedProduct.images?.length
        ? resolvedProduct.images
        : resolvedProduct.image
            ? [{ url: resolvedProduct.image, thumb: resolvedProduct.image }]
            : [];

    useEffect(
        () => () => {
            previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
        },
        [previewUrls],
    );

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admin/products/${resolvedProduct.id}`, {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title={`Admin - Edit ${resolvedProduct.name}`} />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-[#D1E8F2]/60 pb-6 mb-8">
                    <Link
                        href="/admin/products"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] hover:bg-[#EBF3F7] transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">
                            Edit Product
                        </h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Modify product details and inventory values.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* SKU */}
                            <div>
                                <label htmlFor="product_id" className="block text-sm font-black text-[#0D2535]">
                                    Product SKU / Unique ID
                                </label>
                                <input
                                    id="product_id"
                                    type="text"
                                    value={data.product_id}
                                    onChange={(e) => setData('product_id', e.target.value)}
                                    className={`mt-1.5 w-full rounded-xl border ${
                                        errors.product_id ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                    } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                                    placeholder="e.g., PROD-001"
                                />
                                {errors.product_id && (
                                    <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.product_id}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category_id" className="block text-sm font-black text-[#0D2535]">
                                    Category
                                </label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className={`mt-1.5 w-full rounded-xl border ${
                                        errors.category_id ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                    } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                                >
                                    <option value="">Select a Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.category_id}</p>
                                )}
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-black text-[#0D2535]">
                                Product Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`mt-1.5 w-full rounded-xl border ${
                                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                                placeholder="e.g., Premium Ceramic Brake Pads"
                            />
                            {errors.name && (
                                <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Image */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-black text-[#0D2535]">
                                Product Images
                            </label>
                            <input
                                id="image"
                                type="file"
                                multiple
                                accept="image/webp,image/png,image/jpeg,image/avif"
                                onChange={(e) => setData('images', Array.from(e.target.files ?? []).slice(0, 4))}
                                className={`mt-1.5 w-full rounded-xl border ${
                                    errors.images ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                            />
                            <p className="mt-1.5 text-xs text-[#0D2535]/45">
                                Leave this untouched to keep the current gallery, or upload 1 to 4 images to replace it.
                            </p>
                            {errors.images && (
                                <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.images}</p>
                            )}
                            {(previewUrls.length > 0 || currentImages.length > 0) && (
                                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {(previewUrls.length > 0 ? previewUrls.map((url) => ({ url, thumb: url })) : currentImages).map((image, index) => (
                                        <img
                                            key={`${image.thumb}-${index}`}
                                            src={normalizeImageUrl(image.thumb)}
                                            alt={`${resolvedProduct.name} ${index + 1}`}
                                            className="aspect-square w-full rounded-xl border border-[#D1E8F2] object-cover"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-black text-[#0D2535]">
                                    Price ($)
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className={`mt-1.5 w-full rounded-xl border ${
                                        errors.price ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                    } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                                    placeholder="e.g., 49.99"
                                />
                                {errors.price && (
                                    <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.price}</p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-black text-[#0D2535]">
                                    Stock Quantity
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    className={`mt-1.5 w-full rounded-xl border ${
                                        errors.stock ? 'border-red-300 focus:border-red-500' : 'border-[#D1E8F2] focus:border-[#2E6F8F]'
                                    } bg-white px-4 py-3 text-sm font-medium text-[#0D2535] focus:outline-none`}
                                    placeholder="e.g., 100"
                                />
                                {errors.stock && (
                                    <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.stock}</p>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 border-t border-[#F0F7FB] pt-6">
                            <Link
                                href="/admin/products"
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
                                {processing ? 'Saving...' : 'Update Product'}
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
        { title: 'Products', href: '/admin/products' },
        { title: 'Edit', href: '#' }
    ]
};

function normalizeImageUrl(image: string) {
    if (/^(https?:)?\/\//.test(image) || image.startsWith('/')) {
        return image;
    }

    return `/storage/${image}`;
}
