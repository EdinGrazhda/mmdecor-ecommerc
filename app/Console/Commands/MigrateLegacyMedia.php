<?php

namespace App\Console\Commands;

use App\Models\Banner;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;

class MigrateLegacyMedia extends Command
{
    protected $signature = 'media:migrate-legacy-images {--force : Replace existing media too}';

    protected $description = 'Move legacy product and banner image paths into Spatie Media Library.';

    public function handle(): int
    {
        $force = (bool) $this->option('force');

        $products = $this->migrate(Product::query()->get(), 'images', $force);
        $banners = $this->migrate(Banner::query()->get(), 'images', $force);

        $this->info("Migrated {$products} product images and {$banners} banner images.");

        return self::SUCCESS;
    }

    /**
     * @param iterable<int, Model&HasMedia> $models
     */
    private function migrate(iterable $models, string $collection, bool $force): int
    {
        $migrated = 0;

        foreach ($models as $model) {
            if (! $force && $model->hasMedia($collection)) {
                continue;
            }

            $image = (string) ($model->image ?? '');

            if ($image === '') {
                continue;
            }

            $mediaAdder = $this->mediaAdder($model, $image);

            if (! $mediaAdder) {
                $this->warn(sprintf(
                    'Skipped %s #%s: image not found (%s).',
                    $model::class,
                    $model->getKey(),
                    $image,
                ));
                continue;
            }

            $mediaAdder
                ->usingName(pathinfo(parse_url($image, PHP_URL_PATH) ?: $image, PATHINFO_FILENAME))
                ->toMediaCollection($collection);

            if (method_exists($model, 'syncImageColumnFromMedia')) {
                $model->syncImageColumnFromMedia();
            }

            $migrated++;
        }

        return $migrated;
    }

    private function mediaAdder(HasMedia $model, string $image): mixed
    {
        if (Str::startsWith($image, ['http://', 'https://'])) {
            return $model->addMediaFromUrl($image);
        }

        $path = $this->resolveLocalPath($image);

        return $path ? $model->addMedia($path)->preservingOriginal() : null;
    }

    private function resolveLocalPath(string $image): ?string
    {
        $path = parse_url($image, PHP_URL_PATH) ?: $image;
        $path = ltrim($path, '/\\');

        $candidates = [
            public_path($path),
            public_path('storage/'.$path),
            storage_path('app/public/'.$path),
        ];

        foreach ($candidates as $candidate) {
            if (File::isFile($candidate)) {
                return $candidate;
            }
        }

        return null;
    }
}
