export interface Product {
    id: number;
    product_id?: string;
    name: string;
    brand: string;
    image?: string | null;
    image_thumb?: string | null;
    price: number;
    originalPrice: number | null;
    discountPercent?: number | null;
    rating: number;
    reviews: number;
    tag: string | null;
    stock?: number;
    category_id?: number;
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
    description?: string;
    count: number;
}

export interface Banner {
    id: number;
    title: string;
    subtitle: string;
    image: string | null;
    image_thumb?: string | null;
    product_id?: number | null;
    product?: Product | null;
}

export interface Campaign {
    id: number;
    campaing_name: string;
    description: string;
    price: number;
    start_date: string;
    end_date: string;
    product_id: number;
    product?: Product;
}

