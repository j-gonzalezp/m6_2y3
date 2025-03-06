const CACHE_NAME = 'hospital-app-v2';
const STATIC_CACHE_NAME = 'hospital-static-v2';
const DYNAMIC_CACHE_NAME = 'hospital-dynamic-v2';
const DATA_CACHE_NAME = 'hospital-data-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg'
];

// Add IndexedDB support to service worker
const DB_NAME = 'hospitalDB';
const DB_VERSION = 1;

// Helper to open IndexedDB
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject("Error opening IndexedDB");
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('appointments')) {
        db.createObjectStore('appointments', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('doctors')) {
        db.createObjectStore('doctors', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('patients')) {
        db.createObjectStore('patients', { keyPath: 'id' });
      }
    };
  });
};

// Install and cache essential resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  const cacheAllowlist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, DATA_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return !cacheAllowlist.includes(cacheName);
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Implement different strategies based on request type
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // For API requests, attempt network first, fallback to cached data
  if (url.origin === 'http://localhost:5000') {
    event.respondWith(networkFirstWithIndexedDBFallback(event.request));
    return;
  }
  
  // For static assets, use cache-first
  if (event.request.url.match(/\.(svg|css|js)$/)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }
  
  // For HTML pages, use stale-while-revalidate
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }
  
  // For other requests, use network with fallback to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone and cache successful responses
        const clonedResponse = response.clone();
        
        caches.open(DYNAMIC_CACHE_NAME)
          .then(cache => {
            cache.put(event.request, clonedResponse);
          });
          
        return response;
      })
      .catch(() => {
        // If fetch fails, try cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If html request and not in cache, return offline page
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            // Otherwise return nothing
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Network first with fallback to IndexedDB/cache for API requests
async function networkFirstWithIndexedDBFallback(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.ok) {
      // Clone response to store in cache
      const clonedResponse = networkResponse.clone();
      
      // Cache the API response
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, clonedResponse.clone());
      
      // If it's a data response we want to keep in IndexedDB, store it
      if (request.url.includes('/doctors') || 
          request.url.includes('/appointments') || 
          request.url.includes('/patients')) {
        try {
          const data = await clonedResponse.json();
          const endpoint = new URL(request.url).pathname.split('/')[1];
          if (data && Array.isArray(data)) {
            const db = await openDB();
            const tx = db.transaction(endpoint, 'readwrite');
            const store = tx.objectStore(endpoint);
            
            for (const item of data) {
              store.put(item);
            }
          }
        } catch (err) {
          console.error('Error storing API data in IndexedDB:', err);
        }
      }
      
      return networkResponse;
    }
    throw new Error('Network response was not ok');
  } catch (error) {
    console.error('Fetch failed; returning cached or offline data', error);
    
    // Try to get from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, try to get from IndexedDB for specific endpoints
    const url = new URL(request.url);
    const endpoint = url.pathname.split('/')[1];
    
    if (['doctors', 'appointments', 'patients'].includes(endpoint)) {
      try {
        const db = await openDB();
        const tx = db.transaction(endpoint, 'readonly');
        const store = tx.objectStore(endpoint);
        const data = await new Promise((resolve, reject) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject("Error getting data from IndexedDB");
        });
        
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        console.error('Error retrieving data from IndexedDB:', err);
      }
    }
    
    // Last resort: return offline response
    return new Response(JSON.stringify({ offline: true, message: 'No internet connection' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Cache-first strategy function
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Stale-While-Revalidate strategy function
async function staleWhileRevalidate(request) {
  // Try to get from cache first
  const cachedResponse = await caches.match(request);
  
  // Fetch from network in the background
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      // Update cache with new response
      caches.open(DYNAMIC_CACHE_NAME)
        .then(cache => cache.put(request, networkResponse.clone()));
      
      return networkResponse;
    })
    .catch(error => {
      console.error('Fetch failed:', error);
      
      // If it's an HTML request and fetch fails, return the offline page
      if (request.headers.get('accept')?.includes('text/html')) {
        return caches.match('/offline.html');
      }
      
      return new Response('Network error', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' }
      });
    });
  
  // Return the cached response immediately if we have it
  // or wait for the network response
  return cachedResponse || fetchPromise;
} 