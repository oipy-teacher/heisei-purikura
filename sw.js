/* プリクラ機 Service Worker
   - 同一オリジン: ネットワーク優先（更新をすぐ反映）、オフライン時はキャッシュ
   - CDN/モデルファイル: キャッシュ優先（一度読めばオフラインでも動く。会場のWi-Fi不安定対策） */
const CACHE_NAME = 'purikura-v2';

const PRECACHE = [
  '.',
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'icon-180.png',
  'icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin) {
    // ネットワーク優先 + キャッシュ更新（オフライン時はキャッシュから）
    e.respondWith(
      fetch(e.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
  } else if (url.hostname === 'cdn.jsdelivr.net' || url.hostname === 'storage.googleapis.com') {
    // MediaPipe本体・モデル: キャッシュ優先（巨大ファイルの再取得を防ぐ）
    e.respondWith(
      caches.match(e.request).then((hit) => {
        if (hit) return hit;
        return fetch(e.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
  }
});
