export function normalizeImageUrl(image?: string | null) {
    if (!image) {
        return null;
    }

    if (/^(https?:)?\/\//.test(image) || image.startsWith('/')) {
        return image;
    }

    return `/storage/${image}`;
}

export function precacheImages(images: Array<string | null | undefined>) {
    if (typeof window === 'undefined') {
        return;
    }

    const urls = images
        .map((image) => normalizeImageUrl(image))
        .filter((url): url is string => Boolean(url));

    if (urls.length === 0) {
        return;
    }

    const run = () => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'PRECACHE_IMAGES',
                payload: urls,
            });
            return;
        }

        urls.forEach((url) => {
            void fetch(url, { cache: 'force-cache', credentials: 'same-origin' });
        });
    };

    const browserWindow = window as Window & {
        requestIdleCallback?: (callback: IdleRequestCallback) => number;
    };

    if (browserWindow.requestIdleCallback) {
        browserWindow.requestIdleCallback(run);
    } else {
        globalThis.setTimeout(run, 250);
    }
}
