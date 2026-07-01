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
  };

  /* ===================== ユーティリティ ===================== */
  const $ = (sel) => document.querySelector(sel);
  const screens = {};
  document.querySelectorAll('.screen').forEach(s => screens[s.id] = s);

  function showScreen(id) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[id].classList.add('active');
  }

  /* ===================== 0. タイトル ===================== */
  $('#btn-insert-coin').addEventListener('click', () => {
    showScreen('screen-select');
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
    try {
      state.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      video.srcObject = state.stream;
    } catch (err) {
      camError.textContent = 'カメラを起動できませんでした。ブラウザのカメラ許可設定をご確認ください。(' + err.message + ')';
    }
  }

  function stopCamera() {
    if (state.stream) {
      state.stream.getTracks().forEach(t => t.stop());
      state.stream = null;
    }
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function runCountdown() {
    for (const n of ['3', '2', '1', 'ハイ！']) {
      countdownEl.textContent = n;
      countdownEl.style.opacity = '1';
      countdownEl.style.transform = 'scale(1.15)';
      await sleep(80);
      countdownEl.style.transform = 'scale(1)';
      await sleep(600);
      countdownEl.style.opacity = '0';
      await sleep(80);
    }
  }

  function captureFrame() {
    const c = document.createElement('canvas');
    c.width = 640; c.height = 480;
    const ctx = c.getContext('2d');
    // 鏡合わせのプレビューに合わせて左右反転して保存
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, c.width, c.height);
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
      await runCountdown();
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
    $('#deco-timeup').classList.add('hidden');
    drawCanvas.style.pointerEvents = 'auto';
    timerDisplay.textContent = formatTime(state.remaining);
    timerDisplay.classList.remove('warn');

    if (state.timerId) clearInterval(state.timerId);
    state.timerId = setInterval(() => {
      state.remaining--;
      timerDisplay.textContent = formatTime(Math.max(0, state.remaining));
      if (state.remaining <= 10) timerDisplay.classList.add('warn');
      if (state.remaining <= 0) {
        clearInterval(state.timerId);
        finishDeco();
      }
    }, 1000);
  }

  async function finishDeco() {
    drawCanvas.style.pointerEvents = 'none';
    $('#deco-timeup').classList.remove('hidden');
    await sleep(1300);
    $('#deco-timeup').classList.add('hidden');
    composeFinal();
    showScreen('screen-print');
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
