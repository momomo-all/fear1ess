// ───────────────── FL-OS 단말기 (모든 Fearless 페어 공통) ─────────────────
// 페어 페이지에서 이렇게 불러요:
//   <script src="flos-data.js"></script>      ← 페어별 내용 (window.FLOS)
//   <script src="../../js/flos.js"></script>  ← 이 파일
// 화면 오른쪽 아래 FL-OS 버튼이 생기고, 누르면 단말기가 떠요.
// 단말기는 페이지와 분리된 칸(Shadow DOM)에 그려서 페어 스타일과 섞이지 않아요.
(() => {
  const D = window.FLOS;
  if (!D) return;
  const HERE = document.currentScript.src;
  const CSS = new URL('../css/flos.css', HERE).href;

  // ───────── 국내 게이트 (모든 페어 공통) ─────────
  // 페어마다 출격하는 게이트가 하나씩 있고, 다른 페어 지도에는 "대응 중"으로 보여요.
  // lon/lat = 경도/위도, cls = 등급 (SS / S / A / B / C / ?)
  const GATES = [
    { pair: 'sawol-jaehun', codes: 'MUSTANG / SOL', place: '서울 마포구 상공', lon: 126.90, lat: 37.56, cls: 'A' },
    { pair: 'yungang-gyuna', codes: 'KITTY / PANTHER', place: '인천 송도 해안', lon: 126.65, lat: 37.38, cls: 'A' },
    { pair: 'kangwoo-junhee', codes: 'BLANC / VIOLET', place: '강릉 경포 해변', lon: 128.90, lat: 37.80, cls: 'S' },
    { pair: 'yunje-ijae', codes: 'CHASER / RIVER', place: '파주 비무장지대 인근', lon: 126.78, lat: 37.92, cls: 'SS' },
    { pair: 'hwi-hyunwoo', codes: 'PRIDE / GLORY', place: '수원 화성 일대', lon: 127.01, lat: 37.27, cls: 'A' },
    { pair: 'raphael-serena', codes: 'SERENA / RAPHAEL', place: '대구 중구 상공', lon: 128.60, lat: 35.87, cls: 'A' },
    { pair: 'yophiel-burning', codes: 'BURNING / YOPHIEL', place: '경주 토함산', lon: 129.33, lat: 35.79, cls: '?' },
    { pair: 'geonwoo-jaeha', codes: 'GISELLE / STEEL', place: '울산 산업단지', lon: 129.36, lat: 35.50, cls: 'S' },
    { pair: 'domin-baekhyun', codes: 'CHERVIL / TOMA', place: '춘천 의암호', lon: 127.68, lat: 37.88, cls: 'A' },
    { pair: 'yeoreum-sena', codes: 'SIREN / SUMMER', place: '부산 해운대 앞바다', lon: 129.17, lat: 35.15, cls: 'A' },
    { pair: 'junan-jaeeun', codes: 'DIOR / SMILE', place: '청주 상당구', lon: 127.49, lat: 36.64, cls: 'A' },
    { pair: 'yako-maddog', codes: 'MAD DOG / 野狐', place: '언더하운드 외곽 (위치 비공개)', lon: 126.30, lat: 34.80, cls: 'S' },
    { pair: 'sehyun-yunwoo', codes: 'SIEG / X', place: '포항 영일만', lon: 129.40, lat: 36.05, cls: 'A' },
    { pair: 'dojin-hyunyul', codes: 'PULSE / NOVA', place: '대전 유성구', lon: 127.36, lat: 36.36, cls: 'S' },
    { pair: 'taeo-banhee', codes: 'BURST / LUCA', place: '광주 북구', lon: 126.89, lat: 35.17, cls: 'A' },
    { pair: null, place: '제주 서귀포 상공', lon: 126.53, lat: 33.30, cls: '?', anomaly: true },
  ];
  const SCALE = { SS: '초대형 · 측정 한계 초과', S: '대형 · 반경 약 500m', A: '대형 · 반경 약 300m', B: '중형', C: '소형', '?': '측정 불가' };
  const OTHER = ['대응 중', '봉쇄 중', '진입 중', '안정화 단계'];
  const CLS = { SS: '#ff5a6e', S: '#ff7a68', A: '#ff9a6a', B: '#f2b04c', C: 'rgba(241, 240, 238, .7)', '?': '#9aa8ff' };
  const XY = (g) => [(g.lon - 125.5) * 28, (38.8 - g.lat) * 34];

  // ───────── 도움 함수 ─────────
  const pad = (n) => String(n).padStart(2, '0');
  const hhmm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const ago = (m) => hhmm(new Date(Date.now() - m * 60000));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
  // 얼굴 칸: 그림(1216×832)을 크게 키워서 얼굴(fx, fy)이 칸 가운데 오게
  const faceStyle = (p, zoom = 4.2, boxH = 1) => {
    if (p.avatar) return `background-image:url('${p.avatar}');background-size:cover;background-position:center ${boxH === 1 ? 'center' : 'top'}`;
    const [fx, fy] = p.face || [.5, .25];
    const iw = zoom, ih = zoom * 832 / 1216;
    const cl = (v) => Math.max(0, Math.min(1, v)) * 100;
    const px = cl((fx * iw - .5) / (iw - 1)), py = cl((fy * ih - boxH / 2) / (ih - boxH));
    return `background-image:url('${p.img}');background-size:${zoom * 100}% auto;background-position:${px}% ${py}%`;
  };
  const face = (p, cls = 'face') => `<span class="${cls}" style="${faceStyle(p)}"></span>`;
  const ME = D.me, TH = D.them;
  // 단말기 문구: 기본값 + 페어별 flow (빌런 페어처럼 흐름이 다른 경우)
  const T = {
    standby: 'STANDBY', standbyGo: '▶ SCAN에서 게이트 확인', done: 'DEPLOYED', doneGo: '출격 완료 · 임무 수행 중',
    link: 'LINKED', linkDone: 'IN FIELD', linkRed: false, openerSub: '출동 명령 수신', openerDone: '임무 수행 중',
    alert: 'ALERT // ACTION REQUIRED', ask: '출격하시겠습니까?', askBtn: '▶ 출격',
    loadHead: 'MISSION DISPATCH // INITIALIZING', ld1: `› TARGET LOCKED · {id} · <em>{place}</em>`, ld2: `› 페어 동기화 중... <em>${ME.name} ↔ ${TH.name}</em>`,
    chips: ['HANDSHAKE OK', 'ROUTE LOCKED', 'CHANNEL OPEN'],
    okHead: 'SYSTEM // DISPATCH CONFIRMED', okBtn: '▶ CONTINUE <small>/ 통신 채널 열기</small>',
    commEnd: '— 출격 대기 완료 —', commBtn: '▶ 출격', target: '▶ 출격 대상', footR: 'LINK STABLE',
    ...(D.flow || {}),
  };
  const fill = (t, g) => t.replace('{id}', g.id).replace('{place}', g.place);
  const statusOf = (p) => p.status || (p === ME ? 'YOU' : 'PAIRED');
  const statusCls = (p) => p.statusCls || (p === ME ? '' : 'ac');
  const who = (k) => (k === 'me' ? ME : TH);

  // 내 게이트 + 다른 페어 게이트 몇 개 (서로 겹치지 않게)
  const mine = GATES.find((g) => g.pair === D.id) || GATES[0];
  const shown = [mine];
  let seed = [...D.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const pool = GATES.filter((g) => g !== mine && !g.anomaly).map((g) => [rnd(), g]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  for (const g of pool) {
    if (shown.length >= 6) break;
    const [x, y] = XY(g);
    if (shown.every((s) => { const [sx, sy] = XY(s); return Math.hypot(sx - x, sy - y) > 15; })) shown.push(g);
  }
  shown.push(GATES.find((g) => g.anomaly));
  const gates = shown.map((g, i) => {
    const id = g.anomaly ? 'AN-KR-0042' : `GT-KR-${String(401 + GATES.indexOf(g)).padStart(4, '0')}`;
    const mission = g === mine;
    return {
      ...g, id, mission,
      state: mission ? (D.mission?.state || '확장 중') : g.anomaly ? '미확인 반응' : OTHER[i % OTHER.length],
      size: SCALE[g.cls],
      note: mission ? '' : g.anomaly ? '분석 중 · 등급 판정 보류' : `${g.codes} ${OTHER[i % OTHER.length]}`,
      log: mission ? (D.mission?.log?.map(([t, x]) => [typeof t === 'number' ? ago(t) : t, x]) || [[ago(7), '공간 균열 감지'], [ago(4), `${g.cls}급 판정 · 주변 대피 개시`], [ago(2), `${TH.code} / ${ME.code} 출격 대상 지정`]])
        : g.anomaly ? [[ago(3), '정체불명 신호 · 등급 판정 보류']] : [[ago(30 + i * 7), '균열 감지'], [ago(12 + i * 3), `${g.codes} 현장 도착`]],
    };
  });

  // ───────── 화면 만들기 ─────────
  const ICON = {
    term: '<svg class="i" viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="13"/><path d="M7 9l3 2.5L7 14M12 14h4M9 20.5h6"/></svg>',
    home: '<svg class="i" viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9H4z"/></svg>',
    scan: '<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/></svg>',
    mail: '<svg class="i" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13"/><path d="M3 6.5l9 7 9-7"/></svg>',
    story: '<svg class="i" viewBox="0 0 24 24"><path d="M7 4h11a2 2 0 0 1 0 4h-1.5v10a2 2 0 0 1-2 2H5a2 2 0 0 1 0-4h1V6a2 2 0 0 1 2-2"/><path d="M16.5 8H8.5M9 11.5h5M9 14.5h5"/></svg>',
    people: '<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.8"/><path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5"/></svg>',
    power: '<svg class="i" viewBox="0 0 24 24"><path d="M12 3v8"/><path d="M6.3 6.8a8 8 0 1 0 11.4 0"/></svg>',
    rescan: '<svg class="i" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/></svg>',
    search: '<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  };
  // 글꼴은 페이지에 한 번만 (분리된 칸 안에서도 쓸 수 있어요)
  if (!document.querySelector('link[data-flos-font]')) {
    const f = document.createElement('link');
    f.rel = 'stylesheet'; f.dataset.flosFont = '';
    f.href = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Nanum+Gothic+Coding:wght@400;700&display=swap';
    document.head.append(f);
  }
  const host = document.createElement('div');
  host.id = 'flos';
  document.body.append(host);
  const S = host.attachShadow({ mode: 'open' });
  S.innerHTML = `
    <link rel="stylesheet" href="${CSS}">
    <div class="root" style="--pair:${D.color}">
      <button class="opener" type="button" id="opener" aria-label="FL-OS 단말기 열기">${ICON.term}<span class="op-t"><span class="op-n">FL-OS</span><small id="openerSub">출동 명령 수신</small></span><b id="openerBadge"></b></button>
      <div class="wrap" id="wrap" hidden>
        <section class="os" role="dialog" aria-modal="true" aria-label="FEARLESS 단말기">
          <header class="top">
            <p class="crumb"><b>FL-OS</b><span>/</span><b id="crumb">BOOT</b></p>
            <span class="sp"></span>
            <span class="sig" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <span id="clock">00:00:00</span>
            <button class="pw" type="button" id="pw" aria-label="단말기 끄기">${ICON.power}</button>
          </header>
          <div class="me">
            ${face(ME)}
            <div><p class="me-name">${ME.name}<small>${ME.code}</small></p><p class="me-sub">${ME.role || `FEARLESS · ${ME.cls}`}</p></div>
            <p class="clr">CLEARANCE<b>${ME.rank}</b></p>
          </div>
          <div class="body">
            <div class="view" data-view="boot"><div class="boot" id="boot"></div></div>
            <div class="view" data-view="home" id="home"></div>
            <div class="view" data-view="scan">
              <div class="scanbar">
                <span class="seg cur">국내 DOMESTIC</span><span class="seg">국외 FOREIGN</span><span class="sp"></span>
                <button class="re" type="button" id="rescan">${ICON.rescan}RESCAN</button>
              </div>
              <div class="radar" id="radar">
                <div class="grid"></div>
                <svg class="rings" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><circle cx="50" cy="50" r="16"/><circle cx="50" cy="50" r="32"/><circle cx="50" cy="50" r="48"/><circle cx="50" cy="50" r="64"/></svg>
                <div class="sweep" aria-hidden="true"></div>
                <div class="map" id="map"></div>
                <div class="searching" aria-live="polite">${ICON.search}<b id="scanState">SEARCHING...</b><small>SCANNING DOMESTIC GATE NETWORK</small></div>
                <i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>
                <aside class="ginfo" id="ginfo" aria-live="polite"></aside>
              </div>
              <p class="legend" id="legend"></p>
            </div>
            <div class="view" data-view="mail"><p class="toast" id="mailToast" role="status"></p><div id="mail"></div></div>
            <div class="view" data-view="letter" id="letter"></div>
            <div class="view" data-view="story" id="story"></div>
            <div class="view" data-view="record" id="record"></div>
            <div class="view" data-view="people" id="people"></div>
            <div class="view" data-view="person" id="person"></div>
          </div>
          <nav class="dock" aria-label="단말기 메뉴">
            <button type="button" data-go="home">${ICON.home}HOME</button>
            <button type="button" data-go="scan" class="hot">${ICON.scan}SCAN</button>
            <button type="button" data-go="mail">${ICON.mail}MAIL<i class="n" id="dot"></i></button>
            <button type="button" data-go="story">${ICON.story}STORY</button>
            <button type="button" data-go="people">${ICON.people}CONTACTS</button>
          </nav>
          <footer class="foot"><span>FEARLESS HQ · ENCRYPTED CHANNEL</span><span>${T.footR}</span></footer>

          <div class="ovl" id="ovLoad" role="status">
            <div class="ld">
              <p class="h"><span>${T.loadHead}</span><span id="ldPct">0%</span></p>
              <p class="ln" id="ld1"></p><p class="ln" id="ld2"></p>
              <div class="bar"><i id="ldBar"></i></div>
              <p class="chips">${T.chips.map((c, i) => `<span id="ch${i + 1}">${c}</span>`).join('')}</p>
            </div>
          </div>
          <div class="ovl" id="ovOk" role="alertdialog" aria-labelledby="okSay">
            <div class="zm">
              <p class="h">${T.okHead}</p>
              <p class="say" id="okSay"></p><p class="tg" id="okTg"></p>
              <button class="cont" type="button" id="okGo">${T.okBtn}</button>
            </div>
          </div>
          <div class="ovl" id="ovComm" role="dialog" aria-label="보안 통신">
            <div class="cm">
              <p class="cm-h"><span>SECURE LINE · ${TH.code} ↔ ${ME.code}</span><span class="t">T−00:03:00</span></p>
              <div class="cm-b" id="cmBody" aria-live="polite"></div>
              <p class="cm-f"><span>CHANNEL ENCRYPTED</span><button type="button" id="cmEnd" hidden>${T.commBtn}</button></p>
            </div>
          </div>
        </section>
      </div>
    </div>`;

  // ───────── 동작 ─────────
  const $ = (id) => S.getElementById(id);
  const $$ = (q) => [...S.querySelectorAll(q)];
  const root = S.querySelector('.root'), wrap = $('wrap');
  const read = new Set();
  let run = 0, scanRun = 0, cur = 'boot', deployed = false, scanned = false, last = null;
  const NAMES = { boot: 'BOOT', home: 'HOME', scan: 'SCAN / DOMESTIC', mail: 'MAIL', letter: 'MAIL / READ', story: 'STORY', record: 'STORY / RECORD', people: 'CONTACTS', person: 'CONTACTS / FILE' };
  const PARENT = { letter: 'mail', person: 'people', record: 'story' };
  const mails = [...(D.mails || [])];
  const incoming = D.incoming || []; // 메일함을 열면 나중에 도착하는 메일
  let arrived = 0, arriving = false, mailRun = 0;
  const unreadN = () => mails.filter((m) => !read.has(m)).length;
  const today = () => { const d = new Date(); return `${d.getFullYear()}. ${pad(d.getMonth() + 1)}. ${pad(d.getDate())}.`; };

  setInterval(() => { const d = new Date(); $('clock').textContent = `${hhmm(d)}:${pad(d.getSeconds())}`; }, 1000);

  function go(name) {
    cur = name;
    $$('.view').forEach((v) => v.classList.toggle('on', v.dataset.view === name));
    $('crumb').textContent = NAMES[name];
    const tab = PARENT[name] || name;
    $$('.dock button').forEach((b) => b.classList.toggle('cur', b.dataset.go === tab));
    const v = S.querySelector(`.view[data-view="${name}"]`);
    if (v) v.scrollTop = 0;
    if (name === 'scan' && !scanned) startScan();
    if (name === 'mail') runIncoming();
  }

  // 부팅
  const BOOT = D.boot || [
    ['FL-OS KERNEL', 'LOADED'],
    [`${ME.code} ACCESS — ${ME.cls} BIOMETRICS`, 'OK'],
    [`${TH.code} ACCESS — ${TH.cls} BIOMETRICS`, 'OK'],
    [`PAIR LINK ${TH.code} / ${ME.code}`, 'ESTABLISHED'],
  ];
  async function boot() {
    const id = ++run;
    $('boot').innerHTML = BOOT.map(([l]) => `<p>&gt; ${l} <span class="dots"></span> <b></b><span class="track"><i></i></span></p>`).join('') + '<p class="ok">ACCESS GRANTED</p>';
    go('boot');
    const rows = [...$('boot').querySelectorAll('p')];
    for (let i = 0; i < BOOT.length; i++) {
      await wait(i ? 160 : 450); if (id !== run) return;
      const r = rows[i];
      r.classList.add('v');
      r.querySelector('.track i').style.width = '100%';
      for (let k = 0; k < 3; k++) { await wait(170); if (id !== run) return; r.querySelector('.dots').textContent += '.'; }
      await wait(200); if (id !== run) return;
      r.querySelector('b').textContent = BOOT[i][1];
    }
    await wait(250); if (id !== run) return;
    rows[rows.length - 1].classList.add('v');
    await wait(900); if (id !== run) return;
    go('home');
  }
  $('boot').addEventListener('click', () => { if (cur === 'boot') { run++; go('home'); } });

  // 홈
  function renderHome() {
    const unread = unreadN();
    const m = mails[0];
    $('home').innerHTML = `
      <p class="lbl"><span>PRIORITY-1 · DISPATCH</span><span>${ago(2)} 발령</span></p>
      <button class="dispatch${deployed ? ' done' : ''}" type="button" id="toScan">
        <span class="tag">출동 명령 · FEARLESS HQ</span>
        <span class="ttl">${D.dispatch || '게이트 발생 — 페어 출격 대기'}</span>
        <span class="meta">위험도 <em>${mine.cls}</em> · ${mine.place} · ${TH.code} / ${ME.code}</span>
        <span class="go">${deployed ? T.doneGo : T.standbyGo}</span>
        <span class="t">STATUS<b>${deployed ? T.done : T.standby}</b></span>
      </button>
      <div class="grid2">
        <div>
          <p class="lbl"><span>INBOX</span><b>${unread ? `${unread} UNREAD` : mails.length ? 'ALL READ' : 'EMPTY'}</b></p>
          ${m ? `<button class="pane mailprev${unread ? '' : ' read'}" type="button" id="prev">
            <span class="from"><span>FROM ${m.from}</span><span class="n">${read.has(m) ? 'READ' : 'NEW'}</span></span>
            <span class="subj">${m.title}</span>
            <span class="ex">${m.body.map((b) => [].concat(b)[0]).find((t) => t.length > 20) || m.body[0]}</span>
            <span class="go">OPEN &gt;</span>
          </button>` : '<div class="pane none" style="min-height:160px">NO MESSAGE</div>'}
        </div>
        <div>
          <p class="lbl"><span>PAIR LINK</span><b>${TH.rank} · ${ME.rank}</b></p>
          <div class="pane link">
            <div class="duo">
              <span class="who">${face(TH)}${TH.code}<small>${TH.name}</small></span>
              <i class="wire"></i>
              <span class="who">${face(ME)}${ME.code}<small>${ME.name}</small></span>
            </div>
            <p class="st"><span>${D.link || `${TH.cls} ↔ ${ME.cls}`}</span><b${T.linkRed ? ' style="color:var(--red)"' : ''}>${deployed ? T.linkDone : T.link}</b></p>
          </div>
        </div>
      </div>`;
    $('toScan').addEventListener('click', () => go('scan'));
    $('prev')?.addEventListener('click', () => openLetter(0));
    $('dot').hidden = !unread;
    $('openerBadge').textContent = unread; $('openerBadge').hidden = !unread;
    $('openerSub').textContent = deployed ? T.openerDone : T.openerSub;
  }

  // ── SCAN ──
  const LAND = 'M16.8 35.7L33.6 28.9L47.6 17L64.4 17L78.4 6.8L86.8 20.4L95.2 34L106.4 51L109.2 68L110.6 95.2L114.8 93.5L110.6 112.2L103.6 124.1L95.2 127.5L86.8 132.6L75.6 134.3L64.4 137.7L53.2 146.2L39.2 149.6L28 153L21 142.8L25.2 129.2L23.8 115.6L30.8 96.9L25.2 88.4L18.2 73.1L28 64.6L32.2 54.4L29.4 45.9Z';
  $('map').innerHTML = `
    <svg viewBox="0 0 130 192" preserveAspectRatio="xMidYMid meet" role="group" aria-label="국내 게이트 지도">
      <path class="land" d="${LAND}"/><ellipse class="land" cx="29.4" cy="183.6" rx="10" ry="5"/>
      ${gates.map((g, i) => { const [x, y] = XY(g); return `
        <g class="gate${g.mission ? ' mission' : ''}" style="--i:${i};--c:${CLS[g.cls]}" data-g="${i}" tabindex="0" role="button" aria-label="${g.id} ${g.place} ${g.cls}급">
          <circle class="hit" cx="${x}" cy="${y}" r="7"/>
          <circle class="ping" cx="${x}" cy="${y}" r="2"/>
          ${g.mission ? `<circle class="lock" cx="${x}" cy="${y}" r="7"/><text class="tgt" x="${x + 8}" y="${y + 7}">${T.target}</text>` : ''}
          <circle class="core" cx="${x}" cy="${y}" r="${g.mission ? 2.6 : 1.9}"/>
          <text x="${x + 4}" y="${y - 3}">${g.id}</text>
        </g>`; }).join('')}
    </svg>`;
  $('legend').innerHTML = `<span style="--c:${CLS.S}"><i></i>SS · S · A 위험</span><span style="--c:${CLS.B}"><i></i>B 경계</span><span style="--c:${CLS.C}"><i></i>C 관측</span><span style="--c:${CLS['?']}"><i></i>미확인</span><span class="hint">SCANNING...</span>`;
  $$('.gate').forEach((g) => {
    g.addEventListener('click', () => pickGate(+g.dataset.g));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickGate(+g.dataset.g); } });
  });

  async function startScan() {
    const id = ++scanRun;
    scanned = true;
    unpick();
    $('radar').classList.remove('found', 'focus');
    $('scanState').textContent = 'SEARCHING...';
    await wait(2800); if (id !== scanRun) return;
    $('radar').classList.add('found');
    $('scanState').textContent = `${gates.length} GATES DETECTED`;
    // 잠깐 다 같이 반짝인 뒤, 우리 페어 게이트만 남기고 회색으로
    await wait(1700); if (id !== scanRun) return;
    $('radar').classList.add('focus');
    $('legend').querySelector('.hint').textContent = `TARGET ACQUIRED · ${gates[0].id}`;
  }
  $('rescan').addEventListener('click', startScan);

  function pickGate(i) {
    const g = gates[i], map = $('map');
    $$('.gate').forEach((el, n) => el.classList.toggle('sel', n === i));
    // 고른 게이트가 정보창 옆 빈 곳 가운데로 오게 확대
    map.style.transition = 'none'; map.style.transform = ''; void map.offsetWidth; map.style.transition = '';
    const mr = map.getBoundingClientRect();
    const cr = S.querySelector(`.gate[data-g="${i}"] .core`).getBoundingClientRect();
    const px = cr.left + cr.width / 2 - mr.left, py = cr.top + cr.height / 2 - mr.top;
    const narrow = matchMedia('(max-width: 640px)').matches, s = 2.6;
    map.style.transform = `translate(${(narrow ? mr.width * .5 : mr.width * .28) - px * s}px, ${(narrow ? mr.height * .22 : mr.height * .5) - py * s}px) scale(${s})`;
    $('radar').classList.add('zoom');

    const info = $('ginfo');
    info.style.setProperty('--c', CLS[g.cls]);
    info.innerHTML = `
      <div class="gi-head"><span><small>GATE DOSSIER</small><b>${g.id}</b></span><span><span class="cls">CLASS-${g.cls}</span><button class="x" type="button" id="giX" aria-label="정보창 닫기">✕</button></span></div>
      <div class="gi-in">
        <dl><dt>LOCATION</dt><dd>${g.place}</dd><dt>STATUS</dt><dd>${g.state}</dd><dt>SCALE</dt><dd>${g.size}</dd></dl>
        <p class="logt">▌ ACTIVITY LOG</p>
        <div class="log">${g.log.map(([t, s]) => `<p><span>› ${t}</span>${s}</p>`).join('')}</div>
      </div>
      <div class="gi-foot">${g.mission && !deployed
        ? `<p class="al">${T.alert}</p><p class="ask">${T.ask}<button type="button" id="giGo">${T.askBtn}</button></p>`
        : `<p class="al off">${g.mission ? T.done : 'NOT ASSIGNED'}</p><p class="no">${g.mission ? T.doneGo : g.note}</p>`}</div>`;
    info.classList.remove('in'); void info.offsetWidth; info.classList.add('in');
    $('giX').addEventListener('click', unpick);
    $('giGo')?.addEventListener('click', () => dispatch(g));
  }
  function unpick() {
    $('ginfo').classList.remove('in');
    $('map').style.transform = '';
    $('radar').classList.remove('zoom');
    $$('.gate').forEach((g) => g.classList.remove('sel'));
  }

  // ── 출격: 로딩 → 존명 → 통신 ──
  const show = (id, on) => $(id).classList.toggle('on', on);
  async function dispatch(g) {
    const id = ++run;
    ['ld1', 'ld2', 'ch1', 'ch2', 'ch3'].forEach((k) => $(k).classList.remove('v'));
    $('ld1').innerHTML = fill(T.ld1, g);
    $('ld2').innerHTML = fill(T.ld2, g);
    $('ldBar').style.width = '0'; $('ldPct').textContent = '0%';
    show('ovLoad', true);
    await wait(350); $('ld1').classList.add('v');
    await wait(450); $('ld2').classList.add('v');
    for (let p = 0; p <= 100; p += 4) {
      if (id !== run) return;
      $('ldBar').style.width = p + '%'; $('ldPct').textContent = p + '%';
      if (p === 32) $('ch1').classList.add('v');
      if (p === 64) $('ch2').classList.add('v');
      if (p === 96) $('ch3').classList.add('v');
      await wait(p > 88 ? 90 : 55);
    }
    await wait(450); if (id !== run) return;
    show('ovLoad', false);
    $('okSay').innerHTML = (D.ok || ['존명, 임무 출격 확인했습니다.', '무사 복귀하십시오.']).join('<br>');
    $('okTg').textContent = `› TARGET · ${g.id} · ${g.place}`;
    show('ovOk', true);
    $('okGo').focus({ preventScroll: true });
  }
  $('okGo').addEventListener('click', () => { show('ovOk', false); comms(); });

  async function comms() {
    const id = ++run;
    const body = $('cmBody');
    body.innerHTML = '<p class="msg sys">— CHANNEL OPEN —</p>';
    $('cmEnd').hidden = true;
    show('ovComm', true);
    for (const ln of D.comms || []) {
      await wait(650); if (id !== run) return;
      const m = document.createElement('div');
      m.className = 'msg' + (ln.who === 'me' ? ' mine' : '');
      m.innerHTML = `<p class="nm">${who(ln.who).code}</p><span class="typing"><i></i><i></i><i></i></span>`;
      body.append(m); body.scrollTop = body.scrollHeight;
      await wait(500 + ln.text.length * 22); if (id !== run) return;
      const ty = m.querySelector('.typing');
      ty.classList.add('out');
      await wait(220); if (id !== run) return;
      ty.outerHTML = `<span class="tx wait">${ln.text}</span>`;
      requestAnimationFrame(() => requestAnimationFrame(() => m.querySelector('.tx').classList.remove('wait')));
      body.scrollTop = body.scrollHeight;
    }
    await wait(600); if (id !== run) return;
    body.insertAdjacentHTML('beforeend', `<p class="msg sys">${T.commEnd}</p>`);
    body.scrollTop = body.scrollHeight;
    $('cmEnd').hidden = false; $('cmEnd').focus({ preventScroll: true });
  }
  $('cmEnd').addEventListener('click', () => { show('ovComm', false); deployed = true; unpick(); renderHome(); go('home'); });

  // 메일
  function renderMail(fresh) {
    $('mail').innerHTML = `
      <p class="lbl"><span>INBOX · ${mails.length} MESSAGE</span><b>${unreadN()} UNREAD</b></p>
      ${mails.length ? `<div class="list">${mails.map((m, i) => `
        <button class="item${fresh && i === 0 ? ' drop' : ''}" type="button" data-mail="${i}">
          <span class="ab">${m.ab || 'HQ'}</span>
          <span class="t">${m.title}<small>FROM ${m.from} · ${m.date}</small></span>
          <span class="chip${read.has(m) ? '' : ' red'}">${read.has(m) ? 'READ' : 'NEW'}</span>
        </button>`).join('')}</div>` : '<div class="none">&gt; INBOX EMPTY<small>수신된 메일이 없습니다</small></div>'}`;
    $('mail').querySelectorAll('[data-mail]').forEach((b) => b.addEventListener('click', () => openLetter(+b.dataset.mail)));
  }
  // 신규 메일: 알림이 파지직 뜨고, 메일이 맨 위로 하나씩 끼어들어요
  async function runIncoming() {
    if (arriving || arrived >= incoming.length) return;
    arriving = true;
    const id = ++mailRun;
    while (arrived < incoming.length) {
      await wait(arrived ? 2200 : 1300);
      if (id !== mailRun || cur !== 'mail') break;
      const t = $('mailToast');
      t.textContent = `▌ 신규 메일이 발송되었습니다 · ${incoming[arrived].from}`;
      t.classList.remove('on'); void t.offsetWidth; t.classList.add('on');
      await wait(700);
      if (id !== mailRun || cur !== 'mail') break;
      mails.unshift({ ...incoming[arrived], date: incoming[arrived].date || today() });
      arrived++;
      renderMail(true); renderHome();
      $('mail').parentElement.scrollTop = 0;
    }
    arriving = false;
  }
  function openLetter(i) {
    const m = mails[i];
    read.add(m);
    const K = '가나다라마바사아자차';
    const items = m.body.map((p) => (typeof p === 'string' ? `<li>${p}</li>`
      : `<li>${p[0]}<ol>${p[1].map((s, j) => `<li data-k="${K[j]}">${s}</li>`).join('')}</ol></li>`)).join('');
    $('letter').innerHTML = `
      <article class="doc">
        <dl class="pane meta"><dt>DOC NO.</dt><dd>${m.no}</dd><dt>FROM</dt><dd>${m.from}</dd><dt>TO</dt><dd>${m.to}</dd><dt>DATE</dt><dd>${m.date}</dd><dt>CLASS</dt><dd class="red">${m.secret || 'CONFIDENTIAL · 대외비'}</dd></dl>
        <span class="ttl">${m.title}</span>
        <ol>${items}</ol>
        <p class="end">끝.</p>
        <p class="sign">${m.sign || m.from}</p>
        ${m.ps ? `<p class="ps"><b>P.S.</b>${m.ps}</p>` : ''}
      </article>`;
    renderHome(); renderMail();
    go('letter');
  }

  // 이야기
  const story = D.story || [];
  $('story').innerHTML = `<p class="lbl"><span>OPERATION RECORD</span><b>${story.length} ENTRIES</b></p>` + (story.length
    ? `<div class="list">${story.map((s, i) => `<button class="item" type="button" data-rec="${i}"><span class="ab">${pad(i + 1)}</span><span class="t">${s.title}<small>${s.sub || ''}</small></span><span class="chip ac">OPEN</span></button>`).join('')}</div>`
    : '<div class="none">&gt; NO RECORD FOUND<small>열람 가능한 기록이 없습니다</small></div>');
  $('story').querySelectorAll('[data-rec]').forEach((b) => b.addEventListener('click', () => openRecord(story[+b.dataset.rec])));
  // 기록 읽기: 장면이 위에서부터 이어져요
  function openRecord(s) {
    $('record').innerHTML = `
      <p class="lbl"><span>OPERATION RECORD · 열람 중</span><b>${(s.scenes || []).length} SCENES</b></p>
      <article class="rec">
        <span class="rec-ttl">${s.title}</span>
        ${(s.scenes || []).map((sc) => `
          <section class="scene">
            <p class="stamp">${sc.stamp}</p>
            <span class="sc-ttl">${sc.title}</span>
            ${sc.body.map((p) => (typeof p === 'string' ? `<p>${p}</p>` : `<p class="q">${p.q}</p>`)).join('')}
          </section>`).join('')}
        <p class="rec-end">— END OF RECORD —</p>
      </article>`;
    go('record');
  }

  // 연락처
  const people = [TH, ME];
  $('people').innerHTML = `
    <p class="lbl"><span>CONTACTS</span><b>${people.length} REGISTERED</b></p>
    <div class="list">${people.map((p, i) => `
      <button class="item" type="button" data-person="${i}">
        ${face(p, 'ab')}
        <span class="t">${p.code} <em>/ ${p.name} ${p.en || ''}</em><small>${p.cls} · RANK ${p.rank}</small></span>
        <span class="chip ${p === ME ? '' : statusCls(p)}">${p === ME ? 'YOU' : statusOf(p)}</span>
      </button>`).join('')}</div>`;
  $('people').querySelectorAll('[data-person]').forEach((b) => b.addEventListener('click', () => openPerson(people[+b.dataset.person])));
  function openPerson(p) {
    $('person').innerHTML = `
      <p class="lbl"><span>PERSONNEL FILE</span><b>${p.code}</b></p>
      <div class="card">
        <span class="photo" role="img" aria-label="${p.name}" style="${faceStyle(p, 2.6, 1.25)}"></span>
        <dl><dt>NAME</dt><dd>${p.name}${p.en ? ` · ${p.en}` : ''}</dd><dt>CODE</dt><dd>${p.code}</dd><dt>CLASS</dt><dd>${p.cls}</dd><dt>RANK</dt><dd>${p.rank}</dd><dt>UNIT</dt><dd>${p.unit || 'FEARLESS 지부'}</dd><dt>STATUS</dt><dd${p.statusCls === 'red' ? ' style="color:var(--red)"' : ''}>${statusOf(p)}</dd></dl>
        ${p.line ? `<p class="line">${p.line}</p>` : ''}
        ${p.href ? `<a href="${p.href}"><span>OPEN PERSONNEL FILE</span><span>&gt;</span></a>` : ''}
      </div>`;
    // 페어 페이지가 넘어가는 연출을 갖고 있으면(window.FLOS_OPEN), 단말기를 닫고 그 연출로 넘어가요
    const a = $('person').querySelector('a[href]');
    if (a) a.addEventListener('click', (e) => {
      const run2 = window.FLOS_OPEN && window.FLOS_OPEN(p.href);
      if (!run2) return;
      e.preventDefault();
      close();
      setTimeout(run2, reduce ? 0 : 480); // 단말기가 다 닫힌 뒤에 (포커스가 연출 화면으로 가게)
    });
    go('person');
  }

  // 메뉴 · 열고 닫기
  $$('.dock [data-go]').forEach((b) => b.addEventListener('click', () => { if (b.dataset.go === 'mail') renderMail(); go(b.dataset.go); }));
  const closeOverlays = () => { mailRun++; arriving = false; overlaysOff(); };
  const overlaysOff = () => { run++; ['ovLoad', 'ovOk', 'ovComm'].forEach((k) => show(k, false)); };
  function open() {
    last = document.activeElement;
    wrap.hidden = false;
    root.classList.add('on');
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('on')));
    scanned = false;
    renderHome(); renderMail();
    boot();
    $('pw').focus({ preventScroll: true });
  }
  function close() {
    run++; scanRun++;
    closeOverlays();
    wrap.classList.remove('on');
    root.classList.remove('on');
    document.documentElement.style.overflow = '';
    setTimeout(() => { wrap.hidden = true; (last && last.focus ? last : $('opener')).focus({ preventScroll: true }); }, reduce ? 0 : 450);
  }
  $('opener').addEventListener('click', open);
  $('pw').addEventListener('click', close);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
  document.addEventListener('keydown', (e) => {
    if (wrap.hidden || e.key !== 'Escape') return;
    e.stopImmediatePropagation();
    if (S.querySelector('.ovl.on')) closeOverlays();
    else if ($('ginfo').classList.contains('in')) unpick();
    else if (PARENT[cur]) go(PARENT[cur]);
    else if (cur !== 'home' && cur !== 'boot') go('home');
    else close();
  }, true);
  renderHome();
})();
