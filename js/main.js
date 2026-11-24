(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? Math.min(ms, 120) : ms));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad = (n) => String(n).padStart(2, '0');
  // 문구의 줄바꿈(\n)은 큰 제목에서만 살리고, 한 줄로 보이는 곳에선 띄어쓰기로
  const flat = (s) => s.replace(/\s*\n\s*/g, ' ');

  // 바이닐 상자에는 Fearless 페어만 꽂혀요 (group을 안 적으면 Fearless)
  const PAIRS = (window.PAIRS || []).filter((p) => (p.group || 'fearless') === 'fearless');
  // 책장에는 Something else 책들이 꽂혀요
  const BOOKS = (window.PAIRS || []).filter((p) => p.group === 'else');
  const entry = $('#entry');
  const views = { profile: $('#profileView'), pair: $('#pairView'), shelf: $('#shelfView'), site: $('#siteView') };

  /* ───────── 말풍선(또는 커버) 속으로 빨려 들어가기 ───────── */
  const portal = $('#portal');
  const stack = []; // 열린 화면들 (위가 마지막). 비어 있으면 바탕화면이에요
  let homeOrigin = null; // 바탕화면에서 누른 아이콘 (돌아올 때 물결이 그 자리로 줄어들어요)
  const top = () => stack[stack.length - 1] || null;

  // (cx, cy)를 중심으로 화면을 다 덮는 원을 놓고, 그 지름을 돌려줘요
  function placePortal(cx, cy) {
    const d = 2 * Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));
    Object.assign(portal.style, { width: `${d}px`, height: `${d}px`, left: `${cx - d / 2}px`, top: `${cy - d / 2}px` });
    return d;
  }
  const stopAll = (el) => el.getAnimations().forEach((a) => a.cancel());
  const center = (r) => [r.left + r.width / 2, r.top + r.height / 2];

  // 바탕화면이 앞으로 다가오며 흐려진 상태
  const HOME_NEAR = { transform: 'scale(1.14)', filter: 'blur(6px)', opacity: 0.2 };
  const HOME_REST = { transform: 'scale(1)', filter: 'blur(0px)', opacity: 1 };
  const VIEW_NEAR = { transform: 'scale(1.06)', opacity: 0.3 };
  const VIEW_REST = { transform: 'scale(1)', opacity: 1 };

  // 지금 맨 위에 있는 화면(또는 바탕화면)을 가리거나 다시 보여줘요
  function hideBelow(below) {
    if (below) { stopAll(views[below]); views[below].hidden = true; return; }
    stopAll(entry);
    entry.classList.add('away');
  }
  function showBelow(below) {
    if (below) { views[below].hidden = false; return views[below]; }
    entry.classList.remove('away');
    return entry;
  }
  // 돌아갈 때 유리가 줄어들 자리
  function returnRect(below) {
    if (below === 'pair') return $('#album').getBoundingClientRect();
    if (below === 'shelf') return Shelf.picked().getBoundingClientRect();
    return (homeOrigin && homeOrigin.isConnected && homeOrigin.offsetParent ? homeOrigin : entry).getBoundingClientRect();
  }

  // 창 틀 안쪽 자리 (위: 제목 표시줄, 아래: 작업 표시줄)
  function frameRect() {
    const cs = getComputedStyle(document.documentElement);
    const t = parseFloat(cs.getPropertyValue('--os-top')) || 0;
    const b = parseFloat(cs.getPropertyValue('--os-bot')) || 0;
    return { left: 0, top: t, width: innerWidth, height: innerHeight - t - b };
  }
  // 누른 자리(r)에서 창 틀 크기까지 창이 커져요 (open=false면 거꾸로 줄어들어요)
  function zoom(r, open, duration) {
    const F = frameRect();
    Object.assign(portal.style, { left: `${F.left}px`, top: `${F.top}px`, width: `${F.width}px`, height: `${F.height}px` });
    portal.classList.add('zoom');
    portal.hidden = false;
    const small = `translate(${r.left - F.left}px, ${r.top - F.top}px) scale(${Math.max(r.width, 8) / F.width}, ${Math.max(r.height, 8) / F.height})`;
    const kf = [{ transform: small, opacity: 0.6 }, { transform: 'none', opacity: 1 }];
    return portal.animate(open ? kf : kf.reverse(), { duration, easing: 'steps(7, end)', fill: 'forwards' });
  }
  const changed = () => dispatchEvent(new CustomEvent('sitenav:change'));

  // 화면 전환은 줄 세워서 하나씩 해요
  // (애니메이션 도중에 Fearless → Messages를 빠르게 누르면 닫기가 겹쳐서, 열린 화면 기록이 꼬이고 Messages가 안 눌렸어요)
  let flow = Promise.resolve();
  const queue = (fn) => (flow = flow.then(fn).catch((e) => console.error(e)));

  function openView(name, origin) {
    return queue(() => doOpenView(name, origin));
  }

  async function doOpenView(name, origin) {
    if (top() === name) return; // 커버를 두 번 빠르게 눌러도 한 번만 열려요
    const view = views[name];
    const below = top();
    if (name === 'profile') {
      const f = $('#profileFrame');
      if (!f.src) f.src = f.dataset.src;
    }
    if (name === 'pair') Records.init();
    if (name === 'shelf') Shelf.init();

    if (reduce) {
      hideBelow(below);
      view.hidden = false;
    } else {
      // 1) 누른 자리에서 창이 뚝뚝 커져 창 틀을 채워요
      if (!below) homeOrigin = origin || null;
      const from = origin || entry;
      const r = from.getBoundingClientRect();
      const ease = 'cubic-bezier(.65, 0, .25, 1)';
      let grow;
      if (below) {
        // 페어 색 물결이 동그랗게 퍼져요
        portal.classList.remove('zoom');
        Object.assign(portal.style, { transform: '' });
        const d = placePortal(...center(r));
        portal.hidden = false;
        grow = portal.animate(
          [{ transform: `scale(${Math.min(r.width, r.height) / d})`, opacity: 0.85 }, { transform: 'scale(1)', opacity: 1 }],
          { duration: 560, easing: ease, fill: 'forwards' }
        );
      } else {
        grow = zoom(r, true, 420);
      }
      (below ? views[below] : entry).animate(below ? [VIEW_REST, VIEW_NEAR] : [HOME_REST, HOME_NEAR], { duration: below ? 560 : 420, easing: ease, fill: 'forwards' });
      await grow.finished;

      // 2) 창 안에 새 화면이 떠요
      hideBelow(below);
      view.hidden = false;
      view.classList.add('entering');
      if (name === 'pair') Records.enter();
      if (name === 'shelf') Shelf.enter();
      view.animate(
        [{ opacity: 0, transform: 'scale(1.06)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 600, easing: 'cubic-bezier(.16, 1, .3, 1)' }
      );
      await portal.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'steps(3, end)', fill: 'forwards' }).finished;
      stopAll(portal);
      portal.hidden = true;
      setTimeout(() => view.classList.remove('entering'), 1700);
    }

    stack.push(name);
    history.pushState({ view: name }, '');
    changed();
  }

  async function closeView() {
    if (!stack.length) return;
    const view = views[stack.pop()];
    const below = top();

    if (reduce) {
      view.hidden = true;
      showBelow(below);
    } else {
      // 1) 창 틀이 다시 덮여요
      if (below) views[below].hidden = false; // 커버 위치를 재려면 먼저 깔아 둬야 해요 (위 화면에 가려져 있어요)
      const r = returnRect(below);
      let d = 0;
      if (below) {
        portal.classList.remove('zoom');
        portal.style.transform = '';
        d = placePortal(...center(r));
      } else {
        const F = frameRect();
        Object.assign(portal.style, { left: `${F.left}px`, top: `${F.top}px`, width: `${F.width}px`, height: `${F.height}px`, transform: 'none' });
        portal.classList.add('zoom');
      }
      portal.hidden = false;
      await portal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: below ? 320 : 200, easing: below ? 'cubic-bezier(.4, 0, 1, 1)' : 'steps(3, end)', fill: 'forwards' }).finished;
      view.hidden = true;
      view.classList.remove('entering');
      stopAll(view);
      stopAll(portal);

      // 2) 유리가 그 자리로 줄어들며 원래 화면으로 돌아가요
      const back = showBelow(below);
      const ease = 'cubic-bezier(.16, 1, .3, 1)';
      back.animate(below ? [VIEW_NEAR, VIEW_REST] : [HOME_NEAR, HOME_REST], { duration: below ? 560 : 420, easing: ease });
      // 2) 돌아갈 자리로 줄어들어요 (화면 안: 물결 / 바탕화면: 창)
      stopAll(portal);
      if (below) {
        await portal.animate(
          [{ transform: 'scale(1)', opacity: 1 }, { transform: `scale(${Math.min(r.width, r.height) / d})`, opacity: 0 }],
          { duration: 560, easing: ease, fill: 'forwards' }
        ).finished;
      } else {
        await zoom(r, false, 360).finished;
      }
      stopAll(portal);
      portal.hidden = true;
      portal.style.transform = '';
    }
    changed();
    portal.style.removeProperty('--pc'); // 사이트에서 나오면 원래 파란 물결로
    if (below === 'shelf') Shelf.putBack();
    if (!below) dispatchEvent(new CustomEvent('sitenav:home'));
  }

  // 뒤로 가기: 앞 전환이 끝난 뒤에 브라우저 기록을 한 칸 되돌리고, 그 닫기가 끝날 때까지 기다려요
  let popped = null;
  function goBack() {
    queue(() => new Promise((done) => {
      if (!stack.length) return done();
      popped = done;
      history.back();
      // 혹시 신호가 안 오면(페어 사이트 안쪽 기록이 먹힌 경우) 직접 닫아요
      setTimeout(() => { if (popped === done) { popped = null; closeView().then(done); } }, 1000);
    }));
  }
  document.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', goBack));
  addEventListener('popstate', () => {
    if (popped) { const done = popped; popped = null; closeView().then(done); } // 버튼으로 누른 뒤로 가기
    else if (stack.length) queue(closeView); // 브라우저의 뒤로 가기 버튼
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && stack.length) goBack(); });

  /* ───────── 커버 만들기 ───────── */
  function coverNode(p, i) {
    if (p.cover) {
      const img = document.createElement('img');
      img.className = 'cover-img';
      img.src = p.cover;
      img.alt = '';
      img.draggable = false;
      if (p.coverPos) img.style.objectPosition = p.coverPos;
      img.decoding = 'async';
      return img;
    }
    const d = document.createElement('div');
    d.className = 'cover-gen';
    d.style.setProperty('--c1', p.color || '#555');
    d.style.setProperty('--c2', `color-mix(in oklab, ${p.color || '#555'} 35%, #fff)`);
    d.innerHTML = `<span class="cg-title"></span><span class="cg-no">${pad(i + 1)}</span>`;
    d.querySelector('.cg-title').textContent = p.title;
    return d;
  }

  /* ───────── 페어 고르기 (진열 / 목록 / 검색) ───────── */
  const Records = (() => {
    const pairView = views.pair;
    const stage = $('#pvStage');
    const flow = $('#flow');
    const list = $('#pvList');
    const query = $('#pvQuery');
    const results = $('#pvResults');
    const cards = [];
    const rows = [];
    const N = PAIRS.length;
    let pos = 0, target = 0, current = -1, raf = null, built = false;
    let dragging = false, moved = false, startX = 0, startPos = 0, lastX = 0, lastT = 0, vel = 0;
    let a = 300; // 큰 커버 한 변
    let mode = 'flow';

    function init() {
      if (built) return;
      built = true;
      $('#pvTotal').textContent = pad(N);
      // 공기 중에 떠다니는 먼지
      const dust = $('#pvDust');
      for (let k = 0; k < 26; k++) {
        const d = document.createElement('i');
        const r = (a, b) => (a + Math.random() * (b - a)).toFixed(2);
        d.style.cssText = `left:${r(0, 100)}%;top:${r(0, 100)}%;--s:${r(1, 3.2)}px;--o:${r(.25, .7)};--dx:${r(-40, 40)}px;--dy:${r(-90, -30)}px;animation-duration:${r(9, 20)}s,${r(3, 7)}s;animation-delay:-${r(0, 20)}s,-${r(0, 7)}s`;
        dust.appendChild(d);
      }
      PAIRS.forEach((p, i) => {
        // 진열: 양옆에 겹겹이 놓이는 커버
        const c = document.createElement('button');
        c.type = 'button';
        c.className = 'fcard';
        c.tabIndex = -1;
        c.setAttribute('aria-label', p.title);
        c.appendChild(coverNode(p, i));
        c.addEventListener('click', () => goTo(i));
        flow.appendChild(c);
        cards.push(c);

        // 목록: 트랙리스트 한 줄
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.innerHTML = '<span class="n"></span><span class="t"></span><span class="c"></span>';
        b.children[0].textContent = pad(i + 1);
        b.children[1].textContent = flat(p.tagline || p.title);
        b.children[2].textContent = (p.chars || []).join(' · ');
        b.addEventListener('click', () => goTo(i));
        li.appendChild(b);
        list.appendChild(li);
        rows.push(li);
      });
      select(0);
      layout();
    }

    function layout() {
      if (!cards.length || mode !== 'flow') return;
      a = $('#album').offsetWidth || a;
      for (let i = 0; i < N; i++) {
        const el = cards[i];
        const d = i - pos;
        const ad = Math.abs(d);
        if (ad > 7.5) { el.style.visibility = 'hidden'; continue; }
        el.style.visibility = '';
        const s = Math.sign(d);
        const c = Math.min(ad, 1);
        // 가까운 장은 넓게, 먼 장은 촘촘하게. 오른쪽은 레코드판이 나와 있으니 한 칸 더 띄워요
        const x = -a * 0.2 * (1 - c) + s * (c * (s > 0 ? a * 1.3 : a * 0.85) + Math.max(ad - 1, 0) * a * 0.2);
        const y = -ad * a * 0.04;
        const z = -c * a * 0.7 - ad * a * 0.3;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${(-s * c * 38).toFixed(2)}deg)`;
        el.style.zIndex = 100 - Math.round(ad * 2);
        el.style.opacity = Math.min(c * 2, 1, 7.5 - ad).toFixed(3); // 가운데에선 큰 커버 뒤로 숨어요
        el.style.setProperty('--shade', Math.min(c * 0.38 + ad * 0.07, 0.75).toFixed(3));
      }
    }

    function tick() {
      if (!dragging) {
        pos += (target - pos) * (reduce ? 1 : 0.14);
        if (Math.abs(target - pos) < 0.001) pos = target;
      }
      layout();
      const idx = clamp(Math.round(pos), 0, N - 1);
      if (idx !== current) select(idx);
      raf = dragging || pos !== target ? requestAnimationFrame(tick) : null;
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    function goTo(i) {
      target = clamp(i, 0, N - 1);
      if (mode === 'list') pos = target; // 목록에선 바로 바뀌어요
      kick();
    }

    // 목록 안에서만 스크롤해요 (scrollIntoView는 바깥 화면까지 밀어요)
    function reveal(i) {
      const r = rows[i];
      if (r.offsetTop < list.scrollTop) list.scrollTop = r.offsetTop;
      else if (r.offsetTop + r.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = r.offsetTop + r.offsetHeight - list.clientHeight;
    }

    let disc;
    function select(i) {
      current = i;
      const p = PAIRS[i];
      $('#pvIndex').textContent = pad(i + 1);
      pairView.style.setProperty('--accent', p.color || '#62b6e0');
      $('#album').setAttribute('aria-label', `${p.title} 열기`);

      // 큰 커버 교체
      const big = $('#bigCover');
      const layer = document.createElement('div');
      layer.className = 'cover-layer';
      layer.appendChild(coverNode(p, i));
      big.appendChild(layer);
      while (big.children.length > 2) big.firstElementChild.remove();

      // 배경에 커버 색이 번져요
      const bleed = $('#pvBleed');
      const wash = document.createElement('div');
      wash.className = 'bleed-layer';
      if (p.cover) wash.style.backgroundImage = `url("${p.cover}")`;
      else wash.style.background = p.color || '#62b6e0';
      bleed.appendChild(wash);
      while (bleed.children.length > 2) bleed.firstElementChild.remove();

      // 바이닐 라벨
      const label = $('#discLabel');
      label.style.backgroundImage = p.cover ? `url("${p.cover}")` : 'none';
      label.style.backgroundPosition = p.coverPos || '';

      // 정보
      const info = $('.pv-info');
      const side = i % 2 ? 'B' : 'A';
      // 둘의 관계를 담은 문구가 있으면 그걸 크게, 없으면 페어 이름을 크게
      $('#pvMeta').textContent = `No.${pad(i + 1)} · Side ${side} · 33⅓ RPM`;
      $('#pvTitle').textContent = p.tagline || p.title;
      const chars = $('#pvChars');
      chars.textContent = '';
      (p.chars || []).forEach((c, k) => {
        if (k) { const x = document.createElement('span'); x.className = 'x'; x.textContent = '×'; chars.appendChild(x); }
        chars.appendChild(document.createTextNode(c));
      });

      // 목록 보기의 번호, 정보표, 트랙리스트, 흐르는 띠
      $('#pvNo').textContent = pad(i + 1);
      $('#pvSide').textContent = side;
      $('#pvPair').textContent = p.title;
      $('#pvHex').textContent = (p.color || '#62b6e0').toUpperCase();
      rows.forEach((r, k) => r.firstChild.setAttribute('aria-current', k === i));
      if (mode === 'list') reveal(i);
      const t = `Now playing — ${flat(p.tagline || p.title)} — ${(p.chars || []).join(' × ')} — Side ${side} — 33⅓ RPM — `;
      const run = document.createElement('span');
      run.textContent = t.repeat(4);
      $('#pvTicker').replaceChildren(run, run.cloneNode(true));

      // 매번 레이아웃을 다시 계산하지 않도록 WAAPI로 바로 재생해요 (드래그 중 버벅임 방지)
      if (!reduce) {
        [...info.children].forEach((el, k) => el.animate(
          [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
          { duration: 450, delay: k * 40, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'backwards' }
        ));
        if (mode === 'list') $('.pv-no').animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.2, .8, .2, 1)' });
      }

      // 바이닐이 들어갔다 다시 나옴
      if (!reduce) {
        if (disc) disc.cancel();
        disc = $('#discWrap').animate(
          [{ transform: 'translateX(0%)' }, { transform: 'translateX(40%)' }],
          { duration: 650, easing: 'cubic-bezier(.2, .8, .2, 1)' }
        );
      }
    }

    // 진열 ↔ 목록
    function setMode(m) {
      if (m === mode) return;
      mode = m;
      pairView.classList.toggle('is-list', m === 'list');
      document.querySelectorAll('.pv-modes button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.mode === m));
      $('.pv-side').setAttribute('aria-hidden', m !== 'list');
      pos = target;
      if (m === 'list') reveal(current);
      else requestAnimationFrame(layout); // 커버 크기가 바뀌었으니 다시 놓아요
      filter();
    }
    document.querySelectorAll('.pv-modes button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));

    // 끌어서 넘기기 (진열에서만). 살짝 누르기만 하면 그냥 클릭이에요
    stage.addEventListener('pointerdown', (e) => {
      if (mode !== 'flow' || e.button !== 0) return;
      dragging = true; moved = false;
      startX = lastX = e.clientX; lastT = e.timeStamp;
      startPos = pos; vel = 0;
      kick();
    });
    stage.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        try { stage.setPointerCapture(e.pointerId); } catch {}
        stage.classList.add('dragging');
      }
      if (!moved) return;
      const per = a * 0.45; // 이만큼 끌면 한 장 넘어가요
      pos = clamp(startPos - dx / per, -0.45, N - 1 + 0.45);
      const dt = Math.max(e.timeStamp - lastT, 1);
      vel = vel * 0.6 + ((e.clientX - lastX) / dt) * 0.4;
      lastX = e.clientX; lastT = e.timeStamp;
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('dragging');
      if (moved) {
        const fling = (-vel * 220) / (a * 0.45);
        goTo(Math.round(pos + clamp(fling, -12, 12)));
      }
      kick();
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    // 끌고 난 뒤 손을 뗄 때 생기는 클릭은 무시해요 (커버가 열리지 않게)
    stage.addEventListener('click', (e) => {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
    }, true);

    // 휠 (목록에선 목록이 스크롤돼요)
    let acc = 0;
    pairView.addEventListener('wheel', (e) => {
      if (mode !== 'flow' || e.target.closest('.pv-results')) return;
      e.preventDefault();
      acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      while (Math.abs(acc) >= 40) {
        const step = Math.sign(acc);
        acc -= step * 40;
        goTo(Math.round(target) + step);
      }
    }, { passive: false });

    // 키보드
    addEventListener('keydown', (e) => {
      if (top() !== 'pair' || e.target === query) return;
      if (e.key === 'ArrowRight' || (mode === 'list' && e.key === 'ArrowDown')) { e.preventDefault(); goTo(Math.round(target) + 1); }
      if (e.key === 'ArrowLeft' || (mode === 'list' && e.key === 'ArrowUp')) { e.preventDefault(); goTo(Math.round(target) - 1); }
      if (e.key === 'Home') goTo(0);
      if (e.key === 'End') goTo(N - 1);
      if (e.key === '/') { e.preventDefault(); query.focus(); }
    });

    // 검색: 페어 이름, 문구, 캐릭터 이름, 코드네임 (띄어쓰기와 대소문자는 무시해요)
    const norm = (s) => s.toLowerCase().replace(/\s+/g, '');
    const hay = PAIRS.map((p) => norm([p.title, flat(p.tagline || ''), ...(p.chars || []), ...(p.codes || [])].join(' ')));
    let hits = [];
    function filter() {
      const q = norm(query.value);
      hits = q ? PAIRS.map((_, i) => i).filter((i) => hay[i].includes(q)) : [];
      // 목록: 맞는 줄만 남아요
      rows.forEach((r, i) => { r.hidden = !!q && !hits.includes(i); });
      $('#pvEmpty').hidden = !(q && !hits.length);
      // 진열: 검색창 아래로 결과가 펼쳐져요
      results.textContent = '';
      const drop = !!q && mode === 'flow';
      if (drop) {
        if (!hits.length) {
          const li = document.createElement('li');
          li.className = 'none';
          li.textContent = '찾는 페어가 없어요';
          results.appendChild(li);
        }
        hits.slice(0, 8).forEach((i) => {
          const p = PAIRS[i];
          const li = document.createElement('li');
          const b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('role', 'option');
          const th = document.createElement('span');
          th.className = 'th';
          th.appendChild(coverNode(p, i));
          const tx = document.createElement('span');
          tx.innerHTML = '<span class="t"></span><span class="c"></span>';
          tx.children[0].textContent = `${pad(i + 1)}  ${flat(p.tagline || p.title)}`;
          tx.children[1].textContent = [(p.chars || []).join(' × '), ...(p.codes || []).filter((c) => /[A-Z]/.test(c))].join(' · ');
          b.append(th, tx);
          b.addEventListener('click', () => pick(i));
          li.appendChild(b);
          results.appendChild(li);
        });
      }
      results.hidden = !drop;
    }
    function pick(i) {
      goTo(i);
      query.value = '';
      filter();
      query.blur();
    }
    query.addEventListener('input', filter);
    query.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && hits.length) {
        if (mode === 'flow') pick(hits[0]);
        else goTo(hits[0]); // 목록에선 걸러진 채로 첫 줄로 가요
      }
      if (e.key === 'ArrowDown' && !results.hidden) { e.preventDefault(); results.querySelector('button')?.focus(); }
      if (e.key === 'Escape' && query.value) { e.stopPropagation(); query.value = ''; filter(); }
    });
    results.addEventListener('keydown', (e) => {
      const btns = [...results.querySelectorAll('button')];
      const k = btns.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); btns[Math.min(k + 1, btns.length - 1)]?.focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (k > 0 ? btns[k - 1] : query).focus(); }
      if (e.key === 'Escape') { e.stopPropagation(); query.value = ''; filter(); query.focus(); }
    });
    // 검색창 밖으로 나가면 결과를 접어요
    $('#pvSearch').addEventListener('focusout', (e) => {
      if (!$('#pvSearch').contains(e.relatedTarget)) results.hidden = true;
    });
    query.addEventListener('focus', () => { if (query.value) filter(); });

    addEventListener('resize', () => { if (built) layout(); });

    // 들어올 때: 가운데에서 가까운 커버부터 차례로 떠올라요
    function enter() {
      layout();
      cards.forEach((el, i) => el.style.setProperty('--k', Math.min(Math.abs(i - current), 8)));
    }

    return { init, enter, pair: () => PAIRS[current] };
  })();

  // 큰 커버가 마우스를 따라 살짝 기울어져요
  if (matchMedia('(hover: hover)').matches && !reduce) {
    const album = $('#album');
    $('.pv-stage').addEventListener('pointermove', (e) => {
      const r = album.getBoundingClientRect();
      const x = clamp((e.clientX - (r.left + r.width / 2)) / r.width, -1, 1);
      const y = clamp((e.clientY - (r.top + r.height / 2)) / r.height, -1, 1);
      album.style.setProperty('--ty', `${x * 9}deg`);
      album.style.setProperty('--tx', `${-y * 7}deg`);
    });
    $('.pv-stage').addEventListener('pointerleave', () => {
      album.style.setProperty('--ty', '0deg');
      album.style.setProperty('--tx', '0deg');
    });
  }

  // 큰 커버를 누르면 그 페어의 사이트로 들어가요
  let toastT;
  let siteName = '';
  // 페어 사이트 열기 (바이닐 커버, 책 공용). back: 뒤로 가기 버튼에 적힐 이름
  function openSite(p, origin, back) {
    // 열 때마다 새 창으로 통째로 갈아 끼워요
    // (원래 창의 주소만 바꾸면 이전 사이트 기준으로 주소가 꼬이거나, 이전 페어가 잠깐 보였어요)
    const old = $('#siteFrame');
    const f = document.createElement('iframe');
    f.id = 'siteFrame';
    f.title = p.title;
    f.src = p.site;
    old.replaceWith(f);
    $('#siteBack').textContent = back;
    siteName = p.title;
    portal.style.setProperty('--pc', p.color || '#2f6fe0'); // 물결도 그 페어의 색으로
    return openView('site', origin);
  }
  function toast(el, text) {
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('show'), 1800);
  }
  $('#album').addEventListener('click', () => {
    const p = Records.pair();
    if (p && p.site) { openSite(p, $('#album'), 'Fearless'); return; }
    toast($('#toast'), '페어 페이지는 준비 중이에요');
  });

  /* ───────── 책장 (Something else) ───────── */
  const Shelf = (() => {
    const row = $('#shelfRow');
    const view = views.shelf;
    const books = [];
    let built = false, current = -1, pulled = null;
    // 책마다 두께와 키가 조금씩 달라요 (매번 같은 모양이 되도록 순서로 정해요)
    const W = [74, 62, 82, 58, 70, 78, 60];
    const H = [.92, .84, .96, .8, .88, .9, .82];

    function init() {
      if (built) return;
      built = true;
      $('#svTotal').textContent = pad(BOOKS.length);
      BOOKS.forEach((p, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'book' + (p.site ? '' : ' blank');
        b.setAttribute('role', 'listitem');
        b.setAttribute('aria-label', flat(p.tagline || p.title));
        b.style.setProperty('--c', p.color || '#6b2a30');
        b.style.setProperty('--w', `${W[i % W.length]}px`);
        b.style.setProperty('--h', H[i % H.length]);
        const t = document.createElement('span');
        t.className = 'book-title';
        t.textContent = p.spine || p.title;
        if (p.spine) t.lang = 'en';
        b.appendChild(t);
        b.addEventListener('pointerenter', () => select(i));
        b.addEventListener('focus', () => select(i));
        b.addEventListener('click', () => open(i));
        row.appendChild(b);
        books.push(b);
      });
      select(Math.max(0, BOOKS.findIndex((p) => p.site)));
    }

    function select(i) {
      if (i === current) return;
      current = i;
      const p = BOOKS[i];
      books.forEach((b, k) => b.classList.toggle('sel', k === i));
      $('#svIndex').textContent = pad(i + 1);
      view.style.setProperty('--accent', p.color || '#6b2a30');
      $('#svKicker').textContent = `VOL. ${pad(i + 1)}`;
      $('#svTitle').textContent = p.tagline || p.title;
      const chars = $('#svChars');
      chars.textContent = '';
      (p.chars || []).forEach((c, k) => {
        if (k) { const x = document.createElement('span'); x.className = 'x'; x.textContent = '×'; chars.appendChild(x); }
        chars.appendChild(document.createTextNode(c));
      });
      if (!reduce) {
        [...$('.sv-info').children].forEach((el, k) => el.animate(
          [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
          { duration: 450, delay: k * 40, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'backwards' }
        ));
      }
    }

    async function open(i) {
      select(i);
      const p = BOOKS[i];
      if (!p.site) { toast($('#svToast'), '아직 쓰는 중인 책이에요'); return; }
      if (pulled) return;
      pulled = books[i];
      pulled.classList.add('pulled');
      await wait(380);
      await openSite(p, pulled, 'Something else');
    }

    // 사이트에서 돌아오면 책을 다시 꽂아요
    function putBack() { if (pulled) { pulled.classList.remove('pulled'); pulled = null; } }

    // 화살표로도 고를 수 있어요
    addEventListener('keydown', (e) => {
      if (top() !== 'shelf' || !books.length) return;
      if (e.key === 'ArrowRight') books[Math.min(current + 1, books.length - 1)].focus();
      if (e.key === 'ArrowLeft') books[Math.max(current - 1, 0)].focus();
    });

    // 들어올 때: 왼쪽 책부터 차례로 꽂혀요
    function enter() { books.forEach((b, k) => b.style.setProperty('--k', k)); }

    return { init, enter, putBack, picked: () => pulled || books[current] || row };
  })();

  // 바탕화면(js/desktop.js)이 이걸로 화면을 열어요
  window.SiteNav = {
    open: (name, origin) => { if (!stack.length) homeOrigin = origin || null; return openView(name, origin); },
    isOpen: () => stack.length > 0,
    stack: () => stack.slice(),
    site: () => siteName, // 지금 열린 페어 사이트 이름
    back: goBack,
    home: () => { for (let k = stack.length; k > 0; k--) goBack(); },
  };
})();
