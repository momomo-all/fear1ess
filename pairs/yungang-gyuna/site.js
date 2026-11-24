(() => {
  const $ = (s) => document.querySelector(s);
  // 바이닐 화면 안(iframe)에서 열렸으면 기록을 쌓지 않고 이동해요 (안 그러면 ‹ Fearless가 바이닐로 안 나가요)
  const embedded = window.top !== window;
  const go = (href) => (embedded ? location.replace(href) : (location.href = href));
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  const still = $('.still.color');

  // 두 사람: 그림 속 얼굴 자리(1216×832 비율), 대사, 코드네임
  const PEOPLE = {
    gyuna: { face: [0.635, 0.4], line: '키 작다고 무시하지 마.\n눈 높이 맞춰 줘?', who: 'KITTY', href: 'gyuna.html' }, // \n = 줄바꿈
    yungang: { face: [0.6, 0.2], line: '죽으란 법은 없구나.', who: 'PANTHER', href: 'yungang.html' }, // 대사는 임시
  };

  /* ───────── 여는 장면: 세로글이 한 글자씩 ───────── */
  let n = 0;
  document.querySelectorAll('.col').forEach((col) => {
    const walk = (node) => {
      [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...c.textContent.replace(/\s+/g, ' ').trim() ? c.textContent.replace(/\s+/g, ' ') : ''].forEach((ch) => {
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
    walk(col);
  });
  // 마지막 글자가 다 내려앉은 뒤에 여는 장면을 끝내요 (먼저 끝내면 남은 글자가 한꺼번에 뚝 나와요)
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 1300 + n * 45 + 1100);

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
      body.style.setProperty('--spot', `${Math.max(120, 190 * p.k)}px`);
    }
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

  // 단어와 얼굴: 마우스면 올리기, 터치면 첫 탭에 미리 보기 → 두 번째에 이동
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
  document.querySelectorAll('.word').forEach((w) => {
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
  if (touch) document.addEventListener('click', (e) => { if (!e.target.closest('.word, .face-hit')) setWorld('idle'); });

  /* ───────── 대사 → 서명 → 승인 → 이동 ───────── */
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
    signText.textContent = 'AWAITING SIGNATURE…';
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

    play = { href: who.href, who: who.who, timers: [] };
    const typed = reduce ? 300 : 900 + text.length * 50 + 500;
    later(() => scene.classList.add('full'), typed);
    later(sign, typed + 350);
  }
  function sign() {
    scene.classList.add('full', 'signing');
    later(signed, reduce ? 0 : 1150);
  }
  function signed() {
    signText.textContent = `APPROVED BY ${play.who}`;
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
  // 누를 때마다 한 단계씩: 대사 다 보이기 → 승인 → 이동
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

  // 뒤로 가기로 돌아왔을 때 연출이 남아 있지 않게
  addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    body.classList.remove('leaving');
    play = null;
    scene.hidden = true;
    scene.classList.remove('on', 'full', 'signing', 'signed', 'leave');
    body.classList.remove('opening');
    setWorld('idle');
  });
})();
