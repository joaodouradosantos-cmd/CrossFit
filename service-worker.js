const CACHE_NAME = "crossfit-cache-v6"; 
// ↑ Quando quiseres forçar atualização basta mudar para v7, v8, v9...

const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./imagens/crossmoita_logo.png"
];

// INSTALAÇÃO — cria cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting(); // força ativação imediata
});

// ATIVAÇÃO — apaga caches antigos automaticamente
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// FETCH — sempre que existirem ficheiros novos, atualiza
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request)
        .then(response => {
          // Atualiza cache com versões novas
          caches
            .open(CACHE_NAME)
            .then(cache => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
