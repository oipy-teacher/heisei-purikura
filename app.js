(() => {
  'use strict';

  /* ===================== 定数データ ===================== */
  const CURTAINS = [
    { id: 'pink',     label: 'ピンク',     color: '#ff8fc7' },
    { id: 'blue',     label: 'ブルー',     color: '#7fd1ff' },
    { id: 'yellow',   label: 'イエロー',   color: '#ffe066' },
    { id: 'purple',   label: 'パープル',   color: '#c79bff' },
    { id: 'mint',     label: 'ミント',     color: '#8de8c3' },
    { id: 'white',    label: 'ホワイト',   color: '#ffffff' },
    { id: 'lavender', label: 'ラベンダー', color: '#e0c3ff' },
    { id: 'peach',    label: 'ピーチ',     color: '#ffc9a8' },
  ];

  const FRAMES = [
    { id: 'heart',  label: 'ハート',   emoji: '💗' },
    { id: 'star',   label: 'スター',   emoji: '⭐' },
    { id: 'flower', label: 'フラワー', emoji: '🌸' },
    { id: 'ribbon', label: 'リボン',   emoji: '🎀' },
  ];

  const PEN_COLORS = ['#ff2fa0', '#ff8fc7', '#ffef5c', '#5cff8f', '#5cc8ff', '#a06bff', '#ffffff', '#000000'];

  const STAMPS = ['💖', '⭐', '✨', '🎀', '🌸', '🐰', '💫', '👑', '🍓', '🎵', '😳', '👍'];

  const TEXT_STAMPS = ['LOVE♡', '友情の証', 'また遊ぼうね', '親友', 'だいすき', 'ケバ盛れ'];

  const NUM_SHOTS = 4;
  const DECO_SECONDS = 180; // 3分（実機の落書き制限時間 約200秒に準拠）

  const SHEET_W = 680;
  const SHEET_H = 900;
  const MARGIN = 26;
  const HEADER_H = 84;
  const FOOTER_H = 40;
  const CELL_W = (SHEET_W - MARGIN * 3) / 2;
  const CELL_H = (SHEET_H - HEADER_H - FOOTER_H - MARGIN * 3) / 2;

  /* ===================== 状態 ===================== */
  const state = {
    curtain: CURTAINS[0],
    frame: FRAMES[0],
    stream: null,
    shots: [],
    penColor: PEN_COLORS[0],
    penSize: 8,
    tool: 'pen', // pen | eraser | stamp | textstamp
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

  /* ===================== ユーティリティ ===================== */
  const $ = (sel) => document.querySelector(sel);
  const screens = {};
  document.querySelectorAll('.screen').forEach(s => screens[s.id] = s);

  function showScreen(id) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[id].classList.add('active');
  }

  /* ===================== 音声アナウンス ===================== */
  const SOUND_FILES = {
    start: 'audio/01_start.mp3',
    selectCurtain: 'audio/02_select_curtain.mp3',
    selectFrame: 'audio/03_select_frame.mp3',
    shot1: 'audio/04_shot1.mp3',
    shot2: 'audio/05_shot2.mp3',
    shot3: 'audio/06_shot3.mp3',
    shot4: 'audio/07_shot4.mp3',
    decoStart: 'audio/08_deco_start.mp3',
    timeWarning: 'audio/09_time_warning.mp3',
    timeup: 'audio/10_timeup.mp3',
    finish: 'audio/11_finish.mp3',
    save: 'audio/12_save.mp3',
  };
  // 各セリフの実測秒数（AIボイスの再生と見た目のカウントダウンをおおまかに同期させるために使用）
  const SOUND_DURATION = {
    shot1: 4.2, shot2: 5.3, shot3: 5.3, shot4: 4.3,
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

  // iOS Safari 対策：最初のユーザー操作のタイミングで全音声を一度ミュート再生し、以降のタイマー発火の再生を許可させる
  function unlockAudio() {
    Object.values(sounds).forEach((a) => {
      a.muted = true;
      a.play().then(() => {
        a.pause();
        a.currentTime = 0;
        a.muted = false;
      }).catch(() => { a.muted = false; });
    });
  }

  /* ===================== 0. タイトル ===================== */
  $('#btn-insert-coin').addEventListener('click', () => {
    unlockAudio();
    playSound('start');
    showScreen('screen-select');
    playSound('selectCurtain');
    setTimeout(() => {
      if (screens['screen-select'].classList.contains('active')) playSound('selectFrame');
    }, 2700);
  });

  /* ===================== 1. 選択画面 ===================== */
  function buildChoiceGrid(container, items, colorKey, onSelect) {
    container.innerHTML = '';
    items.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'choice-item' + (i === 0 ? ' selected' : '');
      if (colorKey === 'curtain') {
        el.style.background = item.color;
        el.textContent = item.label;
        el.style.fontSize = '13px';
        el.style.color = (item.id === 'white' || item.id === 'yellow') ? '#a03cae' : '#fff';
      } else {
        el.style.background = 'linear-gradient(160deg,#fff,#ffe1f3)';
        el.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
          <span style="font-size:26px;">${item.emoji}</span>
          <span style="font-size:11px;color:#a03cae;font-weight:800;">${item.label}</span>
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

  buildChoiceGrid($('#curtain-list'), CURTAINS, 'curtain', (item) => { state.curtain = item; });
  buildChoiceGrid($('#frame-list'), FRAMES, 'frame', (item) => { state.frame = item; });

  $('#btn-to-camera').addEventListener('click', async () => {
    showScreen('screen-camera');
    await startCamera();
  });

  /* ===================== 人物くり抜き（背景をカーテン色に置換） ===================== */
  const previewCanvas = $('#preview-canvas');
  const previewCtx = previewCanvas.getContext('2d');
  const segmenterStatus = $('#segmenter-status');
  const MASK_W = 640, MASK_H = 480;
  previewCanvas.width = MASK_W;
  previewCanvas.height = MASK_H;

  let imageSegmenter = null;
  let segmenterFailed = false;
  let previewRunning = false;
  let maskWorkCanvas = null, maskWorkCtx = null;
  let personWorkCanvas = null, personWorkCtx = null;

  async function initSegmenter() {
    try {
      const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs');
      const fileset = await vision.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );
      imageSegmenter = await vision.ImageSegmenter.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        outputConfidenceMasks: true,
      });
      segmenterStatus.textContent = '✨ 人物くり抜き 準備OK！';
      setTimeout(() => segmenterStatus.classList.add('hidden'), 1500);
    } catch (err) {
      console.warn('人物くり抜きモデルの読み込みに失敗しました。通常のカメラ映像で撮影します。', err);
      segmenterFailed = true;
      segmenterStatus.textContent = '（背景くり抜きは今回お休み中）';
      setTimeout(() => segmenterStatus.classList.add('hidden'), 2500);
    }
  }
  initSegmenter();

  function segmentForVideoAsync(sourceEl, ts) {
    return new Promise((resolve) => {
      imageSegmenter.segmentForVideo(sourceEl, ts, (result) => resolve(result));
    });
  }

  // Float32の信頼度マスクから、縁をシャープにしたアルファ用キャンバスを作る
  function buildMaskCanvas(confidenceMask) {
    const w = confidenceMask.width, h = confidenceMask.height;
    if (!maskWorkCanvas) { maskWorkCanvas = document.createElement('canvas'); maskWorkCtx = maskWorkCanvas.getContext('2d'); }
    if (maskWorkCanvas.width !== w || maskWorkCanvas.height !== h) { maskWorkCanvas.width = w; maskWorkCanvas.height = h; }
    const floatData = confidenceMask.getAsFloat32Array();
    const imgData = maskWorkCtx.createImageData(w, h);
    for (let i = 0; i < floatData.length; i++) {
      let a = (floatData[i] - 0.15) / 0.7; // コントラストを強めて輪郭をシャープに
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

  // 人物を切り出してカーテン色の背景に合成し、previewCtx に描画する
  async function compositeCurtain(sourceEl) {
    if (!personWorkCanvas) { personWorkCanvas = document.createElement('canvas'); personWorkCtx = personWorkCanvas.getContext('2d'); }
    if (personWorkCanvas.width !== MASK_W || personWorkCanvas.height !== MASK_H) {
      personWorkCanvas.width = MASK_W; personWorkCanvas.height = MASK_H;
    }
    personWorkCtx.globalCompositeOperation = 'source-over';
    personWorkCtx.clearRect(0, 0, MASK_W, MASK_H);
    personWorkCtx.drawImage(sourceEl, 0, 0, MASK_W, MASK_H);

    let maskCv = null;
    if (imageSegmenter) {
      const result = await segmentForVideoAsync(sourceEl, performance.now());
      const cm = result.confidenceMasks && result.confidenceMasks[0];
      if (cm) {
        maskCv = buildMaskCanvas(cm);
        cm.close();
      }
      if (result.close) result.close();
    }

    previewCtx.clearRect(0, 0, MASK_W, MASK_H);
    if (maskCv) {
      personWorkCtx.globalCompositeOperation = 'destination-in';
      personWorkCtx.drawImage(maskCv, 0, 0, MASK_W, MASK_H);
      personWorkCtx.globalCompositeOperation = 'source-over';

      previewCtx.fillStyle = state.curtain.color;
      previewCtx.fillRect(0, 0, MASK_W, MASK_H);
      previewCtx.drawImage(personWorkCanvas, 0, 0, MASK_W, MASK_H);
      previewCanvas.classList.add('ready');
      video.classList.add('masked');
    } else {
      // セグメンター未使用時はカメラ映像そのままを描く（フォールバック）
      previewCtx.drawImage(sourceEl, 0, 0, MASK_W, MASK_H);
    }
  }

  async function previewLoop() {
    if (!previewRunning) return;
    if (video.readyState >= 2 && video.videoWidth > 0) {
      await compositeCurtain(video);
    }
    if (previewRunning) requestAnimationFrame(previewLoop);
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
    buildShotIndicator();
    $('#shots-left').textContent = NUM_SHOTS;
    btnStartShooting.disabled = false;
    btnStartShooting.style.display = 'inline-block';
    previewCanvas.classList.remove('ready');
    video.classList.remove('masked');
    if (imageSegmenter) {
      segmenterStatus.classList.add('hidden');
    } else if (segmenterFailed) {
      segmenterStatus.textContent = '（背景くり抜きは今回お休み中）';
      segmenterStatus.classList.remove('hidden');
      setTimeout(() => segmenterStatus.classList.add('hidden'), 2500);
    } else {
      segmenterStatus.textContent = '🪄 背景くり抜きを読み込み中…';
      segmenterStatus.classList.remove('hidden');
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

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function runCountdown(shotIndex) {
    const shotKey = 'shot' + (shotIndex + 1);
    playSound(shotKey);
    // セリフの長さに合わせて「3・2・1・ハイ！」の間隔を調整（AIボイスの尺と見た目をおおまかに同期）
    const totalMs = (SOUND_DURATION[shotKey] || 4.2) * 1000;
    const stepMs = Math.max(280, Math.round(totalMs / 4) - 160);
    for (const n of ['3', '2', '1', 'ハイ！']) {
      countdownEl.textContent = n;
      countdownEl.style.opacity = '1';
      countdownEl.style.transform = 'scale(1.15)';
      await sleep(80);
      countdownEl.style.transform = 'scale(1)';
      await sleep(stepMs);
      countdownEl.style.opacity = '0';
      await sleep(80);
    }
  }

  function captureFrame() {
    const c = document.createElement('canvas');
    c.width = 640; c.height = 480;
    const ctx = c.getContext('2d');
    // 鏡合わせのプレビューに合わせて左右反転して保存（すでに人物くり抜き＋カーテン合成済みのpreviewCanvasを使う）
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
    for (let i = 0; i < NUM_SHOTS; i++) {
      await runCountdown(i);
      const shot = captureFrame();
      state.shots.push(shot);
      await flash();
      shotIndicator.children[i].classList.add('done');
      $('#shots-left').textContent = Math.max(0, NUM_SHOTS - state.shots.length);
      await sleep(400);
    }
    stopCamera();
    composeSheet();
    startDecoScreen();
  });

  /* ===================== シート合成 ===================== */
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

  function composeSheet() {
    const ctx = sheetCanvas.getContext('2d');
    ctx.clearRect(0, 0, SHEET_W, SHEET_H);

    // 背景（カーテンカラー基調のグラデーション）
    const grad = ctx.createLinearGradient(0, 0, 0, SHEET_H);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.15, state.curtain.color);
    grad.addColorStop(1, '#ffffff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SHEET_W, SHEET_H);

    // タイトル
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 34px -apple-system, sans-serif';
    ctx.save();
    ctx.shadowColor = 'rgba(255,47,160,.8)';
    ctx.shadowBlur = 6;
    ctx.fillText('平成 Print Club', SHEET_W / 2, 46);
    ctx.restore();

    // 写真4枚
    state.shots.forEach((shotCanvas, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = MARGIN + col * (CELL_W + MARGIN);
      const y = HEADER_H + MARGIN + row * (CELL_H + MARGIN);

      ctx.save();
      roundRect(ctx, x - 6, y - 6, CELL_W + 12, CELL_H + 12, 14);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,.25)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();

      ctx.save();
      roundRect(ctx, x, y, CELL_W, CELL_H, 10);
      ctx.clip();
      ctx.drawImage(shotCanvas, x, y, CELL_W, CELL_H);
      ctx.restore();

      ctx.save();
      roundRect(ctx, x, y, CELL_W, CELL_H, 10);
      ctx.lineWidth = 3;
      ctx.strokeStyle = state.curtain.color === '#ffffff' ? '#ffb6de' : state.curtain.color;
      ctx.stroke();
      ctx.restore();
    });

    // フレーム装飾（角の絵文字）
    ctx.font = '30px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const corners = [
      [26, HEADER_H + 10],
      [SHEET_W - 26, HEADER_H + 10],
      [26, SHEET_H - FOOTER_H - 10],
      [SHEET_W - 26, SHEET_H - FOOTER_H - 10],
    ];
    corners.forEach(([cx, cy]) => ctx.fillText(state.frame.emoji, cx, cy));

    // フッター（日付風スタンプ）
    const d = new Date();
    const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    ctx.font = '700 14px sans-serif';
    ctx.fillStyle = '#a03cae';
    ctx.fillText(dateStr + '　Heisei Purikura-ki', SHEET_W / 2, SHEET_H - FOOTER_H / 2);
  }

  /* ===================== 3. 落書き画面 ===================== */
  const drawCanvas = $('#draw-canvas');
  drawCanvas.width = SHEET_W;
  drawCanvas.height = SHEET_H;
  const drawCtx = drawCanvas.getContext('2d');

  function buildColorRow() {
    const row = $('#color-row');
    row.innerHTML = '';
    PEN_COLORS.forEach((c, i) => {
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
  buildColorRow();

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

  function buildStampRow() {
    const row = $('#stamp-row');
    row.innerHTML = '';
    STAMPS.forEach(s => {
      const b = document.createElement('button');
      b.className = 'stamp-btn';
      b.textContent = s;
      b.addEventListener('click', () => setTool('stamp', s));
      row.appendChild(b);
    });
  }
  buildStampRow();

  function buildTextStampRow() {
    const row = $('#text-stamp-row');
    row.innerHTML = '';
    TEXT_STAMPS.forEach(s => {
      const b = document.createElement('button');
      b.className = 'text-stamp-btn';
      b.textContent = s;
      b.addEventListener('click', () => setTool('textstamp', s));
      row.appendChild(b);
    });
  }
  buildTextStampRow();

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

  drawCanvas.addEventListener('pointerdown', (e) => {
    if (state.remaining <= 0) return;
    try { drawCanvas.setPointerCapture(e.pointerId); } catch (err) { /* 一部環境では無視して続行 */ }
    const { x, y } = getCanvasPos(e);

    if (state.tool === 'stamp' && state.stampChar) {
      pushHistory();
      drawCtx.font = '48px sans-serif';
      drawCtx.textAlign = 'center';
      drawCtx.textBaseline = 'middle';
      drawCtx.fillText(state.stampChar, x, y);
      return;
    }
    if (state.tool === 'textstamp' && state.textStampStr) {
      pushHistory();
      drawCtx.save();
      drawCtx.font = '900 20px sans-serif';
      drawCtx.textAlign = 'center';
      drawCtx.textBaseline = 'middle';
      drawCtx.translate(x, y);
      drawCtx.rotate((Math.random() * 16 - 8) * Math.PI / 180);
      drawCtx.lineWidth = 4;
      drawCtx.strokeStyle = '#ffffff';
      drawCtx.strokeText(state.textStampStr, 0, 0);
      drawCtx.fillStyle = '#ff2fa0';
      drawCtx.fillText(state.textStampStr, 0, 0);
      drawCtx.restore();
      return;
    }

    // pen / eraser
    pushHistory();
    state.isDrawing = true;
    state.lastX = x; state.lastY = y;
    drawCtx.beginPath();
    drawCtx.moveTo(x, y);
  });

  drawCanvas.addEventListener('pointermove', (e) => {
    if (!state.isDrawing || state.remaining <= 0) return;
    const { x, y } = getCanvasPos(e);
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    if (state.tool === 'eraser') {
      drawCtx.globalCompositeOperation = 'destination-out';
      drawCtx.lineWidth = state.penSize * 2.2;
    } else {
      drawCtx.globalCompositeOperation = 'source-over';
      drawCtx.strokeStyle = state.penColor;
      drawCtx.lineWidth = state.penSize;
    }
    drawCtx.lineTo(x, y);
    drawCtx.stroke();
    state.lastX = x; state.lastY = y;
  });

  function endStroke() { state.isDrawing = false; }
  drawCanvas.addEventListener('pointerup', endStroke);
  drawCanvas.addEventListener('pointercancel', endStroke);
  drawCanvas.addEventListener('pointerleave', endStroke);

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

  /* ===================== タイマー ===================== */
  const timerDisplay = $('#timer-display');

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function startDecoScreen() {
    showScreen('screen-deco');
    drawCtx.clearRect(0, 0, SHEET_W, SHEET_H);
    state.history = [];
    setTool('pen');
    document.querySelectorAll('.color-swatch').forEach((s, i) => s.classList.toggle('selected', i === 0));
    state.penColor = PEN_COLORS[0];
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
    link.download = `purikura_${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}.png`;
  }

  $('#btn-restart').addEventListener('click', () => {
    if (state.timerId) clearInterval(state.timerId);
    state.shots = [];
    state.history = [];
    showScreen('screen-title');
  });

})();
