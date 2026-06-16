import type { LucideIcon } from 'lucide-react';

export interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    originalPrice: number | null;
    rating: number;
    reviews: number;
    tag: string | null;
    category: string;
}

export interface FeaturedProduct {
    name: string;
    brand: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    inStock: boolean;
    fitment: string;
    discountPct: number;
}

export interface HeroSlide {
    id: number;
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    ctaAlt: string;
    chips: string[];
    slideLabel: string;
    featured: FeaturedProduct;
}

export interface Category {
    id: number;
    label: string;
    count: number;
}

export interface TrustItem {
    icon: LucideIcon;
    label: string;
    desc: string;
}
