// 첫 화면: 레트로 바탕화면 (about pair 98)
// login.exe(암호 0001) → 바탕화면 → 아이콘을 누르면 main.js의 화면(프로필 · 바이닐 · 책장)이 열려요
(() => {
  const os = document.getElementById('entry');
  const chrome = document.getElementById('osChrome');
  const portalEl = document.getElementById('portal');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const nav = () => window.SiteNav;
  const inView = () => !!(nav() && nav().isOpen()); // 프로필 · 바이닐 · 책장이 열려 있는 동안엔 바탕화면 키가 쉬어요
  let loggedIn = false;

  // 화면 크기에 맞춰 바탕화면 전체를 통째로 확대 (노트북 ≈1.1~1.25배, 큰 모니터 최대 1.5배, 폰은 그대로)
  let Z = 1;
  function fitZoom() {
    Z = innerWidth <= 760 ? 1 : Math.min(1.5, Math.max(1, Math.min(innerWidth / 1150, innerHeight / 700)));
    Z = Math.round(Z * 100) / 100;
    [os, chrome].forEach((el) => { if (el) el.style.zoom = Z === 1 ? '' : Z; });
  }
  fitZoom();
  addEventListener('resize', fitZoom);
  const VIEW_NAMES = { profile: 'Who are you — profile.exe', pair: 'Fearless — records.exe', shelf: 'Something else — bookshelf.exe' };
  const SHORT = { profile: 'Who are you', pair: 'Fearless', shelf: 'Something else' };

  /* ───── 시계 ───── */
  function tick() {
    const d = new Date();
    const h = d.getHours();
    $('#clock').textContent = `${String(h % 12 || 12).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
    $('#tray').title = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }
  tick();
  setInterval(tick, 15000);

  /* ───── 창 관리 (앞으로 · 최소화 · 최대화 · 닫기 · 작업 표시줄) ───── */
  const ICON = {
    min: '<svg viewBox="0 0 8 8"><path d="M1 6.5h6" stroke="currentColor" stroke-width="1.4"/></svg>',
    max: '<svg viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M1 1.8h6" stroke="currentColor" stroke-width="1.6"/></svg>',
    close: '<svg viewBox="0 0 8 8"><path d="m1 1 6 6M7 1 1 7" stroke="currentColor" stroke-width="1.3"/></svg>',
  };
  const LABEL = { min: '최소화', max: '최대화', close: '닫기' };
  const tasks = $('#tasks');
  const order = [];
  let z = 10;

  $$('.win').forEach((w) => {
    const bar = document.createElement('div');
    bar.className = 'tbar';
    const b = document.createElement('b');
    b.textContent = w.dataset.title;
    bar.appendChild(b);
    (w.dataset.ctl || '').split(' ').filter(Boolean).forEach((a) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tbtn' + (a === 'close' ? ' x' : '');
      btn.dataset.act = a;
      btn.setAttribute('aria-label', LABEL[a]);
      btn.innerHTML = ICON[a];
      bar.appendChild(btn);
    });
    w.prepend(bar);
    w.addEventListener('pointerdown', () => focusWin(w));
  });

  const isMin = (w) => w.classList.contains('min');
  function setTitle(w, t) { w.dataset.title = t; $('.tbar b', w).textContent = t; renderTasks(); }
  function topWin() {
    return $$('.win').filter((w) => !w.hidden && !isMin(w)).sort((a, b) => (+b.style.zIndex || 0) - (+a.style.zIndex || 0))[0];
  }
  function focusWin(w) {
    if (!w || w.hidden) return renderTasks();
    w.classList.remove('min');
    w.style.zIndex = ++z;
    $$('.win.top').forEach((x) => x !== w && x.classList.remove('top'));
    w.classList.add('top');
    renderTasks();
  }
  function openWin(w) {
    const was = w.hidden || isMin(w);
    w.hidden = false;
    w.classList.remove('min', 'closing');
    if (!order.includes(w.id)) order.push(w.id);
    if (was) { w.classList.remove('opening'); void w.offsetWidth; w.classList.add('opening'); }
    focusWin(w);
  }
  function closeWin(w) {
    w.hidden = true;
    w.classList.remove('top', 'max', 'min', 'closing');
    const i = order.indexOf(w.id);
    if (i >= 0) order.splice(i, 1);
    focusWin(topWin());
  }
  function minWin(w) { w.classList.add('min'); w.classList.remove('top'); focusWin(topWin()); }
  function maxWin(w) { if ((w.dataset.ctl || '').includes('max')) { w.classList.toggle('max'); focusWin(w); } }
  function renderTasks() {
    tasks.innerHTML = '';
    const viewing = inView();
    if (viewing) {
      const t = document.createElement('button');
      t.type = 'button';
      t.className = 'task bevel on';
      t.textContent = viewTitle();
      t.setAttribute('aria-pressed', 'true');
      t.addEventListener('click', () => nav().home());
      tasks.appendChild(t);
    }
    order.forEach((id) => {
      const w = document.getElementById(id);
      if (!w || w.hidden) return;
      const t = document.createElement('button');
      t.type = 'button';
      t.className = 'task bevel';
      t.textContent = w.dataset.title;
      const on = !viewing && w.classList.contains('top') && !isMin(w);
      t.classList.toggle('on', on);
      t.setAttribute('aria-pressed', on);
      t.addEventListener('click', () => {
        if (inView()) return afterHome(() => focusWin(w));
        if (isMin(w) || !w.classList.contains('top')) focusWin(w); else minWin(w);
      });
      tasks.appendChild(t);
    });
  }

  os.addEventListener('click', (e) => {
    const act = e.target.closest('.tbtn[data-act]');
    if (act) {
      const w = act.closest('.win');
      if (act.dataset.act === 'min') minWin(w);
      else if (act.dataset.act === 'max') maxWin(w);
      else if (w.id === 'login') nag();
      else closeWin(w);
      return;
    }
    const c = e.target.closest('[data-close]');
    if (c) closeWin(document.getElementById(c.dataset.close));
  });
  os.addEventListener('dblclick', (e) => {
    const bar = e.target.closest('.tbar');
    if (bar && !e.target.closest('button')) maxWin(bar.parentElement);
  });

  // 제목 표시줄을 잡고 끌기 (넓은 화면, 최대화 아닐 때)
  $$('.tbar').forEach((bar) => bar.addEventListener('pointerdown', (e) => {
    const win = bar.parentElement;
    if (e.button !== 0 || e.target.closest('button') || innerWidth <= 760 || win.classList.contains('max')) return;
    const r = win.getBoundingClientRect();
    const dx = e.clientX - r.left;
    const dy = e.clientY - r.top;
    bar.setPointerCapture(e.pointerId);
    let moved = false;
    const move = (ev) => {
      if (!moved) { Object.assign(win.style, { left: `${r.left / Z}px`, top: `${r.top / Z}px`, transform: 'none' }); moved = true; }
      win.style.left = `${Math.min(Math.max(ev.clientX - dx, -r.width + 80), innerWidth - 80) / Z}px`;
      win.style.top = `${Math.min(Math.max(ev.clientY - dy, 0), innerHeight - 80) / Z}px`;
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', () => bar.removeEventListener('pointermove', move), { once: true });
  }));

  // 알림 창
  const alertWin = $('#alert');
  function dialog(title, msg, buttons = [['확인']], icon = 'i') {
    setTitle(alertWin, title);
    $('#alertIc').textContent = icon;
    $('#alertMsg').textContent = msg;
    const row = $('#alertRow');
    row.innerHTML = '';
    buttons.forEach(([label, fn]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn bevel';
      b.textContent = label;
      b.addEventListener('click', () => { closeWin(alertWin); if (fn) fn(); });
      row.appendChild(b);
    });
    openWin(alertWin);
    row.firstChild.focus();
  }

  /* ───── 테마 (디자인 시안 사진 4장) ───── */
  const THEMES = {
    blue: { name: 'blue-gray', a: '#5b7592', b: '#d3dee9' },
    pink: { name: 'pink check', a: '#c93a6e', b: '#f8c3d3' },
    sage: { name: 'sage', a: '#5c7a62', b: '#dbe5d6' },
    sky: { name: 'sky y2k', a: '#2f6fd0', b: '#b6dcff' },
  };
  const KEYS = Object.keys(THEMES);
  if (!THEMES[os.dataset.theme]) os.dataset.theme = 'blue';
  [chrome, portalEl].forEach((el) => { if (el) el.dataset.theme = os.dataset.theme; });

  const ptThemes = $('#ptThemes');
  const propList = $('#propList');
  KEYS.forEach((k) => {
    const t = THEMES[k];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'os-th';
    b.dataset.theme = k;
    b.style.cssText = `--a:${t.a};--b:${t.b}`;
    b.setAttribute('aria-label', `테마: ${t.name}`);
    b.title = t.name;
    b.addEventListener('click', () => setTheme(k));
    ptThemes.appendChild(b);
    propList.insertAdjacentHTML('beforeend', `<label><input type="radio" name="os-theme" value="${k}"><i style="--a:${t.a};--b:${t.b}"></i>${t.name}</label>`);
  });
  propList.addEventListener('change', (e) => { $('#monScreen').dataset.theme = e.target.value; });

  async function setTheme(k) {
    if (!THEMES[k]) return;
    document.body.classList.add('wait');
    await wait(260); // 모래시계 잠깐
    store.set('desk-theme', k);
    paintTheme(k);
    syncTheme();
    document.body.classList.remove('wait');
  }
  function paintTheme(k) {
    [os, chrome, portalEl].forEach((el) => { if (el) el.dataset.theme = k; });
    // about 뺙이(프로필) 창도 같은 테마 색으로
    const pf = document.getElementById('profileFrame');
    try { if (pf && pf.contentWindow) pf.contentWindow.postMessage({ deskTheme: k }, '*'); } catch (e) {}
  }
  function syncTheme() {
    const k = os.dataset.theme;
    $$('.os-th', ptThemes).forEach((b) => b.setAttribute('aria-pressed', b.dataset.theme === k));
    $('#ptStatus').textContent = `theme : ${THEMES[k].name}`;
    const r = $(`input[value="${k}"]`, propList);
    if (r) r.checked = true;
    $('#monScreen').dataset.theme = k;
    buildPens();
  }
  $('#propApply').addEventListener('click', () => { const r = $('input:checked', propList); if (r) setTheme(r.value); });
  $('#propOk').addEventListener('click', () => { const r = $('input:checked', propList); if (r) setTheme(r.value); closeWin($('#props')); });

  /* ───── 그림판 ───── */
  const cv = $('#cv');
  const ctx = cv.getContext('2d');
  const PEN_VARS = ['--ink', '--line', '--title', '--sel', '--accent', '--mid', '--dot', '--paper'];
  let penIdx = 0;
  let tool = 'pen';
  const penColor = (i) => getComputedStyle(os).getPropertyValue(PEN_VARS[i]).trim();
  function buildPens() {
    const box = $('#ptPens');
    box.innerHTML = '';
    PEN_VARS.forEach((v, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pen';
      b.style.setProperty('--c', `var(${v})`);
      b.setAttribute('aria-label', `색 ${i + 1}`);
      b.setAttribute('aria-pressed', i === penIdx);
      b.addEventListener('click', () => { penIdx = i; pickTool('pen'); buildPens(); });
      box.appendChild(b);
    });
  }
  function pickTool(t) {
    tool = t;
    $$('.tool[data-tool="pen"], .tool[data-tool="eraser"]').forEach((b) => {
      const on = b.dataset.tool === t;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
  }
  $$('.tool').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.tool === 'clear') { ctx.clearRect(0, 0, cv.width, cv.height); $('#cvHint').hidden = false; return; }
    pickTool(b.dataset.tool);
  }));
  const at = (e) => {
    const r = cv.getBoundingClientRect();
    return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height];
  };
  let last = null;
  function stroke(a, b) {
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = penColor(penIdx);
    ctx.lineWidth = tool === 'eraser' ? 22 : 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0] + .01, b[1]);
    ctx.stroke();
  }
  cv.addEventListener('pointerdown', (e) => {
    cv.setPointerCapture(e.pointerId);
    last = at(e);
    $('#cvHint').hidden = true;
    stroke(last, last);
  });
  cv.addEventListener('pointermove', (e) => {
    const p = at(e);
    $('#ptXY').textContent = `${Math.round(p[0])}, ${Math.round(p[1])}px`;
    if (!last) return;
    stroke(last, p);
    last = p;
  });
  cv.addEventListener('pointerup', () => { last = null; });
  cv.addEventListener('pointercancel', () => { last = null; });
  syncTheme();

  /* ───── playlist.exe : 페어별 노래 묶음 (data/playlists.js) ───── */
  const PL = window.PLAYLISTS || {};
  const PL_PAIRS = window.PAIRS || [];
  const player = $('#player');
  const audio = new Audio();
  audio.preload = 'none';
  let plPair = null;
  let plIdx = -1;
  const mmss = (s) => (Number.isFinite(s) ? `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '--:--');
  function bundle(id) {
    const v = PL[id];
    if (!v) return { tracks: [], link: null };
    if (Array.isArray(v)) return { tracks: v, link: null };
    return { tracks: v.tracks || [], link: v.link || null };
  }
  function row(cls) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `pl-row ${cls}`;
    return b;
  }
  function buildPairs() {
    const ul = $('#plPairs');
    PL_PAIRS.forEach((p) => {
      const li = document.createElement('li');
      const b = row('pl-pair');
      b.dataset.id = p.id;
      b.innerHTML = '<i class="sw"></i><span class="nm"></span><span class="ct"></span>';
      b.querySelector('.sw').style.setProperty('--c', p.color || '#999');
      b.querySelector('.nm').textContent = p.title;
      const n = bundle(p.id).tracks.length;
      b.querySelector('.ct').textContent = n ? n : '';
      b.addEventListener('click', () => pickPair(p.id));
      li.appendChild(b);
      ul.appendChild(li);
    });
  }
  function pickPair(id) {
    plPair = id;
    const p = PL_PAIRS.find((x) => x.id === id);
    const { tracks, link } = bundle(id);
    $$('.pl-pair').forEach((b) => b.setAttribute('aria-current', b.dataset.id === id));
    $('#plListHead').textContent = p ? p.title.toUpperCase() : 'TRACKS';
    const ol = $('#plTracks');
    ol.innerHTML = '';
    tracks.forEach((t, i) => {
      const li = document.createElement('li');
      const b = row('pl-song');
      b.innerHTML = '<span class="no"></span><span class="nm"><span></span><small></small></span>';
      b.querySelector('.no').textContent = String(i + 1).padStart(2, '0');
      b.querySelector('.nm span').textContent = t.title || '제목 없음';
      b.querySelector('.nm small').textContent = t.artist || '';
      b.addEventListener('click', () => playTrack(i));
      li.appendChild(b);
      ol.appendChild(li);
    });
    $('#plEmpty').hidden = tracks.length > 0;
    const all = $('#plAll');
    all.hidden = !link;
    if (link) all.href = link;
    $('#plCount').textContent = `${tracks.length} track(s)`;
    $('#plPairName').textContent = p ? p.title : '';
    if (plIdx < 0) {
      // 화면엔 페어의 한 줄 소개 (예: 사월재훈 → 소란스러운 봄의 교향곡)
      screen(p ? (p.tagline || p.title).replace(/\s*\n\s*/g, ' ') : '페어를 골라 주세요');
    }
  }
  // 플레이어 화면 글씨 (한 줄). 칸보다 길 때만 잠깐 멈췄다가 옆으로 밀려요
  function screen(text) {
    const span = document.createElement('span');
    span.textContent = text;
    $('#plTrack').replaceChildren(span);
    requestAnimationFrame(fitScreen);
  }
  function fitScreen() {
    const box = $('#plTrack');
    const span = box.firstElementChild;
    if (!span) return;
    span.classList.remove('slide');
    const d = span.scrollWidth - box.clientWidth;
    if (d <= 2 || !box.clientWidth) return;
    span.style.setProperty('--dist', `${d}px`);
    span.style.setProperty('--dur', `${Math.max(3, d / 18)}s`); // 넘친 길이에 맞춰 속도가 비슷하게
    void span.offsetWidth;
    span.classList.add('slide');
  }
  // 창을 열거나 크기가 바뀌면 (PL을 펼치면 넓어져요) 다시 재요
  new ResizeObserver(fitScreen).observe($('#plTrack'));
  if (document.fonts) document.fonts.ready.then(fitScreen);
  function markSong() {
    $$('.pl-song', $('#plTracks')).forEach((b, i) => b.setAttribute('aria-current', i === plIdx && plPair === player.dataset.pair));
  }
  /* 재생 엔진: 유튜브 링크는 창 안의 유튜브 플레이어로, 음악 파일(src)은 바로, 그 밖의 링크는 새 탭으로
     (유튜브 규칙상 영상을 숨기고 소리만 틀 수 없어서, 재생 중엔 화면 위에 작은 영상 칸이 보여요) */
  let mode = null; // 'yt' | 'audio' | null
  let yt = null;
  let ytReady = null;
  let ytTimer = null;
  function ytId(url) {
    try {
      const u = new URL(url);
      if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0];
      if (u.hostname.endsWith('youtube.com')) return u.searchParams.get('v') || (u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{6,})/) || [])[1] || null;
    } catch (e) { /* 주소가 아니면 */ }
    return null;
  }
  function loadYT() {
    if (ytReady) return ytReady;
    ytReady = new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve();
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    });
    return ytReady;
  }
  function showTime(cur, dur) {
    $('#plTime').textContent = `${mmss(cur)} / ${mmss(dur)}`;
    $('#plBar').style.width = dur ? `${(cur / dur) * 100}%` : '0';
  }
  function ytTick() {
    if (yt && yt.getDuration) showTime(yt.getCurrentTime(), yt.getDuration());
  }
  async function playYT(id) {
    $('#plVideo').hidden = false;
    $('#plState').textContent = '♪ LOADING...';
    await loadYT();
    if (yt) { yt.loadVideoById(id); return; }
    yt = new YT.Player('plYT', {
      host: 'https://www.youtube-nocookie.com',
      videoId: id,
      playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1, origin: location.origin },
      events: {
        // 퍼가기가 막힌 영상이거나(101 · 150) 사이트 주소를 못 받으면(153) 유튜브로 보내요
        onError: () => { if (mode === 'yt') blocked(); },
        onReady: (e) => e.target.playVideo(),
        onStateChange: (e) => {
          if (mode !== 'yt') return;
          if (e.data === YT.PlayerState.PLAYING) { setPlaying(true); clearInterval(ytTimer); ytTimer = setInterval(ytTick, 500); }
          else if (e.data === YT.PlayerState.PAUSED) { setPlaying(false); ytTick(); }
          else if (e.data === YT.PlayerState.ENDED) { clearInterval(ytTimer); playTrack(plIdx + 1); }
        },
      },
    });
  }
  function blocked() {
    const t = bundle(player.dataset.pair).tracks[plIdx];
    stopAll();
    mode = null;
    setPlaying(false);
    $('#plVideo').hidden = true;
    $('#plState').textContent = '⚠ 여기선 재생이 안 돼요';
    if (t && t.url) { $('#plOut').href = t.url; $('#plOut').hidden = false; }
  }
  function stopAll() {
    audio.pause();
    if (yt && yt.pauseVideo) yt.pauseVideo();
    clearInterval(ytTimer);
  }
  function playTrack(i) {
    const { tracks } = bundle(plPair);
    if (!tracks.length) return;
    plIdx = (i + tracks.length) % tracks.length;
    player.dataset.pair = plPair;
    const t = tracks[plIdx];
    const p = PL_PAIRS.find((x) => x.id === plPair);
    screen([[t.title || '제목 없음', t.artist].filter(Boolean).join(' — '), p && p.title].filter(Boolean).join('  ✦  '));
    markSong();
    showTime(0, NaN);
    $('#plOut').hidden = true;
    // 파일로 직접 연 사이트(file://)에선 유튜브가 창 안 재생을 막아서(오류 153),
    // 그땐 누른 곡부터 이 페어의 유튜브 곡들을 이어 붙인 임시 재생목록을 새 탭으로 열어요
    if (location.protocol === 'file:' && t.url && ytId(t.url)) {
      const ids = tracks.slice(plIdx).concat(tracks.slice(0, plIdx)).map((x) => x.url && ytId(x.url)).filter(Boolean);
      stopAll();
      mode = null;
      setPlaying(false);
      $('#plState').textContent = '↗ 유튜브 재생목록으로 열었어요';
      window.open(`https://www.youtube.com/watch_videos?video_ids=${ids.join(',')}`, '_blank', 'noopener');
      return;
    }
    const id = t.url && ytId(t.url);
    if (t.src) {
      if (mode === 'yt') stopAll();
      mode = 'audio';
      $('#plVideo').hidden = true;
      audio.src = t.src;
      audio.play().catch(() => {});
    } else if (id) {
      audio.pause();
      audio.removeAttribute('src');
      mode = 'yt';
      playYT(id);
    } else {
      stopAll();
      mode = null;
      setPlaying(false);
      $('#plState').textContent = t.url ? '↗ 새 탭에서 열었어요' : '♪ 링크가 없어요';
      if (t.url) window.open(t.url, '_blank', 'noopener');
    }
  }
  function setPlaying(on) {
    player.classList.toggle('playing', on);
    $('#plState').textContent = on ? '♪ NOW PLAYING' : (mode ? '❚❚ PAUSED' : $('#plState').textContent);
    $('#plIcon').setAttribute('d', on ? 'M2.5 1h2.6v10H2.5zM6.9 1h2.6v10H6.9z' : 'M3 1.5v9L10.5 6z');
    $('#plPlay').setAttribute('aria-label', on ? '일시정지' : '재생');
  }
  audio.addEventListener('play', () => { if (mode === 'audio') setPlaying(true); });
  audio.addEventListener('pause', () => { if (mode === 'audio') setPlaying(false); });
  audio.addEventListener('ended', () => playTrack(plIdx + 1));
  audio.addEventListener('timeupdate', () => { if (mode === 'audio') showTime(audio.currentTime, audio.duration); });
  $('#plPlay').addEventListener('click', () => {
    if (mode === 'audio') { if (audio.paused) audio.play().catch(() => {}); else audio.pause(); return; }
    if (mode === 'yt' && yt && yt.getPlayerState) {
      if (yt.getPlayerState() === YT.PlayerState.PLAYING) yt.pauseVideo(); else yt.playVideo();
      return;
    }
    playTrack(plIdx < 0 ? 0 : plIdx);
  });
  $('#plPrev').addEventListener('click', () => {
    const cur = mode === 'audio' ? audio.currentTime : mode === 'yt' && yt && yt.getCurrentTime ? yt.getCurrentTime() : 0;
    if (cur > 3) { if (mode === 'audio') audio.currentTime = 0; else yt.seekTo(0, true); return; }
    playTrack(plIdx - 1);
  });
  $('#plNext').addEventListener('click', () => playTrack(plIdx + 1));
  $('#plSeek').addEventListener('click', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    if (mode === 'audio' && audio.duration) audio.currentTime = f * audio.duration;
    else if (mode === 'yt' && yt && yt.getDuration && yt.getDuration()) { yt.seekTo(f * yt.getDuration(), true); ytTick(); }
  });
  // 페어 목록은 접어 두고, PL 버튼으로 펼쳐요
  $('#plTog').addEventListener('click', () => {
    const open = $('#plLib').hidden;
    $('#plLib').hidden = !open;
    player.classList.toggle('lib-open', open);
    $('#plTog').classList.toggle('on', open);
    $('#plTog').setAttribute('aria-expanded', open);
  });
  buildPairs();
  if (PL_PAIRS.length) pickPair((PL_PAIRS.find((p) => bundle(p.id).tracks.length) || PL_PAIRS[0]).id);

  /* ───── login.exe ───── */
  const CODE = '0001';
  const login = $('#login');
  const dots = $$('#pwField i');
  let typed = '';
  let busy = false;

  function paintDots() {
    dots.forEach((d, i) => d.classList.toggle('on', i < typed.length));
    $('#pwField').setAttribute('aria-label', `${typed.length}자리 입력됨`);
  }
  function shake(w) { w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake'); }
  function nag() { shake(login); $('#lgSub').textContent = '로그인이 필요해요. (｀・ω・´)'; }
  function press(k) {
    if (busy || typed.length >= 4) return;
    typed += k;
    paintDots();
    $('#lgStatus').textContent = 'typing...';
    if (typed.length === 4) check();
  }
  async function check() {
    if (busy) return;
    busy = true;
    await wait(150);
    if (typed === CODE) return unlock();
    shake(login);
    $('#lgSub').textContent = '암호가 달라요. (；へ：)';
    $('#lgStatus').textContent = 'error: wrong password';
    await wait(420);
    typed = '';
    paintDots();
    busy = false;
  }
  $$('.pw-key[data-k]').forEach((k) => k.addEventListener('click', () => press(k.dataset.k)));
  $('#pwDel').addEventListener('click', () => { if (!busy) { typed = typed.slice(0, -1); paintDots(); } });
  $('#pwOk').addEventListener('click', () => { if (typed.length) check(); });

  async function unlock() {
    $('#lgSub').textContent = '확인했어요 ( ˶ˆᗜˆ˵ )';
    $('#lgStatus').textContent = 'loading...';
    login.classList.add('ok');
    await wait(1000); // 로그인 창 안 줄무늬 막대가 다 차면
    login.classList.add('closing');
    await wait(360);
    closeWin(login);
    // 바탕화면이 켜지고, 작업 표시줄 · 아이콘 · 창이 차례로
    os.classList.remove('logon');
    document.documentElement.classList.remove('os-logon');
    chrome.classList.remove('boot');
    void chrome.offsetWidth;
    chrome.classList.add('boot');
    loggedIn = true;
    busy = false;
    $('#startBtn').setAttribute('aria-disabled', 'false');
    $('#icons').hidden = false;
    refreshIcons();
    await wait(450);
    if (innerWidth > 1100) {
      openWin($('#paint'));
      await wait(160);
      openWin($('#player'));
      await wait(160);
    }
    openWin($('#hi'));
    $('#hi .hi-list button').focus({ preventScroll: true });
  }

  function resetToLogin() {
    loggedIn = false;
    stopAll();
    closeMenus();
    ['hi', 'props', 'alert', 'paint', 'player'].forEach((id) => closeWin(document.getElementById(id)));
    os.classList.add('logon');
    document.documentElement.classList.add('os-logon');
    $('#icons').hidden = true;
    $('#startBtn').setAttribute('aria-disabled', 'true');
    typed = '';
    busy = false;
    paintDots();
    login.classList.remove('ok', 'closing', 'shake');
    $('#lgSub').textContent = '암호 네 자리를 입력하세요.';
    $('#lgStatus').textContent = 'ready.';
    openWin(login);
  }

  /* ───── 아이콘 · 앱 실행 ───── */
  const desk = $('#desk');
  const VIEWS = { who: 'profile', fearless: 'pair', else: 'shelf' };
  function afterHome(fn) {
    if (!inView()) return fn();
    addEventListener('sitenav:home', () => setTimeout(fn, 60), { once: true });
    nav().home();
  }
  function launch(id, origin) {
    closeMenus();
    if (VIEWS[id]) { if (nav()) { document.documentElement.classList.add('os-in-view'); nav().open(VIEWS[id], origin); } return; }
    if (inView()) return afterHome(() => launch(id));
    if (id === 'vestal') return dialog('Vestal', '아직 준비 중이에요. coming soon (˶˃ ᵕ ˂˶)');
    if (id === 'bin') return dialog('휴지통', '휴지통이 비어 있어요. ( ˙꒳˙ )');
    const w = document.getElementById(id);
    if (w) openWin(w);
  }
  // start 메뉴 안의 항목은 메뉴가 닫히면 사라지니, 물결은 start 버튼에서 퍼져요
  $$('[data-app]:not(.ico)').forEach((b) => b.addEventListener('click', () => launch(b.dataset.app, b.closest('#startMenu, #ctx') ? $('#startBtn') : b)));

  let lastPointer = 'mouse';
  addEventListener('pointerdown', (e) => { lastPointer = e.pointerType; }, true);
  const icos = $$('.ico');
  function select(list) { icos.forEach((i) => i.classList.toggle('sel', list.includes(i))); }
  icos.forEach((ic) => {
    ic.addEventListener('click', (e) => {
      select([ic]);
      if (e.detail && lastPointer === 'touch') launch(ic.dataset.app, ic); // 손가락은 한 번에 열려요
    });
    ic.addEventListener('dblclick', () => launch(ic.dataset.app, ic));
    ic.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); launch(ic.dataset.app, ic); } });
  });
  function refreshIcons() { desk.classList.remove('on'); void desk.offsetWidth; desk.classList.add('on'); }

  // 빈 바탕을 끌면 선택 상자
  const selbox = $('#selbox');
  desk.addEventListener('pointerdown', (e) => {
    if (e.target !== desk || e.button !== 0) return;
    select([]);
    if (!loggedIn) return;
    const x0 = e.clientX;
    const y0 = e.clientY;
    desk.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const l = Math.min(x0, ev.clientX);
      const t = Math.min(y0, ev.clientY);
      const w = Math.abs(ev.clientX - x0);
      const h = Math.abs(ev.clientY - y0);
      Object.assign(selbox.style, { left: `${l / Z}px`, top: `${t / Z}px`, width: `${w / Z}px`, height: `${h / Z}px` });
      selbox.hidden = w + h < 4;
      select(icos.filter((i) => {
        const r = i.getBoundingClientRect();
        return r.right > l && r.left < l + w && r.bottom > t && r.top < t + h;
      }));
    };
    desk.addEventListener('pointermove', move);
    desk.addEventListener('pointerup', () => { desk.removeEventListener('pointermove', move); selbox.hidden = true; }, { once: true });
  });

  /* ───── start 메뉴 · 오른쪽 클릭 메뉴 ───── */
  const startBtn = $('#startBtn');
  const startMenu = $('#startMenu');
  const ctxMenu = $('#ctx');
  function closeMenus() {
    startMenu.hidden = true;
    ctxMenu.hidden = true;
    startBtn.classList.remove('on');
    startBtn.setAttribute('aria-expanded', 'false');
  }
  startBtn.addEventListener('click', () => {
    if (!loggedIn) return nag();
    const open = startMenu.hidden;
    closeMenus();
    if (open) {
      startMenu.hidden = false;
      startBtn.classList.add('on');
      startBtn.setAttribute('aria-expanded', 'true');
      $('.mi', startMenu).focus();
    }
  });
  desk.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    closeMenus();
    ctxMenu.hidden = false;
    const r = ctxMenu.getBoundingClientRect();
    ctxMenu.style.left = `${Math.min(e.clientX, innerWidth - r.width - 4) / Z}px`;
    ctxMenu.style.top = `${Math.min(e.clientY, innerHeight - r.height - 44 * Z) / Z}px`;
    $('.mi', ctxMenu).focus();
  });
  document.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('#startMenu, #ctx, #startBtn')) closeMenus();
  });

  /* ───── 시스템 종료 → 다시 켜기 ───── */
  const off = $('#off');
  async function shutdown() {
    stopAll();
    document.body.classList.add('wait');
    await wait(900);
    document.body.classList.remove('wait');
    $('#offMsg').textContent = '이제 컴퓨터를 꺼도 안전합니다.';
    $('#offSub').textContent = '아무 곳이나 누르면 다시 켜져요';
    off.hidden = false;
    off.focus();
  }
  async function boot() {
    if (off.dataset.booting) return;
    off.dataset.booting = '1';
    $('#offMsg').textContent = 'Starting about pair 98...';
    $('#offSub').textContent = '';
    await wait(1100);
    off.hidden = true;
    delete off.dataset.booting;
    resetToLogin();
  }
  off.addEventListener('click', boot);
  off.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') boot(); });

  const CMDS = {
    refresh: refreshIcons,
    nexttheme: () => setTheme(KEYS[(KEYS.indexOf(os.dataset.theme) + 1) % KEYS.length]),
    logoff: () => afterHome(() => dialog('로그오프', '로그오프할까요?', [['예', resetToLogin], ['아니요']], '?')),
    shutdown: () => afterHome(() => dialog('시스템 종료', '컴퓨터를 끌까요?', [['예', shutdown], ['아니요']], '?')),
  };
  $$('[data-cmd]').forEach((b) => b.addEventListener('click', () => { closeMenus(); CMDS[b.dataset.cmd](); }));

  /* ───── 바이닐 · 책장 같은 화면이 열리고 닫힐 때 ───── */
  function viewTitle() {
    const st = nav() ? nav().stack() : [];
    const top = st[st.length - 1];
    if (top === 'site') return `${nav().site()} — ${SHORT[st[st.length - 2]] || 'about pair'}`;
    return VIEW_NAMES[top] || 'about pair';
  }
  addEventListener('sitenav:change', () => {
    document.documentElement.classList.toggle('os-in-view', inView()); // 열려 있는 동안 작업 표시줄은 숨어요
    renderTasks();
  });

  /* ───── 키보드 ───── */
  addEventListener('keydown', (e) => {
    if (inView()) return;
    if (e.key === 'Escape') {
      if (!startMenu.hidden || !ctxMenu.hidden) return closeMenus();
      const w = topWin();
      if (w && w.id !== 'login') closeWin(w);
      return;
    }
    if (loggedIn || login.hidden || e.target.closest('input, textarea')) return;
    const key = /^[0-9]$/.test(e.key) && $(`.pw-key[data-k="${e.key}"]`);
    const flash = (b) => { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 110); };
    if (key) { flash(key); press(e.key); }
    else if (e.key === 'Backspace') { flash($('#pwDel')); $('#pwDel').click(); }
    else if (e.key === 'Enter') { flash($('#pwOk')); $('#pwOk').click(); }
  });

  /* ───── 처음 켤 때 ───── */
  // 로그인 화면엔 로그인 창만. 그림판 · 플레이어는 로그인하면 떠요 (좁은 화면에선 start 메뉴로)
  ['paint', 'player'].forEach((id) => { document.getElementById(id).hidden = true; });
  order.push('login');
  login.style.zIndex = ++z;
  focusWin(login);
})();
