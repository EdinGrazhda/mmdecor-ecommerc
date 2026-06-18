<?php

namespace App\Models;

use App\Support\CanProcessImages;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Banner extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'banner';

    protected $primaryKey = 'id';

    protected $fillable = [
        'title',
        'subtitle',
        'image',
    ];

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
            ->fit(Fit::Max, 1920, 1080)
            ->quality(82)
            ->optimize()
            ->nonQueued();

        $this->addMediaConversion('thumb')
            ->format('webp')
            ->fit(Fit::Crop, 720, 405)
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
