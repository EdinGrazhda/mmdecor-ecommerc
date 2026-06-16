import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { CatalogSection } from './store/CatalogSection';
import { HeroCarousel } from './store/HeroCarousel';
import { PromoBanner } from './store/PromoBanner';
import { StoreFooter } from './store/StoreFooter';
import { StoreNavbar } from './store/StoreNavbar';

export default function Welcome() {
    const [cartCount, setCartCount] = useState(0);
    const [catSidebarOpen, setCatSidebarOpen] = useState(false);

    return (
        <>
            <Head title="AutoParts - OEM & Performance Parts" />
            <div className="min-h-screen bg-[#F7FAFB] font-sans text-[#0D2535] antialiased">
                <StoreNavbar
                    cartCount={cartCount}
                    onCartClick={() => setCartCount((c) => c + 1)}
                    onMenuClick={() => setCatSidebarOpen(true)}
                />
                <HeroCarousel onAddToCart={() => setCartCount((c) => c + 1)} />
                <CatalogSection
                    catSidebarOpen={catSidebarOpen}
                    setCatSidebarOpen={setCatSidebarOpen}
                    onAddToCart={() => setCartCount((c) => c + 1)}
                />
                <PromoBanner />
                <StoreFooter />
            </div>
        </>
    );
}
