const CACHE_NAME = 'papermock-v11-core';

// Cache Strategy: Stale-While-Revalidate for local, Cache-First for CDNs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. External CDNs (esm.sh, tailwind, fonts) -> Cache First
  if (
    url.hostname === 'esm.sh' || 
    url.hostname === 'cdn.tailwindcss.com' || 
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;
        
        try {
          const fetchResponse = await fetch(event.request);
          if(fetchResponse.status === 200) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        } catch (e) {
          // If offline and not in cache, we can't do much for external assets
          return new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  // 2. Local App Files -> Stale-While-Revalidate
  // This ensures the user sees the cached version instantly, but updates in background
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if(networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
          // Swallow error if offline
          return cachedResponse; 
      });

      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});