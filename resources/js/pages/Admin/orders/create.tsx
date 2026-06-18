import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, PackageCheck } from 'lucide-react';

export default function Create() {
    return (
        <>
            <Head title="Admin - Create Order" />
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center gap-4 border-b border-[#D1E8F2]/60 pb-6">
                    <Link
                        href="/admin/orders"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1E8F2] bg-white text-[#2E6F8F] transition-all hover:scale-105 hover:bg-[#EBF3F7] active:scale-95"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-[#0D2535] sm:text-3xl">
                            Create Order
                        </h1>
                        <p className="mt-1 text-sm text-[#0D2535]/50">
                            Orders are created from customer checkout.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#2E6F8F]/15 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF3F7] text-[#2E6F8F]">
                        <PackageCheck size={26} />
                    </div>
                    <h2 className="mt-5 text-lg font-black text-[#0D2535]">
                        Manual order creation is not enabled
                    </h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#0D2535]/50">
                        The current admin controller supports reviewing,
                        updating, and deleting orders that customers place from
                        the storefront.
                    </p>
                    <Link
                        href="/admin/orders"
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#2E6F8F] px-5 py-2.5 text-sm font-black text-white transition-all hover:bg-[#1E5A7A] active:scale-95"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Orders', href: '/admin/orders' },
        { title: 'Create', href: '/admin/orders/create' },
    ],
};
