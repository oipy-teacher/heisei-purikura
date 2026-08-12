(() => {
  'use strict';

  /* ===================== モード定義 =====================
     平成モード: 1999〜2003年頃（ユーロビート/パラパラ世代）のプリ機を再現。
                 盛り調整UIは無い時代（デカ目は2007年「美人-プレミアム-」以降）なので
                 固定の軽い補正のみ。落書き全盛・ふざけスタンプ・ギャル文化の文字スタンプ。
                 「〜2006 黄み肌」を選ぶと当時の写り（黄み肌・加工感少なめ・画質荒め）になる。
     令和モード: 現行プリ機のトレンドを再現。ナチュラル盛れ・盛れ感選択
                 （無加工風/ナチュ盛れ/プリ盛れ＋80/100/120%レベル）・くすみカラー・シンプル志向。 */
  const MODES = {
    heisei: {
      label: '平成モード',
      curtains: [
        { id: 'pink',     label: 'ピンク',     color: '#ff8fc7' },
        { id: 'blue',     label: 'ブルー',     color: '#7fd1ff' },
        { id: 'yellow',   label: 'イエロー',   color: '#ffe066' },
        { id: 'purple',   label: 'パープル',   color: '#c79bff' },
        { id: 'mint',     label: 'ミント',     color: '#8de8c3' },
        { id: 'white',    label: 'ホワイト',   color: '#ffffff' },
        { id: 'lavender', label: 'ラベンダー', color: '#e0c3ff' },
        { id: 'peach',    label: 'ピーチ',     color: '#ffc9a8' },
      ],
      // 初代プリント倶楽部(1995)は「9種類の背景から1つ選んでボタンを押す」だけの機械だった
      // （JAIA20年史）。フレーム選択が主役、という考証に基づき9種そろえる
      frames: [
        { id: 'heart',   label: 'ハート',   emoji: '💗' },
        { id: 'star',    label: 'スター',   emoji: '⭐' },
        { id: 'flower',  label: 'フラワー', emoji: '🌸' },
        { id: 'ribbon',  label: 'リボン',   emoji: '🎀' },
        { id: 'kirakira', label: 'キラキラ', emoji: '✨' },
        { id: 'ichigo',  label: 'いちご',   emoji: '🍓' },
        { id: 'onpu',    label: 'おんぷ',   emoji: '🎵' },
        { id: 'usagi',   label: 'うさぎ',   emoji: '🐰' },
        { id: 'plain',   label: 'シンプル', emoji: '' },
      ],
      frameStyle: 'motif', // シール全周にモチーフを並べる（初期プリ機のフレーム風）
      penColors: ['#ff2fa0', '#ff8fc7', '#ffef5c', '#5cff8f', '#5cc8ff', '#a06bff', '#ffffff', '#000000'],
      penTypes: ['normal'],
      /* 落書きの考証（2026-08-12 改訂・era-designerリサーチ準拠）:
         本機の平成モードはユーロビートBGM＝1999〜2003年ごろの再現。この時代は落書き全盛期で、
         スタンプには「意味不明なキャラ・笑えるスタンプ」のふざけ・ネタ枠が必ずあった（JAIA20年史）。
         プリ帳文化の定番文言「我等友情永久不滅成」もこの時代のもの。 */
      stamps: ['💀', '👽', '🔥', '⚡', '💩', '🐯', '👊', '💋', '🌟', '🍜', '📟', '🎤'],
      drawnStamps: ['dateRetro', 'sparkleLine', 'heartChalk', 'bubble'], // 日付焼き込みは時代考証的にもドンピシャ
      textStamps: [
        { t: '我等友情永久不滅成', style: 'sticker', color: '#ff2fa0' },
        { t: 'ズッ友だょ…！', style: 'sticker', color: '#a06bff' },
        { t: 'LOVE', style: 'outline' },
        { t: '最強', style: 'sticker', color: '#ff2fa0' },
        { t: 'アゲアゲ⤴', style: 'sticker', color: '#ff8a2a' },
        { t: 'チョベリグ', style: 'sticker', color: '#5cc8ff' },
        { t: 'ラブラブ♡', style: 'neon' },
        { t: '仲良し4EVER', style: 'sticker', color: '#3cae6a' },
        { t: '太子祭', style: 'sticker', color: '#d94a6a' },
      ],
      textStampStyle: { font: '900 20px sans-serif', fill: '#ff2fa0', stroke: '#ffffff', strokeWidth: 4, rotate: 8 },
      // 盛れ感プリセット（2000年代後半の「ケバ盛れ」文化を反映して強め）
      presets: [
        { id: 'usu',      label: 'うす盛れ',     skin: 30, white: 20, clear: 20, eye: 20, face: 10, cheek: 20, lip: 15 },
        { id: 'shikkari', label: 'しっかり盛れ', skin: 60, white: 40, clear: 40, eye: 50, face: 30, cheek: 45, lip: 40 },
        { id: 'keba',     label: 'ケバ盛れ',     skin: 90, white: 70, clear: 55, eye: 80, face: 50, cheek: 75, lip: 65 },
      ],
      defaultPreset: 'shikkari',
      makeup: { cheek: '#ff5f8f', lip: '#ff2f6e' },
      // 平成の「美白」ブーム: 明るさ強め・彩度は下げて白肌に
      skinTone: { brightPerUnit: 0.16, desatPerUnit: 0.16 },
      // fx: bright=白スクリーン合成 / desat=グレー彩度合成 / colorize=カラー合成 / contrast=自己オーバーレイ / warm=ソフトライト
      filters: [
        { id: 'none',   label: 'なし',      fx: {} },
        { id: 'bihaku', label: '美白MAX',   fx: { bright: 0.30, desat: 0.45 } },
        { id: 'ganguro', label: '日やけギャル', fx: { tan: { color: '#c9926a', amt: 0.5 }, contrast: 0.15, warm: { color: '#d98a4a', amt: 0.2 } } },
        { id: 'retro',  label: 'レトロ',    fx: { desat: 0.3, warm: { color: '#d9a06a', amt: 0.28 }, bright: 0.06, contrast: 0.12 } },
        { id: 'sepia',  label: 'セピア',    fx: { desat: 0.9, colorize: { color: '#a97e52', amt: 0.5 }, bright: 0.08 } },
        { id: 'vivid',  label: 'ビビッド',  fx: { contrast: 0.45, bright: 0.05 } },
        { id: 'showa',  label: '写ルンです', fx: { desat: 0.2, warm: { color: '#c9d4a0', amt: 0.18 }, contrast: 0.2 } },
      ],
      sheet: {
        title: '平成 Print Club',
        titleFont: '900 34px -apple-system, sans-serif',
        titleColor: '#ffffff',
        titleGlow: 'rgba(255,47,160,.8)',
        footerColor: '#a03cae',
        footerName: 'Heisei Purikura-ki',
        bgTop: '#ffffff', bgMid: null /* curtain色 */, bgBottom: '#ffffff',
        cellRadius: 10,
        cornerDeco: 'frameEmoji',
      },
      bgm: 'audio/bgm.mp3',
    },
    reiwa: {
      label: '令和モード',
      curtains: [
        { id: 'dustypink', label: 'くすみピンク', color: '#e8c7c8' },
        { id: 'sage',      label: 'セージ',       color: '#c9d4c5' },
        { id: 'cream',     label: 'クリーム',     color: '#f2e8d5' },
        { id: 'greige',    label: 'グレージュ',   color: '#d5ccc3' },
        { id: 'dustyblue', label: 'くすみブルー', color: '#bccad6' },
        { id: 'white',     label: 'ホワイト',     color: '#fafafa' },
        { id: 'mauve',     label: 'モーブ',       color: '#c9b7c4' },
        { id: 'terracotta', label: 'テラコッタ',  color: '#d9a58f' },
      ],
      frames: [
        { id: 'white-heart', label: 'ハート', emoji: '🤍' },
        { id: 'sparkle',     label: 'キラ',   emoji: '✦' },
        { id: 'ribbon',      label: 'リボン', emoji: '🎀' },
        { id: 'cloud',       label: 'くも',   emoji: '☁️' },
      ],
      penColors: ['#b98a8a', '#8a9b8a', '#c0b283', '#8a9bb0', '#7d6b7d', '#e6ccb3', '#ffffff', '#3d3733'],
      penTypes: ['normal', 'neon', 'fuchi', 'kira'],
      stamps: ['🤍', '🫶', '✨', '🌷', '🧸', '☁️', '🍓', '🥐', '📷', '🎧', '🪞', '🎀'],
      // 手描き風スタンプ（Canvas描画。参考画像のハート各種・キラ・吹き出しを再現）
      drawnStamps: ['heartSticker', 'heartGlossy', 'heartOutline', 'heartLine', 'heartArrow', 'heartChalk', 'sparkleLine', 'bubble', 'dateCute'],
      // スタイル付き文字スタンプ（sticker=白フチ / outline=中抜き / neon=ネオン発光 / plain=モード標準）
      textStamps: [
        { t: 'Perfect',  style: 'outline' },
        { t: 'GOOD',     style: 'outline' },
        { t: '満点',     style: 'sticker', color: '#5a5a5a' },
        { t: 'イイネ◎',  style: 'sticker', color: '#a08ad0' },
        { t: 'Point',    style: 'sticker', color: '#f2889f' },
        { t: 'LUCKY',    style: 'sticker', color: '#e05a5a' },
        { t: '爆誕っ',   style: 'sticker', color: '#3d3733' },
        { t: 'ひみつ',   style: 'sticker', color: '#e0498a' },
        { t: 'えっ!?',   style: 'plain' },
        { t: '達成✧',    style: 'sticker', color: '#e8a83d' },
        { t: '#今日のプリ', style: 'plain' },
        { t: 'エモい',   style: 'plain' },
        { t: 'BFF♡',     style: 'sticker', color: '#e0498a' },
        { t: 'かわいくなりすぎちゃったかも', style: 'neon' },
        { t: 'さすがに盛りすぎちゃったかも', style: 'neon' },
        { t: '全銀河中キュンさせちゃう',     style: 'neon' },
        { t: '太子祭',   style: 'sticker', color: '#d94a6a' },
        { t: '聖徳',     style: 'sticker', color: '#4a6ad9' },
      ],
      textStampStyle: { font: 'italic 600 18px Georgia, serif', fill: '#a8917d', stroke: null, strokeWidth: 0, rotate: 4 },
      // 盛れ感プリセット（現行機 Hyper shot の「無加工風/ナチュ盛れ/プリ盛れ」選択を再現）
      presets: [
        { id: 'mukakou', label: '無加工風',   skin: 20, white: 0,  clear: 15, eye: 5,  face: 5,  cheek: 10, lip: 10 },
        { id: 'natural', label: 'ナチュ盛れ', skin: 45, white: 10, clear: 40, eye: 25, face: 15, cheek: 30, lip: 25 },
        { id: 'puri',    label: 'プリ盛れ',   skin: 70, white: 25, clear: 60, eye: 45, face: 30, cheek: 55, lip: 45 },
      ],
      defaultPreset: 'natural',
      makeup: { cheek: '#e2917d', lip: '#c96a5f' },
      // 令和は血色感を残すナチュラル美肌（さらパフ肌）
      skinTone: { brightPerUnit: 0.10, desatPerUnit: 0 },
      /* 透明感（clear）で「色ムラの平滑化」を行うか。
         令和だけ true。平成の白肌は色が平坦で明るさで押す時代の絵作りなので、
         色ムラをならす現代的な透明感は入れない（時代考証・2026-07-19の裁定を維持）。 */
      clearColorSmooth: true,
      filters: [
        { id: 'none',   label: 'なし',     fx: {} },
        { id: 'film',   label: 'フィルム', fx: { desat: 0.25, warm: { color: '#d9a06a', amt: 0.20 }, bright: 0.06 } },
        { id: 'kusumi', label: 'くすみ',   fx: { desat: 0.35, bright: 0.08 } },
        { id: 'mono',   label: 'モノクロ', fx: { desat: 1, contrast: 0.15 } },
      ],
      sheet: {
        title: 'my memories ♡',
        titleFont: 'italic 600 26px Georgia, serif',
        titleColor: '#a8917d',
        titleGlow: null,
        footerColor: '#b3a495',
        footerName: 'purikura',
        bgTop: '#faf6f0', bgMid: null, bgBottom: '#f4ede4',
        cellRadius: 4,
        cornerDeco: 'none',
      },
      bgm: 'audio/bgm_reiwa.mp3',
    },
  };

  const NUM_SHOTS = 4;

  /* 落書きの制限時間（モード別・2026-07-26 オーナー裁定）
     平成 = 180秒。実機の約200秒に準拠。時間に追われて描く緊張感が体験の核なので変えない。
     令和 = 長め。スマホの小さい画面で指で拡大しながら描くため、実機と同じ尺だと足りない。
     ※ 実際に試して調整する前提の数字。ここだけ直せば変えられる。 */
  const DECO_SECONDS_BY_MODE = { heisei: 180, reiwa: 600 };
  const DECO_SECONDS = DECO_SECONDS_BY_MODE.heisei; // 既定値（後方互換）
  const decoSeconds = () => DECO_SECONDS_BY_MODE[state.mode] ?? DECO_SECONDS;

  const BEAUTY_SECONDS = 60;  // 盛り調整1分（実機の盛り調整時間に準拠）

  /* 全身モードの準備カウント。
     プリクラ機は無人。客が自分で「はじめる」を押したあと、雲台を回して場ミリまで
     歩いて構える必要がある。押した直後にカウントダウンが始まると間に合わない。
     実測して調整すること。 */
  const PREP_SECONDS = 18;

  const SHEET_W = 680;
  const SHEET_H = 900;
  const MARGIN = 26;
  const HEADER_H = 84;
  const FOOTER_H = 40;

  const SHOT_W = 640, SHOT_H = 480;

  // シートレイアウト（分割）。16分割は平成プリの定番！まる系は保護者リクエスト
  const LAYOUTS = [
    { id: 'quad',    label: '4分割',     cols: 2, rows: 2, gap: 26, radius: 10 },
    { id: 'wide2',   label: '2枚ワイド', cols: 1, rows: 2, gap: 26, radius: 12 },
    { id: 'six',     label: '6分割',     cols: 2, rows: 3, gap: 18, radius: 8 },
    { id: 'sixteen', label: '16分割',    cols: 4, rows: 4, gap: 12, radius: 6 },
    { id: 'circle4', label: 'まる4',     cols: 2, rows: 2, gap: 26, radius: 0, shape: 'circle' },
    { id: 'circleMix', label: 'まるMIX', gap: 20, radius: 0, shape: 'circle',
      // 大きさ指定の丸型ミックス（大1+中1+小2）。ヘッダー下の描画領域に対する比率
      cellsNorm: [
        { x: 0.06, y: 0.02, w: 0.56, h: 0.48 },
        { x: 0.62, y: 0.30, w: 0.36, h: 0.30 },
        { x: 0.10, y: 0.56, w: 0.38, h: 0.32 },
        { x: 0.52, y: 0.64, w: 0.44, h: 0.36 },
      ] },
  ];

  function layoutCells(layout) {
    const cells = [];
    const innerY = HEADER_H;
    const innerH = SHEET_H - HEADER_H - FOOTER_H;
    if (layout.cellsNorm) {
      // 比率指定のカスタムセル（まるMIX等）
      layout.cellsNorm.forEach(c => {
        cells.push({
          x: c.x * SHEET_W,
          y: innerY + c.y * innerH,
          w: c.w * SHEET_W,
          h: c.h * innerH,
        });
      });
      return cells;
    }
    const availW = SHEET_W - layout.gap * (layout.cols + 1);
    const availH = innerH - layout.gap * (layout.rows + 1);
    const cw = availW / layout.cols, ch = availH / layout.rows;
    for (let r = 0; r < layout.rows; r++) {
      for (let c = 0; c < layout.cols; c++) {
        cells.push({
          x: layout.gap + c * (cw + layout.gap),
          y: innerY + layout.gap + r * (ch + layout.gap),
          w: cw, h: ch,
        });
      }
    }
    return cells;
  }

  // 撮影ポーズガイド（実機の「次は◯◯で！」を再現）
  const POSE_GUIDES = [
    'まずはにっこり笑顔で💕',
    'つぎはアップでかわいく！',
    'おちゃめなポーズいっちゃお！',
    'ラストはさいこうの決めポーズ！',
  ];

  /* ===================== 状態 ===================== */
  const state = {
    mode: 'heisei',
    curtain: MODES.heisei.curtains[0],
    frame: MODES.heisei.frames[0],
    layout: LAYOUTS[0],
    shotMode: 'bust',    // bust = 手持ち自撮り（前面カメラ） / full = 三脚・全身（背面カメラ）
    bgmChoice: 'auto',   // BGM選択（1997年以降の実機の型・2026-08-12）。auto = モードおまかせ
    heiseiEra: 'standard', // 平成モードの写り年代。standard | y2k（〜2006の黄み肌・加工ひかえめ）
    chromaOn: false,
    liveBeautyOn: true,  // 令和モードのライブ盛れプレビュー（2026-07-31新設）
    stream: null,
    shots: [],           // 撮影した生の4枚
    processedShots: [],  // 盛り加工後の4枚
    faceData: [],        // 各ショットの顔ランドマーク（検出できなければ null）
    skinConf: [],        // 各ショットのML肌信頼度マスク（selfie_multiclass。無ければ null）
    beauty: { skin: 60, white: 40, clear: 40, eye: 50, face: 30, cheek: 45, lip: 40, filter: 'none' },
    beautySelected: 0,
    beautyTimerId: null,
    beautyRemaining: BEAUTY_SECONDS,
    beautyWarned: false,
    penColor: MODES.heisei.penColors[0],
    penSize: 8,
    penType: 'normal', // normal | neon | fuchi | kira
    stampSize: 48,
    tool: 'pen',
    stampChar: null,
    textStampSel: null,
    dstampId: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    timerId: null,
    remaining: DECO_SECONDS,
    warningPlayed: false,
  };

  const modeConf = () => MODES[state.mode];

  /* ===================== ユーティリティ ===================== */
  const $ = (sel) => document.querySelector(sel);
  const screens = {};
  document.querySelectorAll('.screen').forEach(s => screens[s.id] = s);

  function showScreen(id) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[id].classList.add('active');
    // タイトルへ戻ったら待機デモのアイドル計測を仕掛け直す（関数はこの後で定義される）
    if (id === 'screen-title' && typeof armAttractIdle === 'function') armAttractIdle();
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function dist(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /* ===================== 音声アナウンス ===================== */
  const SOUND_FILES = {
    start: 'audio/01_start.mp3',
    selectCurtain: 'audio/02_select_curtain.mp3',
    selectFrame: 'audio/03_select_frame.mp3',
    introShot1: 'audio/intro_shot1.mp3',
    introShot2: 'audio/intro_shot2.mp3',
    introShot3: 'audio/intro_shot3.mp3',
    introShot4: 'audio/intro_shot4.mp3',
    count3: 'audio/count_3.mp3',
    count2: 'audio/count_2.mp3',
    count1: 'audio/count_1.mp3',
    countHai: 'audio/count_hai.mp3',
    beauty: 'audio/13_beauty.mp3',
    decoStart: 'audio/08_deco_start.mp3',
    timeWarning: 'audio/09_time_warning.mp3',
    timeup: 'audio/10_timeup.mp3',
    finish: 'audio/11_finish.mp3',
    save: 'audio/12_save.mp3',
    seTap: 'audio/se_tap.mp3',
    seDecide: 'audio/se_decide.mp3',
    seShutter: 'audio/se_shutter.mp3',
    /* --- 実機模倣アップデート（2026-08-12）で追加した音声。
           音声ファイルは別担当が並行制作中のため、ファイルが無い間は
           soundAvailable の仕組みで「黙ってスキップ」される（アプリは止まらない）。 --- */
    attractCall: 'audio/attract_call.mp3',        // 待機デモの呼び込み
    courseSelectV2: 'audio/course_select_v2.mp3', // コース選択画面の案内
    pose1: 'audio/pose_01.mp3',                   // ポーズ提案ボイス（ランダム）
    pose2: 'audio/pose_02.mp3',
    pose3: 'audio/pose_03.mp3',
    pose4: 'audio/pose_04.mp3',
    pose5: 'audio/pose_05.mp3',
    pose6: 'audio/pose_06.mp3',
    okCheck: 'audio/ok_check.mp3',                // 「この画像でオッケー？！」
    moriageSelect: 'audio/moriage_select.mp3',    // 盛れ感レベル選択
    decoOwaru: 'audio/doodle_owaru.mp3',          // 落書き「おわる」ボタン
    decoHalftime: 'audio/doodle_halftime.mp3',    // 落書き残り時間の中間通知
    printOut: 'audio/print_out.mp3',              // シール排出
  };

  const sounds = {};
  /* 各音声ファイルの読み込み可否。undefined=不明 / true=使える / false=404等で使えない。
     新音声は並行制作中でファイルが未着のことがあるため、false のものは再生も待機もしない。 */
  const soundAvailable = {};
  Object.entries(SOUND_FILES).forEach(([key, src]) => {
    const a = new Audio(src);
    a.preload = 'auto';
    a.addEventListener('error', () => { soundAvailable[key] = false; }, { once: true });
    a.addEventListener('canplaythrough', () => {
      if (soundAvailable[key] === undefined) soundAvailable[key] = true;
    }, { once: true });
    sounds[key] = a;
  });

  function soundMissing(key) { return soundAvailable[key] === false; }

  function playSound(key) {
    const a = sounds[key];
    if (!a || soundMissing(key)) return;
    a.currentTime = 0;
    a.play().catch(() => { /* 自動再生がブロックされた場合は無視 */ });
  }

  // 第一候補が未着（ファイル無し）のときだけ代替を鳴らす
  function playSoundOr(key, fallbackKey) {
    if (!soundMissing(key)) { playSound(key); return; }
    if (fallbackKey) playSound(fallbackKey);
  }

  // 撮影カウントダウン用：セリフの再生が実際に終わるまで待つ（＝見た目とボイスを完全に同期させる）
  function playSoundAwait(key) {
    const a = sounds[key];
    if (!a || soundMissing(key)) return Promise.resolve();
    return new Promise((resolve) => {
      let done = false;
      const finish = () => { if (done) return; done = true; a.removeEventListener('ended', finish); resolve(); };
      a.addEventListener('ended', finish);
      a.currentTime = 0;
      a.play().catch(finish);
      setTimeout(finish, 4000); // 保険
    });
  }

  /* ===================== BGM（モード別） ===================== */
  const bgmAudio = new Audio(MODES.heisei.bgm);
  bgmAudio.loop = true;
  bgmAudio.volume = 0.32;
  bgmAudio.preload = 'auto';

  const BGM_TITLE = 'audio/bgm_title.mp3';

  /* BGM選択（2026-08-12 新設）。楽曲を選べる機種があったのが1997年以降の実機の型。
     'auto' はモードおまかせ（従来どおり平成=ユーロビート／令和=ローファイ）。 */
  const BGM_TRACKS = [
    { id: 'auto', label: '♪ おまかせ', src: null },
    { id: 'euro', label: 'ユーロビート', src: 'audio/bgm.mp3' },
    { id: 'lofi', label: 'ローファイ', src: 'audio/bgm_reiwa.mp3' },
    { id: 'pop',  label: 'ポップ', src: 'audio/bgm_title.mp3' },
  ];

  function playBgmSrc(src) {
    if (!bgmAudio.src.endsWith(src)) bgmAudio.src = src;
    bgmAudio.currentTime = 0;
    bgmAudio.play().catch(() => {});
  }
  function startBGM() {
    const track = BGM_TRACKS.find(t => t.id === state.bgmChoice);
    playBgmSrc((track && track.src) || modeConf().bgm);
  }
  function stopBGM() {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }

  // タイトルBGM: 自動再生はブラウザにブロックされるため、最初のタッチで開始
  let titleBgmStarted = false;
  document.addEventListener('pointerdown', () => {
    if (!titleBgmStarted && screens['screen-title'].classList.contains('active')) {
      titleBgmStarted = true;
      unlockAudio();
      setTimeout(() => {
        // モードボタン押下と同時だった場合はモードBGMを優先
        if (screens['screen-title'].classList.contains('active')) playBgmSrc(BGM_TITLE);
      }, 60);
    }
  }, true);

  // iOS Safari 対策：最初のユーザー操作のタイミングで全音声を一度ミュート再生し、以降のタイマー発火の再生を許可させる
  function unlockAudio() {
    [...Object.values(sounds), bgmAudio].forEach((a) => {
      a.muted = true;
      a.play().then(() => {
        a.pause();
        a.currentTime = 0;
        a.muted = false;
      }).catch(() => { a.muted = false; });
    });
  }

  /* ===================== 0-. 待機デモ（アトラクト画面・2026-08-12 新設） =====================
     実機は客がいない間も派手なデモ映像＋呼び込み音声が回り続ける（JAIA20年史の考証）。
     タイトル画面のまま ATTRACT_IDLE_MS 触られなかったら開始し、タッチで即タイトルへ戻る。 */
  const ATTRACT_IDLE_MS = 45000;      // 無操作からデモ開始までの時間
  const ATTRACT_SLIDE_MS = 4200;      // スライド1枚の表示時間
  const ATTRACT_CALL_GAP_MS = 3500;   // 呼び込み音声のリピート間隔

  const attractOverlay = $('#attract-overlay');
  const attractSlides = document.querySelectorAll('.attract-slide');
  let attractIdleId = null;
  let attractSlideId = null;
  let attractCallId = null;
  let attractOn = false;
  let attractSlideIdx = 0;

  function startAttract() {
    if (attractOn || !screens['screen-title'].classList.contains('active')) return;
    attractOn = true;
    attractSlideIdx = 0;
    attractSlides.forEach((s, i) => s.classList.toggle('active', i === 0));
    attractOverlay.classList.remove('hidden');
    attractSlideId = setInterval(() => {
      attractSlideIdx = (attractSlideIdx + 1) % attractSlides.length;
      attractSlides.forEach((s, i) => s.classList.toggle('active', i === attractSlideIdx));
    }, ATTRACT_SLIDE_MS);
    // 呼び込み音声（ファイル未着ならスキップ）。連呼しすぎないよう間隔を空けてループ
    playSound('attractCall');
  }

  function stopAttract() {
    if (!attractOn) return;
    attractOn = false;
    attractOverlay.classList.add('hidden');
    if (attractSlideId) { clearInterval(attractSlideId); attractSlideId = null; }
    if (attractCallId) { clearTimeout(attractCallId); attractCallId = null; }
    const call = sounds.attractCall;
    if (call) { call.pause(); call.currentTime = 0; }
  }

  if (sounds.attractCall) {
    sounds.attractCall.addEventListener('ended', () => {
      if (!attractOn) return;
      attractCallId = setTimeout(() => { if (attractOn) playSound('attractCall'); }, ATTRACT_CALL_GAP_MS);
    });
  }

  function armAttractIdle() {
    if (attractIdleId) clearTimeout(attractIdleId);
    attractIdleId = null;
    if (!screens['screen-title'].classList.contains('active')) return;
    attractIdleId = setTimeout(startAttract, ATTRACT_IDLE_MS);
  }

  // どこかを触るたびにアイドル計測をやり直す
  document.addEventListener('pointerdown', () => {
    if (attractOn) return; // デモ解除は click 側で行う（下のボタンへのタッチ化けを防ぐ）
    armAttractIdle();
  }, true);
  /* デモ中のタッチはタイトルへ戻すだけ。pointerdown で消すと同じタッチの click が
     下のモードボタンに落ちてしまうため、click のタイミングで消して伝播も止める */
  attractOverlay.addEventListener('click', (e) => {
    e.stopPropagation();
    stopAttract();
    armAttractIdle();
  });
  armAttractIdle();

  /* ===================== 0. タイトル（モード選択） ===================== */
  function enterMode(mode) {
    state.mode = mode;
    document.body.dataset.mode = mode;
    const conf = modeConf();
    state.curtain = conf.curtains[0];
    state.frame = conf.frames[0];
    const preset = conf.presets.find(p => p.id === conf.defaultPreset);
    state.beauty = { skin: preset.skin, white: preset.white, clear: preset.clear, eye: preset.eye, face: preset.face, cheek: preset.cheek, lip: preset.lip, filter: 'none' };
    buildSelectGrids();
    applyShotMode();
    buildDecoTools();
    unlockAudio();
    playSound('start');
    startBGM();
    showScreen('screen-select');
    /* コース選択画面の案内（2026-08-12）: 実機の型に合わせた新ボイスを優先。
       ファイル未着時だけ従来の2本（デザイン→フレーム）に落とす */
    if (!soundMissing('courseSelectV2')) {
      playSound('courseSelectV2');
    } else {
      playSound('selectCurtain');
      setTimeout(() => {
        if (screens['screen-select'].classList.contains('active')) playSound('selectFrame');
      }, 2700);
    }
  }

  $('#btn-mode-heisei').addEventListener('click', () => enterMode('heisei'));
  $('#btn-mode-reiwa').addEventListener('click', () => enterMode('reiwa'));

  /* 戻る導線（2026-08-12 オーナー指摘対応）:
     コース選択→モード選択へ戻れる。戻る＝セッションのやり直しなので、
     BGM/写り年代は「もう一回あそぶ」と同じく初期値へ戻す（次のモードへ持ち越さない）。
     カーテン・フレーム等は enterMode が毎回リセットするので触らなくてよい。 */
  $('#btn-back-title').addEventListener('click', () => {
    state.bgmChoice = 'auto';
    state.heiseiEra = 'standard';
    playBgmSrc(BGM_TITLE);
    showScreen('screen-title');
  });

  /* ===================== 1. 選択画面 ===================== */
  function buildChoiceGrid(container, items, kind, onSelect) {
    container.innerHTML = '';
    items.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'choice-item' + (i === 0 ? ' selected' : '');
      if (kind === 'curtain') {
        el.style.background = item.color;
        el.textContent = item.label;
        el.style.fontSize = '13px';
        // 明るい色は文字を濃く
        const c = item.color;
        const rgb = [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
        const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
        el.style.color = lum > 190 ? (state.mode === 'reiwa' ? '#8a7568' : '#a03cae') : '#fff';
      } else {
        el.style.background = state.mode === 'reiwa'
          ? 'linear-gradient(160deg,#fff,#f2e8d5)'
          : 'linear-gradient(160deg,#fff,#ffe1f3)';
        const labelColor = state.mode === 'reiwa' ? '#8a7568' : '#a03cae';
        el.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
          <span style="font-size:26px;">${item.emoji}</span>
          <span style="font-size:11px;color:${labelColor};font-weight:800;">${item.label}</span>
        </div>`;
      }
      el.addEventListener('click', () => {
        container.querySelectorAll('.choice-item').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        onSelect(item);
      });
      container.appendChild(el);
    });
  }

  // レイアウトのミニプレビューSVGを生成
  function layoutIconSVG(layout) {
    const W = 52, H = 68, pad = 3;
    let shapes = '';
    const isCircle = layout.shape === 'circle';
    if (layout.cellsNorm) {
      layout.cellsNorm.forEach(c => {
        const x = c.x * W, y = c.y * H, cw = c.w * W, ch = c.h * H;
        if (isCircle) {
          const r = Math.min(cw, ch) / 2;
          shapes += `<circle cx="${(x + cw / 2).toFixed(1)}" cy="${(y + ch / 2).toFixed(1)}" r="${r.toFixed(1)}" fill="#e3a8c9"/>`;
        } else {
          shapes += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" rx="2" fill="#e3a8c9"/>`;
        }
      });
    } else {
      const availW = W - pad * (layout.cols + 1);
      const availH = H - pad * (layout.rows + 1);
      const cw = availW / layout.cols, ch = availH / layout.rows;
      for (let r = 0; r < layout.rows; r++) {
        for (let c = 0; c < layout.cols; c++) {
          const x = pad + c * (cw + pad), y = pad + r * (ch + pad);
          if (isCircle) {
            const rr = Math.min(cw, ch) / 2;
            shapes += `<circle cx="${(x + cw / 2).toFixed(1)}" cy="${(y + ch / 2).toFixed(1)}" r="${rr.toFixed(1)}" fill="#e3a8c9"/>`;
          } else {
            shapes += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" rx="2" fill="#e3a8c9"/>`;
          }
        }
      }
    }
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${W}" height="${H}" rx="4" fill="#fff" stroke="#e8cede"/>${shapes}</svg>`;
  }

  function buildLayoutList() {
    const container = $('#layout-list');
    container.innerHTML = '';
    LAYOUTS.forEach((layout, i) => {
      const el = document.createElement('div');
      el.className = 'layout-item' + (layout.id === state.layout.id ? ' selected' : '');
      el.innerHTML = layoutIconSVG(layout) + `<span class="layout-label">${layout.label}</span>`;
      el.addEventListener('click', () => {
        container.querySelectorAll('.layout-item').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        state.layout = layout;
      });
      container.appendChild(el);
    });
  }

  // 選択画面のフィルターチップ（選んだ値は盛り画面のフィルターと共通）
  function buildSelectFilterRow() {
    const conf = modeConf();
    const row = $('#select-filter-row');
    row.innerHTML = '';
    conf.filters.forEach(f => {
      const b = document.createElement('button');
      b.className = 'preset-btn' + (f.id === state.beauty.filter ? ' active' : '');
      b.textContent = f.label;
      b.addEventListener('click', () => {
        state.beauty.filter = f.id;
        row.querySelectorAll('.preset-btn').forEach(x => x.classList.toggle('active', x === b));
      });
      row.appendChild(b);
    });
  }

  // BGM選択チップ（選ぶとその場で試聴＝BGMが切り替わる）
  function buildBgmRow() {
    const row = $('#bgm-row');
    row.innerHTML = '';
    /* 時代考証（2026-08-12 era-designer指摘）: ローファイは2010年代の音なので
       平成モードの選択肢には出さない。前セッションでlofiを選んだまま平成に入った場合はおまかせへ戻す */
    const tracks = state.mode === 'heisei' ? BGM_TRACKS.filter(t => t.id !== 'lofi') : BGM_TRACKS;
    if (state.mode === 'heisei' && state.bgmChoice === 'lofi') state.bgmChoice = 'auto';
    tracks.forEach(t => {
      const b = document.createElement('button');
      b.className = 'preset-btn' + (t.id === state.bgmChoice ? ' active' : '');
      b.textContent = t.label;
      b.addEventListener('click', () => {
        state.bgmChoice = t.id;
        row.querySelectorAll('.preset-btn').forEach(x => x.classList.toggle('active', x === b));
        startBGM(); // その場で試聴
      });
      row.appendChild(b);
    });
  }

  // うつりの年代（平成考証・2026-08-12）。〜2006年ごろの実機は黄み肌・加工感少なめが史実
  const ERA_TONES = [
    { id: 'standard', label: 'スタンダード' },
    { id: 'y2k',      label: '〜2006 黄み肌' },
  ];
  function buildEraToneRow() {
    const row = $('#eratone-row');
    row.innerHTML = '';
    ERA_TONES.forEach(t => {
      const b = document.createElement('button');
      b.className = 'preset-btn' + (t.id === state.heiseiEra ? ' active' : '');
      b.textContent = t.label;
      b.addEventListener('click', () => {
        state.heiseiEra = t.id;
        row.querySelectorAll('.preset-btn').forEach(x => x.classList.toggle('active', x === b));
      });
      row.appendChild(b);
    });
  }

  function buildSelectGrids() {
    const conf = modeConf();
    buildLayoutList();
    buildChoiceGrid($('#curtain-list'), conf.curtains, 'curtain', (item) => { state.curtain = item; });
    buildChoiceGrid($('#frame-list'), conf.frames, 'frame', (item) => { state.frame = item; });
    buildSelectFilterRow();
    buildBgmRow();
    buildEraToneRow();

    // 「うつりの年代」は平成モード専用（令和は現行機の写りなので年代選択なし）
    $('#sel-eratone').style.display = state.mode === 'heisei' ? '' : 'none';

    /* モード別にセクションを並べ替える:
       平成 = コース＋フレーム＋フィルター＋BGMがデフォ（初代〜中期プリ機の流れ）。
              分割・カラー・年代・デジタル背景は「こだわり設定」へ
       令和 = コース＋分割・カラー・フレームがデフォ。フィルター・BGM・デジタル背景は「こだわり設定」へ */
    const main = $('#select-main');
    const adv = $('#advanced-body');
    const order = state.mode === 'heisei'
      ? { main: ['sel-shotmode', 'sel-frame', 'sel-filter', 'sel-bgm'], adv: ['sel-eratone', 'sel-layout', 'sel-curtain', 'sel-chroma'] }
      : { main: ['sel-shotmode', 'sel-layout', 'sel-curtain', 'sel-frame'], adv: ['sel-filter', 'sel-bgm', 'sel-eratone', 'sel-chroma'] };
    order.main.forEach(id => main.appendChild($('#' + id)));
    order.adv.forEach(id => adv.appendChild($('#' + id)));
    $('#sel-advanced').open = false;

    // メイン側だけ STEP番号を振る（こだわり側は素の見出し）
    let step = 1;
    order.main.forEach(id => {
      const h = $('#' + id).querySelector('.step-heading');
      if (h) h.textContent = `STEP ${step++}. ${h.dataset.title}`;
    });
    order.adv.forEach(id => {
      const h = $('#' + id).querySelector('.step-heading');
      if (h) h.textContent = h.dataset.title;
    });
  }

  /* 撮影モード（2026-07-26 追加）
     bust = 手に持って自撮り。前面カメラ・鏡像。これまでどおりの写り。
     full = 三脚にiPadを固定し、背面カメラで全身を撮る。文化祭の撮影ルーム用。
            背景はプロジェクター投影を使うので、デジタル背景（くりぬき）は強制OFFにする。 */
  function applyShotMode() {
    const full = state.shotMode === 'full';
    // 背面カメラでは鏡像にしない（投影背景の文字も服のロゴも裏返ってしまうため）
    document.body.dataset.mirror = full ? 'off' : 'on';
    document.querySelectorAll('.shotmode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.shotmode === state.shotMode);
    });
    if (full && state.chromaOn) {
      // 全身モードは実物のスクリーン投影が背景。くりぬきは邪魔になるので切る
      state.chromaOn = false;
      const t = $('#btn-chroma-toggle');
      if (t) { t.dataset.on = 'false'; t.textContent = 'OFF'; }
    }
    const chromaSec = $('#sel-chroma');
    if (chromaSec) chromaSec.style.display = full ? 'none' : '';
  }

  document.querySelectorAll('.shotmode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.shotMode = btn.dataset.shotmode;
      playSound('seDecide');
      applyShotMode();
    });
  });

  // 背景くりぬきトグル（文化祭ではアナログのカーテン背景を使うため、デフォルトOFF）
  const chromaToggle = $('#btn-chroma-toggle');
  chromaToggle.addEventListener('click', () => {
    state.chromaOn = !state.chromaOn;
    chromaToggle.dataset.on = String(state.chromaOn);
    chromaToggle.textContent = state.chromaOn ? 'ON' : 'OFF';
    if (state.chromaOn && !imageSegmenter && !segmenterLoading) initSegmenter();
  });

  $('#btn-to-camera').addEventListener('click', async () => {
    showScreen('screen-camera');
    await startCamera();
  });

  /* 撮影画面→コース選択へ戻る（撮影開始前だけ。開始後は実機同様戻れない）。
     選択内容はそのまま残す＝選び直しに来ただけなのでリセットしない */
  $('#btn-back-select').addEventListener('click', () => {
    stopCamera();
    showScreen('screen-select');
  });

  /* ===================== MediaPipe 共通 ===================== */
  const MP_VERSION = '0.10.14';
  let visionModulePromise = null;
  let filesetPromise = null;

  function loadVision() {
    if (!visionModulePromise) {
      visionModulePromise = import(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/vision_bundle.mjs`);
    }
    return visionModulePromise;
  }
  async function loadFileset() {
    if (!filesetPromise) {
      filesetPromise = (async () => {
        const vision = await loadVision();
        return vision.FilesetResolver.forVisionTasks(
          `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`
        );
      })();
    }
    return filesetPromise;
  }

  /* ===================== 人物くり抜き（選択式） ===================== */
  const previewCanvas = $('#preview-canvas');
  const previewCtx = previewCanvas.getContext('2d');
  const segmenterStatus = $('#segmenter-status');
  previewCanvas.width = SHOT_W;
  previewCanvas.height = SHOT_H;

  let imageSegmenter = null;
  let segmenterLoading = false;
  let segmenterFailed = false;
  let segmenterIsMulticlass = false;
  let previewRunning = false;
  let personWorkCanvas = null, personWorkCtx = null;

  // 推論は縮小プロキシに対して行う（高速化 + マスク後処理の解像度を固定）
  const SEG_W = 320, SEG_H = 240;
  const segProxy = document.createElement('canvas');
  segProxy.width = SEG_W; segProxy.height = SEG_H;
  const segProxyCtx = segProxy.getContext('2d');
  const segMaskSmall = document.createElement('canvas');
  const segMaskSmallCtx = segMaskSmall.getContext('2d');
  let segEMA = null; // フレーム間の指数移動平均（チラつき防止）

  async function initSegmenter() {
    segmenterLoading = true;
    try {
      const vision = await loadVision();
      const fileset = await loadFileset();
      // 高精度な多クラスモデル（髪まで人物として正確に分類）を最優先で使用
      try {
        imageSegmenter = await vision.ImageSegmenter.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          outputConfidenceMasks: true,
        });
        segmenterIsMulticlass = true;
      } catch (errMulti) {
        console.warn('多クラスモデルの読み込みに失敗。旧セルフィーモデルにフォールバックします。', errMulti);
        imageSegmenter = await vision.ImageSegmenter.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          outputConfidenceMasks: true,
        });
        segmenterIsMulticlass = false;
      }
      if (state.chromaOn) {
        segmenterStatus.textContent = '✨ 背景くりぬき 準備OK！';
        segmenterStatus.classList.remove('hidden');
        setTimeout(() => segmenterStatus.classList.add('hidden'), 1500);
      }
    } catch (err) {
      console.warn('人物くり抜きモデルの読み込みに失敗しました。通常のカメラ映像で撮影します。', err);
      segmenterFailed = true;
      if (state.chromaOn) {
        segmenterStatus.textContent = '（背景くりぬきは今回お休み中）';
        segmenterStatus.classList.remove('hidden');
        setTimeout(() => segmenterStatus.classList.add('hidden'), 2500);
      }
    }
    segmenterLoading = false;
  }

  function segmentForVideoAsync(sourceEl, ts) {
    return new Promise((resolve) => {
      imageSegmenter.segmentForVideo(sourceEl, ts, (result) => resolve(result));
    });
  }

  function smoothstep(lo, hi, v) {
    const t = Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
    return t * t * (3 - 2 * t);
  }

  // 人物信頼度マスク → 時間平滑化(EMA) + スムーズステップ + チョークで高品質なアルファマスクを作る
  function buildPersonMask(result) {
    const masks = result.confidenceMasks;
    if (!masks || !masks.length) return null;
    // 多クラス: 人物 = 1 - 背景[0] / 旧モデル: 人物 = [0]
    const conf = masks[0].getAsFloat32Array();
    const mw = masks[0].width, mh = masks[0].height;
    const len = conf.length;
    if (!segEMA || segEMA.length !== len) segEMA = new Float32Array(len);

    if (segMaskSmall.width !== mw || segMaskSmall.height !== mh) {
      segMaskSmall.width = mw; segMaskSmall.height = mh;
    }
    const md = segMaskSmallCtx.createImageData(mw, mh);
    const d = md.data;
    for (let i = 0; i < len; i++) {
      const person = segmenterIsMulticlass ? (1 - conf[i]) : conf[i];
      // フレーム間EMAでチラつきを抑える
      const ema = segEMA[i] = segEMA[i] * 0.35 + person * 0.65;
      // スムーズステップ（下限0.45=チョーク: 縁の背景色フリンジを削る）
      const a = smoothstep(0.45, 0.75, ema);
      const o = i * 4;
      d[o] = 255; d[o + 1] = 255; d[o + 2] = 255;
      d[o + 3] = (a * 255) | 0;
    }
    segMaskSmallCtx.putImageData(md, 0, 0);
    masks.forEach(m => m.close && m.close());
    if (result.close) result.close();
    return segMaskSmall;
  }

  // カラーユーティリティ（背景グラデーション用）
  function shadeColor(hex, amt) {
    const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amt));
    const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amt));
    const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + amt));
    return `rgb(${r},${g},${b})`;
  }

  // デジタル背景（ベタ塗りではなく、スタジオ照明風のグラデーション）
  function drawCurtainBg(ctx) {
    const c = state.curtain.color;
    const grad = ctx.createLinearGradient(0, 0, 0, SHOT_H);
    grad.addColorStop(0, shadeColor(c, 30));
    grad.addColorStop(0.55, c);
    grad.addColorStop(1, shadeColor(c, -18));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SHOT_W, SHOT_H);
    // 中央上にやわらかいライト
    const light = ctx.createRadialGradient(SHOT_W / 2, SHOT_H * 0.3, 0, SHOT_W / 2, SHOT_H * 0.3, SHOT_W * 0.65);
    light.addColorStop(0, 'rgba(255,255,255,.22)');
    light.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, SHOT_W, SHOT_H);
  }

  /* ===================== ライブ盛れプレビュー（2026-07-31 新設） =====================
     令和モードの撮影中、ライブ映像に「盛れた自分」をリアルタイム表示する。
     現行プリ機・SNOW世代の「撮る前から盛れてる」を再現するのが目的。

     設計の要点:
     - 撮影データ(captureFrame)は無加工の liveClean から取る。ライブ盛れは表示専用。
       撮影後は従来の高品質パイプライン(applyBeauty)で本加工するので二重加工しない。
     - iPad Safari 対応のため ctx.filter は使わず、ブレンド合成＋縮小拡大ぼかしのみ。
     - 肌マスクは背景くりぬきと同じ selfie_multiclass の1回の推論から相乗りで取る
       （追加の推論コストほぼゼロ）。くり抜きOFF時も盛れ用に推論を回す。
     - 顔ランドマークは VIDEO モードの専用インスタンスで間引き検出。
     - 端末が重い場合は自動で段階的に軽くする（検出間引き→デカ目OFF→ライブ盛れOFF）。 */
  const liveClean = document.createElement('canvas');
  liveClean.width = SHOT_W; liveClean.height = SHOT_H;
  const liveCleanCtx = liveClean.getContext('2d');

  // ライブ用の肌マスク（推論解像度のまま持ち、描画時にバイリニア拡大＝フェザー）
  const liveSkinSmall = document.createElement('canvas');
  const liveSkinSmallCtx = liveSkinSmall.getContext('2d');
  let liveSkinEMA = null;
  let liveSkinReady = false;

  // ライブ用顔ランドマーク（VIDEOモード・盛り画面のIMAGEモードとは別インスタンス）
  let faceLandmarkerLive = null;
  let landmarkerLiveLoading = false;
  let landmarkerLiveFailed = false;
  let liveFaces = null;
  let liveFrameCount = 0;

  // パフォーマンス自動調整
  const livePerf = { ema: 0, detectEvery: 2, eyeOn: true, disabled: false, noted: false };
  let liveReadyNoted = false; // 「準備中→ON」の一言を1セッション1回だけ出す

  function liveBeautyWanted() {
    return state.mode === 'reiwa' && state.liveBeautyOn && !livePerf.disabled;
  }

  async function initFaceLandmarkerLive() {
    if (faceLandmarkerLive || landmarkerLiveLoading || landmarkerLiveFailed) return;
    landmarkerLiveLoading = true;
    try {
      const vision = await loadVision();
      const fileset = await loadFileset();
      faceLandmarkerLive = await vision.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 4, // ライブは軽さ優先で4人まで（撮影後の本加工は従来どおり6人）
        minFaceDetectionConfidence: 0.3,
        minFacePresenceConfidence: 0.3,
      });
    } catch (err) {
      console.warn('ライブ用顔ランドマークの読み込みに失敗しました。ライブ盛れは肌のみになります。', err);
      landmarkerLiveFailed = true;
    }
    landmarkerLiveLoading = false;
  }

  // multiclass の推論結果から、人物マスクとライブ肌マスクを同時に作る（1推論で2役）
  function buildLiveSkinMask(masks) {
    if (!segmenterIsMulticlass || !masks || masks.length < 4) { liveSkinReady = false; return; }
    const bodySkin = masks[2].getAsFloat32Array();
    const faceSkin = masks[3].getAsFloat32Array();
    const mw = masks[2].width, mh = masks[2].height;
    const len = faceSkin.length;
    if (!liveSkinEMA || liveSkinEMA.length !== len) liveSkinEMA = new Float32Array(len);
    if (liveSkinSmall.width !== mw || liveSkinSmall.height !== mh) {
      liveSkinSmall.width = mw; liveSkinSmall.height = mh;
    }
    const md = liveSkinSmallCtx.createImageData(mw, mh);
    const d = md.data;
    for (let i = 0; i < len; i++) {
      const conf = Math.min(1, faceSkin[i] + bodySkin[i] * 0.65);
      const ema = liveSkinEMA[i] = liveSkinEMA[i] * 0.4 + conf * 0.6;
      const o = i * 4;
      d[o] = 255; d[o + 1] = 255; d[o + 2] = 255;
      d[o + 3] = (smoothstep(0.35, 0.7, ema) * 255) | 0;
    }
    liveSkinSmallCtx.putImageData(md, 0, 0);
    liveSkinReady = true;
  }

  // デカ目のライブ版: 本番の radialWarp は重いので、フェザー付き拡大コピーで近似する
  let liveEyeTmp = null, liveEyeTmpCtx = null;
  function liveEyeMagnify(ctx, cleanCv, faces, eyeS) {
    if (!faces || !faces.length || eyeS <= 0) return;
    if (!liveEyeTmp) {
      liveEyeTmp = document.createElement('canvas');
      liveEyeTmpCtx = liveEyeTmp.getContext('2d');
    }
    const w = cleanCv.width, h = cleanCv.height;
    faces.forEach((lm) => {
      if (!lm || lm.length < 478) return;
      const eyes = [
        { c: lmToPx(lm[468], w, h), ew: dist(lmToPx(lm[33], w, h), lmToPx(lm[133], w, h)) },
        { c: lmToPx(lm[473], w, h), ew: dist(lmToPx(lm[362], w, h), lmToPx(lm[263], w, h)) },
      ];
      eyes.forEach(({ c, ew }) => {
        const r = ew * 1.5;
        if (r < 4) return;
        // 切り出し元が画面外にはみ出すと拡大コピーが歪むため、端に近い目はスキップ
        // （撮影後の本加工 radialWarp は画面端でも正しく処理される）
        if (c.x - r < 0 || c.y - r < 0 || c.x + r > w || c.y + r > h) return;
        const dpx = Math.ceil(r * 2);
        if (liveEyeTmp.width !== dpx || liveEyeTmp.height !== dpx) {
          liveEyeTmp.width = dpx; liveEyeTmp.height = dpx;
        }
        const scale = 1 + eyeS * 0.16; // 本番warp(0.28)より控えめ＝近似のアラを出さない
        const ds = dpx * scale;
        const off = (ds - dpx) / 2;
        liveEyeTmpCtx.globalCompositeOperation = 'source-over';
        liveEyeTmpCtx.clearRect(0, 0, dpx, dpx);
        liveEyeTmpCtx.imageSmoothingEnabled = true;
        liveEyeTmpCtx.drawImage(cleanCv, c.x - r, c.y - r, dpx, dpx, -off, -off, ds, ds);
        // 縁をフェザーして周囲と馴染ませる
        const grad = liveEyeTmpCtx.createRadialGradient(r, r, r * 0.45, r, r, r);
        grad.addColorStop(0, 'rgba(0,0,0,1)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        liveEyeTmpCtx.globalCompositeOperation = 'destination-in';
        liveEyeTmpCtx.fillStyle = grad;
        liveEyeTmpCtx.fillRect(0, 0, dpx, dpx);
        liveEyeTmpCtx.globalCompositeOperation = 'source-over';
        ctx.drawImage(liveEyeTmp, c.x - r, c.y - r);
      });
    });
  }

  // ライブ盛れの1フレーム描画（previewCtx に、liveClean を土台として重ねる）
  function renderLiveBeauty(ctx) {
    const conf = modeConf();
    const p = state.beauty;
    const skinS = p.skin / 100;
    const whiteS = (p.white || 0) / 100;
    const clearS = (p.clear || 0) / 100;
    const w = SHOT_W, h = SHOT_H;

    if ((skinS > 0 || whiteS > 0 || clearS > 0) && liveSkinReady) {
      // ぼかし肌レイヤー（縮小→拡大。makeBlurred は共有キャンバスを返すので即描く）
      const layerCtx = getSkinLayer(w, h);
      layerCtx.globalCompositeOperation = 'source-over';
      layerCtx.clearRect(0, 0, w, h);
      layerCtx.imageSmoothingEnabled = true;
      layerCtx.drawImage(makeBlurred(liveClean, 5), 0, 0, w, h);
      layerCtx.globalCompositeOperation = 'destination-in';
      layerCtx.drawImage(liveSkinSmall, 0, 0, w, h);
      layerCtx.globalCompositeOperation = 'source-over';

      if (skinS > 0) {
        // 美肌: ぼかし肌を重ねて肌質をならす（ライブ簡易版）
        ctx.globalAlpha = Math.min(1, skinS * 0.75);
        ctx.drawImage(skinLayerCanvas, 0, 0);
        ctx.globalAlpha = 1;
      }
      if (clearS > 0) {
        // 透明感: 色ムラをならす（color合成）＋うっすらグロー。本番と同じ軸の簡易版
        if (conf.clearColorSmooth && canUseColorBlend()) {
          ctx.globalCompositeOperation = 'color';
          ctx.globalAlpha = Math.min(1, clearS * 0.6);
          ctx.drawImage(skinLayerCanvas, 0, 0);
        }
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = clearS * 0.15;
        ctx.drawImage(skinLayerCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
      if (whiteS > 0) {
        // 美白: 白を肌マスク越しにスクリーン合成
        layerCtx.clearRect(0, 0, w, h);
        layerCtx.fillStyle = '#ffffff';
        layerCtx.fillRect(0, 0, w, h);
        layerCtx.globalCompositeOperation = 'destination-in';
        layerCtx.drawImage(liveSkinSmall, 0, 0, w, h);
        layerCtx.globalCompositeOperation = 'source-over';
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = Math.min(1, whiteS * conf.skinTone.brightPerUnit * 2.0);
        ctx.drawImage(skinLayerCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }

    // デカ目（ライブ近似）＋チーク・リップ
    if (livePerf.eyeOn) liveEyeMagnify(ctx, liveClean, liveFaces, p.eye / 100);
    drawMakeup(ctx, liveFaces, w, h, (p.cheek || 0) / 100, (p.lip || 0) / 100, conf);

    // 選択中フィルターもライブで反映（合成のみなので軽い）
    const selFilter = conf.filters.find(f => f.id === p.filter);
    if (selFilter && selFilter.fx && Object.keys(selFilter.fx).length) {
      applyToneFx(ctx, w, h, selFilter.fx);
    }
  }

  // フレーム時間を見て自動的に軽くする（iPad実機の発熱・カクつき対策）
  function liveAutoDegrade(frameMs) {
    livePerf.ema = livePerf.ema ? livePerf.ema * 0.9 + frameMs * 0.1 : frameMs;
    if (livePerf.ema > 90 && livePerf.detectEvery < 3) livePerf.detectEvery = 3;
    if (livePerf.ema > 120 && livePerf.eyeOn) livePerf.eyeOn = false;
    if (livePerf.ema > 180 && !livePerf.disabled) {
      livePerf.disabled = true;
      if (!livePerf.noted) {
        livePerf.noted = true;
        segmenterStatus.textContent = '⚡ この端末では重いため、盛れはシャッター後に反映します';
        segmenterStatus.classList.remove('hidden');
        setTimeout(() => segmenterStatus.classList.add('hidden'), 2500);
        syncLiveBeautyUI();
      }
    }
  }

  // ライブプレビュー1フレーム分の合成。くりぬきOFF時は素通し＋軽い美肌ライト
  async function renderPreviewFrame(sourceEl) {
    const t0 = performance.now();
    const liveBeauty = liveBeautyWanted();
    let maskCv = null;
    liveFrameCount++;

    if ((state.chromaOn || (liveBeauty && segmenterIsMulticlass)) && imageSegmenter) {
      // 縮小プロキシへ描いてから推論（等倍より数倍高速）。カバークロップでアスペクト比を維持
      drawCover(segProxyCtx, sourceEl, 0, 0, SEG_W, SEG_H);
      const result = await segmentForVideoAsync(segProxy, performance.now());
      // 1回の推論から、人物マスク（くり抜き用）と肌マスク（ライブ盛れ用）を両取りする
      if (liveBeauty) {
        buildLiveSkinMask(result.confidenceMasks);
        // 準備が整った最初のフレームで一言（くり抜きONのときは既存の案内を優先）
        if (liveSkinReady && !liveReadyNoted && !state.chromaOn) {
          liveReadyNoted = true;
          segmenterStatus.textContent = '✨ ライブ盛れ ON！';
          segmenterStatus.classList.remove('hidden');
          setTimeout(() => segmenterStatus.classList.add('hidden'), 1500);
        }
      }
      if (state.chromaOn) {
        maskCv = buildPersonMask(result); // 内部で result を close する
      } else {
        if (result.confidenceMasks) result.confidenceMasks.forEach(m => m.close && m.close());
        if (result.close) result.close();
      }
    } else if (!imageSegmenter) {
      liveSkinReady = false;
      // モデルが読めなかった場合、「準備中…」を出しっぱなしにしない
      if (liveBeauty && segmenterFailed && !liveReadyNoted && !state.chromaOn) {
        liveReadyNoted = true;
        segmenterStatus.textContent = '（ライブ盛れは今回お休み中。撮影後にしっかり盛れます）';
        segmenterStatus.classList.remove('hidden');
        setTimeout(() => segmenterStatus.classList.add('hidden'), 2500);
      }
    }

    // --- 無加工の合成フレーム（撮影データはここから取る） ---
    liveCleanCtx.clearRect(0, 0, SHOT_W, SHOT_H);
    if (maskCv) {
      if (!personWorkCanvas) { personWorkCanvas = document.createElement('canvas'); personWorkCtx = personWorkCanvas.getContext('2d'); }
      if (personWorkCanvas.width !== SHOT_W || personWorkCanvas.height !== SHOT_H) {
        personWorkCanvas.width = SHOT_W; personWorkCanvas.height = SHOT_H;
      }
      personWorkCtx.globalCompositeOperation = 'source-over';
      personWorkCtx.clearRect(0, 0, SHOT_W, SHOT_H);
      drawCover(personWorkCtx, sourceEl, 0, 0, SHOT_W, SHOT_H); // 顔が縦長にならないようアスペクト比を維持
      personWorkCtx.globalCompositeOperation = 'destination-in';
      personWorkCtx.imageSmoothingEnabled = true;
      personWorkCtx.drawImage(maskCv, 0, 0, SHOT_W, SHOT_H); // 拡大時のバイリニアがフェザーになる
      personWorkCtx.globalCompositeOperation = 'source-over';

      drawCurtainBg(liveCleanCtx);
      liveCleanCtx.drawImage(personWorkCanvas, 0, 0, SHOT_W, SHOT_H);
    } else {
      drawCover(liveCleanCtx, sourceEl, 0, 0, SHOT_W, SHOT_H); // 顔が縦長にならないようアスペクト比を維持
    }
    // 撮影中は常時「肌が少し明るくなる」ライト効果（実機の照明再現・Safari対応のためスクリーン合成）
    applyToneFx(liveCleanCtx, SHOT_W, SHOT_H, { bright: 0.07 });

    // --- ライブ用の顔検出（間引き実行。座標系を合わせるため合成後のフレームに対して行う） ---
    if (liveBeauty && faceLandmarkerLive && liveFrameCount % livePerf.detectEvery === 0) {
      try {
        const res = faceLandmarkerLive.detectForVideo(liveClean, performance.now());
        liveFaces = (res.faceLandmarks && res.faceLandmarks.length) ? res.faceLandmarks : null;
      } catch (err) { /* 検出失敗フレームは前回の結果を使い続ける */ }
    }

    // --- 表示（ライブ盛れONなら加工を重ねる。撮影データには影響しない） ---
    previewCtx.clearRect(0, 0, SHOT_W, SHOT_H);
    previewCtx.drawImage(liveClean, 0, 0);
    if (liveBeauty) renderLiveBeauty(previewCtx);

    previewCanvas.classList.add('ready');
    video.classList.add('masked');
    if (liveBeauty) liveAutoDegrade(performance.now() - t0);
  }

  async function previewLoop() {
    if (!previewRunning) return;
    if (video.readyState >= 2 && video.videoWidth > 0) {
      await renderPreviewFrame(video);
    }
    if (previewRunning) requestAnimationFrame(previewLoop);
  }

  /* ===================== 顔ランドマーク（盛り機能用） ===================== */
  let faceLandmarker = null;
  let landmarkerLoading = false;
  let landmarkerFailed = false;

  async function initFaceLandmarker() {
    if (faceLandmarker || landmarkerLoading || landmarkerFailed) return;
    landmarkerLoading = true;
    try {
      const vision = await loadVision();
      const fileset = await loadFileset();
      faceLandmarker = await vision.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        numFaces: 6, // プリクラは複数人で撮るので余裕を持って6人まで
        // 端の人・小さめの顔・横向きの顔も拾えるよう、しきい値を下げる（複数人時のばらつき対策）
        minFaceDetectionConfidence: 0.3,
        minFacePresenceConfidence: 0.3,
      });
    } catch (err) {
      console.warn('顔ランドマークモデルの読み込みに失敗しました。デカ目・小顔はスキップされます。', err);
      landmarkerFailed = true;
    }
    landmarkerLoading = false;
  }

  /* ===================== 多クラス肌セグメンテーション（美肌の検知エンジン） =====================
     selfie_multiclass モデルは 背景/髪/体の肌/顔の肌/服/その他 をピクセル単位でML分類する。
     色ベースの肌検出と違い、髪・服・背景の誤検出が原理的に起きない。 */
  let skinSegmenter = null;
  let skinSegmenterLoading = false;
  let skinSegmenterFailed = false;

  async function initSkinSegmenter() {
    if (skinSegmenter || skinSegmenterLoading || skinSegmenterFailed) return;
    skinSegmenterLoading = true;
    try {
      const vision = await loadVision();
      const fileset = await loadFileset();
      skinSegmenter = await vision.ImageSegmenter.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite',
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        outputConfidenceMasks: true,
      });
    } catch (err) {
      console.warn('肌セグメンテーションモデルの読み込みに失敗しました。色ベースの肌検出にフォールバックします。', err);
      skinSegmenterFailed = true;
    }
    skinSegmenterLoading = false;
  }

  // 1ショット分のML肌信頼度マスク（顔の肌[3]+体の肌[2]）をキャンバスとして返す
  function computeSkinConf(srcCanvas) {
    if (!skinSegmenter) return null;
    try {
      const result = skinSegmenter.segment(srcCanvas);
      const masks = result.confidenceMasks;
      if (!masks || masks.length < 4) { if (result.close) result.close(); return null; }
      const bodySkin = masks[2].getAsFloat32Array();
      const faceSkin = masks[3].getAsFloat32Array();
      const mw = masks[2].width, mh = masks[2].height;
      const small = document.createElement('canvas');
      small.width = mw; small.height = mh;
      const sctx = small.getContext('2d');
      const md = sctx.createImageData(mw, mh);
      for (let i = 0; i < faceSkin.length; i++) {
        // 顔の肌はフル強度、首・腕などの体の肌は65%に抑えて「顔を狙い撃ち」にする
        const conf = Math.min(1, faceSkin[i] + bodySkin[i] * 0.65);
        const o = i * 4;
        md.data[o] = 255; md.data[o + 1] = 255; md.data[o + 2] = 255;
        md.data[o + 3] = Math.round(conf * 255);
      }
      sctx.putImageData(md, 0, 0);
      masks.forEach(m => m.close && m.close());
      if (result.close) result.close();
      // 撮影解像度へスムーズ拡大（バイリニア拡大がそのまま縁のフェザーになる）
      const full = document.createElement('canvas');
      full.width = srcCanvas.width; full.height = srcCanvas.height;
      const fctx = full.getContext('2d');
      fctx.imageSmoothingEnabled = true;
      fctx.drawImage(small, 0, 0, full.width, full.height);
      return full;
    } catch (err) {
      console.warn('肌セグメンテーションに失敗しました', err);
      return null;
    }
  }

  /* ===================== 2. 撮影画面 ===================== */
  const video = $('#video');
  const flashCanvas = $('#flash-canvas');
  const countdownEl = $('#countdown-num');
  const shotIndicator = $('#shot-indicator');
  const camError = $('#cam-error');
  const btnStartShooting = $('#btn-start-shooting');

  /* ---------- ライブ盛れUI（令和モードの撮影画面だけに出す） ---------- */
  const liveBeautyPanel = $('#live-beauty-panel');
  const btnLiveBeauty = $('#btn-live-beauty');
  const livePresetRow = $('#live-preset-row');

  function syncLiveBeautyUI() {
    const isReiwa = state.mode === 'reiwa';
    liveBeautyPanel.classList.toggle('hidden', !isReiwa);
    if (!isReiwa) return;
    const on = state.liveBeautyOn && !livePerf.disabled;
    btnLiveBeauty.textContent = on ? '✨ ライブ盛れ ON' : 'ライブ盛れ OFF';
    btnLiveBeauty.classList.toggle('on', on);
    livePresetRow.classList.toggle('dimmed', !on);
    // 盛れ感プリセット（無加工風/ナチュ盛れ/プリ盛れ）。選ぶと撮影後の盛り調整の初期値にもなる
    const conf = modeConf();
    livePresetRow.innerHTML = '';
    conf.presets.forEach(p => {
      const b = document.createElement('button');
      const isActive = ['skin', 'white', 'clear', 'eye', 'face', 'cheek', 'lip'].every(k => state.beauty[k] === p[k]);
      b.className = 'live-preset-btn' + (isActive ? ' active' : '');
      b.textContent = p.label;
      b.addEventListener('click', () => {
        state.beauty.skin = p.skin;
        state.beauty.white = p.white;
        state.beauty.clear = p.clear;
        state.beauty.eye = p.eye;
        state.beauty.face = p.face;
        state.beauty.cheek = p.cheek;
        state.beauty.lip = p.lip;
        syncLiveBeautyUI();
      });
      livePresetRow.appendChild(b);
    });
  }

  btnLiveBeauty.addEventListener('click', () => {
    if (livePerf.disabled) {
      // 自動OFFされた端末でオーナーが明示的に押し直したら、もう一度だけ試す
      livePerf.disabled = false;
      livePerf.ema = 0;
      state.liveBeautyOn = true;
    } else {
      state.liveBeautyOn = !state.liveBeautyOn;
    }
    if (state.liveBeautyOn) {
      initFaceLandmarkerLive();
      if (!imageSegmenter && !segmenterFailed && !segmenterLoading) initSegmenter();
    }
    syncLiveBeautyUI();
  });

  function buildShotIndicator() {
    shotIndicator.innerHTML = '';
    for (let i = 0; i < NUM_SHOTS; i++) {
      const dot = document.createElement('div');
      dot.className = 'shot-dot';
      shotIndicator.appendChild(dot);
    }
  }
  buildShotIndicator();

  async function startCamera() {
    camError.textContent = '';
    state.shots = [];
    state.processedShots = [];
    state.faceData = [];
    state.skinConf = [];
    skinMaskCache.clear();
    segEMA = null; // 前回セッションのマスク残像を消す
    buildShotIndicator();
    $('#shots-left').textContent = NUM_SHOTS;
    btnStartShooting.disabled = false;
    btnStartShooting.style.display = 'inline-block';
    $('#btn-back-select').style.display = ''; // 撮影開始前は戻れる
    previewCanvas.classList.remove('ready');
    video.classList.remove('masked');

    // 盛り機能用のモデルを裏で読み込み開始（盛り画面までに間に合わせる）
    initFaceLandmarker();
    initSkinSegmenter();

    // ライブ盛れ（令和モード）: 肌マスク用のセグメンタと VIDEO 用顔ランドマークを準備
    liveFaces = null;
    liveSkinEMA = null;
    liveSkinReady = false;
    liveFrameCount = 0;
    livePerf.ema = 0; // 前セッションの負荷計測はリセット（degrade段階は端末特性なので維持）
    liveReadyNoted = false;
    syncLiveBeautyUI();
    if (state.mode === 'reiwa' && state.liveBeautyOn && !livePerf.disabled) {
      initFaceLandmarkerLive();
      if (!imageSegmenter && !segmenterFailed && !segmenterLoading) initSegmenter();
      // 準備中の一言（くり抜きONのときは既存の案内を優先）
      if (!state.chromaOn && !(imageSegmenter && segmenterIsMulticlass)) {
        segmenterStatus.textContent = '✨ ライブ盛れを準備中…';
        segmenterStatus.classList.remove('hidden');
      }
    }

    if (state.chromaOn) {
      if (imageSegmenter) {
        segmenterStatus.classList.add('hidden');
      } else if (segmenterFailed) {
        segmenterStatus.textContent = '（背景くりぬきは今回お休み中）';
        segmenterStatus.classList.remove('hidden');
        setTimeout(() => segmenterStatus.classList.add('hidden'), 2500);
      } else {
        segmenterStatus.textContent = '🪄 背景くりぬきを読み込み中…';
        segmenterStatus.classList.remove('hidden');
        if (!segmenterLoading) initSegmenter();
      }
    } else {
      segmenterStatus.classList.add('hidden');
    }

    try {
      // 全身モードは三脚に固定して背面（アウト）カメラで撮る。バストアップは従来どおり前面。
      const facing = state.shotMode === 'full' ? 'environment' : 'user';
      state.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      video.srcObject = state.stream;
      previewRunning = true;
      previewLoop();
    } catch (err) {
      camError.textContent = 'カメラを起動できませんでした。ブラウザのカメラ許可設定をご確認ください。(' + err.message + ')';
    }
  }

  function stopCamera() {
    previewRunning = false;
    if (state.stream) {
      state.stream.getTracks().forEach(t => t.stop());
      state.stream = null;
    }
  }

  const COUNTDOWN_STEPS = [
    { key: 'count3', label: '3' },
    { key: 'count2', label: '2' },
    { key: 'count1', label: '1' },
    { key: 'countHai', label: 'ハイ！' },
  ];

  /* ポーズ提案ボイス（2026-08-12 新設）: 実機は「テンポのよい掛け声とポーズ提案が
     矢継ぎ早に流れる」（era-designerリサーチ）。pose_01〜06 を1プレイ内で重複しない
     ランダム順に消化し、7回目以降はまたシャッフルして続ける。 */
  const POSE_KEYS = ['pose1', 'pose2', 'pose3', 'pose4', 'pose5', 'pose6'];
  let poseOrder = [];
  let poseOrderIdx = 0;
  function resetPoseOrder() {
    poseOrder = POSE_KEYS.slice();
    for (let i = poseOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [poseOrder[i], poseOrder[j]] = [poseOrder[j], poseOrder[i]];
    }
    poseOrderIdx = 0;
  }
  function nextPoseKey() {
    if (poseOrderIdx >= poseOrder.length) resetPoseOrder();
    return poseOrder[poseOrderIdx++];
  }

  async function runCountdown(shotIndex, opts) {
    const { skipIntro = false, poseKey = null } = opts || {};
    // 前置き（1枚目いくよー等）。撮り直しのときは飛ばしてテンポを保つ
    if (!skipIntro) await playSoundAwait('introShot' + (shotIndex + 1));
    // ポーズ提案ボイス（ファイル未着なら黙ってスキップ）
    if (poseKey) await playSoundAwait(poseKey);
    for (const step of COUNTDOWN_STEPS) {
      countdownEl.textContent = step.label;
      countdownEl.style.opacity = '1';
      countdownEl.style.transform = 'scale(1.15)';
      await sleep(60);
      countdownEl.style.transform = 'scale(1)';
      await playSoundAwait(step.key);
      await sleep(240); // 無音カット済みクリップは短いので、テンポが速くなりすぎないよう間を取る
      countdownEl.style.opacity = '0';
      await sleep(60);
    }
  }

  function captureFrame() {
    const c = document.createElement('canvas');
    c.width = SHOT_W; c.height = SHOT_H;
    const ctx = c.getContext('2d');
    // 前面カメラのときだけ、鏡合わせのプレビューに合わせて左右反転して保存する。
    // 背面カメラ（全身モード）は反転しない＝見たままが写る。
    if (state.shotMode !== 'full') {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }
    // ライブ盛れは表示専用。撮影データは無加工の liveClean から取り、
    // 撮影後の高品質パイプライン(applyBeauty)で本加工する（二重加工の防止・2026-07-31）
    ctx.drawImage(liveClean, 0, 0, c.width, c.height);
    return c;
  }

  async function flash() {
    flashCanvas.style.transition = 'none';
    flashCanvas.style.opacity = '0.9';
    await sleep(60);
    flashCanvas.style.transition = 'opacity .35s ease';
    flashCanvas.style.opacity = '0';
  }

  /* 準備カウント（全身モードのみ）
     プリクラ機は無人。押した本人が雲台を回して場ミリまで歩き、構えるための時間。
     プロジェクターに大きく出るので、部屋のどこからでも残り秒数が見える。 */
  async function runPrepCountdown() {
    const note = document.createElement('div');
    note.className = 'prep-note';
    note.textContent = 'カメラを回して、立ちいちへ！';
    countdownEl.parentElement.appendChild(note);
    countdownEl.classList.add('prep');
    countdownEl.style.opacity = '1';
    for (let s = PREP_SECONDS; s > 0; s--) {
      countdownEl.textContent = String(s);
      if (s <= 3) playSound('seTap');
      if (s === 3) note.textContent = 'ポーズをきめて！';
      await sleep(1000);
    }
    countdownEl.style.opacity = '0';
    countdownEl.classList.remove('prep');
    note.remove();
  }

  /* ---------- 「この画像でオッケー？！」チェック（2026-08-12 新設） ----------
     現行実機の「3、2、1…この画像でオッケー？！」を再現。撮影直後の1枚を見せて
     タップで採用/撮り直しを選ばせる。プリクラ機は無人運用なので、
     OK_CHECK_AUTO_SECONDS 何も押されなければ自動で採用して先へ進む（行列を止めない）。
     撮り直しは1ショットにつき1回まで（4枚全自動のテンポを崩さないための上限）。 */
  const OK_CHECK_AUTO_SECONDS = 8;
  const okCheckEl = $('#ok-check');
  const btnOkYes = $('#btn-ok-yes');
  const btnOkRetake = $('#btn-ok-retake');
  const okAutoNote = $('#ok-auto-note');

  function askOkCheck(canRetake) {
    return new Promise((resolve) => {
      playSound('okCheck');
      btnOkRetake.style.display = canRetake ? '' : 'none';
      okCheckEl.classList.remove('hidden');
      let remain = OK_CHECK_AUTO_SECONDS;
      okAutoNote.textContent = `なにも押さないと あと${remain}秒で自動オッケー！`;
      const done = (ok) => {
        clearInterval(iv);
        btnOkYes.onclick = null;
        btnOkRetake.onclick = null;
        okCheckEl.classList.add('hidden');
        resolve(ok);
      };
      const iv = setInterval(() => {
        remain--;
        if (remain <= 0) { done(true); return; }
        okAutoNote.textContent = `なにも押さないと あと${remain}秒で自動オッケー！`;
      }, 1000);
      btnOkYes.onclick = () => done(true);
      btnOkRetake.onclick = () => done(false);
    });
  }

  btnStartShooting.addEventListener('click', async () => {
    btnStartShooting.disabled = true;
    btnStartShooting.style.display = 'none';
    $('#btn-back-select').style.display = 'none'; // 撮影開始後は実機同様戻れない
    const poseGuideEl = $('#pose-guide');
    if (state.shotMode === 'full') {
      poseGuideEl.textContent = 'じゅんびちゅう…';
      await runPrepCountdown();
      poseGuideEl.textContent = 'かわいく決めてね💕';
    }
    resetPoseOrder();
    for (let i = 0; i < NUM_SHOTS; i++) {
      let retakes = 0;
      for (;;) {
        poseGuideEl.textContent = POSE_GUIDES[i] || 'かわいく決めてね💕';
        await runCountdown(i, { skipIntro: retakes > 0, poseKey: nextPoseKey() });
        const shot = captureFrame();
        playSound('seShutter');
        await flash();

        // 撮った1枚をその場でチラ見せ（実機の「今の撮れた！」感）
        previewRunning = false;
        previewCtx.save();
        // 前面カメラのときは画面表示がCSSで左右反転されるため、事前に反転して相殺する。
        // 背面カメラ（全身モード）はCSS反転も無効なので、そのまま描く。
        if (state.shotMode !== 'full') {
          previewCtx.translate(SHOT_W, 0);
          previewCtx.scale(-1, 1);
        }
        previewCtx.drawImage(shot, 0, 0);
        previewCtx.restore();
        // ライブ盛れ中は、チラ見せも盛れた見た目で（無加工に戻ると「あれ？」となるため）
        if (liveBeautyWanted()) renderLiveBeauty(previewCtx);
        await sleep(500);

        // 「この画像でオッケー？！」（無人運用のため無操作なら自動採用・撮り直しは1回まで）
        const ok = await askOkCheck(retakes < 1);
        if (ok) {
          state.shots.push(shot);
          shotIndicator.children[i].classList.add('done');
          $('#shots-left').textContent = Math.max(0, NUM_SHOTS - state.shots.length);
          break;
        }
        retakes++;
        poseGuideEl.textContent = 'もういっかい！';
        previewRunning = true;
        previewLoop();
        await sleep(400);
      }
      if (i < NUM_SHOTS - 1) {
        previewRunning = true;
        previewLoop();
        await sleep(300);
      }
    }
    poseGuideEl.textContent = 'かわいく決めてね💕';
    stopCamera();
    if (state.mode === 'heisei') {
      // 平成モードに盛り調整（デカ目・美肌スライダー等）は存在しない時代。
      // 初代プリ機の「低画素カメラで写りが良く見える」を固定の軽い補正で再現し、そのまま落書きへ
      poseGuideEl.textContent = '現像中…📸';
      await finishHeiseiProcessing();
    } else {
      startBeautyScreen();
    }
  });

  /* 平成考証の写り「〜2006 黄み肌」（2026-08-12 新設・era-designerのリサーチ準拠）:
     2006年頃までの実機は「黄みがかった肌色・加工感は少なめ・画質は荒い」（4Gamer再現体験記/JAIA20年史）。
     黄みをソフトライトで乗せ、いったん縮小してから戻すことで当時の低画素感を出す。
     ctx.filter は使わない（iPad Safari 地雷）。ブレンド合成と縮小拡大のみ。 */
  let y2kTmp = null;
  function applyHeiseiY2kTone(canvas) {
    const w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext('2d');
    // 画質荒め: 55%へ縮小→戻す（バイリニアで少し甘い、当時の200万画素感）
    if (!y2kTmp) y2kTmp = document.createElement('canvas');
    const sw = Math.round(w * 0.55), sh = Math.round(h * 0.55);
    y2kTmp.width = sw; y2kTmp.height = sh;
    const tctx = y2kTmp.getContext('2d');
    tctx.imageSmoothingEnabled = true;
    tctx.drawImage(canvas, 0, 0, sw, sh);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(y2kTmp, 0, 0, sw, sh, 0, 0, w, h);
    // 黄み方向の色転び＋わずかなコントラスト（蛍光灯下のCCDの絵作り）
    applyToneFx(ctx, w, h, {
      warm: { color: '#d9b24a', amt: 0.30 },
      tan:  { color: '#f2e6bf', amt: 0.14 },
      contrast: 0.06,
    });
  }

  // 平成モード用: 盛りUIなしの自動仕上げ（軽い写り補正 + 選択画面で選んだフィルター）
  async function finishHeiseiProcessing() {
    try {
      await initSkinSegmenter(); // 肌検知だけ使う（顔ランドマークは不要）
      for (let i = 0; i < state.shots.length; i++) {
        state.skinConf[i] = computeSkinConf(state.shots[i]);
      }
      skinMaskCache.clear();
    } catch (err) { /* 肌検知が使えなくてもフィルターのみで続行 */ }
    /* 写り年代（平成考証）: スタンダードは従来どおりの軽い固定補正。
       「〜2006 黄み肌」は補正をさらに抑えて（加工感少なめの史実）、黄み転びを後がけする。
       既存の盛り機能には触れない＝考証オプションとしての共存（2026-08-12 オーナー指示） */
    const y2k = state.heiseiEra === 'y2k';
    const params = y2k
      ? { skin: 12, white: 4, clear: 5, eye: 0, face: 0, cheek: 0, lip: 0, filter: state.beauty.filter }
      : { skin: 25, white: 10, clear: 12, eye: 0, face: 0, cheek: 0, lip: 0, filter: state.beauty.filter };
    state.processedShots = state.shots.map((shot, i) => {
      const out = applyBeauty(shot, null, params, null, i);
      if (y2k) applyHeiseiY2kTone(out);
      return out;
    });
    composeSheet();
    startDecoScreen();
  }

  /* ===================== 盛り加工エンジン ===================== */

  // 放射状ワープ。strength > 0 で中心を拡大（デカ目）、< 0 で収縮（小顔）
  function radialWarp(canvas, cx, cy, R, strength) {
    if (Math.abs(strength) < 0.005 || R < 4) return;
    const ctx = canvas.getContext('2d');
    const x0 = Math.max(0, Math.floor(cx - R));
    const y0 = Math.max(0, Math.floor(cy - R));
    const x1 = Math.min(canvas.width, Math.ceil(cx + R));
    const y1 = Math.min(canvas.height, Math.ceil(cy + R));
    const bw = x1 - x0, bh = y1 - y0;
    if (bw <= 0 || bh <= 0) return;
    const src = ctx.getImageData(x0, y0, bw, bh);
    const dst = ctx.createImageData(bw, bh);
    const sd = src.data, dd = dst.data;
    const R2 = R * R;
    for (let y = 0; y < bh; y++) {
      const py = y + y0;
      for (let x = 0; x < bw; x++) {
        const px = x + x0;
        const dx = px - cx, dy = py - cy;
        const d2 = dx * dx + dy * dy;
        const o = (y * bw + x) * 4;
        if (d2 >= R2) {
          const so = o;
          dd[o] = sd[so]; dd[o + 1] = sd[so + 1]; dd[o + 2] = sd[so + 2]; dd[o + 3] = sd[so + 3];
          continue;
        }
        const r2n = d2 / R2;
        const falloff = (1 - r2n) * (1 - r2n);
        const t = 1 - strength * falloff;
        let sx = cx + dx * t - x0;
        let sy = cy + dy * t - y0;
        if (sx < 0) sx = 0; else if (sx > bw - 1.001) sx = bw - 1.001;
        if (sy < 0) sy = 0; else if (sy > bh - 1.001) sy = bh - 1.001;
        // バイリニア補間
        const ix = Math.floor(sx), iy = Math.floor(sy);
        const fx = sx - ix, fy = sy - iy;
        const o00 = (iy * bw + ix) * 4;
        const o10 = o00 + 4;
        const o01 = o00 + bw * 4;
        const o11 = o01 + 4;
        for (let ch = 0; ch < 4; ch++) {
          const v = sd[o00 + ch] * (1 - fx) * (1 - fy)
                  + sd[o10 + ch] * fx * (1 - fy)
                  + sd[o01 + ch] * (1 - fx) * fy
                  + sd[o11 + ch] * fx * fy;
          dd[o + ch] = v;
        }
      }
    }
    ctx.putImageData(dst, x0, y0);
  }

  // 方向性ワープ（リフトアップ用）。中心付近のコンテンツを (dxAmt, dyAmt) 方向へずらす
  function directionalWarp(canvas, cx, cy, R, dxAmt, dyAmt) {
    if ((Math.abs(dxAmt) < 0.3 && Math.abs(dyAmt) < 0.3) || R < 4) return;
    const ctx = canvas.getContext('2d');
    const pad = Math.ceil(Math.max(Math.abs(dxAmt), Math.abs(dyAmt))) + 2;
    const x0 = Math.max(0, Math.floor(cx - R - pad));
    const y0 = Math.max(0, Math.floor(cy - R - pad));
    const x1 = Math.min(canvas.width, Math.ceil(cx + R + pad));
    const y1 = Math.min(canvas.height, Math.ceil(cy + R + pad));
    const bw = x1 - x0, bh = y1 - y0;
    if (bw <= 0 || bh <= 0) return;
    const src = ctx.getImageData(x0, y0, bw, bh);
    const dst = ctx.createImageData(bw, bh);
    const sd = src.data, dd = dst.data;
    const R2 = R * R;
    for (let y = 0; y < bh; y++) {
      const py = y + y0;
      for (let x = 0; x < bw; x++) {
        const px = x + x0;
        const dx = px - cx, dy = py - cy;
        const d2 = dx * dx + dy * dy;
        const o = (y * bw + x) * 4;
        if (d2 >= R2) {
          dd[o] = sd[o]; dd[o + 1] = sd[o + 1]; dd[o + 2] = sd[o + 2]; dd[o + 3] = sd[o + 3];
          continue;
        }
        const r2n = d2 / R2;
        const falloff = (1 - r2n) * (1 - r2n);
        let sx = px - dxAmt * falloff - x0;
        let sy = py - dyAmt * falloff - y0;
        if (sx < 0) sx = 0; else if (sx > bw - 1.001) sx = bw - 1.001;
        if (sy < 0) sy = 0; else if (sy > bh - 1.001) sy = bh - 1.001;
        const ix = Math.floor(sx), iy = Math.floor(sy);
        const fx = sx - ix, fy = sy - iy;
        const o00 = (iy * bw + ix) * 4;
        const o10 = o00 + 4;
        const o01 = o00 + bw * 4;
        const o11 = o01 + 4;
        for (let ch = 0; ch < 4; ch++) {
          dd[o + ch] = sd[o00 + ch] * (1 - fx) * (1 - fy)
                     + sd[o10 + ch] * fx * (1 - fy)
                     + sd[o01 + ch] * (1 - fx) * fy
                     + sd[o11 + ch] * fx * fy;
        }
      }
    }
    ctx.putImageData(dst, x0, y0);
  }

  // ランドマーク（正規化座標）→ピクセル座標
  function lmToPx(lm, w, h) { return { x: lm.x * w, y: lm.y * h }; }

  /* --- 以下の盛り処理はすべて iPad Safari 対応のため ctx.filter を使わず、
         ブレンドモード（globalCompositeOperation）と縮小→拡大ぼかしで実装している --- */

  // ワープ（デカ目・小顔）のみを適用したキャンバスを返す
  function warpShot(srcCanvas, faces, eyeS, faceS) {
    const w = srcCanvas.width, h = srcCanvas.height;
    const work = document.createElement('canvas');
    work.width = w; work.height = h;
    const workCtx = work.getContext('2d', { willReadFrequently: true });
    workCtx.drawImage(srcCanvas, 0, 0);

    if (faces && faces.length && (eyeS > 0 || faceS > 0)) {
      faces.forEach((lm) => {
        if (!lm || lm.length < 478) return; // 虹彩ランドマーク(468-477)が無い場合はスキップ
        if (eyeS > 0) {
          // デカ目：虹彩中心（468/473）を中心に目幅ベースの半径で拡大
          const li = lmToPx(lm[468], w, h);
          const ri = lmToPx(lm[473], w, h);
          const lw = dist(lmToPx(lm[33], w, h), lmToPx(lm[133], w, h));
          const rw = dist(lmToPx(lm[362], w, h), lmToPx(lm[263], w, h));
          radialWarp(work, li.x, li.y, lw * 1.5, eyeS * 0.28);
          radialWarp(work, ri.x, ri.y, rw * 1.5, eyeS * 0.28);
        }
        if (faceS > 0) {
          // 小顔：あご周辺3点を収縮して輪郭を内側へ
          const fw = dist(lmToPx(lm[234], w, h), lmToPx(lm[454], w, h));
          const jl = lmToPx(lm[136], w, h);
          const jr = lmToPx(lm[365], w, h);
          const ch = lmToPx(lm[152], w, h);
          radialWarp(work, jl.x, jl.y, fw * 0.42, -faceS * 0.14);
          radialWarp(work, jr.x, jr.y, fw * 0.42, -faceS * 0.14);
          radialWarp(work, ch.x, ch.y, fw * 0.36, -faceS * 0.10);
          // リフトアップ（タルミ対策）：頬〜フェイスラインを斜め上・内側へ引き上げる
          const cl = lmToPx(lm[205], w, h);
          const cr = lmToPx(lm[425], w, h);
          directionalWarp(work, cl.x, cl.y + fw * 0.12, fw * 0.4, faceS * fw * 0.018, -faceS * fw * 0.04);
          directionalWarp(work, cr.x, cr.y + fw * 0.12, fw * 0.4, -faceS * fw * 0.018, -faceS * fw * 0.04);
        }
      });
    }
    return work;
  }

  // 縮小→拡大でぼかしを作る（ctx.filter='blur()' の Safari 非対応対策）
  let blurTmpA = null, blurTmpB = null;
  function makeBlurred(srcCanvas, radiusPx) {
    const w = srcCanvas.width, h = srcCanvas.height;
    const scale = Math.max(3, Math.min(10, Math.round(radiusPx * 2)));
    if (!blurTmpA) { blurTmpA = document.createElement('canvas'); blurTmpB = document.createElement('canvas'); }
    const sw = Math.max(8, Math.round(w / scale)), sh = Math.max(8, Math.round(h / scale));
    blurTmpA.width = sw; blurTmpA.height = sh;
    const aCtx = blurTmpA.getContext('2d');
    aCtx.imageSmoothingEnabled = true;
    aCtx.clearRect(0, 0, sw, sh);
    aCtx.drawImage(srcCanvas, 0, 0, sw, sh);
    // 2回目の縮小コピーでさらに滑らかに
    const sw2 = Math.max(6, Math.round(sw * 0.6)), sh2 = Math.max(6, Math.round(sh * 0.6));
    blurTmpB.width = sw2; blurTmpB.height = sh2;
    const bCtx = blurTmpB.getContext('2d');
    bCtx.imageSmoothingEnabled = true;
    bCtx.clearRect(0, 0, sw2, sh2);
    bCtx.drawImage(blurTmpA, 0, 0, sw2, sh2);
    return blurTmpB;
  }

  // 色調エフェクトをブレンドモードで適用（Safari対応）
  function applyToneFx(ctx, w, h, fx) {
    ctx.save();
    if (fx.contrast) {
      // 自己オーバーレイでコントラスト/彩度感アップ（ビビッド用）
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = Math.min(1, fx.contrast);
      ctx.drawImage(ctx.canvas, 0, 0);
    }
    if (fx.desat) {
      // グレーを彩度ブレンド→彩度が下がる
      ctx.globalCompositeOperation = 'saturation';
      ctx.globalAlpha = Math.min(1, fx.desat);
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, w, h);
    }
    if (fx.colorize) {
      // 指定色をカラーブレンド（セピア等）
      ctx.globalCompositeOperation = 'color';
      ctx.globalAlpha = Math.min(1, fx.colorize.amt);
      ctx.fillStyle = fx.colorize.color;
      ctx.fillRect(0, 0, w, h);
    }
    if (fx.warm) {
      // ソフトライトで暖色を乗せる（フィルム風）
      ctx.globalCompositeOperation = 'soft-light';
      ctx.globalAlpha = Math.min(1, fx.warm.amt);
      ctx.fillStyle = fx.warm.color;
      ctx.fillRect(0, 0, w, h);
    }
    if (fx.tan) {
      // 乗算で日焼け色に（平成ガングロ用）
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = Math.min(1, fx.tan.amt);
      ctx.fillStyle = fx.tan.color;
      ctx.fillRect(0, 0, w, h);
    }
    if (fx.bright) {
      // 白をスクリーン合成→明るく
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = Math.min(1, fx.bright);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  /* ---------- 肌マスク（肌の領域だけをピンポイントに狙う） ----------
     顔輪郭ポリゴン（ランドマーク）∪ 肌色検出（YCbCr）で肌領域を抽出し、
     目・唇は除外してくっきり残す。マスクの縁はぼかして自然に馴染ませる。 */

  // MediaPipe FaceMesh の顔輪郭（FACE_OVAL）ランドマーク番号
  const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
  const LEFT_EYE_RING = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
  const RIGHT_EYE_RING = [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466];
  const LIPS_OUTER = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185];
  // 眉毛（上端→下端のループ）: 美肌でボケないように除外する
  const LEFT_BROW = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46];
  const RIGHT_BROW = [300, 293, 334, 296, 336, 285, 295, 282, 283, 276];
  // 肌色サンプリング位置（頬・額・鼻・あご）
  const SKIN_SAMPLE_POINTS = [50, 280, 10, 151, 4, 152, 205, 425];

  function rgbToYCbCr(r, g, b) {
    return {
      y: 0.299 * r + 0.587 * g + 0.114 * b,
      cb: 128 - 0.168736 * r - 0.331264 * g + 0.5 * b,
      cr: 128 + 0.5 * r - 0.418688 * g - 0.081312 * b,
    };
  }

  function drawLandmarkPolygon(ctx, lm, indices, w, h, expandCx, expandCy, expandScale) {
    ctx.beginPath();
    indices.forEach((idx, i) => {
      let x = lm[idx].x * w, y = lm[idx].y * h;
      if (expandScale && expandScale !== 1) {
        x = expandCx + (x - expandCx) * expandScale;
        y = expandCy + (y - expandCy) * expandScale;
      }
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  }

  let maskFeatherA = null, maskFeatherB = null;
  function featherMask(maskCanvas) {
    const w = maskCanvas.width, h = maskCanvas.height;
    if (!maskFeatherA) { maskFeatherA = document.createElement('canvas'); maskFeatherB = document.createElement('canvas'); }
    const sw = Math.max(16, Math.round(w / 8)), sh = Math.max(16, Math.round(h / 8));
    maskFeatherA.width = sw; maskFeatherA.height = sh;
    const aCtx = maskFeatherA.getContext('2d');
    aCtx.imageSmoothingEnabled = true;
    aCtx.clearRect(0, 0, sw, sh);
    aCtx.drawImage(maskCanvas, 0, 0, sw, sh);
    maskFeatherB.width = w; maskFeatherB.height = h;
    const bCtx = maskFeatherB.getContext('2d');
    bCtx.imageSmoothingEnabled = true;
    bCtx.clearRect(0, 0, w, h);
    bCtx.drawImage(maskFeatherA, 0, 0, w, h);
    const mCtx = maskCanvas.getContext('2d');
    mCtx.clearRect(0, 0, w, h);
    mCtx.drawImage(maskFeatherB, 0, 0);
    return maskCanvas;
  }

  // 目・眉・唇の除外穴をマスクへ開ける（くっきり残すべきパーツ）
  function cutFaceHoles(mCtx, faces, w, h, eyeS) {
    if (!faces || !faces.length) return;
    mCtx.save();
    mCtx.globalCompositeOperation = 'destination-out';
    mCtx.fillStyle = '#ffffff';
    mCtx.strokeStyle = '#ffffff';
    mCtx.lineJoin = 'round';
    const holeScale = 1.15 + (eyeS || 0) * 0.35;
    faces.forEach((lm) => {
      if (!lm || lm.length < 468) return;
      const fw = dist(lmToPx(lm[234], w, h), lmToPx(lm[454], w, h));
      // 目（デカ目ワープぶん穴を拡大）
      const le = lmToPx(lm[468] || lm[159], w, h);
      const re = lmToPx(lm[473] || lm[386], w, h);
      drawLandmarkPolygon(mCtx, lm, LEFT_EYE_RING, w, h, le.x, le.y, holeScale);
      drawLandmarkPolygon(mCtx, lm, RIGHT_EYE_RING, w, h, re.x, re.y, holeScale);
      // 眉（ポリゴン+太いストロークで確実にカバー）
      mCtx.lineWidth = Math.max(3, fw * 0.035);
      [LEFT_BROW, RIGHT_BROW].forEach((ring) => {
        drawLandmarkPolygon(mCtx, lm, ring, w, h);
        mCtx.beginPath();
        ring.forEach((idx, i) => {
          const p = lmToPx(lm[idx], w, h);
          if (i === 0) mCtx.moveTo(p.x, p.y); else mCtx.lineTo(p.x, p.y);
        });
        mCtx.closePath();
        mCtx.stroke();
      });
      // 唇
      const mc = lmToPx(lm[13], w, h);
      drawLandmarkPolygon(mCtx, lm, LIPS_OUTER, w, h, mc.x, mc.y, 1.1);
    });
    mCtx.restore();
  }

  // 肌マスクを生成（白=肌）。
  // mlConf（多クラスMLセグメンテーションの肌信頼度）があればそれを最優先で使い、
  // 無い場合のみ 色検出+顔輪郭ポリゴン にフォールバックする。
  function buildSkinMask(srcCanvas, faces, eyeS, mlConf) {
    const w = srcCanvas.width, h = srcCanvas.height;
    const mask = document.createElement('canvas');
    mask.width = w; mask.height = h;
    const mCtx = mask.getContext('2d', { willReadFrequently: true });

    if (mlConf) {
      /* --- MLパス: selfie_multiclass の「顔の肌+体の肌」信頼度をそのまま使う ---
         髪・服・背景は分類レベルで除外済み。眉・目・唇だけ穴を開ければ完成。 */
      mCtx.drawImage(mlConf, 0, 0, w, h);
      cutFaceHoles(mCtx, faces, w, h, eyeS);
      return featherMask(mask);
    }

    /* --- フォールバック: 色検出 + 顔輪郭ポリゴン --- */
    const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true });
    let imgData = null;
    try {
      imgData = srcCtx.getImageData(0, 0, w, h);
    } catch (err) { /* 読めない場合は色検出をスキップ */ }

    // 1) 肌色のリファレンスを顔から採取（顔がなければ標準的な肌色域を使用）
    let cb0 = 105, cr0 = 152; // 一般的な肌のCbCr
    if (imgData && faces && faces.length) {
      let sumCb = 0, sumCr = 0, cnt = 0;
      faces.forEach((lm) => {
        if (!lm) return;
        SKIN_SAMPLE_POINTS.forEach((pi) => {
          const px = Math.round(lm[pi].x * w), py = Math.round(lm[pi].y * h);
          if (px < 0 || py < 0 || px >= w || py >= h) return;
          const o = (py * w + px) * 4;
          const c = rgbToYCbCr(imgData.data[o], imgData.data[o + 1], imgData.data[o + 2]);
          sumCb += c.cb; sumCr += c.cr; cnt++;
        });
      });
      if (cnt > 0) { cb0 = sumCb / cnt; cr0 = sumCr / cnt; }
    }

    // 2) 肌色に近いピクセルをマスク化（首・腕なども拾う）
    if (imgData) {
      const md = mCtx.createImageData(w, h);
      const d = imgData.data, m = md.data;
      const sigma2 = 2 * 13 * 13;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        if (d[i + 3] < 200) continue;      // 透明（くり抜き部分）は除外
        const yy = 0.299 * r + 0.587 * g + 0.114 * b;
        if (yy < 45 || yy > 250) continue; // 極端に暗い/白飛びは除外
        const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
        const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
        const dist2 = (cb - cb0) * (cb - cb0) + (cr - cr0) * (cr - cr0);
        const wgt = Math.exp(-dist2 / sigma2);
        if (wgt > 0.15) {
          const o = i;
          m[o] = 255; m[o + 1] = 255; m[o + 2] = 255;
          m[o + 3] = Math.round(Math.min(1, wgt * 1.4) * 255);
        }
      }
      mCtx.putImageData(md, 0, 0);
    }

    // 3) 顔の輪郭ポリゴンは確実に塗る（メイクや影で色検出から漏れても顔全体をカバー）
    if (faces && faces.length) {
      mCtx.fillStyle = '#ffffff';
      faces.forEach((lm) => {
        if (!lm || lm.length < 468) return;
        drawLandmarkPolygon(mCtx, lm, FACE_OVAL, w, h);
      });
      // 4) 目・眉・唇はくっきり残すため除外
      cutFaceHoles(mCtx, faces, w, h, eyeS);
    }

    // 5) 縁をぼかして自然に馴染ませる
    return featherMask(mask);
  }

  // 肌マスクのキャッシュ（ショットと顔データが同じ間は再計算しない）
  const skinMaskCache = new Map(); // idx -> { facesRef, eyeKey, canvas }
  function getSkinMask(idx, srcCanvas, faces, eyeS) {
    const eyeKey = Math.round((eyeS || 0) * 10);
    const hit = skinMaskCache.get(idx);
    if (hit && hit.facesRef === faces && hit.eyeKey === eyeKey) return hit.canvas;
    const mlConf = (idx >= 0 && state.skinConf && state.skinConf[idx]) || null;
    const canvas = buildSkinMask(srcCanvas, faces, eyeS, mlConf);
    skinMaskCache.set(idx, { facesRef: faces, eyeKey, canvas });
    return canvas;
  }

  // マスク内が実質空（肌が検出できなかった）かどうか
  function maskIsEmpty(mask) {
    const ctx = mask.getContext('2d', { willReadFrequently: true });
    const step = 16;
    const d = ctx.getImageData(0, 0, mask.width, mask.height).data;
    let hits = 0;
    for (let i = 3; i < d.length; i += 4 * step) {
      if (d[i] > 60) hits++;
    }
    return hits < 20;
  }

  /* ---------- ヒーリングエンジン（シミ・シワ・ほうれい線・クマ・日焼けムラ除去） ----------
     プロのレタッチで使われる周波数分離の考え方を応用：
     - 肌領域内で「周囲の平均より暗いピクセル」＝シミ・シワ・ほうれい線・クマの影 だけを周囲の肌色へ引き上げる
     - 明るさ（Y）はそのままに色味（CbCr）だけを周囲へ均す → 赤み・日焼けムラを解消しつつ立体感は残す
     - ハイライトはほぼ触らないので、のっぺりしない */

  // 分離型移動平均によるボックスブラー（1チャンネル、O(n)）
  function boxBlurChannel(src, dst, tmp, w, h, radius) {
    const win = radius * 2 + 1;
    // 横方向
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let acc = 0;
      for (let x = -radius; x <= radius; x++) {
        acc += src[row + Math.min(w - 1, Math.max(0, x))];
      }
      for (let x = 0; x < w; x++) {
        tmp[row + x] = acc / win;
        const xAdd = Math.min(w - 1, x + radius + 1);
        const xSub = Math.max(0, x - radius);
        acc += src[row + xAdd] - src[row + xSub];
      }
    }
    // 縦方向
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -radius; y <= radius; y++) {
        acc += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
      }
      for (let y = 0; y < h; y++) {
        dst[y * w + x] = acc / win;
        const yAdd = Math.min(h - 1, y + radius + 1);
        const ySub = Math.max(0, y - radius);
        acc += tmp[yAdd * w + x] - tmp[ySub * w + x];
      }
    }
  }

  // 2スケール・ヒーリング（常にフル強度で適用し、効き具合は後段の合成率で調整する）
  //  - 小半径(6px): シミ・毛穴・細かいシワ
  //  - 大半径(18px): ほうれい線・クマ・大きな影
  function healSkinFull(canvas, mask) {
    const w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const maskCtx = mask.getContext('2d', { willReadFrequently: true });
    const md = maskCtx.getImageData(0, 0, w, h).data;

    const n = w * h;
    const chR = new Float32Array(n), chG = new Float32Array(n), chB = new Float32Array(n);
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      chR[i] = d[p]; chG[i] = d[p + 1]; chB[i] = d[p + 2];
    }
    const tmp = new Float32Array(n);
    const m1R = new Float32Array(n), m1G = new Float32Array(n), m1B = new Float32Array(n);
    const m2R = new Float32Array(n), m2G = new Float32Array(n), m2B = new Float32Array(n);
    boxBlurChannel(chR, m1R, tmp, w, h, 6);
    boxBlurChannel(chG, m1G, tmp, w, h, 6);
    boxBlurChannel(chB, m1B, tmp, w, h, 6);
    boxBlurChannel(chR, m2R, tmp, w, h, 18);
    boxBlurChannel(chG, m2G, tmp, w, h, 18);
    boxBlurChannel(chB, m2B, tmp, w, h, 18);

    for (let i = 0, p = 0; i < n; i++, p += 4) {
      const a = md[p + 3] / 255;
      if (a < 0.04) continue;
      let nr = d[p], ng = d[p + 1], nb = d[p + 2];

      // パス1: 小スケールの暗部（シミ・毛穴）を周囲へ引き上げ
      {
        const mr = m1R[i], mg = m1G[i], mb = m1B[i];
        const diff = (0.299 * nr + 0.587 * ng + 0.114 * nb) - (0.299 * mr + 0.587 * mg + 0.114 * mb);
        if (diff < -1.5) {
          const t = Math.min(1, (-diff) / 24) * 0.95 * a;
          nr += (mr - nr) * t; ng += (mg - ng) * t; nb += (mb - nb) * t;
        }
      }
      // パス2: 大スケールの暗部（ほうれい線・クマ・たるみ影）を引き上げ
      {
        const mr = m2R[i], mg = m2G[i], mb = m2B[i];
        const diff = (0.299 * nr + 0.587 * ng + 0.114 * nb) - (0.299 * mr + 0.587 * mg + 0.114 * mb);
        if (diff < -2) {
          const t = Math.min(1, (-diff) / 45) * 0.8 * a;
          nr += (mr - nr) * t; ng += (mg - ng) * t; nb += (mb - nb) * t;
        } else if (diff > 0) {
          // 明部はごくわずかに整えるだけ（立体感を維持）
          const t = Math.min(1, diff / 80) * 0.10 * a;
          nr += (mr - nr) * t; ng += (mg - ng) * t; nb += (mb - nb) * t;
        }
        // 色ムラ補正: 明るさは保ち、色味だけ広域平均へ寄せる（赤み・日焼けムラ）
        const ca = 0.5 * a;
        const yP = 0.299 * nr + 0.587 * ng + 0.114 * nb;
        const cbP = 128 - 0.168736 * nr - 0.331264 * ng + 0.5 * nb;
        const crP = 128 + 0.5 * nr - 0.418688 * ng - 0.081312 * nb;
        const cbM = 128 - 0.168736 * mr - 0.331264 * mg + 0.5 * mb;
        const crM = 128 + 0.5 * mr - 0.418688 * mg - 0.081312 * mb;
        const cb = cbP + (cbM - cbP) * ca;
        const cr = crP + (crM - crP) * ca;
        nr = yP + 1.402 * (cr - 128);
        ng = yP - 0.344136 * (cb - 128) - 0.714136 * (cr - 128);
        nb = yP + 1.772 * (cb - 128);
      }
      d[p] = nr < 0 ? 0 : nr > 255 ? 255 : nr;
      d[p + 1] = ng < 0 ? 0 : ng > 255 ? 255 : ng;
      d[p + 2] = nb < 0 ? 0 : nb > 255 ? 255 : nb;
    }
    ctx.putImageData(img, 0, 0);
  }

  /* ---------- ガイデッドフィルタ（エッジ保存平滑化） ----------
     実際の美顔アプリで使われる手法。輝度をガイドにして
     「エッジ（輪郭・髪の生え際・メガネ等）は保ったまま、平坦な肌のムラだけを均す」。
     ぼかしと違い、輪郭が滲まないのが最大の違い。 */
  function guidedSmooth(canvas, mask) {
    const w = canvas.width, h = canvas.height;
    const n = w * h;
    const r = 9;        // 平滑化の半径
    const eps = 110;    // エッジ判定のしきい値（輝度分散）。小さいほどエッジを残す
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const maskCtx = mask.getContext('2d', { willReadFrequently: true });
    const md = maskCtx.getImageData(0, 0, w, h).data;

    const I = new Float32Array(n);
    const P = [new Float32Array(n), new Float32Array(n), new Float32Array(n)];
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      P[0][i] = d[p]; P[1][i] = d[p + 1]; P[2][i] = d[p + 2];
      I[i] = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
    }
    const tmp = new Float32Array(n);
    const meanI = new Float32Array(n);
    const meanII = new Float32Array(n);
    boxBlurChannel(I, meanI, tmp, w, h, r);
    const II = new Float32Array(n);
    for (let i = 0; i < n; i++) II[i] = I[i] * I[i];
    boxBlurChannel(II, meanII, tmp, w, h, r);

    const A = [new Float32Array(n), new Float32Array(n), new Float32Array(n)];
    const B = [new Float32Array(n), new Float32Array(n), new Float32Array(n)];
    const work1 = new Float32Array(n), work2 = new Float32Array(n);
    for (let c = 0; c < 3; c++) {
      const Pc = P[c];
      boxBlurChannel(Pc, work1, tmp, w, h, r);            // meanP
      for (let i = 0; i < n; i++) work2[i] = I[i] * Pc[i];
      boxBlurChannel(work2, A[c], tmp, w, h, r);          // meanIP（一時的にAへ）
      for (let i = 0; i < n; i++) {
        const varI = meanII[i] - meanI[i] * meanI[i];
        const covIP = A[c][i] - meanI[i] * work1[i];
        const a = covIP / (varI + eps);
        A[c][i] = a;
        B[c][i] = work1[i] - a * meanI[i];
      }
      boxBlurChannel(A[c], work2, tmp, w, h, r);
      A[c].set(work2);
      boxBlurChannel(B[c], work2, tmp, w, h, r);
      B[c].set(work2);
    }

    // 微細テクスチャの再注入（周波数分離のプロ仕上げ）:
    // ヒーリング済み画像の細かいキメ（半径2pxの高周波成分）を平滑化後に35%戻す。
    // → ツルツルのプラスチック肌ではなく「キメの整った素肌」に見える
    const fineR = new Float32Array(n);
    boxBlurChannel(P[0], fineR, tmp, w, h, 2);
    const fineG = new Float32Array(n);
    boxBlurChannel(P[1], fineG, tmp, w, h, 2);
    const fineB = new Float32Array(n);
    boxBlurChannel(P[2], fineB, tmp, w, h, 2);
    const TEXTURE = 0.35;

    for (let i = 0, p = 0; i < n; i++, p += 4) {
      const a = md[p + 3] / 255;
      if (a < 0.04) continue;
      const detR = (P[0][i] - fineR[i]) * TEXTURE;
      const detG = (P[1][i] - fineG[i]) * TEXTURE;
      const detB = (P[2][i] - fineB[i]) * TEXTURE;
      for (let c = 0; c < 3; c++) {
        const det = c === 0 ? detR : c === 1 ? detG : detB;
        const q = A[c][i] * I[i] + B[c][i] + det;
        const v = d[p + c] + (q - d[p + c]) * a;
        d[p + c] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  // ヒーリング+平滑化をフル強度で適用した「美肌ベース」と、
  // 透明感用の「グロー層」（明るくぼかした肌、スクリーン合成用）を作る。
  // 重い処理はここに集約して1ショット1回だけ。スライダーは合成率の変更のみ。
  function buildBeautyBase(warped, mask) {
    const w = warped.width, h = warped.height;
    const base = document.createElement('canvas');
    base.width = w; base.height = h;
    base.getContext('2d').drawImage(warped, 0, 0);
    healSkinFull(base, mask);
    guidedSmooth(base, mask);

    // 透明感グロー層: ベースをぼかして少し明るくし、肌マスクで切り抜いたもの
    const glow = document.createElement('canvas');
    glow.width = w; glow.height = h;
    const gctx = glow.getContext('2d');
    const blurred = makeBlurred(base, 5);
    gctx.imageSmoothingEnabled = true;
    gctx.drawImage(blurred, 0, 0, w, h);
    applyToneFx(gctx, w, h, { bright: 0.18 });
    gctx.globalCompositeOperation = 'destination-in';
    gctx.drawImage(mask, 0, 0);
    gctx.globalCompositeOperation = 'source-over';

    return { base, glow };
  }

  let skinLayerCanvas = null, skinLayerCtx = null;
  /* 非分離ブレンドモード 'color'（上の色相・彩度 ＋ 下の輝度）が使えるか。
     使えない実装では代入しても 'source-over' のまま戻るので、それで判定する。
     ctx.filter で一度火傷している（2026-07-06）ので、使う前に必ず確認する。 */
  let colorBlendOK = null;
  function canUseColorBlend() {
    if (colorBlendOK === null) {
      try {
        const t = document.createElement('canvas').getContext('2d');
        t.globalCompositeOperation = 'color';
        colorBlendOK = t.globalCompositeOperation === 'color';
      } catch (e) { colorBlendOK = false; }
    }
    return colorBlendOK;
  }

  function getSkinLayer(w, h) {
    if (!skinLayerCanvas) {
      skinLayerCanvas = document.createElement('canvas');
      skinLayerCtx = skinLayerCanvas.getContext('2d');
    }
    if (skinLayerCanvas.width !== w || skinLayerCanvas.height !== h) {
      skinLayerCanvas.width = w; skinLayerCanvas.height = h;
    }
    return skinLayerCtx;
  }

  // 1枚のショットに 盛り（ワープ＋美肌＋フィルター）を適用して新しいキャンバスを返す
  // preBase: buildBeautyBase() 済みのキャンバス（あれば重い処理をスキップして合成だけ行う）
  function applyBeauty(srcCanvas, faces, params, preWarped, shotIdx, preBase) {
    const conf = modeConf();
    const w = srcCanvas.width, h = srcCanvas.height;
    const eyeS = params.eye / 100;
    const work = preWarped || warpShot(srcCanvas, faces, eyeS, params.face / 100);

    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const outCtx = out.getContext('2d');
    outCtx.drawImage(work, 0, 0);

    const skinS = params.skin / 100;
    const whiteS = (params.white || 0) / 100;
    const clearS = (params.clear || 0) / 100;
    if (skinS > 0 || whiteS > 0 || clearS > 0) {
      const tone = conf.skinTone;
      const mask = getSkinMask(shotIdx == null ? -1 : shotIdx, srcCanvas, faces, eyeS);
      const useMask = mask && !maskIsEmpty(mask);

      if (useMask) {
        /* --- 肌ピンポイント処理 v4 ---
           美肌: 肌質の改善（2スケールヒーリング+ガイデッドフィルタ+キメ再注入）
           美白: 白さ（白スクリーン＋彩度調整）
           透明感: グロー（明るいぼかし肌のスクリーン合成）+ 淡ブルーで黄ぐすみを除去
           — それぞれ独立制御 */
        const baseObj = (skinS > 0 || clearS > 0) ? (preBase || buildBeautyBase(work, mask)) : null;
        if (skinS > 0 && baseObj) {
          outCtx.globalAlpha = Math.min(1, skinS * 1.1);
          outCtx.drawImage(baseObj.base, 0, 0);
          outCtx.globalAlpha = 1;
        }

        if (clearS > 0 && baseObj) {
          /* --- 色ムラの平滑化（2026-07-27 追加・透明感の主役） ---
             肌が「不透明」に見える一番の原因は暗さではなく、赤み・黄ぐすみの斑（まだら）。
             ここでは輝度をいっさい触らずに、色だけをぼかして斑をならす。
             globalCompositeOperation='color' は「上の色相・彩度 ＋ 下の輝度」で合成するので、
             ぼかした肌をこれで重ねると、毛穴やキメ（＝輝度の情報）を残したまま色ムラだけが消える。
             美肌＝輝度をならす／美白＝輝度を上げる／透明感＝色をならす、と軸を分けるための処理。
             ※ この処理を入れる前の clear は「ぼかした肌を明るくして screen 合成」だけで、
                向きとしては美肌＋美白と同じ輝度方向に寄っていた（＝美肌の弱い版）。 */
          if (conf.clearColorSmooth && canUseColorBlend()) {
            const cCtx = getSkinLayer(w, h);
            cCtx.globalCompositeOperation = 'source-over';
            cCtx.clearRect(0, 0, w, h);
            cCtx.imageSmoothingEnabled = true;
            // makeBlurred は共有の作業用キャンバスを返すので、受け取ったら即座に描く
            cCtx.drawImage(makeBlurred(baseObj.base, 7), 0, 0, w, h);
            cCtx.globalCompositeOperation = 'destination-in';
            cCtx.drawImage(mask, 0, 0);
            cCtx.globalCompositeOperation = 'source-over';
            outCtx.globalCompositeOperation = 'color';
            outCtx.globalAlpha = Math.min(1, clearS * 0.85);
            outCtx.drawImage(skinLayerCanvas, 0, 0);
            outCtx.globalCompositeOperation = 'source-over';
            outCtx.globalAlpha = 1;
          }

          /* グロー: 明るいぼかし肌をスクリーン合成 → 内側から光る透明感。
             色の平滑化を入れた分、輝度方向へ寄せすぎないよう 0.42 → 0.22 に落とす
             （0.42 のままだと美白と見分けがつかず、透明感スライダーの役割が重複するため）。 */
          outCtx.globalCompositeOperation = 'screen';
          outCtx.globalAlpha = clearS * (conf.clearColorSmooth ? 0.22 : 0.42);
          outCtx.drawImage(baseObj.glow, 0, 0);
          // 黄ぐすみ除去: 淡ブルーをソフトライトで（肌マスク越し）
          const layerCtx = getSkinLayer(w, h);
          layerCtx.globalCompositeOperation = 'source-over';
          layerCtx.clearRect(0, 0, w, h);
          layerCtx.fillStyle = '#dbe7ff';
          layerCtx.fillRect(0, 0, w, h);
          layerCtx.globalCompositeOperation = 'destination-in';
          layerCtx.drawImage(mask, 0, 0);
          layerCtx.globalCompositeOperation = 'source-over';
          outCtx.globalCompositeOperation = 'soft-light';
          outCtx.globalAlpha = clearS * 0.35;
          outCtx.drawImage(skinLayerCanvas, 0, 0);
          outCtx.globalCompositeOperation = 'source-over';
          outCtx.globalAlpha = 1;
        }

        if (whiteS > 0) {
          const layerCtx = getSkinLayer(w, h);
          // 美白: 白をマスク越しにスクリーン合成（肌だけ白く）
          layerCtx.globalCompositeOperation = 'source-over';
          layerCtx.clearRect(0, 0, w, h);
          layerCtx.fillStyle = '#ffffff';
          layerCtx.fillRect(0, 0, w, h);
          layerCtx.globalCompositeOperation = 'destination-in';
          layerCtx.drawImage(mask, 0, 0);
          layerCtx.globalCompositeOperation = 'source-over';
          outCtx.globalCompositeOperation = 'screen';
          outCtx.globalAlpha = Math.min(1, whiteS * tone.brightPerUnit * 2.4);
          outCtx.drawImage(skinLayerCanvas, 0, 0);
          outCtx.globalCompositeOperation = 'source-over';
          outCtx.globalAlpha = 1;

          // 彩度落とし（平成の白肌）: グレーをマスク越しに彩度合成
          if (tone.desatPerUnit > 0) {
            layerCtx.clearRect(0, 0, w, h);
            layerCtx.fillStyle = '#808080';
            layerCtx.fillRect(0, 0, w, h);
            layerCtx.globalCompositeOperation = 'destination-in';
            layerCtx.drawImage(mask, 0, 0);
            layerCtx.globalCompositeOperation = 'source-over';
            outCtx.globalCompositeOperation = 'saturation';
            outCtx.globalAlpha = Math.min(1, whiteS * tone.desatPerUnit * 1.8);
            outCtx.drawImage(skinLayerCanvas, 0, 0);
            outCtx.globalCompositeOperation = 'source-over';
            outCtx.globalAlpha = 1;
          }
        }
      } else {
        // フォールバック（顔も肌色も見つからない場合）: 従来の全体ソフトフォーカス
        if (skinS > 0) {
          const blurred = makeBlurred(work, 1.5 + skinS * 2.5);
          outCtx.save();
          outCtx.globalAlpha = skinS * 0.5;
          outCtx.imageSmoothingEnabled = true;
          outCtx.drawImage(blurred, 0, 0, w, h);
          outCtx.restore();
        }
        applyToneFx(outCtx, w, h, {
          bright: whiteS * tone.brightPerUnit,
          desat: whiteS * tone.desatPerUnit,
        });
      }
    }

    // チーク＆リップ（顔ランドマークベースのメイク）
    drawMakeup(outCtx, faces, w, h, (params.cheek || 0) / 100, (params.lip || 0) / 100, conf);

    // 選択フィルター
    const selFilter = conf.filters.find(f => f.id === params.filter);
    if (selFilter && selFilter.fx && Object.keys(selFilter.fx).length) {
      applyToneFx(outCtx, w, h, selFilter.fx);
    }
    return out;
  }

  // チーク＆リップの描画（本加工とライブ盛れプレビューの共通処理・2026-07-31切り出し）
  function drawMakeup(outCtx, faces, w, h, cheekS, lipS, conf) {
    if (faces && faces.length && (cheekS > 0 || lipS > 0)) {
      faces.forEach((lm) => {
        if (!lm || lm.length < 468) return;
        const fw = dist(lmToPx(lm[234], w, h), lmToPx(lm[454], w, h));
        if (cheekS > 0) {
          // 頬の中心（205/425）にふんわり円形グラデーション
          [lm[205], lm[425]].forEach((pt) => {
            const c = lmToPx(pt, w, h);
            const r = fw * 0.17;
            const grad = outCtx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
            grad.addColorStop(0, conf.makeup.cheek);
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            outCtx.save();
            outCtx.globalAlpha = cheekS * 0.32;
            outCtx.fillStyle = grad;
            outCtx.beginPath();
            outCtx.arc(c.x, c.y, r, 0, Math.PI * 2);
            outCtx.fill();
            outCtx.restore();
          });
        }
        if (lipS > 0) {
          // 唇の外周ポリゴンに「color」ブレンドで色味だけ乗せる（質感・明るさは維持）
          outCtx.save();
          outCtx.globalCompositeOperation = 'color';
          outCtx.globalAlpha = Math.min(1, lipS * 0.7);
          outCtx.fillStyle = conf.makeup.lip;
          drawLandmarkPolygon(outCtx, lm, LIPS_OUTER, w, h);
          outCtx.restore();
          // わずかに彩度と血色を足す（ソフトライト）
          outCtx.save();
          outCtx.globalCompositeOperation = 'soft-light';
          outCtx.globalAlpha = Math.min(1, lipS * 0.5);
          outCtx.fillStyle = conf.makeup.lip;
          drawLandmarkPolygon(outCtx, lm, LIPS_OUTER, w, h);
          outCtx.restore();
          outCtx.globalCompositeOperation = 'source-over';
          outCtx.globalAlpha = 1;
        }
      });
    }
  }

  /* ===================== 2.5 盛り調整画面 ===================== */
  const beautyCanvas = $('#beauty-canvas');
  beautyCanvas.width = SHOT_W;
  beautyCanvas.height = SHOT_H;
  const beautyCtx = beautyCanvas.getContext('2d');
  const beautyTimerDisplay = $('#beauty-timer-display');
  const beautyFaceNote = $('#beauty-face-note');

  const sliderSkin = $('#slider-skin');
  const sliderWhite = $('#slider-white');
  const sliderClear = $('#slider-clear');
  const sliderEye = $('#slider-eye');
  const sliderFace = $('#slider-face');
  const sliderCheek = $('#slider-cheek');
  const sliderLip = $('#slider-lip');

  /* ---------- 1枚ごとの盛り設定（2026-08-12 新設） ----------
     現行実機FLASHの「1枚の設定を全枚数にワンタッチ反映」を成立させるため、
     盛りパラメータをショットごとに持つ。盛り画面に入った時点で state.beauty（撮影時の
     ライブ盛れ設定）を4枚分に複製し、以降のUI操作は「いま選択中の1枚」にだけ効く。
     _preset / _level はUI表示用のメモで、盛り処理そのものには影響しない。 */
  function curBeauty() {
    return (state.beautyShots && state.beautyShots[state.beautySelected]) || state.beauty;
  }

  /* 盛れ感レベル（現行実機Misélの80%/100%/120%三段階の型・2026-08-12）。
     選択中プリセットの値に倍率をかける。 */
  const MORIAGE_LEVELS = [
    { id: 'l80',  label: 'ナチュラル 80%',   f: 0.8 },
    { id: 'l100', label: 'スタンダード 100%', f: 1.0 },
    { id: 'l120', label: 'しっかり 120%',    f: 1.2 },
  ];

  let beautyRenderQueued = false;

  function queueBeautyRender() {
    if (beautyRenderQueued) return;
    beautyRenderQueued = true;
    requestAnimationFrame(() => {
      beautyRenderQueued = false;
      renderBeautyPreview();
    });
  }

  // ワープ結果と美肌ベースをキャッシュ
  // （デカ目/小顔変更時のみワープ+ベースを再計算。美肌・チーク・リップ・フィルターは合成だけなので即応答）
  const warpCache = { idx: -1, eye: -1, face: -1, facesRef: null, skinConfRef: null, canvas: null, base: null };

  function renderBeautyPreview() {
    const idx = state.beautySelected;
    const src = state.shots[idx];
    if (!src) return;
    const p = curBeauty();
    const faces = state.faceData[idx];
    const skinConfRef = state.skinConf[idx] || null;
    if (warpCache.idx !== idx || warpCache.eye !== p.eye || warpCache.face !== p.face
        || warpCache.facesRef !== faces || warpCache.skinConfRef !== skinConfRef) {
      warpCache.canvas = warpShot(src, faces, p.eye / 100, p.face / 100);
      const mask = getSkinMask(idx, src, faces, p.eye / 100);
      warpCache.base = (mask && !maskIsEmpty(mask)) ? buildBeautyBase(warpCache.canvas, mask) : null;
      warpCache.idx = idx;
      warpCache.eye = p.eye;
      warpCache.face = p.face;
      warpCache.facesRef = faces;
      warpCache.skinConfRef = skinConfRef;
    }
    const result = applyBeauty(src, faces, p, warpCache.canvas, idx, warpCache.base);
    beautyCtx.clearRect(0, 0, SHOT_W, SHOT_H);
    beautyCtx.drawImage(result, 0, 0);
  }

  function syncSliders() {
    const p = curBeauty();
    sliderSkin.value = p.skin;
    sliderWhite.value = p.white || 0;
    sliderClear.value = p.clear || 0;
    sliderEye.value = p.eye;
    sliderFace.value = p.face;
    sliderCheek.value = p.cheek || 0;
    sliderLip.value = p.lip || 0;
    $('#val-skin').textContent = p.skin;
    $('#val-white').textContent = p.white || 0;
    $('#val-clear').textContent = p.clear || 0;
    $('#val-eye').textContent = p.eye;
    $('#val-face').textContent = p.face;
    $('#val-cheek').textContent = p.cheek || 0;
    $('#val-lip').textContent = p.lip || 0;
  }

  function markPresetActive(presetId) {
    document.querySelectorAll('#beauty-preset-row .preset-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.preset === presetId);
    });
  }

  function markLevelActive(levelId) {
    document.querySelectorAll('#beauty-level-row .preset-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.level === levelId);
    });
  }

  function markFilterActive(filterId) {
    document.querySelectorAll('#filter-row .preset-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === filterId);
    });
  }

  // ショット切り替え・一括反映のあとに、選択中の1枚の設定をUI全体へ反映する
  function syncBeautyUIFromCur() {
    const p = curBeauty();
    syncSliders();
    markPresetActive(p._preset || '');
    markLevelActive(p._level || '');
    markFilterActive(p.filter);
  }

  // プリセット値（＋盛れ感レベル倍率）を選択中の1枚に書き込む
  function applyPresetToCur(preset, factor) {
    const p = curBeauty();
    const f = factor || 1;
    const clamp = (v) => Math.max(0, Math.min(100, Math.round(v * f)));
    p.skin = clamp(preset.skin);
    p.white = clamp(preset.white);
    p.clear = clamp(preset.clear);
    p.eye = clamp(preset.eye);
    p.face = clamp(preset.face);
    p.cheek = clamp(preset.cheek);
    p.lip = clamp(preset.lip);
  }

  function buildBeautyControls() {
    const conf = modeConf();
    // 盛れ感プリセット
    const presetRow = $('#beauty-preset-row');
    presetRow.innerHTML = '';
    conf.presets.forEach(p => {
      const b = document.createElement('button');
      b.className = 'preset-btn' + (p.id === conf.defaultPreset ? ' active' : '');
      b.dataset.preset = p.id;
      b.textContent = p.label;
      b.addEventListener('click', () => {
        const cur = curBeauty();
        cur._preset = p.id;
        cur._level = 'l100';
        applyPresetToCur(p, 1);
        syncBeautyUIFromCur();
        queueBeautyRender();
      });
      presetRow.appendChild(b);
    });
    // 盛れ感レベル（Misél式 80/100/120%。選択中プリセットに倍率をかける）
    const levelRow = $('#beauty-level-row');
    levelRow.innerHTML = '';
    MORIAGE_LEVELS.forEach(lv => {
      const b = document.createElement('button');
      b.className = 'preset-btn' + (lv.id === 'l100' ? ' active' : '');
      b.dataset.level = lv.id;
      b.textContent = lv.label;
      b.addEventListener('click', () => {
        const cur = curBeauty();
        const basePreset = conf.presets.find(x => x.id === (cur._preset || conf.defaultPreset)) || conf.presets[0];
        cur._preset = basePreset.id;
        cur._level = lv.id;
        applyPresetToCur(basePreset, lv.f);
        playSoundOr('moriageSelect', 'seDecide');
        syncBeautyUIFromCur();
        queueBeautyRender();
      });
      levelRow.appendChild(b);
    });
    // フィルター
    const filterRow = $('#filter-row');
    filterRow.innerHTML = '';
    conf.filters.forEach(f => {
      const b = document.createElement('button');
      b.className = 'preset-btn' + (f.id === curBeauty().filter ? ' active' : '');
      b.dataset.filter = f.id;
      b.textContent = f.label;
      b.addEventListener('click', () => {
        curBeauty().filter = f.id;
        markFilterActive(f.id);
        queueBeautyRender();
      });
      filterRow.appendChild(b);
    });
    // ショット切り替えタブ（1枚ごとに設定を持つので、切り替え時はその1枚の設定をUIへ）
    const tabs = $('#beauty-shot-tabs');
    tabs.innerHTML = '';
    for (let i = 0; i < NUM_SHOTS; i++) {
      const b = document.createElement('button');
      b.className = 'beauty-shot-tab' + (i === 0 ? ' active' : '');
      b.textContent = String(i + 1);
      b.addEventListener('click', () => {
        state.beautySelected = i;
        tabs.querySelectorAll('.beauty-shot-tab').forEach((t, ti) => t.classList.toggle('active', ti === i));
        syncBeautyUIFromCur();
        queueBeautyRender();
      });
      tabs.appendChild(b);
    }
  }

  /* 一括反映（FLASH式・2026-08-12）: いま見ている1枚の盛り設定を4枚全部へコピーする */
  $('#btn-beauty-apply-all').addEventListener('click', () => {
    if (!state.beautyShots) return;
    const src = curBeauty();
    state.beautyShots = state.beautyShots.map(() => ({ ...src }));
    playSoundOr('moriageSelect', 'seDecide');
    beautyFaceNote.textContent = '💫 全部の写真にこの設定を反映したよ！';
    beautyFaceNote.classList.remove('hidden');
    setTimeout(() => beautyFaceNote.classList.add('hidden'), 1800);
  });

  [[sliderSkin, 'skin'], [sliderWhite, 'white'], [sliderClear, 'clear'], [sliderEye, 'eye'], [sliderFace, 'face'], [sliderCheek, 'cheek'], [sliderLip, 'lip']].forEach(([el, key]) => {
    el.addEventListener('input', () => {
      const cur = curBeauty();
      cur[key] = Number(el.value);
      cur._preset = '';
      cur._level = '';
      $('#val-' + key).textContent = el.value;
      markPresetActive(''); // 手動調整したらプリセット選択を解除
      markLevelActive('');
      queueBeautyRender();
    });
  });

  async function detectFacesForShots() {
    // 顔ランドマークとML肌セグメンテーションを並行で準備
    await Promise.all([initFaceLandmarker(), initSkinSegmenter()]);
    if (!faceLandmarker) {
      beautyFaceNote.textContent = '顔検出が使えないため、美肌とフィルターのみ反映されます';
      beautyFaceNote.classList.remove('hidden');
    }
    let anyFace = false;
    for (let i = 0; i < state.shots.length; i++) {
      if (faceLandmarker) {
        try {
          const res = faceLandmarker.detect(state.shots[i]);
          state.faceData[i] = (res.faceLandmarks && res.faceLandmarks.length) ? res.faceLandmarks : null;
          if (state.faceData[i]) anyFace = true;
        } catch (err) {
          state.faceData[i] = null;
        }
      }
      // ML肌マスク（モデルが読めていれば）
      state.skinConf[i] = computeSkinConf(state.shots[i]);
    }
    skinMaskCache.clear(); // ML肌マスクが揃ったので、仮マスクのキャッシュを破棄して作り直す
    if (faceLandmarker && !anyFace) {
      beautyFaceNote.textContent = '顔が見つからなかったよ…美肌とフィルターだけ反映されます';
      beautyFaceNote.classList.remove('hidden');
    } else if (faceLandmarker) {
      beautyFaceNote.classList.add('hidden');
    }
    queueBeautyRender();
  }

  function startBeautyScreen() {
    showScreen('screen-beauty');
    playSound('beauty');
    state.beautySelected = 0;
    state.beautyRemaining = BEAUTY_SECONDS;
    state.beautyWarned = false;
    /* 1枚ごとの盛り設定を初期化: 撮影時のライブ盛れ設定（state.beauty）を4枚分に複製。
       撮影時の設定がどのプリセットと一致するかを調べてUIメモも入れておく */
    const conf = modeConf();
    const matched = conf.presets.find(p =>
      ['skin', 'white', 'clear', 'eye', 'face', 'cheek', 'lip'].every(k => state.beauty[k] === p[k]));
    state.beautyShots = Array.from({ length: NUM_SHOTS }, () => ({
      ...state.beauty,
      _preset: matched ? matched.id : '',
      _level: matched ? 'l100' : '',
    }));
    beautyFaceNote.textContent = '👀 顔を検出中…';
    beautyFaceNote.classList.remove('hidden');
    buildBeautyControls();
    syncBeautyUIFromCur();
    beautyTimerDisplay.textContent = formatTime(state.beautyRemaining);
    beautyTimerDisplay.classList.remove('warn');
    queueBeautyRender(); // まずは美肌+フィルターのみで即表示

    detectFacesForShots(); // 顔検出は非同期で追いかける

    if (state.beautyTimerId) clearInterval(state.beautyTimerId);
    state.beautyTimerId = setInterval(() => {
      state.beautyRemaining--;
      beautyTimerDisplay.textContent = formatTime(Math.max(0, state.beautyRemaining));
      if (state.beautyRemaining <= 10) {
        beautyTimerDisplay.classList.add('warn');
        if (!state.beautyWarned) {
          state.beautyWarned = true;
          playSound('timeWarning');
        }
      }
      if (state.beautyRemaining <= 0) {
        clearInterval(state.beautyTimerId);
        finishBeauty();
      }
    }, 1000);
  }

  let beautyFinished = false;
  function finishBeauty() {
    if (screens['screen-beauty'].classList.contains('active') === false) return;
    if (beautyFinished) return;
    beautyFinished = true;
    if (state.beautyTimerId) clearInterval(state.beautyTimerId);
    // 各ショットに「その1枚の」パラメータを適用（2026-08-12: 1枚ごとの盛り設定に対応）
    state.processedShots = state.shots.map((shot, i) =>
      applyBeauty(shot, state.faceData[i], (state.beautyShots && state.beautyShots[i]) || state.beauty, null, i));
    composeSheet();
    startDecoScreen();
    beautyFinished = false;
  }

  $('#btn-beauty-done').addEventListener('click', finishBeauty);

  /* ===================== シート合成（モード別デザイン） ===================== */
  const sheetCanvas = $('#sheet-canvas');
  sheetCanvas.width = SHEET_W;
  sheetCanvas.height = SHEET_H;

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // アスペクト比を保ったままセルいっぱいに描画（中央クロップ）。video要素にも対応
  function drawCover(ctx, img, x, y, w, h) {
    const sw = img.videoWidth || img.width, sh = img.videoHeight || img.height;
    if (!sw || !sh) { ctx.drawImage(img, x, y, w, h); return; }
    const scale = Math.max(w / sw, h / sh);
    const cw = w / scale, ch = h / scale;
    const sx = (sw - cw) / 2, sy = (sh - ch) / 2;
    ctx.drawImage(img, sx, sy, cw, ch, x, y, w, h);
  }

  function composeSheet() {
    const conf = modeConf();
    const sheet = conf.sheet;
    const ctx = sheetCanvas.getContext('2d');
    ctx.clearRect(0, 0, SHEET_W, SHEET_H);

    // 背景
    if (state.mode === 'heisei') {
      const grad = ctx.createLinearGradient(0, 0, 0, SHEET_H);
      grad.addColorStop(0, sheet.bgTop);
      grad.addColorStop(0.15, state.curtain.color);
      grad.addColorStop(1, sheet.bgBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, SHEET_W, SHEET_H);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, SHEET_H);
      grad.addColorStop(0, sheet.bgTop);
      grad.addColorStop(1, sheet.bgBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, SHEET_W, SHEET_H);
      // 令和：シールカラーの細いラインをアクセントに
      ctx.fillStyle = state.curtain.color;
      ctx.fillRect(0, 62, SHEET_W, 3);
    }

    // タイトル
    ctx.textAlign = 'center';
    ctx.font = sheet.titleFont;
    ctx.save();
    if (sheet.titleGlow) {
      ctx.shadowColor = sheet.titleGlow;
      ctx.shadowBlur = 6;
    }
    ctx.fillStyle = sheet.titleColor;
    ctx.fillText(sheet.title, SHEET_W / 2, 46);
    ctx.restore();

    // 写真をレイアウトに合わせて配置（盛り加工済みを優先。セル数が写真より多い場合は繰り返し=16分割の再現）
    const shots = state.processedShots.length ? state.processedShots : state.shots;
    const cells = layoutCells(state.layout);
    const radius = state.layout.radius;
    const pad = Math.min(6, state.layout.gap * 0.3);
    const isCircle = state.layout.shape === 'circle';
    cells.forEach((cell, i) => {
      const shotCanvas = shots[i % shots.length];
      if (!shotCanvas) return;
      const { x, y, w: cw, h: chh } = cell;
      // 円形セルは正円（短辺基準）
      const cx = x + cw / 2, cy = y + chh / 2;
      const rad = Math.min(cw, chh) / 2;

      const cellPath = () => {
        if (isCircle) {
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        } else {
          roundRect(ctx, x, y, cw, chh, radius);
        }
      };

      ctx.save();
      if (isCircle) {
        ctx.beginPath();
        ctx.arc(cx, cy, rad + pad, 0, Math.PI * 2);
      } else {
        roundRect(ctx, x - pad, y - pad, cw + pad * 2, chh + pad * 2, radius + 4);
      }
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,.22)';
      ctx.shadowBlur = state.mode === 'reiwa' ? 5 : 8;
      ctx.fill();
      ctx.restore();

      ctx.save();
      cellPath();
      ctx.clip();
      if (isCircle) {
        drawCover(ctx, shotCanvas, cx - rad, cy - rad, rad * 2, rad * 2);
      } else {
        drawCover(ctx, shotCanvas, x, y, cw, chh);
      }
      ctx.restore();

      ctx.save();
      cellPath();
      ctx.lineWidth = state.mode === 'reiwa' ? 1.5 : 3;
      if (state.mode === 'reiwa') {
        ctx.strokeStyle = '#e0d5c8';
      } else {
        ctx.strokeStyle = state.curtain.color === '#ffffff' ? '#ffb6de' : state.curtain.color;
      }
      ctx.stroke();
      ctx.restore();
    });

    // フレーム装飾
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (sheet.cornerDeco === 'frameEmoji') {
      // 初期プリ機のフレーム風: シール全周にモチーフを並べる（「シンプル」はモチーフなし）
      if (state.frame.emoji) {
        ctx.font = '22px sans-serif';
        const step = 62;
        const topY = HEADER_H + 8;
        const botY = SHEET_H - FOOTER_H - 8;
        for (let x = 30; x <= SHEET_W - 30; x += step) {
          ctx.fillText(state.frame.emoji, x, topY);
          ctx.fillText(state.frame.emoji, x, botY);
        }
        for (let y = topY + step; y < botY; y += step) {
          ctx.fillText(state.frame.emoji, 16, y);
          ctx.fillText(state.frame.emoji, SHEET_W - 16, y);
        }
      }
    } else {
      // 令和：フレーム絵文字を小さく上品に散らす
      ctx.font = '18px sans-serif';
      ctx.globalAlpha = 0.85;
      ctx.fillText(state.frame.emoji, 30, HEADER_H + 6);
      ctx.fillText(state.frame.emoji, SHEET_W - 30, SHEET_H - FOOTER_H - 6);
      ctx.globalAlpha = 1;
    }

    // フッター（日付）
    const d = new Date();
    const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    ctx.font = state.mode === 'reiwa' ? 'italic 500 13px Georgia, serif' : '700 14px sans-serif';
    ctx.fillStyle = sheet.footerColor;
    ctx.fillText(`${dateStr}　${sheet.footerName}`, SHEET_W / 2, SHEET_H - FOOTER_H / 2);
  }

  /* ===================== 3. 落書き画面（オブジェクト方式） =====================
     すべての描き込みを「オブジェクト」として保持し、キャンバスはオブジェクト列から再描画する。
     これにより ロイロノート式の「なぞり消し」（触れた線やスタンプを丸ごと消す）と
     軽量なアンドゥ（操作の巻き戻し）が可能になる。 */
  const drawCanvas = $('#draw-canvas');
  drawCanvas.width = SHEET_W;
  drawCanvas.height = SHEET_H;
  const drawCtx = drawCanvas.getContext('2d');
  // ストローク描画中のプレビュー用レイヤー
  const strokeCanvas = $('#stroke-canvas');
  strokeCanvas.width = SHEET_W;
  strokeCanvas.height = SHEET_H;
  const strokeCtx = strokeCanvas.getContext('2d');

  let decoObjects = [];   // 描き込みオブジェクトの列（描画順）
  let undoStack = [];     // 操作履歴 {op:'add'} | {op:'remove', items:[{index,obj}]}

  /* ---------- 手描き風スタンプ（Canvas描画） ---------- */
  function heartPath(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.32);
    ctx.bezierCurveTo(-s * 0.55, -s * 0.12, -s * 0.30, -s * 0.52, 0, -s * 0.22);
    ctx.bezierCurveTo(s * 0.30, -s * 0.52, s * 0.55, -s * 0.12, 0, s * 0.32);
    ctx.closePath();
  }

  const DRAWN_STAMPS = {
    heartSticker: { label: 'ハートシール', draw(ctx, s) {
      heartPath(ctx, s);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = s * 0.22;
      ctx.stroke();
      ctx.fillStyle = '#f0959c';
      ctx.fill();
    } },
    heartGlossy: { label: 'ツヤハート', draw(ctx, s) {
      heartPath(ctx, s);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = s * 0.14;
      ctx.stroke();
      const g = ctx.createLinearGradient(0, -s * 0.5, 0, s * 0.35);
      g.addColorStop(0, '#f8b0b8');
      g.addColorStop(1, '#e87880');
      ctx.fillStyle = g;
      ctx.fill();
      // ハイライト
      ctx.fillStyle = 'rgba(255,255,255,.75)';
      ctx.beginPath();
      ctx.ellipse(-s * 0.18, -s * 0.22, s * 0.12, s * 0.07, -0.5, 0, Math.PI * 2);
      ctx.fill();
    } },
    heartOutline: { label: '白フチハート', draw(ctx, s) {
      heartPath(ctx, s);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = s * 0.16;
      ctx.stroke();
    } },
    heartLine: { label: '線画ハート', draw(ctx, s) {
      heartPath(ctx, s);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#2e2a28';
      ctx.lineWidth = Math.max(1.5, s * 0.06);
      ctx.stroke();
    } },
    heartArrow: { label: 'ハート矢', draw(ctx, s) {
      heartPath(ctx, s);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#2e2a28';
      ctx.lineWidth = Math.max(1.5, s * 0.06);
      ctx.stroke();
      // 矢（左下→右上）
      ctx.beginPath();
      ctx.moveTo(-s * 0.62, s * 0.5);
      ctx.lineTo(s * 0.62, -s * 0.45);
      ctx.stroke();
      // 矢尻
      ctx.beginPath();
      ctx.moveTo(s * 0.62, -s * 0.45);
      ctx.lineTo(s * 0.42, -s * 0.42);
      ctx.moveTo(s * 0.62, -s * 0.45);
      ctx.lineTo(s * 0.58, -s * 0.24);
      ctx.stroke();
      // 羽
      ctx.beginPath();
      ctx.moveTo(-s * 0.62, s * 0.5);
      ctx.lineTo(-s * 0.5, s * 0.55);
      ctx.moveTo(-s * 0.62, s * 0.5);
      ctx.lineTo(-s * 0.66, s * 0.36);
      ctx.stroke();
    } },
    heartChalk: { label: 'チョークハート', draw(ctx, s) {
      // クレヨン風: 塗りに細かい抜けを散らす
      heartPath(ctx, s);
      ctx.fillStyle = '#e0757d';
      ctx.fill();
      ctx.save();
      heartPath(ctx, s);
      ctx.clip();
      ctx.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < 45; i++) {
        const rx = (Math.random() * 2 - 1) * s * 0.55;
        const ry = (Math.random() * 2 - 1) * s * 0.5;
        ctx.globalAlpha = 0.3 + Math.random() * 0.5;
        ctx.beginPath();
        ctx.arc(rx, ry, s * (0.015 + Math.random() * 0.04), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } },
    sparkleLine: { label: 'キラ', draw(ctx, s) {
      ctx.strokeStyle = '#fff6c8';
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(255,240,160,.9)';
      ctx.shadowBlur = s * 0.25;
      ctx.lineWidth = Math.max(1.5, s * 0.09);
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.55); ctx.lineTo(0, s * 0.55);
      ctx.moveTo(-s * 0.38, 0); ctx.lineTo(s * 0.38, 0);
      ctx.stroke();
      ctx.lineWidth = Math.max(1, s * 0.06);
      ctx.beginPath();
      ctx.moveTo(-s * 0.22, -s * 0.22); ctx.lineTo(s * 0.22, s * 0.22);
      ctx.moveTo(s * 0.22, -s * 0.22); ctx.lineTo(-s * 0.22, s * 0.22);
      ctx.stroke();
    } },
    dateRetro: { label: '日付(写ルンです風)', draw(ctx, s) {
      // フィルムカメラの日付焼き込み風（オレンジのデジタル文字）
      const d = new Date();
      const txt = `'${String(d.getFullYear()).slice(2)} ${d.getMonth() + 1} ${d.getDate()}`;
      ctx.font = `700 ${Math.round(s * 0.42)}px "Courier New", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255,122,26,.9)';
      ctx.shadowBlur = s * 0.12;
      ctx.fillStyle = '#ff8a2a';
      ctx.fillText(txt, 0, 0);
      ctx.fillText(txt, 0, 0);
    } },
    dateCute: { label: '日付(シール風)', draw(ctx, s) {
      const d = new Date();
      const txt = `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ♡`;
      ctx.font = `900 ${Math.round(s * 0.36)}px "Hiragino Maru Gothic ProN", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = s * 0.13;
      ctx.strokeText(txt, 0, 0);
      ctx.fillStyle = '#f2889f';
      ctx.fillText(txt, 0, 0);
    } },
    bubble: { label: 'ふきだし', draw(ctx, s) {
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.08, s * 0.6, s * 0.42, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,.95)';
      ctx.fill();
      ctx.strokeStyle = '#8a8a8a';
      ctx.lineWidth = Math.max(1.5, s * 0.05);
      ctx.stroke();
      // しっぽ
      ctx.beginPath();
      ctx.moveTo(-s * 0.15, s * 0.28);
      ctx.quadraticCurveTo(-s * 0.28, s * 0.5, -s * 0.42, s * 0.58);
      ctx.quadraticCurveTo(-s * 0.22, s * 0.52, -s * 0.02, s * 0.33);
      ctx.fillStyle = 'rgba(255,255,255,.95)';
      ctx.fill();
      ctx.stroke();
    } },
  };

  /* ---------- スタイル付き文字スタンプの描画 ---------- */
  function drawTextStampStyled(ctx, o) {
    const fs = o.fontSize;
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.rotate(o.rot);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (o.style === 'sticker') {
      // 白フチシール風
      ctx.font = `900 ${fs}px "Hiragino Maru Gothic ProN", sans-serif`;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = fs * 0.32;
      ctx.strokeText(o.t, 0, 0);
      ctx.fillStyle = o.color || '#f2889f';
      ctx.fillText(o.t, 0, 0);
    } else if (o.style === 'outline') {
      // 中抜き文字
      ctx.font = `900 ${fs}px "Hiragino Maru Gothic ProN", sans-serif`;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = fs * 0.3;
      ctx.strokeText(o.t, 0, 0);
      ctx.strokeStyle = o.color || '#3d3733';
      ctx.lineWidth = Math.max(1.2, fs * 0.07);
      ctx.strokeText(o.t, 0, 0);
    } else if (o.style === 'neon') {
      // ネオン発光（プリ機の定番フレーズ用）
      ctx.font = `700 ${fs}px "Hiragino Maru Gothic ProN", sans-serif`;
      ctx.shadowColor = '#ff7ad9';
      ctx.shadowBlur = fs * 0.9;
      ctx.fillStyle = 'rgba(255,255,255,.96)';
      ctx.fillText(o.t, 0, 0);
      ctx.fillText(o.t, 0, 0);
      ctx.shadowBlur = 0;
    } else {
      // plain: 作成時のモード標準スタイル
      ctx.font = o.font;
      if (o.strokeColor) {
        ctx.lineWidth = o.strokeWidth;
        ctx.strokeStyle = o.strokeColor;
        ctx.strokeText(o.t, 0, 0);
      }
      ctx.fillStyle = o.color;
      ctx.fillText(o.t, 0, 0);
    }
    ctx.restore();
  }

  /* ---------- オブジェクト描画・再描画 ---------- */
  function strokePolyline(ctx, pts, type, color, size) {
    if (pts.length < 2) {
      const p = pts[0];
      ctx.save();
      if (type === 'fuchi') {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(p.x, p.y, (size + 6) / 2, 0, Math.PI * 2); ctx.fill();
      }
      if (type === 'neon') { ctx.shadowColor = color; ctx.shadowBlur = size * 1.6; }
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return;
    }
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    };
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (type === 'fuchi') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size + 7;
      path(); ctx.stroke();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      path(); ctx.stroke();
    } else if (type === 'neon') {
      ctx.shadowColor = color;
      ctx.shadowBlur = Math.max(8, size * 1.8);
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      path(); ctx.stroke();
      path(); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,.9)';
      ctx.lineWidth = Math.max(1.5, size * 0.35);
      path(); ctx.stroke();
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      path(); ctx.stroke();
    }
    ctx.restore();
  }

  function drawObject(ctx, o) {
    switch (o.type) {
      case 'stroke':
        strokePolyline(ctx, o.pts, o.penType, o.color, o.size);
        break;
      case 'erase':
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = o.size;
        ctx.beginPath();
        ctx.moveTo(o.pts[0].x, o.pts[0].y);
        for (let i = 1; i < o.pts.length; i++) ctx.lineTo(o.pts[i].x, o.pts[i].y);
        if (o.pts.length === 1) ctx.lineTo(o.pts[0].x + 0.1, o.pts[0].y);
        ctx.stroke();
        ctx.restore();
        break;
      case 'kira':
        o.items.forEach((it) => {
          ctx.save();
          ctx.font = `${it.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.translate(it.x, it.y);
          ctx.rotate(it.rot);
          ctx.fillText(it.ch, 0, 0);
          ctx.restore();
        });
        break;
      case 'stamp':
        ctx.save();
        ctx.font = `${o.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(o.char, o.x, o.y);
        ctx.restore();
        break;
      case 'dstamp': {
        const def = DRAWN_STAMPS[o.id];
        if (!def) break;
        ctx.save();
        ctx.translate(o.x, o.y);
        def.draw(ctx, o.size);
        ctx.restore();
        break;
      }
      case 'text':
        drawTextStampStyled(ctx, o);
        break;
    }
  }

  function renderDeco() {
    drawCtx.clearRect(0, 0, SHEET_W, SHEET_H);
    decoObjects.forEach(o => drawObject(drawCtx, o));
  }

  function pushUndo(op) {
    undoStack.push(op);
    if (undoStack.length > 60) undoStack.shift();
  }

  function undo() {
    const op = undoStack.pop();
    if (!op) return;
    if (op.op === 'add') {
      decoObjects.pop();
    } else if (op.op === 'addMany') {
      // 落書き見本の一括反映を1操作として巻き戻す
      decoObjects.splice(Math.max(0, decoObjects.length - op.count), op.count);
    } else if (op.op === 'remove') {
      op.items.slice().sort((a, b) => a.index - b.index).forEach(({ index, obj }) => {
        decoObjects.splice(Math.min(index, decoObjects.length), 0, obj);
      });
    }
    renderDeco();
  }

  /* ---------- なぞり消し（ロイロノート式: 触れたものを丸ごと消す） ---------- */
  function distToSegment(px, py, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    let t = len2 ? ((px - a.x) * dx + (py - a.y) * dy) / len2 : 0;
    t = Math.max(0, Math.min(1, t));
    const cx = a.x + dx * t, cy = a.y + dy * t;
    return Math.hypot(px - cx, py - cy);
  }

  function hitTestObject(o, x, y, r) {
    switch (o.type) {
      case 'stroke': {
        const th = o.size / 2 + r;
        if (o.pts.length === 1) return Math.hypot(x - o.pts[0].x, y - o.pts[0].y) < th;
        for (let i = 1; i < o.pts.length; i++) {
          if (distToSegment(x, y, o.pts[i - 1], o.pts[i]) < th) return true;
        }
        return false;
      }
      case 'kira':
        return o.items.some(it => Math.hypot(x - it.x, y - it.y) < it.size * 0.7 + r);
      case 'stamp':
      case 'dstamp':
        return Math.abs(x - o.x) < o.size * 0.7 + r && Math.abs(y - o.y) < o.size * 0.7 + r;
      case 'text':
        return Math.abs(x - o.x) < (o.w || 60) / 2 + r && Math.abs(y - o.y) < o.fontSize * 0.8 + r;
      default:
        return false; // erase オブジェクトは対象外
    }
  }

  let swipeRemoved = [];
  function swipeEraseAt(x, y) {
    let removedAny = false;
    for (let i = decoObjects.length - 1; i >= 0; i--) {
      if (hitTestObject(decoObjects[i], x, y, 14)) {
        swipeRemoved.push({ index: i, obj: decoObjects[i] });
        decoObjects.splice(i, 1);
        removedAny = true;
      }
    }
    if (removedAny) renderDeco();
  }

  /* ---------- ツールUI ---------- */
  function buildColorRow() {
    const conf = modeConf();
    const row = $('#color-row');
    row.innerHTML = '';
    conf.penColors.forEach((c, i) => {
      const sw = document.createElement('div');
      sw.className = 'color-swatch' + (i === 0 ? ' selected' : '');
      sw.style.background = c;
      if (c === '#ffffff') sw.style.boxShadow = '0 0 0 1px #ccc, inset 0 0 0 1px #ddd';
      sw.addEventListener('click', () => {
        row.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        sw.classList.add('selected');
        state.penColor = c;
        setTool('pen');
      });
      row.appendChild(sw);
    });
  }

  function buildStampRow() {
    const conf = modeConf();
    const row = $('#stamp-row');
    row.innerHTML = '';
    // 手描き風スタンプ（ミニプレビュー付き）
    (conf.drawnStamps || []).forEach((id) => {
      const def = DRAWN_STAMPS[id];
      if (!def) return;
      const b = document.createElement('button');
      b.className = 'stamp-btn';
      b.title = def.label;
      const cv = document.createElement('canvas');
      cv.width = 36; cv.height = 36;
      cv.style.cssText = 'width:28px;height:28px;display:block;';
      const cctx = cv.getContext('2d');
      // プレビューは薄グレー地に描く（白系スタンプの視認用）
      cctx.fillStyle = '#c9c2ce';
      cctx.beginPath(); cctx.arc(18, 18, 17, 0, Math.PI * 2); cctx.fill();
      cctx.save(); cctx.translate(18, 19); def.draw(cctx, 22); cctx.restore();
      b.appendChild(cv);
      b.addEventListener('click', () => setTool('dstamp', id));
      row.appendChild(b);
    });
    // 絵文字スタンプ
    (conf.stamps || []).forEach(s => {
      const b = document.createElement('button');
      b.className = 'stamp-btn';
      b.textContent = s;
      b.addEventListener('click', () => setTool('stamp', s));
      row.appendChild(b);
    });
    const group = $('#group-stamp');
    if (group) group.style.display = ((conf.drawnStamps || []).length + (conf.stamps || []).length) ? '' : 'none';
  }

  function buildTextStampRow() {
    const conf = modeConf();
    const row = $('#text-stamp-row');
    row.innerHTML = '';
    (conf.textStamps || []).forEach(s => {
      const item = typeof s === 'string' ? { t: s, style: 'plain' } : s;
      const b = document.createElement('button');
      b.className = 'text-stamp-btn';
      b.textContent = item.t;
      b.addEventListener('click', () => setTool('textstamp', item));
      row.appendChild(b);
    });
    const group = $('#group-text');
    if (group) group.style.display = (conf.textStamps || []).length ? '' : 'none';
  }

  /* ---------- 落書き見本（Meidy式・2026-08-12 新設） ----------
     現行実機Meidyの「人気クリエイターの完成見本を選ぶと、そのまま配置済みになる」を再現。
     見本はオブジェクト列を返す関数として持ち、1タップで decoObjects に追加される
     （初心者救済＋完成度保証。追加は1操作扱いで「もどす」で丸ごと消せる）。
     配置は写真の顔を隠さないよう、ヘッダー・フッター・四隅の余白ぞいに寄せてある。 */
  function sampleText(t, style, color, x, y, fontSize, rotDeg) {
    return {
      type: 'text', t, style, color, x, y, fontSize,
      rot: (rotDeg || 0) * Math.PI / 180,
      w: t.length * fontSize + fontSize * 0.4,
    };
  }
  const DOODLE_SAMPLES = {
    heisei: [
      { label: 'ズッ友', build: () => [
        { type: 'dstamp', id: 'heartChalk', x: 60, y: 132, size: 48 },
        { type: 'dstamp', id: 'heartChalk', x: 620, y: 132, size: 48 },
        { type: 'dstamp', id: 'heartChalk', x: 60, y: 815, size: 48 },
        { type: 'kira', items: [
          { ch: '✨', x: 180, y: 108, size: 26, rot: 0.4 },
          { ch: '⭐', x: 340, y: 96, size: 28, rot: -0.3 },
          { ch: '✨', x: 500, y: 108, size: 26, rot: 0.2 },
        ] },
        sampleText('我等友情永久不滅成', 'sticker', '#ff2fa0', 320, 822, 26, -3),
        { type: 'dstamp', id: 'dateRetro', x: 575, y: 852, size: 62 },
      ] },
      { label: 'ラブラブ', build: () => [
        { type: 'dstamp', id: 'heartSticker', x: 72, y: 140, size: 52 },
        { type: 'dstamp', id: 'heartGlossy', x: 608, y: 140, size: 52 },
        sampleText('ラブラブ♡', 'neon', null, 340, 108, 30, 0),
        { type: 'stamp', char: '💋', x: 615, y: 800, size: 50 },
        { type: 'dstamp', id: 'heartOutline', x: 78, y: 800, size: 46 },
        { type: 'dstamp', id: 'dateRetro', x: 340, y: 856, size: 58 },
      ] },
      { label: 'アゲアゲ', build: () => [
        { type: 'dstamp', id: 'sparkleLine', x: 62, y: 130, size: 44 },
        { type: 'dstamp', id: 'sparkleLine', x: 618, y: 130, size: 44 },
        { type: 'stamp', char: '🔥', x: 64, y: 815, size: 48 },
        { type: 'stamp', char: '⚡', x: 616, y: 815, size: 48 },
        sampleText('最強', 'sticker', '#ff2fa0', 340, 106, 28, 2),
        sampleText('アゲアゲ⤴', 'sticker', '#ff8a2a', 340, 822, 30, -2),
      ] },
    ],
    reiwa: [
      { label: 'なかよし', build: () => [
        sampleText('BFF♡', 'sticker', '#e0498a', 340, 106, 26, -2),
        { type: 'stamp', char: '🤍', x: 66, y: 132, size: 40 },
        { type: 'stamp', char: '☁️', x: 614, y: 132, size: 40 },
        { type: 'dstamp', id: 'bubble', x: 600, y: 792, size: 50 },
        { type: 'dstamp', id: 'dateCute', x: 340, y: 852, size: 58 },
      ] },
      { label: 'エモ', build: () => [
        { type: 'dstamp', id: 'sparkleLine', x: 70, y: 132, size: 40 },
        { type: 'dstamp', id: 'sparkleLine', x: 610, y: 132, size: 40 },
        { type: 'dstamp', id: 'heartOutline', x: 78, y: 800, size: 44 },
        sampleText('エモい', 'sticker', '#a8917d', 340, 826, 26, 2),
        { type: 'dstamp', id: 'dateCute', x: 560, y: 858, size: 52 },
      ] },
      { label: 'シンプル', build: () => [
        { type: 'dstamp', id: 'heartLine', x: 60, y: 130, size: 40 },
        { type: 'dstamp', id: 'heartLine', x: 620, y: 130, size: 40 },
        { type: 'dstamp', id: 'heartLine', x: 60, y: 818, size: 40 },
        { type: 'dstamp', id: 'heartLine', x: 620, y: 818, size: 40 },
        sampleText('Perfect', 'outline', null, 340, 106, 26, -1),
      ] },
    ],
  };

  function buildSampleRow() {
    const row = $('#sample-row');
    row.innerHTML = '';
    const samples = DOODLE_SAMPLES[state.mode] || [];
    samples.forEach((sample) => {
      const b = document.createElement('button');
      b.className = 'sample-btn';
      const cv = document.createElement('canvas');
      cv.width = 60; cv.height = 79;
      const cctx = cv.getContext('2d');
      cctx.fillStyle = state.mode === 'reiwa' ? '#f4ede4' : '#ffe6f3';
      cctx.fillRect(0, 0, 60, 79);
      cctx.save();
      cctx.scale(60 / SHEET_W, 79 / SHEET_H);
      sample.build().forEach(o => drawObject(cctx, o));
      cctx.restore();
      b.appendChild(cv);
      const lb = document.createElement('span');
      lb.className = 'sample-label';
      lb.textContent = sample.label;
      b.appendChild(lb);
      b.addEventListener('click', () => {
        const objs = sample.build(); // 毎回新しいオブジェクトを作る（なぞり消しと共存させるため）
        decoObjects.push(...objs);
        renderDeco();
        pushUndo({ op: 'addMany', count: objs.length });
      });
      row.appendChild(b);
    });
    const group = $('#group-sample');
    if (group) group.style.display = samples.length ? '' : 'none';
  }

  function buildDecoTools() {
    const conf = modeConf();
    buildColorRow();
    buildStampRow();
    buildTextStampRow();
    buildSampleRow();
    state.penColor = conf.penColors[0];
    // ペン種別（モードごとに使えるものだけ表示。1種類なら行ごと隠す）
    const types = conf.penTypes || ['normal'];
    document.querySelectorAll('.pen-type-btn').forEach(b => {
      b.style.display = types.includes(b.dataset.pentype) ? '' : 'none';
      b.classList.toggle('active', b.dataset.pentype === 'normal');
    });
    const penTypeRow = $('#pen-type-row');
    if (penTypeRow) penTypeRow.style.display = types.length > 1 ? '' : 'none';
    state.penType = 'normal';
  }
  buildDecoTools();

  $('#pen-size').addEventListener('input', (e) => { state.penSize = Number(e.target.value); });

  function setTool(tool, extra) {
    state.tool = tool;
    state.stampChar = tool === 'stamp' ? extra : null;
    state.dstampId = tool === 'dstamp' ? extra : null;
    state.textStampSel = tool === 'textstamp' ? extra : null;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    if (tool === 'pen') $('.tool-btn[data-mode="pen"]').classList.add('active');
    if (tool === 'eraser') $('.tool-btn[data-mode="eraser"]').classList.add('active');
    if (tool === 'swipe') $('.tool-btn[data-mode="swipe"]').classList.add('active');
  }

  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => setTool(btn.dataset.mode));
  });

  function getCanvasPos(evt) {
    const rect = drawCanvas.getBoundingClientRect();
    const scaleX = drawCanvas.width / rect.width;
    const scaleY = drawCanvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY,
    };
  }

  /* ---------- ポインタ操作 ---------- */
  const SPARKLE_CHARS = ['✨', '⭐', '💫', '✦'];
  let curStroke = null;   // 描画中の stroke/erase/kira オブジェクト
  let lastSparkleX = 0, lastSparkleY = 0;

  drawCanvas.addEventListener('pointerdown', (e) => {
    if (state.remaining <= 0) return;
    try { drawCanvas.setPointerCapture(e.pointerId); } catch (err) { /* 一部環境では無視して続行 */ }
    const { x, y } = getCanvasPos(e);

    if (state.tool === 'swipe') {
      state.isDrawing = true;
      swipeRemoved = [];
      swipeEraseAt(x, y);
      return;
    }

    if (state.tool === 'stamp' && state.stampChar) {
      const o = { type: 'stamp', char: state.stampChar, x, y, size: state.stampSize };
      decoObjects.push(o);
      drawObject(drawCtx, o);
      pushUndo({ op: 'add' });
      return;
    }
    if (state.tool === 'dstamp' && state.dstampId) {
      const o = { type: 'dstamp', id: state.dstampId, x, y, size: state.stampSize * 1.2 };
      decoObjects.push(o);
      drawObject(drawCtx, o);
      pushUndo({ op: 'add' });
      return;
    }
    if (state.tool === 'textstamp' && state.textStampSel) {
      const sel = state.textStampSel;
      const modeStyle = modeConf().textStampStyle;
      const sizeScale = state.stampSize / 48;
      const fontSize = Math.round((sel.style === 'neon' ? 22 : 20) * sizeScale);
      const o = {
        type: 'text', t: sel.t, style: sel.style || 'plain', color: sel.color || modeStyle.fill,
        x, y, fontSize,
        rot: (Math.random() * modeStyle.rotate * 2 - modeStyle.rotate) * Math.PI / 180,
        font: modeStyle.font.replace(/(\d+)px/, (m, n) => Math.round(Number(n) * sizeScale) + 'px'),
        strokeColor: modeStyle.stroke,
        strokeWidth: (modeStyle.strokeWidth || 0) * sizeScale,
      };
      // ヒットテスト用に幅を測る
      drawCtx.save();
      drawCtx.font = `900 ${fontSize}px sans-serif`;
      o.w = drawCtx.measureText(o.t).width + fontSize * 0.4;
      drawCtx.restore();
      decoObjects.push(o);
      drawObject(drawCtx, o);
      pushUndo({ op: 'add' });
      return;
    }

    // pen / eraser
    state.isDrawing = true;
    state.lastX = x; state.lastY = y;

    if (state.tool === 'eraser') {
      curStroke = { type: 'erase', size: state.penSize * 2.2, pts: [{ x, y }] };
      return;
    }
    if (state.penType === 'kira') {
      curStroke = { type: 'kira', items: [] };
      lastSparkleX = x; lastSparkleY = y;
      addSparkle(x, y);
      return;
    }
    curStroke = { type: 'stroke', penType: state.penType, color: state.penColor, size: state.penSize, pts: [{ x, y }] };
    strokePolyline(strokeCtx, curStroke.pts, curStroke.penType, curStroke.color, curStroke.size);
  });

  function addSparkle(x, y) {
    const it = {
      ch: SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)],
      x: x + (Math.random() * 8 - 4),
      y: y + (Math.random() * 8 - 4),
      size: Math.round(state.penSize * (1.6 + Math.random() * 1.6)) + 10,
      rot: Math.random() * Math.PI * 2,
    };
    curStroke.items.push(it);
    drawCtx.save();
    drawCtx.font = `${it.size}px sans-serif`;
    drawCtx.textAlign = 'center';
    drawCtx.textBaseline = 'middle';
    drawCtx.translate(it.x, it.y);
    drawCtx.rotate(it.rot);
    drawCtx.fillText(it.ch, 0, 0);
    drawCtx.restore();
  }

  drawCanvas.addEventListener('pointermove', (e) => {
    if (!state.isDrawing || state.remaining <= 0) return;
    const { x, y } = getCanvasPos(e);

    if (state.tool === 'swipe') {
      swipeEraseAt(x, y);
      return;
    }
    if (state.tool === 'eraser' && curStroke) {
      // プレビューは直接destination-outで消しつつ、オブジェクトにも記録
      curStroke.pts.push({ x, y });
      drawCtx.save();
      drawCtx.globalCompositeOperation = 'destination-out';
      drawCtx.lineCap = 'round';
      drawCtx.lineJoin = 'round';
      drawCtx.lineWidth = curStroke.size;
      drawCtx.beginPath();
      drawCtx.moveTo(state.lastX, state.lastY);
      drawCtx.lineTo(x, y);
      drawCtx.stroke();
      drawCtx.restore();
      state.lastX = x; state.lastY = y;
      return;
    }
    if (state.penType === 'kira' && curStroke) {
      const dx = x - lastSparkleX, dy = y - lastSparkleY;
      if (dx * dx + dy * dy > (state.penSize * 2.4) ** 2) {
        addSparkle(x, y);
        lastSparkleX = x; lastSparkleY = y;
      }
      state.lastX = x; state.lastY = y;
      return;
    }
    if (curStroke) {
      curStroke.pts.push({ x, y });
      strokeCtx.clearRect(0, 0, SHEET_W, SHEET_H);
      strokePolyline(strokeCtx, curStroke.pts, curStroke.penType, curStroke.color, curStroke.size);
      state.lastX = x; state.lastY = y;
    }
  });

  function endStroke() {
    if (!state.isDrawing) return;
    state.isDrawing = false;
    if (state.tool === 'swipe') {
      if (swipeRemoved.length) {
        pushUndo({ op: 'remove', items: swipeRemoved });
        swipeRemoved = [];
      }
      return;
    }
    if (!curStroke) return;
    if (curStroke.type === 'stroke') {
      drawCtx.drawImage(strokeCanvas, 0, 0);
      strokeCtx.clearRect(0, 0, SHEET_W, SHEET_H);
    }
    decoObjects.push(curStroke);
    pushUndo({ op: 'add' });
    curStroke = null;
  }
  drawCanvas.addEventListener('pointerup', endStroke);
  drawCanvas.addEventListener('pointercancel', endStroke);
  drawCanvas.addEventListener('pointerleave', endStroke);

  // ペン種別・スタンプサイズの切り替え
  document.querySelectorAll('.pen-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.penType = btn.dataset.pentype;
      document.querySelectorAll('.pen-type-btn').forEach(b => b.classList.toggle('active', b === btn));
      setTool('pen');
    });
  });
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.stampSize = Number(btn.dataset.stampsize);
      document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  $('#btn-undo').addEventListener('click', undo);
  $('#btn-clear').addEventListener('click', () => {
    if (!decoObjects.length) return;
    pushUndo({ op: 'remove', items: decoObjects.map((obj, index) => ({ index, obj })) });
    decoObjects = [];
    renderDeco();
  });

  /* ---------- おなまえスタンプ（2026-08-12 新設・実機定番） ----------
     自分の名前を白フチシール風の文字スタンプにする。入力→シートをタップで配置。 */
  const nameModal = $('#name-modal');
  const nameInput = $('#name-input');
  $('#btn-name-stamp').addEventListener('click', () => {
    nameInput.value = '';
    nameModal.classList.remove('hidden');
    setTimeout(() => nameInput.focus(), 60);
  });
  $('#btn-name-cancel').addEventListener('click', () => nameModal.classList.add('hidden'));
  $('#btn-name-ok').addEventListener('click', () => {
    const t = nameInput.value.trim();
    nameModal.classList.add('hidden');
    if (!t) return;
    const color = state.mode === 'reiwa' ? '#a8917d' : '#ff2fa0';
    setTool('textstamp', { t, style: 'sticker', color });
    showDecoToast('シートをタップして なまえを押してね！');
  });

  /* ===================== できあがり確認 ===================== */
  const confirmModal = $('#confirm-modal');

  $('#btn-finish').addEventListener('click', () => {
    if (state.remaining <= 0) return;
    playSound('decoOwaru'); // 実機の「おわる」ボタンボイス（未着なら無音でスキップ）
    confirmModal.classList.remove('hidden');
  });
  $('#btn-confirm-no').addEventListener('click', () => {
    confirmModal.classList.add('hidden');
  });
  $('#btn-confirm-yes').addEventListener('click', () => {
    confirmModal.classList.add('hidden');
    if (state.timerId) clearInterval(state.timerId);
    finishDeco('manual');
  });

  /* ===================== 落書きタイマー ===================== */
  const timerDisplay = $('#timer-display');
  const decoToastEl = $('#deco-toast');
  const decoCountdownEl = $('#deco-countdown');
  let decoToastId = null;

  function showDecoToast(text) {
    decoToastEl.textContent = text;
    decoToastEl.classList.remove('hidden');
    if (decoToastId) clearTimeout(decoToastId);
    decoToastId = setTimeout(() => decoToastEl.classList.add('hidden'), 2600);
  }

  function startDecoScreen() {
    showScreen('screen-deco');
    drawCtx.clearRect(0, 0, SHEET_W, SHEET_H);
    decoObjects = [];
    undoStack = [];
    renderDeco();
    buildDecoTools();
    setTool('pen');
    state.remaining = decoSeconds();
    state.warningPlayed = false;
    decoFinished = false;
    $('#deco-timeup').classList.add('hidden');
    $('#confirm-modal').classList.add('hidden');
    decoToastEl.classList.add('hidden');
    decoCountdownEl.classList.add('hidden');
    nameModal.classList.add('hidden');
    timerDisplay.textContent = formatTime(state.remaining);
    timerDisplay.classList.remove('warn');

    /* タイマーは「客が『らくがきスタート』を押した瞬間」から走らせる（2026-07-26 オーナー裁定）。
       撮影ルームから出て、別の場所へ移動して、座るまでの間に持ち時間が溶けるのを防ぐため。 */
    if (state.timerId) clearInterval(state.timerId);
    drawCanvas.style.pointerEvents = 'none';
    $('#deco-start-gate').classList.remove('hidden');
  }

  $('#btn-deco-start').addEventListener('click', () => {
    $('#deco-start-gate').classList.add('hidden');
    drawCanvas.style.pointerEvents = 'auto';
    playSound('decoStart');
    startDecoTimer();
  });

  function startDecoTimer() {
    if (state.timerId) clearInterval(state.timerId);
    /* 中間通知（2026-08-12 新設）: 現行実機は約200秒の途中で区切りの通知が入る。
       残り時間が半分になったところで一声＋トースト表示 */
    const halfPoint = Math.floor(decoSeconds() / 2);
    state.timerId = setInterval(() => {
      state.remaining--;
      timerDisplay.textContent = formatTime(Math.max(0, state.remaining));
      if (state.remaining === halfPoint) {
        playSound('decoHalftime');
        showDecoToast(`⏰ のこり はんぶん！（${formatTime(halfPoint)}）`);
      }
      if (state.remaining <= 10) {
        timerDisplay.classList.add('warn');
        if (!state.warningPlayed) {
          state.warningPlayed = true;
          playSound('timeWarning');
        }
        // 終盤カウントダウン演出: 最後の10秒はシート上に大きく数字を出す
        if (state.remaining > 0) {
          decoCountdownEl.textContent = String(state.remaining);
          decoCountdownEl.classList.remove('hidden');
        }
      }
      if (state.remaining <= 0) {
        decoCountdownEl.classList.add('hidden');
        clearInterval(state.timerId);
        finishDeco('timeup');
      }
    }, 1000);
  }

  /* 二重実行ガード（2026-08-12 qa-tester指摘）:
     タイムアップの演出中（約1.4秒）に「おわる」確認モーダルの「はい」が押せてしまい、
     finishDeco が2回走る窓があった。発火したら確認モーダルを強制的に閉じ、2回目は無視する */
  let decoFinished = false;
  async function finishDeco(reason) {
    if (decoFinished) return;
    decoFinished = true;
    confirmModal.classList.add('hidden');
    drawCanvas.style.pointerEvents = 'none';
    decoCountdownEl.classList.add('hidden');
    decoToastEl.classList.add('hidden');
    $('#deco-timeup-text').textContent = reason === 'manual' ? '✨ できあがり！' : '⏰ タイムアップ！';
    $('#deco-timeup').classList.remove('hidden');
    playSound(reason === 'manual' ? 'finish' : 'timeup');
    await sleep(1300);
    $('#deco-timeup').classList.add('hidden');
    composeFinal();
    showScreen('screen-print');
    startPrintSequence();
  }

  /* ===================== 4. プリント画面 ===================== */
  const finalCanvas = $('#final-canvas');
  finalCanvas.width = SHEET_W;
  finalCanvas.height = SHEET_H;

  function fileStamp() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function composeFinal() {
    const ctx = finalCanvas.getContext('2d');
    ctx.clearRect(0, 0, SHEET_W, SHEET_H);
    ctx.drawImage(sheetCanvas, 0, 0);
    ctx.drawImage(drawCanvas, 0, 0);
    const dataUrl = finalCanvas.toDataURL('image/png');
    const link = $('#btn-download');
    link.href = dataUrl;
    link.download = `purikura_${state.mode}_${fileStamp()}.png`;
    // 追加出力（16分割・たて長）は押されたときに作る。前回セッションの生成結果は破棄
    ['#btn-download-16', '#btn-download-story'].forEach(sel => {
      const el = $(sel);
      el.removeAttribute('href');
      delete el.dataset.done;
    });
  }

  /* ---------- シール排出演出（2026-08-12 新設） ----------
     実機の「印刷待ち」の時間も体験の一部（待つあいだもデモ・アナウンスが流れる考証）。
     print_out.mp3 を鳴らしながらシールが排出口からゆっくり出てくる。
     終わったら従来の完成ボイス（save）と保存ボタンを出す。 */
  const PRINT_EJECT_MS = 4600;
  const printStage = $('#print-stage');
  let printReadyId = null;
  function startPrintSequence() {
    printStage.classList.remove('ready');
    printStage.classList.add('printing');
    playSound('printOut');
    if (printReadyId) clearTimeout(printReadyId);
    printReadyId = setTimeout(() => {
      printStage.classList.remove('printing'); // アニメ終端＝transform:0 と同じ位置なので外してよい
      printStage.classList.add('ready');
      playSound('save');
    }, PRINT_EJECT_MS);
  }

  /* ---------- 追加出力①: 16分割シール風（初代プリント倶楽部1995年の型） ----------
     初代は「16分割・1枚17mm×24mm（横長）」のみだった（JAIA20年史）。
     選んだレイアウトに関係なく、その比率の16分割台紙を別出力として作る。落書きは載せない
     （初代に落書き機能は無い、という考証）。 */
  function composeSixteenRetro() {
    const cv = document.createElement('canvas');
    cv.width = SHEET_W; cv.height = SHEET_H;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, SHEET_W, SHEET_H);
    ctx.strokeStyle = '#ffb6de';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, SHEET_W - 16, SHEET_H - 16);
    ctx.textAlign = 'center';
    ctx.font = '900 30px -apple-system, sans-serif';
    ctx.fillStyle = '#ff2fa0';
    // 「プリント倶楽部/Print Club」はセガの登録商標のため自前の名称を使う（2026-08-12 era-designer指摘）
    ctx.fillText('★ 太子プリ ★', SHEET_W / 2, 52);

    const shots = state.processedShots.length ? state.processedShots : state.shots;
    if (shots.length) {
      const margin = 26, gap = 10, cols = 4, rows = 4;
      const cw = (SHEET_W - margin * 2 - gap * (cols - 1)) / cols;
      const chh = cw * 17 / 24; // 初代のシール比率 横24:縦17
      const gridH = rows * chh + (rows - 1) * gap;
      const yTop = 70 + ((SHEET_H - 70 - 46) - gridH) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = margin + c * (cw + gap);
          const y = yTop + r * (chh + gap);
          const shot = shots[(r * cols + c) % shots.length];
          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, cw, chh);
          ctx.clip();
          drawCover(ctx, shot, x, y, cw, chh);
          ctx.restore();
          ctx.strokeStyle = '#ffd3ea';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 0.5, y + 0.5, cw - 1, chh - 1);
        }
      }
    }
    const d = new Date();
    ctx.font = '700 13px sans-serif';
    ctx.fillStyle = '#c78ab0';
    ctx.fillText(`${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}　16pcs sticker`, SHEET_W / 2, SHEET_H - 18);
    return cv;
  }

  /* ---------- 追加出力②: 9:16 たて長コラージュ（現行実機Meidyの型） ----------
     スマホのストーリーズにそのまま貼れる縦長画像。ポラロイド風に4枚を並べる。 */
  function composeStoryCollage() {
    const W = 1080, H = 1920;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const conf = modeConf();
    const sheet = conf.sheet;
    const cc = state.curtain.color;
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, shadeColor(cc, 40));
    grad.addColorStop(0.5, cc);
    grad.addColorStop(1, shadeColor(cc, -25));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // タイトル＋日付
    ctx.textAlign = 'center';
    ctx.save();
    if (sheet.titleGlow) { ctx.shadowColor = sheet.titleGlow; ctx.shadowBlur = 14; }
    ctx.font = state.mode === 'reiwa' ? 'italic 600 64px Georgia, serif' : '900 72px -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(sheet.title, W / 2, 160);
    ctx.restore();
    const d = new Date();
    ctx.font = state.mode === 'reiwa' ? 'italic 500 34px Georgia, serif' : '800 34px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.fillText(`${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`, W / 2, 224);

    // 写真: ポラロイド風カードを2x2で交互に傾けて配置
    const shots = state.processedShots.length ? state.processedShots : state.shots;
    if (shots.length) {
      const pw = 470, ph = 353, padT = 16, padS = 16, padB = 52;
      const cardW = pw + padS * 2, cardH = ph + padT + padB;
      const centers = [
        { x: 278, y: 400 + cardH / 2, rot: -3 },
        { x: 802, y: 450 + cardH / 2, rot: 2.5 },
        { x: 278, y: 990 + cardH / 2, rot: 2 },
        { x: 802, y: 1040 + cardH / 2, rot: -2.5 },
      ];
      centers.forEach((pos, i) => {
        const shot = shots[i % shots.length];
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(pos.rot * Math.PI / 180);
        ctx.shadowColor = 'rgba(0,0,0,.3)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 8);
        ctx.fill();
        ctx.shadowBlur = 0;
        drawCover(ctx, shot, -pw / 2, -cardH / 2 + padT, pw, ph);
        ctx.restore();
      });
    }

    // フッター（ハッシュタグ風）
    ctx.font = state.mode === 'reiwa' ? 'italic 600 38px Georgia, serif' : '900 40px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.95)';
    ctx.fillText(`#文化祭プリ　${sheet.footerName}`, W / 2, H - 100);
    return cv;
  }

  // 追加出力は押された瞬間に生成して同じタップで保存する（クリック処理内でhrefを確定させる）
  $('#btn-download-16').addEventListener('click', function () {
    if (this.dataset.done) return;
    this.href = composeSixteenRetro().toDataURL('image/png');
    this.download = `purikura16_${state.mode}_${fileStamp()}.png`;
    this.dataset.done = '1';
  });
  $('#btn-download-story').addEventListener('click', function () {
    if (this.dataset.done) return;
    this.href = composeStoryCollage().toDataURL('image/png');
    this.download = `purikura_story_${state.mode}_${fileStamp()}.png`;
    this.dataset.done = '1';
  });

  $('#btn-restart').addEventListener('click', () => {
    if (state.timerId) clearInterval(state.timerId);
    if (state.beautyTimerId) clearInterval(state.beautyTimerId);
    if (printReadyId) { clearTimeout(printReadyId); printReadyId = null; }
    state.shots = [];
    state.processedShots = [];
    state.faceData = [];
    // 次の客のために選択系もまっさらへ（2026-08-12 qa-tester指摘。無人運用では前の客の設定が残ると事故）
    state.bgmChoice = 'auto';
    state.heiseiEra = 'standard';
    decoObjects = [];
    undoStack = [];
    renderDeco();
    playBgmSrc(BGM_TITLE); // タイトルへ戻ったらタイトル曲へ
    showScreen('screen-title');
  });

  /* ===================== 効果音（タッチ/決定） ===================== */
  const DECIDE_IDS = ['btn-mode-heisei', 'btn-mode-reiwa', 'btn-to-camera', 'btn-start-shooting', 'btn-beauty-done', 'btn-confirm-yes', 'btn-finish', 'btn-ok-yes'];
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, .choice-item, .layout-item, .color-swatch');
    if (!el) return;
    const isDecide = DECIDE_IDS.some(id => el.id === id);
    playSound(isDecide ? 'seDecide' : 'seTap');
  }, true);

  /* ===================== 画面スリープ防止（Wake Lock） ===================== */
  let wakeLock = null;
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) { /* 非対応・省電力モードでは無視 */ }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && wakeLock) requestWakeLock();
  });
  document.addEventListener('click', function once() {
    requestWakeLock();
    document.removeEventListener('click', once);
  });

  /* ===================== Service Worker（オフライン対応） ===================== */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => { /* file://等では失敗するが動作に影響なし */ });
    });
  }

  // 動作検証用フック（アプリの動作には影響しない）
  window.__puriDebug = {
    buildSkinMask,
    applyBeauty,
    startAttract,
    stopAttract,
    // 実機模倣アップデート（2026-08-12）の出力系をカメラ無しで検証する:
    // ダミー4枚を撮影済み扱いにして、黄み肌トーン・16分割・たて長コラージュを生成する
    testNewOutputs() {
      const mk = (hue) => {
        const c = document.createElement('canvas');
        c.width = SHOT_W; c.height = SHOT_H;
        const x = c.getContext('2d');
        x.fillStyle = `hsl(${hue},70%,72%)`;
        x.fillRect(0, 0, SHOT_W, SHOT_H);
        x.fillStyle = '#fff';
        x.beginPath();
        x.arc(SHOT_W / 2, SHOT_H / 2, 120, 0, Math.PI * 2);
        x.fill();
        return c;
      };
      state.shots = [mk(0), mk(90), mk(180), mk(270)];
      state.processedShots = state.shots.slice();
      const y2k = mk(30);
      applyHeiseiY2kTone(y2k);
      const s16 = composeSixteenRetro();
      const story = composeStoryCollage();
      document.querySelectorAll('.debug-canvas').forEach(el => el.remove());
      [y2k, s16, story].forEach((cv, i) => {
        cv.className = 'debug-canvas';
        cv.style.cssText = `position:fixed;z-index:9999;left:${i * 33.5}vw;bottom:0;height:44vh;border:2px solid #0f0;background:#333;`;
        document.body.appendChild(cv);
      });
      return {
        s16: [s16.width, s16.height],
        story: [story.width, story.height],
        s16Len: s16.toDataURL('image/png').length,
        storyLen: story.toDataURL('image/png').length,
        y2kLen: y2k.toDataURL('image/png').length,
      };
    },
    // 実顔画像でのエンドツーエンド検証: URL→顔検出→ML肌マスク→盛り適用
    async testOnImage(url, params) {
      await Promise.all([initFaceLandmarker(), initSkinSegmenter()]);
      const img = await new Promise((resolve, reject) => {
        const im = new Image();
        im.crossOrigin = 'anonymous';
        im.onload = () => resolve(im);
        im.onerror = reject;
        im.src = url;
      });
      const src = document.createElement('canvas');
      src.width = SHOT_W; src.height = SHOT_H;
      drawCover(src.getContext('2d'), img, 0, 0, SHOT_W, SHOT_H);
      const faces = faceLandmarker ? (faceLandmarker.detect(src).faceLandmarks || null) : null;
      const mlConf = computeSkinConf(src);
      const mask = buildSkinMask(src, faces, 0, mlConf);
      const t0 = performance.now();
      state.skinConf[9] = mlConf; // idx 9 をテスト用に使用
      state.faceData[9] = faces;
      skinMaskCache.delete(9);
      const result = applyBeauty(src, faces, params || { skin: 70, eye: 40, face: 25, cheek: 40, lip: 35, filter: 'none' }, null, 9);
      const ms = Math.round(performance.now() - t0);
      // 検証用に画面へ貼る
      document.querySelectorAll('.debug-canvas').forEach(el => el.remove());
      [src, mask, result].forEach((cv, i) => {
        cv.className = 'debug-canvas';
        cv.style.cssText = `position:fixed;z-index:9999;left:${i * 33.5}vw;bottom:0;width:33vw;border:2px solid #f0f;background:#333;`;
        document.body.appendChild(cv);
      });
      // マスクのカバレッジ計測
      const mctx = mask.getContext('2d');
      const mdata = mctx.getImageData(0, 0, mask.width, mask.height).data;
      let covered = 0, total = 0;
      for (let i = 3; i < mdata.length; i += 40) { total++; if (mdata[i] > 100) covered++; }
      return { faceCount: faces ? faces.length : 0, mlConfUsed: !!mlConf, maskCoveragePct: Math.round(covered / total * 100), processingMs: ms };
    },
    // 背景くりぬきのエンドツーエンド検証: URL→人物マスク→カーテン背景合成
    async testChroma(url) {
      await initSegmenter();
      if (!imageSegmenter) return { error: 'segmenter not available' };
      const img = await new Promise((resolve, reject) => {
        const im = new Image();
        im.crossOrigin = 'anonymous';
        im.onload = () => resolve(im);
        im.onerror = reject;
        im.src = url;
      });
      const src = document.createElement('canvas');
      src.width = SHOT_W; src.height = SHOT_H;
      drawCover(src.getContext('2d'), img, 0, 0, SHOT_W, SHOT_H);
      segEMA = null;
      segProxyCtx.drawImage(src, 0, 0, SEG_W, SEG_H);
      const t0 = performance.now();
      // EMAを収束させるため3フレームぶん回す
      let maskCv = null;
      for (let f = 0; f < 3; f++) {
        const result = await segmentForVideoAsync(segProxy, performance.now());
        maskCv = buildPersonMask(result);
      }
      const ms = Math.round((performance.now() - t0) / 3);
      // renderPreviewFrame と同じ合成
      const out = document.createElement('canvas');
      out.width = SHOT_W; out.height = SHOT_H;
      const octx = out.getContext('2d');
      const person = document.createElement('canvas');
      person.width = SHOT_W; person.height = SHOT_H;
      const pctx = person.getContext('2d');
      pctx.drawImage(src, 0, 0, SHOT_W, SHOT_H);
      pctx.globalCompositeOperation = 'destination-in';
      pctx.imageSmoothingEnabled = true;
      pctx.drawImage(maskCv, 0, 0, SHOT_W, SHOT_H);
      drawCurtainBg(octx);
      octx.drawImage(person, 0, 0);
      document.querySelectorAll('.debug-canvas').forEach(el => el.remove());
      [src, maskCv, out].forEach((cv, i) => {
        const show = document.createElement('canvas');
        show.width = cv.width; show.height = cv.height;
        show.getContext('2d').drawImage(cv, 0, 0);
        show.className = 'debug-canvas';
        show.style.cssText = `position:fixed;z-index:9999;left:${i * 33.5}vw;bottom:0;width:33vw;border:2px solid #0ff;background:#333;`;
        document.body.appendChild(show);
      });
      return { multiclass: segmenterIsMulticlass, msPerFrame: ms };
    },
  };

})();
