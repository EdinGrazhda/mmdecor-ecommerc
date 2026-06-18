const IMAGE_CACHE = 'mmdecor-images-v1';

self.addEventListener('message', (event) => {
    if (event.data?.type !== 'PRECACHE_IMAGES') {
        return;
    }

    const urls = Array.isArray(event.data.payload) ? event.data.payload : [];

    event.waitUntil(
        caches.open(IMAGE_CACHE).then((cache) =>
            Promise.all(
                urls.map(async (url) => {
                    try {
                        await cache.add(url);
                    } catch {
                        // Ignore individual image cache failures.
                    }
                }),
            ),
        ),
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const acceptsImage = request.destination === 'image'
        || request.headers.get('accept')?.includes('image');

    if (!acceptsImage || request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.open(IMAGE_CACHE).then(async (cache) => {
            const cached = await cache.match(request);

            if (cached) {
                void fetch(request)
                    .then((response) => {
                        if (response.ok) {
                            void cache.put(request, response.clone());
                        }
                    })
                    .catch(() => {});

                return cached;
            }

            const response = await fetch(request);

            if (response.ok) {
                void cache.put(request, response.clone());
            }

            return response;
        }),
    );
});
