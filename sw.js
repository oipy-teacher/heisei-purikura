/* プリクラ機 Service Worker
   - 同一オリジン: ネットワーク優先（更新をすぐ反映）、オフライン時はキャッシュ
   - CDN/モデルファイル: キャッシュ優先（一度読めばオフラインでも動く。会場のWi-Fi不安定対策） */
const CACHE_NAME = 'purikura-v13'; // 2026-08-13 落書きを写真拡大表示方式へ刷新＋カウント音声/ポーズ順序の修正（新規アセットなし）

const PRECACHE = [
  '.',
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'icon-180.png',
  'icon-512.png',
  // デザイン刷新のSVG素材（柄本納品・会場のWi-Fiが不安定でも装飾が欠けないように）
  'assets/heisei-leopard-tile.svg',
  'assets/heisei-star-a.svg',
  'assets/heisei-star-b.svg',
  'assets/reiwa-icon-pen.svg',
  'assets/reiwa-icon-stamp.svg',
  'assets/reiwa-icon-eraser.svg',
  'assets/reiwa-icon-undo.svg',
  // 音声・BGM（会場のWi-Fiが不安定でもボイスが欠けないよう全てプリキャッシュ）
  'audio/01_start.mp3',
  'audio/02_select_curtain.mp3',
  'audio/03_select_frame.mp3',
  'audio/08_deco_start.mp3',
  'audio/09_time_warning.mp3',
  'audio/10_timeup.mp3',
  'audio/11_finish.mp3',
  'audio/12_save.mp3',
  'audio/13_beauty.mp3',
  'audio/attract_call.mp3',
  'audio/bgm.mp3',
  'audio/bgm_reiwa.mp3',
  'audio/bgm_title.mp3',
  'audio/count_1.mp3',
  'audio/count_2.mp3',
  'audio/count_3.mp3',
  'audio/count_hai.mp3',
  'audio/course_select_v2.mp3',
  'audio/doodle_halftime.mp3',
  'audio/doodle_owaru.mp3',
  'audio/intro_shot1.mp3',
  'audio/intro_shot2.mp3',
  'audio/intro_shot3.mp3',
  'audio/intro_shot4.mp3',
  'audio/moriage_select.mp3',
  'audio/pose_01.mp3',
  'audio/pose_02.mp3',
  'audio/pose_03.mp3',
  'audio/pose_04.mp3',
  'audio/pose_05.mp3',
  'audio/pose_06.mp3',
  'audio/print_out.mp3',
  'audio/se_decide.mp3',
  'audio/se_shutter.mp3',
  'audio/se_tap.mp3',
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
