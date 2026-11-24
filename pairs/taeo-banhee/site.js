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
    taeo: { face: [0.30, 0.27], line: '실컷 놀다 와, 버니.\n네 뒤는 내가 맡을 테니까.', wait: 'SYNCING…', done: 'A-CLASS GUIDE · LUCA', href: 'taeo.html' },
    banhee: { face: [0.435, 0.25], line: '흐흥,\n그건 제 잔상입니다만.', wait: 'TRACKING…', done: 'S-CLASS SENTINEL · BURST', href: 'banhee.html' },
  };
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 4600);

  // 필름 날짜 도장: chat.js의 since를 '26 10 22 처럼 찍어요
  if (window.PAIR_CHAT) {
    const [y, mo, d] = window.PAIR_CHAT.since.split('-');
    $('#stamp').textContent = `'${y.slice(2)} ${mo} ${d}`;
  }

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
      body.style.setProperty('--spot', `${Math.max(110, 170 * p.k)}px`);
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
      h.style.setProperty('--hs', `${Math.max(70, 110 * p.k)}px`);
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

  /* ───────── 영사기 빛 속 먼지, 필름 티끌과 스크래치 ───────── */
  // 평소: 빛 속 먼지가 천천히 떠다니고, 필름 티끌이 한 프레임씩 번쩍, 가끔 세로 스크래치가 지나가요
  // LUCA(태오, 가이드): 티끌과 스크래치가 멎고, 먼지가 푸른빛으로 느려져 그의 곁으로 천천히 모여요
  // BURST(반희, 센티넬): 먼지가 분홍빛으로 빠르게 스쳐 지나가며 꼬리처럼 잔상을 남겨요
  const Dust = (() => {
    const cv = $('#air');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, motes = [], scratches = [], last = 0, mode = 'idle', at = null, calm = 0, rush = 0, scratchT = 3;
    function resize() {
      const oW = W, oH = H;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (oW > 50 && oH > 50 && (oW !== W || oH !== H)) motes.forEach((p) => { p.x *= W / oW; p.y *= H / oH; });
    }
    const R = Math.random;
    const mote = () => ({
      x: R() * W, y: R() * H, r: .5 + R() * 1.8,
      vx: (R() - .5) * 10, vy: (R() - .5) * 8 - 2,
      tw: R() * 6, sp: .5 + R() * 1.4, s: R() * 6,
    });
    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, .05);
      last = t;
      const sec = t / 1000;
      calm += ((mode === 'taeo' ? 1 : 0) - calm) * Math.min(1, dt * 2.4);
      rush += ((mode === 'banhee' ? 1 : 0) - rush) * Math.min(1, dt * 2.4);
      ctx.clearRect(0, 0, W, H);

      // 빛 속 먼지
      const speed = (1 - calm * .7) * (1 + rush * 5);
      motes.forEach((p) => {
        p.x += (p.vx + Math.sin(sec * .6 + p.s) * 4 + rush * 26) * speed * dt;
        p.y += (p.vy + Math.cos(sec * .5 + p.s) * 3) * speed * dt * (1 - rush * .7);
        // 태오: 그의 곁으로 아주 천천히 모여요
        if (calm > .05 && at) {
          p.x += (at.x - p.x) * .12 * calm * dt;
          p.y += (at.y - p.y) * .12 * calm * dt;
        }
        if (p.x > W + 20) p.x = -20; else if (p.x < -20) p.x = W + 20;
        if (p.y > H + 20) p.y = -20; else if (p.y < -20) p.y = H + 20;
        const a = (.2 + .5 * (.5 + .5 * Math.sin(sec * p.sp + p.tw))) * (1 + calm * .5);
        const col = rush > .5 ? `255, ${170 + 40 * (1 - rush)}, 212` : calm > .5 ? '196, 222, 255' : '255, 244, 228';
        // 반희: 지나간 자리에 잔상이 남아요
        if (rush > .2) {
          for (let k = 3; k >= 1; k--) {
            ctx.fillStyle = `rgba(${col}, ${a * rush * (.32 - k * .08)})`;
            ctx.beginPath(); ctx.arc(p.x - k * 9 * rush, p.y, p.r, 0, Math.PI * 2); ctx.fill();
          }
        }
        ctx.fillStyle = `rgba(${col}, ${a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });

      // 필름 티끌: 한 프레임만 번쩍 (태오에게 닿아 있으면 멎어요)
      const dirt = 1 - calm;
      if (dirt > .3 && R() < .1 * dirt) {
        ctx.fillStyle = R() < .5 ? 'rgba(10, 8, 6, .5)' : 'rgba(255, 250, 240, .4)';
        ctx.beginPath(); ctx.arc(R() * W, R() * H, .8 + R() * 1.8, 0, Math.PI * 2); ctx.fill();
      }
      if (dirt > .3 && R() < .015 * dirt) { // 머리카락 같은 실오라기
        const x = R() * W, y = R() * H;
        ctx.strokeStyle = 'rgba(10, 8, 6, .35)'; ctx.lineWidth = .8;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 14, y - 10, x + 6 + R() * 20, y + 12); ctx.stroke();
      }

      // 세로 스크래치: 몇 초에 한 번, 잠깐 머물다 사라져요
      scratchT -= dt;
      if (scratchT <= 0) {
        if (dirt > .5) scratches.push({ x: R() * W, life: 0, dur: .4 + R() * .9, w: .6 + R() * .8 });
        scratchT = 3 + R() * 6;
      }
      scratches = scratches.filter((s) => s.life < s.dur);
      scratches.forEach((s) => {
        s.life += dt;
        s.x += (R() - .5) * 1.4;
        ctx.globalAlpha = (R() < .25 ? .08 : .2) * dirt;
        ctx.fillStyle = '#fff6ea';
        ctx.fillRect(s.x, 0, s.w, H);
      });

      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(tick); else last = 0;
    }
    resize();
    if (!reduce) {
      for (let i = 0, n = W < 700 ? 36 : 80; i < n; i++) motes.push(mote());
      requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) requestAnimationFrame(tick); });
    addEventListener('resize', resize);
    return { mode: (m, p) => { mode = m; at = p; } };
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
