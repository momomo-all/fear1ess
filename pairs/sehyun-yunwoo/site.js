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
    sehyun: { face: [0.205, 0.33], line: '비키세요,\n상대하고 싶지 않습니다.', wait: 'FOCUSING…', done: 'S-CLASS GUIDE · X', af: 'AF-LOCK · X', href: 'sehyun.html' },
    yunwoo: { face: [0.285, 0.2], line: '살아 돌아왔으면 됐지,\n뭘 그렇게 의미를 둬.', wait: 'FOCUSING…', done: 'S-CLASS SENTINEL · SIEG', af: 'AF-LOCK · SIEG', href: 'yunwoo.html' },
  };
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 5400);

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
  const afText = $('#afText');
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
    afText.textContent = next === 'idle' ? 'AF · SEARCHING' : PEOPLE[next].af;
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
      h.style.setProperty('--hs', `${Math.max(70, 110 * p.k)}px`); // 두 얼굴이 가까워서 작게
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

  /* ───────── 빛망울, 흰 꽃잎, 가이딩 물결, 금빛 반짝임 ───────── */
  // 평소: 꿈결 같은 햇살 빛망울이 둥실 떠오르고, 흰 장미 꽃잎이 팔랑팔랑 내려앉아요
  // X(세현, 가이드): 꽃잎이 느릿하게 잦아들고, 그에게서 푸른 가이딩 물결이 잔잔히 번져요
  // SIEG(윤우, 센티넬): 햇살이 금빛으로 짙어지며 빛망울이 반짝이고, 꽃잎은 바람에 실려 날려요
  // 뷰파인더 구석의 녹화 시간(타임코드)도 여기서 흘러가요
  const Dust = (() => {
    const cv = $('#air');
    const ctx = cv.getContext('2d');
    const tc = $('#tc');
    const t0 = performance.now();
    let W = 0, H = 0, orbs = [], petals = [], rings = [], last = 0, mode = 'idle', at = null, calm = 0, sun = 0, ringT = 0, lastTc = '';
    function resize() {
      const oW = W, oH = H;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (oW > 50 && oH > 50 && (oW !== W || oH !== H)) [...orbs, ...petals].forEach((p) => { p.x *= W / oW; p.y *= H / oH; });
    }
    const R = Math.random;
    const orb = (fresh) => ({
      x: R() * W, y: fresh ? H + 20 + R() * 60 : R() * H,
      r: 3 + R() * 10, v: 4 + R() * 10, s: R() * 6, a: .14 + R() * .3, tw: R() * 6,
    });
    const petal = (top) => ({
      x: R() * W * 1.2 - W * .1, y: top ? -20 - R() * 80 : R() * H,
      size: 5 + R() * 6, v: 14 + R() * 18, drift: 10 + R() * 22,
      rot: R() * Math.PI * 2, spin: (R() - .5) * 1.6, flip: R() * 6, s: R() * 6,
    });
    // 꽃잎 한 장: 끝이 둥근 물방울 모양, 뒤집히며 팔랑여요
    function drawPetal(p) {
      const s = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, .35 + .65 * Math.abs(Math.sin(p.flip)));
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * .95, -s * .55, s * .7, s * .85, 0, s);
      ctx.bezierCurveTo(-s * .7, s * .85, -s * .95, -s * .55, 0, -s);
      ctx.fill();
      ctx.restore();
    }
    // 반짝이는 별빛 (네 갈래)
    function drawGlint(x, y, len) {
      ctx.beginPath();
      ctx.moveTo(x - len, y); ctx.lineTo(x + len, y);
      ctx.moveTo(x, y - len); ctx.lineTo(x, y + len);
      ctx.stroke();
    }
    function timecode(now) {
      const f = Math.floor((now - t0) / (1000 / 24));
      const ff = f % 24, s = Math.floor(f / 24) % 60, m = Math.floor(f / 1440) % 60, h = Math.floor(f / 86400);
      const txt = [h, m, s, ff].map((n) => String(n).padStart(2, '0')).join(':');
      if (txt !== lastTc) { tc.textContent = txt; lastTc = txt; }
    }
    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, .05);
      last = t;
      const sec = t / 1000;
      timecode(t);
      calm += ((mode === 'sehyun' ? 1 : 0) - calm) * Math.min(1, dt * 2.2);
      sun += ((mode === 'yunwoo' ? 1 : 0) - sun) * Math.min(1, dt * 2.2);
      ctx.clearRect(0, 0, W, H);

      // 빛망울: 평소엔 연둣빛 섞인 흰 햇살, 세현에겐 푸르게, 윤우에겐 금빛으로
      const hue = 58 + (222 - 58) * calm - (58 - 42) * sun;
      const sat = 70 + 20 * Math.max(calm, sun);
      orbs.forEach((p, i) => {
        p.s += dt;
        const speed = (1 - calm * .5) * (1 + sun * 1.4);
        p.y -= p.v * speed * dt;
        p.x += (Math.sin(p.s * .8) * 6 - 3 - sun * 8) * dt;
        if (p.y < -40 || p.x < -40) orbs[i] = orb(true);
        ctx.globalAlpha = Math.min(1, p.a * (1 + sun * .9));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.4);
        g.addColorStop(0, `hsla(${hue}, ${sat}%, 94%, 1)`);
        g.addColorStop(1, `hsla(${hue}, ${sat}%, 86%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 2); ctx.fill();
        // 윤우: 몇몇 빛망울이 별처럼 반짝
        if (sun > .05) {
          const k = Math.sin(sec * 3 + p.tw * 5);
          if (k > .7) {
            ctx.globalAlpha = sun * (k - .7) / .3;
            ctx.strokeStyle = '#fff6d0';
            ctx.lineWidth = 1.2;
            drawGlint(p.x, p.y, p.r * 1.8);
          }
        }
      });

      // 흰 꽃잎: 세현에겐 느릿하게 잦아들고, 윤우에겐 바람에 실려 날려요
      const pf = (1 - calm * .75) * (1 + sun * .7);
      ctx.fillStyle = 'rgba(255, 255, 250, .88)';
      ctx.shadowColor = 'rgba(255, 255, 255, .6)';
      ctx.shadowBlur = 6;
      petals.forEach((p, i) => {
        p.y += p.v * pf * dt;
        p.x += (Math.sin(sec * .8 + p.s) * p.drift + sun * 40) * pf * dt;
        p.rot += p.spin * pf * dt;
        p.flip += 1.6 * pf * dt;
        if (p.y > H + 30 || p.x > W + 40) petals[i] = petal(true);
        ctx.globalAlpha = .75;
        drawPetal(p);
      });
      ctx.shadowBlur = 0;

      // 세현: 그에게서 푸른 가이딩 물결이 천천히 번져요
      if (mode === 'sehyun' && at) {
        ringT -= dt;
        if (ringT <= 0) { rings.push({ x: at.x, y: at.y, r: 18, a: .55 }); ringT = 1.1; }
      }
      rings = rings.filter((g) => g.a > 0);
      rings.forEach((g) => {
        g.r += (46 + g.r * .25) * dt;
        g.a -= .2 * dt;
        ctx.globalAlpha = Math.max(0, g.a);
        ctx.strokeStyle = '#a8c4ff';
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.stroke();
      });

      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(tick); else last = 0;
    }
    resize();
    if (!reduce) {
      for (let i = 0, n = W < 700 ? 22 : 38; i < n; i++) orbs.push(orb(false));
      for (let i = 0, n = W < 700 ? 14 : 26; i < n; i++) petals.push(petal(false));
      requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) requestAnimationFrame(tick); });
    addEventListener('resize', resize);
    return { mode: (m, p) => { mode = m; at = p; if (m === 'sehyun') ringT = 0; } };
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
    // 세현이가 아래 입력칸에 쳤다 지웠다 (chat.js의 drafts). 화면엔 세현이 쪽 "…"이 깜빡여요
    let startDrafts = null;
    if (C.drafts && C.drafts.length) {
      const dots = document.createElement('p');
      dots.className = 'msg me typing first tail';
      dots.setAttribute('aria-label', `${C.me} 입력 중`);
      dots.innerHTML = '<i></i><i></i><i></i>';
      dots.style.setProperty('--k', k + 1);
      log.appendChild(dots);
      const box = document.createElement('div');
      box.className = 'chat-compose';
      box.setAttribute('aria-hidden', 'true');
      box.innerHTML = '<span class="cc-text"></span><i class="cc-caret"></i><span class="cc-ph">메시지</span><span class="cc-send">↑</span>';
      $('#chat').appendChild(box);
      const text = box.querySelector('.cc-text');
      const pause = (ms) => new Promise((r) => setTimeout(r, ms));
      const show = (s) => { text.textContent = s; box.classList.toggle('has', s.length > 0); };
      if (reduce) show(C.drafts[0]);
      startDrafts = async () => {
        if (reduce) return;
        await pause((k + 1) * 280 + 700); // 위 메시지가 다 뜬 다음에
        for (;;) {
          for (const d of C.drafts) {
            const chars = [...d];
            for (let i = 1; i <= chars.length; i++) { show(chars.slice(0, i).join('')); await pause(120 + Math.random() * 110); }
            await pause(1100); // 쳐 놓고 잠깐 노려보다가
            for (let i = chars.length - 1; i >= 0; i--) { show(chars.slice(0, i).join('')); await pause(55); }
            await pause(700);
          }
          await pause(2400);
        }
      };
    }
    new IntersectionObserver((es, io) => {
      if (es.some((e) => e.isIntersecting)) { $('#chat').classList.add('play'); io.disconnect(); if (startDrafts) startDrafts(); }
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
