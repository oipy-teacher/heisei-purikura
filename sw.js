/* プリクラ機 Service Worker
   - 同一オリジン: ネットワーク優先（更新をすぐ反映）、オフライン時はキャッシュ
   - CDN/モデルファイル: キャッシュ優先（一度読めばオフラインでも動く。会場のWi-Fi不安定対策） */
const CACHE_NAME = 'purikura-v24'; // 2026-08-15 文言総点検の反映＋互換対応の仕上げ（新規アセットなし・CDN分岐のクエリ正規化あり）

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
  /* 新機能向け 追加ボイスパック（2026-08-15 音羽納品・27本）。
     SOUND_FILES に足したら必ずここにも足すこと（漏れるとオフライン時だけ無音になる） */
  'audio/camera_error.mp3',
  'audio/heisei_camera_ready.mp3',
  'audio/heisei_camera_wait.mp3',
  'audio/heisei_deco_gate.mp3',
  'audio/heisei_deco_photo_switch.mp3',
  'audio/heisei_korokoro.mp3',
  'audio/heisei_layout_gate.mp3',
  'audio/heisei_thanks.mp3',
  'audio/reiwa_beauty_parts.mp3',
  'audio/reiwa_camera_ready.mp3',
  'audio/reiwa_camera_wait.mp3',
  'audio/reiwa_deco_gate.mp3',
  'audio/reiwa_deco_photo_switch.mp3',
  'audio/reiwa_id_photo.mp3',
  'audio/reiwa_korokoro.mp3',
  'audio/reiwa_layout_gate.mp3',
  'audio/reiwa_makeup_history.mp3',
  'audio/reiwa_moriage_level.mp3',
  'audio/reiwa_photo_pick.mp3',
  'audio/reiwa_thanks.mp3',
  'audio/reiwa_tool_ugokasu.mp3',
  'audio/resume_offer.mp3',
  'audio/save_error.mp3',
  'audio/save_guide.mp3',
  'audio/save_longpress.mp3',
  'audio/save_retry.mp3',
  'audio/save_success.mp3',
];

/* 🚨 2026-08-15 検見の互換検収【致命】への構造対応。
   以前は `cache.addAll(PRECACHE)` の1行だった。addAll は **全か無か** で、
   PRECACHE に実在しないファイルが1件でも混ざると
   「キャッシュ0件・SW登録null・コンソールエラー0件・見た目は正常」になる。
   ＝ typo 1文字でオフライン対応が全滅し、しかも会場でWi-Fiが落ちるまで誰も気づけない。
   個別 add + allSettled に変えて、**1件こけても残りは入る**ようにする。
   失敗したURLはコンソールに名指しで出す（無症状をやめる）。 */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (c) => {
      const results = await Promise.allSettled(PRECACHE.map((u) => c.add(u)));
      const failed = results
        .map((r, i) => (r.status === 'rejected' ? PRECACHE[i] : null))
        .filter(Boolean);
      if (failed.length) {
        console.error('[sw] プリキャッシュに失敗したファイル（オフライン時にここだけ欠けます）:', failed);
      } else {
        console.log('[sw] プリキャッシュ完了', PRECACHE.length, '件', CACHE_NAME);
      }
    }).then(() => self.skipWaiting())
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
    /* ネットワーク優先 + キャッシュ更新（オフライン時はキャッシュから）。
       🚨 res.ok を必ず見る（2026-08-15 検見の互換検収【要修正】）。
       以前は無条件に put していたため、会場のWi-Fiが **キャプティブポータル**
       （接続前にログイン画面を返す方式）だと、そのログインHTMLが index.html として
       キャッシュに焼き付き、以後オフラインでログイン画面が開くようになっていた。
       CDN側の分岐には元から res.ok の判定があり、こちら側だけ抜けていた（非対称）。
       リダイレクト（type: 'opaqueredirect'）も同じ理由で弾く */
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res && res.ok && res.type !== 'opaqueredirect') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
  } else if (url.hostname === 'cdn.jsdelivr.net' || url.hostname === 'storage.googleapis.com') {
    /* MediaPipe本体・モデル: キャッシュ優先（巨大ファイルの再取得を防ぐ）。
       🚨 2026-08-15: app.js 側が読み込みの再挑戦時に `?retry=N` を付けるようになった
       （ブラウザは失敗した import() をモジュールマップに覚えており、同じURLでは
       二度と取りに行かないため）。クエリ違いを別物として扱うと
       ① 前回のセッションでキャッシュ済みでも取りに行ってしまい
       ② `?retry=1` `?retry=2` … がキャッシュに積み上がる。
       読むときは ignoreSearch で拾い、書くときはクエリを落として1本に正規化する。 */
    const baseUrl = url.origin + url.pathname;
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then((hit) => {
        if (hit) return hit;
        return fetch(e.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(baseUrl, clone));
          }
          return res;
        });
      })
    );
  }
});
