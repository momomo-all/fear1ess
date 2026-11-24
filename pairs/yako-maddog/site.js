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
    yako: { face: [0.7, 0.2], line: 'まあまるでお目出度いですね、\n無理しない方がよろしいですのに', lang: 'ja', wait: '照合中…', done: 'S-CLASS SENTINEL · 野狐', href: 'yako.html' },
    maddog: { face: [0.8, 0.4], line: '내가 길들여졌다고\n생각하면 곤란한데.', wait: 'IDENTIFYING…', done: 'S-CLASS SENTINEL · MAD DOG', href: 'maddog.html' },
  };
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 3400);

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

  /* ───────── 별, 꽃가루 빛, 여우불, 핏빛 불티 ───────── */
  // 평소: 별이 깜빡이고, 꽃밭에서 꽃가루 같은 작은 빛이 천천히 떠올라요
  // 야코(들여우): 빛이 푸르스름해지고, 그의 둘레에 여우불이 하나씩 피어 흔들리며 올라가요
  // 매드독(들개): 빛이 핏빛 불티로 바뀌어 빠르게 튀어 오르고, 가끔 확 흩어져요
  const Dust = (() => {
    const cv = $('#air');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, stars = [], motes = [], fires = [], last = 0, mode = 'idle', at = null, fox = 0, dog = 0, fireT = 0;
    function resize() {
      const oW = W, oH = H;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (oW > 50 && oH > 50 && (oW !== W || oH !== H)) [...stars, ...motes].forEach((p) => { p.x *= W / oW; p.y *= H / oH; });
    }
    const R = Math.random;
    const star = () => ({ x: R() * W, y: R() * H * .6, r: .4 + R() * 1.1, tw: R() * 6, sp: .5 + R() * 1.6 });
    const mote = (bottom) => ({
      x: R() * W, y: bottom ? H + 10 + R() * 60 : R() * H,
      r: .8 + R() * 1.8, v: 8 + R() * 16, drift: 6 + R() * 16, s: R() * 6, tw: R() * 6,
    });
    // 여우불: 아래가 둥글고 위로 갈수록 가늘어지는 푸른 불꽃
    function drawFire(f) {
      const a = Math.sin(f.life * Math.PI) * (.75 + .25 * Math.sin(f.life * 30 + f.s));
      const sz = f.size * (.7 + .3 * Math.sin(f.life * Math.PI));
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(Math.sin(f.life * 6 + f.s) * .18);
      ctx.globalAlpha = a;
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 2.6);
      g.addColorStop(0, 'rgba(70, 150, 255, .75)');
      g.addColorStop(1, 'rgba(40, 90, 255, 0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, sz * 2.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(200, 235, 255, .95)'; ctx.shadowColor = 'rgba(60, 140, 255, 1)'; ctx.shadowBlur = sz * 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -sz * 2.2);
      ctx.bezierCurveTo(sz * .9, -sz * .9, sz, sz * .2, 0, sz);
      ctx.bezierCurveTo(-sz, sz * .2, -sz * .9, -sz * .9, 0, -sz * 2.2);
      ctx.fill();
      ctx.restore();
    }
    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, .05);
      last = t;
      const sec = t / 1000;
      fox += ((mode === 'yako' ? 1 : 0) - fox) * Math.min(1, dt * 2.4);
      dog += ((mode === 'maddog' ? 1 : 0) - dog) * Math.min(1, dt * 2.4);
      ctx.clearRect(0, 0, W, H);

      // 별: 매드독에게 닿으면 조금 가라앉아요
      ctx.fillStyle = '#eef3ff';
      stars.forEach((s) => {
        ctx.globalAlpha = (.25 + .55 * (.5 + .5 * Math.sin(sec * s.sp + s.tw))) * (1 - dog * .4);
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });

      // 꽃가루 빛: 위로 천천히, 매드독이면 빠르게 튀어 올라요
      const speed = 1 + dog * 2.6 - fox * .3;
      ctx.globalCompositeOperation = 'lighter';
      motes.forEach((p, i) => {
        p.y -= p.v * speed * dt;
        p.x += Math.sin(sec * .8 + p.s) * p.drift * dt + (dog > .3 && R() < .02 * dog ? (R() - .5) * 18 : 0);
        if (p.y < -20 || p.x < -30 || p.x > W + 30) motes[i] = mote(true);
        const glow = .5 + .5 * Math.sin(sec * 2 + p.tw);
        const r = p.r * (1 + dog * .3);
        ctx.globalAlpha = .3 + .6 * glow;
        if (dog > .5) ctx.fillStyle = `rgba(255, ${70 + 80 * glow}, ${60 + 30 * glow}, 1)`;
        else if (fox > .5) ctx.fillStyle = `rgba(${150 + 60 * glow}, 225, 255, 1)`;
        else ctx.fillStyle = `rgba(235, 245, ${220 + 35 * glow}, 1)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      });

      // 야코: 그의 둘레에 여우불이 하나씩 피어올라요
      if (mode === 'yako' && at) {
        fireT -= dt;
        if (fireT <= 0) {
          const a = R() * Math.PI * 2, d = 130 + R() * 200;
          fires.push({ x: at.x + Math.cos(a) * d, y: at.y + Math.sin(a) * d * .7, life: 0, size: 7 + R() * 6, s: R() * 6, dur: 1.8 + R() * 1.2 });
          fireT = .26;
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      fires = fires.filter((f) => f.life < 1);
      fires.forEach((f) => {
        f.life += dt / f.dur;
        f.y -= 18 * dt;
        f.x += Math.sin(f.life * 5 + f.s) * 10 * dt;
        drawFire(f);
      });

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(tick); else last = 0;
    }
    resize();
    if (!reduce) {
      for (let i = 0, n = W < 700 ? 50 : 110; i < n; i++) stars.push(star());
      for (let i = 0, n = W < 700 ? 24 : 46; i < n; i++) motes.push(mote(false));
      requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) requestAnimationFrame(tick); });
    addEventListener('resize', resize);
    return { mode: (m, p) => { mode = m; at = p; if (m === 'yako') fireT = 0; } };
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
      // [[이름]]은 검게 가려 두고, 누르면 보여요
      m.text.split(/\[\[(.+?)\]\]/).forEach((part, j) => {
        if (!(j % 2)) { if (part) b.appendChild(document.createTextNode(part)); return; }
        const r = document.createElement('button');
        r.type = 'button';
        r.className = 'redact';
        r.textContent = part;
        r.setAttribute('aria-label', '가려진 이름, 눌러서 보기');
        r.addEventListener('click', () => { r.classList.add('open'); r.removeAttribute('aria-label'); }, { once: true });
        b.appendChild(r);
      });
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
