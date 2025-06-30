const CACHE_NAME = 'ashwak-portfolio-v1';
const IMAGE_CACHE_NAME = 'ashwak-images-v1';
const STATIC_CACHE_NAME = 'ashwak-static-v1';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'
];

// Image files to cache
const IMAGE_FILES = [
    // Wedding images
    "Wedding /7M400889-1.jpg","Wedding /7M401119-1.jpg","Wedding /7M401761_1-1.jpg","Wedding /7M401772_1-1.jpg","Wedding /7M401838-2.jpg","Wedding /7M401870-1.jpg","Wedding /7M401899.jpg","Wedding /ASH00014-Enhanced-RD.jpg","Wedding /ASH02858.jpg","Wedding /ASH02870.jpg","Wedding /ASH02903.jpg","Wedding /ASH02969.jpg","Wedding /ASH03000.JPG","Wedding /ASH03127.JPG","Wedding /ASH03702.JPG","Wedding /ASH03716.JPG","Wedding /DSC07011 (1).jpg","Wedding /DSC07100.jpg","Wedding /DSC07417 (1).jpg","Wedding /DSC09269.JPG","Wedding /DSC09684.jpg","Wedding /DSC09720-.jpg","Wedding /DSC09727-.jpg","Wedding /DSC6310-.jpg","Wedding /DSC_2390-01.jpeg","Wedding /DSC_2421-01.jpeg","Wedding /DSC_2610-01.jpeg","Wedding /DSC_3479-02.jpeg","Wedding /DSC_3482-01.jpeg","Wedding /DSC_3485-01.jpeg","Wedding /DSC_3493 (1)-02.jpeg","Wedding /DSC_3687-01.jpeg","Wedding /DSC_3711-01.jpeg","Wedding /DSC_8580-1-01.jpeg","Wedding /IMG_3169.JPG","Wedding /IMG_3170.JPG","Wedding /IMG_3171.JPG","Wedding /IMG_3172.JPG","Wedding /IMG_3173.JPG","Wedding /IMG_3174.JPG","Wedding /IMG_3176.JPG","Wedding /IMG_3177.JPG","Wedding /IMG_3178.JPG","Wedding /IMG_3179.JPG","Wedding /IMG_3180.JPG","Wedding /IMG_3181.JPG","Wedding /IMG_3182.JPG","Wedding /IMG_3183.JPG","Wedding /_ASH5474.jpg","Wedding /_ASH5486.jpg","Wedding /_ASH6552.jpg","Wedding /_ASH6562.jpg","Wedding /_ASH6605.jpg","Wedding /_ASH6623.jpg","Wedding /_ASH6817.jpg","Wedding /_ASH6822.jpg","Wedding /_ASH6861.jpg","Wedding /_ASH6870.jpg","Wedding /_ASH6958.jpg","Wedding /_ASH7059.jpg","Wedding /_ASH7100.jpg","Wedding /_ASH7122.jpg","Wedding /_ASH7214.jpg","Wedding /_ASH7218.jpg","Wedding /_ASH7232.jpg","Wedding /_ASH7235.jpg","Wedding /_ASH7628.jpg","Wedding /_ASH7674.jpg","Wedding /_ASH9776.jpg","Wedding /_ASH9827.jpg","Wedding /_ASH9835.jpg","Wedding /_ASH9842.jpg","Wedding /_ASH9858.jpg","Wedding /_ASH9872.jpg","Wedding /_ASH9891.jpg","Wedding /_DSC0596-.jpg","Wedding /_DSC0696-.jpg","Wedding /_DSC0723-.jpg","Wedding /_DSC0856-.jpg","Wedding /_DSC0893-.jpg","Wedding /_DSC5453-.jpg","Wedding /_DSC5473-.jpg","Wedding /_DSC6736.jpg","Wedding /_DSC6835.jpg","Wedding /_DSC7162_1.jpg","Wedding /_DSC7171.jpg","Wedding /_DSC7224.jpg","Wedding /_DSC7383.jpg","Wedding /_DSC7448.jpg","Wedding /_DSC7463.jpg","Wedding /_DSC7603-.jpg","Wedding /_DSC7917-.jpg","Wedding /_DSC7923-.jpg","Wedding /_DSC7926-.jpg","Wedding /_DSC8011.jpg","Wedding /_DSC8211-.jpg","Wedding /_DSC8242- 2.jpg","Wedding /_DSC8257- 33.jpg",
    // Pics images
    "Pics /01.jpg","Pics /04.jpg","Pics /05.jpg","Pics /07.jpg","Pics /09.jpg","Pics /10.jpg","Pics /11(1).jpg","Pics /11.jpg","Pics /12.jpg","Pics /13.jpg","Pics /14.jpg","Pics /15.jpg","Pics /16.jpg","Pics /17.jpg","Pics /18.jpg","Pics /19.jpg","Pics /20.jpg","Pics /21.jpg","Pics /22.jpg","Pics /25.jpg","Pics /26.jpg","Pics /A(10).jpg","Pics /DSC00032.jpg","Pics /DSC00457(1).jpg","Pics /DSC00709(1).jpg","Pics /DSC01331.jpg","Pics /DSC01338.jpg","Pics /DSC01503 (1).jpg","Pics /DSC01544.jpg","Pics /DSC01918.jpg","Pics /DSC02009.jpg","Pics /DSC02048.jpg","Pics /DSC02114.jpg","Pics /DSC02159.jpg","Pics /DSC02188.jpg","Pics /DSC02196.jpg","Pics /DSC02391.jpg","Pics /DSC02402.jpg","Pics /DSC02403.jpg","Pics /DSC02412-1.jpg","Pics /DSC02421.jpg","Pics /DSC02429.jpg","Pics /DSC02435.jpg","Pics /DSC02437.jpg","Pics /DSC02449.jpg","Pics /DSC02753.jpg","Pics /DSC02772.jpg","Pics /DSC02780.jpg","Pics /DSC02800-1.jpg","Pics /DSC04773.JPG","Pics /DSC04788.JPG","Pics /DSC04804.JPG","Pics /_DSC0050.JPG","Pics /_DSC0084.JPG","Pics /_DSC0428.JPG"
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE_NAME).then(cache => {
                console.log('Caching static files...');
                return cache.addAll(STATIC_FILES);
            }),
            caches.open(IMAGE_CACHE_NAME).then(cache => {
                console.log('Caching images...');
                return cache.addAll(IMAGE_FILES);
            })
        ])
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE_NAME && 
                        cacheName !== IMAGE_CACHE_NAME && 
                        cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Handle image requests
    if (event.request.destination === 'image') {
        event.respondWith(
            caches.open(IMAGE_CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    if (response) {
                        console.log('Serving image from cache:', url.pathname);
                        return response;
                    }
                    
                    return fetch(event.request).then(networkResponse => {
                        if (networkResponse.ok) {
                            console.log('Caching new image:', url.pathname);
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Return a placeholder image if network fails
                        return new Response(
                            '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#999">Image Not Available</text></svg>',
                            { headers: { 'Content-Type': 'image/svg+xml' } }
                        );
                    });
                });
            })
        );
        return;
    }
    
    // Handle static file requests
    if (STATIC_FILES.includes(url.pathname) || url.pathname === '/') {
        event.respondWith(
            caches.open(STATIC_CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    if (response) {
                        console.log('Serving static file from cache:', url.pathname);
                        return response;
                    }
                    
                    return fetch(event.request).then(networkResponse => {
                        if (networkResponse.ok) {
                            console.log('Caching new static file:', url.pathname);
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }
    
    // For other requests, try network first, then cache
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Preload images in background
        const imageCache = await caches.open(IMAGE_CACHE_NAME);
        for (const imageUrl of IMAGE_FILES) {
            try {
                const response = await fetch(imageUrl);
                if (response.ok) {
                    await imageCache.put(imageUrl, response);
                }
            } catch (error) {
                console.log('Failed to cache image:', imageUrl);
            }
        }
        console.log('Background sync completed');
    } catch (error) {
        console.log('Background sync failed:', error);
    }
}

// Message handling for cache management
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_IMAGES') {
        event.waitUntil(cacheImages(event.data.images));
    }
});

async function cacheImages(imageUrls) {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    const promises = imageUrls.map(async url => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
                console.log('Cached image:', url);
            }
        } catch (error) {
            console.log('Failed to cache image:', url);
        }
    });
    
    await Promise.all(promises);
    console.log('Image caching completed');
} 