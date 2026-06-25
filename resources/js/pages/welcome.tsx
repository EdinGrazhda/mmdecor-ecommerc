import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { precacheImages } from '@/lib/media';
import { CatalogSection } from './store/CatalogSection';
import { HeroCarousel } from './store/HeroCarousel';
import { PromoBanner } from './store/PromoBanner';
import { StoreFooter } from './store/StoreFooter';
import { StoreNavbar } from './store/StoreNavbar';
import type { Banner, Campaign, Category, Product } from './store/types';
import { CartProvider, useCart } from './store/CartContext';

interface WelcomeProps {
    products?: Product[] | { data?: Product[] };
    categories?: Category[] | { data?: Category[] };
    banners?: Banner[] | { data?: Banner[] };
    campaigns?: Campaign[] | { data?: Campaign[] };
}

export default function Welcome({
    products = [],
    categories = [],
    banners = [],
    campaigns = [],
}: WelcomeProps) {
    return (
        <CartProvider>
            <WelcomeContent
                products={products}
                categories={categories}
                banners={banners}
                campaigns={campaigns}
            />
        </CartProvider>
    );
}

function WelcomeContent({
    products,
    categories,
    banners,
    campaigns,
}: WelcomeProps) {
    const { cartCount, setCartOpen, handleAddToCart } = useCart();
    const [catSidebarOpen, setCatSidebarOpen] = useState(false);

    const handleOpenCategories = useCallback(() => setCatSidebarOpen(true), []);
    const productItems = resolveResourceArray(products);
    const categoryItems = resolveResourceArray(categories);
    const bannerItems = resolveResourceArray(banners);
    const campaignItems = resolveResourceArray(campaigns);
    
    const pricedProductItems = useMemo(
        () => applyCampaignPricing(productItems, campaignItems),
        [campaignItems, productItems],
    );

    useEffect(() => {
        precacheImages([
            ...bannerItems.slice(0, 3).map((banner) => banner.image),
            ...pricedProductItems.slice(0, 6).map((product) => product.image),
            ...campaignItems.slice(0, 3).map((campaign) => campaign.product?.image),
        ]);
    }, [bannerItems, campaignItems, pricedProductItems]);

    const storeCategories = [
        {
            id: 0,
            label: 'All Parts',
            count: pricedProductItems.length,
        },
        ...categoryItems,
    ];

    return (
        <>
            <Head title="AutoParts - OEM & Performance Parts" />
            <div className="min-h-screen bg-[#F7FAFB] font-sans text-[#0D2535] antialiased">
                <StoreNavbar
                    cartCount={cartCount}
                    onCartClick={() => setCartOpen(true)}
                    onMenuClick={handleOpenCategories}
                />
                <HeroCarousel
                    banners={bannerItems}
                    campaigns={campaignItems}
                    products={pricedProductItems}
                    onAddToCart={handleAddToCart}
                />
                <CatalogSection
                    categories={storeCategories}
                    products={pricedProductItems}
                    catSidebarOpen={catSidebarOpen}
                    setCatSidebarOpen={setCatSidebarOpen}
                    onAddToCart={handleAddToCart}
                />
                <PromoBanner />
                <StoreFooter />
            </div>
        </>
    );
}

function resolveResourceArray<T>(resource: T[] | { data?: T[] } | undefined) {
    if (Array.isArray(resource)) {
        return resource;
    }

    if (Array.isArray(resource?.data)) {
        return resource.data;
    }

    return [];
}

function applyCampaignPricing(products: Product[], campaigns: Campaign[]) {
    const campaignByProductId = new Map<number, Campaign>();

    campaigns.forEach((campaign) => {
        campaignByProductId.set(campaign.product_id, campaign);
    });

    return products.map((product) => {
        const campaign = campaignByProductId.get(product.id);

        if (!campaign) {
            return product;
        }

        const originalPrice = product.originalPrice ?? product.price;
        const discountPercent = Number(campaign.price);
        const discountedPrice = Math.max(
            originalPrice * (1 - discountPercent / 100),
            0,
        );

        return {
            ...product,
            price: Number(discountedPrice.toFixed(2)),
            originalPrice,
            discountPercent,
            tag: 'SALE',
        };
    });
}
