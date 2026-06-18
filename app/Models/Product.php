<?php

namespace App\Models;

use App\Support\CanProcessImages;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'product';

    protected $primaryKey = 'id';

    protected $fillable = [
        'product_id',
        'image',
        'name',
        'price',
        'stock',
        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItems::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->singleFile()
            ->acceptsMimeTypes([
                'image/avif',
                'image/jpeg',
                'image/png',
                'image/webp',
            ]);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        if (! $this->canGenerateImageConversions()) {
            return;
        }

        $this->addMediaConversion('optimized')
            ->format('webp')
            ->fit(Fit::Contain, 1400, 1400)
            ->quality(82)
            ->optimize()
            ->nonQueued();

        $this->addMediaConversion('thumb')
            ->format('webp')
            ->fit(Fit::Contain, 480, 480)
            ->quality(76)
            ->optimize()
            ->nonQueued();
    }

    private function canGenerateImageConversions(): bool
    {
        return CanProcessImages::check();
    }

    public function syncImageColumnFromMedia(): void
    {
        $mediaUrl = $this->canGenerateImageConversions()
            ? $this->getFirstMediaUrl('images', 'optimized')
            : '';

        $mediaUrl = $mediaUrl ?: $this->getFirstMediaUrl('images');

        if ($mediaUrl !== '' && $this->image !== $mediaUrl) {
            $this->forceFill(['image' => $mediaUrl])->saveQuietly();
        }
    }
}
