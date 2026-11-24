(() => {
  const $ = (s) => document.querySelector(s);
  // 바이닐 화면 안(iframe)에서 열렸으면 기록을 쌓지 않고 이동해요 (안 그러면 ‹ Fearless가 바이닐로 안 나가요)
  const embedded = window.top !== window;
  const go = (href) => (embedded ? location.replace(href) : (location.href = href));
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  const still = $('.still.past');

  // 두 사람: 과거 그림 속 얼굴 자리(1216×832 비율), 지금 그림 속 얼굴 자리(now), 대사, 신원 확인 문구
  const PEOPLE = {
    hwi: { face: [0.52, 0.27], now: [0.63, 0.25], line: '피어 있는 동안은\n전부 네 거야.', wait: 'SUPPORT LINKING…', done: 'S-CLASS GUIDE · GLORY', href: 'hwi.html' },
    hyunwoo: { face: [0.72, 0.3], now: [0.7, 0.38], line: '꿇어, 그렇지.', wait: 'SYNC CHECK…', done: 'S-CLASS SENTINEL · PRIDE', href: 'hyunwoo.html' },
  };
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 4000);

  /* ───────── 그림 비율 → 화면 좌표 (object-fit: cover로 잘린 만큼) ───────── */
  function onScreen([fx, fy], img = still) {
    const box = img.getBoundingClientRect();
    const pos = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    const k = Math.max(box.width / 1216, box.height / 832);
    const ox = (box.width - 1216 * k) * pos[0];
    const oy = (box.height - 832 * k) * pos[1];
    return { x: box.left + ox + fx * 1216 * k, y: box.top + oy + fy * 832 * k, k };
  }

  /* ───────── 스무 살 → 서른하나 ───────── */
  let world = 'idle';
  let leaveT;
  function setWorld(next) {
    clearTimeout(leaveT);
    if (next === world) return;
    Motes.mode(next);
    world = next;
    body.dataset.world = next;
    body.classList.toggle('lit-on', next !== 'idle');
    if (next === 'idle') { wipeTo(0, () => { delete body.dataset.shown; }); return; }
    if (body.dataset.shown !== next) { // 다른 사람 그림이 떠 있었으면 과거로 돌렸다가 다시 타들어 가요
      setW(0);
      body.dataset.shown = next;
    }
    placeFocus();
    wipeTo(1);
  }

  /* ───────── 필름이 타들어 가듯: 빛줄기가 쓸고 간 자리에 지금이, 나이는 20 → 31 ───────── */
  const ageNum = $('#ageNum');
  let w = 0, wipeRaf = 0;
  function setW(v) {
    w = v;
    body.style.setProperty('--w', v.toFixed(4));
    body.style.setProperty('--leak', Math.sin(Math.PI * v).toFixed(4));
    const age = String(Math.round(20 + 11 * v));
    if (ageNum.textContent !== age) {
      ageNum.textContent = age;
      ageNum.classList.remove('tick');
      void ageNum.offsetWidth; // 숫자가 바뀔 때마다 다시 튀게
      ageNum.classList.add('tick');
    }
  }
  function wipeTo(goal, done) {
    cancelAnimationFrame(wipeRaf);
    if (reduce) { setW(goal); done?.(); return; }
    const from = w;
    const dur = Math.max(250, (goal ? 1500 : 800) * Math.abs(goal - from));
    const t0 = performance.now();
    const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      setW(from + (goal - from) * ease(t));
      if (t < 1) wipeRaf = requestAnimationFrame(step); else done?.();
    };
    wipeRaf = requestAnimationFrame(step);
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
  // 지금 그림이 다 드러나면 나머지는 가라앉고 그 사람 얼굴에만 노을빛이 남아요
  function placeFocus() {
    const who = body.dataset.shown;
    if (!who) return;
    const p = onScreen(PEOPLE[who].now, $('.still.now-' + who));
    body.style.setProperty('--fx', `${p.x}px`);
    body.style.setProperty('--fy', `${p.y}px`);
    body.style.setProperty('--fr', `${Math.max(140, 230 * p.k)}px`);
  }
  placeFaces();
  addEventListener('resize', () => { placeFaces(); placeFocus(); });

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
  // 공문 ①은 승인 → (7년 뒤) 破棄 → 현우의 볼펜 → 누구 마음대로. 순서로 이어져요
  const first = $('#notice1');
  new IntersectionObserver((entries, io) => {
    if (!entries.some((en) => en.isIntersecting)) return;
    io.disconnect();
    first.classList.add('stamped');
    setTimeout(() => first.classList.add('voided'), reduce ? 0 : 1300);
    setTimeout(() => first.classList.add('scribbled'), reduce ? 0 : 2300);
  }, { threshold: 0.9, rootMargin: '0px 0px -12% 0px' }).observe(first.querySelector('.nt-stamp'));

  /* ───────── 공문 더미: 누를 때마다 맨 위 장이 들려서 맨 뒤로 ───────── */
  const stack = $('#stack');
  const sheets = [...stack.querySelectorAll('.notice')];
  const BACK = 'translate(16px, 20px) rotate(1.6deg)';
  let topIdx = 0, flipping = false;
  function arrange() {
    sheets.forEach((s, i) => {
      const front = i === topIdx;
      s.classList.toggle('front', front);
      s.classList.toggle('back', !front);
      s.tabIndex = front ? 0 : -1;
      s.setAttribute('aria-hidden', front ? 'false' : 'true');
    });
    $('#stackPage').textContent = `${topIdx + 1} / ${sheets.length}`;
  }
  arrange();
  function flip(byKey) {
    if (flipping) return;
    flipping = true;
    const cur = sheets[topIdx];
    const next = sheets[(topIdx + 1) % sheets.length];
    const done = () => {
      flipping = false;
      // 뒤에 있던 공문은 처음 앞으로 나왔을 때 직인이 쿵
      if (!next.classList.contains('stamped')) next.classList.add('stamped');
      if (byKey) next.focus({ preventScroll: true }); // 키보드로 넘겼을 때만 포커스를 옮겨요
    };
    if (reduce) { topIdx = (topIdx + 1) % sheets.length; arrange(); done(); return; }
    // 맨 위 장: 왼쪽 위로 들렸다가 → 맨 뒤로 들어가요
    cur.animate([
      { transform: 'none' },
      { transform: 'translate(-62%, -5%) rotate(-10deg)', offset: .45 },
      { transform: BACK },
    ], { duration: 950, easing: 'cubic-bezier(.45, 0, .25, 1)' });
    // 뒷장: 앞으로 올라와요
    next.animate([
      { transform: BACK, filter: 'brightness(.94)' },
      { transform: 'none', filter: 'none' },
    ], { duration: 650, delay: 280, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' });
    setTimeout(() => { topIdx = (topIdx + 1) % sheets.length; arrange(); }, 430); // 들린 장이 가장 멀리 갔을 때 순서를 바꿔요
    setTimeout(done, 960);
  }
  stack.addEventListener('click', (e) => { if (!getSelection().toString()) flip(false); });
  stack.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(true); }
  });

  /* ───────── 떠다니는 것들 ───────── */
  // 평소: 오후 햇살 속 먼지 / 휘: 보랏빛 나팔꽃잎이 피었다가 금세 져요 (덧없는 영광)
  // 현우: 담배 연기가 피어오르고 불티가 튀어요
  const Motes = (() => {
    const cv = $('#motes');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, last = 0, mode = 'idle', g = 0, p = 0;
    const dust = [], petals = [], smoke = [], sparks = [];
    function resize() {
      const oW = W, oH = H;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // 화면 크기가 바뀌면 같은 비율 자리로 옮겨요
      if (oW > 50 && oH > 50 && (oW !== W || oH !== H)) {
        [dust, petals, smoke, sparks].forEach((l) => l.forEach((o) => { o.x *= W / oW; o.y *= H / oH; }));
      }
    }
    const rnd = (a, b) => a + Math.random() * (b - a);
    const mote = (y) => ({ x: rnd(0, W), y: y ?? rnd(0, H), r: rnd(.6, 2), v: rnd(4, 12), s: rnd(0, 6), a: rnd(.2, .6) });
    // 꽃잎: 위에서 떨어지며 돌고, 수명이 다하면 시들어 사라져요
    const petal = (top) => ({ x: rnd(-40, W + 40), y: top ? rnd(-80, -10) : rnd(0, H), r: rnd(5, 11), v: rnd(28, 60), s: rnd(0, 6), rot: rnd(0, 6.3), vr: rnd(-1.4, 1.4), life: top ? 0 : rnd(0, 1), span: rnd(4, 8), hue: rnd(250, 290) });
    const puff = (bottom) => ({ x: rnd(0, W), y: bottom ? H + rnd(20, 120) : rnd(0, H), r: rnd(40, 110), v: rnd(14, 34), s: rnd(0, 6), a: rnd(.05, .12) });
    const spark = (bottom) => ({ x: rnd(0, W), y: bottom ? H + rnd(5, 60) : rnd(0, H), r: rnd(.8, 2.2), v: rnd(40, 110), s: rnd(0, 6), tw: rnd(0, 6) });

    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, .05);
      last = t;
      g += ((mode === 'hwi' ? 1 : 0) - g) * Math.min(1, dt * 2.4);
      p += ((mode === 'hyunwoo' ? 1 : 0) - p) * Math.min(1, dt * 2.4);
      const calm = 1 - Math.max(g, p);
      ctx.clearRect(0, 0, W, H);

      // 햇살 먼지
      ctx.fillStyle = '#ffe2b0';
      dust.forEach((d, i) => {
        d.s += dt;
        d.y -= d.v * dt;
        d.x += Math.sin(d.s * .7) * 8 * dt;
        if (d.y < -10) dust[i] = mote(H + 10);
        ctx.globalAlpha = d.a * (.25 + calm * .75) * (.6 + Math.sin(d.s * 2) * .4);
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      });

      // 휘: 나팔꽃잎
      if (g > .01) {
        petals.forEach((q, i) => {
          q.s += dt; q.rot += q.vr * dt; q.life += dt / q.span;
          q.y += q.v * dt;
          q.x += Math.sin(q.s * 1.3) * 22 * dt;
          if (q.life > 1 || q.y > H + 30) { petals[i] = petal(true); return; }
          // 피었다(0→.15) 머물다 시들어요(.6→1)
          const bloom = Math.min(1, q.life / .15);
          const wilt = q.life < .6 ? 1 : 1 - (q.life - .6) / .4;
          const r = q.r * (.4 + bloom * .6) * (.7 + wilt * .3);
          ctx.save();
          ctx.translate(q.x, q.y); ctx.rotate(q.rot);
          ctx.globalAlpha = g * wilt * .85;
          const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
          grd.addColorStop(0, '#fff6fb');
          grd.addColorStop(.35, `hsl(${q.hue} 70% 78%)`);
          grd.addColorStop(1, `hsl(${q.hue} 62% ${52 - (1 - wilt) * 14}%)`);
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.ellipse(0, 0, r, r * .62, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });
      }

      // 현우: 연기와 불티
      if (p > .01) {
        smoke.forEach((m, i) => {
          m.s += dt;
          m.y -= m.v * dt;
          m.x += Math.sin(m.s * .5) * 12 * dt;
          m.r += dt * 6;
          if (m.y < -m.r) { smoke[i] = puff(true); return; }
          const grd = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
          grd.addColorStop(0, 'rgba(225, 220, 228, 1)');
          grd.addColorStop(1, 'rgba(225, 220, 228, 0)');
          ctx.globalAlpha = m.a * p * Math.min(1, m.y / H + .3);
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
        });
        sparks.forEach((e, i) => {
          e.s += dt; e.tw += dt * 5;
          e.y -= e.v * dt;
          e.x += Math.sin(e.s * 2) * 18 * dt;
          if (e.y < -10) { sparks[i] = spark(true); return; }
          ctx.globalAlpha = p * Math.min(1, e.y / H + .2) * (.55 + Math.sin(e.tw) * .45);
          ctx.fillStyle = '#ffb347';
          ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
        });
      }
      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(tick); else last = 0;
    }
    resize();
    if (!reduce) {
      const small = W < 700;
      for (let i = 0; i < (small ? 40 : 70); i++) dust.push(mote());
      for (let i = 0; i < (small ? 26 : 46); i++) petals.push(petal(false));
      for (let i = 0; i < (small ? 10 : 18); i++) smoke.push(puff(false));
      for (let i = 0; i < (small ? 30 : 55); i++) sparks.push(spark(false));
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
