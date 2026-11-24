(() => {
  const $ = (s) => document.querySelector(s);
  // 책장 화면 안(iframe)에서 열렸으면 기록을 쌓지 않고 이동해요 (안 그러면 ‹ Something else가 책장으로 안 나가요)
  const embedded = window.top !== window;
  const go = (href) => (embedded ? location.replace(href) : (location.href = href));
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const single = matchMedia('(max-width: 760px), (max-aspect-ratio: 4/5)');
  const L = $('#pageL');
  const R = $('#pageR');
  const book = $('#book');

  // 책의 내용: <template id="spreads"> 안의 장들을 읽어 와요
  const SPREADS = [...$('#spreads').content.querySelectorAll('.spread')].map((s) => ({
    l: s.querySelector('[data-side="l"]'),
    r: s.querySelector('[data-side="r"]'),
  }));
  // 휴대폰에서는 왼쪽·오른쪽 쪽을 한 줄로 이어서 한 쪽씩 넘겨요
  const PAGES = SPREADS.flatMap((s) => [s.l, s.r]);
  const one = () => single.matches;
  const count = () => (one() ? PAGES.length : SPREADS.length);

  let at = 0;      // 지금 펼친 장(휴대폰이면 쪽)
  let busy = false;
  const put = (el, node) => { el.textContent = ''; if (node) el.appendChild(node.cloneNode(true)); };

  function render() {
    if (one()) { put(R, PAGES[at]); L.textContent = ''; }
    else { put(L, SPREADS[at].l); put(R, SPREADS[at].r); }
    $('#pgNo').textContent = `${at + 1} / ${count()}`;
    $('#prev').disabled = at === 0;
    $('#next').disabled = at === count() - 1;
  }

  /* ───────── 한 장 넘기기 ───────── */
  // 손으로 넘기듯: 천천히 들어 올렸다가 → 가운데서 빨라지고 → 사뿐히 내려앉아요
  const DUR = 1100;
  const EASE = 'cubic-bezier(.45, .05, .3, 1)';
  const run = (el, frames, dur = DUR) => el.animate(frames, { duration: dur, easing: EASE, fill: 'forwards' }).finished;

  /* ───────── 표지 펼치기 ───────── */
  // 표지 안쪽 면에 첫 장의 왼쪽 쪽(도판)을 붙여 둬요 → 표지가 내려앉으면 그게 곧 왼쪽 쪽
  const cover = $('#cover');
  const cvFront = cover.querySelector('.cv-front');
  const cvBack = cover.querySelector('.cv-back');
  cvBack.appendChild(SPREADS[0].l.cloneNode(true));
  const shadeOf = (face) => face.appendChild(Object.assign(document.createElement('i'), { className: 'cv-shade' }));
  const frontShade = shadeOf(cvFront);
  const backShade = shadeOf(cvBack);

  // 책이 떠오르는 중에 누르면 연출이 끊기니까, 다 내려앉은 다음부터 열려요
  let ready = reduce;
  book.addEventListener('animationend', () => { ready = true; }, { once: true });

  async function openBook(instant) {
    if (!body.classList.contains('closed')) return;
    if (!instant && !ready) return;
    // 마우스를 올려 살짝 들린 각도에서부터 (행렬로 이으면 반대로 돌아 버려서 각도로 이어요)
    const m = new DOMMatrix(getComputedStyle(cover).transform);
    const start = `translateZ(1px) rotateY(${Math.atan2(-m.m13, m.m11) * 180 / Math.PI}deg)`;
    const bookFrom = getComputedStyle(book).transform; // 떠오르던 연출이 끝난 자리에서 가운데로 미끄러지게
    cover.style.transition = 'none';
    body.classList.remove('closed');
    body.classList.add('opening-book');
    render();
    if (!instant && !reduce) {
      const D = 1500;
      const E = 'cubic-bezier(.5, .05, .25, 1)';
      const go = (el, frames) => el.animate(frames, { duration: D, easing: E, fill: 'forwards' }).finished;
      if (!one()) book.animate([{ transform: bookFrom }, { transform: 'none' }], { duration: 1300, easing: 'cubic-bezier(.3, .7, .2, 1)' });
      if (one()) {
        // 한 쪽씩일 땐 왼쪽 쪽이 없으니, 표지가 들리며 스르륵 사라져요
        await Promise.all([
          go(cover, [{ transform: start, opacity: 1 }, { transform: 'translateZ(1px) rotateY(-70deg)', opacity: 1, offset: .5 }, { transform: 'translateZ(1px) rotateY(-110deg)', opacity: 0 }]),
          go(frontShade, [{ opacity: 0 }, { opacity: .9 }]),
        ]);
      } else {
        await Promise.all([
          go(cover, [{ transform: start }, { transform: 'translateZ(1px) rotateY(-180deg)' }]),
          // 들어 올린 가죽은 빛을 등지며 어두워지고, 안쪽 면은 내려앉으며 밝아져요
          go(frontShade, [{ opacity: 0 }, { opacity: .9, offset: .5 }, { opacity: .9 }]),
          go(backShade, [{ opacity: .85 }, { opacity: .85, offset: .5 }, { opacity: 0 }]),
          cast(R, [
            { opacity: 0, transform: 'scaleX(1)' },
            { opacity: .9, transform: 'scaleX(.7)', offset: .3 },
            { opacity: 0, transform: 'scaleX(.1)', offset: .55 },
            { opacity: 0, transform: 'scaleX(.1)' },
          ]),
        ]);
      }
    }
    body.classList.add('opened');
  }
  cover.addEventListener('click', () => openBook());
  // 캐릭터 페이지에서 돌아올 땐 바로 펼친 채로 (#open-1 이면 그 장을 펼쳐서)
  const back = location.hash.match(/^#open(?:-(\d+))?$/);
  if (back) {
    body.classList.add('instant');
    at = Math.min(+(back[1] || 0), SPREADS.length - 1);
    if (one()) at *= 2;
    openBook(true);
  }

  // 넘어가는 종이 한 장: 앞면은 지금 쪽, 뒷면은 다음(또는 앞) 쪽. 면마다 접히는 그늘이 있어요
  function makeLeaf(side, front, back) {
    const leaf = document.createElement('div');
    leaf.className = `leaf ${side}`;
    const shades = [['front', front], ['back', back]].map(([k, node]) => {
      const f = document.createElement('div');
      f.className = `face ${k}`;
      if (node) f.appendChild(node.cloneNode(true));
      const shade = document.createElement('i');
      shade.className = 'shade';
      f.appendChild(shade);
      leaf.appendChild(f);
      return shade;
    });
    book.appendChild(leaf);
    return { leaf, front: shades[0], back: shades[1] };
  }
  // 넘어가는 장이 아래 쪽 위로 드리우는 그림자 (넘기는 동안만 잠깐)
  function cast(page, frames) {
    const c = document.createElement('i');
    c.className = 'cast';
    page.appendChild(c);
    return run(c, frames).then(() => c.remove());
  }
  // 양쪽 펼침: 한 장이 책등을 축으로 반대편까지 넘어가요
  function turnSpread(fwd, leaf) {
    const deg = fwd ? -180 : 180;
    const from = fwd ? R : L; // 드러나는 쪽
    const onto = fwd ? L : R; // 내려앉는 쪽
    return Promise.all([
      run(leaf.leaf, [
        { transform: 'rotateY(0deg)' },
        { transform: `rotateY(${deg * .5}deg)`, offset: .5 },
        { transform: `rotateY(${deg}deg)` },
      ]),
      // 들어 올린 면은 빛을 등지며 어두워지고, 넘어온 면은 내려앉으며 밝아져요
      run(leaf.front, [{ opacity: 0 }, { opacity: .85, offset: .5 }, { opacity: .85 }]),
      run(leaf.back, [{ opacity: .85 }, { opacity: .85, offset: .5 }, { opacity: 0 }]),
      cast(from, [
        { opacity: 0, transform: 'scaleX(1)' },
        { opacity: .9, transform: 'scaleX(.75)', offset: .3 },
        { opacity: 0, transform: 'scaleX(.1)', offset: .55 },
        { opacity: 0, transform: 'scaleX(.1)' },
      ]),
      cast(onto, [
        { opacity: 0, transform: 'scaleX(.1)' },
        { opacity: 0, transform: 'scaleX(.1)', offset: .45 },
        { opacity: .8, transform: 'scaleX(.7)', offset: .75 },
        { opacity: 0, transform: 'scaleX(1)' },
      ]),
    ]);
  }
  // 한 쪽씩(휴대폰): 왼쪽엔 쪽이 없으니, 넘기는 쪽이 들리며 스르륵 사라지고 / 앞 쪽은 거꾸로 내려앉아요
  function turnSingle(fwd, leaf) {
    const up = [{ transform: 'rotateY(0deg)', opacity: 1 }, { transform: 'rotateY(-60deg)', opacity: 1, offset: .45 }, { transform: 'rotateY(-105deg)', opacity: 0 }];
    const shade = [{ opacity: 0 }, { opacity: .8 }];
    const dur = DUR * .8;
    return Promise.all([
      run(leaf.leaf, fwd ? up : [...up].reverse().map((f, i) => ({ ...f, offset: [0, .55, 1][i] })), dur),
      run(leaf.front, fwd ? shade : [...shade].reverse(), dur),
      cast(R, fwd
        ? [{ opacity: .7, transform: 'scaleX(.9)' }, { opacity: 0, transform: 'scaleX(.1)' }]
        : [{ opacity: 0, transform: 'scaleX(.1)' }, { opacity: .7, transform: 'scaleX(.9)', offset: .8 }, { opacity: 0, transform: 'scaleX(1)' }]),
    ]);
  }

  async function flip(to) {
    if (busy || to === at || to < 0 || to >= count() || body.classList.contains('closed')) return;
    busy = true;
    const fwd = to > at;
    if (reduce) { at = to; render(); busy = false; return; }
    if (one()) {
      if (fwd) {
        const leaf = makeLeaf('right', PAGES[at], null);
        put(R, PAGES[to]);
        await turnSingle(true, leaf);
        leaf.leaf.remove();
      } else {
        // 앞 쪽이 들려 있던 자리에서 내려와 덮어요
        const leaf = makeLeaf('right', PAGES[to], null);
        await turnSingle(false, leaf);
        put(R, PAGES[to]);
        leaf.leaf.remove();
      }
    } else if (fwd) {
      const leaf = makeLeaf('right', SPREADS[at].r, SPREADS[to].l);
      put(R, SPREADS[to].r);
      await turnSpread(true, leaf);
      put(L, SPREADS[to].l);
      leaf.leaf.remove();
    } else {
      const leaf = makeLeaf('left', SPREADS[at].l, SPREADS[to].r);
      put(L, SPREADS[to].l);
      await turnSpread(false, leaf);
      put(R, SPREADS[to].r);
      leaf.leaf.remove();
    }
    at = to;
    render();
    busy = false;
  }

  $('#next').addEventListener('click', () => flip(at + 1));
  $('#prev').addEventListener('click', () => flip(at - 1));
  addEventListener('keydown', (e) => {
    if (body.classList.contains('closed') && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight')) { if (e.target === document.body) { e.preventDefault(); openBook(); } return; }
    if (e.key === 'ArrowRight') flip(at + 1);
    if (e.key === 'ArrowLeft') flip(at - 1);
  });

  // 쓸어 넘기기
  let sx = null, sy = 0;
  book.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
  addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) flip(at + (dx < 0 ? 1 : -1));
  });

  // 쪽 안의 링크: 차례(data-to)는 그 장으로, 캐릭터(data-go)는 그 페이지로
  book.addEventListener('click', (e) => {
    const toc = e.target.closest('[data-to]');
    if (toc) {
      e.preventDefault();
      const spread = +toc.dataset.to;
      flip(one() ? spread * 2 : spread);
      return;
    }
    const link = e.target.closest('[data-go]');
    if (link) { e.preventDefault(); go(link.getAttribute('href')); }
  });

  // 화면이 한 쪽 ↔ 양쪽으로 바뀌면 지금 보던 자리를 이어서
  single.addEventListener('change', () => {
    at = one() ? at * 2 : Math.floor(at / 2);
    if (!body.classList.contains('closed')) render();
  });

  addEventListener('pageshow', (e) => { if (e.persisted) busy = false; });
})();
