(() => {
  const $ = (s) => document.querySelector(s);
  // 바이닐 화면 안(iframe)에서 열렸으면 기록을 쌓지 않고 이동해요 (안 그러면 ‹ Fearless가 바이닐로 안 나가요)
  const embedded = window.top !== window;
  const go = (href) => (embedded ? location.replace(href) : (location.href = href));
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  const still = $('.still.color');

  // 두 사람: 그림 속 얼굴 자리(1216×832 비율), 대사, 신원 확인 문구
  const PEOPLE = {
    yophiel: { face: [0.6, 0.22], line: 'Fiat pulchritudo.\nQuid obstat?', wait: 'IDENTIFYING ENTITY…', done: 'UNCLASSIFIED · YOPHIEL', href: 'yophiel.html' },
    burning: { face: [0.74, 0.36], line: '작작 놀다 와.\n씨발, 나만 힘드니까.', wait: 'VERIFYING…', done: 'S-CLASS GUIDE · BURNING', href: 'burning.html' },
  };
  // 언제나 제 색인 붉은 꽃 자리
  const FLOWER = [0.632, 0.385];
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 4000);

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
    Snow.mode(next);
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
    const f = onScreen(FLOWER);
    body.style.setProperty('--fx', `${f.x}px`);
    body.style.setProperty('--fy', `${f.y}px`);
    body.style.setProperty('--flower', `${Math.max(30, 54 * f.k)}px`);
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

  /* ───────── 눈 ───────── */
  // 평소: 차가운 눈이 내려요 / Yophiel: 눈이 거의 멈춘 채 반짝여요 (아름다움이 시간을 붙잡듯)
  // Burning: 눈송이가 불씨로 바뀌어 위로 타올라요
  const Snow = (() => {
    const cv = $('#snow');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, list = [], last = 0, mode = 'idle', hush = 0, fire = 0;
    function resize() {
      const oW = W, oH = H;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (oW !== W || oH !== H) spread(oW, oH);
    }
    // 화면 크기가 바뀌면 같은 비율 자리로 옮겨요 (이전 크기가 없었으면 새로 흩뿌려요)
    function spread(oW, oH) {
      const move = (p) => {
        if (oW > 50 && oH > 50) { p.x *= W / oW; p.y *= H / oH; }
        else { p.x = Math.random() * W; p.y = Math.random() * H; }
      };
      list.forEach(move);
      embers.forEach(move);
    }
    const make = (edge) => ({
      x: Math.random() * W, y: edge ? (edge < 0 ? -10 - Math.random() * 60 : H + 10 + Math.random() * 60) : Math.random() * H,
      r: .6 + Math.random() * 2.2, v: 22 + Math.random() * 40, s: Math.random() * 6,
      a: .35 + Math.random() * .5, tw: Math.random() * 6, f: 1 + Math.random() * 2,
    });
    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, .05);
      last = t;
      // 모드가 바뀌면 부드럽게 따라가요
      hush += ((mode === 'yophiel' ? 1 : 0) - hush) * Math.min(1, dt * 2.2);
      fire += ((mode === 'burning' ? 1 : 0) - fire) * Math.min(1, dt * 2.6);
      ctx.clearRect(0, 0, W, H);
      // 눈(흰빛) → 불씨(주황빛)
      ctx.fillStyle = `rgb(255, ${Math.round(255 - fire * 140)}, ${Math.round(255 - fire * 215)})`;
      const fall = (1 - hush * .94) * (1 - fire * 2.2); // 1: 아래로, 거의 0: 멈춤, 음수: 위로
      list.forEach((p, i) => {
        p.s += dt;
        p.tw += dt * p.f;
        p.y += p.v * fall * dt;
        p.x += (-10 + Math.sin(p.s) * (14 + fire * 30)) * (1 - hush * .9) * dt;
        if (p.y > H + 80) list[i] = make(-1);
        else if (p.y < -80) list[i] = make(1);
        else if (p.x < -20) p.x = W + 10; else if (p.x > W + 20) p.x = -10;
        // 멈추면 반짝, 불씨면 일렁
        const glint = hush * Math.max(0, Math.sin(p.tw)) * .9;
        const flick = fire * (.5 + Math.sin(p.tw * 3) * .5);
        ctx.globalAlpha = Math.min(1, p.a * (1 - fire * .3) + glint + flick * .4);
        const r = p.r * (1 + glint * .8 + fire * .6);
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        if (glint > .5) { // 반짝이는 순간 십자 빛
          ctx.globalAlpha = (glint - .5) * 1.4;
          ctx.fillRect(p.x - r * 4, p.y - .4, r * 8, .8);
          ctx.fillRect(p.x - .4, p.y - r * 4, .8, r * 8);
        }
      });
      // Burning이면 크고 밝은 불씨가 화면 아래 전체에서 솟아올라요
      const shownE = Math.round(embers.length * fire);
      embers.forEach((e, i) => {
        e.s += dt;
        e.tw += dt * e.f;
        e.y -= e.v * dt;
        e.x += Math.sin(e.s * 1.7) * 26 * dt;
        if (e.y < -20) embers[i] = ember(true);
        if (i >= shownE) return;
        const life = Math.min(1, e.y / H + .25); // 위로 갈수록 사그라들어요
        const fl = .6 + Math.sin(e.tw * 4) * .4;
        ctx.globalAlpha = Math.max(0, life * fl * fire);
        ctx.fillStyle = '#ff6a2a';
        ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r, e.r * 1.9, Math.sin(e.s) * .4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffd08a'; // 가운데 심지
        ctx.beginPath(); ctx.ellipse(e.x, e.y + e.r * .3, e.r * .45, e.r * .9, 0, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(tick); else last = 0;
    }
    const ember = (bottom) => ({
      x: Math.random() * W, y: bottom ? H + 10 + Math.random() * 60 : Math.random() * H,
      r: 1.6 + Math.random() * 3.2, v: 60 + Math.random() * 110, s: Math.random() * 6, tw: Math.random() * 6, f: 1 + Math.random() * 2,
    });
    const embers = [];
    resize();
    if (!reduce) {
      for (let i = 0; i < 120; i++) list.push(make(0));
      for (let i = 0, n = W < 700 ? 60 : 110; i < n; i++) embers.push(ember(false));
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
