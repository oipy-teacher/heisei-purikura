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
      // （國學院大學ビジネスケース doi:10.57529/0002000384。JAIA20年史には記載なし・2026-08-13 検見の裏付け検証で出典訂正）。
      // フレーム選択が主役、という考証に基づき9種そろえる
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
      /* ペン12色（2026-08-13 考証回帰・era-designer乖離監査B-1の置き換え案）:
         当時「色を選ぶ」道具はペンで、ペン色切替は実機に確実にあった（花鳥風月2003はツール2000種以上）。
         文字スタンプの色パレット撤去の代わりに、当時のポスカ/カラーペン文化に寄せたビビッド系で8→12色 */
      penColors: ['#ff2fa0', '#ff8fc7', '#ff3b30', '#ff8a2a', '#ffef5c', '#5cff8f', '#00b389', '#5cc8ff', '#2a5bff', '#a06bff', '#ffffff', '#000000'],
      penTypes: ['normal'],
      /* 落書きの考証（2026-08-12 改訂・era-designerリサーチ準拠）:
         本機の平成モードはユーロビートBGM＝1999〜2003年ごろの再現。この時代は落書き全盛期で、
         スタンプには「意味不明なキャラ・笑えるスタンプ」のふざけ・ネタ枠が必ずあった
         （4Gamer再現体験記。JAIA20年史には記載なし・2026-08-13 検見の裏付け検証で出典訂正）。
         プリ帳文化の定番文言「我等友情永久不滅成」もこの時代のもの。 */
      stamps: ['💀', '👽', '🔥', '⚡', '💩', '🐯', '👊', '💋', '🌟', '🍜', '📟', '🎤'],
      /* 2026-08-17 追加（柄本仕様書 C-2・JKモニター要望②「平成っぽいスタンプが欲しい」）:
         星/キラ・ピースマーク・ドット/ボーダーは平成プリの頻出モチーフ（ROOMIE 2019ほか・確度=中）。
         2000〜2004年は各社が落書きのアイテム数を拡大した時期（JAIA20年史・確度=強）なので、
         数を増やす方向そのものが当時の実機の動きに合っている。
         水玉とボーダーは "なぞる（コロコロ）" と柄の帯になる駒＝「余白を柄で埋める」当時の落書きの再現。
         令和の drawnStamps には足さない（平成専用）。並びは既存4種→新4種で、先頭は動かさない */
      drawnStamps: ['dateRetro', 'sparkleLine', 'heartChalk', 'bubble', 'star4', 'peaceMark', 'dotsPop', 'stripePop'], // 日付焼き込みは時代考証的にもドンピシャ
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
        /* 2026-08-17 追加（柄本仕様書 C-2-3）: プリ帳の当て字文化。
           「仲仔」「2娘1」はROOMIE(2019)とギャルチャーの2本で一致（確度=中）、
           「心友」はギャルチャー、「愛羅武勇」はROOMIE（各1本・確度=中）。
           「ギザかわゆス」(2006年)・「〜なう」(2010年代)は時代がずれるので入れない */
        { t: '2娘1', style: 'sticker', color: '#ff2fa0' },
        { t: '一生仲仔♡', style: 'sticker', color: '#a06bff' },
        { t: '心友', style: 'sticker', color: '#5cc8ff' },
        { t: '愛羅武勇', style: 'sticker', color: '#ff3b30' },
      ],
      textStampStyle: { font: '900 20px sans-serif', fill: '#ff2fa0', stroke: '#ffffff', strokeWidth: 4, rotate: 8 },
      /* 盛れ感プリセット（presets/defaultPreset/makeup）は平成には定義しない（2026-08-13 掃除）:
         平成は盛り調整画面をスキップする（2026-07-19 撤去はオーナーの設計判断）。
         デカ目80などの死に設定が書いてあると将来の混入事故の芽になるため削除した
         （era-designer乖離監査の豆指摘）。実際の写りは finishHeiseiProcessing の固定値が担う */
      // 平成の「美白」ブーム: 明るさ強め・彩度は少し下げて白肌に
      // （2026-08-12 desat 0.16→0.10: 彩度を落としすぎると血色が消えて灰色に見えるため）
      skinTone: { brightPerUnit: 0.16, desatPerUnit: 0.10 },
      /* fx: bright=中間調リフト（白ソフトライト・黒白の点は固定＝曇らない） / desat=グレー彩度合成 /
         colorize=カラー合成 / contrast=自己オーバーレイ / warm=ソフトライト
         2026-08-12 再設計: 美白MAXは「白モヤ」でなく「明るく・血色を残して・霞まない」。
         明度は bright（中間調のみ上がる）、白肌感は控えめの desat、締まりは contrast で出す */
      filters: [
        { id: 'none',   label: 'なし',      fx: {} },
        { id: 'bihaku', label: '美白MAX',   fx: { bright: 0.85, desat: 0.20, contrast: 0.10 } },
        { id: 'ganguro', label: '日やけギャル', fx: { tan: { color: '#c9926a', amt: 0.5 }, contrast: 0.15, warm: { color: '#d98a4a', amt: 0.2 } } },
        { id: 'retro',  label: 'レトロ',    fx: { desat: 0.3, warm: { color: '#d9a06a', amt: 0.28 }, bright: 0.14, contrast: 0.12 } },
        { id: 'sepia',  label: 'セピア',    fx: { desat: 0.9, colorize: { color: '#a97e52', amt: 0.5 }, bright: 0.18 } },
        { id: 'vivid',  label: 'ビビッド',  fx: { contrast: 0.45, bright: 0.12 } },
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
      /* ペンの色の系統（2026-08-17 JKモニター指摘④「落書きのペンの色がくすみ過ぎる」）。
         くすみカラーは令和様式の柱（柄本仕様書）なので**既定のまま残す**。
         そのうえで、実際に描く客が発色を選べるように系統を足す。
         様式は「最初に目に入るもの」で保たれる＝開いた時はくすみ、が守れていればよい。 */
      penPalettes: [
        { id: 'kusumi', label: 'くすみ', colors: ['#b98a8a', '#8a9b8a', '#c0b283', '#8a9bb0', '#7d6b7d', '#e6ccb3', '#ffffff', '#3d3733'] },
        { id: 'vivid', label: 'ビビッド', colors: ['#ff2e88', '#ff3b30', '#ff8a00', '#ffe100', '#22c55e', '#00c2c7', '#2563eb', '#8b2fd6', '#ffffff', '#111111'] },
        { id: 'pastel', label: 'パステル', colors: ['#ffb3d1', '#ffc9a8', '#ffe9a8', '#bdf0c4', '#a8e6ef', '#bcc8ff', '#e0b8ff', '#ffffff'] },
      ],
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
        { id: 'mukakou', label: '無加工風',   skin: 20, white: 0,  clear: 15, eye: 5,  face: 5,  nose: 5,  cheek: 10, lip: 10 },
        { id: 'natural', label: 'ナチュ盛れ', skin: 45, white: 10, clear: 40, eye: 25, face: 15, nose: 20, cheek: 30, lip: 25 },
        /* 小鼻 35→22（2026-08-14 モニター指摘「プリ盛れにすると鼻が無くなりすぎる」）。
           warp側の範囲・移動量も絞ったので、ここは「小さくなったと分かる」最小限に留める */
        { id: 'puri',    label: 'プリ盛れ',   skin: 70, white: 25, clear: 60, eye: 45, face: 30, nose: 22, cheek: 55, lip: 45 },
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
        { id: 'film',   label: 'フィルム', fx: { desat: 0.25, warm: { color: '#d9a06a', amt: 0.20 }, bright: 0.14 } },
        { id: 'kusumi', label: 'くすみ',   fx: { desat: 0.35, bright: 0.18, contrast: 0.06 } },
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
  /* 2026-08-13 オーナー裁定（実機ユーザーテスト）: 「盛り2分、落書き3分とかで◎」
     令和の落書きも3分に短縮（600→180）。平成は従来どおり3分。 */
  const DECO_SECONDS_BY_MODE = { heisei: 180, reiwa: 180 };
  const DECO_SECONDS = DECO_SECONDS_BY_MODE.heisei; // 既定値（後方互換）
  const decoSeconds = () => DECO_SECONDS_BY_MODE[state.mode] ?? DECO_SECONDS;

  const BEAUTY_SECONDS = 120; // 盛り調整2分（2026-08-13 オーナー裁定: 1分では足りない）

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

  /* 撮影ポーズガイド（実機の「次は◯◯で！」を再現）。
     2026-08-15（柄本 C-8）: 平成と令和で別に持つ。「おちゃめなポーズいっちゃお！」は
     完全に平成の号令調で、令和は絵文字をCSSで消すところまで作り込んであるのに、
     撮影中いちばん目に入るこの吹き出しだけ平成語のままだった。 */
  const POSE_GUIDES_BY_MODE = {
    heisei: [
      'まずはにっこり笑顔で💕',
      'つぎはアップでかわいく！',
      'おちゃめなポーズいっちゃお！',
      'ラストはさいこうの決めポーズ！',
    ],
    reiwa: [
      'まずは 自然に',
      'つぎは 顔ちかめで',
      'すこし ふざけてみる？',
      'ラスト！ きめて',
    ],
  };
  const poseGuides = () => POSE_GUIDES_BY_MODE[state.mode === 'heisei' ? 'heisei' : 'reiwa'];
  const poseGuideIdle = () => (state.mode === 'heisei' ? 'かわいく決めてね💕' : 'いい感じに どうぞ');

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
    photoPick: null,     // シールに載せる写真の並び（shotsのインデックス列・2026-08-13新設）。nullなら撮影順
    photoFit: 'face',    // セルへのおさまり方（令和のみ選択可・2026-08-17）。face | center | contain
    faceData: [],        // 各ショットの顔ランドマーク（検出できなければ null）
    skinConf: [],        // 各ショットのML肌信頼度マスク（selfie_multiclass。無ければ null）
    beauty: { skin: 60, white: 40, clear: 40, eye: 50, face: 30, nose: 0, cheek: 45, lip: 40, eyeType: 1, namida: 0, legs: 0, filter: 'none' },
    beautySelected: 0,
    beautyTimerId: null,
    beautyRemaining: BEAUTY_SECONDS,
    beautyWarned: false,
    penColor: MODES.heisei.penColors[0],
    penSize: 16, // 写真拡大表示方式: 写真の原寸座標に描くため従来比2倍が既定
    penType: 'normal', // normal | neon | fuchi | kira
    stampSize: 96, // 写真拡大表示方式ではキャンバスが写真の原寸(640×480)なので従来比2倍が「中」
    tool: 'pen',
    stampChar: null,
    textStampSel: null,
    textStampColor: null,  // 文字スタンプの色（null=おまかせ＝スタンプごとの標準色・2026-08-13）
    textStampAngle: 'auto', // 文字スタンプの角度（'auto'=従来の手の癖ランダム / 度数指定・2026-08-13）
    dstampId: null,
    sampleSel: null,       // 選択中の落書き見本（写真タップで貼るモード・2026-08-13）,
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

  let currentScreenId = 'screen-title';

  function showScreen(id) {
    /* 声は「その画面のもの」（2026-08-17 JKモニター指摘⑥の構造対策）。
       画面が変わったら、前の画面の声と予約は必ず黙る。これを結線側の気づかいに任せると、
       画面を1つ足すたびに重なりの経路が1本増える。ここで断ち切っておけば増えようがない。
       ⚠️ どの画面も「showScreen → その画面の案内を鳴らす」の順で書くこと（逆に書くと消える）。 */
    if (typeof stopVoice === 'function' && id !== currentScreenId) stopVoice();
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[id].classList.add('active');
    currentScreenId = id;
    // タイトルへ戻ったら待機デモのアイドル計測を仕掛け直す（関数はこの後で定義される）
    if (id === 'screen-title' && typeof armAttractIdle === 'function') armAttractIdle();
    /* 保存画面ではホーム画面追加の案内バー（#pwa-hint）を引っ込める
       （2026-08-15 検見の総合検収【軽微⑨】）。z-index 310 で最前面にいるため、
       非常口「▶ ながおしで保存」や「16分割ver.」の上に乗り、
       落書き中に一度も画面を触らなかった客だけ最後の出口が押せなくなっていた。
       ここまで来た客に「ホーム画面に追加」を勧める意味はもう無い */
    if (id === 'screen-print') {
      const pwaBar = document.getElementById('pwa-hint');
      if (pwaBar) pwaBar.classList.add('hidden');
    }
    if (typeof updateThemeFx === 'function') updateThemeFx(id);
  }

  /* ===================== 画面の回転・サイズ変更（2026-08-14 実機指摘「横表示にうまく対応しない」） =====================
     スマホは遊んでいる最中に回る。「回った後にもう一度組み直す」窓口をここ1本にまとめる。

     ・--app-h … iOSはアドレスバーが伸び縮みするため 100vh が実際の表示高とズレる。
       dvh が使える端末はCSS側の 100dvh に任せ、使えない端末（iOS 15.3以前など）だけ
       この実測値で補う（style.css の @supports not (height: 100dvh) を参照）。
     ・data-orient … 縦持ち/横持ちをCSSと検証から確実に見分けられるようにする。
     ・作業中の画面の描き直し … 落書きも盛りも中身は固定サイズ（SHOT_W×SHOT_H）の
       キャンバスに入っているので回しても消えない。表示側の拡大率だけが変わるため、
       念のため描き直して表示と中身のズレを残さない。 */
  function applyViewportMetrics() {
    const vv = window.visualViewport;
    const h = (vv && vv.height) || window.innerHeight;
    document.documentElement.style.setProperty('--app-h', h + 'px');
    document.body.dataset.orient = window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait';
  }
  let viewportTimer = null;
  function onViewportChange() {
    // iOSは回転1回でresizeを何度も投げる。まとめて最後の1回だけ効かせる
    if (viewportTimer) clearTimeout(viewportTimer);
    viewportTimer = setTimeout(() => {
      viewportTimer = null;
      applyViewportMetrics();
      try {
        if (currentScreenId === 'screen-deco') {
          renderDeco();
          refreshDecoThumbs();
        } else if (currentScreenId === 'screen-beauty') {
          queueBeautyRender();
        }
      } catch (e) { /* 描き直しに失敗しても回転そのものは止めない */ }
    }, 120);
  }
  applyViewportMetrics();
  window.addEventListener('resize', onViewportChange);
  window.addEventListener('orientationchange', onViewportChange);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', onViewportChange);

  /* ===================== テーマ演出（2026-08-12 デザイン刷新・柄本仕様書 §0/1-d/2-d） =====================
     見た目の着せ替えは body.theme-heisei / body.theme-reiwa のCSSが担う。
     ここでは「画面ごとのテロップ文言」と「平成の遷移フラッシュ」だけをJSで面倒を見る。 */
  const MARQUEE_TEXTS = {
    'screen-select': 'コースをえらんでね！　らくがきは３ぷんしょうぶ！　プリはともだちとはんぶんこ！　シールはプリちょうにはろう！　',
    'screen-deco': 'らくがきは３ぷんしょうぶ！　しゃしんを きりかえて ４まいぜんぶ かきこめ！　スタンプれんだ かいきん！　我等友情永久不滅成！　',
  };

  /* ---------- 文言のモード出し分け（2026-08-15・柄本仕様書 付記） ----------
     この画面群は元々1本の共通UIとして書かれ、あとから平成/令和に割った。
     そのため **最初に書いた平成の言い回しが令和側にも残っている**（`らくがき かんせーい♪`
     `かわいく決めてね💕` `これでOK♪`）。CSSの着せ替えはここまで作り込んであるのに
     文字だけ共通だと「見た目は令和・口調は平成」という不一致が起きる。客は文字を読む。

     機能の出し分けは `state.mode === 'heisei'` で丁寧にやっているのに、文言を出し分けて
     いる箇所は `MARQUEE_TEXTS` と `#print-progress` の2つしか無かった。
     ここに1本の表を作り、テーマ切替のたびにまとめて流し込む。
     **今後、文言を足すときはこの表に足せば出し分け漏れが起きない。**

     `heisei` / `reiwa` の両方を書く。片方だけ書いた場合、もう片方はHTMLの初期値のまま。 */
  const COPY_BY_MODE = {
    // --- 保存画面 ---
    '.print-caption': { heisei: 'らくがき かんせーい♪', reiwa: 'できあがり' },      // P-3
    // P-2の主ボタン。令和は感嘆符を落とす（C-7/B-10と同じ様式の話）
    '#btn-download': { heisei: '📥 まずは これを保存！', reiwa: '📥 まずは これを保存' },
    // --- 撮影画面 ---
    '#pose-guide': { heisei: 'かわいく決めてね💕', reiwa: 'いい感じに どうぞ' },     // C-7
    // --- 選択画面 ---
    '#btn-to-camera': { heisei: 'この組み合わせでOK！ ▶', reiwa: 'これで撮る ▶' },  // S-13
    // --- 完成の確認（2026-08-15 検見の総合検収【軽微⑥】。3つ名指しした中でここだけ入れ漏れていた） ---
    '#btn-confirm-yes': { heisei: 'うん！これでOK♪', reiwa: 'これでOK' },
    /* らくがきを終える主ボタン（2026-08-18 検見の検収【軽微4】）。
       `.print-caption` と「これでOK」は出し分け済みなのに、ここだけ表に入れ忘れていて
       令和でも感嘆符が残っていた。令和は感嘆符を落とす様式（C-7/B-10と同じ） */
    '#btn-finish': { heisei: '✨ できあがり！', reiwa: '✨ できあがり' },
    // --- 落書き画面 ---
    // D-5: 挙動の統一はオーナー裁定済みなので触らず、文言だけ動作が分かる形にする。
    //      「コロコロ」は当時のローラースタンプの名前なので平成側にだけ残す
    /* 🚨 クラスのセレクタは querySelectorAll で **その クラスの要素を全部** 書き換える。
       モードで変えない説明文には .stamp-hint を付けないこと（付けるなら .tool-note）。
       2026-08-18: v26で足した #stamp-size-note がこれに巻き込まれ、
       ③⑦のための一文が一度も表示されていなかった（検見の検収で発覚） */
    '.stamp-hint': {
      heisei: 'タップで1こ・なぞると コロコロ！（つながって おされるよ）',
      reiwa: 'タップで1こ。なぞると つながって おされるよ',
    },
  };

  /* 一括書き換えの巻き添えを機械的に見つける（2026-08-18 新設）。
     同じ罠を2度踏んでいる（v26の `.size-btn` と `.stamp-hint`）。
     クラス指定が2つ以上の要素に当たったら、意図しない要素を巻き込んでいる疑いがある。
     ※本番の動作は変えない（コンソールに警告を出すだけ）。__puriDebug から件数も取れる */
  let copyCollisions = [];
  function applyCopyByMode(mode) {
    const key = mode === 'heisei' ? 'heisei' : 'reiwa';
    copyCollisions = [];
    Object.keys(COPY_BY_MODE).forEach(sel => {
      const t = COPY_BY_MODE[sel][key];
      if (t == null) return;
      const hit = document.querySelectorAll(sel);
      if (!sel.startsWith('#') && hit.length > 1) {
        copyCollisions.push({ sel, count: hit.length });
        console.warn('[copy] このセレクタが', hit.length, '個の要素に当たっています:', sel,
          '— モードで変えない説明文まで上書きしていないか確かめること');
      }
      hit.forEach(el => { el.textContent = t; });
    });
  }

  function setTheme(mode) {
    document.body.classList.remove('theme-heisei', 'theme-reiwa');
    if (mode) document.body.classList.add('theme-' + mode);
    if (mode) applyCopyByMode(mode);
  }

  function updateThemeFx(screenId) {
    const isHeisei = document.body.classList.contains('theme-heisei');
    // 電光テロップ（平成のみ・選択/落書き画面に常設）
    const mq = $('#marquee');
    if (mq) {
      const text = isHeisei ? MARQUEE_TEXTS[screenId] : null;
      if (text) {
        $('#marquee-inner').textContent = text + text; // 2周ぶん並べて切れ目なくループ
        mq.classList.remove('hidden');
      } else {
        mq.classList.add('hidden');
      }
    }
    // 平成の画面遷移は「横スライド＋一瞬の白フラッシュ」（令和はCSS側でクロスフェード）
    if (isHeisei) {
      const fl = $('#global-flash');
      if (fl) {
        fl.classList.remove('go');
        void fl.offsetWidth; // アニメを打ち直すためのreflow
        fl.classList.add('go');
      }
    }
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
    moriageSelect: 'audio/moriage_select.mp3',    // 盛れ感レベル選択
    decoOwaru: 'audio/doodle_owaru.mp3',          // 落書き「おわる」ボタン
    decoHalftime: 'audio/doodle_halftime.mp3',    // 落書き残り時間の中間通知
    printOut: 'audio/print_out.mp3',              // シール排出
    /* --- 新機能向け 追加ボイスパック（2026-08-15 音羽納品・27本） ---
       `heisei_` / `reiwa_` の対になっているものは announceByMode() で自動的に選ぶ。
       キー名は末尾に H/R を付けて対を作る（announceByMode がこの規約に依存している）。
       🚨 ここに足したら **sw.js の PRECACHE にも足すこと**（漏れるとオフラインだけ無音になる） */
    decoGateH: 'audio/heisei_deco_gate.mp3',              // らくがきスタートゲート
    decoGateR: 'audio/reiwa_deco_gate.mp3',
    photoPickR: 'audio/reiwa_photo_pick.mp3',             // シールに載せる写真えらび（令和のみ）
    decoPhotoSwitchH: 'audio/heisei_deco_photo_switch.mp3', // 写真拡大表示と切り替えの案内
    decoPhotoSwitchR: 'audio/reiwa_deco_photo_switch.mp3',
    layoutGateH: 'audio/heisei_layout_gate.mp3',          // 分割えらび
    layoutGateR: 'audio/reiwa_layout_gate.mp3',
    korokoroH: 'audio/heisei_korokoro.mp3',               // スタンプのコロコロ（初回のみ）
    korokoroR: 'audio/reiwa_korokoro.mp3',
    cameraWaitH: 'audio/heisei_camera_wait.mp3',          // カメラ起動待ち
    cameraWaitR: 'audio/reiwa_camera_wait.mp3',
    cameraReadyH: 'audio/heisei_camera_ready.mp3',        // プレビュー開始
    cameraReadyR: 'audio/reiwa_camera_ready.mp3',
    thanksH: 'audio/heisei_thanks.mp3',                   // もう一回あそぶ→タイトルへ
    thanksR: 'audio/reiwa_thanks.mp3',
    moriageLevelR: 'audio/reiwa_moriage_level.mp3',       // 盛れ感レベル（令和のみ）
    makeupHistoryR: 'audio/reiwa_makeup_history.mp3',     // メイクりれきボタンを出したとき
    beautyPartsR: 'audio/reiwa_beauty_parts.mp3',         // 盛りスライダー初回操作（令和のみ）
    toolUgokasuR: 'audio/reiwa_tool_ugokasu.mp3',         // 「うごかす」初回選択（令和のみ）
    idPhotoR: 'audio/reiwa_id_photo.mp3',                 // 証明プリ保存（令和のみ）
    saveGuide: 'audio/save_guide.mp3',                    // 共有シートが出る瞬間
    saveSuccess: 'audio/save_success.mp3',                // 共有シートに渡せた瞬間
    saveLongpress: 'audio/save_longpress.mp3',            // 長押し保存モーダル
    saveRetry: 'audio/save_retry.mp3',                    // 共有をやめたとき
    saveError: 'audio/save_error.mp3',                    // 画像を作れなかったとき
    cameraError: 'audio/camera_error.mp3',                // カメラを起動できなかったとき
    resumeOffer: 'audio/resume_offer.mp3',                // 落書きの復帰モーダル
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

  /* ===================== WebAudio（短尺ボイス/SE・iOS根本対策 2026-08-13） =====================
     iPad実機で「3・2・1」カウントだけが鳴らない問題の根本対策。
     HTMLAudioElement はiOS Safariで「ユーザー操作起点でない短尺クリップの連打」が
     再生拒否されることがある（解錠済みでも失敗し、ヘッドレスでは再現できない）。
     カウント・シャッター等の短尺は AudioContext + 事前デコード済み AudioBuffer で鳴らす。
     - 解錠: pointerdown（キャプチャ段階）で resume() する。running になるまで
       タップのたびに再試行するので「ユーザージェスチャ内での解錠」がコードパスで保証される
     - BGM・長尺ボイス（前置き/ポーズ提案等）は従来の HTMLAudio のまま（実機で鳴っている実績）
     - AudioBuffer が未デコード/未解錠のときは従来の HTMLAudio 経路へフォールバック */
  const WA_KEYS = ['count3', 'count2', 'count1', 'countHai', 'seShutter', 'seTap', 'seDecide'];
  let audioCtx = null;
  const waBuffers = {};
  let waPlayCount = 0; // 検証用（WebAudio経路で鳴らした回数）
  function ensureAudioCtx() {
    if (audioCtx) return audioCtx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { audioCtx = new AC(); } catch (e) { return null; }
    return audioCtx;
  }
  (function preloadWaBuffers() {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    WA_KEYS.forEach((key) => {
      fetch(SOUND_FILES[key])
        .then(r => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('http ' + r.status))))
        .then(buf => new Promise((res, rej) => {
          // iOSの旧Safariはコールバック形式のみ対応のため両対応で呼ぶ（二重解決は無害）
          const p = ctx.decodeAudioData(buf, res, rej);
          if (p && p.then) p.then(res, rej);
        }))
        .then(b => { waBuffers[key] = b; })
        .catch(() => { /* 取得/デコード失敗時は HTMLAudio へフォールバックするだけ */ });
    });
  })();
  // タップのたびに running でなければ resume（iOSはバックグラウンド復帰・電話着信等でも suspend する）
  document.addEventListener('pointerdown', () => {
    const ctx = ensureAudioCtx();
    if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
  }, true);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && audioCtx && audioCtx.state !== 'running') {
      audioCtx.resume().catch(() => {}); // ジェスチャ外では拒否されうるが、次のタップで再試行される
    }
  });
  function waPlay(key) {
    if (!audioCtx || audioCtx.state !== 'running') return false;
    const buf = waBuffers[key];
    if (!buf) return false;
    try {
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(audioCtx.destination);
      src.start();
      waPlayCount++;
      return true;
    } catch (e) { return false; }
  }

  /* ===================== 声のバス（voice bus・2026-08-17 JKモニター指摘⑥） =====================
     🚨 「起動したときの音声がごちゃごちゃで聞き取りにくい」は**3回目**の同じ指摘。
     過去2回の修正が効かなかった理由は、直した対象が「案内ボイスの経路」だけだったこと。
     今回このセッションの再生ログを実測して、残っていたかぶりの正体が分かった:

       reiwa_camera_ready(5.35秒) × intro_shot1  … 「カメラ、オッケー！」の途中で撮影が始まる
       pose_04(2.02秒)            × 13_beauty    … ポーズ提案の途中で盛り画面へ進む

     どちらも案内チャンネル（旧 playAnnounce）を**一切知らない別経路**
     （撮影の前置き・ポーズ提案＝playSoundAwait の生の `a.play()`）が鳴らしていた。
     案内側をいくら固めても、もう1本の経路が黙っていないのだから直るはずがない。

     → **声を鳴らす窓口をこの1つに統合する。**「気をつけて呼ぶ」ではなく、
       声のファイルは playVoice() を通らないと鳴らせない、という形にした。
         ・新しい声が鳴る前に、いま鳴っている声を必ず止める（要素の参照で持つ）
         ・遅延・連鎖の予約は voiceTimers に集約し、止めるときに全部取り消す
         ・画面が変わったら前の画面の声は黙る（showScreen が stopVoice を呼ぶ）
         ・連鎖は「1本目の ended を実際に待つ」。保険タイマーは実測長より**必ず後ろ**に置く
           （旧 chainAnnounce の保険は4.2秒固定で、4.92秒の reiwa_deco_gate では
            保険の方が先に来て自分で自分にかぶせていた）
         ・効果音（SE_KEYS）とBGMはバスの外＝声と同時に鳴ってよい（かぶってよい音）
     検証: `__puriDebug.voiceOverlaps()` がアプリ自身の記録から重なり区間を数えて返す。 */
  const SE_KEYS = new Set(['seTap', 'seDecide', 'seShutter']);
  const isVoiceKey = (key) => !SE_KEYS.has(key);
  let voiceTimers = [];
  let voiceCleanups = [];   // ended待ちなどの後始末（stopVoiceでまとめて外す）
  let curVoice = null;      // いま鳴っている声のAudio要素
  let curVoiceKey = null;
  /* いまの声のあとに続けて鳴らす予約（連鎖）: [{ key, gap }]。
     2026-08-18: 連鎖の順番はここ1箇所で持つ。詳しくは chainAnnounce のコメント */
  let voiceQueue = [];
  const voiceHistory = [];  // 検証用: { key, start, end }（endはstop/ended時に確定）

  function queueVoice(fn, ms) {
    const id = setTimeout(() => {
      voiceTimers = voiceTimers.filter(t => t !== id);
      fn();
    }, ms);
    voiceTimers.push(id);
    return id;
  }
  function closeVoiceHistory() {
    const last = voiceHistory[voiceHistory.length - 1];
    if (last && last.end == null) last.end = performance.now();
  }
  function stopVoice() {
    voiceTimers.forEach(clearTimeout);
    voiceTimers = [];
    voiceCleanups.forEach(fn => { try { fn(); } catch (e) { /* 後始末の失敗は無視 */ } });
    voiceCleanups = [];
    voiceQueue = [];  // 連鎖の予約も捨てる（画面が変わったら前の画面の続きは鳴らさない）
    if (curVoice) {
      try { curVoice.pause(); curVoice.currentTime = 0; } catch (e) { /* 停止失敗は無視 */ }
    }
    closeVoiceHistory();
    curVoice = null;
    curVoiceKey = null;
  }
  /* 声を1本鳴らす。**声はすべてここを通る**（案内も、撮影の前置きも、ポーズ提案も、カウントも）。
     戻り値は鳴らし始めたAudio要素（鳴らせなかったときは null）。

     🚨 2026-08-18 v26の回帰修正（検見の実測・ボイス4本が完全に無音）:
     v26は「鳴り終わり」の検知を **要素の ended リスナ2本** で分担していた。
     playVoice が登録したリスナ（curVoice/curVoiceKey を null にする）が先に走り、
     chainAnnounce があとから登録したリスナは `curVoiceKey !== firstKey` で必ず弾かれる。
     つまり**正常に鳴り終わったときほど連鎖が切れる**——リスナの登録順という、
     読んでも見えないものに結果が依存していた。
     → 鳴り終わりの検知と「次へ進む」判断を **このバスの1箇所** に集約する。
       連鎖側は voiceQueue に積むだけで、ended を自分で待たない。 */
  function startVoice(key, onFail, keepQueue) {
    // keepQueue: 連鎖の予約を保ったまま「次の1本」へ進むとき専用（advanceVoiceQueue から）
    const rest = keepQueue ? voiceQueue.slice() : [];
    stopVoice();
    voiceQueue = rest;
    const a = sounds[key];
    // 鳴らせない1本で連鎖を止めない（ファイルが無いクリップは飛ばして次へ進む）
    if (!a || soundMissing(key)) { advanceVoiceQueue(); return null; }
    a.muted = false; // unlockAudioのミュート解錠と同時になっても本物の再生が消音されないように（2026-08-13）
    try { a.currentTime = 0; } catch (e) { /* 未読込のときは無視 */ }
    // 再生拒否を握りつぶさない（撮影の同期待ちは「鳴らなかった」を知る必要がある）
    a.play().catch(() => { if (onFail) onFail(); });
    curVoice = a;
    curVoiceKey = key;
    voiceHistory.push({ key, start: performance.now(), end: null });
    if (voiceHistory.length > 200) voiceHistory.shift();
    /* この1本が「自然に鳴り終わった」ときの後始末＋連鎖の前進。
       別の声に切り替わったあと（curVoice !== a）は何もしない＝割り込んだ側が正 */
    const finishNatural = () => {
      if (curVoice !== a) return;
      closeVoiceHistory();
      curVoice = null;
      curVoiceKey = null;
      advanceVoiceQueue();
    };
    a.addEventListener('ended', finishNatural, { once: true });
    voiceCleanups.push(() => a.removeEventListener('ended', finishNatural));
    /* 保険（ended が来ない環境用・iOSで実例あり）: 実測長を過ぎてから見に行き、
       まだ鳴っていれば0.6秒ごとに見直す。鳴り終わっていれば連鎖を進める。
       ⚠️ 実測長より前には絶対に見ない（v25以前は4.2秒固定で、4.92秒のクリップに
          保険の方が先に来て自分で自分にかぶせていた） */
    let looks = 0;
    const watch = () => {
      if (curVoice !== a) return; // すでに別の声へ移った＝この見張りは用済み
      if (!a.paused && !a.ended && looks < 12) { looks++; queueVoice(watch, 600); return; }
      finishNatural();
    };
    queueVoice(watch, (soundDurationMs(key) || 4200) + 250);
    return a;
  }
  function playVoice(key, onFail) { return startVoice(key, onFail, false); }
  /* 予約された連鎖を1本進める。前の声が自然に鳴り終わったときだけ呼ばれる */
  function advanceVoiceQueue() {
    if (!voiceQueue.length) return;
    const next = voiceQueue.shift();
    queueVoice(() => startVoice(next.key, null, true), next.gap);
  }

  function playSound(key) {
    if (isVoiceKey(key)) { playVoice(key); return; } // 声はバス経由（重なりようがない）
    if (waPlay(key)) return; // 効果音の短尺はWebAudio優先（iOS対策）。未解錠/未デコードなら従来経路へ
    const a = sounds[key];
    if (!a || soundMissing(key)) return;
    a.muted = false;
    a.currentTime = 0;
    a.play().catch(() => { /* 自動再生がブロックされた場合は無視 */ });
  }

  // 第一候補が未着（ファイル無し）のときだけ代替を鳴らす
  function playSoundOr(key, fallbackKey) {
    if (!soundMissing(key)) { playSound(key); return; }
    if (fallbackKey) playSound(fallbackKey);
  }

  /* 旧名の窓口はそのまま残す（呼び出し側を全部書き換えると差分が読めなくなるため）。
     中身はすべて上のバスに委ねている＝経路は1本 */
  const stopAnnounce = stopVoice;
  const playAnnounce = playVoice;
  const queueAnnounce = queueVoice;
  /* モード別ボイスの選択（2026-08-15 追加ボイスパック）。
     `decoGate` を渡すと平成なら decoGateH・令和なら decoGateR を鳴らす。
     片側しか無いもの（moriageLevelR 等）はキーを直接 playAnnounce に渡すこと */
  function announceByMode(base) {
    playAnnounce(base + (state.mode === 'heisei' ? 'H' : 'R'));
  }
  /* 「1本目のあとに続けて2本目」を繋ぐ（2026-08-18 作り替え・v26の回帰修正）。

     やることは **予約列に積むだけ** にした。鳴り終わりの検知はバス（startVoice）が
     1箇所で持ち、ended リスナの登録順に結果が左右されない。
     v26は「同じ要素に ended をあとから足して自分で待つ」形で、先に登録された
     バス側のリスナが状態を消すため一度も繋がらなかった（ボイス4本が無音）。

     1本目がまだ予約の途中（voiceQueue の中）でも積める。これで
     beauty → moriageLevel → makeupHistory のような3連もそのまま並ぶ
     （v26は2本目を予約中に3本目を頼むと、判定が外れて**1本目を切って**鳴らしていた）。 */
  function chainAnnounce(firstKey, secondKey, gapMs = 250) {
    if (curVoiceKey === firstKey || voiceQueue.some(q => q.key === firstKey)) {
      voiceQueue.push({ key: secondKey, gap: gapMs });
      return;
    }
    // 1本目がバスに居ない（鳴らせなかった・別の声に切られた）回は待つ意味が無いので、そのまま2本目へ
    queueVoice(() => playVoice(secondKey), gapMs);
  }
  /* 「その回はじめて」だけ鳴らす案内の管理（音羽さんの注意3）。
     道具を持ち替えるたびに喋ると、3分の落書きタイムが説明で埋まる。
     「もう一回あそぶ」で resetOnceVoices() を呼んでリセットする */
  const onceVoiceDone = {};
  function announceOnce(id, key) {
    if (onceVoiceDone[id]) return;
    onceVoiceDone[id] = true;
    playAnnounce(key);
  }
  function announceOnceByMode(id, base) {
    if (onceVoiceDone[id]) return;
    onceVoiceDone[id] = true;
    announceByMode(base);
  }
  function resetOnceVoices() {
    Object.keys(onceVoiceDone).forEach(k => delete onceVoiceDone[k]);
  }

  /* 音声が鳴らせない環境の印（2026-08-12 検見の実測指摘対応）。
     以前は保険タイムアウト4秒×6クリップで、無音環境だと4枚撮影が96秒に化けた。
     一度でも「再生失敗」か「endedが来ない」を検知したら、そのセッションの残りは
     音声待ちをやめて見た目のリズムだけで進む（撮影開始・もう一回あそぶ、でリセット）。 */
  let voiceGaveUp = false;

  // クリップの実測長（ms）。メタデータ未取得なら0
  function soundDurationMs(key) {
    const a = sounds[key];
    const d = a && isFinite(a.duration) ? a.duration * 1000 : 0;
    return d > 0 ? d : 0;
  }

  /* 撮影カウントダウン用：セリフの再生が実際に終わるまで待つ（＝見た目とボイスを完全に同期させる）
     nominalMs は音声が使えない環境での「見た目の間」（無音でもテンポが速すぎ/遅すぎにならない値）
     🚨 2026-08-17: ここは以前 `a.play()` を直接叩いていた＝**声のバスの外**だった。
     そのため「カメラ、オッケー！」（5.35秒）の途中で撮影を始めると前置きと重なり、
     4枚目のポーズ提案の途中で盛り画面へ進むと盛りの案内と重なっていた（実測）。
     いまは playVoice を通すので、鳴らした瞬間に前の声が必ず止まる。 */
  function playSoundAwait(key, nominalMs = 700) {
    const a = sounds[key];
    if (!a || soundMissing(key)) { stopVoice(); return Promise.resolve(); }
    if (voiceGaveUp) {
      // 鳴るかもしれないので再生自体は試すが、待ちは固定時間（96秒化の再発防止）
      playVoice(key);
      return sleep(nominalMs);
    }
    return new Promise((resolve) => {
      let done = false;
      let timer = null;
      const finish = (failed) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        a.removeEventListener('ended', onEnded);
        if (failed) voiceGaveUp = true;
        resolve();
      };
      const onEnded = () => finish(false);
      a.addEventListener('ended', onEnded);
      if (!playVoice(key, () => finish(true))) { finish(true); return; } // バス経由（前の声を止めてから鳴らす）
      // 保険: クリップ実測長+350ms・長さ不明なら1.5秒（旧4秒は無音環境で1枚25秒に化けた）。
      // 実測長より長くは待たないので、正常時にセリフを切ることはない
      const clip = soundDurationMs(key);
      timer = setTimeout(() => finish(true), clip ? clip + 350 : 1500);
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
    { id: 'euro', label: 'ユーロビート（ノリノリ）', src: 'audio/bgm.mp3' },
    { id: 'lofi', label: 'ローファイ（しずかめ）', src: 'audio/bgm_reiwa.mp3' },
    { id: 'pop',  label: 'ポップ（あかるめ）', src: 'audio/bgm_title.mp3' },
  ];

  function playBgmSrc(src) {
    bgmAudio.muted = false; // unlockAudioの解錠と同時になっても消音・巻き添えpauseされないように（2026-08-13）
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
  /* 1回だけ実行する（2026-08-13）: 2回目以降に走ると、ミュート再生→pause の後始末が
     直前に鳴らし始めた本物の音声（courseSelectV2等）を巻き添えで止めるレースになるため */
  let audioUnlocked = false;
  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    [...Object.values(sounds), bgmAudio].forEach((a) => {
      a.muted = true;
      a.play().then(() => {
        /* 解錠中に本物の再生（playSound/startBGM）が始まっていたら、そちらを止めない。
           本物の再生は muted=false で始まるので、まだミュートのものだけが解錠用の空再生 */
        if (a.muted) {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        }
      }).catch(() => { a.muted = false; });
    });
  }

  /* ===================== 0-. 待機デモ（アトラクト画面・2026-08-12 新設） =====================
     実機は客がいない間もデモ映像＋呼び込み音声が回り続ける（直接の一次出典なし。
     2025年の復刻版実機で確認された演出に由来・2026-08-13 検見の裏付け検証で出典訂正）。
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
      const prev = attractSlideIdx;
      attractSlideIdx = (attractSlideIdx + 1) % attractSlides.length;
      /* 時代が切り替わったと目で分かる遷移（柄本仕様書3-2）:
         平成様式→令和様式(1→2) は白フラッシュ／令和様式→対比(2→3) はカットイン */
      if (prev === 1 && attractSlideIdx === 2) {
        const fl = $('#global-flash');
        fl.classList.remove('go');
        void fl.offsetWidth;
        fl.classList.add('go');
      }
      attractOverlay.classList.toggle('cut', prev === 2 && attractSlideIdx === 3);
      attractSlides.forEach((s, i) => s.classList.toggle('active', i === attractSlideIdx));
    }, ATTRACT_SLIDE_MS);
    // 呼び込み音声（ファイル未着ならスキップ）。連呼しすぎないよう間隔を空けてループ
    playAnnounce('attractCall');
  }

  function stopAttract() {
    if (!attractOn) return;
    attractOn = false;
    attractOverlay.classList.add('hidden');
    if (attractSlideId) { clearInterval(attractSlideId); attractSlideId = null; }
    if (attractCallId) { clearTimeout(attractCallId); attractCallId = null; }
    // 呼び込みもバスの上の声なので、バスごと黙らせる（要素を直接止めるとバスの帳簿がずれる）
    if (curVoiceKey === 'attractCall') stopVoice();
  }

  if (sounds.attractCall) {
    sounds.attractCall.addEventListener('ended', () => {
      if (!attractOn) return;
      attractCallId = setTimeout(() => { if (attractOn) playAnnounce('attractCall'); }, ATTRACT_CALL_GAP_MS);
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
    setTheme(mode); // 画面の着せ替え（2026-08-12 デザイン刷新）
    const conf = modeConf();
    state.curtain = conf.curtains[0];
    state.frame = conf.frames[0];
    /* 平成の分割選択は「落書きの後」（2026-08-13 オーナー裁定・実機の型: 撮影→落書き→分割→排出）。
       落書き中の台紙は4分割で固定し、完成後の分割選択で選び直す。
       前セッション（令和）のレイアウトを持ち越さないようここで必ず戻す */
    if (mode === 'heisei') state.layout = LAYOUTS[0];
    /* 平成に盛れプリセットは無い（2026-08-13 掃除でMODES.heiseiから削除）。
       平成の写りは finishHeiseiProcessing の固定値が担うので、ここは全ゼロでよい
       （filterだけは選択画面のフィルター選択が使う） */
    const preset = (conf.presets || []).find(p => p.id === conf.defaultPreset);
    state.beauty = preset
      ? { skin: preset.skin, white: preset.white, clear: preset.clear, eye: preset.eye, face: preset.face, nose: preset.nose || 0, cheek: preset.cheek, lip: preset.lip, eyeType: 1, namida: 0, legs: 0, filter: 'none' }
      : { skin: 0, white: 0, clear: 0, eye: 0, face: 0, nose: 0, cheek: 0, lip: 0, eyeType: 1, namida: 0, legs: 0, filter: 'none' };
    buildSelectGrids();
    applyShotMode();
    buildDecoTools();
    unlockAudio();
    startBGM();
    showScreen('screen-select');
    /* コース選択のスクロール位置を毎回トップへ（2026-08-12 qa-tester検収指摘1）:
       「もう一回あそぶ」経由だと前の組のスクロール位置が残り、次の組がSTEP途中から
       見ることになる。表示のたびに明示的にリセットする */
    $('#screen-select .panel').scrollTop = 0;
    /* コース選択画面の案内（2026-08-12・2026-08-13改修）: 音声は必ず1本ずつ。
       以前はモード決定音声（start）と新ボイス（courseSelectV2）を同時に鳴らしていて
       実機テストで「2種類の声がダブる」と指摘された。新ボイスがあるときは
       旧アナウンス（start / selectCurtain / selectFrame）を一切鳴らさず、
       ファイル未着時だけ従来の3本を「終わってから次」の順送りで鳴らす */
    if (!soundMissing('courseSelectV2')) {
      playAnnounce('courseSelectV2');
    } else {
      /* 旧3本チェーンは「鳴らしてから次を予約」の逐次連鎖にする
         （playAnnounceが予約を全消しするため、先にまとめて予約すると2本目で3本目が消える） */
      playAnnounce('start');
      const startMs = soundDurationMs('start') || 1300;
      queueAnnounce(() => {
        if (!screens['screen-select'].classList.contains('active')) return;
        playAnnounce('selectCurtain');
        queueAnnounce(() => {
          if (screens['screen-select'].classList.contains('active')) playAnnounce('selectFrame');
        }, (soundDurationMs('selectCurtain') || 1700) + 250);
      }, startMs + 250);
    }
  }

  /* モード決定の「染まる遷移」（2026-08-12 デザイン刷新・柄本仕様書3-3の見せ場）:
     平成=虹シャッターが閉じて開く／令和=白がふわっと満ちて引く。
     閉じている間に enterMode で画面を切り替える。連打はwipingフラグで防ぐ。 */
  let wiping = false;
  function modeWipe(mode) {
    if (wiping) return;
    wiping = true;
    const wipe = $('#mode-wipe');
    wipe.className = 'wipe-' + mode + ' closing';
    setTimeout(() => {
      enterMode(mode);
      wipe.classList.remove('closing');
      wipe.classList.add('opening');
      setTimeout(() => { wipe.className = ''; wiping = false; }, 460);
    }, 380);
  }
  $('#btn-mode-heisei').addEventListener('click', () => modeWipe('heisei'));
  $('#btn-mode-reiwa').addEventListener('click', () => modeWipe('reiwa'));

  /* 戻る導線（2026-08-12 オーナー指摘対応）:
     コース選択→モード選択へ戻れる。戻る＝セッションのやり直しなので、
     BGM/写り年代は「もう一回あそぶ」と同じく初期値へ戻す（次のモードへ持ち越さない）。
     カーテン・フレーム等は enterMode が毎回リセットするので触らなくてよい。 */
  $('#btn-back-title').addEventListener('click', () => {
    stopAnnounce(); // コース選択の案内が読み上げ中でも、戻ったら黙る
    state.bgmChoice = 'auto';
    state.heiseiEra = 'standard';
    delete document.body.dataset.mode; // 前回のモード値を残さない（qa-tester検収指摘6）
    setTheme(null); // タイトルはモード決定前の「対比の画面」なのでテーマを外す
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
        /* 令和の分割えらびは撮影後ではなく **この選択画面の中** にある（2026-08-15 音羽さんの申し送り）。
           はじめて分割に触れたときだけ「２枚ワイドから１６分割まで」を一度だけ言う。
           平成はここを表示しない（落書き後のゲートで layoutGateH を鳴らす） */
        if (state.mode !== 'heisei') announceOnce('layoutGateR', 'layoutGateR');
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
    /* S-10（2026-08-15 柄本仕様書）: 「押すとその場で聞ける」ことが画面のどこにも
       書かれておらず、実装済みの試聴機能が誰にも使われていなかった。1行足すだけで機能が生きる */
    let note = $('#bgm-try-note');
    if (!note) {
      note = document.createElement('p');
      note.id = 'bgm-try-note';
      note.className = 'sel-hint';
      row.parentNode.insertBefore(note, row.nextSibling);
    }
    note.textContent = '（押すと その場で 聞けるよ）';
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
    // えらんだ瞬間に撮影画面の飾りも作り直しておく（選び直して撮影へ入っても必ず最新になる）
    buildChoiceGrid($('#curtain-list'), conf.curtains, 'curtain', (item) => { state.curtain = item; renderCamFramePreview(); });
    buildChoiceGrid($('#frame-list'), conf.frames, 'frame', (item) => { state.frame = item; renderCamFramePreview(); });
    buildSelectFilterRow();
    buildBgmRow();
    buildEraToneRow();

    // 「うつりの年代」は平成モード専用（令和は現行機の写りなので年代選択なし）
    $('#sel-eratone').style.display = state.mode === 'heisei' ? '' : 'none';

    /* モード別にセクションを並べ替える:
       平成 = コース＋フレーム＋フィルター＋BGMがデフォ（初代〜中期プリ機の流れ）。
              カラー・年代・デジタル背景は「こだわり設定」へ。
              分割はここでは選ばない（2026-08-13裁定: 実機の型どおり落書きの後に選ぶ）
       令和 = コース＋分割・カラー・フレームがデフォ。フィルター・BGM・デジタル背景は「こだわり設定」へ */
    const main = $('#select-main');
    const adv = $('#advanced-body');
    const order = state.mode === 'heisei'
      ? { main: ['sel-shotmode', 'sel-frame', 'sel-filter', 'sel-bgm'], adv: ['sel-eratone', 'sel-curtain', 'sel-chroma'] }
      : { main: ['sel-shotmode', 'sel-layout', 'sel-curtain', 'sel-frame'], adv: ['sel-filter', 'sel-bgm', 'sel-eratone', 'sel-chroma'] };
    /* 平成では #sel-layout をどちらのリストにも入れない＝前モードの置き場所に残るため、
       表示だけでなく必ず非表示にする（令和では戻す） */
    $('#sel-layout').style.display = state.mode === 'heisei' ? 'none' : '';
    order.main.forEach(id => main.appendChild($('#' + id)));
    order.adv.forEach(id => adv.appendChild($('#' + id)));
    $('#sel-advanced').open = false;

    /* メイン側だけ番号を振る（こだわり側は素の見出し）。
       番号の様式はテーマで変える（柄本仕様書 3-4）:
       平成 = 「STEP 1. 〜」の黄帯見出し ／ 令和 = 小英字キャプション「01 / course」をCSSで上に添える */
    let step = 1;
    order.main.forEach(id => {
      const h = $('#' + id).querySelector('.step-heading');
      if (!h) return;
      if (state.mode === 'heisei') {
        h.textContent = `STEP ${step}. ${h.dataset.title}`;
        h.removeAttribute('data-num');
      } else {
        h.textContent = h.dataset.title;
        h.dataset.num = String(step).padStart(2, '0');
      }
      step++;
    });
    order.adv.forEach(id => {
      const h = $('#' + id).querySelector('.step-heading');
      if (h) { h.textContent = h.dataset.title; h.removeAttribute('data-num'); }
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
      if (t) { t.dataset.on = 'false'; t.textContent = 'つかわない'; }
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
    chromaToggle.textContent = state.chromaOn ? 'つかう' : 'つかわない';
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

  /* 🚨 2026-08-15（検見 要修正4）: 以前はここで作った Promise を握りっぱなしにしていたため、
     一度でも読み込みに失敗すると **拒否済みPromise** を永久に返し続け、
     そのセッションのあいだ二度と再挑戦しなかった。数百人が同じWi-Fiを使う文化祭では
     瞬間的な詰まりが頻発するので、「開いた一瞬だけ電波が悪かった客」が最後まで
     盛れないまま終わっていた（直す手段はページ再読込だけで、客はそれを知らない）。
     → 失敗したらキャッシュを捨てて、次の呼び出しでもう一度取りに行く。 */
  /* 🚨 再挑戦できるようにするために2つ必要（2026-08-15・検見 要修正4）。片方だけでは直らない。
     ① 拒否されたPromiseを捨てる（以前は握りっぱなしで、以後ずっと拒否済みPromiseを返していた）
     ② **URLを毎回変える**。ブラウザは `import()` の結果をモジュールマップに覚えており、
        **失敗も覚える**。同じURLで呼び直しても再フェッチは起きず、同じ失敗が即座に返るだけ。
        実測: ①だけ入れた状態で、13秒ごとに取りに行っているのに
        ネットワークへの取得試行は最初の1回のまま増えなかった。
        クエリを1つ足すとモジュールマップの別エントリになり、本当に取りに行く。 */
  let mpLoadAttempt = 0;
  const mpBust = () => (mpLoadAttempt > 0 ? `?retry=${mpLoadAttempt}` : '');

  function loadVision() {
    if (!visionModulePromise) {
      visionModulePromise = import(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/vision_bundle.mjs${mpBust()}`)
        .catch(err => { visionModulePromise = null; mpLoadAttempt++; throw err; });
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
      })().catch(err => { filesetPromise = null; throw err; });
    }
    return filesetPromise;
  }

  /* 失敗フラグの有効期限（2026-08-15・検見 要修正4）。
     ずっと諦めたままにせず、この秒数を過ぎたら1回だけ再挑戦してよいことにする。
     秒数を短くしすぎると回線が死んでいる会場で毎フレーム取りに行って重くなるため、
     「客が次の画面へ進むまでのあいだに1〜2回試せる」くらいを狙って12秒。 */
  const MP_RETRY_AFTER_MS = 12000;
  const mpGaveUp = (t) => t > 0 && (Date.now() - t) < MP_RETRY_AFTER_MS;

  /* ===================== 人物くり抜き（選択式） ===================== */
  const previewCanvas = $('#preview-canvas');
  const previewCtx = previewCanvas.getContext('2d');
  const segmenterStatus = $('#segmenter-status');
  previewCanvas.width = SHOT_W;
  previewCanvas.height = SHOT_H;

  /* 撮影中のフレーム重ね（2026-08-18 実機テスト指摘①「フレームを選んでも撮影時に変わらない」）。
     実機のプリクラは撮影中の画面に選んだ飾りが乗っていて、客はそれを見てポーズを決める。
     🚨 落書き画面の renderDecoFramePreview() と **同じ関数・同じ引数** を通すこと。
     ここを別実装にすると「ライブで見た位置」と「出来上がりの位置」がズレて客を裏切る。
     毎フレームは描かない（選び直したときだけ描き直す）ので、ライブ盛れの負荷には足さない。
     撮影データは liveClean 側から取るので、この層は写真には焼き込まれない。 */
  const camFrameCanvas = $('#cam-frame-canvas');
  const camFrameCtx = camFrameCanvas ? camFrameCanvas.getContext('2d') : null;
  if (camFrameCanvas) { camFrameCanvas.width = SHOT_W; camFrameCanvas.height = SHOT_H; }
  function renderCamFramePreview() {
    if (!camFrameCtx) return;
    camFrameCtx.clearRect(0, 0, SHOT_W, SHOT_H);
    if (!state.frame || !state.curtain) return;
    drawCellDecor(camFrameCtx, { x: 0, y: 0, w: SHOT_W, h: SHOT_H }, {
      emoji: state.frame.emoji, isCircle: false, radius: 10,
    });
  }

  let imageSegmenter = null;
  let segmenterLoading = false;
  let segmenterFailedAt = 0; // 0=まだ失敗していない／>0=最後に失敗した時刻（期限つき・2026-08-15）
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
      segmenterFailedAt = 0; // 読めたので失敗の記録は消す
      if (state.chromaOn) {
        segmenterStatus.textContent = '✨ うしろの色がえ 準備OK！';
        segmenterStatus.classList.remove('hidden');
        setTimeout(() => segmenterStatus.classList.add('hidden'), 1500);
      }
    } catch (err) {
      console.warn('人物くり抜きモデルの読み込みに失敗しました。通常のカメラ映像で撮影します。', err);
      segmenterFailedAt = Date.now();
      if (state.chromaOn) {
        segmenterStatus.textContent = '（うしろの色がえは 今回おやすみ。そのまま撮れるよ）';
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
  let landmarkerLiveFailedAt = 0;
  let liveFaces = null;
  let liveFrameCount = 0;

  // パフォーマンス自動調整
  const livePerf = { ema: 0, detectEvery: 2, eyeOn: true, disabled: false, noted: false };
  let liveReadyNoted = false; // 「準備中→ON」の一言を1セッション1回だけ出す

  function liveBeautyWanted() {
    return state.mode === 'reiwa' && state.liveBeautyOn && !livePerf.disabled;
  }

  async function initFaceLandmarkerLive() {
    if (faceLandmarkerLive || landmarkerLiveLoading || mpGaveUp(landmarkerLiveFailedAt)) return;
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
      landmarkerLiveFailedAt = 0;
    } catch (err) {
      console.warn('ライブ用顔ランドマークの読み込みに失敗しました。ライブ盛れは肌のみになります。', err);
      landmarkerLiveFailedAt = Date.now();
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

  // 小鼻のライブ版: 本番の directionalWarp は重いので、鼻周辺を横方向に縮めた
  // コピーをフェザー付きで重ねて近似する（liveEyeMagnify と同じ発想・2026-08-13）
  let liveNoseTmp = null, liveNoseTmpCtx = null;
  function liveNoseSlim(ctx, cleanCv, faces, noseS) {
    if (!faces || !faces.length || noseS <= 0) return;
    if (!liveNoseTmp) {
      liveNoseTmp = document.createElement('canvas');
      liveNoseTmpCtx = liveNoseTmp.getContext('2d');
    }
    const w = cleanCv.width, h = cleanCv.height;
    faces.forEach((lm) => {
      if (!lm || lm.length < 468) return;
      const nl = lmToPx(lm[129], w, h);
      const nr = lmToPx(lm[358], w, h);
      const c = { x: (nl.x + nr.x) / 2, y: (nl.y + nr.y) / 2 };
      const nw2 = dist(nl, nr);
      const r = nw2 * 0.95;
      if (r < 4) return;
      if (c.x - r < 0 || c.y - r < 0 || c.x + r > w || c.y + r > h) return; // 画面端はスキップ（目の近似と同じ理由）
      const dpx = Math.ceil(r * 2);
      if (liveNoseTmp.width !== dpx || liveNoseTmp.height !== dpx) {
        liveNoseTmp.width = dpx; liveNoseTmp.height = dpx;
      }
      const squeeze = 1 - noseS * 0.09; // 本番warp(約10%)より控えめ＝近似のアラを出さない
      const dw = dpx * squeeze;
      liveNoseTmpCtx.globalCompositeOperation = 'source-over';
      liveNoseTmpCtx.clearRect(0, 0, dpx, dpx);
      liveNoseTmpCtx.imageSmoothingEnabled = true;
      liveNoseTmpCtx.drawImage(cleanCv, c.x - r, c.y - r, dpx, dpx, (dpx - dw) / 2, 0, dw, dpx);
      const grad = liveNoseTmpCtx.createRadialGradient(r, r, r * 0.4, r, r, r);
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      liveNoseTmpCtx.globalCompositeOperation = 'destination-in';
      liveNoseTmpCtx.fillStyle = grad;
      liveNoseTmpCtx.fillRect(0, 0, dpx, dpx);
      liveNoseTmpCtx.globalCompositeOperation = 'source-over';
      ctx.drawImage(liveNoseTmp, c.x - r, c.y - r);
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
        // 美白: 白を肌マスク越しにソフトライト合成（中間調リフト。スクリーンだと肌が灰色に霞む・2026-08-12再設計）
        layerCtx.clearRect(0, 0, w, h);
        layerCtx.fillStyle = '#ffffff';
        layerCtx.fillRect(0, 0, w, h);
        layerCtx.globalCompositeOperation = 'destination-in';
        layerCtx.drawImage(liveSkinSmall, 0, 0, w, h);
        layerCtx.globalCompositeOperation = 'source-over';
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = Math.min(1, whiteS * conf.skinTone.brightPerUnit * 5.0);
        ctx.drawImage(skinLayerCanvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }

    // デカ目・小鼻（ライブ近似）＋チーク・リップ（重い端末では eyeOn の自動OFFに連動して両方止まる）
    if (livePerf.eyeOn) liveEyeMagnify(ctx, liveClean, liveFaces, p.eye / 100);
    if (livePerf.eyeOn) liveNoseSlim(ctx, liveClean, liveFaces, (p.nose || 0) / 100);
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
        segmenterStatus.textContent = '⚡ いまは 撮ったあとで 盛るよ！ そのまま撮ってOK🙆';
        segmenterStatus.classList.remove('hidden');
        setTimeout(() => segmenterStatus.classList.add('hidden'), 2500);
        syncLiveBeautyUI();
      }
    }
  }

  // ライブプレビュー1フレーム分の合成。くりぬきOFF時は素通し＋軽い美肌ライト
  /* プレビュー描画の世代番号（2026-08-13 実機指摘「チラ見せが見えない」の根本原因対策）:
     previewLoop は async（セグメント推論を await）のため、previewRunning=false にしても
     飛行中の1フレームが後から previewCtx へ着地し、直前に描いたチラ見せの静止画を
     上書きしてしまう。推論が重い実機ほど確実に起きる（ヘッドレスでは速すぎて見えない）。
     チラ見せ開始時に世代を進め、古い世代のフレームは表示段階で捨てる */
  let previewDrawEpoch = 0;

  async function renderPreviewFrame(sourceEl) {
    const t0 = performance.now();
    const epoch = previewDrawEpoch;
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
          segmenterStatus.textContent = '✨ 撮る前から盛る ON！';
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
      if (liveBeauty && segmenterFailedAt > 0 && !liveReadyNoted && !state.chromaOn) {
        liveReadyNoted = true;
        segmenterStatus.textContent = '（撮ったあとで しっかり盛れるよ！）';
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
    // 撮影中は常時「肌が少し明るくなる」ライト効果（実機の照明再現）。
    // この明るさは撮影データにも焼き込まれるため、曇らない中間調リフト（白ソフトライト）で行う
    applyToneFx(liveCleanCtx, SHOT_W, SHOT_H, { bright: 0.16 });

    // --- ライブ用の顔検出（間引き実行。座標系を合わせるため合成後のフレームに対して行う） ---
    if (liveBeauty && faceLandmarkerLive && liveFrameCount % livePerf.detectEvery === 0) {
      try {
        const res = faceLandmarkerLive.detectForVideo(liveClean, performance.now());
        liveFaces = (res.faceLandmarks && res.faceLandmarks.length) ? res.faceLandmarks : null;
      } catch (err) { /* 検出失敗フレームは前回の結果を使い続ける */ }
    }

    // --- 表示（ライブ盛れONなら加工を重ねる。撮影データには影響しない） ---
    // チラ見せ開始後に着地した飛行中フレームは捨てる（静止画の上書き防止・2026-08-13）
    if (epoch !== previewDrawEpoch) return;
    previewCtx.clearRect(0, 0, SHOT_W, SHOT_H);
    previewCtx.drawImage(liveClean, 0, 0);
    if (liveBeauty) renderLiveBeauty(previewCtx);

    previewCanvas.classList.add('ready');
    if (camFrameCanvas) camFrameCanvas.classList.add('ready'); // 飾りは映像と同時に出す（先に出ると枠だけ浮く）
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
  let landmarkerFailedAt = 0;

  async function initFaceLandmarker() {
    if (faceLandmarker || landmarkerLoading || mpGaveUp(landmarkerFailedAt)) return;
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
      landmarkerFailedAt = 0;
    } catch (err) {
      console.warn('顔ランドマークモデルの読み込みに失敗しました。デカ目・小顔はスキップされます。', err);
      landmarkerFailedAt = Date.now();
    }
    landmarkerLoading = false;
  }

  /* ===================== 多クラス肌セグメンテーション（美肌の検知エンジン） =====================
     selfie_multiclass モデルは 背景/髪/体の肌/顔の肌/服/その他 をピクセル単位でML分類する。
     色ベースの肌検出と違い、髪・服・背景の誤検出が原理的に起きない。 */
  let skinSegmenter = null;
  let skinSegmenterLoading = false;
  let skinSegmenterFailedAt = 0;

  async function initSkinSegmenter() {
    if (skinSegmenter || skinSegmenterLoading || mpGaveUp(skinSegmenterFailedAt)) return;
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
      skinSegmenterFailedAt = 0;
    } catch (err) {
      console.warn('肌セグメンテーションモデルの読み込みに失敗しました。色ベースの肌検出にフォールバックします。', err);
      skinSegmenterFailedAt = Date.now();
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
    btnLiveBeauty.textContent = on ? '✨ 撮る前から盛る ON' : '撮る前から盛る OFF';
    btnLiveBeauty.classList.toggle('on', on);
    livePresetRow.classList.toggle('dimmed', !on);
    // 盛れ感プリセット（無加工風/ナチュ盛れ/プリ盛れ）。選ぶと撮影後の盛り調整の初期値にもなる
    const conf = modeConf();
    livePresetRow.innerHTML = '';
    conf.presets.forEach(p => {
      const b = document.createElement('button');
      const isActive = ['skin', 'white', 'clear', 'eye', 'face', 'nose', 'cheek', 'lip'].every(k => (state.beauty[k] || 0) === (p[k] || 0));
      b.className = 'live-preset-btn' + (isActive ? ' active' : '');
      b.textContent = p.label;
      b.addEventListener('click', () => {
        state.beauty.skin = p.skin;
        state.beauty.white = p.white;
        state.beauty.clear = p.clear;
        state.beauty.eye = p.eye;
        state.beauty.face = p.face;
        state.beauty.nose = p.nose || 0;
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
      if (!imageSegmenter && !mpGaveUp(segmenterFailedAt) && !segmenterLoading) initSegmenter();
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
    state.photoPick = null; // シール写真えらびは撮り直しのたびに白紙へ（2026-08-13）
    state.skinConf = [];
    skinMaskCache.clear();
    segEMA = null; // 前回セッションのマスク残像を消す
    buildShotIndicator();
    $('#shots-left').textContent = NUM_SHOTS;
    btnStartShooting.disabled = false;
    btnStartShooting.style.display = 'inline-block';
    $('#btn-back-select').style.display = ''; // 撮影開始前は戻れる
    $('#darkroom').classList.add('hidden'); // 前セッションの現像中表示を消す
    document.querySelector('.camera-stage').classList.remove('developing'); // 右パネルの非表示も解除（保険）
    previewCanvas.classList.remove('ready');
    if (camFrameCanvas) camFrameCanvas.classList.remove('ready');
    renderCamFramePreview(); // えらび直した内容をここで描き直す（映像が出た瞬間から飾りが乗っている）
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
      if (!imageSegmenter && !mpGaveUp(segmenterFailedAt) && !segmenterLoading) initSegmenter();
      // 準備中の一言（くり抜きONのときは既存の案内を優先）
      if (!state.chromaOn && !(imageSegmenter && segmenterIsMulticlass)) {
        segmenterStatus.textContent = '✨ 撮る前から盛る 準備中…';
        segmenterStatus.classList.remove('hidden');
      }
    }

    if (state.chromaOn) {
      if (imageSegmenter) {
        segmenterStatus.classList.add('hidden');
      } else if (mpGaveUp(segmenterFailedAt)) {
        segmenterStatus.textContent = '（うしろの色がえは 今回おやすみ。そのまま撮れるよ）';
        segmenterStatus.classList.remove('hidden');
        setTimeout(() => segmenterStatus.classList.add('hidden'), 2500);
      } else {
        segmenterStatus.textContent = '🪄 うしろの色を じゅんび中…';
        segmenterStatus.classList.remove('hidden');
        if (!segmenterLoading) initSegmenter();
      }
    } else {
      segmenterStatus.classList.add('hidden');
    }

    // 全身モードは三脚に固定して背面（アウト）カメラで撮る。バストアップは従来どおり前面。
    // （前面/背面の割り当ては現行仕様のまま。取れなかったときだけ下でフォールバックする）
    const facing = state.shotMode === 'full' ? 'environment' : 'user';
    hideCamFail();
    showCamLoading(true);
    /* 「カメラ、じゅんび中ー！」は **待たされたときだけ** 鳴らす（2026-08-15）。
       すぐ起動する端末で鳴らすと、直後の cameraReady に即座に切られて
       言いかけで途切れた音になる。1.2秒たっても起動しないときが「待たされた」 */
    if (camWaitVoiceId) clearTimeout(camWaitVoiceId);
    /* 予約は声のバスに載せる（2026-08-17）。生の setTimeout だと、客が「えらび直す」で
       コース選択へ戻ったあとに「カメラ、じゅんび中ー！」だけが追いかけて鳴る */
    camWaitVoiceId = queueVoice(() => { camWaitVoiceId = null; announceByMode('cameraWait'); }, 1200);
    try {
      state.stream = await acquireCamera(facing);
      video.srcObject = state.stream;
      /* 端末がスリープした・他アプリに奪われた等でトラックが終わったら、黙って黒画面にせず案内を出す */
      state.stream.getTracks().forEach((t) => {
        t.addEventListener('ended', () => {
          if (!previewRunning) return;
          previewRunning = false;
          showCamFail({ name: 'NotReadableError', message: 'track ended' });
        });
      });
      showCamLoading(false);
      if (camWaitVoiceId) { clearTimeout(camWaitVoiceId); camWaitVoiceId = null; }
      announceByMode('cameraReady'); // 「カメラ、オッケー！」（2026-08-15）
      previewRunning = true;
      previewLoop();
    } catch (err) {
      showCamLoading(false);
      if (camWaitVoiceId) { clearTimeout(camWaitVoiceId); camWaitVoiceId = null; }
      showCamFail(err);
    }
  }
  let camWaitVoiceId = null; // 「じゅんび中」ボイスの遅延タイマー

  /* ===================== カメラ取得（2026-08-14 実機指摘「カメラが起動しないケース」） =====================
     以前は1回きりの getUserMedia。失敗したら 13px の小さな文字が出るだけで、
     撮影スタートは押せるまま＝黒画面のまま4枚撮り切ってしまう可能性があった。
     いまは段階的にフォールバックして「必ず何かのカメラで起動する」ことを狙う:
       ① 希望の向き＋高解像度（従来と同じ。これが通れば見た目は今までどおり）
       ② 希望の向きだけ（解像度の希望を捨てる）
       ③ 反対の向き（背面が無い/使えない端末でも前面で起動する）
       ④ 制約なし（video: true。最後の望み）
     それでも駄目なら、原因ごとに文面を出し分けた案内＋「もう一度ためす」を出す。 */
  function acquireCamera(facing) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const e = new Error('getUserMedia unavailable');
      e.name = 'UnsupportedError';
      return Promise.reject(e);
    }
    const other = facing === 'environment' ? 'user' : 'environment';
    const plans = [
      { video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false },
      { video: { facingMode: { ideal: facing } }, audio: false },
      { video: { facingMode: { ideal: other } }, audio: false },
      { video: true, audio: false },
    ];
    return (async () => {
      let lastErr = null;
      for (const constraints of plans) {
        try {
          return await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err) {
          lastErr = err;
          /* 許可されていない／安全でない文脈は、制約を変えても結果は変わらない。
             無駄に4回試すと案内が出るまで客を待たせるだけなので、ここで打ち切る */
          if (err && (err.name === 'NotAllowedError' || err.name === 'SecurityError')) throw err;
        }
      }
      throw lastErr || new Error('camera unavailable');
    })();
  }

  const camLoadingEl = $('#cam-loading');
  const camFailEl = $('#cam-fail');
  function showCamLoading(on) {
    if (camLoadingEl) camLoadingEl.classList.toggle('hidden', !on);
  }
  function hideCamFail() {
    if (camFailEl) camFailEl.classList.add('hidden');
    if (camError) camError.textContent = '';
  }
  /* 案内文の出し分け（2026-08-14 柄本仕様書 C-1 に従って全面改稿）。
     守る方針は3つ:
       ① **客が実際に取れる行動だけを書く。** 「ブラウザのカメラ許可設定を確認」は
          無人のiPadの前に立った客には実行不可能。文化祭で唯一いつでも取れる行動は
          「係の人を呼ぶ」なので、どの文面も最後は必ずそこへ着地させる
       ② **英語のエラーを客の画面に出さない。** 原因の生データは console.error だけに出す
       ③ この画面の他の文言と同じ口調（ですます調で客に指示しない） */
  function camFailMessage(err) {
    const name = (err && err.name) || '';
    const env = saveEnv(); // 端末判定は保存経路と同じものを使い回す
    const CALL = 'ちかくの 係の人を よんでください🙏';
    const TITLE = 'カメラが うまく始まりませんでした';
    if (!window.isSecureContext) {
      return { title: TITLE, body: CALL };
    }
    if (name === 'UnsupportedError' || name === 'TypeError') {
      return {
        title: 'この画面では カメラが つかえません',
        // アプリ内ブラウザだけは、客が自分の指で直せる（＝書く価値のある）唯一の手順
        body: env.isInApp
          ? 'LINEなどの中で ひらいていると つかえないことがあるよ。画面のすみの「…」から「ブラウザでひらく」を えらんでみてね。それでも だめなら ' + CALL
          : CALL,
      };
    }
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') {
      return { title: TITLE, body: 'カメラを つかう せっていが オフに なっているみたい。' + CALL };
    }
    if (name === 'NotReadableError' || name === 'TrackStartError' || name === 'AbortError') {
      return {
        title: TITLE,
        body: 'ほかの アプリが カメラを つかっているみたい。下の「もう一度ためす」を おして、それでも だめなら ' + CALL,
      };
    }
    if (name === 'NotFoundError' || name === 'DevicesNotFoundError' || name === 'OverconstrainedError') {
      return { title: 'カメラが 見つかりませんでした', body: CALL };
    }
    return { title: TITLE, body: CALL };
  }
  function showCamFail(err) {
    const msg = camFailMessage(err);
    if ($('#cam-fail-title')) $('#cam-fail-title').textContent = msg.title;
    if ($('#cam-fail-body')) $('#cam-fail-body').textContent = msg.body;
    /* 原因の生データは **客の画面には出さない**（柄本 C-1・英語のエラーを客に貼らない）。
       調べるときは console を見る。URLに #debug を付けたときだけ画面にも小さく出す */
    console.error('[camera]', (err && err.name) || 'Error', (err && err.message) || '', err);
    if ($('#cam-fail-detail')) {
      $('#cam-fail-detail').textContent = (location.hash === '#debug' && err)
        ? ('（' + ((err.name || 'Error') + ': ' + (err.message || '')).slice(0, 80) + '）')
        : '';
    }
    if (camFailEl) camFailEl.classList.remove('hidden');
    playAnnounce('cameraError'); // 「あわてなくて だいじょうぶ。かかりの人を よんでね。」（2026-08-15）
    /* 黒画面のまま撮影が始まる事故を止める（4枚とも真っ暗で撮れてしまうため）。
       起動できるまで「撮影スタート」は押させない */
    btnStartShooting.disabled = true;
    if (camError) camError.textContent = '';
  }
  $('#btn-cam-retry').addEventListener('click', () => {
    hideCamFail();
    startCamera();
  });

  function stopCamera() {
    previewRunning = false;
    showCamLoading(false);
    if (camWaitVoiceId) { clearTimeout(camWaitVoiceId); camWaitVoiceId = null; }
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
  /* カウントと撮影のリズム定数（2026-08-13 実機体感指摘対応・オーナーが体感で最終調整する用）:
     - COUNT_INTERVAL_MS: 数字1つの間隔。音の有無・クリップ長に関わらずこの値で一定
       （「3・2・1は早くて良い」＝従来の鳴っている環境の体感値を固定化。クリップ最長0.48秒なので切れない）
     - SHOT_GAP_MS: シャッター→チラ見せ後、ライブ映像に戻してから次のポーズ提案までの
       「構え直す間」。撮れた1枚を見て次のポーズに体を作り直す呼吸（実機指摘「次に行くときに間が欲しい」） */
  const COUNT_INTERVAL_MS = 700;
  const SHOT_GAP_MS = 1500;
  /* SNAP_PREVIEW_MS: シャッター後に撮れた静止画をはっきり見せる時間（2026-08-13 実機指摘
     「撮ったやつを一瞬写して欲しい」対応）。暗背景＋白フチ付きで表示し、ライブ映像と
     ひと目で区別がつく形にする。この後さらに SHOT_GAP_MS のライブ構え直しが入る */
  const SNAP_PREVIEW_MS = 1000;

  /* ポーズ提案ボイス（2026-08-12 新設／2026-08-13 実機指摘修正）: 実機は「テンポのよい
     掛け声とポーズ提案が矢継ぎ早に流れる」（era-designerリサーチ）。
     pose_06（「ラスト！決めポーズ！」）は最終ショット専用のセリフなので
     ランダムの母集団から外す。1〜3枚目は pose_01〜05 を重複なしランダムで消化し、
     4枚目（最終）は必ず pose_06 を流す（2枚目で「ラスト！」が出ていた実機指摘の修正）。 */
  const POSE_KEYS = ['pose1', 'pose2', 'pose3', 'pose4', 'pose5'];
  const POSE_LAST_KEY = 'pose6'; // 最終ショット専用「ラスト！決めポーズ！」
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

  /* ポーズ提案の吹き出し（2026-08-12 デザイン刷新・柄本仕様書3-5）:
     文言が変わるたびにポンと出る（平成）／静かにフェードイン（令和）。CSSがテーマ別に演出する */
  function setPoseGuide(text) {
    const el = $('#pose-guide');
    el.textContent = text;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }

  // 絶対時刻まで待つ（相対sleepの積み残しでリズムが延びない）
  function sleepUntil(t) {
    const d = t - performance.now();
    return d > 0 ? sleep(d) : Promise.resolve();
  }

  async function runCountdown(shotIndex, opts) {
    const { skipIntro = false, poseKey = null } = opts || {};
    const isHeiseiTheme = document.body.classList.contains('theme-heisei');
    // 前置き（1枚目いくよー等）。撮り直しのときは飛ばしてテンポを保つ
    if (!skipIntro) await playSoundAwait('introShot' + (shotIndex + 1), 1100);
    // ポーズ提案ボイス（ファイル未着なら黙ってスキップ）
    if (poseKey) await playSoundAwait(poseKey, 1300);
    /* 数字のリズムは完全な固定値 COUNT_INTERVAL_MS（2026-08-13 実機体感指摘対応）:
       以前は「クリップ実測長＋固定の間合い」だったため、実機で音声が使えない・
       メタデータが取れない場合に枠が短縮方向へ働き、カウントが「せっかち」になっていた。
       間隔は音の有無・クリップ長と無関係の定数にし、絶対時刻で消化する
       （音は各数字の表示と同時に鳴り始めるだけ。リズムを音から導出しない）。 */
    let base = performance.now();
    for (const step of COUNTDOWN_STEPS) {
      // 数字は1文字ごとのspanに分解（平成: 互い違いの傾き＝柄本仕様書3-5。文言は内部定数なので安全）
      countdownEl.innerHTML = [...step.label].map(c => `<span class="cd-ch">${c}</span>`).join('');
      countdownEl.style.opacity = '1';
      countdownEl.style.transform = 'scale(1.15)';
      // 平成: 数字が出るたび一瞬の白フラッシュ
      if (isHeiseiTheme) {
        flashCanvas.style.transition = 'none';
        flashCanvas.style.opacity = '0.35';
        setTimeout(() => {
          flashCanvas.style.transition = 'opacity .12s ease';
          flashCanvas.style.opacity = '0';
        }, 50);
      }
      /* 音声は数字表示と同時に開始（endedは待たない）。
         2026-08-13 実機指摘「3・2・1だけ鳴らない」の修正: 以前は voiceGaveUp が
         立っていると再生自体を諦めていた。voiceGaveUp は直前の前置き/ポーズボイスの
         「ended待ちの保険タイムアウト」でも立つ（実機でメタデータ未取得だと
         保険が1.5秒で誤発動しうる）ため、その巻き添えでカウント4本だけが無音になっていた。
         voiceGaveUp は「待たない」の印であって「鳴らさない」の印ではない。
         再生は常に試みる（playSoundAwait の gaveUp 分岐と同じ扱い）。
         muted=false も明示する（unlockAudio の解錠が残っても消音で鳴らないことがないように） */
      if (!waPlay(step.key)) {
        // WebAudioが使えない環境だけ従来のHTMLAudioで鳴らす（こちらも声のバス経由・2026-08-17）
        playVoice(step.key);
      }
      await sleep(60);
      countdownEl.style.transform = 'scale(1)';
      base += COUNT_INTERVAL_MS - 100; // 数字の表示時間（間隔の残り100msは数字が消えている間）
      await sleepUntil(base);
      countdownEl.style.opacity = '0';
      base += 100;
      await sleepUntil(base);
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

  /* 撮れた静止画のチラ見せ（2026-08-13 実機指摘「撮ったやつを一瞬写して欲しい」対応）:
     以前は撮影データを全面に0.5秒描くだけで、①飛行中のプレビューフレームに上書きされる
     ②ライブ映像と見分けがつかない、の二重の理由で実機では認識できなかった。
     - previewDrawEpoch を進めて飛行中フレームを無効化（上書きの根絶）
     - 暗背景＋ポラロイド風の白フチで「静止画が撮れた」とひと目で分かる見た目にする
     - 文字は描かない（前面カメラはCSSで左右反転表示されるため、文字が鏡文字になる。
       「とれた〜！」の一言はポーズ吹き出し（DOM側・反転しない）が担当する） */
  function showSnapPreview(shot) {
    previewRunning = false;
    previewDrawEpoch++; // これ以降、飛行中のライブフレームは previewCtx に描かれない
    const ctx = previewCtx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 暗幕（ライブ映像との明確な区別）
    ctx.fillStyle = '#241d21';
    ctx.fillRect(0, 0, SHOT_W, SHOT_H);
    // ポラロイド風の白フチ（下だけ厚い）＋影
    const m = 34, bottom = 62;
    ctx.shadowColor = 'rgba(0,0,0,.55)';
    ctx.shadowBlur = 26;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, m - 12, m - 12, SHOT_W - (m - 12) * 2, SHOT_H - (m - 12) - (bottom - 24), 6);
    ctx.fill();
    ctx.shadowBlur = 0;
    // 写真本体。前面カメラはCSS反転表示を相殺するため左右反転して描く（従来と同じ扱い）
    const px = m, py = m, pw = SHOT_W - m * 2, ph = SHOT_H - m - bottom;
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();
    if (state.shotMode !== 'full') {
      ctx.translate(SHOT_W, 0);
      ctx.scale(-1, 1);
    }
    drawCover(ctx, shot, state.shotMode !== 'full' ? SHOT_W - px - pw : px, py, pw, ph);
    ctx.restore();
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
    note.textContent = 'しるしのところに 立ってね！';
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

  btnStartShooting.addEventListener('click', async () => {
    voiceGaveUp = false; // 環境は直っていることがある。撮影のたびに音声へ再挑戦する
    btnStartShooting.disabled = true;
    btnStartShooting.style.display = 'none';
    $('#btn-back-select').style.display = 'none'; // 撮影開始後は実機同様戻れない
    const poseGuideEl = $('#pose-guide');
    if (state.shotMode === 'full') {
      setPoseGuide('じゅんびちゅう…');
      await runPrepCountdown();
      setPoseGuide(poseGuideIdle());
    }
    resetPoseOrder();
    /* 実機のテンポ: 撮ったら次へ矢継ぎ早に流れる。確認・撮り直しは無し
       （2026-08-12 オーナー指摘対応で「この画像でオッケー？！」確認を撤去。
       　柄本リサーチどおり、実機は撮影中に立ち止まる操作を挟まない） */
    for (let i = 0; i < NUM_SHOTS; i++) {
      setPoseGuide(poseGuides()[i] || poseGuideIdle());
      /* 前置きボイス（「◯枚目いくよー」）は1枚目だけ。2枚目以降はポーズ提案ボイスが
         そのまま号令になる（毎枚2秒前後の前置きはテンポを殺す・実機は矢継ぎ早） */
      /* 最終ショットは必ず pose_06（ラスト！決めポーズ！）。途中の枚では絶対に出さない（2026-08-13 実機指摘） */
      await runCountdown(i, { skipIntro: i > 0, poseKey: i === NUM_SHOTS - 1 ? POSE_LAST_KEY : nextPoseKey() });
      const shot = captureFrame();
      playSound('seShutter');
      await flash();

      // 撮った1枚をその場でしっかり見せる（実機の「今の撮れた！」感・2026-08-13 演出強化）
      showSnapPreview(shot);
      setPoseGuide('📸 とれた〜！');
      state.shots.push(shot);
      shotIndicator.children[i].classList.add('done');
      $('#shots-left').textContent = Math.max(0, NUM_SHOTS - state.shots.length);
      await sleep(SNAP_PREVIEW_MS); // 撮れた静止画をはっきり見せる間
      if (i < NUM_SHOTS - 1) {
        previewRunning = true;
        previewLoop();
        /* ショット間の「構え直す間」（2026-08-13 実機体感指摘「次に行くときに間が欲しい」）:
           ライブ映像に戻してから SHOT_GAP_MS 置いて、次のポーズ提案ボイスへ。
           撮れた1枚を見て、鏡（プレビュー）で次のポーズに体を作り直す呼吸 */
        await sleep(SHOT_GAP_MS);
      }
    }
    // モードで出し分ける（2026-08-15【軽微⑦】。ここだけ平成の文言を直書きしていた）
    setPoseGuide(poseGuideIdle());
    stopCamera();
    if (state.mode === 'heisei') {
      // 平成モードに盛り調整（デカ目・美肌スライダー等）は存在しない時代。
      // 初代プリ機の「低画素カメラで写りが良く見える」を固定の軽い補正で再現し、そのまま落書きへ
      // 暗室風の「げんぞうちゅう…」演出（柄本仕様書3-6【平】。絵文字はやめCSSでフィルム帯を描く）
      $('#darkroom').classList.remove('hidden');
      // 現像中は右パネル（のこりポーズ・吹き出し）を消す（qa-tester検収指摘4）
      document.querySelector('.camera-stage').classList.add('developing');
      await sleep(60); // オーバーレイを描画させてから重い現像処理へ
      await finishHeiseiProcessing();
      document.querySelector('.camera-stage').classList.remove('developing');
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

  // ワープ（デカ目・小顔・小鼻）のみを適用したキャンバスを返す
  function warpShot(srcCanvas, faces, eyeS, faceS, noseS, eyeType) {
    noseS = noseS || 0;
    eyeType = eyeType || 1;
    const w = srcCanvas.width, h = srcCanvas.height;
    const work = document.createElement('canvas');
    work.width = w; work.height = h;
    const workCtx = work.getContext('2d', { willReadFrequently: true });
    workCtx.drawImage(srcCanvas, 0, 0);

    if (faces && faces.length && (eyeS > 0 || faceS > 0 || noseS > 0)) {
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
          /* パーツTYPE 2択（2026-08-14・FLASH 2026の「パーツTYPE」の再現）:
             TYPE01=くっきり（従来の拡大のみ）／TYPE02=たれ目（目尻を下外へ流す）。
             目尻の外向きはランドマークの左右でなく「虹彩中心から見た向き」で決める
             （前面カメラの鏡像保存でも破綻しない） */
          if (eyeType === 2) {
            [[lmToPx(lm[33], w, h), li, lw], [lmToPx(lm[263], w, h), ri, rw]].forEach(([corner, iris, ew]) => {
              const dir = Math.sign(corner.x - iris.x) || 1;
              directionalWarp(work, corner.x, corner.y, ew * 0.9, dir * eyeS * ew * 0.06, eyeS * ew * 0.16);
            });
          }
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
        if (noseS > 0) {
          /* 小鼻（2026-08-13 実機テスト要望）: 現行実機の「鼻筋・小鼻」補正の小鼻側。
             鼻翼の外側点（129=左・358=右）を鼻の中心軸へ寄せて鼻幅を細くする。
             小顔と同じ directionalWarp パイプライン。強度MAXで鼻幅が約8〜10%細くなる目安 */
          const nl = lmToPx(lm[129], w, h);
          const nr = lmToPx(lm[358], w, h);
          const nw2 = dist(nl, nr);
          if (nw2 > 4) {
            const midX = (nl.x + nr.x) / 2;
            [nl, nr].forEach((pt) => {
              const dir = (midX - pt.x) >= 0 ? 1 : -1; // 中心軸へ向かう向き
              /* 効かせる範囲を鼻翼まわりに絞る（2026-08-14 モニター指摘「鼻が無くなりすぎる」）。
                 半径0.75→0.45: 広いと鼻筋や頬まで一緒に引っぱられ、鼻の稜線が消えて
                 「鼻が無い」顔になる。移動量0.20→0.13: 実機のプリも鼻は小さくなるが
                 輪郭は残っている。「小さくはなるが、ぼやけない」を狙う値。 */
              directionalWarp(work, pt.x, pt.y, nw2 * 0.45, dir * noseS * nw2 * 0.13, 0);
            });
          }
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
      /* 明るさ: 白のソフトライト合成＝トーンカーブの中間調リフト（2026-08-12 再設計）。
         以前は白のスクリーン合成だったが、あれは黒まで一律に浮かせる＝画面全体に
         白いモヤがかかり「ただ曇っただけ」になる（オーナー指摘）。
         ソフトライトの白は 黒(0)→0・白(255)→255 を固定したまま中間調だけを
         持ち上げる（正確には v→v+α(√v−v)）ので、明るくなっても霞まない。 */
      ctx.globalCompositeOperation = 'soft-light';
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
    /* エッジ判定のしきい値（輝度分散）。小さいほどエッジを残す。
       110→55（2026-08-14 モニター指摘「各パーツの輪郭がクリアだった気がする」）:
       肌のムラは今までどおりならすが、鼻筋・小鼻の際・唇の稜線といった
       「形を決めている段差」は残す。肌をきれいにすることと、顔を溶かすことは別。 */
    const eps = 55;
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
    applyToneFx(gctx, w, h, { bright: 0.40 }); // 中間調リフト（bright再設計に伴いソフトライト量へ換算）
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
    const work = preWarped || warpShot(srcCanvas, faces, eyeS, params.face / 100, (params.nose || 0) / 100, params.eyeType || 1);

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
          /* 美白: 白をマスク越しにソフトライト合成（2026-08-12 再設計）。
             スクリーン合成は肌の影まで一律に持ち上げて灰色に霞むため、
             黒点を固定したまま中間調だけ上げるソフトライトへ（明るく・霞まない・血色を残す） */
          layerCtx.globalCompositeOperation = 'source-over';
          layerCtx.clearRect(0, 0, w, h);
          layerCtx.fillStyle = '#ffffff';
          layerCtx.fillRect(0, 0, w, h);
          layerCtx.globalCompositeOperation = 'destination-in';
          layerCtx.drawImage(mask, 0, 0);
          layerCtx.globalCompositeOperation = 'source-over';
          outCtx.globalCompositeOperation = 'soft-light';
          outCtx.globalAlpha = Math.min(1, whiteS * tone.brightPerUnit * 5.5);
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
          bright: whiteS * tone.brightPerUnit * 2.5, // ソフトライト量へ換算（2026-08-12 bright再設計）
          desat: whiteS * tone.desatPerUnit,
        });
      }
    }

    // チーク＆リップ（顔ランドマークベースのメイク）
    drawMakeup(outCtx, faces, w, h, (params.cheek || 0) / 100, (params.lip || 0) / 100, conf);
    if ((params.namida || 0) > 0) drawNamida(outCtx, faces, w, h, (params.namida || 0) / 100);

    // 選択フィルター
    const selFilter = conf.filters.find(f => f.id === params.filter);
    if (selFilter && selFilter.fx && Object.keys(selFilter.fx).length) {
      applyToneFx(outCtx, w, h, selFilter.fx);
    }
    // 脚長（piemo型・全身コース専用・2026-08-14）: 顔検出不要の最終ジオメトリ処理
    if ((params.legs || 0) > 0 && state.shotMode === 'full') stretchLegsInPlace(out, (params.legs || 0) / 100);
    return out;
  }

  /* 涙袋レタッチ（FLASH 87種の型・2026-08-14）: 下まぶたの少し下に、目の傾きに沿った
     横長のやわらかいハイライト帯をscreen合成で乗せる。輪郭warpは使わない（精度リスク回避） */
  function drawNamida(outCtx, faces, w, h, s) {
    if (!faces || !faces.length || s <= 0) return;
    faces.forEach((lm) => {
      if (!lm || lm.length < 468) return;
      [[145, 33, 133], [374, 362, 263]].forEach(([lowIdx, aIdx, bIdx]) => {
        const low = lmToPx(lm[lowIdx], w, h);
        const a = lmToPx(lm[aIdx], w, h), b = lmToPx(lm[bIdx], w, h);
        const ew = dist(a, b);
        if (ew < 4) return;
        const ang = Math.atan2(b.y - a.y, b.x - a.x); // 目の傾き（鏡像でも軸で取るので破綻しない）
        outCtx.save();
        outCtx.translate(low.x, low.y + ew * 0.20);
        outCtx.rotate(ang);
        outCtx.scale(1, 0.34); // 横長の帯にする
        const g = outCtx.createRadialGradient(0, 0, 0, 0, 0, ew * 0.55);
        g.addColorStop(0, 'rgba(255,244,240,' + (0.42 * s).toFixed(3) + ')');
        g.addColorStop(0.6, 'rgba(255,236,232,' + (0.20 * s).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(255,236,232,0)');
        outCtx.globalCompositeOperation = 'screen';
        outCtx.fillStyle = g;
        outCtx.beginPath();
        outCtx.arc(0, 0, ew * 0.55, 0, Math.PI * 2);
        outCtx.fill();
        outCtx.restore();
      });
    });
  }

  /* 脚長バー（piemo型）: 腰のラインを保ったまま下半身だけ縦に伸ばす。
     MAXで画面高の約10%ぶん脚が長くなる（上半身はわずかに圧縮される） */
  function stretchLegsInPlace(canvas, s) {
    const w = canvas.width, h = canvas.height;
    const pivot = Math.round(h * 0.52);
    const lift = Math.round(h * 0.10 * s);
    if (lift < 1) return;
    const tmp = document.createElement('canvas');
    tmp.width = w; tmp.height = h;
    tmp.getContext('2d').drawImage(canvas, 0, 0);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(tmp, 0, 0, w, pivot, 0, 0, w, pivot - lift);
    ctx.drawImage(tmp, 0, pivot, w, h - pivot, 0, pivot - lift, w, h - pivot + lift);
  }

  // チーク＆リップの描画（本加工とライブ盛れプレビューの共通処理・2026-07-31切り出し）
  function drawMakeup(outCtx, faces, w, h, cheekS, lipS, conf) {
    if (faces && faces.length && (cheekS > 0 || lipS > 0)) {
      faces.forEach((lm) => {
        if (!lm || lm.length < 468) return;
        const fw = dist(lmToPx(lm[234], w, h), lmToPx(lm[454], w, h));
        if (cheekS > 0) {
          // 頬の中心（205/425）にふんわり円形グラデーション
          /* 2026-08-13 実機テスト要望: 100%でも「ほんのり」だったため効きを約2倍に再スケール
             （旧: 単層 alpha cheekS*0.32 → 新: 芯0.38+外周0.24の2層で中心合計約0.62。
             最近のチーク流行に合わせ、MAXでははっきり分かる濃さ。単層でalphaだけ上げると
             縁が急に切れて円が見えるため、半径違いの2層で外へ柔らかく減衰させる） */
          [lm[205], lm[425]].forEach((pt) => {
            const c = lmToPx(pt, w, h);
            [{ r: fw * 0.17, a: cheekS * 0.38 }, { r: fw * 0.24, a: cheekS * 0.24 }].forEach(({ r, a }) => {
              const grad = outCtx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
              grad.addColorStop(0, conf.makeup.cheek);
              grad.addColorStop(1, 'rgba(255,255,255,0)');
              outCtx.save();
              outCtx.globalAlpha = Math.min(1, a);
              outCtx.fillStyle = grad;
              outCtx.beginPath();
              outCtx.arc(c.x, c.y, r, 0, Math.PI * 2);
              outCtx.fill();
              outCtx.restore();
            });
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
  const beautyFaceNoteHead = $('#beauty-face-note-head');
  const beautyFaceNoteBody = $('#beauty-face-note-body');
  /* 顔まわりの案内の出し方（2026-08-15 検見の総合検収【要修正④】）。
     v24でこの案内を「何がきかないか」まで書く形に改稿したところ、1行が5行に伸び、
     プレビュー写真の21〜35%を覆っていた（しかも出るのは、顔が取れず不安な回）。
     いまはプレビューの **外（下）** に置き、見出し1行＋畳んだ詳細の形にしてある。
     text だけで呼べば1行の帯、detail を添えれば「▼くわしく」で開く形になる。 */
  function setFaceNote(head, detail) {
    beautyFaceNoteHead.textContent = head;
    beautyFaceNoteBody.textContent = detail || '';
    beautyFaceNote.classList.toggle('no-detail', !detail);
    if (!detail) beautyFaceNote.open = false;
    beautyFaceNote.classList.remove('hidden');
  }
  function hideFaceNote() {
    beautyFaceNote.open = false;
    beautyFaceNote.classList.add('hidden');
  }

  const sliderSkin = $('#slider-skin');
  const sliderWhite = $('#slider-white');
  const sliderClear = $('#slider-clear');
  const sliderEye = $('#slider-eye');
  const sliderFace = $('#slider-face');
  const sliderNose = $('#slider-nose');
  const sliderCheek = $('#slider-cheek');
  const sliderLip = $('#slider-lip');
  const sliderNamida = $('#slider-namida');
  const sliderLegs = $('#slider-legs');

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
  const warpCache = { idx: -1, eye: -1, face: -1, nose: -1, eyeType: 1, facesRef: null, skinConfRef: null, canvas: null, base: null };

  function renderBeautyPreview() {
    const idx = state.beautySelected;
    const src = state.shots[idx];
    if (!src) return;
    const p = curBeauty();
    const faces = state.faceData[idx];
    const skinConfRef = state.skinConf[idx] || null;
    if (warpCache.idx !== idx || warpCache.eye !== p.eye || warpCache.face !== p.face || warpCache.nose !== (p.nose || 0)
        || warpCache.eyeType !== (p.eyeType || 1) || warpCache.facesRef !== faces || warpCache.skinConfRef !== skinConfRef) {
      warpCache.canvas = warpShot(src, faces, p.eye / 100, p.face / 100, (p.nose || 0) / 100, p.eyeType || 1);
      const mask = getSkinMask(idx, src, faces, p.eye / 100);
      warpCache.base = (mask && !maskIsEmpty(mask)) ? buildBeautyBase(warpCache.canvas, mask) : null;
      warpCache.idx = idx;
      warpCache.eye = p.eye;
      warpCache.face = p.face;
      warpCache.nose = p.nose || 0;
      warpCache.eyeType = p.eyeType || 1;
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
    sliderNose.value = p.nose || 0;
    sliderCheek.value = p.cheek || 0;
    sliderLip.value = p.lip || 0;
    sliderNamida.value = p.namida || 0;
    sliderLegs.value = p.legs || 0;
    $('#val-skin').textContent = p.skin;
    $('#val-white').textContent = p.white || 0;
    $('#val-clear').textContent = p.clear || 0;
    $('#val-eye').textContent = p.eye;
    $('#val-face').textContent = p.face;
    $('#val-nose').textContent = p.nose || 0;
    $('#val-cheek').textContent = p.cheek || 0;
    $('#val-lip').textContent = p.lip || 0;
    $('#val-namida').textContent = p.namida || 0;
    $('#val-legs').textContent = p.legs || 0;
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
  function markEyeType(t) {
    document.querySelectorAll('#eye-type-row .eyetype-btn').forEach(b => b.classList.toggle('active', Number(b.dataset.eyetype) === (t || 1)));
  }
  // パーツTYPE 2択（2026-08-14）: いま見ている1枚に適用（一括反映ボタンで全枚コピーされる）
  document.querySelectorAll('#eye-type-row .eyetype-btn').forEach(b => {
    b.addEventListener('click', () => {
      curBeauty().eyeType = Number(b.dataset.eyetype);
      markEyeType(curBeauty().eyeType);
      queueBeautyRender();
    });
  });

  function syncBeautyUIFromCur() {
    const p = curBeauty();
    syncSliders();
    markPresetActive(p._preset || '');
    markLevelActive(p._level || '');
    markFilterActive(p.filter);
    markEyeType(p.eyeType || 1);
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
    p.nose = clamp(preset.nose || 0);
    p.cheek = clamp(preset.cheek);
    p.lip = clamp(preset.lip);
  }

  function buildBeautyControls() {
    const conf = modeConf();
    // 盛れ感プリセット
    const presetRow = $('#beauty-preset-row');
    presetRow.innerHTML = '';
    // 平成にpresetsは無い（盛り画面はスキップされる）。デバッグフック等で来ても落ちないように空扱い
    (conf.presets || []).forEach(p => {
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
        const basePreset = (conf.presets || []).find(x => x.id === (cur._preset || conf.defaultPreset)) || (conf.presets || [])[0];
        if (!basePreset) return; // 平成にpresetsは無い（盛り画面はスキップされる）
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

  /* メイクりれき（Bloomit型・2026-08-14）: 前回保存したレタッチ設定を4枚全部へワンタッチ再現 */
  $('#btn-makeup-history').addEventListener('click', () => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('purikura.makeupHistory.v1')); } catch (e) { /* 壊れた保存は無視 */ }
    if (!saved) return;
    const list = Array.isArray(saved) ? saved : [saved];
    if (state.beautyShots) {
      state.beautyShots = state.beautyShots.map((cur, i) => ({ ...cur, ...(list[i] || list[0]) }));
    } else {
      state.beauty = { ...state.beauty, ...list[0] };
    }
    syncBeautyUIFromCur();
    queueBeautyRender();
    setFaceNote('🕘 前回の盛れ設定を再現したよ！');
    setTimeout(hideFaceNote, 1800);
  });

  /* さいしょに もどす（2026-08-17 指摘⑧）: いま見ている1枚を、盛り画面に入った時点へ戻す。
     この画面の他の操作はすべて「いま見ている1枚」に効くので、戻す単位もそれに合わせる
     （4枚まとめて戻すと、気に入っている残り3枚まで巻き添えになる）。 */
  let beautyInitial = null;
  $('#btn-beauty-reset').addEventListener('click', () => {
    if (!state.beautyShots || !beautyInitial) return;
    const i = state.beautySelected || 0;
    state.beautyShots[i] = { ...(beautyInitial[i] || beautyInitial[0]) };
    playSoundOr('moriageSelect', 'seDecide');
    syncBeautyUIFromCur();
    queueBeautyRender();
    setFaceNote(`🔄 ${i + 1}まいめを さいしょに もどしたよ`);
    setTimeout(hideFaceNote, 1800);
  });

  /* 一括反映（FLASH式・2026-08-12）: いま見ている1枚の盛り設定を4枚全部へコピーする */
  $('#btn-beauty-apply-all').addEventListener('click', () => {
    if (!state.beautyShots) return;
    const src = curBeauty();
    state.beautyShots = state.beautyShots.map(() => ({ ...src }));
    playSoundOr('moriageSelect', 'seDecide');
    setFaceNote('💫 4まい ぜんぶ おなじにしたよ！');
    setTimeout(hideFaceNote, 1800);
  });

  [[sliderSkin, 'skin'], [sliderWhite, 'white'], [sliderClear, 'clear'], [sliderEye, 'eye'], [sliderFace, 'face'], [sliderNose, 'nose'], [sliderCheek, 'cheek'], [sliderLip, 'lip'], [sliderNamida, 'namida'], [sliderLegs, 'legs']].forEach(([el, key]) => {
    el.addEventListener('input', () => {
      // はじめてバーを触ったときだけ、こまかい項目があることを教える（2026-08-15・令和のみ）
      if (state.mode !== 'heisei') announceOnce('beautyParts', 'beautyPartsR');
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

  /* ---------- 顔まかせのバーを「触れない状態」にする（2026-08-15 検見 要修正3） ----------
     顔が取れない回（MediaPipe未読込・横向き・逆光・マスク）は、デカ目・小顔・小鼻・涙袋・
     目のかたち が**まったく効かない**。それまでは押せてつまみも動き数値も変わるのに
     絵だけ1ピクセルも変わらず、客には「このアプリ壊れてる」に見えていた。
     案内文を出すだけでは足りない（中高生は文章より先に手が動く）ので、実際に触れなくする。 */
  const FACE_ONLY_SLIDERS = ['eye', 'face', 'nose', 'namida'];
  function setFaceSlidersEnabled(on) {
    FACE_ONLY_SLIDERS.forEach(key => {
      const el = document.getElementById('slider-' + key);
      if (!el) return;
      el.disabled = !on;
      const group = el.closest('.slider-group');
      if (group) group.classList.toggle('face-unavailable', !on);
    });
    const eyeRow = $('#eye-type-row');
    if (eyeRow) {
      eyeRow.classList.toggle('face-unavailable', !on);
      eyeRow.querySelectorAll('.eyetype-btn').forEach(b => { b.disabled = !on; });
    }
    const eyeRowLabel = eyeRow && eyeRow.previousElementSibling;
    if (eyeRowLabel && eyeRowLabel.classList.contains('tool-label')) {
      eyeRowLabel.classList.toggle('face-unavailable', !on);
    }
  }

  /* モデルが読めなかったときの再挑戦（2026-08-15・検見 要修正4）。
     失敗フラグに期限を入れただけでは、この画面は最初の1回しか呼ばないので客には届かない。
     盛りタイムは2分あるので、そのあいだ静かに取りに行き直す。取れたら顔検出をやり直して
     バーを生き返らせる（客の操作は要らない）。 */
  let faceRetryId = null;
  /* 🚨 tries は setInterval の外に置く。中で `let tries = 0` にすると、
     再挑戦の中から detectFacesForShots → startFaceRetry と戻ってきたときに
     0へ戻り、上限が効かず永久に回り続ける（2026-08-15 実装時に自分で踏んだ） */
  let faceRetryTries = 0;
  const FACE_RETRY_EVERY_MS = 13000;
  const FACE_RETRY_MAX = 5;
  function stopFaceRetry() {
    if (faceRetryId) { clearInterval(faceRetryId); faceRetryId = null; }
  }
  function startFaceRetry() {
    if (faceRetryId) return; // 既に回っているなら数え直さない
    faceRetryId = setInterval(async () => {
      // 盛り画面を離れていたら止める（次の客の回まで走り続けさせない）
      if (!screens['screen-beauty'].classList.contains('active')) { stopFaceRetry(); return; }
      if (faceLandmarker) { stopFaceRetry(); return; }
      if (++faceRetryTries > FACE_RETRY_MAX) { stopFaceRetry(); return; }
      await detectFacesForShots();
    }, FACE_RETRY_EVERY_MS);
  }

  async function detectFacesForShots() {
    // 顔ランドマークとML肌セグメンテーションを並行で準備
    await Promise.all([initFaceLandmarker(), initSkinSegmenter()]);
    if (!faceLandmarker) {
      // 何がきかないかを、客が触るバーの名前で言う（B-4・2026-08-15 柄本仕様書）。
      // 見出しは1行・詳しい話は畳む（2026-08-15【要修正④】。写真を覆わない）
      setFaceNote('デカ目・小顔は 今回きかないよ',
        '美肌・美白・透明感・チーク・リップは ちゃんときくよ！ネットがもどれば デカ目・小顔も じどうで つかえるようになるよ。');
      setFaceSlidersEnabled(false);
      startFaceRetry(); // 電波が戻ったら勝手に復活する（肌マスクの取得は下でそのまま続ける）
    } else {
      stopFaceRetry();
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
      setFaceNote('お顔が 見つからなかったよ…',
        'デカ目・小顔・小鼻・涙袋は きかないけど、美肌・美白・透明感・チーク・リップは きくよ！');
      setFaceSlidersEnabled(false);
    } else if (faceLandmarker) {
      hideFaceNote();
      setFaceSlidersEnabled(true);
    }
    queueBeautyRender();
  }

  function startBeautyScreen() {
    showScreen('screen-beauty');
    playAnnounce('beauty'); // 案内は1本チャンネル経由（前画面の案内が残っていても止まる）
    // 令和は続けて「盛れ感レベルは三だんかい」（2026-08-15。平成に盛り画面は無い）
    if (state.mode !== 'heisei') chainAnnounce('beauty', 'moriageLevelR');
    // 脚長バーは全身コースのときだけ出す（アップコースでは意味が無い・piemo型）
    const legsRow = $('#row-legs');
    if (legsRow) legsRow.style.display = state.shotMode === 'full' ? '' : 'none';
    // メイクりれき: 前回の保存があるときだけボタンを出す
    const histBtn = $('#btn-makeup-history');
    if (histBtn) {
      let has = false;
      try { has = !!localStorage.getItem('purikura.makeupHistory.v1'); } catch (e) { /* 読めない環境では出さない */ }
      histBtn.classList.toggle('hidden', !has);
      /* ボタンを出したときだけ案内する（2026-08-15）。beauty→moriageLevel の
         あとに来るよう、りれきがある回はさらに後ろへ繋ぐ */
      if (has) chainAnnounce('moriageLevelR', 'makeupHistoryR');
    }
    state.beautySelected = 0;
    state.beautyRemaining = BEAUTY_SECONDS;
    state.beautyWarned = false;
    /* 1枚ごとの盛り設定を初期化: 撮影時のライブ盛れ設定（state.beauty）を4枚分に複製。
       撮影時の設定がどのプリセットと一致するかを調べてUIメモも入れておく */
    const conf = modeConf();
    const matched = (conf.presets || []).find(p =>
      ['skin', 'white', 'clear', 'eye', 'face', 'nose', 'cheek', 'lip'].every(k => (state.beauty[k] || 0) === (p[k] || 0)));
    state.beautyShots = Array.from({ length: NUM_SHOTS }, () => ({
      ...state.beauty,
      _preset: matched ? matched.id : '',
      _level: matched ? 'l100' : '',
    }));
    /* 「さいしょに もどす」用の控え（2026-08-17 JKモニター指摘⑧
       「加工した後に最初に戻すボタンが欲しい」）。落書き側には「ぜんぶ消す」があるのに、
       盛り側には戻り道が1つも無かった——バーを10本動かしたあと元の顔に戻す手段が
       無いというのは、触るのが怖くなるということ。ここで撮影直後の状態を控えておく。 */
    beautyInitial = JSON.parse(JSON.stringify(state.beautyShots));
    setFaceNote('👀 お顔を さがしてるよ…'); // B-6: 「検出」を客に見せない
    setFaceSlidersEnabled(true); // 前の客の回で無効化されたままにならないよう毎回戻す
    stopFaceRetry();
    faceRetryTries = 0; // 回ごとに再挑戦の回数をリセット（前の客の分を持ち越さない）
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
    stopFaceRetry(); // モデルの取り直しは画面を出るときに必ず止める（2026-08-15）
    if (state.beautyTimerId) clearInterval(state.beautyTimerId);
    /* メイクりれき（Bloomit型・2026-08-14）: レタッチの設定値だけをこの端末のlocalStorageへ保存。
       写真・氏名等の個人情報は一切保存しない（守屋ライン: 端末外への送信もゼロ）。次回の盛り画面で
       「まえの盛れを再現」ボタンとして出てくる */
    try {
      localStorage.setItem('purikura.makeupHistory.v1', JSON.stringify(state.beautyShots || [state.beauty]));
    } catch (e) { /* プライベートブラウズ等で保存できない場合は何もしない */ }
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

  /* ---------- シールのセルへの「おさまり方」（2026-08-17 JKモニター指摘②） ----------
     指摘は「4分割のときに写真が切れちゃうのが悲しい」。実測すると理屈どおりだった:

       4分割 のセルは 301×349（たて長）／写真は 640×480（よこ長）
       → 中央クロップで **横の35%（左右に113pxずつ）が捨てられる**
       16分割 155×179 も同じ比率。まる4は正円なので更に切れる
       （6分割だけは 313×235 ＝ ちょうど4:3 で切れない）

     たて長のマスによこ長の写真を入れる以上、どこかは切れる。できることは3つで、
     令和はそれを**客に選ばせる**（平成は実機どおり中央クロップ固定＝ここは触らない）:
       face    … 顔の位置に合わせて切り取り位置をずらす（既定。顔が取れない回は中央）
       center  … 従来どおり中央
       contain … 切らずに全部入れる（上下によはくが出る）

     🚨 落書きは写真の原寸(640×480)キャンバスに描かれ、シールへは同じ変換で載る。
     写真と落書きは **必ず同じ関数・同じ引数** を通すこと（片方だけ変えるとズレる）。 */
  const PHOTO_FITS = [
    { id: 'face', label: '顔に あわせる', hint: 'お顔が 切れないように よせるよ' },
    { id: 'center', label: 'まんなか', hint: 'しゃしんの まんなかを 切り取るよ' },
    { id: 'contain', label: 'ぜんぶ 入れる', hint: '切らずに ぜんぶ 入れる（よはくが 出るよ）' },
  ];
  const photoFit = () => (state.mode === 'heisei' ? 'center' : (state.photoFit || 'face'));

  /* その写真で「切りたくない中心」を返す（0〜1の正規化座標）。顔が取れなければ null。
     顔の高さの2割ぶん上に寄せる: 前髪と髪の生えぎわが落ちると別人に見えるため */
  function shotFocus(i) {
    const faces = state.faceData && state.faceData[i];
    if (!faces || !faces.length) return null;
    let minX = 1, minY = 1, maxX = 0, maxY = 0;
    faces.forEach((pts) => {
      if (!pts || !pts.length) return;
      pts.forEach((p) => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
    });
    if (!(maxX > minX) || !(maxY > minY)) return null;
    return { x: (minX + maxX) / 2, y: Math.max(0, (minY + maxY) / 2 - (maxY - minY) * 0.20) };
  }

  /* セルへ1枚ぶんを描く。shotIdx は「顔に あわせる」で顔の位置を引くための撮影順インデックス。
     bg を渡すと「ぜんぶ入れる」のよはくをその色で塗る（渡さなければ透明のまま） */
  function drawShotFit(ctx, img, x, y, w, h, shotIdx, bg) {
    const sw = img.videoWidth || img.width, sh = img.videoHeight || img.height;
    if (!sw || !sh) { ctx.drawImage(img, x, y, w, h); return; }
    const fit = photoFit();
    if (fit === 'contain') {
      if (bg) { ctx.save(); ctx.fillStyle = bg; ctx.fillRect(x, y, w, h); ctx.restore(); }
      const s = Math.min(w / sw, h / sh);
      const dw = sw * s, dh = sh * s;
      ctx.drawImage(img, 0, 0, sw, sh, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
      return;
    }
    const scale = Math.max(w / sw, h / sh);
    const cw = w / scale, ch = h / scale;
    let sx = (sw - cw) / 2, sy = (sh - ch) / 2;
    if (fit === 'face') {
      const f = shotFocus(shotIdx);
      if (f) {
        sx = Math.max(0, Math.min(sw - cw, f.x * sw - cw / 2));
        sy = Math.max(0, Math.min(sh - ch, f.y * sh - ch / 2));
      }
    }
    ctx.drawImage(img, sx, sy, cw, ch, x, y, w, h);
  }

  /* ---------- 選んだ「シールのカラー」「フレーム」を見える形にする道具
     （2026-08-14 実機テスト指摘「フレームと、シールのカラー機能が全く機能していない」対応） ----------
     🚨 直した理由をここに残す。以前も frame / curtain は合成に結線されていた（＝コードは動いていた）。
     効いていないと言われた本当の理由は「見えない大きさだった」こと:
       - フレーム = 台紙の外周に 22px の絵文字を 62px 間隔。スマホの印刷画面では台紙が
         幅250px程度に縮んで表示されるため、絵文字は実測で約4px にしかならない
       - カラー = 背景グラデの上15%に1点とセル枠線1.5〜3px だけ。同じ理由で細帯にしか見えない
     そこで「実機のプリクラのフレームと同じ載り方」＝**写真1枚ずつの周りにカラーの太枠と
     四隅のモチーフ**へ作り替える。写真の縁は客が必ず見る場所なので、縮んでも消えない。 */
  function lumOf(hex) {
    const c = hex.replace('#', '');
    return 0.299 * parseInt(c.slice(0, 2), 16) + 0.587 * parseInt(c.slice(2, 4), 16) + 0.114 * parseInt(c.slice(4, 6), 16);
  }
  // 帯の上に置く文字の色（明るいカラーの上に白を置くと読めなくなるため）
  function inkOnColor(hex, darkInk) {
    return lumOf(hex) > 175 ? darkInk : '#ffffff';
  }
  /* 写真セル1枚ぶんの飾り: カラーの太枠 ＋ 四隅（円は上下左右）にフレームのモチーフ。
     セルが小さい分割（16分割など）でも比率で縮むので、どの分割でも同じ見え方になる。
     「シンプル」（emoji が空）のときは枠だけ＝選択の意味が残る。 */
  function drawCellDecor(ctx, cell, opt) {
    const { x, y, w, h } = cell;
    const cc = state.curtain.color;
    const emoji = opt.emoji;
    const isCircle = opt.isCircle;
    const radius = opt.radius || 0;
    const minSide = Math.min(w, h);
    const lw = Math.max(3, Math.min(9, minSide * 0.024)); // 枠の太さ
    ctx.save();
    ctx.lineJoin = 'round';
    // ① カラーの太枠（枠の内側に食い込ませて、写真の縁に必ず色が乗るようにする）
    // 明るいカラーはそのままだと白い台紙に溶けて見えないので、枠のときだけ濃くする
    ctx.strokeStyle = lumOf(cc) > 205 ? shadeColor(cc, -48) : cc;
    ctx.lineWidth = lw;
    if (isCircle) {
      const cx = x + w / 2, cy = y + h / 2, r = minSide / 2 - lw / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
    } else {
      roundRect(ctx, x + lw / 2, y + lw / 2, w - lw, h - lw, Math.max(0, radius - lw / 2));
    }
    ctx.stroke();
    // ② フレームのモチーフ（写真の四隅に載る＝実機のフレームと同じ載り方）
    if (emoji) {
      const size = Math.max(11, Math.min(34, minSide * 0.155));
      ctx.font = `${size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // 絵文字が写真に埋もれないよう、白いにじみを下に敷く
      ctx.shadowColor = 'rgba(255,255,255,.95)';
      ctx.shadowBlur = Math.max(3, size * 0.28);
      const inset = size * 0.55 + lw;
      let pts;
      if (isCircle) {
        const cx = x + w / 2, cy = y + h / 2, r = minSide / 2 - inset * 0.7;
        pts = [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]];
      } else {
        pts = [[x + inset, y + inset], [x + w - inset, y + inset], [x + inset, y + h - inset], [x + w - inset, y + h - inset]];
      }
      pts.forEach(p => { ctx.fillText(emoji, p[0], p[1]); ctx.fillText(emoji, p[0], p[1]); });
    }
    ctx.restore();
  }

  function composeSheet() {
    const conf = modeConf();
    const sheet = conf.sheet;
    const ctx = sheetCanvas.getContext('2d');
    ctx.clearRect(0, 0, SHEET_W, SHEET_H);
    const cc = state.curtain.color;

    /* 背景（2026-08-14 カラーを「見える」量まで引き上げた）:
       ヘッダー帯とフッター帯をカラーでベタ塗りし、写真の載る本体は同色の淡いグラデにする。
       写真が映える明るい下地、という元の設計は保ったまま、選んだ色が一目で分かる。 */
    if (state.mode === 'heisei') {
      const grad = ctx.createLinearGradient(0, 0, 0, SHEET_H);
      grad.addColorStop(0, shadeColor(cc, 62));
      grad.addColorStop(0.5, shadeColor(cc, 34));
      grad.addColorStop(1, shadeColor(cc, 62));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, SHEET_W, SHEET_H);
      ctx.fillStyle = cc;
      ctx.fillRect(0, 0, SHEET_W, HEADER_H - 8);
      ctx.fillRect(0, SHEET_H - FOOTER_H, SHEET_W, FOOTER_H);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, SHEET_H);
      grad.addColorStop(0, sheet.bgTop);
      grad.addColorStop(1, sheet.bgBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, SHEET_W, SHEET_H);
      /* 令和は「くすみカラー」の上品さが売り（柄本仕様書）。ベタ塗りにはせず、
         ヘッダーの帯とフッターの細線でカラーを効かせる（細ライン3pxだけでは見えなかった） */
      ctx.fillStyle = cc;
      ctx.fillRect(0, 0, SHEET_W, HEADER_H - 18);
      ctx.fillRect(0, SHEET_H - FOOTER_H + 6, SHEET_W, 4);
    }

    // タイトル
    ctx.textAlign = 'center';
    ctx.font = sheet.titleFont;
    ctx.save();
    if (sheet.titleGlow) {
      ctx.shadowColor = sheet.titleGlow;
      ctx.shadowBlur = 6;
    }
    /* 見出しの色はカラーの明るさで決める（2026-08-14）。
       ヘッダー帯をカラーでベタ塗りにしたため、「ホワイト」「クリーム」等を選ぶと
       白い題字が完全に消えてしまう。明るい帯のときだけ濃い色に落とす */
    ctx.fillStyle = sheet.titleColor === '#ffffff' ? inkOnColor(cc, sheet.footerColor) : sheet.titleColor;
    ctx.fillText(sheet.title, SHEET_W / 2, 46);
    ctx.restore();

    // 写真をレイアウトに合わせて配置（盛り加工済みを優先。セル数が写真より多い場合は繰り返し=16分割の再現）
    const shots = state.processedShots.length ? state.processedShots : state.shots;
    /* シールに載せる写真の並び（2026-08-13 実機テスト指摘対応）:
       2枚ワイド等でどの写真が載るか選べるよう、photoPick（選んだ順のインデックス列）を
       優先する。未選択なら従来どおり撮影順 */
    const pick = (state.photoPick && state.photoPick.length)
      ? state.photoPick.filter(idx => idx < shots.length)
      : null;
    const order = (pick && pick.length) ? pick : shots.map((_, idx) => idx);
    const cells = layoutCells(state.layout);
    const radius = state.layout.radius;
    const pad = Math.min(6, state.layout.gap * 0.3);
    const isCircle = state.layout.shape === 'circle';
    cells.forEach((cell, i) => {
      const shotCanvas = shots[order[i % order.length]];
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
      // 「おさまり」は写真と落書きで必ず同じ関数・同じ引数を通す（2026-08-17 指摘②）
      const si = order[i % order.length];
      if (isCircle) {
        drawShotFit(ctx, shotCanvas, cx - rad, cy - rad, rad * 2, rad * 2, si, '#ffffff');
      } else {
        drawShotFit(ctx, shotCanvas, x, y, cw, chh, si, '#ffffff');
      }
      ctx.restore();

    });

    drawSheetDecor(ctx);

    // フッター（日付）
    const d = new Date();
    const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = state.mode === 'reiwa' ? 'italic 500 13px Georgia, serif' : '700 14px sans-serif';
    ctx.fillStyle = state.mode === 'reiwa' ? sheet.footerColor : inkOnColor(cc, sheet.footerColor);
    ctx.fillText(`${dateStr}　${sheet.footerName}`, SHEET_W / 2, SHEET_H - FOOTER_H / 2 + 5);
  }

  /* 台紙の飾り（カラーの枠＋フレームのモチーフ）だけを描く。
     composeSheet の最後と、落書きを載せたあとの composeFinal の両方から呼ぶ。
     🚨 落書きの「あと」に描くのが要点（2026-08-14）: 実機のフレームは写真と落書きの上に
     載る。先に描くと客の落書きでフレームが塗りつぶされ、また「効いていない」に戻る。 */
  function drawSheetDecor(ctx) {
    const conf = modeConf();
    const sheet = conf.sheet;
    const cells = layoutCells(state.layout);
    const isCircle = state.layout.shape === 'circle';
    const radius = state.layout.radius;
    const emoji = state.frame.emoji;
    cells.forEach((cell) => {
      drawCellDecor(ctx, cell, { emoji, isCircle, radius });
    });
    // 台紙の外周にもモチーフを並べる（平成の初期プリ機のフレーム風。「シンプル」はなし）
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (emoji && sheet.cornerDeco === 'frameEmoji') {
      /* 外周のモチーフは「余白があるときだけ」並べる（2026-08-14）。
         16分割・6分割はセルの隙間が12〜18pxしかなく、外周まで並べると写真の上に
         モチーフが乗り続けて何が写っているか分からなくなる。
         セルごとの飾りは全レイアウトに載るので、外周は余裕のある分割の飾りと割り切る。 */
      const left = Math.min(...cells.map(c => c.x));
      const top = Math.min(...cells.map(c => c.y));
      const bottom = Math.max(...cells.map(c => c.y + c.h));
      ctx.font = '26px sans-serif';
      const step = 52;
      const topY = HEADER_H + 8;
      const botY = SHEET_H - FOOTER_H - 8;
      ctx.shadowColor = 'rgba(255,255,255,.9)';
      ctx.shadowBlur = 6;
      if (top - HEADER_H >= 20 && SHEET_H - FOOTER_H - bottom >= 20) {
        for (let x = 26; x <= SHEET_W - 26; x += step) {
          ctx.fillText(emoji, x, topY);
          ctx.fillText(emoji, x, botY);
        }
      }
      if (left >= 24) {
        for (let y = topY + step; y < botY; y += step) {
          ctx.fillText(emoji, 18, y);
          ctx.fillText(emoji, SHEET_W - 18, y);
        }
      }
    } else if (emoji) {
      // 令和：ヘッダー帯の両端に小さく添える（くすみカラーの上品さを壊さない）
      ctx.font = '20px sans-serif';
      ctx.globalAlpha = 0.9;
      ctx.fillText(emoji, 34, (HEADER_H - 18) / 2);
      ctx.fillText(emoji, SHEET_W - 34, (HEADER_H - 18) / 2);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  /* ===================== 3. 落書き画面（オブジェクト方式） =====================
     すべての描き込みを「オブジェクト」として保持し、キャンバスはオブジェクト列から再描画する。
     これにより ロイロノート式の「なぞり消し」（触れた線やスタンプを丸ごと消す）と
     軽量なアンドゥ（操作の巻き戻し）が可能になる。 */
  /* 落書きは「写真拡大表示」方式（2026-08-13 実機テスト指摘
     「各ショットを全体表示しないと落書きなんてできねーじゃないか」対応・平成/令和共通）:
     - 選択中の写真1枚を画面いっぱいに表示して描く（キャンバス座標＝写真座標 SHOT_W×SHOT_H）
     - サムネイル（1〜4）でショットを切り替える。落書きは写真ごとに保持する
     - シール合成時に、写真と同じcover変換で各セルへ縮小反映（＝落書きは写真に付いていく）
     - 台紙の余白（セル外）への落書きは廃止（実機も写真にしか描けない） */
  const drawCanvas = $('#draw-canvas');
  drawCanvas.width = SHOT_W;
  drawCanvas.height = SHOT_H;
  const drawCtx = drawCanvas.getContext('2d');
  // ストローク描画中のプレビュー用レイヤー
  const strokeCanvas = $('#stroke-canvas');
  strokeCanvas.width = SHOT_W;
  strokeCanvas.height = SHOT_H;
  const strokeCtx = strokeCanvas.getContext('2d');
  // 選択中の写真の表示レイヤー（draw-canvasの下）
  const decoPhotoCanvas = $('#deco-photo-canvas');
  decoPhotoCanvas.width = SHOT_W;
  decoPhotoCanvas.height = SHOT_H;
  const decoPhotoCtx = decoPhotoCanvas.getContext('2d');
  /* 選んだフレーム／シールのカラーを落書き中もずっと見せる層（2026-08-14 実機テスト指摘対応）。
     シール上で写真1枚に載る飾りと同じものを、拡大表示の写真にもそのまま載せる＝
     出来上がりの見たままで落書きできる（かつ「選んだのに何も変わらない」が消える） */
  const decoFrameCanvas = $('#deco-frame-canvas');
  decoFrameCanvas.width = SHOT_W;
  decoFrameCanvas.height = SHOT_H;
  const decoFrameCtx = decoFrameCanvas.getContext('2d');
  function renderDecoFramePreview() {
    decoFrameCtx.clearRect(0, 0, SHOT_W, SHOT_H);
    if (!state.frame || !state.curtain) return;
    drawCellDecor(decoFrameCtx, { x: 0, y: 0, w: SHOT_W, h: SHOT_H }, {
      emoji: state.frame.emoji, isCircle: false, radius: 10,
    });
  }

  let shotDeco = [];      // 写真ごとの落書き { objects: [], undo: [] }（インデックス＝撮影順）
  let curShot = 0;        // いま拡大表示している写真のインデックス
  let decoObjects = [];   // 選択中の写真の描き込みオブジェクト列（shotDeco[curShot].objects への参照）
  let undoStack = [];     // 選択中の写真の操作履歴（shotDeco[curShot].undo への参照）

  function decoShots() {
    return state.processedShots.length ? state.processedShots : state.shots;
  }

  /* ---------- 手描き風スタンプ（Canvas描画） ---------- */
  function heartPath(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.32);
    ctx.bezierCurveTo(-s * 0.55, -s * 0.12, -s * 0.30, -s * 0.52, 0, -s * 0.22);
    ctx.bezierCurveTo(s * 0.30, -s * 0.52, s * 0.55, -s * 0.12, 0, s * 0.32);
    ctx.closePath();
  }

  const DRAWN_STAMPS = {
    /* ---- 平成の柄・記号スタンプ（2026-08-17 柄本仕様書 C-2-1。原本は assets/heisei-stamp-*.svg）----
       いずれも 96×96 のSVG座標をそのまま使えるように scale→translate している。
       グラデ禁止・ハードエッジ・原色・左右非対称（＝手で描いた癖）が平成の様式。
       このアプリの手描きスタンプはCanvas描画方式でSVGローダーが無いため、
       SVGは意匠の原本として assets/ に残し、実体はこの描画コードで持つ */
    peaceMark: { label: 'ピース', draw(ctx, s) {
      const k = s / 80;
      ctx.save();
      ctx.rotate(-0.12);              // 手で押したときの傾き
      ctx.scale(k, k);
      ctx.translate(-48, -48);
      ctx.beginPath(); ctx.arc(48, 47, 43, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff'; ctx.fill();              // シールの白フチ
      ctx.strokeStyle = '#ff2fa0'; ctx.lineWidth = 9; ctx.lineCap = 'butt';
      ctx.beginPath(); ctx.arc(48, 47, 37, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(48, 12); ctx.lineTo(48, 84);
      ctx.moveTo(48, 47); ctx.lineTo(18, 76);             // 左腕は右腕より少し寝ている
      ctx.moveTo(48, 47); ctx.lineTo(77, 74);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(23, 30); ctx.bezierCurveTo(27, 22, 33, 17, 41, 15); ctx.stroke();
      ctx.restore();
    } },
    star4: { label: 'キラ星', draw(ctx, s) {
      const k = s / 80;
      ctx.save(); ctx.rotate(0.07); ctx.scale(k, k); ctx.translate(-48, -48);
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(47, 3);
      ctx.quadraticCurveTo(53, 36, 93, 46);
      ctx.quadraticCurveTo(54, 54, 49, 93);
      ctx.quadraticCurveTo(43, 55, 4, 45);
      ctx.quadraticCurveTo(44, 37, 47, 3);
      ctx.closePath();
      ctx.fillStyle = '#ffef5c'; ctx.fill();
      ctx.strokeStyle = '#3a1030'; ctx.lineWidth = 6; ctx.stroke();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(36, 38); ctx.bezierCurveTo(40, 32, 46, 30, 50, 32); ctx.stroke();
      ctx.beginPath();                                     // 添えの小玉（キラは大小2つで打つ）
      ctx.moveTo(74, 71);
      ctx.quadraticCurveTo(76, 79, 85, 81);
      ctx.quadraticCurveTo(76, 84, 74, 92);
      ctx.quadraticCurveTo(72, 84, 63, 82);
      ctx.quadraticCurveTo(72, 79, 74, 71);
      ctx.closePath();
      ctx.fillStyle = '#ff2fa0'; ctx.fill();
      ctx.strokeStyle = '#3a1030'; ctx.lineWidth = 4; ctx.stroke();
      ctx.restore();
    } },
    dotsPop: { label: '水玉', draw(ctx, s) {
      const k = s / 80;
      ctx.save(); ctx.scale(k, k); ctx.translate(-48, -48);
      const puff = (x, y, r, c) => {
        ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill();
      };
      puff(33, 34, 17, '#ff2fa0');                         // 大中小・色違い・等間隔にしない
      puff(69, 62, 12, '#ffef5c');
      puff(26, 72, 7.5, '#5cc8ff');
      ctx.restore();
    } },
    stripePop: { label: 'ボーダー', draw(ctx, s) {
      const k = s / 80;
      ctx.save(); ctx.rotate(-0.38); ctx.scale(k, k); ctx.translate(-48, -48);
      const bar = (p, c) => {
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[2], p[3]);
        ctx.lineTo(p[4], p[5]); ctx.lineTo(p[6], p[7]); ctx.closePath();
        ctx.fillStyle = c; ctx.fill();
      };
      bar([14, 26, 82, 22, 82, 44, 14, 47], '#ffffff');
      bar([17, 29, 79, 25.5, 79, 41, 17, 44], '#ff2fa0');  // 太いほう
      bar([14, 58, 74, 55, 74, 70, 14, 73], '#ffffff');
      bar([17, 61, 71, 58.5, 71, 67, 17, 70], '#3a1030');  // 細いほう・右端が短い
      ctx.restore();
    } },
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
      ctx.shadowColor = o.glow || '#ff7ad9';
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
        ctx.translate(o.x, o.y);
        if (o.rot) ctx.rotate(o.rot); // 編集ツールの回転（2026-08-14）
        ctx.fillText(o.char, 0, 0);
        ctx.restore();
        break;
      case 'dstamp': {
        const def = DRAWN_STAMPS[o.id];
        if (!def) break;
        ctx.save();
        ctx.translate(o.x, o.y);
        if (o.rot) ctx.rotate(o.rot); // 編集ツールの回転（2026-08-14）
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
    drawCtx.clearRect(0, 0, SHOT_W, SHOT_H);
    decoObjects.forEach(o => drawObject(drawCtx, o));
  }

  /* ---------- ショット切り替え（サムネイル1〜4） ---------- */
  function selectShot(i) {
    curShot = i;
    if (typeof clearEditSel === 'function') clearEditSel(); // 編集選択は写真ごと（前の写真のindexを持ち越さない）
    if (!shotDeco[i]) shotDeco[i] = { objects: [], undo: [] };
    decoObjects = shotDeco[i].objects;
    undoStack = shotDeco[i].undo;
    const shot = decoShots()[i];
    decoPhotoCtx.clearRect(0, 0, SHOT_W, SHOT_H);
    if (shot) decoPhotoCtx.drawImage(shot, 0, 0, SHOT_W, SHOT_H);
    renderDeco();
    renderDecoFramePreview();
    refreshDecoThumbs();
    scheduleSessionSave(); // 見ている写真も一時保存に含める（復帰したとき同じ写真から続けられる）
  }

  // 写真iの落書きだけを SHOT_W×SHOT_H の透明キャンバスに描き出す（合成・サムネイル共用）
  function renderShotDoodle(i) {
    const c = document.createElement('canvas');
    c.width = SHOT_W; c.height = SHOT_H;
    const ctx = c.getContext('2d');
    ((shotDeco[i] && shotDeco[i].objects) || []).forEach(o => drawObject(ctx, o));
    return c;
  }

  function buildDecoThumbs() {
    const row = $('#deco-thumbs');
    if (!row) return;
    row.innerHTML = '';
    decoShots().forEach((shot, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'deco-thumb';
      b.dataset.idx = String(i);
      const cv = document.createElement('canvas');
      cv.width = 96; cv.height = 72;
      b.appendChild(cv);
      const num = document.createElement('span');
      num.className = 'dt-num';
      num.textContent = String(i + 1);
      b.appendChild(num);
      const mark = document.createElement('span');
      mark.className = 'dt-mark';
      mark.textContent = '✎';
      b.appendChild(mark);
      b.addEventListener('click', () => { if (i !== curShot) selectShot(i); });
      row.appendChild(b);
    });
    refreshDecoThumbs();
  }

  // サムネイルの再描画（選択中の枠・落書き済みマーク・落書きプレビュー）
  function refreshDecoThumbs() {
    const row = $('#deco-thumbs');
    if (!row) return;
    const shots = decoShots();
    Array.from(row.children).forEach((b) => {
      const i = Number(b.dataset.idx);
      b.classList.toggle('selected', i === curShot);
      const doodled = !!(shotDeco[i] && shotDeco[i].objects.length);
      b.classList.toggle('doodled', doodled);
      const cv = b.querySelector('canvas');
      const cctx = cv.getContext('2d');
      cctx.clearRect(0, 0, cv.width, cv.height);
      if (shots[i]) cctx.drawImage(shots[i], 0, 0, cv.width, cv.height);
      if (doodled) cctx.drawImage(renderShotDoodle(i), 0, 0, cv.width, cv.height);
    });
    if (typeof updateShotNav === 'function') updateShotNav(); // 送りボタンの端の無効化を合わせる
  }

  // 描き込みのたびに毎回全サムネイルを描き直すと重いので、1フレーム相当にまとめる
  let thumbUpdateId = null;
  function scheduleThumbUpdate() {
    if (thumbUpdateId) return;
    thumbUpdateId = setTimeout(() => { thumbUpdateId = null; refreshDecoThumbs(); }, 120);
  }

  function pushUndo(op) {
    undoStack.push(op);
    if (undoStack.length > 60) undoStack.shift();
    scheduleThumbUpdate();
    scheduleSessionSave(); // 描いたぶんを一時保存（離脱しても作品を失わないため・2026-08-14）
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
    } else if (op.op === 'replace') {
      // 編集ツール（移動・回転・拡縮）の巻き戻し: 変形前のオブジェクトへ差し戻す
      op.items.forEach(({ index, obj }) => {
        if (index < decoObjects.length) decoObjects[index] = obj;
      });
    }
    renderDeco();
    scheduleThumbUpdate();
    if (state.tool === 'edit') { editSel = []; drawEditOverlay(); } // 巻き戻し後の古い選択枠を残さない
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

  /* ---------- 落書き編集ツール（√me2型・令和のみ・2026-08-14） ----------
     置いた落書き（ペン・スタンプ・文字・キラ）を囲って選択し、移動・回転・拡縮・複製できる。
     現行実機√me2(2024)の「落書き編集ツール」の再現（フリュー公式技術ブログ）。
     - タップ: その位置の一番上のオブジェクトを選択（そのままドラッグで移動）
     - なにもない所からドラッグ: 範囲選択（ペンとスタンプの混在選択も可＝実機同様）
     - 右下の丸ハンドル: ドラッグで回転＋拡縮（中心基準）
     - ⧉ふくせい: 選択中のオブジェクトを少しずらして複製
     変形は「もどす」1回で丸ごと変形前に戻る（op:'replace'）。eraseオブジェクトは対象外 */
  let editSel = [];
  let editGesture = null;

  function objBounds(o) {
    switch (o.type) {
      case 'stroke': {
        let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
        o.pts.forEach(p => {
          if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
        });
        const m = o.size / 2 + 4;
        return { x: minX - m, y: minY - m, w: maxX - minX + m * 2, h: maxY - minY + m * 2 };
      }
      case 'kira': {
        let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
        o.items.forEach(it => {
          if (it.x - it.size < minX) minX = it.x - it.size;
          if (it.x + it.size > maxX) maxX = it.x + it.size;
          if (it.y - it.size < minY) minY = it.y - it.size;
          if (it.y + it.size > maxY) maxY = it.y + it.size;
        });
        return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
      }
      case 'stamp':
      case 'dstamp': {
        const r = o.size * 0.75;
        return { x: o.x - r, y: o.y - r, w: r * 2, h: r * 2 };
      }
      case 'text': {
        const hw = (o.w || 60) / 2 + 4;
        const hh = o.fontSize * 0.9;
        return { x: o.x - hw, y: o.y - hh, w: hw * 2, h: hh * 2 };
      }
      default:
        return null; // erase は編集対象外
    }
  }

  function selectionBounds() {
    let b = null;
    editSel.forEach((i) => {
      const o = decoObjects[i];
      if (!o) return;
      const ob = objBounds(o);
      if (!ob) return;
      if (!b) b = { ...ob };
      else {
        const x2 = Math.max(b.x + b.w, ob.x + ob.w), y2 = Math.max(b.y + b.h, ob.y + ob.h);
        b.x = Math.min(b.x, ob.x); b.y = Math.min(b.y, ob.y);
        b.w = x2 - b.x; b.h = y2 - b.y;
      }
    });
    return b;
  }

  function drawEditOverlay(band) {
    strokeCtx.clearRect(0, 0, SHOT_W, SHOT_H);
    const bar = $('#edit-bar');
    if (band) {
      strokeCtx.save();
      strokeCtx.strokeStyle = 'rgba(168,145,125,.95)';
      strokeCtx.setLineDash([7, 5]);
      strokeCtx.lineWidth = 2;
      strokeCtx.strokeRect(Math.min(band.x0, band.x1), Math.min(band.y0, band.y1), Math.abs(band.x1 - band.x0), Math.abs(band.y1 - band.y0));
      strokeCtx.restore();
    }
    const b = selectionBounds();
    if (!b) { if (bar) bar.classList.add('hidden'); return; }
    strokeCtx.save();
    strokeCtx.strokeStyle = 'rgba(168,145,125,.95)';
    strokeCtx.setLineDash([8, 6]);
    strokeCtx.lineWidth = 2.5;
    strokeCtx.strokeRect(b.x, b.y, b.w, b.h);
    // 右下: 回転＋拡縮ハンドル
    strokeCtx.setLineDash([]);
    strokeCtx.fillStyle = '#a8917d';
    strokeCtx.beginPath();
    strokeCtx.arc(b.x + b.w, b.y + b.h, 13, 0, Math.PI * 2);
    strokeCtx.fill();
    strokeCtx.strokeStyle = '#fff';
    strokeCtx.lineWidth = 2;
    strokeCtx.beginPath();
    strokeCtx.moveTo(b.x + b.w - 5, b.y + b.h + 5);
    strokeCtx.lineTo(b.x + b.w + 5, b.y + b.h - 5);
    strokeCtx.stroke();
    strokeCtx.restore();
    if (bar) bar.classList.remove('hidden');
  }

  function clearEditSel() {
    editSel = [];
    editGesture = null;
    strokeCtx.clearRect(0, 0, SHOT_W, SHOT_H);
    const bar = $('#edit-bar');
    if (bar) bar.classList.add('hidden');
  }

  // 中心(cx,cy)基準の 拡縮s・回転ang・平行移動(dx,dy) を適用した複製を返す
  function transformObject(o, cx, cy, sc, ang, dx, dy) {
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const tp = (x, y) => ({
      x: cx + ((x - cx) * ca - (y - cy) * sa) * sc + dx,
      y: cy + ((x - cx) * sa + (y - cy) * ca) * sc + dy,
    });
    const c = JSON.parse(JSON.stringify(o));
    switch (c.type) {
      case 'stroke':
      case 'erase':
        c.pts = c.pts.map(p => tp(p.x, p.y));
        c.size = Math.max(1, c.size * sc);
        break;
      case 'kira':
        c.items = c.items.map(it => {
          const p = tp(it.x, it.y);
          return { ...it, x: p.x, y: p.y, size: Math.max(4, it.size * sc), rot: (it.rot || 0) + ang };
        });
        break;
      case 'stamp':
      case 'dstamp': {
        const p = tp(c.x, c.y);
        c.x = p.x; c.y = p.y;
        c.size = Math.max(4, c.size * sc);
        c.rot = (c.rot || 0) + ang;
        break;
      }
      case 'text': {
        const p = tp(c.x, c.y);
        c.x = p.x; c.y = p.y;
        c.fontSize = Math.max(6, c.fontSize * sc);
        if (c.w) c.w *= sc;
        c.rot = (c.rot || 0) + ang;
        if (c.font) c.font = c.font.replace(/(\d+(?:\.\d+)?)px/, (m, n) => (Number(n) * sc).toFixed(1) + 'px');
        if (c.strokeWidth) c.strokeWidth *= sc;
        break;
      }
    }
    return c;
  }

  function editSnapshot() {
    return editSel.map(i => ({ index: i, obj: JSON.parse(JSON.stringify(decoObjects[i])) }));
  }

  function applyEditTransform(sc, ang, dx, dy) {
    const g = editGesture;
    g.orig.forEach(({ index, obj }) => {
      decoObjects[index] = transformObject(obj, g.cx, g.cy, sc, ang, dx, dy);
    });
    renderDeco();
    drawEditOverlay();
  }

  function editDown(x, y) {
    const b = editSel.length ? selectionBounds() : null;
    if (b && Math.hypot(x - (b.x + b.w), y - (b.y + b.h)) <= 26) {
      // 右下ハンドル: 回転＋拡縮
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      editGesture = {
        kind: 'transform', cx, cy,
        startAng: Math.atan2(y - cy, x - cx),
        startDist: Math.max(10, Math.hypot(x - cx, y - cy)),
        moved: false, orig: editSnapshot(),
      };
      return;
    }
    if (b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
      editGesture = { kind: 'move', cx: b.x + b.w / 2, cy: b.y + b.h / 2, startX: x, startY: y, moved: false, orig: editSnapshot() };
      return;
    }
    // タップ位置の一番上のオブジェクトを選択（そのままドラッグで移動できる）
    let hit = -1;
    for (let i = decoObjects.length - 1; i >= 0; i--) {
      const o = decoObjects[i];
      if (o.type !== 'erase' && hitTestObject(o, x, y, 10)) { hit = i; break; }
    }
    if (hit >= 0) {
      editSel = [hit];
      const nb = selectionBounds();
      editGesture = { kind: 'move', cx: nb.x + nb.w / 2, cy: nb.y + nb.h / 2, startX: x, startY: y, moved: false, orig: editSnapshot() };
      drawEditOverlay();
    } else {
      editSel = [];
      editGesture = { kind: 'band', x0: x, y0: y, x1: x, y1: y };
      drawEditOverlay(editGesture);
    }
  }

  function editMove(x, y) {
    const g = editGesture;
    if (!g) return;
    if (g.kind === 'move') {
      g.moved = true;
      applyEditTransform(1, 0, x - g.startX, y - g.startY);
    } else if (g.kind === 'transform') {
      g.moved = true;
      const ang = Math.atan2(y - g.cy, x - g.cx) - g.startAng;
      const sc = Math.max(0.2, Math.min(5, Math.hypot(x - g.cx, y - g.cy) / g.startDist));
      applyEditTransform(sc, ang, 0, 0);
    } else if (g.kind === 'band') {
      g.x1 = x; g.y1 = y;
      drawEditOverlay(g);
    }
  }

  function editUp() {
    const g = editGesture;
    editGesture = null;
    if (!g) return;
    if (g.kind === 'band') {
      const rx = Math.min(g.x0, g.x1), ry = Math.min(g.y0, g.y1);
      const rw = Math.abs(g.x1 - g.x0), rh = Math.abs(g.y1 - g.y0);
      if (rw > 6 || rh > 6) {
        editSel = decoObjects
          .map((o, i) => ({ o, i }))
          .filter(({ o }) => {
            if (o.type === 'erase') return false;
            const ob = objBounds(o);
            return ob && ob.x < rx + rw && rx < ob.x + ob.w && ob.y < ry + rh && ry < ob.y + ob.h;
          })
          .map(({ i }) => i);
      }
      drawEditOverlay();
      return;
    }
    if (g.moved) pushUndo({ op: 'replace', items: g.orig }); // 「もどす」1回で変形前へ
    drawEditOverlay();
  }

  // ⧉ふくせい: 選択中を少しずらして複製（1操作＝「もどす」で複製ぶんが丸ごと消える）
  $('#btn-edit-dup').addEventListener('click', () => {
    if (!editSel.length || state.remaining <= 0) return;
    const copies = editSel
      .map(i => decoObjects[i])
      .filter(Boolean)
      .map(o => transformObject(o, 0, 0, 1, 0, 20, 20));
    const start = decoObjects.length;
    decoObjects.push(...copies);
    pushUndo({ op: 'addMany', count: copies.length });
    editSel = copies.map((_, k) => start + k);
    renderDeco();
    drawEditOverlay();
  });
  $('#btn-edit-done').addEventListener('click', clearEditSel);

  /* ---------- ツールUI ---------- */
  /* いま使えるペンの色（2026-08-17 指摘④）。令和は系統を切り替えられる。
     平成は当時の12色そのままなので penPalettes を持たず、従来どおり penColors を返す */
  function penColorList() {
    const conf = modeConf();
    const pals = conf.penPalettes;
    if (!pals || !pals.length) return conf.penColors;
    const p = pals.find(x => x.id === state.penPalette) || pals[0];
    return p.colors;
  }

  // 色の系統タブ（令和のみ。1つしか無いモードでは行ごと隠す）
  function buildPalTabs() {
    const row = $('#pen-palette-row');
    if (!row) return;
    const pals = modeConf().penPalettes;
    row.innerHTML = '';
    if (!pals || pals.length < 2) { row.style.display = 'none'; return; }
    row.style.display = '';
    pals.forEach((p) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pal-btn' + (p.id === state.penPalette ? ' active' : '');
      b.dataset.pal = p.id;
      b.textContent = p.label;
      b.addEventListener('click', () => {
        state.penPalette = p.id;
        row.querySelectorAll('.pal-btn').forEach(x => x.classList.toggle('active', x === b));
        state.penColor = penColorList()[0];
        buildColorRow();
        buildTextColorRow();
        playSound('seTap');
      });
      row.appendChild(b);
    });
  }

  function buildColorRow() {
    const row = $('#color-row');
    row.innerHTML = '';
    penColorList().forEach((c, i) => {
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
      b.addEventListener('click', () => {
        setTool('dstamp', id);
        // どれを選んでいるかをひと目で（2026-08-13 実機テスト指摘: 選択中の表示が無かった）
        row.querySelectorAll('.stamp-btn').forEach(x => x.classList.toggle('selected', x === b));
      });
      row.appendChild(b);
    });
    // 絵文字スタンプ
    (conf.stamps || []).forEach(s => {
      const b = document.createElement('button');
      b.className = 'stamp-btn';
      b.textContent = s;
      b.addEventListener('click', () => {
        setTool('stamp', s);
        row.querySelectorAll('.stamp-btn').forEach(x => x.classList.toggle('selected', x === b));
      });
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
      b.addEventListener('click', () => {
        setTool('textstamp', item);
        row.querySelectorAll('.text-stamp-btn').forEach(x => x.classList.toggle('selected', x === b));
        renderTextStampPreview();
      });
      row.appendChild(b);
    });
    const group = $('#group-text');
    if (group) group.style.display = (conf.textStamps || []).length ? '' : 'none';
  }

  /* ---------- 文字スタンプの色・角度・プレビュー（2026-08-13 実機テスト要望①②） ----------
     色: ペンと同系のパレット＋「おまかせ」（スタンプごとの標準色）。
     角度: 押す前に ひだり/まっすぐ/みぎ を選べる。おまかせ＝従来の手の癖ランダム角度。
     プレビュー: いま選んでいるスタンプが「どの色・どの角度で押されるか」を置く前に見せる。 */
  function buildTextColorRow() {
    const row = $('#text-color-row');
    if (!row) return;
    row.innerHTML = '';
    // 先頭は「おまかせ」（スタンプ標準色に戻す）
    const auto = document.createElement('div');
    auto.className = 'color-swatch text-color-auto selected';
    auto.title = 'おまかせ（スタンプの標準色）';
    auto.addEventListener('click', () => {
      row.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('selected'));
      auto.classList.add('selected');
      state.textStampColor = null;
      renderTextStampPreview();
    });
    row.appendChild(auto);
    penColorList().forEach((c) => { // ペンと同じ系統を使う（2026-08-17 指摘④）
      const sw = document.createElement('div');
      sw.className = 'color-swatch';
      sw.style.background = c;
      if (c === '#ffffff') sw.style.boxShadow = '0 0 0 1px #ccc, inset 0 0 0 1px #ddd';
      sw.addEventListener('click', () => {
        row.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('selected'));
        sw.classList.add('selected');
        state.textStampColor = c;
        renderTextStampPreview();
      });
      row.appendChild(sw);
    });
  }

  // 角度ボタン（静的DOM。1回だけ結線）
  document.querySelectorAll('#text-angle-row .angle-btn').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#text-angle-row .angle-btn').forEach(x => x.classList.toggle('active', x === b));
      state.textStampAngle = b.dataset.angle === 'auto' ? 'auto' : Number(b.dataset.angle);
      renderTextStampPreview();
    });
  });

  // いまの選択（スタンプ×色×角度）で実際に押される見た目を作る共通処理
  function makeTextStampObject(sel, x, y) {
    const modeStyle = modeConf().textStampStyle;
    const sizeScale = state.stampSize / 48;
    const fontSize = Math.round((sel.style === 'neon' ? 22 : 20) * sizeScale);
    const rot = state.textStampAngle === 'auto'
      ? (Math.random() * modeStyle.rotate * 2 - modeStyle.rotate) * Math.PI / 180
      : state.textStampAngle * Math.PI / 180;
    return {
      type: 'text', t: sel.t, style: sel.style || 'plain',
      color: state.textStampColor || sel.color || modeStyle.fill,
      glow: state.textStampColor || null, // neonスタイルの発光色（未指定なら従来の既定色）
      x, y, fontSize, rot,
      font: modeStyle.font.replace(/(\d+)px/, (m, n) => Math.round(Number(n) * sizeScale) + 'px'),
      strokeColor: modeStyle.stroke,
      strokeWidth: (modeStyle.strokeWidth || 0) * sizeScale,
    };
  }

  function renderTextStampPreview() {
    const cv = $('#text-stamp-preview');
    if (!cv) return;
    const pctx = cv.getContext('2d');
    pctx.clearRect(0, 0, cv.width, cv.height);
    const sel = state.tool === 'textstamp' ? state.textStampSel : null;
    if (!sel) {
      pctx.save();
      pctx.font = '600 13px sans-serif';
      pctx.textAlign = 'center';
      pctx.textBaseline = 'middle';
      pctx.fillStyle = 'rgba(0,0,0,.38)';
      pctx.fillText('👆 スタンプをえらぶと ここにプレビュー', cv.width / 2, cv.height / 2);
      pctx.restore();
      return;
    }
    // プレビューは中央固定サイズ。角度おまかせは「最大の癖角度」で傾きを見せる
    const o = makeTextStampObject(sel, cv.width / 2, cv.height / 2);
    o.fontSize = sel.style === 'neon' ? 22 : 20;
    o.font = modeConf().textStampStyle.font;
    o.strokeWidth = modeConf().textStampStyle.strokeWidth || 0;
    if (state.textStampAngle === 'auto') o.rot = -modeConf().textStampStyle.rotate * Math.PI / 180;
    // 長い文言はキャンバス幅に収まるよう縮小して描く
    pctx.save();
    pctx.font = `900 ${o.fontSize}px sans-serif`;
    const tw = pctx.measureText(o.t).width + o.fontSize * 0.8;
    pctx.restore();
    const sc = Math.min(1, (cv.width - 12) / tw);
    pctx.save();
    pctx.translate(cv.width / 2, cv.height / 2);
    pctx.scale(sc, sc);
    pctx.translate(-cv.width / 2, -cv.height / 2);
    drawTextStampStyled(pctx, o);
    pctx.restore();
  }

  /* ---------- 落書き見本（Meidy式・2026-08-12 新設／2026-08-13 写真セル単位に改修） ----------
     現行実機Meidyの「人気クリエイターの完成見本を選ぶと、そのまま配置済みになる」を再現。
     実機の見本は「1枚1枚の写真」にデザインが載る（実機テスト指摘④）。
     見本は写真セル内の正規化座標（nx/ny=セル内0〜1・サイズ=セル短辺比）で持ち、
     1タップでレイアウトの全セルそれぞれに、セルの位置・大きさに合わせて配置する。
     追加は1操作扱いのままなので「もどす」で丸ごと消せる。
     配置は写真の顔を隠さないよう、各セルの上下のフチと四隅に寄せてある。 */
  function sampleCellObjects(items, cell) {
    const s = Math.min(cell.w, cell.h); // セル短辺。サイズはこれに比例させる
    return items.map((it) => {
      const x = cell.x + it.nx * cell.w;
      const y = cell.y + it.ny * cell.h;
      if (it.type === 'text') {
        const fontSize = Math.max(10, it.fs * s);
        return {
          type: 'text', t: it.t, style: it.style, color: it.color || null,
          x, y, fontSize,
          rot: (it.rotDeg || 0) * Math.PI / 180,
          w: it.t.length * fontSize + fontSize * 0.4,
        };
      }
      if (it.type === 'kira') {
        return {
          type: 'kira',
          items: it.items.map(k => ({
            ch: k.ch,
            x: cell.x + k.nx * cell.w,
            y: cell.y + k.ny * cell.h,
            size: Math.max(8, k.fsize * s),
            rot: k.rot || 0,
          })),
        };
      }
      // stamp / dstamp
      const o = { type: it.type, x, y, size: Math.max(10, it.fsize * s) };
      if (it.type === 'stamp') o.char = it.char; else o.id = it.id;
      return o;
    });
  }
  const DOODLE_SAMPLES = {
    /* 平成に見本は出さない（2026-08-13 オーナー裁定・era-designer乖離監査A-1）:
       「完成見本をワンタップ反映」は現行実機Meidy(2025)の型で、1999〜2003年の実機には無い。
       当時の落書きはペンとスタンプで自力で埋め尽くすもの。空配列にすると
       buildSampleRow が #group-sample ごと自動で隠す。令和の見本は現状維持 */
    heisei: [],
    reiwa: [
      { label: 'なかよし', items: [
        { type: 'text', t: 'BFF♡', style: 'sticker', color: '#e0498a', nx: 0.50, ny: 0.10, fs: 0.095, rotDeg: -2 },
        { type: 'stamp', char: '🤍', nx: 0.10, ny: 0.13, fsize: 0.13 },
        { type: 'stamp', char: '☁️', nx: 0.90, ny: 0.13, fsize: 0.13 },
        { type: 'dstamp', id: 'bubble', nx: 0.88, ny: 0.84, fsize: 0.16 },
        { type: 'dstamp', id: 'dateCute', nx: 0.50, ny: 0.92, fsize: 0.17 },
      ] },
      { label: 'エモ', items: [
        { type: 'dstamp', id: 'sparkleLine', nx: 0.10, ny: 0.13, fsize: 0.13 },
        { type: 'dstamp', id: 'sparkleLine', nx: 0.90, ny: 0.13, fsize: 0.13 },
        { type: 'dstamp', id: 'heartOutline', nx: 0.12, ny: 0.86, fsize: 0.14 },
        { type: 'text', t: 'エモい', style: 'sticker', color: '#a8917d', nx: 0.50, ny: 0.91, fs: 0.085, rotDeg: 2 },
        { type: 'dstamp', id: 'dateCute', nx: 0.86, ny: 0.75, fsize: 0.16 },
      ] },
      { label: 'シンプル', items: [
        { type: 'dstamp', id: 'heartLine', nx: 0.09, ny: 0.13, fsize: 0.13 },
        { type: 'dstamp', id: 'heartLine', nx: 0.91, ny: 0.13, fsize: 0.13 },
        { type: 'dstamp', id: 'heartLine', nx: 0.09, ny: 0.87, fsize: 0.13 },
        { type: 'dstamp', id: 'heartLine', nx: 0.91, ny: 0.87, fsize: 0.13 },
        { type: 'text', t: 'Perfect', style: 'outline', nx: 0.50, ny: 0.10, fs: 0.085, rotDeg: -1 },
      ] },
    ],
  };

  /* 見本→写真1枚ぶんのオブジェクト列（写真拡大表示方式: 貼り先は常に「いま表示中の写真」全体） */
  function sampleObjectsForPhoto(sample) {
    return sampleCellObjects(sample.items, { x: 0, y: 0, w: SHOT_W, h: SHOT_H });
  }

  function buildSampleRow() {
    const row = $('#sample-row');
    row.innerHTML = '';
    const samples = DOODLE_SAMPLES[state.mode] || [];
    samples.forEach((sample) => {
      const b = document.createElement('button');
      b.className = 'sample-btn';
      const cv = document.createElement('canvas');
      cv.width = 64; cv.height = 48;
      const cctx = cv.getContext('2d');
      cctx.fillStyle = state.mode === 'reiwa' ? '#f4ede4' : '#ffe6f3';
      cctx.fillRect(0, 0, 64, 48);
      /* プレビューは写真1枚ぶん（写真拡大表示方式: 見本は表示中の写真にそのまま載る） */
      cctx.save();
      cctx.scale(64 / SHOT_W, 48 / SHOT_H);
      sampleObjectsForPhoto(sample).forEach(o => drawObject(cctx, o));
      cctx.restore();
      b.appendChild(cv);
      const lb = document.createElement('span');
      lb.className = 'sample-label';
      lb.textContent = sample.label;
      b.appendChild(lb);
      b.addEventListener('click', () => {
        /* 見本を選ぶ→貼りたい写真をサムネイルで出して、写真をタップで1枚ずつ貼る。
           全部に貼りたいときは「ぜんぶのしゃしんに はる」ボタン */
        setTool('sample', sample);
        row.querySelectorAll('.sample-btn').forEach(x => x.classList.toggle('selected', x === b));
        showDecoToast('👆 はりたいしゃしんを下のサムネイルでえらんで、しゃしんをタップ！');
      });
      row.appendChild(b);
    });
    const group = $('#group-sample');
    if (group) group.style.display = samples.length ? '' : 'none';
  }

  // 「ぜんぶのしゃしんに はる」: 選択中の見本を全写真へ（写真ごとに1操作＝その写真の「もどす」で丸ごと消える）
  $('#btn-sample-all').addEventListener('click', () => {
    if (state.remaining <= 0) return;
    if (!state.sampleSel) { showDecoToast('さきに みほんを えらんでね！'); return; }
    decoShots().forEach((_, i) => {
      if (!shotDeco[i]) shotDeco[i] = { objects: [], undo: [] };
      const objs = sampleObjectsForPhoto(state.sampleSel);
      shotDeco[i].objects.push(...objs);
      shotDeco[i].undo.push({ op: 'addMany', count: objs.length });
      if (shotDeco[i].undo.length > 60) shotDeco[i].undo.shift();
    });
    renderDeco();
    scheduleThumbUpdate();
  });

  /* 道具箱の「まだ下にある」表示の面倒を見る（2026-08-17・実測対応）。
     横持ちでは見える高さ263pxに対して中身が1578pxあり、スタンプの大きさは412px下にある。
     底まで送ったら消す（もう続きが無いのに矢印を出し続けない） */
  function syncToolbarMore() {
    const bar = $('.deco-toolbar');
    const cue = $('#toolbar-more');
    if (!bar || !cue) return;
    /* 落書き画面に入る前は道具箱の高さが0（表示されていない）ため、
       0 + 0 >= 0 - 8 が成立して「もう底だ」と判定されてしまう。
       画面に出ていないときは判定しない（2026-08-18: この取りこぼしで、
       画面を出す前にリサイズが起きた端末では帯が最初から消えていた） */
    if (!bar.clientHeight) return;
    const atEnd = bar.scrollTop + bar.clientHeight >= bar.scrollHeight - 8;
    cue.classList.toggle('at-end', atEnd);
  }
  (() => {
    const bar = $('.deco-toolbar');
    if (!bar) return;
    bar.addEventListener('scroll', syncToolbarMore, { passive: true });
    window.addEventListener('resize', syncToolbarMore);
  })();

  function buildDecoTools() {
    const conf = modeConf();
    const isHeisei = state.mode === 'heisei';
    // ペンの色の系統は毎回「くすみ」（令和の既定様式）から始める（2026-08-17 指摘④）
    state.penPalette = ((conf.penPalettes || [])[0] || {}).id || null;
    buildPalTabs();
    buildColorRow();
    buildStampRow();
    buildTextStampRow();
    buildTextColorRow();
    buildSampleRow();
    /* 平成の考証回帰（2026-08-13 オーナー裁定・era-designer乖離監査A-2/A-3/B-1）:
       色パレット・角度えらび・押す前プレビューは令和専用。当時のスタンプは
       「用意された色のまま・押したらそのまま（手の癖ランダム角度）」なので、平成では丸ごと隠す */
    const textColorRow = $('#text-color-row');
    if (textColorRow) textColorRow.style.display = isHeisei ? 'none' : '';
    const angleRow = $('#text-angle-row');
    if (angleRow) angleRow.style.display = isHeisei ? 'none' : '';
    const previewCv = $('#text-stamp-preview');
    if (previewCv) previewCv.style.display = isHeisei ? 'none' : '';
    /* コロコロはスタンプの標準挙動に統一（2026-08-14 オーナー裁定・両モード共通）:
       「タップ=1個・なぞる=連なって押される」。ポン⇄コロコロの切替ボタンは廃止 */
    // 編集ツール「うごかす」は令和のみ（√me2型。平成は「押したらそのまま」が考証）
    const editBtn = document.querySelector('.tool-btn[data-mode="edit"]');
    if (editBtn) editBtn.style.display = isHeisei ? 'none' : '';
    clearEditSel();
    // 文字スタンプの色・角度を初期値へ（モードが変わるたびリセット・2026-08-13）
    state.textStampColor = null;
    state.textStampAngle = 'auto';
    document.querySelectorAll('#text-angle-row .angle-btn').forEach(b => b.classList.toggle('active', b.dataset.angle === 'auto'));
    renderTextStampPreview();
    state.penColor = penColorList()[0];
    /* スタンプの大きさ（2026-08-17 指摘③「スタンプの大きさを変えたかった」）。
       小/中/大の3段は前からあったが名前が無かった。令和はさらに無段のバーを足す。
       平成は当時の機種どおり3段のまま（機能追加なし）。 */
    const sizeSlider = $('#stamp-size');
    const sizeLabel = $('#stamp-size-label');
    const sizeNote = $('#stamp-size-note');
    [sizeSlider, sizeLabel, sizeNote].forEach(el => { if (el) el.style.display = isHeisei ? 'none' : ''; });
    state.stampSize = 96;
    if (sizeSlider) sizeSlider.value = String(state.stampSize);
    syncStampSizeButtons();
    /* ペンの太さは両モードで無段のバー（2026-08-17）。
       🚨 3段ボタン化は **していない**: 柄本の考証で「1999〜2003年の実機に太さ選択があったか」は
       要検証（無かったのではなく見つからなかった）であり、確度の弱い情報で様式を変えると
       2026-08-13と同じ失敗になる。今回は位置と見つかりやすさだけ直した。
       3段にするかはオーナーの裁定を待つ。 */
    state.penSize = 16;
    const penSizeSlider = $('#pen-size');
    if (penSizeSlider) penSizeSlider.value = '16';
    // 道具箱は毎回いちばん上から見せる（前の客のスクロール位置を残さない）
    const bar = $('.deco-toolbar');
    if (bar) bar.scrollTop = 0;
    requestAnimationFrame(syncToolbarMore);
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
    /* その回はじめて選んだときだけ、その道具のコツを一度だけ言う（2026-08-15）。
       持ち替えるたびに喋ると3分の落書きタイムが説明で埋まるため announceOnce で1回に絞る */
    /* コロコロ（なぞって連続で押す）は絵文字スタンプ・手描きスタンプの **両方** で効く
       （5098行付近の判定と対応）。片方だけに結線すると、手描きスタンプから入った客には
       一度も説明が届かない（2026-08-15の結線確認で実際に取りこぼしていた） */
    const isStamp = (t) => t === 'stamp' || t === 'dstamp';
    if (isStamp(tool) && !isStamp(state.tool)) announceOnceByMode('korokoro', 'korokoro');
    if (tool === 'edit' && state.tool !== 'edit' && state.mode !== 'heisei') announceOnce('toolUgokasu', 'toolUgokasuR');
    if (tool === 'edit') stopUgokasuHint(); // 気づいてもらえた＝点滅の役目は終わり（2026-08-17）
    state.tool = tool;
    state.stampChar = tool === 'stamp' ? extra : null;
    state.dstampId = tool === 'dstamp' ? extra : null;
    state.textStampSel = tool === 'textstamp' ? extra : null;
    state.sampleSel = tool === 'sample' ? extra : null;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    if (tool === 'pen') $('.tool-btn[data-mode="pen"]').classList.add('active');
    if (tool === 'eraser') $('.tool-btn[data-mode="eraser"]').classList.add('active');
    if (tool === 'swipe') $('.tool-btn[data-mode="swipe"]').classList.add('active');
    if (tool === 'edit') $('.tool-btn[data-mode="edit"]').classList.add('active');
    if (tool !== 'edit') clearEditSel(); // 別ツールへ移ったら選択枠を消す
    // 別ツールへ移ったら、見本・スタンプ・文字スタンプの選択ハイライトを消す（2026-08-13）
    if (tool !== 'sample') document.querySelectorAll('.sample-btn').forEach(b => b.classList.remove('selected'));
    if (tool !== 'stamp' && tool !== 'dstamp') document.querySelectorAll('.stamp-btn').forEach(b => b.classList.remove('selected'));
    if (tool !== 'textstamp') {
      document.querySelectorAll('.text-stamp-btn').forEach(b => b.classList.remove('selected'));
      renderTextStampPreview();
    }
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

  /* ---------- コロコロ（平成のみ・2026-08-13 考証回帰） ----------
     当時の名物ツール「ローラーでスタンプが連なって押される」を再現。
     ドラッグ中、一定間隔ごとにいま選んでいるスタンプを置いていく。
     1ドラッグ＝1操作（addMany）なので「もどす」で丸ごと消える */
  let rolling = false;
  let rollCount = 0;
  let lastRollX = 0, lastRollY = 0;

  function placeRollStamp(x, y) {
    const o = state.tool === 'dstamp'
      ? { type: 'dstamp', id: state.dstampId, x, y, size: state.stampSize * 1.2 }
      : { type: 'stamp', char: state.stampChar, x, y, size: state.stampSize };
    decoObjects.push(o);
    drawObject(drawCtx, o);
    rollCount++;
    lastRollX = x; lastRollY = y;
  }

  /* ===== 写真の送り（横持ちの落書き用・2026-08-14 オーナー裁定） =====
     「落書きのときだけ横にする」想定に合わせ、写真を大きく見せたまま
     別の写真へ移れるようにする。移り方は3つ:
       ・サムネイルのレール（横持ちでは縦一列）をスワイプして選ぶ
       ・写真の左右に出る ◀ ▶ を押す
       ・写真の上で **2本指の**横スワイプ
     2本指にしているのは、描くのが必ず1本指だから。
     1本指のスワイプを割り当てると、描いている最中に写真が変わる事故が起きうる。
     この方式なら描画中に切り替わることは原理的に起きない。 */
  function shotCount() { return decoShots().length; }
  function gotoShot(delta) {
    const n = shotCount();
    if (n <= 1) return;
    const next = Math.min(n - 1, Math.max(0, curShot + delta));
    if (next === curShot) return;
    if (state.isDrawing) return; // 念のため（描いている間は絶対に切り替えない）
    selectShot(next);
    updateShotNav();
    // 選んだサムネイルをレールの見える位置へ送る
    const row = $('#deco-thumbs');
    const btn = row && row.children[next];
    if (btn && btn.scrollIntoView) btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  function updateShotNav() {
    const n = shotCount();
    const prev = $('#btn-shot-prev'), next = $('#btn-shot-next');
    if (prev) prev.disabled = curShot <= 0;
    if (next) next.disabled = curShot >= n - 1;
  }
  $('#btn-shot-prev').addEventListener('click', (e) => { e.preventDefault(); gotoShot(-1); });
  $('#btn-shot-next').addEventListener('click', (e) => { e.preventDefault(); gotoShot(1); });

  // 2本指の横スワイプで写真を送る（描画は1本指なので競合しない）
  let twoFingerStart = null;
  drawCanvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      const mid = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      twoFingerStart = { x: mid, done: false };
    } else {
      twoFingerStart = null;
    }
  }, { passive: true });
  drawCanvas.addEventListener('touchmove', (e) => {
    if (!twoFingerStart || twoFingerStart.done || e.touches.length !== 2) return;
    const mid = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const dx = mid - twoFingerStart.x;
    if (Math.abs(dx) > 48) { // しきい値。うっかり触れた程度では動かさない
      twoFingerStart.done = true;
      gotoShot(dx < 0 ? 1 : -1); // 左へ払う＝次の写真
    }
  }, { passive: true });
  drawCanvas.addEventListener('touchend', () => { twoFingerStart = null; }, { passive: true });

  /* 落書き中に画面ごとスクロールさせない（2026-08-14 モニター指摘）。
     CSSの touch-action:none だけでは、LINEなどのアプリ内ブラウザで
     ページが一緒に動いてしまうことがあるため、キャンバス上のタッチは
     passive:false で明示的に止める（この2つは落書きキャンバス限定。
     ツールバーなど他の場所のスクロールには一切触らない）。 */
  const blockTouchScroll = (e) => { if (e.cancelable) e.preventDefault(); };
  drawCanvas.addEventListener('touchstart', blockTouchScroll, { passive: false });
  drawCanvas.addEventListener('touchmove', blockTouchScroll, { passive: false });

  drawCanvas.addEventListener('pointerdown', (e) => {
    if (state.remaining <= 0) return;
    if (e.cancelable) e.preventDefault(); // 長押しの選択・コールアウトもここで止める
    try { drawCanvas.setPointerCapture(e.pointerId); } catch (err) { /* 一部環境では無視して続行 */ }
    const { x, y } = getCanvasPos(e);

    if (state.tool === 'edit') {
      // 編集ツール（令和のみ）: 選択・移動・回転/拡縮・範囲選択
      state.isDrawing = true;
      editDown(x, y);
      return;
    }

    if (state.tool === 'swipe') {
      state.isDrawing = true;
      swipeRemoved = [];
      swipeEraseAt(x, y);
      return;
    }

    if (state.tool === 'sample' && state.sampleSel) {
      // 写真拡大表示方式: タップした「いま表示中の写真」1枚に見本を貼る
      const objs = sampleObjectsForPhoto(state.sampleSel);
      decoObjects.push(...objs);
      renderDeco();
      pushUndo({ op: 'addMany', count: objs.length });
      return;
    }

    if ((state.tool === 'stamp' && state.stampChar) || (state.tool === 'dstamp' && state.dstampId)) {
      /* スタンプの標準挙動（2026-08-14 オーナー裁定・両モード共通）:
         タップ=1個・なぞる=コロコロ（連なって押される）。1こ目はこの場で置き、
         ドラッグが続けば pointermove の rolling が連ねる。undoは1操作=タップ1個 or 1ドラッグの連なり全部 */
      state.isDrawing = true;
      rolling = true;
      rollCount = 0;
      placeRollStamp(x, y);
      hintUgokasu(); // 置いた直後に「うごかす」の存在を知らせる（2026-08-17 指摘⑦）
      return;
    }
    if (state.tool === 'textstamp' && state.textStampSel) {
      // 色・角度は事前に選んだもの（プレビューどおり）で押す（2026-08-13）
      const o = makeTextStampObject(state.textStampSel, x, y);
      const fontSize = o.fontSize;
      // ヒットテスト用に幅を測る
      drawCtx.save();
      drawCtx.font = `900 ${fontSize}px sans-serif`;
      o.w = drawCtx.measureText(o.t).width + fontSize * 0.4;
      drawCtx.restore();
      decoObjects.push(o);
      drawObject(drawCtx, o);
      pushUndo({ op: 'add' });
      hintUgokasu(); // 文字スタンプも「うごかす」で動かせる（2026-08-17 指摘⑦）
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
    if (e.cancelable) e.preventDefault(); // 描いている間はスクロールに渡さない
    const { x, y } = getCanvasPos(e);

    if (state.tool === 'edit') {
      editMove(x, y);
      return;
    }
    if (state.tool === 'swipe') {
      swipeEraseAt(x, y);
      return;
    }
    if (rolling) {
      // コロコロ: スタンプの大きさに応じた間隔で連なって押される
      const spacing = state.stampSize * 0.9;
      const dx = x - lastRollX, dy = y - lastRollY;
      if (dx * dx + dy * dy >= spacing * spacing) placeRollStamp(x, y);
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
      strokeCtx.clearRect(0, 0, SHOT_W, SHOT_H);
      strokePolyline(strokeCtx, curStroke.pts, curStroke.penType, curStroke.color, curStroke.size);
      state.lastX = x; state.lastY = y;
    }
  });

  function endStroke() {
    if (!state.isDrawing) return;
    state.isDrawing = false;
    if (state.tool === 'edit') {
      editUp();
      return;
    }
    if (rolling) {
      // コロコロの1ドラッグ＝1操作。「もどす」で連なり全部が消える
      rolling = false;
      if (rollCount > 0) pushUndo({ op: 'addMany', count: rollCount });
      rollCount = 0;
      return;
    }
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
      strokeCtx.clearRect(0, 0, SHOT_W, SHOT_H);
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
  /* スタンプの大きさ（2026-08-17 指摘③）。3段ボタンと無段バーは同じ state を見る。
     どちらを触っても、もう一方の見た目がついてくる（別々に見えると「効いてない」になる） */
  function syncStampSizeButtons() {
    document.querySelectorAll('#stamp-size-row .size-btn').forEach(b => b.classList.toggle('active', Number(b.dataset.stampsize) === state.stampSize));
  }
  document.querySelectorAll('#stamp-size-row .size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.stampSize = Number(btn.dataset.stampsize);
      const sl = $('#stamp-size');
      if (sl) sl.value = String(state.stampSize);
      syncStampSizeButtons();
    });
  });
  const stampSizeSlider = $('#stamp-size');
  if (stampSizeSlider) {
    stampSizeSlider.addEventListener('input', (e) => {
      state.stampSize = Number(e.target.value);
      syncStampSizeButtons(); // ぴったり一致したときだけ3段のどれかが点く
    });
  }
  $('#btn-undo').addEventListener('click', undo);
  $('#btn-clear').addEventListener('click', () => {
    // 「ぜんぶ消す」の対象は表示中の写真1枚ぶん（写真拡大表示方式）
    if (!decoObjects.length) return;
    pushUndo({ op: 'remove', items: decoObjects.map((obj, index) => ({ index, obj })) });
    decoObjects.length = 0; // shotDeco[curShot].objects への参照を保ったまま空にする
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
    const color = state.textStampColor || (state.mode === 'reiwa' ? '#a8917d' : '#ff2fa0');
    setTool('textstamp', { t, style: 'sticker', color });
    renderTextStampPreview();
    showDecoToast('しゃしんをタップして なまえを押してね！');
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

  /* ---------- 「うごかす」に気づいてもらう（2026-08-17 JKモニター指摘⑦） ----------
     指摘は「スタンプを押した後に移動や回転させられるようにしたい」。
     この機能は v17 で入っていて、移動・回転・拡大縮小・複製まで全部できる。
     つまり**足りないのは機能ではなく気づき**だった。ボイス（reiwa_tool_ugokasu）は
     道具を選んだ後にしか鳴らない＝選ばない客には永久に届かない設計になっていた。
     → 初めてスタンプを置いた瞬間に、ボタンを光らせて一言出す。1セッション1回だけ。
     使ってくれたら光るのをやめる（役目が終わったものを光らせ続けない）。 */
  let ugokasuHinted = false;
  function hintUgokasu() {
    if (ugokasuHinted || state.mode === 'heisei') return;
    ugokasuHinted = true;
    const btn = $('#btn-tool-edit');
    if (btn) btn.classList.add('hint-pulse');
    showDecoToast('👆 おいたスタンプは【うごかす】で 動かす・回す・大きさ が変えられるよ');
  }
  function stopUgokasuHint() {
    const btn = $('#btn-tool-edit');
    if (btn) btn.classList.remove('hint-pulse');
  }
  function resetUgokasuHint() {
    ugokasuHinted = false;
    stopUgokasuHint();
  }

  function showDecoToast(text) {
    decoToastEl.textContent = text;
    decoToastEl.classList.remove('hidden');
    if (decoToastId) clearTimeout(decoToastId);
    decoToastId = setTimeout(() => decoToastEl.classList.add('hidden'), 2600);
  }

  /* ---------- シールに載せる写真えらび（2026-08-13 実機テスト指摘対応） ----------
     2枚ワイド/6分割などで「4枚のどれがシールに載るか」が選べなかった。
     らくがきスタート前のゲートにサムネイルを並べ、タップで選ぶ（選んだ順に並ぶ）。
     デフォルトは撮影順＝従来と同じ。タイマー開始前なので持ち時間は減らない。

     🚨 2026-08-17 JKモニター指摘①「2分割で4枚写真撮ったのに選べない」。
     UIは去年から出ていて、押せば動いていた。**選べなかった理由は初期状態の方**だった:
       ・2枚ワイド（2マス）でも最初から4枚すべてが選択済みで並ぶ
       ・のせたい3枚目をタップすると「選ぶ」ではなく「はずす」が起きる（すでに選択済みのため）
       ・タップして写真が薄くなるので、客には「消えた／壊れた」に見える
     → 初期選択を **そのぶんかつのマス数ぶん** にした。2マスなら1・2だけが点いた状態で始まり、
       3枚目をタップすれば素直に「選ぶ」になる。あわせて凡例・できあがり見本・
       落書き中の開き直しを足した（通り過ぎたら二度と戻れないのも「選べない」の一部だった）。 */
  function defaultPhotoPick(shotCount) {
    const cellCount = layoutCells(state.layout).length;
    const n = Math.max(1, Math.min(shotCount, cellCount));
    return Array.from({ length: n }, (_, i) => i);
  }

  function buildPhotoPick() {
    const row = $('#photo-pick');
    if (!row) return;
    const shots = state.processedShots.length ? state.processedShots : state.shots;
    if (!state.photoPick || !state.photoPick.length) state.photoPick = defaultPhotoPick(shots.length);
    state.photoPick = state.photoPick.filter(i => i < shots.length);
    if (!state.photoPick.length) state.photoPick = defaultPhotoPick(shots.length);
    row.innerHTML = '';
    shots.forEach((shot, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pp-item';
      b.dataset.idx = String(i);
      const cv = document.createElement('canvas');
      cv.width = 96; cv.height = 72;
      drawCover(cv.getContext('2d'), shot, 0, 0, 96, 72);
      b.appendChild(cv);
      const num = document.createElement('span');
      num.className = 'pp-num';
      b.appendChild(num);
      b.addEventListener('click', () => {
        const at = state.photoPick.indexOf(i);
        if (at >= 0) {
          if (state.photoPick.length <= 1) return; // 最低1枚は残す（真っ白なシールを防ぐ）
          state.photoPick.splice(at, 1);
        } else {
          state.photoPick.push(i);
        }
        composeSheet();       // 後ろのシールにその場で反映（選んだ結果が見える）
        refreshPhotoPick();
      });
      row.appendChild(b);
    });
    buildPhotoFitRow();
    refreshPhotoPick();
  }

  /* 「おさまり」の選択（令和のみ・2026-08-17 指摘②「4分割で写真が切れちゃうのが悲しい」） */
  function buildPhotoFitRow() {
    const row = $('#photo-fit-row');
    if (!row) return;
    row.innerHTML = '';
    PHOTO_FITS.forEach((f) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'fit-btn' + (f.id === photoFit() ? ' active' : '');
      b.dataset.fit = f.id;
      b.textContent = f.label;
      b.addEventListener('click', () => {
        state.photoFit = f.id;
        playSound('seTap');
        composeSheet();
        refreshPhotoPick();
      });
      row.appendChild(b);
    });
  }

  function refreshPhotoPick() {
    const row = $('#photo-pick');
    if (!row) return;
    const cellCount = layoutCells(state.layout).length; // このレイアウトのマス数
    Array.from(row.children).forEach((b) => {
      const i = Number(b.dataset.idx);
      const at = state.photoPick.indexOf(i);
      const on = at >= 0;
      b.classList.toggle('on', on);
      // 選んだ順がマス数を超えた分（このレイアウトでは載らない）は半点灯で知らせる
      b.classList.toggle('spare', on && at >= cellCount);
      b.querySelector('.pp-num').textContent = on ? String(at + 1) : '＋';
    });
    const hint = $('#photo-pick-hint');
    if (hint) {
      /* 凡例を必ず1行目に出す（2026-08-17）。「タップで えらぶ／もういちど タップで はずす」を
         書いていなかったのが、指摘①で客が手を止めた場所 */
      const legend = 'タップで えらぶ・もういちどで はずす。';
      if (cellCount < state.photoPick.length) {
        /* D-8（2026-08-15 柄本仕様書）: 「4まい のるよ」だけでは5枚目以降が捨てられることが
           読み取れなかった（半点灯で示してはいるが、その凡例が画面のどこにも無い） */
        hint.textContent = `${legend}このぶんかつは ${cellCount}マス。えらんだ じゅんに さいしょの${cellCount}まいが のるよ（のこりは のらないよ）`;
      } else if (cellCount > state.photoPick.length) {
        hint.textContent = `${legend}えらんだ ${state.photoPick.length}まいが じゅんばんに くりかえし ならぶよ`;
      } else {
        hint.textContent = `${legend}えらんだ ${state.photoPick.length}まいが じゅんばんに ならぶよ`;
      }
    }
    const fitRow = $('#photo-fit-row');
    if (fitRow) {
      const cur = photoFit();
      fitRow.querySelectorAll('.fit-btn').forEach(b => b.classList.toggle('active', b.dataset.fit === cur));
      const fh = $('#photo-fit-hint');
      const meta = PHOTO_FITS.find(f => f.id === cur);
      if (fh && meta) fh.textContent = meta.hint;
    }
    drawPhotoPickPreview();
  }

  /* できあがり見本（2026-08-17）: シールの合成結果をその場で小さく見せる。
     指摘②の「切れちゃう」は**印刷まで見えなかった**のが本体。ここで見えれば選び直せる */
  function drawPhotoPickPreview() {
    const cv = $('#photo-pick-preview');
    if (!cv || !sheetCanvas.width) return;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height);
    const s = Math.min(cv.width / SHEET_W, cv.height / SHEET_H);
    const dw = SHEET_W * s, dh = SHEET_H * s;
    // 落書き済みなら落書きも載せた姿を見せる（開き直したときは描いた分が入っている）
    composeFinal();
    ctx.drawImage(finalCanvas, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh);
  }

  function startDecoScreen() {
    showScreen('screen-deco');
    // 道具箱の「▼ したにも道具がある」帯の状態を、画面に出た時点で必ず取り直す（2026-08-18）
    requestAnimationFrame(() => syncToolbarMore());
    /* 誤操作での離脱対策をこの画面の間だけ入れる（2026-08-14 実機テスト指摘①）:
       履歴にダミーを積み、端スワイプの吸収と落書きの自動保存を有効にする */
    decoActive = true;
    armHistorySentinel();
    // 写真拡大表示方式: 落書きは写真ごとに持つ。1枚目を拡大表示して開始
    shotDeco = decoShots().map(() => ({ objects: [], undo: [] }));
    resetUgokasuHint(); // 次の客には「うごかす」の案内をもう一度出す（2026-08-17）
    extendUsed = 0;     // 延長の回数は客ごとにリセット（2026-08-17 指摘⑤）
    closeExtendModal();
    buildDecoThumbs();
    selectShot(0);
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
    timerDisplay.parentElement.classList.remove('alarm', 'warn-box');
    document.documentElement.style.setProperty('--deco-p', '100%');

    /* タイマーは「客が『らくがきスタート』を押した瞬間」から走らせる（2026-07-26 オーナー裁定）。
       撮影ルームから出て、別の場所へ移動して、座るまでの間に持ち時間が溶けるのを防ぐため。 */
    if (state.timerId) clearInterval(state.timerId);
    drawCanvas.style.pointerEvents = 'none';
    /* シールに載せる写真えらびは令和専用（2026-08-13 オーナー裁定・era-designer乖離監査B-2）:
       1999〜2003年の実機は「撮った写真がそのまま落書きへ」＝撮影順固定。平成はUIごと出さない */
    const pickOn = state.mode !== 'heisei';
    const panel = $('#photo-pick-panel');
    if (panel) panel.style.display = pickOn ? '' : 'none';
    const againGroup = $('#group-photo-pick');
    if (againGroup) againGroup.style.display = pickOn ? '' : 'none';
    if (pickOn) {
      state.photoFit = 'face'; // 次の客に前の客のおさまりを持ち越さない
      buildPhotoPick(); // シールに載せる写真えらび（タイマー開始前に済ませる）
    } else {
      state.photoPick = null; // 平成は撮影順固定
    }
    $('#deco-gate-title').textContent = 'らくがき、はじめる？';
    $('#deco-gate-note').classList.remove('hidden');
    $('#btn-deco-start').classList.remove('hidden');
    $('#btn-photo-pick-close').classList.add('hidden');
    $('#deco-start-gate').classList.remove('hidden');
    /* ゲートの案内（2026-08-15 追加ボイスパック）。令和はこのゲートに
       「シールに載せる写真えらび」があるので、1本目に続けて2本目を繋ぐ */
    announceByMode('decoGate');
    if (pickOn) chainAnnounce('decoGateR', 'photoPickR');
  }

  $('#btn-deco-start').addEventListener('click', () => {
    $('#deco-start-gate').classList.add('hidden');
    drawCanvas.style.pointerEvents = 'auto';
    playAnnounce('decoStart'); // 案内は1本チャンネル経由
    // 08_deco_start のあとに続けて「写真は1枚ずつ大きく描ける」を鳴らす（2026-08-15）
    chainAnnounce('decoStart', state.mode === 'heisei' ? 'decoPhotoSwitchH' : 'decoPhotoSwitchR');
    startDecoTimer();
  });

  /* 落書き中に「のせる写真・おさまり」を開き直す（令和のみ・2026-08-17 指摘①②）。
     ⚠️ タイマーは止めない。止めると「開けば時間が止まる」抜け道になり、
     文化祭の回転率が壊れる（延長は下の「もうちょっと描く」で1回だけと決めている）。
     開いている間は描けなくする（ゲートの下の写真に指が当たると線が入るため）。 */
  const btnPickAgain = $('#btn-photo-pick-again');
  if (btnPickAgain) {
    btnPickAgain.addEventListener('click', () => {
      if (state.mode === 'heisei' || decoFinished) return;
      drawCanvas.style.pointerEvents = 'none';
      clearEditSel();
      buildPhotoPick();
      $('#deco-gate-title').textContent = 'のせる しゃしんを えらび直す';
      $('#deco-gate-note').classList.add('hidden');
      $('#btn-deco-start').classList.add('hidden');
      $('#btn-photo-pick-close').classList.remove('hidden');
      $('#deco-start-gate').classList.remove('hidden');
      playAnnounce('photoPickR');
    });
  }
  $('#btn-photo-pick-close').addEventListener('click', () => {
    $('#deco-start-gate').classList.add('hidden');
    if (state.remaining > 0 && !decoFinished) drawCanvas.style.pointerEvents = 'auto';
    stopVoice();
  });

  function startDecoTimer(withHalftime = true) {
    if (state.timerId) clearInterval(state.timerId);
    /* 中間通知（2026-08-12 新設）: 現行実機は約200秒の途中で区切りの通知が入る。
       残り時間が半分になったところで一声＋トースト表示。
       延長ぶんの走り直しでは中間通知を出さない（60秒の真ん中で「のこり はんぶん」は不要） */
    const halfPoint = withHalftime ? Math.floor(decoSeconds() / 2) : -1;
    const total = state.remaining || decoSeconds();
    state.timerId = setInterval(() => {
      state.remaining--;
      timerDisplay.textContent = formatTime(Math.max(0, state.remaining));
      // 令和: 円形プログレスリング用の残量%（CSS変数。conic-gradientが描く）
      document.documentElement.style.setProperty('--deco-p', ((Math.max(0, state.remaining) / total) * 100).toFixed(1) + '%');
      // 平成: 残り30秒から目覚まし時計のベルが震える（柄本仕様書3-7）
      if (state.remaining === 30) timerDisplay.parentElement.classList.add('alarm');
      if (state.remaining === halfPoint) {
        playSound('decoHalftime');
        showDecoToast(`⏰ のこり はんぶん！（${formatTime(halfPoint)}）`);
      }
      if (state.remaining <= 10) {
        timerDisplay.classList.add('warn');
        timerDisplay.parentElement.classList.add('warn-box');
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
        // 令和だけ「もうちょっと描く」を出す（平成は3分きっかりが実機の型・2026-08-17 指摘⑤）
        if (state.mode !== 'heisei' && extendUsed < DECO_EXTEND_MAX && !decoFinished) { offerExtend(); return; }
        finishDeco('timeup');
      }
    }, 1000);
  }

  /* ---------- 延長「もうちょっと描く」（令和のみ・2026-08-17 JKモニター指摘⑤） ----------
     指摘は「3分の時間制限はいらないのでは？（過ぎてもボーナスで無制限になるのがあるらしい）」。
     実機にも延長のボーナスはある。ただし **文化祭は1台を何十組も回す**ので、
     無制限にすると後ろの列がそのまま止まる。回転率を殺さない形に落とした:
       ・出るのはタイムアップの瞬間だけ（最初から見えていると「3分＋1分」が既定になる）
       ・1セッション1回・＋60秒まで（最大でも1組あたり1分しか伸びない）
       ・EXTEND_DECIDE_SEC 秒で自動的に「かんせい」へ進む（無人運用なので、
         客が席を立って放置しても列は止まらない）
     🚨 「開いている間はタイマーを止める」形にはしない。止められる仕掛けを1つでも作ると
     そこが抜け道になる（写真えらびを開き直す導線でも同じ判断をしている）。 */
  const DECO_EXTEND_SECONDS = 60;   // 1回の延長で足す秒数
  const DECO_EXTEND_MAX = 1;        // 1セッションに使える回数
  const EXTEND_DECIDE_SEC = 12;     // 迷っている間に自動で完成へ進む秒数
  let extendUsed = 0;
  let extendDecideId = null;
  const extendModal = $('#extend-modal');

  function closeExtendModal() {
    if (extendDecideId) { clearInterval(extendDecideId); extendDecideId = null; }
    if (extendModal) extendModal.classList.add('hidden');
  }

  function offerExtend() {
    if (!extendModal) { finishDeco('timeup'); return; }
    drawCanvas.style.pointerEvents = 'none';
    playSound('timeup');
    extendModal.classList.remove('hidden');
    let left = EXTEND_DECIDE_SEC;
    const cd = $('#extend-countdown');
    const paint = () => { if (cd) cd.textContent = `${left}びょう で かんせいに すすむよ`; };
    paint();
    extendDecideId = setInterval(() => {
      left--;
      paint();
      if (left <= 0) { closeExtendModal(); finishDeco('timeup'); }
    }, 1000);
  }

  if (extendModal) {
    $('#btn-extend-yes').addEventListener('click', () => {
      extendUsed++;
      closeExtendModal();
      state.remaining = DECO_EXTEND_SECONDS;
      state.warningPlayed = false;
      timerDisplay.textContent = formatTime(state.remaining);
      timerDisplay.classList.remove('warn');
      timerDisplay.parentElement.classList.remove('alarm', 'warn-box');
      decoCountdownEl.classList.add('hidden');
      drawCanvas.style.pointerEvents = 'auto';
      showDecoToast(`⏰ ＋${DECO_EXTEND_SECONDS}びょう！ 延長は この1かいだけだよ`);
      startDecoTimer(false);
    });
    $('#btn-extend-no').addEventListener('click', () => {
      closeExtendModal();
      finishDeco('manual');
    });
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
    clearEditSel();
    decoCountdownEl.classList.add('hidden');
    decoToastEl.classList.add('hidden');
    /* 落書きが終わったので、端スワイプの吸収と履歴の番人は外す（2026-08-14）。
       一時保存はまだ消さない。分割えらび中に離脱しても、描いたものは戻せるようにする */
    decoActive = false;
    disarmHistorySentinel();
    /* D-14（2026-08-15 柄本仕様書）: ボタンと同じ「✨ できあがり！」を結果側にも出していたため、
       押せたのかどうかが分からなかった。結果側は「かんせい！」にして操作と結果を分ける */
    $('#deco-timeup-text').textContent = reason === 'manual' ? '✨ かんせい！' : '⏰ タイムアップ！';
    $('#deco-timeup').classList.remove('hidden');
    playSound(reason === 'manual' ? 'finish' : 'timeup');
    await sleep(1300);
    $('#deco-timeup').classList.add('hidden');
    if (state.mode === 'heisei') {
      /* 平成の実機の型（2026-08-13 オーナー裁定・era-designer乖離監査B-3）:
         撮影→落書き→「分割数選択」→排出。落書きの出来を見てから何分割で持ち帰るかを決める。
         タイマーはもう止まっているので、ここはゆっくり選んでよい */
      showHeiseiLayoutGate();
      return;
    }
    composeFinal();
    clearSessionSnapshot(); // シールが出来上がった＝一時保存の役目は終わり（客の写真を端末に残さない）
    showScreen('screen-print');
    startPrintSequence();
  }

  /* ---------- 平成: 落書き後の分割選択（2026-08-13 考証回帰） ----------
     写真拡大表示方式では落書きが最初から写真単位で保持されているため、
     分割を選び直しても composeFinal がそのまま各セルへ縮小反映する（再投影の座標変換は不要）。 */
  function showHeiseiLayoutGate() {
    const gate = $('#layout-gate');
    const list = $('#layout-gate-list');
    list.innerHTML = '';
    playAnnounce('layoutGateH'); // 「なんぶんかつで もってかえる？」（2026-08-15）
    LAYOUTS.forEach((layout) => {
      const el = document.createElement('div');
      el.className = 'layout-item' + (layout.id === state.layout.id ? ' selected' : '');
      el.innerHTML = layoutIconSVG(layout) + `<span class="layout-label">${layout.label}</span>`;
      el.addEventListener('click', () => {
        list.querySelectorAll('.layout-item').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        state.layout = layout; // 落書きは写真単位なので、分割を変えても composeFinal が付いてくる

        composeSheet();
        gate.classList.add('hidden');
        composeFinal();
        clearSessionSnapshot(); // 同上（分割を選んで排出まで来たら消す）
        showScreen('screen-print');
        startPrintSequence();
      });
      list.appendChild(el);
    });
    gate.classList.remove('hidden');
  }

  /* ===================== 4. プリント画面 ===================== */
  const finalCanvas = $('#final-canvas');
  finalCanvas.width = SHEET_W;
  finalCanvas.height = SHEET_H;

  function fileStamp() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
  }

  /* 落書きをシールの各セルへ縮小反映する（写真拡大表示方式・2026-08-13）。
     写真と同じセルパスでクリップし、同じ drawCover（中央クロップ）で落書きレイヤーを
     重ねるので、写真のどの位置に描いたかがセル上でも寸分違わず保たれる。
     同じ写真が複数セルに入る分割（16分割など）では、落書きも同じように繰り返される。 */
  function composeDoodleOntoSheet(ctx) {
    const shots = state.processedShots.length ? state.processedShots : state.shots;
    const pick = (state.photoPick && state.photoPick.length)
      ? state.photoPick.filter(idx => idx < shots.length)
      : null;
    const order = (pick && pick.length) ? pick : shots.map((_, idx) => idx);
    const cells = layoutCells(state.layout);
    const radius = state.layout.radius;
    const isCircle = state.layout.shape === 'circle';
    const rendered = {}; // 写真indexごとの落書きレイヤー（同じ写真が複数セルでも1回だけ描く）
    cells.forEach((cell, i) => {
      const di = order[i % order.length];
      if (!shotDeco[di] || !shotDeco[di].objects.length) return;
      if (!rendered[di]) rendered[di] = renderShotDoodle(di);
      const { x, y, w, h } = cell;
      const cx = x + w / 2, cy = y + h / 2;
      const rad = Math.min(w, h) / 2;
      ctx.save();
      if (isCircle) {
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      } else {
        roundRect(ctx, x, y, w, h, radius);
      }
      ctx.clip();
      // 写真と同じ「おさまり」で載せる。ここがずれると落書きだけが写真から浮く
      if (isCircle) {
        drawShotFit(ctx, rendered[di], cx - rad, cy - rad, rad * 2, rad * 2, di);
      } else {
        drawShotFit(ctx, rendered[di], x, y, w, h, di);
      }
      ctx.restore();
    });
  }

  function composeFinal() {
    const ctx = finalCanvas.getContext('2d');
    ctx.clearRect(0, 0, SHEET_W, SHEET_H);
    ctx.drawImage(sheetCanvas, 0, 0);
    composeDoodleOntoSheet(ctx);
    /* フレーム／カラーの飾りは落書きの「あと」に載せ直す（2026-08-14 実機テスト指摘対応）。
       写真いっぱいに落書きされると、台紙側に描いてある枠とモチーフが隠れてしまい、
       また「フレームが効いていない」に戻るため。実機のフレームも落書きの上に載る */
    drawSheetDecor(ctx);
    /* 保存は押された瞬間に deliverImage が生成して届ける（2026-08-14 保存経路の作り替え）。
       以前ここで作っていた巨大dataURLのhrefは、iPad Safariで保存が無反応になる原因の
       ひとつだったため廃止（a[download]+dataURLはiOSで信用しない） */
  }

  /* ===================== 保存経路（2026-08-14 実機指摘「Androidだと保存できませんでした」） =====================
     経緯を残す。ここは2回作り替えている:
       v18（iOS対策）… a[download] を全廃し「共有シート優先」の一本道にした。
                        iOS Safari は download 属性を実質サポートしておらず、押しても
                        何も起きない／別タブで開くだけでカメラロールに入らないため。
       今回（Android対策）… その一本道が **Androidの確実な経路を奪っていた**。
                        Android Chrome は canShare({files}) が true を返すので必ず①の
                        共有シートに入るが、Androidの共有シートには「画像を保存」に相当する
                        項目が無いことが多く（アプリ一覧が出るだけ）、客は保存できない。
                        最後の砦の長押しも、Chrome では blob: 画像に「画像をダウンロード」が
                        出ないことがあり、二重に詰んでいた。

     結論: **一本道にせず、端末ごとに「その端末で確実に成功する経路」を先頭に置く。**
       Android / PC → ① BlobURL + a[download]（ダウンロードフォルダに確実に落ちる）
       iOS         → ① 共有シート（v18の成果。カメラロール直行はこれしかない）
       どちらも不可 → ② もう一方の経路 → ③ 端末別の文言を出す長押しモーダル（最後の砦）
     判定は機能検出を優先し（navigator.canShare({files}) / a.download の有無）、
     どうしても機能検出で割れないところだけ UA を見る
     （download 属性は iOS でも "download" in a が true になってしまうため、ここだけは UA が要る）。
     成功・失敗は save-toast で必ず客に見せる（無言で失敗しない）。

     🚨 この経路で最も重要な制約（触るときは必ず守ること）:
     **navigator.share はユーザーのタップと同じタスクの中で呼ばなければならない。**
     iOSのWebKitはユーザージェスチャをタスク単位で判定するため、canvas.toBlob() の
     コールバックや await をひとつでも挟むと、その時点でジェスチャが切れて
     share は NotAllowedError で落ちる（＝また保存できない実機に戻る）。
     そのため Blob は **同期の toDataURL→atob** で作る。toBlob（非同期）は使わない。
     非同期化するくらいなら、多少重くても同期でよい——保存は客が持ち帰る最後の砦。 */
  // canvas → Blob を「同期で」作る（await を挟まないための要）
  function canvasToBlobSync(cv) {
    try {
      const dataUrl = cv.toDataURL('image/png');
      const comma = dataUrl.indexOf(',');
      const bin = atob(dataUrl.slice(comma + 1));
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new Blob([arr], { type: 'image/png' });
    } catch (e) {
      return null;
    }
  }
  // iPhone/iPad判定（iPadOSはMacintoshを名乗るためタッチ点数も見る）
  function isApplePhoneOrPad() {
    const ua = navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  }
  /* 保存経路をえらぶための環境判定（2026-08-14 Android対策）。
     毎回その場で作る（キャッシュしない）。検証時に差し替えやすくするため。 */
  function saveEnv() {
    const ua = navigator.userAgent || '';
    const isIOS = isApplePhoneOrPad();
    /* 機能検出: download 属性が「存在する」か。ただし iOS Safari は属性が存在しても
       無視するため、機能検出だけでは割れない。ここだけ UA で iOS を除外する */
    let hasDownloadAttr = false;
    try { hasDownloadAttr = 'download' in document.createElement('a'); } catch (e) { hasDownloadAttr = false; }
    return {
      isIOS,
      isAndroid: /Android/.test(ua),
      // アプリ内ブラウザ（LINE / Facebook / Instagram）はダウンロードが黙って失敗することがある
      isInApp: /\bLine\/|FBAN|FBAV|Instagram|\bMicroMessenger/i.test(ua),
      canDownload: hasDownloadAttr && !isIOS,
    };
  }
  // 機能検出: このBlobを共有シートに渡せるか（Fileごと作って canShare に聞く）
  function canShareFile(file) {
    if (!file || !navigator.share || !navigator.canShare) return false;
    try { return !!navigator.canShare({ files: [file] }); } catch (e) { return false; }
  }
  const saveToastEl = $('#save-toast');
  let saveToastId = null;
  function showSaveToast(text) {
    if (!saveToastEl) return;
    saveToastEl.textContent = text;
    saveToastEl.classList.remove('hidden');
    if (saveToastId) clearTimeout(saveToastId);
    saveToastId = setTimeout(() => saveToastEl.classList.add('hidden'), 4200);
  }
  let saveModalObjectUrl = null;
  let lastSavedBlob = null; // 「うまく保存できないとき」用に直近の画像を持っておく
  let lastSavedName = 'purikura.png';
  function showSaveFallback(blob, cv) {
    // 最後の砦: 長押し保存。BlobURLで表示（巨大dataURL文字列をDOMに埋めない）
    const img = $('#save-modal-img');
    try {
      if (saveModalObjectUrl) { URL.revokeObjectURL(saveModalObjectUrl); saveModalObjectUrl = null; }
    } catch (e) { saveModalObjectUrl = null; }
    /* 🚨 ここは最後の砦なので、何があっても画像を出し切る。
       BlobURLが作れない環境（2026-08-14の検証で発見）でも dataURL に落ちて必ず表示する。
       以前はここが素通しで、createObjectURL が例外を投げると保存処理ごと落ちていた */
    let shown = false;
    if (blob) {
      try {
        saveModalObjectUrl = URL.createObjectURL(blob);
        img.src = saveModalObjectUrl;
        shown = true;
      } catch (e) { saveModalObjectUrl = null; }
    }
    if (!shown && cv) {
      try { img.src = cv.toDataURL('image/png'); shown = true; } catch (e) { /* ここまで来たら画像は出せない */ }
    }
    /* 案内文は端末別に出し分ける（2026-08-14 Android対策）。
       長押しメニューの項目名が iOS と Android で違うため、
       「“写真”に追加」とだけ書いてあるとAndroidの客はその項目を探し続けて詰む */
    const env = saveEnv();
    const textEl = $('#save-modal-text');
    const hintEl = $('#save-modal-hint');
    if (textEl) {
      if (env.isIOS) {
        textEl.innerHTML = 'この画像を<b>ながおし</b>して<br>「<b>“写真”に追加</b>」をえらんでね';
      } else if (env.isAndroid) {
        textEl.innerHTML = 'この画像を<b>ながおし</b>して<br>「<b>画像をダウンロード</b>」をえらんでね';
      } else {
        textEl.innerHTML = 'この画像を<b>ながおし</b>（パソコンは<b>右クリック</b>）して<br>「<b>画像を保存</b>」をえらんでね';
      }
    }
    if (hintEl) {
      /* アプリ内ブラウザ（LINE等）は長押しメニューも代替ボタンも出ないことがある
         （2026-08-15 検見の総合検収【提案⑭】: LINE(iOS)で代替ボタンが1つも出ず、
         残るヒントが「パソコンなら右クリック」だけで、iPhoneの客に手がかりが無かった）。
         その場合の最後の手は「ふつうのブラウザで開き直す」なので、それを名指しで書く */
      if (env.isInApp) {
        hintEl.textContent = env.isIOS
          ? '（できないときは 右上の「…」から「Safariで開く」をえらんでね）'
          : '（できないときは 右上の「⋮」から「ブラウザで開く」をえらんでね）';
      } else {
        hintEl.textContent = env.isAndroid
          ? '（出てこないときは下の「⬇ ダウンロードでほぞん」をおしてね）'
          : '（パソコンなら 右クリック → 「画像を保存」）';
      }
    }
    /* 別経路への乗り換え口。長押しが効かない環境でも、客がここから必ず抜けられるようにする。
       使える経路だけ出す（押しても何も起きないボタンを見せない） */
    const dlBtn = $('#btn-save-alt-download');
    const shBtn = $('#btn-save-alt-share');
    if (dlBtn) dlBtn.classList.toggle('hidden', !(blob && env.canDownload));
    if (shBtn) {
      let sharable = false;
      if (blob) {
        try { sharable = canShareFile(new File([blob], lastSavedName, { type: 'image/png' })); } catch (e) { sharable = false; }
      }
      shBtn.classList.toggle('hidden', !sharable);
    }
    $('#save-modal').classList.remove('hidden');
    /* ホーム画面追加の案内バーは z-index 310 でモーダル(290)より上にいる。
       横持ちでは「とじる」に重なって押せなくなるため、保存モーダルを出す間は引っ込める
       （2026-08-15 横持ちのスクショで発見。最後の砦が袋小路になっていた） */
    const pwaBar = $('#pwa-hint');
    if (pwaBar) pwaBar.classList.add('hidden');
    /* 「がぞうを ながおしして…」（2026-08-15）。iOSは「しゃしんに追加」で文言が一致するが、
       Androidの長押しメニューは「画像をダウンロード」なので、そのままだと客が探す項目とズレる。
       ボイスは iOS のときだけ鳴らし、Androidは画面の文字（端末別に出し分け済み）に任せる。
       ※Android用の言い回しは音羽さんへ追加依頼済みとして growth-log に残す */
    if (env.isIOS) playAnnounce('saveLongpress');
    /* ここでトーストは出さない（2026-08-14 実機指摘「横向きで文字被り」）。
       トーストは画面上端に出るため、横持ちではモーダルの案内文
       「この画像をながおしして…」に重なって読めなくなっていた。
       同じ内容をモーダル自身が大きく出しているので、二重に言う必要もない。 */
    if (saveToastEl) { saveToastEl.classList.add('hidden'); if (saveToastId) clearTimeout(saveToastId); }
  }
  $('#btn-save-close').addEventListener('click', () => {
    $('#save-modal').classList.add('hidden');
    if (saveModalObjectUrl) { URL.revokeObjectURL(saveModalObjectUrl); saveModalObjectUrl = null; }
  });
  // 「うまく保存できないとき」= どの環境でも成功する長押し保存へ客が自分で降りられる出口
  $('#btn-save-longpress').addEventListener('click', (e) => {
    e.preventDefault();
    const blob = lastSavedBlob || canvasToBlobSync(finalCanvas);
    lastSaveRoute = 'fallback';
    showSaveFallback(blob, finalCanvas);
  });
  /* 長押しモーダルの中の乗り換え口（2026-08-14 Android対策）。
     長押しメニューが出ない端末でも、ここから別経路で必ず保存できるようにする */
  $('#btn-save-alt-download').addEventListener('click', (e) => {
    e.preventDefault();
    const blob = lastSavedBlob || canvasToBlobSync(finalCanvas);
    if (!blob) { showSaveToast('うまくいかなかった… もういちど おしてみてね。だめなら 係の人を よんでね🙏'); return; }
    if (tryDownloadBlob(blob, lastSavedName)) {
      lastSaveRoute = 'download';
      showSaveToast(saveEnv().isAndroid
        ? '✅ 「ダウンロード」に保存したよ！ギャラリーかFilesで見てね'
        : '✅ ダウンロードしたよ！');
    } else {
      showSaveToast('この画面ではダウンロードできなかった…ながおしをためしてね');
    }
  });
  $('#btn-save-alt-share').addEventListener('click', (e) => {
    e.preventDefault();
    // 🚨 ここも同期でshareへ到達する（await/toBlobを挟まない）
    const blob = lastSavedBlob || canvasToBlobSync(finalCanvas);
    if (!blob) { showSaveToast('うまくいかなかった… もういちど おしてみてね。だめなら 係の人を よんでね🙏'); return; }
    if (!tryShareBlob(blob, lastSavedName, finalCanvas)) {
      showSaveToast('この画面では共有できなかった…ながおしをためしてね');
    }
  });
  // 検証用: 直近にどの経路を通ったか（'share'|'download'|'fallback'|'share-cancel'|'share-failed'）
  let lastSaveRoute = null;

  /* 経路①-A: BlobURL + a[download]。Android / PC で確実に落ちる方法。
     成功したら true、その場で例外になったら false（＝次の経路へ降りる）。
     🚨 「クリックしたのに何も落ちない」黙った失敗（アプリ内ブラウザ等）は検出できない。
        そのため保存後も「うまく保存できないときは▶ながおしで保存」を常設したままにする */
  function tryDownloadBlob(blob, filename) {
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* 経路①-B: 共有シート。iOS でカメラロールに入る唯一の道。
     🚨 ここへは同期で（await を挟まずに）到達しなければならない。理由は上のコメント参照。
     渡せない・その場で例外＝false を返し、呼び手が次の経路へ降ろす */
  function tryShareBlob(blob, filename, cv) {
    const file = (() => {
      try { return new File([blob], filename, { type: 'image/png' }); } catch (e) { return null; }
    })();
    if (!canShareFile(file)) return false;
    let p = null;
    try {
      p = navigator.share({ files: [file] }); // ← タップと同じタスクの中で呼ぶ（最重要）
    } catch (e) {
      return false;
    }
    if (!p || typeof p.then !== 'function') return false;
    lastSaveRoute = 'share';
    /* 🚨 2026-08-15 検見の総合検収【要修正⑤】: この経路の文言だけ端末別の出し分けが
       漏れていた。Androidでダウンロードが失敗するとここへ降りてくるのに、
       **Androidの端末に「カメラロールに入るよ」と表示していた**（Androidにカメラロールは無い）。
       しかもここへ落ちるのは「共有シートに保存項目が無い」いちばん困っている客。
       ①-A のトーストと同じ判定（saveEnv().isAndroid）をこの経路にも通す。 */
    const shareEnv = saveEnv();
    showSaveToast(shareEnv.isAndroid
      ? '📤 ほぞんメニューから 保存を えらんでね！（ギャラリーかFilesに入るよ）'
      : '📤 「画像を保存」をえらぶと カメラロールに入るよ！');
    /* ボイスは端末と一致するときだけ鳴らす。
       saveGuide 「ほぞんメニューが出るよ。画像を保存、をえらんでね！」は
       Androidの共有シートに「画像を保存」が無いことがあるので鳴らさない
       （Android用の言い回しは音羽さんへ追加依頼済み。届くまでは画面の文字に任せる） */
    if (!shareEnv.isAndroid) playAnnounce('saveGuide'); // （2026-08-15）
    p.then(() => {
      lastSaveRoute = 'share';
      showSaveToast(shareEnv.isAndroid
        ? '✅ ほぞんメニューにわたしたよ！ギャラリーかFilesを見てね'
        : '✅ ほぞんメニューにわたしたよ！カメラロールを見てね');
      /* 🚨 saveSuccess は「カメラロールを見てみてね」と言う。
         カメラロールがあるのは iOS だけなので、**iOSのときだけ**鳴らす
         （Androidのダウンロード保存でも、Androidの共有シート経路でも保存先の案内がズレる） */
      if (shareEnv.isIOS) playAnnounce('saveSuccess');
    }).catch((err) => {
      if (err && err.name === 'AbortError') { // 客がやめただけ。責めない
        lastSaveRoute = 'share-cancel';
        showSaveToast('やめました。もう一度おせば保存できるよ');
        playAnnounce('saveRetry'); // 「だいじょうぶ。もういちど おせば、ほぞんできるよ！」
        return;
      }
      lastSaveRoute = 'share-failed'; // 失敗したら黙らず最後の砦へ降ろす
      showSaveFallback(blob, cv);
    });
    return true;
  }

  /* 🚨 この関数は async にしてはいけない（await が入った瞬間にiOSのジェスチャが切れる）。
     navigator.share までは一切の非同期を挟まず、タップと同じタスクの中で到達する。 */
  function deliverImage(canvasOrMaker, filename) {
    let cv;
    try {
      cv = typeof canvasOrMaker === 'function' ? canvasOrMaker() : canvasOrMaker;
    } catch (e) {
      lastSaveRoute = 'error';
      showSaveToast('うまくいかなかった… もういちど おしてみてね。だめなら 係の人を よんでね🙏');
      playAnnounce('saveError'); // 「がぞうが うまく作れなかったみたい」（2026-08-15）
      return;
    }
    const blob = canvasToBlobSync(cv); // 同期生成（ここで await しない）
    lastSavedBlob = blob;
    lastSavedName = filename;
    const env = saveEnv();

    /* ① その端末で「確実に成功する方」を先頭にする。
       iOS: 共有シート（download属性が効かないため他に道が無い）
       それ以外(Android/PC): ダウンロード（Androidの共有シートには保存項目が無いことが多い） */
    if (blob && !env.canDownload) {
      // iOS など、ダウンロードが効かない端末 → 共有シートが第一経路
      if (tryShareBlob(blob, filename, cv)) return;
    } else if (blob) {
      // Android / PC → ダウンロードが第一経路
      if (tryDownloadBlob(blob, filename)) {
        lastSaveRoute = 'download';
        showSaveToast(env.isAndroid
          ? '✅ 「ダウンロード」に保存したよ！ギャラリーかFilesで見てね'
          : '✅ ダウンロードしたよ！');
        return;
      }
      // ② ダウンロードがその場で失敗 → もう一方の経路（共有シート）へ
      if (tryShareBlob(blob, filename, cv)) return;
    }
    // ③ 最後の砦: 長押し保存（案内文は端末別。showSaveFallback が出し分ける）
    lastSaveRoute = 'fallback';
    showSaveFallback(blob, cv);
  }

  /* ---------- シール排出演出（2026-08-12 新設） ----------
     実機の「印刷待ち」の時間も体験の一部（待つあいだもデモ・アナウンスが流れる考証）。
     print_out.mp3 を鳴らしながらシールが排出口からゆっくり出てくる。
     終わったら従来の完成ボイス（save）と保存ボタンを出す。 */
  const PRINT_EJECT_MS = 4600;
  const printStage = $('#print-stage');
  let printReadyId = null;
  function startPrintSequence() {
    /* 文言もテーマで着せ替え（令和は小英字のフェード明滅・柄本仕様書3-8）。
       P-4（2026-08-15）: 平成は「シールが出てくるよ！」と次に起きることまで書けているのに、
       令和は英語1語だけで**様式のために情報を落としていた**。
       令和の静けさは保ったまま、小さい文字で日本語を添えて両立させる */
    const pp = $('#print-progress');
    if (document.body.classList.contains('theme-reiwa')) {
      pp.innerHTML = 'printing ...<small class="print-progress-sub">シールが 出てくるよ</small>';
    } else {
      pp.textContent = '🖨 プリント中…　シールが出てくるよ！';
    }
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
     （初代に落書き機能は無い、という考証）。
     🚨 2026-08-14: ここは色を `#ffb6de` / `#ff2fa0` / `#ffd3ea` で決め打ちしており、
     選んだシールのカラーもフレームも一度も参照していなかった（実機テスト指摘の直接原因の1つ）。
     本体シールと同じ色・同じモチーフが載るように結線した。 */
  function composeSixteenRetro() {
    const cv = document.createElement('canvas');
    cv.width = SHEET_W; cv.height = SHEET_H;
    const ctx = cv.getContext('2d');
    const cc = state.curtain.color;
    const line = lumOf(cc) > 205 ? shadeColor(cc, -48) : cc;
    const emoji = state.frame.emoji;
    ctx.fillStyle = shadeColor(cc, 66);
    ctx.fillRect(0, 0, SHEET_W, SHEET_H);
    ctx.fillStyle = cc;
    ctx.fillRect(0, 0, SHEET_W, 66);
    ctx.strokeStyle = line;
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, SHEET_W - 16, SHEET_H - 16);
    ctx.textAlign = 'center';
    ctx.font = '900 30px -apple-system, sans-serif';
    ctx.fillStyle = inkOnColor(cc, '#c2185b');
    // 「プリント倶楽部/Print Club」はセガの登録商標のため自前の名称を使う（2026-08-12 era-designer指摘）
    /* 焼き込み文字はやり直しがきかない（客が持ち帰って何年も残る）ので、
       モードで様式を分ける（P-9・2026-08-15 柄本仕様書）。
       令和の客の16分割シールに平成の★装飾が焼かれていた。 */
    if (state.mode === 'heisei') {
      ctx.fillText('★ 太子プリ ★', SHEET_W / 2, 52);
    } else {
      ctx.font = '500 24px -apple-system, sans-serif';
      ctx.letterSpacing = '0.22em'; // 非対応ブラウザでは無視されるだけ（見た目が少し詰まる）
      ctx.fillText('taishi puri', SHEET_W / 2, 50);
      ctx.letterSpacing = '0px';
    }

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
          const si = (r * cols + c) % shots.length;
          const shot = shots[si];
          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, cw, chh);
          ctx.clip();
          // 16分割も本体シールと同じ「おさまり」に従う（2026-08-17 指摘②）
          drawShotFit(ctx, shot, x, y, cw, chh, si, '#ffffff');
          ctx.restore();
          // 1枚ずつにカラーの枠とフレームのモチーフを載せる（本体シールと同じ載り方）
          drawCellDecor(ctx, { x, y, w: cw, h: chh }, { emoji, isCircle: false, radius: 0 });
        }
      }
    }
    const d = new Date();
    ctx.textAlign = 'center';
    ctx.font = '700 13px sans-serif';
    ctx.fillStyle = shadeColor(cc, -70);
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
        const si = i % shots.length;
        const shot = shots[si];
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(pos.rot * Math.PI / 180);
        ctx.shadowColor = 'rgba(0,0,0,.3)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 8);
        ctx.fill();
        ctx.shadowBlur = 0;
        drawShotFit(ctx, shot, -pw / 2, -cardH / 2 + padT, pw, ph, si, '#ffffff');
        /* フレームのモチーフをこの版にも載せる（2026-08-14 実機テスト指摘対応）。
           たて長ver.はカラーだけ結線されていて、フレームは一度も参照していなかった。
           カードは回転しているので、回転した座標系のまま写真の枠へ描く */
        drawCellDecor(ctx, { x: -pw / 2, y: -cardH / 2 + padT, w: pw, h: ph }, { emoji: state.frame.emoji, isCircle: false, radius: 0 });
        ctx.restore();
      });
    }

    // フッター（ハッシュタグ風）
    ctx.font = state.mode === 'reiwa' ? 'italic 600 38px Georgia, serif' : '900 40px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.95)';
    ctx.fillText(`#文化祭プリ　${sheet.footerName}`, W / 2, H - 100);
    return cv;
  }

  /* ---------- 追加出力③: 証明プリ（現行実機Meidy 2025の型・令和のみ・2026-08-14） ----------
     履歴書(4×3cm)/免許証風(3×2.4cm)/パスポート(4.5×3.5cm)の3サイズを1枚の台紙に並べる。
     顔検出があれば顔を証明写真の定石位置（顔の高さ≒写真の半分・頭上に余白）へ自動センタリング。
     落書きは載せない（証明風の出力に落書きは似合わない）。あそび用の断り書きを入れる */
  function composeIdPhoto() {
    const cv = document.createElement('canvas');
    cv.width = SHEET_W; cv.height = SHEET_H;
    const ctx = cv.getContext('2d');
    /* 台紙の色は選んだシールのカラーから作る（2026-08-14 実機テスト指摘対応）。
       以前は #f6efe6→#eee4d6 の決め打ちで、カラーもフレームも参照していなかった。
       証明写真なので写真そのものにモチーフは載せない（顔の判別を邪魔しない）。
       選んだフレームは台紙の下辺に控えめに並べて「選んだものが出ている」ようにする */
    const cc = state.curtain.color;
    const grad = ctx.createLinearGradient(0, 0, 0, SHEET_H);
    grad.addColorStop(0, shadeColor(cc, 62));
    grad.addColorStop(1, shadeColor(cc, 30));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SHEET_W, SHEET_H);
    ctx.fillStyle = cc;
    ctx.fillRect(0, 0, SHEET_W, 66);
    ctx.textAlign = 'center';
    ctx.font = 'italic 600 26px Georgia, serif';
    ctx.fillStyle = inkOnColor(cc, '#6f5f52');
    ctx.fillText('ID photo — 証明プリ', SHEET_W / 2, 44);
    if (state.frame.emoji) {
      ctx.save();
      ctx.font = '20px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.85;
      for (let x = 30; x <= SHEET_W - 30; x += 54) ctx.fillText(state.frame.emoji, x, SHEET_H - 52);
      ctx.restore();
    }

    const shots = state.processedShots.length ? state.processedShots : state.shots;
    const idx = (state.photoPick && state.photoPick.length) ? state.photoPick[0] : 0;
    const shot = shots[idx];
    if (!shot) return cv;
    const faces = state.faceData[idx];
    // 縦横比 aspect(w/h) の証明写真クロップ矩形（顔があれば顔基準・なければ上寄せ中央）
    const faceRect = (aspect) => {
      const sw = shot.width, sh = shot.height;
      let cx = sw / 2, cy = sh * 0.42, faceH = sh * 0.5;
      if (faces && faces.length && faces[0].length >= 468) {
        let minX = 1, maxX = 0, minY = 1, maxY = 0;
        faces[0].forEach(p => {
          if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
        });
        cx = (minX + maxX) / 2 * sw;
        cy = (minY + maxY) / 2 * sh;
        faceH = (maxY - minY) * sh;
      }
      let ch = Math.min(sh, faceH * 2.1);
      let cw = ch * aspect;
      if (cw > sw) { cw = sw; ch = cw / aspect; }
      const x = Math.max(0, Math.min(sw - cw, cx - cw / 2));
      const y = Math.max(0, Math.min(sh - ch, cy - ch * 0.46));
      return { x, y, w: cw, h: ch };
    };
    const SIZES = [
      { label: 'りれきしょ（4cm×3cm）', w: 30, h: 40, n: 2 },
      { label: 'めんきょしょう風（3cm×2.4cm）', w: 24, h: 30, n: 3 },
      { label: 'パスポート（4.5cm×3.5cm）', w: 35, h: 45, n: 2 },
    ];
    const SCALE = 4.6; // mm→px（台紙内で切って使う遊び用の縮尺）
    let y = 86;
    SIZES.forEach((sz) => {
      const pw = sz.w * SCALE, ph = sz.h * SCALE;
      ctx.font = '500 15px "Hiragino Kaku Gothic ProN", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#8a7568';
      ctx.fillText(sz.label, 40, y + 14);
      const gap = 22;
      const total = sz.n * pw + (sz.n - 1) * gap;
      const x0 = (SHEET_W - total) / 2;
      const r = faceRect(pw / ph);
      for (let i = 0; i < sz.n; i++) {
        const x = x0 + i * (pw + gap);
        const py = y + 24;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 5, py - 5, pw + 10, ph + 10);
        ctx.drawImage(shot, r.x, r.y, r.w, r.h, x, py, pw, ph);
        ctx.save();
        ctx.strokeStyle = '#c9b8a6';
        ctx.setLineDash([5, 4]);
        ctx.strokeRect(x - 5.5, py - 5.5, pw + 11, ph + 11);
        ctx.restore();
      }
      y += 24 + ph + 34;
    });
    const d = new Date();
    ctx.textAlign = 'center';
    ctx.font = 'italic 500 13px Georgia, serif';
    ctx.fillStyle = '#8a7568';
    ctx.fillText(d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0') + '　※あそび用のプリだよ（ほんものの証明写真には使えません）', SHEET_W / 2, SHEET_H - 22);
    return cv;
  }

  /* 保存は全ボタン共通で deliverImage（share→download→長押しの3段構え）を通す。
     押された瞬間に生成する（生成済みの持ち越しはしない） */
  $('#btn-download').addEventListener('click', (e) => {
    e.preventDefault();
    deliverImage(finalCanvas, `purikura_${state.mode}_${fileStamp()}.png`);
  });
  $('#btn-download-16').addEventListener('click', (e) => {
    e.preventDefault();
    deliverImage(composeSixteenRetro, `purikura16_${state.mode}_${fileStamp()}.png`);
  });
  $('#btn-download-story').addEventListener('click', (e) => {
    e.preventDefault();
    deliverImage(composeStoryCollage, `purikura_story_${state.mode}_${fileStamp()}.png`);
  });
  $('#btn-download-id').addEventListener('click', (e) => {
    e.preventDefault();
    playAnnounce('idPhotoR'); // 「あそび用だから、ほんものの証明写真には使えないよ」（2026-08-15）
    deliverImage(composeIdPhoto, `purikura_id_${state.mode}_${fileStamp()}.png`);
  });

  $('#btn-restart').addEventListener('click', () => {
    stopAnnounce(); // 案内ボイスも次の客へ持ち越さない
    announceByMode('thanks'); // 「またプリクラ とりに きてねー！」（2026-08-15）
    resetOnceVoices();        // 初回だけ鳴らす案内を次の客のために戻す
    // 保存モーダル・トースト・直近画像も次の客へ持ち越さない（2026-08-14）
    $('#save-modal').classList.add('hidden');
    if (saveModalObjectUrl) { URL.revokeObjectURL(saveModalObjectUrl); saveModalObjectUrl = null; }
    if (saveToastEl) saveToastEl.classList.add('hidden');
    lastSavedBlob = null;
    lastSaveRoute = null;
    if (state.timerId) clearInterval(state.timerId);
    if (state.beautyTimerId) clearInterval(state.beautyTimerId);
    if (printReadyId) { clearTimeout(printReadyId); printReadyId = null; }
    state.shots = [];
    state.processedShots = [];
    state.faceData = [];
    state.photoPick = null; // シール写真えらびも次の客のためにリセット（2026-08-13）
    // 次の客のために選択系もまっさらへ（2026-08-12 qa-tester指摘。無人運用では前の客の設定が残ると事故）
    state.bgmChoice = 'auto';
    state.heiseiEra = 'standard';
    /* 分割も初期値へ（2026-08-13 考証回帰の回帰実走で発見）:
       平成は落書き後のゲートで state.layout を書き換えるため、リセットしないと
       前の客が選んだ分割が次の令和の客の初期選択に化ける */
    state.layout = LAYOUTS[0];
    voiceGaveUp = false; // 次の客は音声から仕切り直す
    /* 一時保存も必ず消す（2026-08-14・守屋ライン）。
       前の客の顔写真と落書きが端末に残ったまま次の客が触る、が起きないようにする */
    decoActive = false;
    disarmHistorySentinel();
    clearSessionSnapshot();
    shotDeco = []; // 写真ごとの落書きも次の客のためにまっさらへ
    decoObjects = [];
    undoStack = [];
    renderDeco();
    delete document.body.dataset.mode; // 前回のモード値を残さない（qa-tester検収指摘6）
    setTheme(null); // タイトルはモード決定前の「対比の画面」なのでテーマを外す
    playBgmSrc(BGM_TITLE); // タイトルへ戻ったらタイトル曲へ
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
      /* 🚨 失敗を握り潰さない（2026-08-15 検見の互換検収【致命】）。
         以前は catch を空にしていたため、SWの登録が失敗しても
         コンソールに何も出ず「見た目は正常なのにオフライン対応だけ死んでいる」
         状態になっていた。file:// で失敗するのは想定内なので、そこだけ静かに流す */
      navigator.serviceWorker.register('sw.js')
        .then((reg) => { console.log('[sw] 登録OK', reg.scope); })
        .catch((err) => {
          if (location.protocol === 'file:') return; // file://での失敗は想定内
          console.error('[sw] 登録に失敗しました（オフライン対応が働きません）', err);
        });
    });
  }

  /* ===================== 誤操作でアプリから離脱する事故への対策 =====================
     2026-08-14 オーナー実機テスト指摘①「乱暴に指を動かしたら別アプリに画面が変わってしまった」。
     落書き中の激しい操作で、iOS Safari の「画面の端から引っぱって戻る/進む」が発火したのが
     いちばんありそうな筋（落書きは横方向に指を走らせる操作そのもの）。

     🚨 正直に書いておく: **iOSのシステムジェスチャは Web からは完全には殺せない。**
     ホームバーの上スワイプ、コントロールセンター、アプリ切り替えは止められない。
     だからここは3段構えで、「起きにくくする」＋「起きても作品を失わない」で守る:
       ① 履歴の番人   … 落書きに入る前にダミーの履歴を1つ積む。戻るジェスチャはその
                        ダミーを消費するだけで、ページは再読み込みされない＝落書きは無傷
       ② 端の受け皿   … 画面の左右端26pxに透明な帯を置き、そこで始まった指の動きを吸い込む
       ③ 自動保存     … それでも離脱してページが読み直された場合に備え、写真と落書きを
                        この端末のこのタブに一時保存し、戻ってきたら続きから再開する

     守屋ライン（情報を外に出さない）:
     - 保存先は **sessionStorage**。タブを閉じれば消える。localStorage には置かない
       （前の客の顔写真が端末に残り続けるのを避けるため）
     - 写真はJPEG化してこの端末の中だけに置く。外部への送信はゼロ
     - 「もう一回あそぶ」と、シールが出来上がった時点で必ず消す */

  const SESSION_KEY = 'purikura.session.v1';
  const SESSION_TTL_MS = 45 * 60 * 1000; // 45分より古い下書きは他人のものとみなして捨てる
  let decoActive = false;   // 落書き画面にいる間だけ true（保存とガードのスイッチ）
  let sessionSaveId = null;

  function clearSessionSnapshot() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* 使えない環境では何もしない */ }
  }

  function saveSessionSnapshot() {
    if (!decoActive) return;
    try {
      const shots = decoShots();
      if (!shots.length) return;
      const payload = {
        ts: Date.now(),
        mode: state.mode,
        frameId: state.frame && state.frame.id,
        curtainId: state.curtain && state.curtain.id,
        layoutId: state.layout && state.layout.id,
        heiseiEra: state.heiseiEra,
        bgmChoice: state.bgmChoice,
        photoPick: state.photoPick,
        curShot,
        remaining: state.remaining,
        // 写真はJPEGで持つ（PNGだと4枚で数MBになり sessionStorage を溢れさせる）
        shots: shots.map(c => c.toDataURL('image/jpeg', 0.82)),
        deco: shotDeco.map(d => ((d && d.objects) || [])),
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    } catch (e) {
      /* 容量オーバーやプライベートブラウズでは保存できない。
         その場合でも落書きそのものは続けられるので、客には何も出さない */
    }
  }
  // 描くたびに保存すると重いので、1.2秒にまとめる
  function scheduleSessionSave() {
    if (!decoActive || sessionSaveId) return;
    sessionSaveId = setTimeout(() => { sessionSaveId = null; saveSessionSnapshot(); }, 1200);
  }

  // 画面が隠れる/離れる瞬間は、まとめ待ちをせずその場で書く（ここを逃すと作品が消える）
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveSessionSnapshot();
  });
  window.addEventListener('pagehide', saveSessionSnapshot);

  /* ① 履歴の番人。落書きに入るときダミーを1つ積み、戻るジェスチャが来たら積み直す。
     同一ページ内の履歴移動なのでページは読み直されず、キャンバスもタイマーも生き残る。 */
  let historySentinel = false;
  function armHistorySentinel() {
    if (historySentinel) return;
    try {
      history.pushState({ puri: 'deco' }, '');
      historySentinel = true;
    } catch (e) { /* file:// 等で使えない環境では諦める（他の2段で守る） */ }
  }
  function disarmHistorySentinel() { historySentinel = false; }
  window.addEventListener('popstate', () => {
    if (!decoActive || !historySentinel) return;
    // 戻るジェスチャを吸収して積み直す。客には「戻れない」ことだけ伝える
    try { history.pushState({ puri: 'deco' }, ''); } catch (e) { /* 何もできないときは黙る */ }
    saveSessionSnapshot();
    /* D-9（2026-08-15 柄本仕様書）: このトーストは端スワイプの誤爆でも出る。
       禁止だけ告げると客は「自分が何か壊した」と思って固まるので、続けてよいことを添える */
    if (typeof showDecoToast === 'function') showDecoToast('✋ らくがき中は もどれないよ。そのまま つづけてね！');
  });

  /* ② 端で始まった指の動きを吸収する。
     iOSの「端から引っぱって戻る」は touch-action では止まらず、touchstart の
     preventDefault が唯一の打ち手（passive:false でないと効かないので明示する）。

     🚨 透明な帯を左右にかぶせる方式は採らなかった（2026-08-14 の設計判断）:
     横持ちだと道具箱が画面の右端まで来るため、帯を置くと色えらびやボタンの右端26pxが
     押せなくなる。押せないほうが客には致命的なので、ボタンの上では何もしない形にした。 */
  const EDGE_PX = 24;
  document.addEventListener('touchstart', (e) => {
    if (!decoActive || e.touches.length !== 1) return;
    const t = e.touches[0];
    if (t.clientX > EDGE_PX && t.clientX < window.innerWidth - EDGE_PX) return;
    // ボタン・サムネイル等の上では吸収しない（押せなくなるほうが困る）
    if (e.target && e.target.closest && e.target.closest('button, input, a, label, .choice-item, .layout-item, .deco-thumb, .pp-item, .save-box')) return;
    e.preventDefault();
  }, { passive: false });

  /* ③ 復帰。起動時に下書きが残っていたら「つづきから／さいしょから」を聞く。 */
  function readSessionSnapshot() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      if (!p || !Array.isArray(p.shots) || !p.shots.length) return null;
      if (Date.now() - p.ts > SESSION_TTL_MS) { clearSessionSnapshot(); return null; }
      // 落書きが1本も無い下書きは、聞くほどのものではない（客を迷わせない）
      const drawn = (p.deco || []).some(objs => objs && objs.length);
      if (!drawn) { clearSessionSnapshot(); return null; }
      return p;
    } catch (e) { return null; }
  }

  function loadImageCanvas(dataUrl) {
    return new Promise((resolve) => {
      const im = new Image();
      im.onload = () => {
        const c = document.createElement('canvas');
        c.width = SHOT_W; c.height = SHOT_H;
        c.getContext('2d').drawImage(im, 0, 0, SHOT_W, SHOT_H);
        resolve(c);
      };
      im.onerror = () => resolve(null);
      im.src = dataUrl;
    });
  }

  async function restoreSessionSnapshot(p) {
    const canvases = (await Promise.all(p.shots.map(loadImageCanvas))).filter(Boolean);
    if (!canvases.length) return false;
    state.mode = p.mode === 'reiwa' ? 'reiwa' : 'heisei';
    document.body.dataset.mode = state.mode;
    setTheme(state.mode);
    const conf = modeConf();
    state.curtain = conf.curtains.find(c => c.id === p.curtainId) || conf.curtains[0];
    state.frame = conf.frames.find(f => f.id === p.frameId) || conf.frames[0];
    state.layout = LAYOUTS.find(l => l.id === p.layoutId) || LAYOUTS[0];
    state.heiseiEra = p.heiseiEra || 'standard';
    state.bgmChoice = p.bgmChoice || 'auto';
    state.photoPick = Array.isArray(p.photoPick) ? p.photoPick : null;
    state.shots = canvases;
    state.processedShots = canvases.slice();
    state.faceData = canvases.map(() => null);
    state.skinConf = canvases.map(() => null);
    buildSelectGrids();
    buildDecoTools();
    composeSheet();
    startDecoScreen(); // ここで shotDeco が作り直されるので、そのあとに中身を戻す
    shotDeco = canvases.map((_, i) => ({ objects: (p.deco && p.deco[i]) || [], undo: [] }));
    selectShot(Math.min(p.curShot || 0, canvases.length - 1));
    // 残り時間も引き継ぐ（最低30秒は残す。0秒で復帰したら何もできないため）
    state.remaining = Math.max(30, Math.min(decoSeconds(), p.remaining || decoSeconds()));
    timerDisplay.textContent = formatTime(state.remaining);
    unlockAudio();
    startBGM();
    return true;
  }

  (function offerResume() {
    const p = readSessionSnapshot();
    if (!p) return;
    const modal = $('#resume-modal');
    if (!modal) return;
    // 何が残っているのかを見せる（文字だけだと客は判断できない）
    const prev = $('#resume-preview');
    prev.innerHTML = '';
    p.shots.slice(0, 4).forEach((url) => {
      const cv = document.createElement('canvas');
      cv.width = 124; cv.height = 94;
      const im = new Image();
      im.onload = () => cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
      im.src = url;
      prev.appendChild(cv);
    });
    modal.classList.remove('hidden');
    playAnnounce('resumeOffer'); // 「まえの らくがきが のこっているよ」（2026-08-15）
    $('#btn-resume-yes').addEventListener('click', async () => {
      modal.classList.add('hidden');
      const ok = await restoreSessionSnapshot(p);
      if (!ok) { clearSessionSnapshot(); showScreen('screen-title'); }
    });
    $('#btn-resume-no').addEventListener('click', () => {
      modal.classList.add('hidden');
      clearSessionSnapshot();
    });
  })();

  /* ホーム画面に追加のおすすめ（Safariのタブで開いているときだけ）。
     ホーム画面から起動すると端スワイプの戻るが無くなるので、本番はこちらが前提。 */
  (function pwaHint() {
    const bar = $('#pwa-hint');
    if (!bar) return;
    const standalone = window.navigator.standalone === true
      || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('purikura.pwaHint.off') === '1'; } catch (e) { /* 読めなければ出す */ }
    if (standalone || !ios || dismissed) return;
    bar.classList.remove('hidden');
    $('#btn-pwa-hint-close').addEventListener('click', () => {
      bar.classList.add('hidden');
      try { sessionStorage.setItem('purikura.pwaHint.off', '1'); } catch (e) { /* 保存できなくても閉じる */ }
    });
    // 落書きが始まったら邪魔なので自動で引っ込める
    document.addEventListener('click', function hideOnDeco() {
      if (!decoActive) return;
      bar.classList.add('hidden');
      document.removeEventListener('click', hideOnDeco);
    }, true);
  })();

  // 動作検証用フック（アプリの動作には影響しない）
  window.__puriDebug = {
    buildSkinMask,
    applyBeauty,
    startAttract,
    stopAttract,
    // WebAudio経路の検証用（iOS音声対策・2026-08-13）
    /* 声のかぶりを **アプリ自身の帳簿** で数える（2026-08-17）。
       外から play/pause を計装して数える方法は、クリップ長が取れない環境で当てにならない。
       バスが記録した「鳴り始め〜止まった/終わった」の区間どうしの重なりを返す。
       戻り値が [] であることが「声は同時に1本」の機械的な証拠になる */
    // セルへの「おさまり」の検証用（2026-08-17 指摘②）
    drawShotFit, shotFocus, PHOTO_FITS, layoutCells, LAYOUTS,
    setPhotoFit: (v) => { state.photoFit = v; },
    setLayout: (id) => { state.layout = LAYOUTS.find(l => l.id === id) || LAYOUTS[0]; },
    photoPick: () => state.photoPick || [],
    // 顔の位置を差し替えて「顔にあわせる」の寄せ方を測る（正規化座標の1点だけの偽ランドマーク）
    setFakeFace: (pt) => { state.faceData = pt ? [[[{ x: pt.x - 0.08, y: pt.y - 0.1 }, { x: pt.x + 0.08, y: pt.y + 0.1 }]]] : []; },
    setRemaining: (s) => { state.remaining = s; },
    remaining: () => state.remaining,
    DRAWN_STAMPS,
    drawnStampIds: () => (modeConf().drawnStamps || []).slice(),
    textStampTexts: () => (modeConf().textStamps || []).map(t => t.t),
    objectCount: () => decoObjects.length,
    objectTypes: () => decoObjects.map(o => o.type + (o.id ? ':' + o.id : '')),
    stampSize: () => state.stampSize,
    penColor: () => state.penColor,
    voiceHistory: () => voiceHistory.map(v => ({ ...v })),
    // 連鎖の予約列（2026-08-18 回帰修正の検証用。積まれているのに鳴らない、を見分ける）
    voiceQueue: () => voiceQueue.map(q => q.key),
    voiceNow: () => curVoiceKey,
    // 文言の一括書き換えが複数要素に当たっていないか（2026-08-18・巻き添えの検出）
    copyCollisions: () => copyCollisions.slice(),
    voiceOverlaps: () => {
      const now = performance.now();
      const sp = voiceHistory.map(v => ({ key: v.key, a: v.start, b: v.end == null ? now : v.end }));
      const out = [];
      for (let i = 0; i < sp.length; i++) {
        for (let j = i + 1; j < sp.length; j++) {
          const ov = Math.min(sp[i].b, sp[j].b) - Math.max(sp[i].a, sp[j].a);
          if (ov > 60) out.push({ a: sp[i].key, b: sp[j].key, ms: Math.round(ov) });
        }
      }
      return out;
    },
    waStatus: () => ({
      state: audioCtx ? audioCtx.state : 'none',
      loaded: Object.keys(waBuffers),
      played: waPlayCount,
    }),
    waDisable: () => { WA_KEYS.forEach(k => delete waBuffers[k]); }, // 無音環境の再現用
    lastSaveRoute: () => lastSaveRoute, // 保存経路の検証用（share|download|fallback|share-cancel）
    saveEnv, // 端末判定の検証用（isIOS/isAndroid/canDownload/isInApp）
    deliverImage, // 保存経路の分岐だけを撃つ検証用（画面遷移なしで呼べる）
    // カメラ起動の検証用（getUserMediaをスタブに差し替えて経路と案内を確かめる）
    startCamera,
    acquireCamera,
    camFailMessage,
    // 盛れ感プリセットの実値（検証で値を直書きしないため・2026-08-14）
    presetOf: (id) => (MODES.reiwa.presets || []).find(p => p.id === id) || null,
    // デザイン確認用: ダミー写真の入った盛り調整画面へ直行（カメラ不要・2026-08-13）
    gotoBeauty() {
      document.querySelectorAll('.debug-canvas').forEach(el => el.remove());
      startBeautyScreen();
    },
    // デザイン確認用: ダミー写真の入った落書き/プリント画面へ直行（カメラ不要）
    gotoDeco(toPrint) {
      document.querySelectorAll('.debug-canvas').forEach(el => el.remove());
      composeSheet();
      if (toPrint) {
        composeFinal();
        showScreen('screen-print');
        startPrintSequence();
      } else {
        startDecoScreen();
      }
    },
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
