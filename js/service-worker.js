const CACHE_NAME = 'yapay-zeka-macerasi-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/script.js',
  '/js/mobile-support.js',
  '/images/background-main.jpg',
  '/images/tegvbot.png',
  '/images/planet1.png',
  '/images/planet2.png',
  '/images/planet3.png',
  '/images/planet4.png',
  '/images/planet5.png',
  '/images/planet6.png',
  '/audio/bg-music.mp3',
  '/audio/click.wav',
  '/audio/correct.mp3',
  '/audio/wrong.mp3',
  '/audio/victory.mp3',
  '/manifest.json'
  // Diğer tüm görseller ve ses dosyaları buraya eklenebilir
];

// Service Worker kurulumu
self.addEventListener('install', (event) => {
  console.log('Service Worker kurulumu yapılıyor...');
  
  // Önbelleğe almak istediğimiz dosyaları ekliyoruz
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Önbellek açıldı');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        // Kurulum tamamlandığında hemen aktif hale geçir
        return self.skipWaiting();
      })
  );
});

// Aktif olduğunda eski önbelleği temizle
self.addEventListener('activate', (event) => {
  console.log('Service Worker aktif edildi');
  
  // Eski önbellekleri temizle
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eski önbellek siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Yeni service worker'ın hemen kontrolü almasını sağla
      return self.clients.claim();
    })
  );
});

// Ağ isteklerini yakala
self.addEventListener('fetch', (event) => {
  console.log('Fetch isteği:', event.request.url);
  
  event.respondWith(
    // Önce önbellekte ara, yoksa ağdan getir ve önbelleğe ekle
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Önbellekten döndürüldü:', event.request.url);
          return cachedResponse;
        }
        
        // Önbellekte yoksa ağdan getir
        return fetch(event.request)
          .then((response) => {
            // Geçerli bir yanıt mı kontrol et
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log('Ağdan alındı, önbelleğe eklenemedi:', event.request.url);
              return response;
            }
            
            // Yanıtın bir kopyasını önbelleğe ekle
            let responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('Önbelleğe eklendi:', event.request.url);
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('Fetch hatası:', error);
            // Burada offline durumunda gösterilecek bir offline sayfası dönebilirsin
          });
      })
  );
});

// Push bildirim desteği
self.addEventListener('push', (event) => {
  if (event.data) {
    const notificationData = event.data.json();
    const options = {
      body: notificationData.body,
      icon: '/images/app-icon-192.png',
      badge: '/images/notification-badge.png',
      vibrate: [100, 50, 100],
      data: {
        url: notificationData.url
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(notificationData.title, options)
    );
  }
});

// Bildirime tıklandığında
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.matchAll({type: 'window'})
        .then((clientList) => {
          // Eğer zaten açık bir pencere varsa, ona odaklan
          for (let client of clientList) {
            if (client.url === event.notification.data.url && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Yoksa yeni pencere aç
          if (clients.openWindow) {
            return clients.openWindow(event.notification.data.url);
          }
        })
    );
  }
}); 