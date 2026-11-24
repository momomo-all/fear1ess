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
    junan: { face: [0.49, 0.25], line: '农今朝还要陪我伐？\n真个啊？', lang: 'zh-CN', wait: 'SCANNING…', done: 'S-CLASS SENTINEL · SMILE', href: 'junan.html' },
    jaeeun: { face: [0.745, 0.25], line: '왜 그렇게 긴장해요?\n…내가 뭐라도 할까봐?', wait: 'VERIFYING…', done: 'A-CLASS GUIDE · DIOR', href: 'jaeeun.html' },
  };
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 4200);

  /* ───────── 그림 비율 → 화면 좌표 (object-fit: cover로 잘린 만큼) ───────── */
  function onScreen([fx, fy]) {
    const box = still.getBoundingClientRect();
    const pos = getComputedStyle(still).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    const k = Math.max(box.width / 1216, box.height / 832);
    const ox = (box.width - 1216 * k) * pos[0];
    const oy = (box.height - 832 * k) * pos[1];
    return { x: box.left + ox + fx * 1216 * k, y: box.top + oy + fy * 832 * k, k };
  }

  /* ───────── 초점이 그 사람에게 ───────── */
  let world = 'idle';
  let leaveT;
  function setWorld(next) {
    clearTimeout(leaveT);
    if (next === world) return;
    let p = null;
    if (next !== 'idle') {
      p = onScreen(PEOPLE[next].face);
      body.style.setProperty('--px', `${p.x}px`);
      body.style.setProperty('--py', `${p.y}px`);
      body.style.setProperty('--spot', `${Math.max(130, 220 * p.k)}px`);
    }
    Dust.mode(next, p);
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
      h.style.setProperty('--hs', `${Math.max(80, 140 * p.k)}px`);
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
    if (who.lang) sceneLine.lang = who.lang; else sceneLine.removeAttribute('lang');
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

  /* ───────── 별, 무지갯빛 종이 조각, 홀로그램 지직, 금빛 반짝임 ───────── */
  // 평소: 밤하늘 별이 깜빡이고, 무지갯빛 종이 조각이 바람에 팔랑팔랑 흩날려요
  // SMILE(주난, 센티넬): 조각들이 보랏빛으로 물들어 빨라지고, 가끔 지직 하고 자리를 튀어요
  // DIOR(재은, 가이드): 조각들이 금빛으로 바뀌어 천천히 내려앉고, 그의 둘레에 금빛 별이 반짝여요
  const Dust = (() => {
    const cv = $('#air');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, stars = [], flecks = [], glints = [], last = 0, mode = 'idle', at = null, buzz = 0, gold = 0, glintT = 0;
    function resize() {
      const oW = W, oH = H;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (oW > 50 && oH > 50 && (oW !== W || oH !== H)) [...stars, ...flecks].forEach((p) => { p.x *= W / oW; p.y *= H / oH; });
    }
    const R = Math.random;
    const star = () => ({ x: R() * W, y: R() * H * .45, r: .5 + R() * 1.1, tw: R() * 6, sp: .6 + R() * 1.6 });
    const fleck = (top) => ({
      x: R() * W * 1.2 - W * .1, y: top ? -20 - R() * 80 : R() * H,
      w: 3 + R() * 5, h: 2 + R() * 4, v: 12 + R() * 22, drift: 8 + R() * 20,
      rot: R() * Math.PI * 2, spin: (R() - .5) * 3, flip: R() * 6, s: R() * 6, hue: R() * 360,
    });
    // 네 갈래로 반짝이는 별
    function drawGlint(x, y, len) {
      ctx.beginPath();
      ctx.moveTo(x - len, y); ctx.lineTo(x + len, y);
      ctx.moveTo(x, y - len); ctx.lineTo(x, y + len);
      ctx.stroke();
    }
    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, .05);
      last = t;
      const sec = t / 1000;
      buzz += ((mode === 'junan' ? 1 : 0) - buzz) * Math.min(1, dt * 2.4);
      gold += ((mode === 'jaeeun' ? 1 : 0) - gold) * Math.min(1, dt * 2.4);
      ctx.clearRect(0, 0, W, H);

      // 별: 재은에게 닿으면 조금 더 또렷하게
      ctx.fillStyle = '#eef0ff';
      stars.forEach((s) => {
        ctx.globalAlpha = (.25 + .55 * (.5 + .5 * Math.sin(sec * s.sp + s.tw))) * (1 + gold * .4);
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });

      // 종이 조각: 뒤집힐 때마다 빛을 받아 반짝여요
      const speed = (1 + buzz * .9) * (1 - gold * .55);
      flecks.forEach((p, i) => {
        p.y += p.v * speed * dt;
        p.x += (Math.sin(sec * .7 + p.s) * p.drift - 6 + buzz * 30) * speed * dt;
        p.rot += p.spin * speed * dt;
        p.flip += 2 * speed * dt;
        // 주난: 가끔 지직 하고 옆으로 튀어요
        if (buzz > .3 && R() < .012 * buzz) p.x += (R() - .5) * 24;
        if (p.y > H + 30 || p.x > W + 40 || p.x < -60) flecks[i] = fleck(true);
        const face = Math.abs(Math.sin(p.flip));
        const hue = (p.hue + sec * 20) % 360;
        const purple = 262 + Math.sin(p.hue) * 28;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, .2 + .8 * face);
        ctx.globalAlpha = (.35 + .55 * face) * (1 - gold * .15);
        if (gold > .5) ctx.fillStyle = `hsl(${42 + Math.sin(p.hue) * 6}, ${70 + 20 * face}%, ${55 + 30 * face}%)`;
        else if (buzz > .5) ctx.fillStyle = `hsl(${purple}, 95%, ${62 + 25 * face}%)`;
        else ctx.fillStyle = `hsl(${hue}, 80%, ${80 + 15 * face}%)`;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      // 재은: 그의 둘레에 금빛 별이 하나씩 반짝였다 사라져요
      if (mode === 'jaeeun' && at) {
        glintT -= dt;
        if (glintT <= 0) {
          const a = R() * Math.PI * 2, d = 60 + R() * 140;
          glints.push({ x: at.x + Math.cos(a) * d, y: at.y + Math.sin(a) * d * .8, life: 0, len: 5 + R() * 7 });
          glintT = .22;
        }
      }
      glints = glints.filter((g) => g.life < 1);
      ctx.strokeStyle = '#ffe3a0';
      ctx.lineWidth = 1.3;
      glints.forEach((g) => {
        g.life += dt / 1.1;
        ctx.globalAlpha = Math.sin(g.life * Math.PI);
        drawGlint(g.x, g.y, g.len * (.6 + .4 * Math.sin(g.life * Math.PI)));
      });

      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(tick); else last = 0;
    }
    resize();
    if (!reduce) {
      for (let i = 0, n = W < 700 ? 40 : 90; i < n; i++) stars.push(star());
      for (let i = 0, n = W < 700 ? 26 : 50; i < n; i++) flecks.push(fleck(false));
      requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) requestAnimationFrame(tick); });
    addEventListener('resize', resize);
    return { mode: (m, p) => { mode = m; at = p; if (m === 'jaeeun') glintT = 0; } };
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
