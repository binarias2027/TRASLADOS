/* =========================================================
   SPB · Programación de Traslado — Service Worker
   ---------------------------------------------------------
   IMPORTANTE: cada vez que subas una nueva versión del HTML
   (o de este mismo archivo), sube también el número de
   CACHE_VERSION de abajo. Eso hace que:
     - se borre la caché vieja automáticamente
     - todos los que tengan la PWA instalada reciban la
       versión nueva la próxima vez que abran la app
       (con conexión a internet), sin tener que desinstalar
       ni reinstalar nada.
========================================================= */
const CACHE_VERSION = 'v18';
const CACHE_NAME = 'spb-traslado-' + CACHE_VERSION;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

/* Instalación: guarda el "esqueleto" de la app.
   No dejamos que un solo recurso que falle tumbe la instalación entera. */
self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return Promise.all(
        PRECACHE_URLS.map(function(url){
          return cache.add(url).catch(function(err){
            console.warn('[SW] No se pudo precachear', url, err);
          });
        })
      );
    })
  );
});

/* Activación: borra cachés de versiones anteriores y toma control de inmediato. */
self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys
          .filter(function(key){ return key.indexOf('spb-traslado-') === 0 && key !== CACHE_NAME; })
          .map(function(key){ return caches.delete(key); })
      );
    }).then(function(){
      return self.clients.claim();
    }).then(function(){
      return self.clients.matchAll({type: 'window'});
    }).then(function(clientsArr){
      clientsArr.forEach(function(client){
        client.postMessage({type: 'SPB_SW_UPDATED', version: CACHE_VERSION});
      });
    })
  );
});

/* Navegación (abrir/recargar la app): siempre intenta traer la versión más
   nueva de la red primero; si no hay internet, usa la copia guardada. */
function handleNavigation(event){
  event.respondWith(
    fetch(event.request).then(function(response){
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function(cache){ cache.put('./index.html', copy); });
      return response;
    }).catch(function(){
      return caches.match('./index.html').then(function(cached){
        return cached || caches.match('./');
      });
    })
  );
}

/* Resto de recursos: responde rápido desde caché y, en paralelo,
   va a buscar la versión nueva a la red para la próxima vez
   (stale-while-revalidate). */
function handleAsset(event){
  event.respondWith(
    caches.match(event.request).then(function(cached){
      var network = fetch(event.request).then(function(response){
        if(response && response.status === 200){
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return response;
      }).catch(function(){ return cached; });
      return cached || network;
    })
  );
}

self.addEventListener('fetch', function(event){
  if(event.request.method !== 'GET') return;

  if(event.request.mode === 'navigate'){
    handleNavigation(event);
    return;
  }
  handleAsset(event);
});

/* Permite que la página pida "pasar a la versión nueva ya" sin esperar. */
self.addEventListener('message', function(event){
  if(event.data && event.data.type === 'SKIP_WAITING'){
    self.skipWaiting();
  }
});
