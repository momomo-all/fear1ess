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
    dojin: { face: [0.6, 0.29], line: '저는 그저 당신을 지킬 뿐입니다.\n무너지지 않게.', wait: 'VERIFYING…', done: 'A-CLASS SENTINEL · NOVA', href: 'dojin.html' },
    hyunyul: { face: [0.75, 0.31], line: '또 그렇게 숨 죽이면…\n장난치고 싶어지잖아요.', wait: 'MONITORING…', done: 'S-CLASS SENTINEL · PULSE', href: 'hyunyul.html' },
  };
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 4800);

  // 공문 별첨 먹칠: 터치 화면에선 눌러서 잠깐 비쳐 보기
  document.querySelectorAll('.redact').forEach((r) => r.addEventListener('click', () => r.classList.toggle('peek')));

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
      body.style.setProperty('--spot', `${Math.max(110, 180 * p.k)}px`);
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
      h.style.setProperty('--hs', `${Math.max(70, 120 * p.k)}px`);
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

  /* ───────── 궤도를 도는 별, 신성, 맥박 ───────── */
  // 평소: 별들이 화면 아래 먼 한 점을 중심으로 아주 천천히 돌며 깜빡여요
  // NOVA(도진): 그의 곁에서 별 하나가 하얗게 터지고(빛의 고리가 한 번 퍼져요), 계속 은은하게 빛나요
  // PULSE(현율): 그에게서 두근, 두근 박동에 맞춰 빛의 파동이 퍼지고, 별들도 박동에 맞춰 밝아져요
  const Dust = (() => {
    const cv = $('#air');
    const ctx = cv.getContext('2d');
    const BEAT = 1.1;
    let W = 0, H = 0, stars = [], rings = [], last = 0, mode = 'idle', at = null, nova = 0, pulse = 0, beatT = 0, beats = 0;
    function resize() {
      const oW = W, oH = H;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (oW > 50 && oH > 50 && (oW !== W || oH !== H)) stars.forEach((p) => { p.x *= W / oW; p.y *= H / oH; });
    }
    const R = Math.random;
    const star = () => ({ x: R() * W, y: R() * H * .75, r: .4 + R() * 1.2, tw: R() * 6, sp: .6 + R() * 1.6, born: 0 });
    // 네 갈래로 빛나는 별
    // 신성 자리: 그의 왼쪽 위 하늘, 빛 고리까지 화면 안에 다 들어오게
    function novaAt(p) {
      const m = 110 * p.k;
      return {
        x: Math.min(W - m, Math.max(m, p.x - 300 * p.k)),
        y: Math.min(H * .5, Math.max(m, p.y - 200 * p.k)),
      };
    }
    function spikes(x, y, len, a) {
      ctx.globalAlpha = a;
      ctx.strokeStyle = '#eef4ff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x - len, y); ctx.lineTo(x + len, y);
      ctx.moveTo(x, y - len * .7); ctx.lineTo(x, y + len * .7);
      ctx.stroke();
    }
    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, .05);
      last = t;
      const sec = t / 1000;
      nova += ((mode === 'dojin' ? 1 : 0) - nova) * Math.min(1, dt * 2.4);
      pulse += ((mode === 'hyunyul' ? 1 : 0) - pulse) * Math.min(1, dt * 2.4);
      ctx.clearRect(0, 0, W, H);

      // 박동: 두근(크게), 두근(작게)
      let beatGlow = 0;
      if (mode === 'hyunyul' && at) {
        beatT += dt;
        const ph = beatT % BEAT;
        const n = Math.floor(beatT / BEAT) * 2 + (ph >= .24 ? 1 : 0);
        if (n > beats) {
          beats = n;
          rings.push({ x: at.x, y: at.y, life: 0, max: (n % 2 ? 190 : 260) * at.k, w: n % 2 ? 1.2 : 2 });
        }
        beatGlow = Math.max(0, 1 - ph / .2) + Math.max(0, 1 - Math.abs(ph - .3) / .12) * .6;
      }

      // 궤도: 화면 아래 먼 한 점을 중심으로 아주 천천히
      const cx = W * .5, cy = H * 1.6, w = .006 * dt;
      const cos = Math.cos(w), sin = Math.sin(w);
      ctx.fillStyle = '#eef3ff';
      stars.forEach((s, i) => {
        const dx = s.x - cx, dy = s.y - cy;
        s.x = cx + dx * cos - dy * sin;
        s.y = cy + dx * sin + dy * cos;
        s.born = Math.min(1, s.born + dt / 1.5);
        if (s.x < -10 || s.x > W + 10 || s.y < -10 || s.y > H + 10) { stars[i] = star(); return; }
        let a = (.25 + .55 * (.5 + .5 * Math.sin(sec * s.sp + s.tw))) * s.born;
        a *= 1 + beatGlow * pulse * .6;
        // 도진 곁의 별은 조금 더 환하게
        if (nova > .05 && at) a *= 1 + nova * Math.max(0, 1 - Math.hypot(s.x - at.x, s.y - at.y) / (320 * at.k));
        ctx.globalAlpha = Math.min(1, a);
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });

      // 신성: 그의 왼쪽 위 하늘에서 별 하나가 하얗게
      if (nova > .02 && at) {
        const { x: nx, y: ny } = novaAt(at);
        const tw = .85 + .15 * Math.sin(sec * 2.2);
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, 90 * at.k);
        g.addColorStop(0, `rgba(255, 255, 255, ${nova})`);
        g.addColorStop(.06, `rgba(240, 246, 255, ${.85 * nova})`);
        g.addColorStop(.25, `rgba(190, 215, 255, ${.28 * nova})`);
        g.addColorStop(1, 'rgba(160, 200, 255, 0)');
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = tw;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(nx, ny, 90 * at.k, 0, Math.PI * 2); ctx.fill();
        spikes(nx, ny, 64 * at.k * nova * tw, .9 * nova);
        ctx.globalCompositeOperation = 'source-over';
      }

      // 빛의 고리 (신성이 터질 때 한 번, 맥박마다 한 번)
      rings = rings.filter((r) => r.life < 1);
      rings.forEach((r) => {
        r.life += dt / (r.slow ? 1.6 : 1.4);
        const e = 1 - Math.pow(1 - r.life, 3);
        ctx.globalAlpha = (1 - r.life) * .7;
        ctx.strokeStyle = r.slow ? '#e6f0ff' : '#8fb2ff';
        ctx.lineWidth = r.w;
        ctx.beginPath(); ctx.arc(r.x, r.y, 12 + e * r.max, 0, Math.PI * 2); ctx.stroke();
      });

      ctx.globalAlpha = 1;
      if (!document.hidden) requestAnimationFrame(tick); else last = 0;
    }
    resize();
    if (!reduce) {
      for (let i = 0, n = W < 700 ? 50 : 110; i < n; i++) { const s = star(); s.born = 1; stars.push(s); }
      requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !reduce) requestAnimationFrame(tick); });
    addEventListener('resize', resize);
    return {
      mode: (m, p) => {
        mode = m; at = p;
        if (m === 'hyunyul') { beatT = 0; beats = -1; }
        if (m === 'dojin' && p) { const n = novaAt(p); rings.push({ x: n.x, y: n.y, life: 0, max: 130 * p.k, w: 1.4, slow: true }); }
      },
    };
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
