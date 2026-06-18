<?php

namespace App\Support;

class CanProcessImages
{
    public static function check(): bool
    {
        return match (config('media-library.image_driver', 'gd')) {
            'gd' => extension_loaded('gd'),
            'imagick' => extension_loaded('imagick'),
            'vips' => extension_loaded('vips'),
            default => false,
        };
    }
}
