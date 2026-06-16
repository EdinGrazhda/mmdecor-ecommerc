<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Check for active campaign
        $activeCampaign = $this->relationLoaded('campaigns')
            ? $this->campaigns->first(fn ($c) => now()->between($c->start_date, $c->end_date))
            : $this->campaigns()->whereDate('start_date', '<=', now())->whereDate('end_date', '>=', now())->first();

        $price = (float) $this->price;
        $originalPrice = null;
        $tag = null;

        if ($activeCampaign) {
            $originalPrice = $price;
            // campaign price is the percentage discount (e.g. 20.00 for 20%)
            $discountPct = (float) $activeCampaign->price;
            $price = round($originalPrice * (1 - $discountPct / 100), 2);
            $tag = 'SALE';
        } else {
            // Determine tags like BESTSELLER or NEW deterministically
            if ($this->id % 5 === 0) {
                $tag = 'BESTSELLER';
            } elseif ($this->id % 7 === 0) {
                $tag = 'NEW';
            }
        }

        // Determine brand from the name if possible, or fallback to OEM
        $brands = ['Bosch', 'Brembo', 'Philips', 'Gates', 'KYB', 'K&N', 'Denso', 'NGK'];
        $firstWord = explode(' ', $this->name)[0] ?? '';
        $brand = in_array($firstWord, $brands) ? $firstWord : 'OEM';

        // Deterministic rating and reviews for premium feel
        $rating = round(4.0 + (($this->id * 3) % 11) * 0.1, 1);
        $reviews = (($this->id * 13) % 450) + 10;

        return [
            'id' => $this->id,
            'product_id' => $this->product_id, // SKU
            'name' => $this->name,
            'brand' => $brand,
            'image' => $this->image,
            'price' => $price,
            'originalPrice' => $originalPrice,
            'rating' => $rating,
            'reviews' => $reviews,
            'tag' => $tag,
            'stock' => (int) $this->stock,
            'category_id' => $this->category_id,
            'category' => $this->category?->name ?? 'Uncategorized',
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
