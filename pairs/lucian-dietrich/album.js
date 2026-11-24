// 시기 탭 + 도판 모음
// - 탭을 누르면 그 시기의 소개 문단과 그림으로 바뀌어요
// - 그림은 각 시기 안의 .era-plates 목록에서 읽어요 (첫 그림이 대표)
(() => {
  const main = document.getElementById('main');
  const thumbs = document.getElementById('thumbs');
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(src, alt) {
    main.classList.remove('swap');
    main.src = src;
    main.alt = alt;
    if (reduce) return;
    main.offsetWidth; // 연출을 처음부터 다시
    main.classList.add('swap');
  }

  function openEra(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    const plates = [...panel.querySelectorAll('.era-plates li')];
    thumbs.textContent = '';
    plates.forEach((p, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(i === 0));
      b.setAttribute('aria-label', `도판 ${i + 1}`);
      const img = document.createElement('img');
      img.src = p.dataset.src;
      img.alt = '';
      b.appendChild(img);
      b.addEventListener('click', () => {
        if (b.getAttribute('aria-pressed') === 'true') return;
        thumbs.querySelectorAll('button').forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
        show(p.dataset.src, p.dataset.alt);
      });
      li.appendChild(b);
      thumbs.appendChild(li);
    });
    thumbs.hidden = plates.length < 2; // 그림이 하나뿐이면 작은 도판은 숨겨요
    show(plates[0].dataset.src, plates[0].dataset.alt);
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { if (t.getAttribute('aria-selected') !== 'true') openEra(t); });
    // 좌우 화살표로 탭 옮기기
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus();
      openEra(next);
    });
  });
  openEra(tabs[0]);
})();
