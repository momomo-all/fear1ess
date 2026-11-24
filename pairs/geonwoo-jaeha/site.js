(() => {
  const $ = (s) => document.querySelector(s);
  // 바이닐 화면 안(iframe)에서 열렸으면 기록을 쌓지 않고 이동해요 (안 그러면 ‹ Fearless가 바이닐로 안 나가요)
  const embedded = window.top !== window;
  const go = (href) => (embedded ? location.replace(href) : (location.href = href));
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  const still = $('.still');

  // 두 사람: 그림 속 얼굴 자리(1216×832 비율), 대사, 신원 확인 문구
  const PEOPLE = {
    geonwoo: { face: [0.43, 0.39], line: '얼마나 버티는지\n좀 볼까?', wait: 'VERIFYING…', done: 'S-CLASS SENTINEL · STEEL', href: 'geonwoo.html' },
    jaeha: { face: [0.77, 0.17], line: '멍청한 거 티내지 마.\n없어 보여.', wait: 'VERIFYING…', done: 'S-CLASS SENTINEL · GISELLE', href: 'jaeha.html' },
  };
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 4800);

  /* ───────── 그림 비율 → 화면 좌표 (object-fit: cover로 잘린 만큼) ───────── */
  function onScreen([fx, fy]) {
    const box = still.getBoundingClientRect();
    const pos = getComputedStyle(still).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    const k = Math.max(box.width / 1216, box.height / 832);
    const ox = (box.width - 1216 * k) * pos[0];
    const oy = (box.height - 832 * k) * pos[1];
    return { x: box.left + ox + fx * 1216 * k, y: box.top + oy + fy * 832 * k, k };
  }

  /* ───────── 빛이 그 사람에게 ───────── */
  let world = 'idle';
  let leaveT;
  function setWorld(next) {
    clearTimeout(leaveT);
    if (next === world) return;
    if (next !== 'idle') {
      const p = onScreen(PEOPLE[next].face);
      body.style.setProperty('--px', `${p.x}px`);
      body.style.setProperty('--py', `${p.y}px`);
      body.style.setProperty('--spot', `${Math.max(150, 260 * p.k)}px`);
    }
    Dust.mode(next);
    world = next;
    body.dataset.world = next;
    body.classList.toggle('lit-on', next !== 'idle');
  }
  const leaveSoon = () => { clearTimeout(leaveT); leaveT = setTimeout(() => setWorld('idle'), 140); };

  /* ───────── 빨간 펜 자국: 건우에게 ✓(오답), 재하에게 동그라미(정답) ───────── */
  const marks = $('#marks');
  const mkCheck = $('#mkCheck');
  const mkCircle = $('#mkCircle');
  const mkWrong = $('#mkWrong');
  const mkRight = $('#mkRight');
  [mkCheck, mkCircle].forEach((p) => p.setAttribute('pathLength', '1'));
  const f = (n) => n.toFixed(1);
  function drawMarks() {
    const g = onScreen(PEOPLE.geonwoo.face);
    const R = Math.max(70, 120 * g.k);
    // 손으로 휙 그은 ✓: 짧게 내려갔다가 길게 치켜올려요
    mkCheck.setAttribute('d',
      `M${f(g.x - .62 * R)},${f(g.y - .1 * R)} Q${f(g.x - .4 * R)},${f(g.y + .22 * R)} ${f(g.x - .14 * R)},${f(g.y + .62 * R)} ` +
      `Q${f(g.x + .2 * R)},${f(g.y - .1 * R)} ${f(g.x + .9 * R)},${f(g.y - 1.0 * R)}`);
    mkWrong.setAttribute('x', f(g.x + 1.08 * R));
    mkWrong.setAttribute('y', f(g.y - .5 * R));

    const j = onScreen(PEOPLE.jaeha.face);
    j.y += 18 * j.k; // 동그라미 위가 화면 밖으로 잘리지 않게 살짝 아래로
    const C = Math.max(80, 140 * j.k);
    // 한 바퀴 하고 조금 더 돌아 겹치는 동그라미 (손으로 그린 것처럼 살짝 울퉁불퉁)
    let d = '';
    const turns = Math.PI * 2 + .55;
    for (let i = 0; i <= 56; i++) {
      const t = i / 56;
      const a = -2 + t * turns;
      const r = C * (1 + .05 * Math.sin(a * 2 + 1)) * (1 - .07 * t);
      d += `${i ? 'L' : 'M'}${f(j.x + Math.cos(a) * r * 1.12)},${f(j.y + Math.sin(a) * r * .95)} `;
    }
    mkCircle.setAttribute('d', d);
    mkRight.setAttribute('x', f(j.x + C * .55));
    mkRight.setAttribute('y', f(j.y + C * 1.45));
    mkRight.setAttribute('text-anchor', 'middle');

    marks.style.setProperty('--sw', `${Math.max(4, 6.5 * g.k)}px`);
    marks.style.setProperty('--pen-size', `${Math.max(34, 60 * g.k)}px`);
  }

  function placeFaces() {
    document.querySelectorAll('.face-hit').forEach((h) => {
      const p = onScreen(PEOPLE[$('#' + h.dataset.for).dataset.world].face);
      h.style.setProperty('--hx', `${p.x}px`);
      h.style.setProperty('--hy', `${p.y}px`);
      h.style.setProperty('--hs', `${Math.max(90, 150 * p.k)}px`);
    });
    drawMarks();
  }
  placeFaces();
  addEventListener('resize', () => { placeFaces(); if (world !== 'idle') { const w = world; world = ''; setWorld(w); } });

  // 이름과 얼굴: 마우스면 올리기, 터치면 첫 탭에 미리 보기 → 두 번째에 이동
  function bind(el, target, litWord) {
    if (!touch) {
      el.addEventListener('pointerenter', () => { litWord?.classList.add('lit'); setWorld(target); });
      el.addEventListener('pointerleave', () => { litWord?.classList.remove('lit'); leaveSoon(); });
    }
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (touch && world !== target) { setWorld(target); return; }
      playScene(target);
    });
  }
  document.querySelectorAll('.name').forEach((w) => {
    const target = w.dataset.world;
    bind(w, target);
    w.addEventListener('pointerdown', () => { w.dataset.pressed = Date.now(); });
    w.addEventListener('focus', () => { if (Date.now() - (w.dataset.pressed || 0) > 600) setWorld(target); });
    w.addEventListener('blur', leaveSoon);
  });
  document.querySelectorAll('.face-hit').forEach((h) => {
    const w = $('#' + h.dataset.for);
    bind(h, w.dataset.world, w);
  });
  if (touch) document.addEventListener('click', (e) => { if (!e.target.closest('.name, .face-hit')) setWorld('idle'); });

  /* ───────── 대사 → 신원 확인 → 이동 ───────── */
  const scene = $('#scene');
  const sceneLine = $('#sceneLine');
  const signText = $('#signText');
  let play = null;
  const later = (fn, ms) => play.timers.push(setTimeout(fn, ms));
  const clearAll = () => { play.timers.forEach(clearTimeout); play.timers = []; };

  function playScene(target) {
    if (play) return;
    const who = PEOPLE[target];
    const text = `“${who.line}”`;
    scene.dataset.tone = target;
    signText.textContent = who.wait;
    sceneLine.textContent = '';
    sceneLine.setAttribute('aria-label', text.replace(/\n/g, ' '));
    let i = 0;
    text.split(/(\n| )/).forEach((word) => {
      if (word === '\n') { sceneLine.appendChild(document.createElement('br')); return; }
      if (word === ' ') { sceneLine.appendChild(document.createTextNode(' ')); return; }
      if (!word) return;
      const wrap = document.createElement('span');
      wrap.className = 'scene-word';
      wrap.setAttribute('aria-hidden', 'true');
      [...word].forEach((ch) => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.setProperty('--i', i++);
        wrap.appendChild(s);
      });
      sceneLine.appendChild(wrap);
    });
    scene.classList.remove('on', 'full', 'signing', 'signed', 'leave');
    scene.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => scene.classList.add('on')));
    scene.focus({ preventScroll: true });

    play = { href: who.href, done: who.done, timers: [] };
    const typed = reduce ? 300 : 900 + text.length * 50 + 500;
    later(() => scene.classList.add('full'), typed);
    later(sign, typed + 350);
  }
  function sign() {
    scene.classList.add('full', 'signing');
    later(signed, reduce ? 0 : 1150);
  }
  function signed() {
    signText.textContent = play.done;
    scene.classList.add('full', 'signing', 'signed');
    later(leaveScene, 1300);
  }
  function leaveScene() {
    if (!play || scene.classList.contains('leave')) return;
    clearAll();
    scene.classList.add('full', 'leave');
    const href = play.href;
    setTimeout(() => go(href), reduce ? 0 : 620);
  }
  // 누를 때마다 한 단계씩: 대사 다 보이기 → 확인 → 이동
  function advance() {
    if (!play) return;
    clearAll();
    if (!scene.classList.contains('full')) { scene.classList.add('full'); later(sign, 300); }
    else if (!scene.classList.contains('signed')) signed();
    else leaveScene();
  }
  scene.addEventListener('click', advance);
  scene.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); advance(); }
  });

  /* ───────── 공문 직인: 승인란까지 내려오면 쿵 ───────── */
  const notice = $('.notice');
  new IntersectionObserver((entries, io) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      notice.classList.add('stamped');
      io.disconnect();
    });
  }, { threshold: 0.9, rootMargin: '0px 0px -12% 0px' }).observe($('#ntStamp'));

  /* ───────── 빛 속의 먼지 ───────── */
  // 평소: 역광 속에서 먼지가 천천히 떠올라요 (가끔 무지갯빛으로)
  // STEEL: 먼지가 붉게 달아올라 거칠게 소용돌이쳐요 / GISELLE: 먼지가 그 자리에 딱 멈춰 반짝여요 (흐트러짐 없이)
  const Dust = (() => {
    const cv = $('#dust');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, list = [], last = 0, mode = 'idle', heat = 0, freeze = 0;
    function resize() {
      const oW = W, oH = H;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (oW > 50 && oH > 50 && (oW !== W || oH !== H)) list.forEach((p) => { p.x *= W / oW; p.y *= H / oH; });
    }
    const make = (fromBottom) => ({
      x: Math.random() * W, y: fromBottom ? H + 10 + Math.random() * 40 : Math.random() * H,
      r: .5 + Math.random() * 1.9, v: 5 + Math.random() * 12, s: Math.random() * 6,
      a: .25 + Math.random() * .5, tw: Math.random() * 6, f: .8 + Math.random() * 2,
      hue: Math.random() < .18 ? Math.random() * 360 : -1, // 몇 개는 프리즘 빛
    });
    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, .05);
      last = t;
      heat += ((mode === 'geonwoo' ? 1 : 0) - heat) * Math.min(1, dt * 2.6);
      freeze += ((mode === 'jaeha' ? 1 : 0) - freeze) * Math.min(1, dt * 2.4);
      ctx.clearRect(0, 0, W, H);
      const speed = (1 + heat * 3.2) * (1 - freeze * .97);
      list.forEach((p, i) => {
        p.s += dt * (1 + heat * 2);
        p.tw += dt * p.f;
        p.y -= p.v * speed * dt;
        p.x += Math.sin(p.s) * (8 + heat * 46) * (1 - freeze * .97) * dt;
        if (p.y < -20) list[i] = make(true);
        else if (p.x < -20) p.x = W + 10; else if (p.x > W + 20) p.x = -10;
        const glint = freeze * Math.max(0, Math.sin(p.tw)) * .9;
        const r = p.r * (1 + heat * .5 + glint * .7);
        ctx.globalAlpha = Math.min(1, p.a + glint * .5 + heat * .2);
        if (heat > .02) ctx.fillStyle = `rgb(255, ${Math.round(250 - heat * 170)}, ${Math.round(250 - heat * 190)})`;
        else ctx.fillStyle = p.hue < 0 ? '#ffffff' : `hsl(${p.hue}, 90%, 82%)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        if (glint > .55) { // 멈춘 먼지가 반짝이는 순간 십자 빛
          ctx.globalAlpha = (glint - .55) * 1.6;
          ctx.fillStyle = '#e6f2ff';
          ctx.fillRect(p.x - r * 4, p.y - .4, r * 8, .8);
          ctx.fillRect(p.x - .4, p.y - r * 4, .8, r * 8);
        }
      });
      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(tick); else last = 0;
    }
    resize();
    if (!reduce) {
      for (let i = 0, n = W < 700 ? 60 : 110; i < n; i++) list.push(make(false));
      requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) requestAnimationFrame(tick); });
    addEventListener('resize', resize);
    return { mode: (m) => { mode = m; } };
  })();

  /* ───────── D-day + 메시지 (내용은 chat.js) ───────── */
  const C = window.PAIR_CHAT;
  if (C) {
    // 시작일이 D+1이에요 (그날부터 1일째)
    const [y, mo, d] = C.since.split('-').map(Number);
    const start = new Date(y, mo - 1, d);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Math.round((today - start) / 86400000) + 1;
    $('#ddNum').textContent = days > 0 ? `D+${days}` : `D-${1 - days}`;
    $('#ddSince').textContent = `${y}. ${mo}. ${d}. 부터 함께`;
    const head = document.createElement('b');
    head.textContent = C.label || C.them;
    $('#chatHead').appendChild(head);

    const log = $('#chatLog');
    if (!C.log.length) {
      const empty = document.createElement('p');
      empty.className = 'chat-empty';
      empty.textContent = '아직 나눈 메시지가 없어요';
      log.appendChild(empty);
    }
    let k = 0, prev = null;
    C.log.forEach((m, i) => {
      if (m.time) {
        const t = document.createElement('p');
        t.className = 'msg-time';
        t.textContent = m.time;
        t.style.setProperty('--k', k);
        log.appendChild(t);
        prev = null;
      }
      const b = document.createElement('p');
      const next = C.log[i + 1];
      b.className = `msg ${m.from}`;
      if (prev !== m.from) b.classList.add('first');
      if (!next || next.from !== m.from || next.time) b.classList.add('tail');
      b.textContent = m.text;
      b.style.setProperty('--k', k++);
      log.appendChild(b);
      prev = m.from;
    });
    // 마지막이 내 메시지면 "읽음"
    if (C.log.length && C.log[C.log.length - 1].from === 'me') {
      const rd = document.createElement('p');
      rd.className = 'msg-read';
      const bb = document.createElement('b');
      bb.textContent = '읽음';
      rd.appendChild(bb);
      rd.style.setProperty('--k', k);
      log.appendChild(rd);
    }
    if (C.typing) {
      const t = document.createElement('p');
      t.className = 'msg them typing first tail';
      t.setAttribute('aria-label', `${C.them} 입력 중`);
      t.innerHTML = '<i></i><i></i><i></i>';
      t.style.setProperty('--k', k + 2);
      log.appendChild(t);
    }
    new IntersectionObserver((es, io) => {
      if (es.some((e) => e.isIntersecting)) { $('#chat').classList.add('play'); io.disconnect(); }
    }, { threshold: 0.3 }).observe($('#chat'));
  }

  // 뒤로 가기로 돌아왔을 때 연출이 남아 있지 않게
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    play = null;
    scene.hidden = true;
    scene.classList.remove('on', 'full', 'signing', 'signed', 'leave');
    body.classList.remove('opening');
    setWorld('idle');
  });
})();
