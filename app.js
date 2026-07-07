(() => {
  'use strict';

  /* ===================== モード定義 =====================
     平成モード: 2000年代のプリ機を再現。白肌・デカ目（2007年頃に代名詞化）・
                 ハデ盛り落書き・ギャル文化の文字スタンプ。
     令和モード: 現行プリ機のトレンドを再現。ナチュラル盛れ・盛れ感選択
                 （無加工風/ナチュ盛れ/プリ盛れ）・くすみカラー・シンプル志向。 */
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
      frames: [
        { id: 'heart',  label: 'ハート',   emoji: '💗' },
        { id: 'star',   label: 'スター',   emoji: '⭐' },
        { id: 'flower', label: 'フラワー', emoji: '🌸' },
        { id: 'ribbon', label: 'リボン',   emoji: '🎀' },
      ],
      penColors: ['#ff2fa0', '#ff8fc7', '#ffef5c', '#5cff8f', '#5cc8ff', '#a06bff', '#ffffff', '#000000'],
      stamps: ['💖', '⭐', '✨', '🎀', '🌸', '🐰', '💫', '👑', '🍓', '🎵', '😳', '👍'],
      textStamps: ['LOVE♡', '友情の証', 'また遊ぼうね', '親友', 'だいすき', 'ケバ盛れ', 'LOVE注入♡', 'プリ帳いき'],
      textStampStyle: { font: '900 20px sans-serif', fill: '#ff2fa0', stroke: '#ffffff', strokeWidth: 4, rotate: 8 },
      // 盛れ感プリセット（2000年代後半の「ケバ盛れ」文化を反映して強め）
      presets: [
        { id: 'usu',      label: 'うす盛れ',     skin: 25, eye: 20, face: 10, cheek: 20, lip: 15 },
        { id: 'shikkari', label: 'しっかり盛れ', skin: 55, eye: 50, face: 30, cheek: 45, lip: 40 },
        { id: 'keba',     label: 'ケバ盛れ',     skin: 85, eye: 80, face: 50, cheek: 75, lip: 65 },
      ],
      defaultPreset: 'shikkari',
      makeup: { cheek: '#ff5f8f', lip: '#ff2f6e' },
      // 平成の「美白」ブーム: 明るさ強め・彩度は下げて白肌に
      skinTone: { brightPerUnit: 0.16, desatPerUnit: 0.16 },
      // fx: bright=白スクリーン合成 / desat=グレー彩度合成 / colorize=カラー合成 / contrast=自己オーバーレイ / warm=ソフトライト
      filters: [
        { id: 'none',   label: 'なし',      fx: {} },
        { id: 'bihaku', label: '美白MAX',   fx: { bright: 0.30, desat: 0.45 } },
        { id: 'sepia',  label: 'セピア',    fx: { desat: 0.9, colorize: { color: '#a97e52', amt: 0.5 }, bright: 0.08 } },
        { id: 'vivid',  label: 'ビビッド',  fx: { contrast: 0.45, bright: 0.05 } },
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
      stamps: ['🤍', '🫶', '✨', '🌷', '🧸', '☁️', '🍓', '🥐', '📷', '🎧', '🪞', '🎀'],
      textStamps: ['#今日のプリ', '推し活', 'エモい', 'それな', 'BFF♡', 'ｼﾝﾌﾟﾙ盛れ', 'ｶﾜｲｲは正義', 'memories'],
      textStampStyle: { font: 'italic 600 18px Georgia, serif', fill: '#a8917d', stroke: null, strokeWidth: 0, rotate: 4 },
      // 盛れ感プリセット（現行機 Hyper shot の「無加工風/ナチュ盛れ/プリ盛れ」選択を再現）
      presets: [
        { id: 'mukakou', label: '無加工風',   skin: 15, eye: 5,  face: 5,  cheek: 10, lip: 10 },
        { id: 'natural', label: 'ナチュ盛れ', skin: 40, eye: 25, face: 15, cheek: 30, lip: 25 },
        { id: 'puri',    label: 'プリ盛れ',   skin: 65, eye: 45, face: 30, cheek: 55, lip: 45 },
      ],
      defaultPreset: 'natural',
      makeup: { cheek: '#e2917d', lip: '#c96a5f' },
      // 令和は血色感を残すナチュラル美肌（さらパフ肌）
      skinTone: { brightPerUnit: 0.10, desatPerUnit: 0 },
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
  const DECO_SECONDS = 180;   // 落書き3分（実機の落書き制限時間 約200秒に準拠）
  const BEAUTY_SECONDS = 60;  // 盛り調整1分（実機の盛り調整時間に準拠）

  const SHEET_W = 680;
  const SHEET_H = 900;
  const MARGIN = 26;
  const HEADER_H = 84;
  const FOOTER_H = 40;

  const SHOT_W = 640, SHOT_H = 480;

  // シートレイアウト（分割）。16分割は平成プリの定番！
  const LAYOUTS = [
    { id: 'quad',    label: '4分割',     cols: 2, rows: 2, gap: 26, radius: 10 },
    { id: 'wide2',   label: '2枚ワイド', cols: 1, rows: 2, gap: 26, radius: 12 },
    { id: 'six',     label: '6分割',     cols: 2, rows: 3, gap: 18, radius: 8 },
    { id: 'sixteen', label: '16分割',    cols: 4, rows: 4, gap: 12, radius: 6 },
  ];

  function layoutCells(layout) {
    const cells = [];
    const availW = SHEET_W - layout.gap * (layout.cols + 1);
    const availH = SHEET_H - HEADER_H - FOOTER_H - layout.gap * (layout.rows + 1);
    const cw = availW / layout.cols, ch = availH / layout.rows;
    for (let r = 0; r < layout.rows; r++) {
      for (let c = 0; c < layout.cols; c++) {
        cells.push({
          x: layout.gap + c * (cw + layout.gap),
          y: HEADER_H + layout.gap + r * (ch + layout.gap),
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
    chromaOn: false,
    stream: null,
    shots: [],           // 撮影した生の4枚
    processedShots: [],  // 盛り加工後の4枚
    faceData: [],        // 各ショットの顔ランドマーク（検出できなければ null）
    beauty: { skin: 55, eye: 50, face: 30, cheek: 45, lip: 40, filter: 'none' },
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
    textStampStr: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    history: [],
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
  };

  const sounds = {};
  Object.entries(SOUND_FILES).forEach(([key, src]) => {
    const a = new Audio(src);
    a.preload = 'auto';
    sounds[key] = a;
  });

  function playSound(key) {
    const a = sounds[key];
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => { /* 自動再生がブロックされた場合は無視 */ });
  }

  // 撮影カウントダウン用：セリフの再生が実際に終わるまで待つ（＝見た目とボイスを完全に同期させる）
  function playSoundAwait(key) {
    const a = sounds[key];
    if (!a) return Promise.resolve();
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

  function startBGM() {
    const src = modeConf().bgm;
    if (!bgmAudio.src.endsWith(src)) bgmAudio.src = src;
    bgmAudio.currentTime = 0;
    bgmAudio.play().catch(() => {});
  }
  function stopBGM() {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }

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

  /* ===================== 0. タイトル（モード選択） ===================== */
  function enterMode(mode) {
    state.mode = mode;
    document.body.dataset.mode = mode;
    const conf = modeConf();
    state.curtain = conf.curtains[0];
    state.frame = conf.frames[0];
    const preset = conf.presets.find(p => p.id === conf.defaultPreset);
    state.beauty = { skin: preset.skin, eye: preset.eye, face: preset.face, cheek: preset.cheek, lip: preset.lip, filter: 'none' };
    buildSelectGrids();
    buildDecoTools();
    unlockAudio();
    playSound('start');
    startBGM();
    showScreen('screen-select');
    playSound('selectCurtain');
    setTimeout(() => {
      if (screens['screen-select'].classList.contains('active')) playSound('selectFrame');
    }, 2700);
  }

  $('#btn-mode-heisei').addEventListener('click', () => enterMode('heisei'));
  $('#btn-mode-reiwa').addEventListener('click', () => enterMode('reiwa'));

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
    const availW = W - pad * (layout.cols + 1);
    const availH = H - pad * (layout.rows + 1);
    const cw = availW / layout.cols, ch = availH / layout.rows;
    let rects = '';
    for (let r = 0; r < layout.rows; r++) {
      for (let c = 0; c < layout.cols; c++) {
        const x = pad + c * (cw + pad), y = pad + r * (ch + pad);
        rects += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" rx="2" fill="#e3a8c9"/>`;
      }
    }
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${W}" height="${H}" rx="4" fill="#fff" stroke="#e8cede"/>${rects}</svg>`;
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

  function buildSelectGrids() {
    const conf = modeConf();
    buildLayoutList();
    buildChoiceGrid($('#curtain-list'), conf.curtains, 'curtain', (item) => { state.curtain = item; });
    buildChoiceGrid($('#frame-list'), conf.frames, 'frame', (item) => { state.frame = item; });
  }

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
  let previewRunning = false;
  let maskWorkCanvas = null, maskWorkCtx = null;
  let personWorkCanvas = null, personWorkCtx = null;

  async function initSegmenter() {
    segmenterLoading = true;
    try {
      const vision = await loadVision();
      const fileset = await loadFileset();
      imageSegmenter = await vision.ImageSegmenter.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        outputConfidenceMasks: true,
      });
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

  function buildMaskCanvas(confidenceMask) {
    const w = confidenceMask.width, h = confidenceMask.height;
    if (!maskWorkCanvas) { maskWorkCanvas = document.createElement('canvas'); maskWorkCtx = maskWorkCanvas.getContext('2d'); }
    if (maskWorkCanvas.width !== w || maskWorkCanvas.height !== h) { maskWorkCanvas.width = w; maskWorkCanvas.height = h; }
    const floatData = confidenceMask.getAsFloat32Array();
    const imgData = maskWorkCtx.createImageData(w, h);
    for (let i = 0; i < floatData.length; i++) {
      let a = (floatData[i] - 0.15) / 0.7;
      if (a < 0) a = 0; else if (a > 1) a = 1;
      const o = i * 4;
      imgData.data[o] = 255;
      imgData.data[o + 1] = 255;
      imgData.data[o + 2] = 255;
      imgData.data[o + 3] = Math.round(a * 255);
    }
    maskWorkCtx.putImageData(imgData, 0, 0);
    return maskWorkCanvas;
  }

  // ライブプレビュー1フレーム分の合成。くりぬきOFF時は素通し＋軽い美肌ライト
  async function renderPreviewFrame(sourceEl) {
    let maskCv = null;
    if (state.chromaOn && imageSegmenter) {
      const result = await segmentForVideoAsync(sourceEl, performance.now());
      const cm = result.confidenceMasks && result.confidenceMasks[0];
      if (cm) {
        maskCv = buildMaskCanvas(cm);
        cm.close();
      }
      if (result.close) result.close();
    }

    previewCtx.clearRect(0, 0, SHOT_W, SHOT_H);

    if (maskCv) {
      if (!personWorkCanvas) { personWorkCanvas = document.createElement('canvas'); personWorkCtx = personWorkCanvas.getContext('2d'); }
      if (personWorkCanvas.width !== SHOT_W || personWorkCanvas.height !== SHOT_H) {
        personWorkCanvas.width = SHOT_W; personWorkCanvas.height = SHOT_H;
      }
      personWorkCtx.globalCompositeOperation = 'source-over';
      personWorkCtx.clearRect(0, 0, SHOT_W, SHOT_H);
      personWorkCtx.drawImage(sourceEl, 0, 0, SHOT_W, SHOT_H);
      personWorkCtx.globalCompositeOperation = 'destination-in';
      personWorkCtx.drawImage(maskCv, 0, 0, SHOT_W, SHOT_H);
      personWorkCtx.globalCompositeOperation = 'source-over';

      previewCtx.fillStyle = state.curtain.color;
      previewCtx.fillRect(0, 0, SHOT_W, SHOT_H);
      previewCtx.drawImage(personWorkCanvas, 0, 0, SHOT_W, SHOT_H);
    } else {
      previewCtx.drawImage(sourceEl, 0, 0, SHOT_W, SHOT_H);
    }
    // 撮影中は常時「肌が少し明るくなる」ライト効果（実機の照明再現・Safari対応のためスクリーン合成）
    applyToneFx(previewCtx, SHOT_W, SHOT_H, { bright: 0.07 });
    previewCanvas.classList.add('ready');
    video.classList.add('masked');
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
        numFaces: 4, // プリクラは複数人で撮るので最大4人まで対応
      });
    } catch (err) {
      console.warn('顔ランドマークモデルの読み込みに失敗しました。デカ目・小顔はスキップされます。', err);
      landmarkerFailed = true;
    }
    landmarkerLoading = false;
  }

  /* ===================== 2. 撮影画面 ===================== */
  const video = $('#video');
  const flashCanvas = $('#flash-canvas');
  const countdownEl = $('#countdown-num');
  const shotIndicator = $('#shot-indicator');
  const camError = $('#cam-error');
  const btnStartShooting = $('#btn-start-shooting');

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
    skinMaskCache.clear();
    buildShotIndicator();
    $('#shots-left').textContent = NUM_SHOTS;
    btnStartShooting.disabled = false;
    btnStartShooting.style.display = 'inline-block';
    previewCanvas.classList.remove('ready');
    video.classList.remove('masked');

    // 盛り機能用の顔検出モデルを裏で読み込み開始（盛り画面までに間に合わせる）
    initFaceLandmarker();

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
      state.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
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

  async function runCountdown(shotIndex) {
    await playSoundAwait('introShot' + (shotIndex + 1));
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
    // 鏡合わせのプレビューに合わせて左右反転して保存
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(previewCanvas, 0, 0, c.width, c.height);
    return c;
  }

  async function flash() {
    flashCanvas.style.transition = 'none';
    flashCanvas.style.opacity = '0.9';
    await sleep(60);
    flashCanvas.style.transition = 'opacity .35s ease';
    flashCanvas.style.opacity = '0';
  }

  btnStartShooting.addEventListener('click', async () => {
    btnStartShooting.disabled = true;
    btnStartShooting.style.display = 'none';
    const poseGuideEl = $('#pose-guide');
    for (let i = 0; i < NUM_SHOTS; i++) {
      poseGuideEl.textContent = POSE_GUIDES[i] || 'かわいく決めてね💕';
      await runCountdown(i);
      const shot = captureFrame();
      state.shots.push(shot);
      playSound('seShutter');
      await flash();
      shotIndicator.children[i].classList.add('done');
      $('#shots-left').textContent = Math.max(0, NUM_SHOTS - state.shots.length);

      // 撮った1枚をその場でチラ見せ（実機の「今の撮れた！」感）
      previewRunning = false;
      previewCtx.save();
      previewCtx.translate(SHOT_W, 0);
      previewCtx.scale(-1, 1); // 画面表示はCSSで左右反転されるため、撮影済み画像は事前に反転して相殺
      previewCtx.drawImage(shot, 0, 0);
      previewCtx.restore();
      await sleep(900);
      if (i < NUM_SHOTS - 1) {
        previewRunning = true;
        previewLoop();
        await sleep(300);
      }
    }
    poseGuideEl.textContent = 'かわいく決めてね💕';
    stopCamera();
    startBeautyScreen();
  });

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

  // 肌マスクを生成（白=肌）。eyeS はデカ目ワープに合わせて目の除外穴を広げるために使う
  function buildSkinMask(srcCanvas, faces, eyeS) {
    const w = srcCanvas.width, h = srcCanvas.height;
    const mask = document.createElement('canvas');
    mask.width = w; mask.height = h;
    const mCtx = mask.getContext('2d', { willReadFrequently: true });

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
      // 4) 目と唇はくっきり残すため除外（デカ目ワープぶん穴を拡大）
      mCtx.save();
      mCtx.globalCompositeOperation = 'destination-out';
      mCtx.fillStyle = '#ffffff';
      const holeScale = 1.15 + (eyeS || 0) * 0.35;
      faces.forEach((lm) => {
        if (!lm || lm.length < 468) return;
        const le = lmToPx(lm[468] || lm[159], w, h);
        const re = lmToPx(lm[473] || lm[386], w, h);
        drawLandmarkPolygon(mCtx, lm, LEFT_EYE_RING, w, h, le.x, le.y, holeScale);
        drawLandmarkPolygon(mCtx, lm, RIGHT_EYE_RING, w, h, re.x, re.y, holeScale);
        const mc = lmToPx(lm[13], w, h);
        drawLandmarkPolygon(mCtx, lm, LIPS_OUTER, w, h, mc.x, mc.y, 1.1);
      });
      mCtx.restore();
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
    const canvas = buildSkinMask(srcCanvas, faces, eyeS);
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

  let healMeanR = null, healMeanG = null, healMeanB = null, healTmp = null;

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

  function healSkin(canvas, mask, skinS) {
    const w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const maskCtx = mask.getContext('2d', { willReadFrequently: true });
    const md = maskCtx.getImageData(0, 0, w, h).data;

    const n = w * h;
    if (!healMeanR || healMeanR.length !== n) {
      healMeanR = new Float32Array(n);
      healMeanG = new Float32Array(n);
      healMeanB = new Float32Array(n);
      healTmp = new Float32Array(n);
    }
    // 周囲平均（半径9px）を計算
    const chR = new Float32Array(n), chG = new Float32Array(n), chB = new Float32Array(n);
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      chR[i] = d[p]; chG[i] = d[p + 1]; chB[i] = d[p + 2];
    }
    boxBlurChannel(chR, healMeanR, healTmp, w, h, 9);
    boxBlurChannel(chG, healMeanG, healTmp, w, h, 9);
    boxBlurChannel(chB, healMeanB, healTmp, w, h, 9);

    const healAmt = skinS * 0.95;    // 暗部（シミ・シワ・ほうれい線）の引き上げ量
    const chromaAmt = skinS * 0.45;  // 色ムラ（赤み・日焼け）の均一化量
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      const a = md[p + 3] / 255;
      if (a < 0.04) continue;
      const r = d[p], g = d[p + 1], b = d[p + 2];
      const mr = healMeanR[i], mg = healMeanG[i], mb = healMeanB[i];
      const lumaP = 0.299 * r + 0.587 * g + 0.114 * b;
      const lumaM = 0.299 * mr + 0.587 * mg + 0.114 * mb;
      const diff = lumaP - lumaM;
      let nr = r, ng = g, nb = b;
      if (diff < -2) {
        // 暗部＝シミ・シワ・影 → 周囲の肌色へ引き上げ（深いほど強く、上限あり）
        const t = Math.min(1, (-diff) / 42) * healAmt * a;
        nr = r + (mr - r) * t;
        ng = g + (mg - g) * t;
        nb = b + (mb - b) * t;
      } else {
        // 明部はわずかに整えるだけ（ハイライト・立体感を維持）
        const t = Math.min(1, diff / 70) * skinS * 0.12 * a;
        nr = r + (mr - r) * t;
        ng = g + (mg - g) * t;
        nb = b + (mb - b) * t;
      }
      // 色ムラ補正：明るさは保ち、色味だけ周囲平均へ寄せる（赤み・日焼けムラ）
      const ca = chromaAmt * a;
      if (ca > 0.01) {
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

  let skinLayerCanvas = null, skinLayerCtx = null;
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
  function applyBeauty(srcCanvas, faces, params, preWarped, shotIdx) {
    const conf = modeConf();
    const w = srcCanvas.width, h = srcCanvas.height;
    const eyeS = params.eye / 100;
    const work = preWarped || warpShot(srcCanvas, faces, eyeS, params.face / 100);

    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const outCtx = out.getContext('2d');
    outCtx.drawImage(work, 0, 0);

    const skinS = params.skin / 100;
    if (skinS > 0) {
      const tone = conf.skinTone;
      const mask = getSkinMask(shotIdx == null ? -1 : shotIdx, srcCanvas, faces, eyeS);
      const useMask = mask && !maskIsEmpty(mask);

      if (useMask) {
        /* --- 肌ピンポイント処理 ---
           1) ヒーリング（シミ・シワ・ほうれい線・クマ・色ムラを周囲の肌へ均す）
           2) 平滑化（陶器肌）
           3) 美白（白スクリーン＋彩度調整） */
        healSkin(out, mask, skinS);

        const layerCtx = getSkinLayer(w, h);
        const blurred = makeBlurred(out, 2 + skinS * 2.5);

        // なめらか肌: ぼかしをマスク越しに重ねる（ヒーリング済みの肌をさらに滑らかに）
        layerCtx.globalCompositeOperation = 'source-over';
        layerCtx.clearRect(0, 0, w, h);
        layerCtx.imageSmoothingEnabled = true;
        layerCtx.drawImage(blurred, 0, 0, w, h);
        layerCtx.globalCompositeOperation = 'destination-in';
        layerCtx.drawImage(mask, 0, 0);
        layerCtx.globalCompositeOperation = 'source-over';
        outCtx.globalAlpha = skinS * 0.55;
        outCtx.drawImage(skinLayerCanvas, 0, 0);
        outCtx.globalAlpha = 1;

        // 美白: 白をマスク越しにスクリーン合成（肌だけ白く）
        layerCtx.clearRect(0, 0, w, h);
        layerCtx.fillStyle = '#ffffff';
        layerCtx.fillRect(0, 0, w, h);
        layerCtx.globalCompositeOperation = 'destination-in';
        layerCtx.drawImage(mask, 0, 0);
        layerCtx.globalCompositeOperation = 'source-over';
        outCtx.globalCompositeOperation = 'screen';
        outCtx.globalAlpha = Math.min(1, skinS * tone.brightPerUnit * 2.2);
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
          outCtx.globalAlpha = Math.min(1, skinS * tone.desatPerUnit * 1.6);
          outCtx.drawImage(skinLayerCanvas, 0, 0);
          outCtx.globalCompositeOperation = 'source-over';
          outCtx.globalAlpha = 1;
        }
      } else {
        // フォールバック（顔も肌色も見つからない場合）: 従来の全体ソフトフォーカス
        const blurred = makeBlurred(work, 1.5 + skinS * 2.5);
        outCtx.save();
        outCtx.globalAlpha = skinS * 0.5;
        outCtx.imageSmoothingEnabled = true;
        outCtx.drawImage(blurred, 0, 0, w, h);
        outCtx.restore();
        applyToneFx(outCtx, w, h, {
          bright: skinS * tone.brightPerUnit,
          desat: skinS * tone.desatPerUnit,
        });
      }
    }

    // チーク＆リップ（顔ランドマークベースのメイク）
    const cheekS = (params.cheek || 0) / 100;
    const lipS = (params.lip || 0) / 100;
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

    // 選択フィルター
    const selFilter = conf.filters.find(f => f.id === params.filter);
    if (selFilter && selFilter.fx && Object.keys(selFilter.fx).length) {
      applyToneFx(outCtx, w, h, selFilter.fx);
    }
    return out;
  }

  /* ===================== 2.5 盛り調整画面 ===================== */
  const beautyCanvas = $('#beauty-canvas');
  beautyCanvas.width = SHOT_W;
  beautyCanvas.height = SHOT_H;
  const beautyCtx = beautyCanvas.getContext('2d');
  const beautyTimerDisplay = $('#beauty-timer-display');
  const beautyFaceNote = $('#beauty-face-note');

  const sliderSkin = $('#slider-skin');
  const sliderEye = $('#slider-eye');
  const sliderFace = $('#slider-face');
  const sliderCheek = $('#slider-cheek');
  const sliderLip = $('#slider-lip');

  let beautyRenderQueued = false;

  function queueBeautyRender() {
    if (beautyRenderQueued) return;
    beautyRenderQueued = true;
    requestAnimationFrame(() => {
      beautyRenderQueued = false;
      renderBeautyPreview();
    });
  }

  // デカ目/小顔のワープ結果をキャッシュ（美肌・フィルターのみの変更時はワープ再計算を省いて即応答）
  const warpCache = { idx: -1, eye: -1, face: -1, facesRef: null, canvas: null };

  function renderBeautyPreview() {
    const idx = state.beautySelected;
    const src = state.shots[idx];
    if (!src) return;
    const faces = state.faceData[idx];
    if (warpCache.idx !== idx || warpCache.eye !== state.beauty.eye || warpCache.face !== state.beauty.face || warpCache.facesRef !== faces) {
      warpCache.canvas = warpShot(src, faces, state.beauty.eye / 100, state.beauty.face / 100);
      warpCache.idx = idx;
      warpCache.eye = state.beauty.eye;
      warpCache.face = state.beauty.face;
      warpCache.facesRef = faces;
    }
    const result = applyBeauty(src, faces, state.beauty, warpCache.canvas, idx);
    beautyCtx.clearRect(0, 0, SHOT_W, SHOT_H);
    beautyCtx.drawImage(result, 0, 0);
  }

  function syncSliders() {
    sliderSkin.value = state.beauty.skin;
    sliderEye.value = state.beauty.eye;
    sliderFace.value = state.beauty.face;
    sliderCheek.value = state.beauty.cheek || 0;
    sliderLip.value = state.beauty.lip || 0;
    $('#val-skin').textContent = state.beauty.skin;
    $('#val-eye').textContent = state.beauty.eye;
    $('#val-face').textContent = state.beauty.face;
    $('#val-cheek').textContent = state.beauty.cheek || 0;
    $('#val-lip').textContent = state.beauty.lip || 0;
  }

  function markPresetActive(presetId) {
    document.querySelectorAll('#beauty-preset-row .preset-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.preset === presetId);
    });
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
        state.beauty.skin = p.skin;
        state.beauty.eye = p.eye;
        state.beauty.face = p.face;
        state.beauty.cheek = p.cheek;
        state.beauty.lip = p.lip;
        syncSliders();
        markPresetActive(p.id);
        queueBeautyRender();
      });
      presetRow.appendChild(b);
    });
    // フィルター
    const filterRow = $('#filter-row');
    filterRow.innerHTML = '';
    conf.filters.forEach(f => {
      const b = document.createElement('button');
      b.className = 'preset-btn' + (f.id === state.beauty.filter ? ' active' : '');
      b.dataset.filter = f.id;
      b.textContent = f.label;
      b.addEventListener('click', () => {
        state.beauty.filter = f.id;
        filterRow.querySelectorAll('.preset-btn').forEach(x => x.classList.toggle('active', x.dataset.filter === f.id));
        queueBeautyRender();
      });
      filterRow.appendChild(b);
    });
    // ショット切り替えタブ
    const tabs = $('#beauty-shot-tabs');
    tabs.innerHTML = '';
    for (let i = 0; i < NUM_SHOTS; i++) {
      const b = document.createElement('button');
      b.className = 'beauty-shot-tab' + (i === 0 ? ' active' : '');
      b.textContent = String(i + 1);
      b.addEventListener('click', () => {
        state.beautySelected = i;
        tabs.querySelectorAll('.beauty-shot-tab').forEach((t, ti) => t.classList.toggle('active', ti === i));
        queueBeautyRender();
      });
      tabs.appendChild(b);
    }
  }

  [[sliderSkin, 'skin'], [sliderEye, 'eye'], [sliderFace, 'face'], [sliderCheek, 'cheek'], [sliderLip, 'lip']].forEach(([el, key]) => {
    el.addEventListener('input', () => {
      state.beauty[key] = Number(el.value);
      $('#val-' + key).textContent = el.value;
      markPresetActive(''); // 手動調整したらプリセット選択を解除
      queueBeautyRender();
    });
  });

  async function detectFacesForShots() {
    await initFaceLandmarker();
    if (!faceLandmarker) {
      beautyFaceNote.textContent = '顔検出が使えないため、美肌とフィルターのみ反映されます';
      beautyFaceNote.classList.remove('hidden');
      return;
    }
    let anyFace = false;
    for (let i = 0; i < state.shots.length; i++) {
      try {
        const res = faceLandmarker.detect(state.shots[i]);
        state.faceData[i] = (res.faceLandmarks && res.faceLandmarks.length) ? res.faceLandmarks : null;
        if (state.faceData[i]) anyFace = true;
      } catch (err) {
        state.faceData[i] = null;
      }
    }
    if (!anyFace) {
      beautyFaceNote.textContent = '顔が見つからなかったよ…美肌とフィルターだけ反映されます';
      beautyFaceNote.classList.remove('hidden');
    } else {
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
    beautyFaceNote.textContent = '👀 顔を検出中…';
    beautyFaceNote.classList.remove('hidden');
    buildBeautyControls();
    syncSliders();
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
    // 全ショットに現在のパラメータを適用
    state.processedShots = state.shots.map((shot, i) => applyBeauty(shot, state.faceData[i], state.beauty, null, i));
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

  // アスペクト比を保ったままセルいっぱいに描画（中央クロップ）
  function drawCover(ctx, img, x, y, w, h) {
    const sw = img.width, sh = img.height;
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
    cells.forEach((cell, i) => {
      const shotCanvas = shots[i % shots.length];
      if (!shotCanvas) return;
      const { x, y, w: cw, h: chh } = cell;

      ctx.save();
      roundRect(ctx, x - pad, y - pad, cw + pad * 2, chh + pad * 2, radius + 4);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,.22)';
      ctx.shadowBlur = state.mode === 'reiwa' ? 5 : 8;
      ctx.fill();
      ctx.restore();

      ctx.save();
      roundRect(ctx, x, y, cw, chh, radius);
      ctx.clip();
      drawCover(ctx, shotCanvas, x, y, cw, chh);
      ctx.restore();

      ctx.save();
      roundRect(ctx, x, y, cw, chh, radius);
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
      ctx.font = '30px sans-serif';
      const corners = [
        [26, HEADER_H + 10],
        [SHEET_W - 26, HEADER_H + 10],
        [26, SHEET_H - FOOTER_H - 10],
        [SHEET_W - 26, SHEET_H - FOOTER_H - 10],
      ];
      corners.forEach(([cx, cy]) => ctx.fillText(state.frame.emoji, cx, cy));
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

  /* ===================== 3. 落書き画面 ===================== */
  const drawCanvas = $('#draw-canvas');
  drawCanvas.width = SHEET_W;
  drawCanvas.height = SHEET_H;
  const drawCtx = drawCanvas.getContext('2d');
  // ストローク描画中のプレビュー用レイヤー（白フチ・ネオンのつなぎ目を出さないため、
  // 描画中は毎フレーム線全体を描き直し、指を離した時に本レイヤーへ合成する）
  const strokeCanvas = $('#stroke-canvas');
  strokeCanvas.width = SHEET_W;
  strokeCanvas.height = SHEET_H;
  const strokeCtx = strokeCanvas.getContext('2d');

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
    conf.stamps.forEach(s => {
      const b = document.createElement('button');
      b.className = 'stamp-btn';
      b.textContent = s;
      b.addEventListener('click', () => setTool('stamp', s));
      row.appendChild(b);
    });
  }

  function buildTextStampRow() {
    const conf = modeConf();
    const row = $('#text-stamp-row');
    row.innerHTML = '';
    conf.textStamps.forEach(s => {
      const b = document.createElement('button');
      b.className = 'text-stamp-btn';
      b.textContent = s;
      b.addEventListener('click', () => setTool('textstamp', s));
      row.appendChild(b);
    });
  }

  function buildDecoTools() {
    buildColorRow();
    buildStampRow();
    buildTextStampRow();
    state.penColor = modeConf().penColors[0];
  }
  buildDecoTools();

  $('#pen-size').addEventListener('input', (e) => { state.penSize = Number(e.target.value); });

  function setTool(tool, extra) {
    state.tool = tool;
    state.stampChar = tool === 'stamp' ? extra : null;
    state.textStampStr = tool === 'textstamp' ? extra : null;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    if (tool === 'pen') $('.tool-btn[data-mode="pen"]').classList.add('active');
    if (tool === 'eraser') $('.tool-btn[data-mode="eraser"]').classList.add('active');
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

  function pushHistory() {
    state.history.push(drawCanvas.toDataURL());
    if (state.history.length > 25) state.history.shift();
  }

  function undo() {
    if (!state.history.length) return;
    const last = state.history.pop();
    const img = new Image();
    img.onload = () => {
      drawCtx.clearRect(0, 0, SHEET_W, SHEET_H);
      drawCtx.drawImage(img, 0, 0);
    };
    img.src = last;
  }

  /* --- ペン種別ごとのストローク描画 --- */
  const SPARKLE_CHARS = ['✨', '⭐', '💫', '✦'];
  let strokePts = [];
  let lastSparkleX = 0, lastSparkleY = 0;

  function drawStrokePolyline(ctx, pts, type, color, size) {
    if (pts.length < 2) {
      // 1点だけならドットを打つ
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
      // 白フチ: 太い白 → 上に色
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size + 7;
      path(); ctx.stroke();
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      path(); ctx.stroke();
    } else if (type === 'neon') {
      // ネオン: 色のグロー + 白コア
      ctx.shadowColor = color;
      ctx.shadowBlur = Math.max(8, size * 1.8);
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      path(); ctx.stroke();
      path(); ctx.stroke(); // 2度描きでグローを濃く
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

  function stampSparkle(x, y) {
    const size = state.penSize * (1.6 + Math.random() * 1.6);
    drawCtx.save();
    drawCtx.font = `${Math.round(size + 10)}px sans-serif`;
    drawCtx.textAlign = 'center';
    drawCtx.textBaseline = 'middle';
    drawCtx.translate(x + (Math.random() * 8 - 4), y + (Math.random() * 8 - 4));
    drawCtx.rotate(Math.random() * Math.PI * 2);
    drawCtx.fillText(SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)], 0, 0);
    drawCtx.restore();
  }

  drawCanvas.addEventListener('pointerdown', (e) => {
    if (state.remaining <= 0) return;
    try { drawCanvas.setPointerCapture(e.pointerId); } catch (err) { /* 一部環境では無視して続行 */ }
    const { x, y } = getCanvasPos(e);

    if (state.tool === 'stamp' && state.stampChar) {
      pushHistory();
      drawCtx.font = `${state.stampSize}px sans-serif`;
      drawCtx.textAlign = 'center';
      drawCtx.textBaseline = 'middle';
      drawCtx.fillText(state.stampChar, x, y);
      return;
    }
    if (state.tool === 'textstamp' && state.textStampStr) {
      pushHistory();
      const style = modeConf().textStampStyle;
      const sizeScale = state.stampSize / 48;
      drawCtx.save();
      drawCtx.font = style.font.replace(/(\d+)px/, (m, n) => Math.round(Number(n) * sizeScale) + 'px');
      drawCtx.textAlign = 'center';
      drawCtx.textBaseline = 'middle';
      drawCtx.translate(x, y);
      drawCtx.rotate((Math.random() * style.rotate * 2 - style.rotate) * Math.PI / 180);
      if (style.stroke) {
        drawCtx.lineWidth = style.strokeWidth * sizeScale;
        drawCtx.strokeStyle = style.stroke;
        drawCtx.strokeText(state.textStampStr, 0, 0);
      }
      drawCtx.fillStyle = style.fill;
      drawCtx.fillText(state.textStampStr, 0, 0);
      drawCtx.restore();
      return;
    }

    // pen / eraser
    pushHistory();
    state.isDrawing = true;
    state.lastX = x; state.lastY = y;

    if (state.tool === 'eraser') {
      drawCtx.beginPath();
      drawCtx.moveTo(x, y);
      return;
    }
    if (state.penType === 'kira') {
      lastSparkleX = x; lastSparkleY = y;
      stampSparkle(x, y);
      return;
    }
    // 通常/ネオン/白フチ: ストロークレイヤーでプレビュー
    strokePts = [{ x, y }];
    drawStrokePolyline(strokeCtx, strokePts, state.penType, state.penColor, state.penSize);
  });

  drawCanvas.addEventListener('pointermove', (e) => {
    if (!state.isDrawing || state.remaining <= 0) return;
    const { x, y } = getCanvasPos(e);

    if (state.tool === 'eraser') {
      drawCtx.save();
      drawCtx.lineCap = 'round';
      drawCtx.lineJoin = 'round';
      drawCtx.globalCompositeOperation = 'destination-out';
      drawCtx.lineWidth = state.penSize * 2.2;
      drawCtx.lineTo(x, y);
      drawCtx.stroke();
      drawCtx.restore();
      drawCtx.globalCompositeOperation = 'source-over';
      state.lastX = x; state.lastY = y;
      return;
    }
    if (state.penType === 'kira') {
      const dx = x - lastSparkleX, dy = y - lastSparkleY;
      if (dx * dx + dy * dy > (state.penSize * 2.4) ** 2) {
        stampSparkle(x, y);
        lastSparkleX = x; lastSparkleY = y;
      }
      state.lastX = x; state.lastY = y;
      return;
    }
    strokePts.push({ x, y });
    strokeCtx.clearRect(0, 0, SHEET_W, SHEET_H);
    drawStrokePolyline(strokeCtx, strokePts, state.penType, state.penColor, state.penSize);
    state.lastX = x; state.lastY = y;
  });

  function endStroke() {
    if (!state.isDrawing) return;
    state.isDrawing = false;
    if (state.tool === 'eraser' || state.penType === 'kira') return;
    // ストロークを本レイヤーへ確定
    if (strokePts.length) {
      drawCtx.drawImage(strokeCanvas, 0, 0);
      strokeCtx.clearRect(0, 0, SHEET_W, SHEET_H);
      strokePts = [];
    }
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
    pushHistory();
    drawCtx.clearRect(0, 0, SHEET_W, SHEET_H);
  });

  /* ===================== できあがり確認 ===================== */
  const confirmModal = $('#confirm-modal');

  $('#btn-finish').addEventListener('click', () => {
    if (state.remaining <= 0) return;
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

  function startDecoScreen() {
    showScreen('screen-deco');
    drawCtx.clearRect(0, 0, SHEET_W, SHEET_H);
    state.history = [];
    buildDecoTools();
    setTool('pen');
    state.remaining = DECO_SECONDS;
    state.warningPlayed = false;
    $('#deco-timeup').classList.add('hidden');
    $('#confirm-modal').classList.add('hidden');
    drawCanvas.style.pointerEvents = 'auto';
    timerDisplay.textContent = formatTime(state.remaining);
    timerDisplay.classList.remove('warn');
    playSound('decoStart');

    if (state.timerId) clearInterval(state.timerId);
    state.timerId = setInterval(() => {
      state.remaining--;
      timerDisplay.textContent = formatTime(Math.max(0, state.remaining));
      if (state.remaining <= 10) {
        timerDisplay.classList.add('warn');
        if (!state.warningPlayed) {
          state.warningPlayed = true;
          playSound('timeWarning');
        }
      }
      if (state.remaining <= 0) {
        clearInterval(state.timerId);
        finishDeco('timeup');
      }
    }, 1000);
  }

  async function finishDeco(reason) {
    drawCanvas.style.pointerEvents = 'none';
    $('#deco-timeup-text').textContent = reason === 'manual' ? '✨ できあがり！' : '⏰ タイムアップ！';
    $('#deco-timeup').classList.remove('hidden');
    playSound(reason === 'manual' ? 'finish' : 'timeup');
    await sleep(1300);
    $('#deco-timeup').classList.add('hidden');
    composeFinal();
    showScreen('screen-print');
    playSound('save');
  }

  /* ===================== 4. プリント画面 ===================== */
  const finalCanvas = $('#final-canvas');
  finalCanvas.width = SHEET_W;
  finalCanvas.height = SHEET_H;

  function composeFinal() {
    const ctx = finalCanvas.getContext('2d');
    ctx.clearRect(0, 0, SHEET_W, SHEET_H);
    ctx.drawImage(sheetCanvas, 0, 0);
    ctx.drawImage(drawCanvas, 0, 0);
    const dataUrl = finalCanvas.toDataURL('image/png');
    const link = $('#btn-download');
    link.href = dataUrl;
    const d = new Date();
    link.download = `purikura_${state.mode}_${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}.png`;
  }

  $('#btn-restart').addEventListener('click', () => {
    if (state.timerId) clearInterval(state.timerId);
    if (state.beautyTimerId) clearInterval(state.beautyTimerId);
    state.shots = [];
    state.processedShots = [];
    state.faceData = [];
    state.history = [];
    stopBGM();
    showScreen('screen-title');
  });

  /* ===================== 効果音（タッチ/決定） ===================== */
  const DECIDE_IDS = ['btn-mode-heisei', 'btn-mode-reiwa', 'btn-to-camera', 'btn-start-shooting', 'btn-beauty-done', 'btn-confirm-yes', 'btn-finish'];
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
  window.__puriDebug = { buildSkinMask, applyBeauty };

})();
