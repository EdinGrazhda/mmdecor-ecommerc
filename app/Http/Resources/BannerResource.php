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
        return [
            'id' => $this->id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'image' => ResolvesMediaUrl::primary($this->resource, 'images', $this->image),
            'image_thumb' => ResolvesMediaUrl::thumb($this->resource, 'images', $this->image),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
