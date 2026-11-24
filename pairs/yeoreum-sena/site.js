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
    yeoreum: { face: [0.21, 0.39], line: '…움직일 수\n없을 겁니다.', wait: 'VERIFYING…', done: 'S-CLASS SENTINEL · SUMMER', href: 'yeoreum.html' },
    sena: { face: [0.34, 0.27], line: '몸이 무겁다구요?\n…아, 그 정도면 아직 얕아요.', wait: 'VERIFYING…', done: 'S-CLASS SENTINEL · SIREN', href: 'sena.html' },
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

  function drawMarks() {}

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

  /* ───────── 물방울, 햇살 보케, 빛나는 나비 ───────── */
  // 평소: 물속으로 물방울이 떠오르고, 은은하게 빛나는 나비가 제멋대로 팔랑여요
  // 두 사람 중 누구에게 닿든: 물이 걷히며 물방울 사이로 분홍빛 햇살 보케가 돌아와요
  // SUMMER: 그 순간 빛이 그 자리에 멈춰요 (…움직일 수 없을 겁니다), 나비는 조금 더 환하게
  const Dust = (() => {
    const cv = $('#air');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, bokeh = [], flies = [], last = 0, mode = 'idle', hold = 0, clear = 0;
    function resize() {
      const oW = W, oH = H;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (oW > 50 && oH > 50 && (oW !== W || oH !== H)) [...bokeh, ...flies].forEach((p) => { p.x *= W / oW; p.y *= H / oH; });
    }
    const orb = (bottom) => ({
      x: Math.random() * W, y: bottom ? H + 20 + Math.random() * 60 : Math.random() * H,
      r: 2 + Math.random() * 7, v: 6 + Math.random() * 14, s: Math.random() * 6,
      a: .15 + Math.random() * .35, hue: 330 + Math.random() * 40,
    });
    const fly = () => ({
      x: Math.random() * W, y: Math.random() * H * .85,
      ang: Math.random() * Math.PI * 2, v: 14 + Math.random() * 16,
      s: Math.random() * 6, flap: 5 + Math.random() * 3,
      size: 10 + Math.random() * 7, gold: Math.random() < .6,
    });
    // 나비 한 마리: 둥근 앞날개와 작은 뒷날개, 빛이 번지듯 (날갯짓은 날개 폭이 접혔다 펴지는 것으로)
    function drawFly(b, t) {
      const open = .25 + Math.abs(Math.sin(t * b.flap + b.s)) * .75;
      const s = b.size;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(Math.sin(t * .7 + b.s) * .3);
      ctx.shadowColor = b.gold ? 'rgba(255, 196, 90, .95)' : 'rgba(255, 214, 236, .95)';
      ctx.shadowBlur = s * (1.8 + hold);
      ctx.fillStyle = b.gold ? 'rgba(255, 222, 150, .7)' : 'rgba(255, 240, 248, .72)';
      [-1, 1].forEach((side) => {
        ctx.save();
        ctx.scale(side * open, 1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(s * .15, -s * 1.15, s * 1.3, -s * 1.1, s * 1.05, -s * .15);
        ctx.bezierCurveTo(s * .9, s * .1, s * .35, s * .05, 0, 0);
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(s * .6, s * .1, s * .85, s * .6, s * .45, s * .85);
        ctx.bezierCurveTo(s * .2, s * .95, s * .05, s * .45, 0, 0);
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();
    }
    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, .05);
      last = t;
      const sec = t / 1000;
      hold += ((mode === 'yeoreum' ? 1 : 0) - hold) * Math.min(1, dt * 2.4);
      clear += ((mode !== 'idle' ? 1 : 0) - clear) * Math.min(1, dt * 2);
      const sea = 1 - clear * .7; // 물방울 ↔ 햇살 보케
      ctx.clearRect(0, 0, W, H);

      bokeh.forEach((p, i) => {
        p.s += dt;
        const still = 1 - hold * .96;
        p.y -= p.v * (1 + sea * 3) * still * dt;
        p.x += Math.sin(p.s * (1 + sea)) * (6 + sea * 12) * still * dt;
        if (p.y < -30) bokeh[i] = orb(true);
        if (sea > .05) { // 물방울: 테두리만 반짝
          ctx.globalAlpha = Math.min(1, p.a * 1.6) * sea;
          ctx.strokeStyle = '#dff6ff';
          ctx.lineWidth = 1.2;
          const r = p.r * .7;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(p.x - r * .35, p.y - r * .35, r * .25, 0, Math.PI * 2); ctx.fill();
        }
        if (sea < .95) {
          ctx.globalAlpha = p.a * (1 - sea);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.4);
          g.addColorStop(0, `hsla(${p.hue}, 90%, 92%, 1)`);
          g.addColorStop(1, `hsla(${p.hue}, 90%, 85%, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 2); ctx.fill();
        }
      });

      // 나비: 언제나 천천히 제 갈 길을 팔랑팔랑 (방향이 부드럽게 굽어요)
      flies.forEach((b) => {
        b.ang += Math.sin(sec * .45 + b.s * 3) * .9 * dt;
        b.x += Math.cos(b.ang) * b.v * dt;
        b.y += (Math.sin(b.ang) * b.v * .6 + Math.sin(sec * 2.2 + b.s) * 10) * dt;
        if (b.x < -30) b.x = W + 20; else if (b.x > W + 30) b.x = -20;
        if (b.y < -30) b.y = H + 20; else if (b.y > H + 30) b.y = -20;
        ctx.globalAlpha = .7 + hold * .3;
        drawFly(b, sec);
      });
      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(tick); else last = 0;
    }
    resize();
    if (!reduce) {
      for (let i = 0, n = W < 700 ? 28 : 46; i < n; i++) bokeh.push(orb(false));
      for (let i = 0, n = W < 700 ? 7 : 12; i < n; i++) flies.push(fly());
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
