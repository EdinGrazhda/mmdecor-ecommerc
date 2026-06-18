import { Star } from 'lucide-react';
import { memo } from 'react';

interface StarRatingProps {
    rating: number;
    /** 'brand' = blue (product cards), 'amber' = gold (hero card) */
    variant?: 'brand' | 'amber';
    size?: number;
}

export const StarRating = memo(function StarRating({
    rating,
    variant = 'brand',
    size = 10,
}: StarRatingProps) {
    const filled =
        variant === 'amber'
            ? 'fill-amber-400 text-amber-400'
            : 'fill-[#2E6F8F] text-[#2E6F8F]';
    const empty =
        variant === 'amber'
            ? 'fill-white/20 text-white/20'
            : 'fill-gray-200 text-gray-200';

    return (
        <span className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    size={size}
                    className={i <= Math.round(rating) ? filled : empty}
                />
            ))}
        </span>
    );
});
