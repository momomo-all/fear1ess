(() => {
  const $ = (s) => document.querySelector(s);
  // 바이닐 화면 안(iframe)에서 열렸으면 기록을 쌓지 않고 이동해요 (안 그러면 ‹ Fearless가 바이닐로 안 나가요)
  const embedded = window.top !== window;
  const go = (href) => (embedded ? location.replace(href) : (location.href = href));
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;

  // 두 사람: 대사, 승인 서명(코드네임)
  const PEOPLE = {
    yunje: { line: '당신의 곁에 있는 것이 현재로서는 가장 합리적인 상태입니다.', who: 'RIVER', href: 'yunje.html' },
    ijae: { line: '죽은 뒤에도... 눈은 나만 보고 있네요. 잘했어요.', who: 'CHASER', href: 'ijae.html' },
  };

  /* ───────── 여는 장면: 검은 화면에 글자가 한 글자씩 ───────── */
  let n = 0;
  document.querySelectorAll('.line .main').forEach((line) => {
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
  setTimeout(() => body.classList.remove('opening'), reduce ? 0 : 600 + n * 70 + 1300);

  // 뒷문장은 닿았을 때 한 글자씩 흘러나오도록 미리 쪼개 둬요
  document.querySelectorAll('.line .more').forEach((m) => {
    const t = m.textContent.trim();
    m.textContent = '';
    [...t].forEach((ch, k) => {
      const sp = document.createElement('span');
      sp.className = 'mc';
      sp.textContent = ch;
      sp.style.setProperty('--j', k);
      m.appendChild(sp);
    });
  });

  /* ───────── 말에 닿으면 그 사람이 떠올라요 ───────── */
  let world = 'idle';
  let leaveT;
  function setWorld(next) {
    clearTimeout(leaveT);
    if (next === world) return;
    world = next;
    body.dataset.world = next;
  }
  const leaveSoon = () => { clearTimeout(leaveT); leaveT = setTimeout(() => setWorld('idle'), 160); };

  document.querySelectorAll('.line').forEach((w) => {
    const target = w.dataset.world;
    if (!touch) {
      w.addEventListener('pointerenter', () => setWorld(target));
      w.addEventListener('pointerleave', leaveSoon);
    }
    w.addEventListener('pointerdown', () => { w.dataset.pressed = Date.now(); });
    w.addEventListener('focus', () => { if (Date.now() - (w.dataset.pressed || 0) > 600) setWorld(target); });
    w.addEventListener('blur', leaveSoon);
    // 터치: 첫 탭은 미리 보기, 두 번째에 이동
    w.addEventListener('click', (e) => {
      e.preventDefault();
      if (touch && world !== target) { setWorld(target); return; }
      playScene(target);
    });
  });
  if (touch) document.addEventListener('click', (e) => { if (!e.target.closest('.line')) setWorld('idle'); });

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
    sceneLine.setAttribute('aria-label', text);
    let i = 0;
    text.split(/( )/).forEach((word) => {
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

  /* ───────── 공문 직인: 승인란까지 내려오면 쿵 ───────── */
  new IntersectionObserver((entries, io) => {
    if (!entries.some((en) => en.isIntersecting)) return;
    $('.notice').classList.add('stamped');
    io.disconnect();
  }, { threshold: 0.9, rootMargin: '0px 0px -12% 0px' }).observe($('#ntStamp'));

  /* ───────── 공문 찢기: 누르면 지그재그로 두 조각 ───────── */
  const wrap = $('#tearWrap');
  function tear() {
    if (wrap.classList.contains('torn')) return;
    const doc = wrap.querySelector('.notice');
    // 위에서 아래로 내려가며 들쭉날쭉한 찢어진 선을 만들어요
    const pts = [];
    for (let y = 0; y <= 100; y += 4) pts.push([50 + (Math.random() - 0.5) * 9 + (y / 100) * 4, y]);
    const line = pts.map(([x, y]) => `${x.toFixed(1)}% ${y}%`);
    const cutL = `polygon(0 0, ${line.join(', ')}, 0 100%)`;
    const cutR = `polygon(100% 0, ${line.join(', ')}, 100% 100%)`;
    ['l', 'r'].forEach((side) => {
      const c = doc.cloneNode(true);
      c.removeAttribute('aria-labelledby');
      c.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
      c.classList.add('shred', side, 'stamped');
      c.setAttribute('aria-hidden', 'true');
      c.style.setProperty(side === 'l' ? '--cut-l' : '--cut-r', side === 'l' ? cutL : cutR);
      wrap.appendChild(c);
    });
    wrap.classList.add('torn');
    doc.setAttribute('aria-hidden', 'true');
    if (!reduce) {
      const f = document.createElement('div');
      f.className = 'tear-flash';
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 800);
    }
  }
  wrap.querySelector('.notice').addEventListener('click', tear);
  $('#tearHint').addEventListener('click', tear);

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
