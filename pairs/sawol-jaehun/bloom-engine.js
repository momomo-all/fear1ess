/* ───────────────── 글자 연출 엔진 (모든 인물 공용) ─────────────────
   「테마 문장」이 크게 떠오르고 → 그 인물을 이루는 문장들이 모여 상징(해바라기, 하늘…)이 됐다가
   → 그 인물 그림으로 모여요. 캐릭터 페이지에선 글자 그림 위로 진짜 그림이 떠올라요.

   인물마다 설정 파일 하나 (bloom-sawol.js, bloom-jaehun.js …):
     GlyphBloom.define('대사 tone 이름', {
       heart: '테마 문장', text: [문장, …], portraitFrom: '그림이 이 문장부터 읽혀요',
       thumb: 그림 색 지도(작은 webp), images: { 이름: 상징 사진 }, heartColor: [r,g,b],
       T: { heartIn, heartGo, morph },          // 시간표 (ms)
       build(m, rnd, imgs, api) → { center, targets, glyphs, spread, paint, prep?, off? }
     })
   index.html: 대사 연출(APPROVED) 직후에 GlyphBloom.play(tone, …)
   캐릭터 페이지: <head>에서 'bloom:tone' 시각을 보고 html.from-bloom 을 붙여 둬요.          */
window.GlyphBloom = (() => {
  const FACE = 'Hahmlet, "Noto Serif KR", serif';
  const ART = { w: 1216, h: 832 };
  const defs = {};

  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const outCubic = (p) => 1 - (1 - p) ** 3;
  const inOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rgb = (c) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
  const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

  // 문장을 한 글자씩 흘려보내요 (끝나면 처음부터 다시). nospace면 빈칸은 건너뛰어요
  function stream(text, from = 0, nospace = true) {
    const s = text.slice(from).concat(text.slice(0, from)).join(' ').replace(/\s+/g, nospace ? '' : ' ');
    let i = 0;
    return () => s[i++ % s.length];
  }

  // 화면 크기에 맞춘 글자 칸
  function metrics() {
    const W = document.documentElement.clientWidth, H = innerHeight;
    const cell = Math.max(6, Math.min(11, Math.round(H / 118))); // 상징 글자 (작고 촘촘해야 사진처럼 보여요)
    const pcell = Math.max(7, Math.min(12, Math.round(H / 100))); // 인물 그림 글자
    return { W, H, cell, cw: cell, lh: Math.round(cell * 1.1), pcell, pcw: pcell, plh: Math.round(pcell * 1.12) };
  }

  /* ───────── 인물 그림 자리 (캐릭터 페이지의 .char-art와 똑같이) ───────── */
  function artBox(cfg) {
    const vw = innerWidth, vh = innerHeight;
    // 캐릭터 페이지에서는 실제 그림 자리를 재요 (계산과 어긋나도 그림 위에 딱 겹치게)
    const img = document.querySelector('.char-art img'), fig = img && img.parentElement;
    if (img && img.complete && img.naturalWidth) {
      const r = img.getBoundingClientRect(), f = fig.getBoundingClientRect();
      const fk = (parseFloat(getComputedStyle(fig).getPropertyValue('--fade')) || cfg.fade * 100) / 100;
      const fade = vw <= 760
        ? (x, y) => { const k = (y - f.y) / f.height; return k < 0.72 ? 1 : clamp(1 - (k - 0.72) / 0.28); }
        : (x) => (x < f.x ? 0 : clamp((x - f.x) / (f.width * fk)));
      return { x: r.x, y: r.y, w: r.width, h: r.height, fade };
    }
    if (vw <= 760) { // 폰: 위쪽에 꽉 차게, 아래로 스며들어요
      const h = (vw * ART.h) / ART.w;
      return { x: 0, y: 0, w: vw, h, fade: (x, y) => (y < h * 0.72 ? 1 : clamp(1 - (y - h * 0.72) / (h * 0.28))) };
    }
    const h = vh, w = (vh * ART.w) / ART.h, figL = vw / 3, figW = (vw * 2) / 3; // 오른쪽 2/3, 오른쪽 끝에 붙어요
    return { x: vw - w, y: 0, w, h, fade: (x) => (x < figL ? 0 : clamp((x - figL) / (figW * cfg.fade))) };
  }

  // 작은 이미지의 픽셀 읽기 (한 번 읽으면 기억해 둬요)
  const pxCache = {};
  function pixels(src) {
    if (pxCache[src]) return pxCache[src];
    const img = new Image();
    img.src = src;
    return (pxCache[src] = img.decode().then(() => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const x = c.getContext('2d', { willReadFrequently: true });
      x.drawImage(img, 0, 0);
      return { w: c.width, h: c.height, d: x.getImageData(0, 0, c.width, c.height).data };
    }));
  }

  // 그림에서 하얗지 않은 칸마다 글자 하나 (위에서부터 문장 순서대로)
  function portraitCells(cfg, m, px) {
    const a = artBox(cfg), out = [];
    const next = stream(cfg.text, Math.max(0, cfg.text.indexOf(cfg.portraitFrom)));
    const rows = Math.ceil((a.y + a.h) / m.plh), cols = Math.ceil(m.W / m.pcw);
    const sat = cfg.saturate ?? 2.2;
    for (let r = Math.max(0, Math.floor(a.y / m.plh)); r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * m.pcw + m.pcw / 2, y = r * m.plh + m.plh / 2;
        if (x < a.x || x > a.x + a.w || y > a.y + a.h || y > m.H) continue;
        const u = Math.min(px.w - 1, ((x - a.x) / a.w) * px.w) | 0;
        const v = Math.min(px.h - 1, ((y - a.y) / a.h) * px.h) | 0;
        const i = (v * px.w + u) * 4, d = px.d;
        const al = d[i + 3] / 255; // 투명한 바탕은 흰 바탕 위에 얹은 색으로
        const col = [0, 1, 2].map((k) => d[i + k] * al + 255 * (1 - al));
        const lum = (col[0] * 0.3 + col[1] * 0.59 + col[2] * 0.11) / 255;
        if (al < 0.5 || lum > 0.9) continue; // 바탕과 아주 밝은 곳은 비워요 → 실루엣이 살아나요
        const f = a.fade(x, y);
        if (f < 0.04) continue;
        // 색은 더 선명하게, 어두운 곳은 진하게 · 밝은 곳은 옅게
        const L = lum * 255;
        let vivid = col.map((v2) => Math.max(0, Math.min(255, (L + (v2 - L) * sat) * 0.85)));
        if (cfg.ink) vivid = cfg.ink(vivid, lum);
        out.push({ x, y, ch: next(), c: vivid, a: f * (0.25 + 0.75 * clamp((0.94 - lum) / 0.45)) });
      }
    }
    return out;
  }

  /* ───────── 그리기 ───────── */
  function canvasOn(host, m) {
    const cv = document.createElement('canvas');
    cv.className = 'bloom-canvas';
    const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = m.W * dpr; cv.height = m.H * dpr;
    cv.style.width = `${m.W}px`; cv.style.height = `${m.H}px`;
    host.appendChild(cv);
    const x = cv.getContext('2d');
    x.scale(dpr, dpr);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    return { cv, x };
  }

  function fontsReady(cfg, ms) {
    const all = cfg.heart + cfg.text.join('');
    const load = Promise.all([document.fonts.load(`700 16px ${FACE}`, all), document.fonts.load(`700 40px ${FACE}`, cfg.heart)]).catch(() => {});
    return Promise.race([load, new Promise((r) => setTimeout(r, ms))]);
  }
  const loadImages = (cfg) => Promise.all(Object.entries(cfg.images || {}).map(([k, src]) => pixels(src).then((p) => [k, p]))).then(Object.fromEntries);

  // 대사가 나오는 동안 글꼴·그림을 미리 받아둬요
  function warm(tone) {
    const cfg = defs[tone];
    if (!cfg) return;
    fontsReady(cfg, 4000); pixels(cfg.thumb).catch(() => {}); loadImages(cfg).catch(() => {});
  }

  let run = null;

  async function play(tone, scene, onDone) {
    const cfg = defs[tone];
    if (!cfg) return onDone();
    const [, thumbPx, imgs] = await Promise.all([fontsReady(cfg, 1500), pixels(cfg.thumb).catch(() => null), loadImages(cfg).catch(() => null)]);
    if (!imgs) return onDone(); // 상징 사진을 못 읽으면 연출 없이 바로 넘어가요
    const T = cfg.T, END = T.morph + 2900;
    const m = metrics();
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const api = { clamp, lerp, mix, stream, rgb };
    const S = cfg.build(m, rnd, imgs, api);
    const P = thumbPx ? portraitCells(cfg, m, thumbPx) : [];
    const { cv, x } = canvasOn(scene, m);
    scene.classList.add('blooming');

    // 큰 문장: 한 줄로 떠올라요
    const B = Math.max(26, Math.min(60, m.W * 0.05));
    x.font = `700 ${B}px ${FACE}`;
    const hchars = [...cfg.heart];
    const widths = hchars.map((c) => x.measureText(c).width);
    const total = widths.reduce((s, w) => s + w, 0);
    const big = total > m.W * 0.9 ? (B * m.W * 0.9) / total : B;
    let hx = S.center.x - (total * big) / B / 2;

    const G = []; // 모든 글자
    let hk = 0;
    hchars.forEach((ch, i) => {
      const w = (widths[i] * big) / B;
      if (ch !== ' ') {
        const s = S.targets[hk % S.targets.length];
        G.push({ ch, big: true, tin: T.heartIn + i * 70, x0: hx + w / 2, y0: S.center.y, x1: s.x, y1: s.y, t1: T.heartGo + hk * 40, d1: 1000, c1: cfg.heartColor, c1e: s.c, ...(s.extra || {}) });
        hk++;
      }
      hx += w;
    });
    S.glyphs.forEach((g) => G.push(g));

    // 상징 → 인물: 짝을 섞어서, 흩어졌다가 다시 모여요
    const nA = G.length;
    const order = Array.from({ length: Math.max(nA, P.length) }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [order[i], order[j]] = [order[j], order[i]]; }
    order.forEach((pi, gi) => {
      let g = G[gi];
      if (!g) { // 그림 칸이 더 많으면: 상징 속 아무 자리에서 새 글자가 태어나요
        const from = G[(rnd() * nA) | 0];
        g = { ch: '', x0: from.x1, y0: from.y1, x1: from.x1, y1: from.y1, t1: 0, d1: 1, c1: from.c1, a1: 0 };
        G.push(g);
      }
      const p = P[pi];
      if (p) { g.x2 = p.x; g.y2 = p.y; g.c2 = p.c; g.a2 = p.a; g.ch2 = p.ch; }
      else { g.x2 = g.x1 + (rnd() - 0.5) * S.spread * 1.6; g.y2 = g.y1 + (rnd() - 0.5) * S.spread * 1.6; g.c2 = g.c1e || g.c1; g.a2 = 0; g.ch2 = g.ch; }
      const mx = (g.x1 + g.x2) / 2, my = (g.y1 + g.y2) / 2, spread = S.spread * (0.4 + rnd() * 0.9), ang = rnd() * Math.PI * 2;
      g.qx = mx + Math.cos(ang) * spread; g.qy = my + Math.sin(ang) * spread;
      g.t2 = T.morph + clamp(g.y2 / m.H) * 900 + rnd() * 500;
      g.d2 = 1500;
      if (g.al === undefined) g.al = 1;
      if (g.a1 === undefined) g.a1 = g.al;
      g.s1 = rgb(g.c1e || g.c1); g.s2 = rgb(g.c2); // 색 문자열은 미리 (매 프레임 만들면 무거워요)
      if (S.prep) S.prep(g, rnd);
    });

    // 다 내려앉은 글자는 한 번만 그려 두는 판 (매 프레임 수천 자를 다시 쓰지 않게)
    const dpr = cv.width / m.W;
    const rest = document.createElement('canvas');
    rest.width = cv.width; rest.height = cv.height;
    const rx = rest.getContext('2d');
    rx.scale(dpr, dpr); rx.textAlign = 'center'; rx.textBaseline = 'middle';
    rx.font = `700 ${m.pcell}px ${FACE}`;

    run = { t0: performance.now(), done: false, END };
    let washed = false;
    const o = { x: 0, y: 0 }; // 지금 움직인 만큼 (바람·구름 흐름)
    const off = S.off || ((g, t, out) => { out.x = 0; out.y = 0; });

    const frame = (now) => {
      if (!run || run.done) return;
      const t = now - run.t0;
      if (!washed && t >= T.morph) { washed = true; scene.classList.add('leave'); } // 바탕이 캐릭터 페이지처럼 하얘져요
      x.clearRect(0, 0, m.W, m.H);
      // 상징 바탕: 처음에 짙어졌다가, 인물로 바뀔 때 걷혀서 하얀 바탕이 드러나요
      const night = t < T.morph ? clamp(t / 700) : 1 - clamp((t - T.morph) / 1400);
      if (night > 0) { x.globalAlpha = night; S.paint(x, night, t); }
      x.globalAlpha = 1;
      x.drawImage(rest, 0, 0, m.W, m.H);
      if (S.under) S.under(x, t, night);
      x.font = `700 ${m.cell}px ${FACE}`;
      const bigs = [], small = [];
      for (const g of G) {
        if (g.rested) continue;
        let px, py, a, col, ch = g.ch;
        off(g, t < g.t2 ? t : g.t2, o); // 인물로 모이기 시작하면 흐름은 멈춰요
        if (t < g.t2) {
          if (g.big && t < g.t1 + g.d1) { g.ox = o.x; g.oy = o.y; bigs.push(g); continue; }
          const p = clamp((t - g.t1) / g.d1);
          if (p <= 0 || g.a1 === 0) continue;
          const e = outCubic(p);
          // rel: 출발점도 같이 흘러가요 (구름처럼 계속 움직이는 자리로 모일 때)
          if (g.rel) { px = lerp(g.x0, g.x1, e) + o.x; py = lerp(g.y0, g.y1, e) + o.y; }
          else { px = lerp(g.x0, g.x1 + o.x, e); py = lerp(g.y0, g.y1 + o.y, e); }
          a = clamp(p * 2.2) * g.al; col = g.s1;
        } else {
          const q = clamp((t - g.t2) / g.d2), e = inOut(q), u = 1 - e;
          px = u * u * (g.x1 + o.x) + 2 * u * e * g.qx + e * e * g.x2;
          py = u * u * (g.y1 + o.y) + 2 * u * e * g.qy + e * e * g.y2;
          a = lerp(g.a1, g.a2, e);
          if (q >= 1) { // 자리 잡았어요 → 판에 새기고 다음부터는 건너뛰어요
            g.rested = true;
            if (g.a2 > 0.02) { rx.globalAlpha = g.a2; rx.fillStyle = g.s2; rx.fillText(g.ch2, g.x2, g.y2); }
            continue;
          }
          if (q > 0.55) { small.push(g, px, py, a); continue; } // 내려앉으면서 그림의 문장으로 바뀌어요
          if (!ch) continue;
          col = g.s1;
        }
        if (a < 0.02 || px < -20 || px > m.W + 20) continue;
        x.globalAlpha = a;
        x.fillStyle = col;
        x.fillText(ch, px, py);
      }
      if (small.length) {
        x.font = `700 ${m.pcell}px ${FACE}`;
        for (let i = 0; i < small.length; i += 4) {
          const g = small[i], a = small[i + 3];
          if (a < 0.02) continue;
          x.globalAlpha = a; x.fillStyle = g.s2; x.fillText(g.ch2, small[i + 1], small[i + 2]);
        }
      }
      // 큰 문장 (나타나서 → 상징 속 자리로 내려앉아요)
      if (bigs.length) x.font = `700 ${big}px ${FACE}`; // 글꼴은 한 번만, 크기는 확대·축소로 (글꼴을 매번 바꾸면 버벅여요)
      for (const g of bigs) {
        const pin = clamp((t - g.tin) / 700), e0 = outCubic(pin);
        const p = clamp((t - g.t1) / g.d1), e = inOut(p);
        const k = lerp(big, m.cell, e) / big;
        x.globalAlpha = e0;
        x.fillStyle = rgb(mix(g.c1, g.c1e, e));
        x.setTransform(dpr * k, 0, 0, dpr * k, dpr * lerp(g.x0, g.x1 + g.ox, e), dpr * lerp(g.y0 + (1 - e0) * big * 0.25, g.y1 + g.oy, e));
        x.fillText(g.ch, 0, 0);
      }
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.globalAlpha = 1;
      if (t >= END + 150) {
        run.done = true;
        try { sessionStorage.setItem(`bloom:${tone}`, String(Date.now())); } catch (err) { /* 저장 안 되면 그냥 그림으로 */ }
        onDone();
        return;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  // 눌러서 넘기기: 바로 인물 그림으로
  function skip() {
    if (!run || run.done) return false;
    run.t0 = Math.min(run.t0, performance.now() - run.END);
    return true;
  }

  /* ───────── 캐릭터 페이지: 글자 그림 위로 진짜 그림이 떠올라요 ───────── */
  async function arrive(cfg) {
    const img = document.querySelector('.char-art img');
    // from-bloom 클래스는 그대로 둬요 (빼면 페이지 등장 애니메이션이 다시 돌아요). 그림 투명도만 직접 바꿔요
    const show = () => { if (img) img.style.opacity = '1'; };
    let px = null;
    try { [, px] = await Promise.all([fontsReady(cfg, 1200), pixels(cfg.thumb), img && img.decode().catch(() => {})]); } catch (err) { px = null; }
    if (!px || !img) return show();
    const m = metrics();
    const host = document.createElement('div');
    host.className = 'bloom-arrive';
    host.setAttribute('aria-hidden', 'true');
    document.body.appendChild(host);
    const { x } = canvasOn(host, m);
    x.font = `700 ${m.pcell}px ${FACE}`;
    portraitCells(cfg, m, px).forEach((c) => { x.globalAlpha = c.a; x.fillStyle = rgb(c.c); x.fillText(c.ch, c.x, c.y); });
    // 그림은 천천히 떠오르고, 글자는 그 아래로 스며들어 사라져요
    img.style.transition = 'opacity 1.8s ease';
    img.style.opacity = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      img.style.opacity = '1';
      setTimeout(() => { host.style.opacity = '0'; }, 1100);
      setTimeout(() => { host.remove(); img.style.transition = ''; }, 2700);
    }));
  }

  function define(tone, cfg) {
    defs[tone] = { fade: 0.09, heartColor: [244, 236, 216], ...cfg };
    // 이 인물의 연출을 거쳐 캐릭터 페이지로 왔다면
    if (document.documentElement.classList.contains('from-bloom') && document.querySelector('.char-art img')) {
      let from = false;
      try { from = Date.now() - Number(sessionStorage.getItem(`bloom:${tone}`)) < 8000; sessionStorage.removeItem(`bloom:${tone}`); } catch (err) { /* 무시 */ }
      if (from) arrive(defs[tone]);
    }
  }

  return { define, play, skip, warm, has: (tone) => !!defs[tone], get playing() { return !!(run && !run.done); } };
})();
