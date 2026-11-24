(() => {
  const $ = (s) => document.querySelector(s);
  // 바이닐 화면 안(iframe)에서 열렸으면 기록을 쌓지 않고 이동해요 (안 그러면 ‹ Fearless가 바이닐로 안 나가요)
  const embedded = window.top !== window;
  const go = (href) => (embedded ? location.replace(href) : (location.href = href));
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  const words = [...document.querySelectorAll('.word')];
  const sawol = $('#wSawol');
  const haneul = $('#wHaneul');

  const still = $('.still.color');

  /* ───────── 여는 장면: 제목이 한 글자씩 ───────── */
  let n = 0;
  document.querySelectorAll('.line').forEach((line) => {
    const walk = (node) => {
      [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...c.textContent].forEach((ch) => {
            const sp = document.createElement('span');
            sp.className = 'ch';
            sp.textContent = ch;
            sp.style.setProperty('--i', n++);
            frag.appendChild(sp);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) walk(c);
      });
    };
    walk(line);
  });
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 4600);

  /* ───────── 세계 바꾸기 ───────── */
  let world = 'idle';
  let leaveT;

  function setWorld(next) {
    clearTimeout(leaveT);
    if (next === world) return;
    if (next === 'hud') placeLock();
    if (next === 'spring') placeBloom();
    if (next !== 'idle') aimSpot(next);
    world = next;
    body.dataset.world = next;
    if (next === 'hud') startHud(); else stopHud();
    if (next === 'spring') Petals.start(); else Petals.stop();
    body.classList.toggle('lit-on', next !== 'idle');
  }
  // 단어 사이를 지나갈 때 깜빡이지 않게 살짝 기다렸다가 돌아가요
  const leaveSoon = () => { clearTimeout(leaveT); leaveT = setTimeout(() => setWorld('idle'), 140); };

  // 배경 그림(1216×832) 안의 얼굴 자리 (비율): 벽에 기댄 사월, 다가서는 재훈
  const FACES = { hud: [0.215, 0.2], spring: [0.41, 0.25] };
  // 그림 비율 → 화면 좌표 (object-fit: cover로 잘린 만큼 계산해요)
  function onScreen([fx, fy]) {
    const box = still.getBoundingClientRect(); // 그림이 깔린 영역 (세로 화면에선 위쪽 2/3)
    const POS = getComputedStyle(still).objectPosition.split(' ').map((v) => parseFloat(v) / 100); // CSS에서 읽어요
    const W = box.width, H = box.height;
    const k = Math.max(W / 1216, H / 832);
    const ox = (W - 1216 * k) * POS[0];
    const oy = (H - 832 * k) * POS[1];
    return { x: box.left + ox + fx * 1216 * k, y: box.top + oy + fy * 832 * k, k };
  }

  // 스포트라이트가 그 사람 얼굴로 가요
  function aimSpot(target) {
    const p = onScreen(FACES[target]);
    still.style.setProperty('--px', `${p.x}px`);
    still.style.setProperty('--py', `${p.y}px`);
    still.style.setProperty('--spot', `${Math.max(130, 175 * p.k)}px`);
  }

  // 조준경이 그림 속 이사월 얼굴을 잠그고, 그 아래 지면에 포격 마킹이 찍혀요
  function placeLock() {
    const p = onScreen(FACES.hud);
    const half = Math.max(50, 88 * p.k);
    const s = $('#hudLock').style;
    s.setProperty('--lx', `${p.x - half}px`);
    s.setProperty('--ly', `${p.y - half * 1.1}px`);
    s.setProperty('--lw', `${half * 2}px`);
    s.setProperty('--lh', `${half * 2.1}px`);
    const m = $('#hudMark').style;
    m.setProperty('--mx', `${p.x}px`);
    m.setProperty('--my', `${p.y + half * 2.6}px`);
  }
  // 봄이 재훈 얼굴에서 피어나요
  function placeBloom() {
    const p = onScreen(FACES.spring);
    body.style.setProperty('--sx', `${p.x}px`);
    body.style.setProperty('--sy', `${p.y}px`);
  }
  // 얼굴 위 반응 영역도 같은 자리에
  function placeFaces() {
    document.querySelectorAll('.face-hit').forEach((h) => {
      const p = onScreen(FACES[$('#' + h.dataset.for).dataset.world]);
      h.style.setProperty('--hx', `${p.x}px`);
      h.style.setProperty('--hy', `${p.y}px`);
      h.style.setProperty('--hs', `${Math.max(100, 180 * p.k)}px`);
    });
  }
  placeFaces();

  words.forEach((w) => {
    const target = w.dataset.world;
    if (!touch) {
      w.addEventListener('pointerenter', () => setWorld(target));
      w.addEventListener('pointerleave', leaveSoon);
    }
    // 탭하면 포커스가 클릭보다 먼저 와서, 터치 직후의 포커스는 미리 보기로 치지 않아요 (안 그러면 첫 탭에 바로 이동해요)
    w.addEventListener('pointerdown', () => { w.dataset.pressed = Date.now(); });
    w.addEventListener('focus', () => { if (Date.now() - (w.dataset.pressed || 0) > 600) setWorld(target); });
    w.addEventListener('blur', leaveSoon);
    // 터치: 첫 번째는 미리 보기, 두 번째에 이동 (이동 전엔 대사가 먼저 떠요)
    w.addEventListener('click', (e) => {
      e.preventDefault();
      if (touch && world !== target) { setWorld(target); return; }
      playScene(w);
    });
  });
  // 그림 왼쪽 절반은 사월, 오른쪽 절반은 재훈: 이름과 똑같이 반응해요
  document.querySelectorAll('.face-hit').forEach((h) => {
    const w = $('#' + h.dataset.for);
    const target = w.dataset.world;
    if (!touch) {
      h.addEventListener('pointerenter', () => { w.classList.add('lit'); setWorld(target); });
      h.addEventListener('pointerleave', () => { w.classList.remove('lit'); leaveSoon(); });
    }
    h.addEventListener('click', (e) => {
      e.preventDefault();
      if (touch && world !== target) { setWorld(target); return; }
      playScene(w);
    });
  });
  if (touch) {
    document.addEventListener('click', (e) => { if (!e.target.closest('.word, .face-hit')) setWorld('idle'); });
  }
  // FL-OS 단말기의 OPEN PERSONNEL FILE (js/flos.js가 불러요): 이름을 눌렀을 때와 똑같이 대사 → 글자 연출 → 캐릭터 페이지
  window.FLOS_OPEN = (href) => {
    const w = words.find((x) => x.getAttribute('href') === href);
    if (!w || play) return null;
    return () => { setWorld(w.dataset.world); playScene(w); };
  };
  addEventListener('resize', () => { placeFaces(); if (world === 'hud') placeLock(); if (world !== 'idle') aimSpot(world); Petals.resize(); });

  /* ───────── 대사 연출 (가챠처럼) ───────── */
  const scene = $('#scene');
  const sceneWho = $('#sceneWho');
  const sceneLine = $('#sceneLine');
  const signText = $('#signText');
  let play = null; // { href, t1, t2 }

  const canBloom = (tone) => !!(window.GlyphBloom && window.GlyphBloom.has(tone));

  function playScene(w) {
    if (play) return;
    const text = `“${w.dataset.line}”`;
    scene.dataset.tone = w.dataset.tone;
    signText.textContent = 'AWAITING SIGNATURE…';
    sceneWho.dataset.who = w.dataset.who; // 승인할 코드네임
    sceneLine.textContent = '';
    sceneLine.setAttribute('aria-label', text);
    // 단어 단위로 묶어서, 줄이 바뀌어도 단어 중간이 끊기지 않아요
    let i = 0;
    text.split(' ').forEach((word, k) => {
      if (k) sceneLine.appendChild(document.createTextNode(' '));
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

    // 대사가 다 나오면 → 서명 선이 차오르고 → 승인 → 잠깐 머물렀다가 넘어가요
    const typed = reduce ? 300 : 900 + text.length * 55 + 500;
    play = { href: w.href, timers: [] };
    if (canBloom(w.dataset.tone)) window.GlyphBloom.warm(w.dataset.tone); // 대사 나오는 동안 글꼴 미리 받기
    later(() => scene.classList.add('full'), typed);
    later(sign, typed + 350);
  }

  const later = (fn, ms) => play.timers.push(setTimeout(fn, ms));
  const clearAll = () => { play.timers.forEach(clearTimeout); play.timers = []; };

  // 서명 진행: AWAITING SIGNATURE… → APPROVED BY 코드네임
  function sign() {
    scene.classList.add('full', 'signing');
    later(signed, reduce ? 0 : 1150);
  }
  function signed() {
    signText.textContent = `APPROVED BY ${sceneWho.dataset.who}`;
    scene.classList.add('full', 'signing', 'signed');
    // 승인 뒤에 문장들이 상징(해바라기·하늘)이 됐다가 그림이 돼요 (bloom-engine.js + bloom-인물.js)
    if (canBloom(scene.dataset.tone) && !reduce) later(bloom, 1300);
    else later(leaveScene, 1300);
  }

  function bloom() {
    if (!play || play.bloom) return;
    clearAll();
    play.bloom = true;
    const href = play.href;
    window.GlyphBloom.play(scene.dataset.tone, scene, () => go(href));
  }

  function leaveScene() {
    if (!play || scene.classList.contains('leave')) return;
    clearAll();
    scene.classList.add('full', 'leave');
    const href = play.href;
    setTimeout(() => go(href), reduce ? 0 : 620);
  }

  // 누를 때마다 한 단계씩 건너뛰어요: 대사 다 보이기 → 서명 → 승인 → 넘어가기
  function advance() {
    if (!play) return;
    if (play.bloom) { window.GlyphBloom.skip(); return; } // 글자 연출 중엔 바로 인물 그림으로
    clearAll();
    if (!scene.classList.contains('full')) { scene.classList.add('full'); later(sign, 300); }
    else if (!scene.classList.contains('signed')) signed();
    else if (canBloom(scene.dataset.tone) && !reduce) bloom();
    else leaveScene();
  }
  scene.addEventListener('click', advance);
  scene.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); advance(); }
  });

  // 뒤로 가기로 돌아왔을 때(페이지 캐시) 연출이 남아 있지 않게
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    play = null;
    scene.hidden = true;
    scene.classList.remove('on', 'full', 'signing', 'signed', 'leave');
    body.classList.remove('opening');
    setWorld('idle');
  });

  /* ───────── 공문 직인: 승인란까지 내려오면 쿵 ───────── */
  const notice = $('.notice');
  new IntersectionObserver((entries, io) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      notice.classList.add('stamped');
      io.disconnect();
    });
  }, { threshold: 0.9, rootMargin: '0px 0px -12% 0px' }).observe($('#ntStamp')); // 1이면 소수점 오차로 영영 안 찍힐 수 있어요

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
    if (C.log.length && C.log[C.log.length - 1].from === 'me') { // (지금은 재훈 답장으로 끝나서 안 보여요)
      const rd = document.createElement('p');
      rd.className = 'msg-read';
      const bb = document.createElement('b');
      bb.textContent = '읽음';
      rd.appendChild(bb);
      rd.style.setProperty('--k', k);
      log.appendChild(rd);
    }
    new IntersectionObserver((es, io) => {
      if (es.some((e) => e.isIntersecting)) { $('#chat').classList.add('play'); io.disconnect(); }
    }, { threshold: 0.3 }).observe($('#chat'));
  }

  /* ───────── 단말기 수치 ───────── */
  let hudTimer = null;
  const alt = $('#hudAlt');
  const mach = $('#hudMach');
  const coord = $('#hudCoord');
  const fmt = (n) => n.toLocaleString('en-US');

  function startHud() {
    if (hudTimer || reduce) return;
    hudTimer = setInterval(() => {
      alt.textContent = fmt(2000 + Math.round((Math.random() - 0.5) * 24));
      mach.textContent = (0.84 + (Math.random() - 0.5) * 0.02).toFixed(2);
    }, 420);
  }
  function stopHud() { clearInterval(hudTimer); hudTimer = null; }

  // 마우스 위치가 지상 좌표가 돼요 (가상 좌표)
  const dms = (v) => {
    const d = Math.floor(v);
    const m = Math.floor((v - d) * 60);
    const s = Math.floor(((v - d) * 60 - m) * 60);
    return `${d}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
  };
  addEventListener('pointermove', (e) => {
    if (world !== 'hud') return;
    const lat = 37.55 - (e.clientY / innerHeight) * 0.04;
    const lon = 126.96 + (e.clientX / innerWidth) * 0.06;
    coord.textContent = `N ${dms(lat)} · E ${dms(lon)}`;
  }, { passive: true });

  /* ───────── 벚꽃잎 ───────── */
  const Petals = (() => {
    const cv = $('#petals');
    const ctx = cv.getContext('2d');
    const COLORS = ['#f7c6d6', '#f3b4c8', '#fbd9e4', '#ffffff'];
    let W = 0, H = 0, dpr = 1, list = [], raf = null, running = false, fadeUntil = 0, last = 0;

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw();
    }

    function make(initial) {
      return {
        x: Math.random() * W * 1.2 - W * 0.1,
        y: initial ? Math.random() * H : -20 - Math.random() * 80,
        r: 4 + Math.random() * 5,
        vy: 18 + Math.random() * 26,
        vx: 10 + Math.random() * 22,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 2.2,
        sway: Math.random() * Math.PI * 2,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        a: 0.55 + Math.random() * 0.4,
      };
    }

    function petal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.rot * 1.3))); // 뒤집히듯 흔들려요
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      // 끝이 살짝 갈라진 꽃잎
      ctx.moveTo(0, -p.r);
      ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.7, p.r * 0.8, p.r * 0.6, 0, p.r);
      ctx.bezierCurveTo(-p.r * 0.8, p.r * 0.6, -p.r * 0.9, -p.r * 0.7, -p.r * 0.18, -p.r * 0.82);
      ctx.lineTo(0, -p.r * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      list.forEach(petal);
    }

    function tick(t) {
      const dt = Math.min((t - (last || t)) / 1000, 0.05);
      last = t;
      list.forEach((p, i) => {
        p.sway += dt * 1.4;
        p.x += (p.vx + Math.sin(p.sway) * 18) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.y > H + 20 || p.x > W + 30) list[i] = make(false);
      });
      draw();
      // 봄에서 나간 뒤에도 하늘이 닫힐 때까지는 계속 흩날려요
      raf = running || t < fadeUntil ? requestAnimationFrame(tick) : null;
    }

    function start() {
      if (!list.length) { const n = Math.max(30, Math.round(Math.min(W, 1400) / 22)); for (let i = 0; i < n; i++) list.push(make(true)); }
      running = true;
      if (reduce) { draw(); return; }
      if (!raf) { last = 0; raf = requestAnimationFrame(tick); }
    }
    function stop() { running = false; fadeUntil = performance.now() + 700; }

    resize();
    return { start, stop, resize };
  })();
})();
