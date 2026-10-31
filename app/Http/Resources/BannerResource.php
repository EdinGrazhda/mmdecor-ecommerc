<?php

namespace App\Http\Resources;

use App\Support\ResolvesMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $image = $this->resource->getFirstMedia('images')
            ? ResolvesMediaUrl::primary($this->resource, 'images')
            : ($this->relationLoaded('product')
                ? ResolvesMediaUrl::primary($this->product, 'images', $this->product?->image)
                : $this->image);

        return [
            'id' => $this->id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'image' => $image,
            'image_thumb' => ResolvesMediaUrl::thumb($this->resource, 'images', $this->image),
            'product_id' => $this->product_id,
            'product' => $this->whenLoaded('product', fn () => new ProductResource($this->product)),
            'selected_products' => $this->whenLoaded('selectedProducts', fn () => ProductResource::collection($this->selectedProducts)),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
