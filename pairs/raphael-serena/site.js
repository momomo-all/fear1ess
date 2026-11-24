(() => {
  const $ = (s) => document.querySelector(s);
  // 바이닐 화면 안(iframe)에서 열렸으면 기록을 쌓지 않고 이동해요 (안 그러면 ‹ Fearless가 바이닐로 안 나가요)
  const embedded = window.top !== window;
  const go = (href) => (embedded ? location.replace(href) : (location.href = href));
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  const still = $('.still.color');

  // 두 사람: 그림 속 얼굴 자리(1216×832 비율), 대사, 기도 문구
  const PEOPLE = {
    raphael: { face: [0.5, 0.22], line: 'Viator, ne timeas.\nTe domum reducam.', wait: 'ORA PRO NOBIS…', done: 'AMEN · RAPHAEL', href: 'raphael.html' },
    serena: { face: [0.64, 0.4], line: '한 방에, 주님 곁으로.', wait: 'LOADING…', done: 'AMEN · SERENA', href: 'serena.html' },
  };
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 3800);

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
      body.style.setProperty('--spot', `${Math.max(140, 240 * p.k)}px`);
    }
    Sky.mode(next);
    world = next;
    body.dataset.world = next;
    body.classList.toggle('lit-on', next !== 'idle');
  }
  const leaveSoon = () => { clearTimeout(leaveT); leaveT = setTimeout(() => setWorld('idle'), 140); };

  function placeFaces() {
    document.querySelectorAll('.face-hit').forEach((h) => {
      const p = onScreen(PEOPLE[$('#' + h.dataset.for).dataset.world].face);
      h.style.setProperty('--hx', `${p.x}px`);
      h.style.setProperty('--hy', `${p.y}px`);
      h.style.setProperty('--hs', `${Math.max(90, 150 * p.k)}px`);
    });
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

  /* ───────── 대사 → 기도 → 아멘 → 이동 ───────── */
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
  // 누를 때마다 한 단계씩: 대사 다 보이기 → 아멘 → 이동
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

  /* ───────── 하늘: 깃털과 반짝임 ───────── */
  // 평소: 깃털이 천천히 내려요 / Raphael: 깃털이 금빛으로 물들며 위로 떠올라요 (집으로 인도)
  // Serena: 반짝임이 붉게 타오르며 많아져요
  const Sky = (() => {
    const cv = $('#sky');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, feathers = [], sparks = [], last = 0, mode = 'idle', lift = 0, heat = 0;
    function resize() {
      const oW = W, oH = H;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (oW !== W || oH !== H) spread(oW, oH);
    }
    const feather = (edge) => ({
      x: Math.random() * W, y: edge ? (edge < 0 ? -20 - Math.random() * H * .25 : H + 20 + Math.random() * H * .25) : Math.random() * H,
      len: 7 + Math.random() * 11, v: 14 + Math.random() * 18,
      sway: Math.random() * 6, rot: Math.random() * 6, spin: (Math.random() - .5) * 1.2, a: .45 + Math.random() * .4,
    });
    // 화면 크기가 바뀌면 같은 비율 자리로 옮겨요 (이전 크기가 없었으면 새로 흩뿌려요)
    function spread(oW, oH) {
      const move = (p, top) => {
        if (oW > 50 && oH > 50) { p.x *= W / oW; p.y *= H / oH; }
        else { p.x = Math.random() * W; p.y = Math.random() * H * top; }
      };
      feathers.forEach((p) => move(p, 1));
      sparks.forEach((s) => move(s, .8));
    }
    const spark = () => ({ x: Math.random() * W, y: Math.random() * H * .8, r: 1 + Math.random() * 2.6, t: Math.random() * 6, f: .6 + Math.random() * 1.4 });
    function drawFeather(p) {
      const len = p.len;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.ellipse(0, 0, len * .32, len, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = p.a * .5;
      ctx.fillRect(-.4, -len, .8, len * 2.3); // 깃대
      ctx.restore();
    }
    function drawSpark(s, alpha) {
      const r = s.r * (1 + heat * .8);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - r * 3); ctx.lineTo(s.x + r * .5, s.y - r * .5);
      ctx.lineTo(s.x + r * 3, s.y); ctx.lineTo(s.x + r * .5, s.y + r * .5);
      ctx.lineTo(s.x, s.y + r * 3); ctx.lineTo(s.x - r * .5, s.y + r * .5);
      ctx.lineTo(s.x - r * 3, s.y); ctx.lineTo(s.x - r * .5, s.y - r * .5);
      ctx.closePath(); ctx.fill();
    }
    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, .05);
      last = t;
      // 모드가 바뀌면 부드럽게 따라가요
      lift += ((mode === 'raphael' ? 1 : 0) - lift) * Math.min(1, dt * 2.5);
      heat += ((mode === 'serena' ? 1 : 0) - heat) * Math.min(1, dt * 3);
      ctx.clearRect(0, 0, W, H);

      // 깃털: 흰빛 → 금빛
      const g = Math.round(255 - lift * 30), b = Math.round(255 - lift * 120);
      ctx.fillStyle = `rgb(255, ${g}, ${b})`;
      const dir = 1 - lift * 1.8; // 1: 아래로, -0.8: 위로
      feathers.forEach((p, i) => {
        p.sway += dt;
        p.rot += p.spin * dt;
        p.y += p.v * dir * dt;
        p.x += (Math.sin(p.sway * .9) * 22 + 6) * dt;
        if (p.x > W + 30) p.x = -30; else if (p.x < -30) p.x = W + 30;
        if (p.y > H + 40 + H * .25) feathers[i] = feather(-1);
        else if (p.y < -40 - H * .25) feathers[i] = feather(1);
        drawFeather(p);
      });

      // 반짝임: 흰빛 → 붉은빛
      ctx.fillStyle = heat > .02 ? `rgb(255, ${Math.round(255 - heat * 175)}, ${Math.round(255 - heat * 165)})` : '#fff';
      const shown = Math.round(sparks.length * (.45 + heat * .55));
      for (let i = 0; i < shown; i++) {
        const s = sparks[i];
        s.t += dt * s.f * (1 + heat * 1.5);
        const a = Math.max(0, Math.sin(s.t)) * (.55 + heat * .4);
        if (s.t > Math.PI * 2) { Object.assign(s, spark()); s.t = 0; }
        if (a > .01) drawSpark(s, a);
      }
      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(tick); else last = 0;
    }
    resize();
    if (!reduce) {
      const n = W < 700 ? 22 : 38;
      for (let i = 0; i < n; i++) feathers.push(feather(0));
      for (let i = 0; i < 46; i++) sparks.push(spark());
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
