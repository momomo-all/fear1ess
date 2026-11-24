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
    domin: { face: [0.27, 0.38], line: '미래 같은 건,\n바꾸면 그만이야.', wait: 'VERIFYING…', done: 'S-CLASS SENTINEL · TOMA', href: 'domin.html' },
    baekhyun: { face: [0.41, 0.26], line: '더 숨겨봐.\n네 숨, 내가 다 들춰낼 테니까.', wait: 'SCANNING…', done: 'S-CLASS SENTINEL · CHERVIL', href: 'baekhyun.html' },
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

  /* ───────── 조준선: 백현의 얼굴에 맞춰 둬요 ───────── */
  function drawMarks() {
    const b = onScreen(PEOPLE.baekhyun.face);
    body.style.setProperty('--bx', `${b.x}px`);
    body.style.setProperty('--by', `${b.y}px`);
    body.style.setProperty('--scope', `${Math.max(160, 250 * b.k)}px`);
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

  /* ───────── 궤도의 별 ───────── */
  // 평소: 별이 반짝이며 아주 천천히 흘러가요
  // TOMA: 별들이 도민을 축으로 감기며 궤적을 남겨요 (시간을 돌려 감듯)
  // CHERVIL: 별이 초록으로 물들고, 백현에게서 숨결 같은 파동이 퍼져요
  const Dust = (() => {
    const cv = $('#sky');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, list = [], rings = [], last = 0, mode = 'idle', spin = 0, scan = 0, ringT = 0;
    let cx = 0, cy = 0, bx = 0, by = 0;
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      aim();
    }
    function aim() {
      const d = onScreen(PEOPLE.domin.face);
      const b = onScreen(PEOPLE.baekhyun.face);
      cx = d.x; cy = d.y; bx = b.x; by = b.y;
    }
    const make = () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: .4 + Math.random() * 1.5, a: .3 + Math.random() * .6,
      tw: Math.random() * 6, f: .6 + Math.random() * 2.4,
      warm: Math.random() < .2,
    });
    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, .05);
      last = t;
      spin += ((mode === 'domin' ? 1 : 0) - spin) * Math.min(1, dt * 2.2);
      scan += ((mode === 'baekhyun' ? 1 : 0) - scan) * Math.min(1, dt * 2.6);
      // 궤적이 남도록 지우지 않고 살짝만 덮어요
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0, 0, 0, ${.05 + (1 - spin) * .95})`;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      const w = spin * .9; // 도민을 축으로 도는 빠르기 (rad/s)
      const cos = Math.cos(w * dt), sin = Math.sin(w * dt);
      list.forEach((p) => {
        p.tw += dt * p.f;
        const ox = p.x, oy = p.y;
        if (spin > .01) {
          const dx = p.x - cx, dy = p.y - cy;
          p.x = cx + dx * cos - dy * sin;
          p.y = cy + dx * sin + dy * cos;
        } else {
          p.x -= 3 * dt; // 평소: 궤도를 따라 아주 천천히
          if (p.x < -10) p.x = W + 10;
        }
        const tw = .55 + Math.sin(p.tw) * .45;
        ctx.globalAlpha = p.a * tw * (1 + spin * .4);
        const g = Math.round(255 - scan * 40), rb = Math.round(255 - scan * 150);
        ctx.fillStyle = p.warm && !scan ? '#ffd2c2' : `rgb(${rb}, ${g}, ${Math.round(rb * .9 + scan * 30)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + spin * .7), 0, Math.PI * 2); ctx.fill();
        if (spin > .05) { // 지나온 자리에 궤적 선
          ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = p.r * 1.3; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(p.x, p.y); ctx.stroke();
        }
      });
      // 백현의 숨결: 초록 동심원이 퍼져나가요
      if (mode === 'baekhyun') {
        ringT -= dt;
        if (ringT <= 0) { rings.push({ r: 20, a: .7 }); ringT = 1.1; }
      }
      rings = rings.filter((rg) => rg.a > .01);
      rings.forEach((rg) => {
        rg.r += dt * 160;
        rg.a *= Math.pow(.42, dt);
        ctx.globalAlpha = rg.a * scan;
        ctx.strokeStyle = '#4dff7c';
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(bx, by, rg.r, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(tick); else last = 0;
    }
    resize();
    if (!reduce) {
      for (let i = 0, n = W < 700 ? 110 : 220; i < n; i++) list.push(make());
      requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) requestAnimationFrame(tick); });
    addEventListener('resize', () => { resize(); list.forEach((p) => { if (p.x > W || p.y > H) Object.assign(p, make()); }); });
    return { mode: (m) => { aim(); mode = m; if (m === 'baekhyun') ringT = 0; } };
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
