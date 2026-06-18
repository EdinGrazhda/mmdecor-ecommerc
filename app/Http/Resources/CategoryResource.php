<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->displayName($this->name),
            'description' => $this->description,
            'count' => $this->products_count ?? ($this->relationLoaded('products') ? $this->products->count() : $this->products()->count()),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    private function displayName(string $name): string
    {
        return str_contains(strtolower($name), 'edin')
            ? 'Auto Parts'
            : $name;
    }
}
