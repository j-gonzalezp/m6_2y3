// Stale-While-Revalidate Strategy implementation
function staleWhileRevalidate(cacheName) {
  return async (request) => {
    // First, try to get the resource from the cache
    const cachedResponse = await caches.match(request);
    
    // Next, send a network request in the background
    const fetchPromise = fetch(request).then(async (networkResponse) => {
      // If we got a valid response, update the cache
      if (networkResponse && networkResponse.status === 200) {
        const cache = await caches.open(cacheName);
        // Clone the response before putting it in the cache
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }).catch(error => {
      console.error('Failed to fetch:', error);
      // You can return a fallback response if needed
      return null;
    });
    
    // Return the cached response immediately, or wait for the network
    // response if we don't have a cache hit
    return cachedResponse || fetchPromise;
  };
}

// Network-first strategy with cache fallback
function networkFirst(cacheName) {
  return async (request) => {
    try {
      // Try to get a fresh response from the network
      const networkResponse = await fetch(request);
      
      // If successful, update the cache
      if (networkResponse && networkResponse.status === 200) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      // Network request failed, try to get from cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If nothing in cache for HTML requests, return the offline page
      if (request.headers.get('accept').includes('text/html')) {
        return caches.match('/offline.html');
      }
      
      // Otherwise, propagate the error
      throw error;
    }
  };
}

// This file can be imported by the main service worker 