<?php

namespace App\Support;

use Spatie\MediaLibrary\HasMedia;

class ResolvesMediaUrl
{
    public static function primary(?HasMedia $model, string $collection, ?string $legacy = null): ?string
    {
        if ($model) {
            $optimizedUrl = CanProcessImages::check()
                ? $model->getFirstMediaUrl($collection, 'optimized')
                : '';

            if ($optimizedUrl !== '') {
                return $optimizedUrl;
            }

            $originalUrl = $model->getFirstMediaUrl($collection);

            if ($originalUrl !== '') {
                return $originalUrl;
            }
        }

        return $legacy ?: null;
    }

    public static function thumb(?HasMedia $model, string $collection, ?string $legacy = null): ?string
    {
        if ($model && CanProcessImages::check()) {
            $thumbUrl = $model->getFirstMediaUrl($collection, 'thumb');

            if ($thumbUrl !== '') {
                return $thumbUrl;
            }
        }

        return self::primary($model, $collection, $legacy);
    }
}
