/* ───────────────── 서재훈: 하늘 (bloom-engine.js 위에서 돌아요) ─────────────────
   「서재훈은 지지 않는 태양이다.」가 하늘 높이 올라가 태양의 한가운데가 되고,
   서재훈을 이루는 문장들이 구름으로 뭉쳐 천천히 흘러가다가 → 서재훈 그림이 돼요.
   구름은 사진 없이 만들어요 (가로로 이어지는 잡음 → 끊김 없이 계속 흘러가요).

   문장은 여기서 고쳐요 ↓ (줄 하나 = 문장 한 덩어리)                         */
(() => {
  const HEART = '서재훈은 지지 않는 태양이다.';
  const TEXT = [
    '그렇기에 그는 영원히 상공에 군림하고, 패배하지 않는다.',
    '태양은 누구의 허락도 구하지 않고 떠오른다. 자신을 바라보는 이가 있든 없든, 그 빛을 반기는 사람이 있든 눈을 감는 사람이 있든 개의치 않는다. 태양은 그저 자신의 자리에 존재할 뿐이다. 누구보다 높은 곳에서 세상을 내려다보고, 그 아래 펼쳐진 모든 것을 밝힌다. 그것이 온기인지 열기인지, 혹은 모든 것을 태워버릴 만큼의 재앙인지는 빛을 받는 이들의 사정일 따름이다.',
    '서재훈은 그런 사람이다.',
    '자신의 자리를 의심하지 않고, 자신이 내린 판단을 쉽게 번복하지 않으며, 타인의 허락을 구하기보다 스스로 결정하는 편을 택한다. 그에게 주어진 권한을 누리는 데 거리낌이 없고, 그 권한에 따르는 책임을 타인에게 전가하는 일은 더욱 싫어한다. 자신이 지휘하는 전장에서는 자신의 판단이 기준이 되어야 한다고 믿는다. 명령을 내리는 사람은 그 명령이 가져올 결과까지 감당해야 하며, 그러지 못할 사람이라면 애초에 지휘권을 쥐어서는 안 된다고 생각한다.',
    '그는 자신의 전장을 사랑하는 것이 아니라 자신의 전장을 책임진다.',
    '전장은 언제나 불완전하다. 아무리 치밀하게 세운 작전에도 변수가 존재하고, 아무리 높은 곳에서 내려다보아도 모든 것을 볼 수는 없다. 누군가는 살아 돌아오고 누군가는 돌아오지 못한다. 모든 사람을 구할 수 없다는 사실은 전장의 가장 오래된 진실이며, 지휘관은 그 진실을 외면해서는 안 된다.',
    '그러므로 서재훈은 판단한다.',
    '무엇을 지킬 것인지, 무엇을 포기할 것인지. 어느 지점을 사수할 것인지, 어느 시점에 후퇴할 것인지. 누구를 투입하고 누구를 물릴 것인지. 그는 망설임을 좋아하지 않는다. 망설이는 동안에도 전장은 움직이고, 누군가의 생명은 계속해서 위태로워지기 때문이다.',
    '그에게 판단은 감정의 반대편에 놓인 것이 아니다. 감정을 배제하는 일이 언제나 올바른 판단을 보장하지는 않는다는 사실도 알고 있다. 다만 판단을 내려야 하는 순간에 감정이 결정을 대신하게 두어서는 안 된다고 믿는다.',
    '그렇다면 옳은 판단이란 무엇인가.',
    '가장 많은 사람을 살리는 판단인가. 가장 적은 희생을 남기는 판단인가. 아니면 그 순간 자신이 가진 정보와 능력을 바탕으로 최선이라고 믿었던 판단이라면, 그 결과가 어떻든 옳았다고 말할 수 있는가.',
    '누군가를 구하지 못한 지휘관은 실패한 것인가. 한 사람을 구하기 위해 열 사람을 위험에 빠뜨리지 않은 지휘관은 비정한 것인가. 살아 돌아온 사람들은 그의 판단을 옳다고 증명할 수 있는가. 돌아오지 못한 사람들의 부재는 그 판단을 영원히 틀린 것으로 만드는가.',
    '서재훈은 그러한 질문에 쉽게 답하지 않는다.',
    '다만 자신이 선택한 결과를 다른 사람에게 떠넘기지 않을 뿐이다.',
    '책임이란 그런 것이라고 생각한다. 자신이 내린 결정의 결과를 받아들이는 것. 그 결정으로 인해 발생한 손실을 타인의 탓으로 돌리지 않는 것. 그리고 다음번에도 다시 판단해야 한다면, 그때에도 자신의 이름으로 명령을 내리는 것.',
    '그는 책임을 나누는 일에 익숙하지 않다.',
    '타인에게 자신의 판단을 맡기는 것도, 자신의 약점을 드러내는 것도, 자신이 감당할 수 없는 무언가가 있다는 사실을 인정하는 것도 달가워하지 않는다. 누군가에게 기대는 순간 자신이 가진 주도권을 잃게 될 것이라고 생각하는지도 모른다. 도움을 받는다는 것은 자신의 부족함을 인정하는 일이며, 자신의 부족함을 인정한다는 것은 자신이 세워 온 질서에 균열을 내는 일이니까.',
    '그에게 약점은 단순히 감추어야 할 흠결이 아니다. 그것은 타인이 자신의 영역에 개입할 수 있는 틈이다.',
    '그러나 통제란 무엇인가.',
    '자신의 영역에 들어오는 모든 변수를 제거하는 일인가. 아니면 통제할 수 없는 변수가 존재한다는 사실을 인정하면서도 그 안에서 최선의 결과를 만들어 내는 일인가. 모든 것을 자신의 손아귀에 쥐고 있는 사람은 정말로 강한 것인가. 아니면 손에서 무언가를 놓는 순간 무너질까 두려워하는 사람인가.',
    '서재훈은 자신이 통제할 수 없는 것들을 좋아하지 않는다.',
    '전장의 변수는 계산하고 제거해야 할 대상이며, 명령에 불복하는 행동은 작전 전체를 위협할 수 있다. 그는 자신이 세운 질서를 함부로 침범하는 사람을 용납하지 않는다. 그렇다고 모든 것을 자신의 뜻대로 만들 수 있다고 믿는 것은 아니다. 오히려 그는 자신이 통제할 수 없는 것이 얼마나 많은지 잘 알고 있다.',
    '그래서 더욱 통제하려 한다.',
    '불확실성을 없앨 수 없다면 최소한 그 불확실성에 대응할 수 있는 사람이 되어야 한다. 모든 상황을 예측할 수 없다면 어떤 상황에서도 판단할 수 있는 사람이 되어야 한다. 자신이 가진 능력과 권한을 최대한으로 활용하여, 자신이 책임져야 할 영역만큼은 결코 무너지지 않도록 해야 한다.',
    '그것이 서재훈이 생각하는 지배다.',
    '지배란 타인의 위에 서는 일인가. 아니면 자신이 서 있는 곳에서 벌어지는 모든 일을 책임지는 일인가. 권력을 가진 사람은 그 권력을 행사할 권리만큼이나 무거운 의무를 지는가. 스스로 왕이라고 칭하는 사람은 왕국이 무너졌을 때에도 왕일 수 있는가.',
    '그는 높은 곳에 있다.',
    '구름 위, 지상의 소음이 닿지 않는 곳. 수많은 기계음과 통신 신호, 명령과 응답이 오가는 상공. 서재훈에게 하늘은 단순한 공간이 아니라 자신의 영역이다. 발키리는 그 영역을 떠다니는 요새이며, 그가 내리는 명령은 하늘을 가로지르는 궤적이 된다.',
    '그는 높은 곳에서 전장을 내려다본다.',
    '높은 곳에 서면 더 많은 것을 볼 수 있다. 전체적인 흐름을 파악할 수 있고, 개별적인 시야에서는 보이지 않는 위험을 발견할 수 있다. 그러나 높은 곳에서 바라보는 세상은 그만큼 작아진다. 사람의 얼굴은 점이 되고, 목소리는 통신 잡음에 묻히며, 눈앞에서 벌어지는 고통은 지도 위의 좌표로 환원된다.',
    '거리가 판단을 가능하게 한다면, 거리는 동시에 무엇을 가리는가.',
    '멀리서 바라보는 사람은 가까이 있는 사람이 보지 못하는 것을 볼 수 있다. 그렇다면 가까이 다가가지 않는 사람은 무엇을 보지 못하는가. 전체를 이해하는 일과 개별적인 존재를 이해하는 일은 양립할 수 있는가. 높은 곳에 있는 사람은 낮은 곳에 있는 사람의 삶을 얼마나 정확하게 판단할 수 있는가.',
    '서재훈은 그 거리를 알고 있다.',
    '그럼에도 그는 상공에 머문다. 누군가는 그곳에 있어야 하고, 누군가는 전체를 내려다보아야 하며, 누군가는 최종적인 판단을 내려야 한다. 그 역할이 자신에게 주어졌다면 기꺼이 받아들인다. 그것이 자신이 가진 능력에 대한 대가라고 생각하기 때문이다.',
    '그는 자신이 특별하다는 사실을 부정하지 않는다.',
    '강한 사람은 강하다고 인정해야 한다. 권한을 가진 사람은 권한을 행사할 줄 알아야 한다. 자신이 다른 사람보다 더 많은 것을 할 수 있다면 그만큼 더 많은 것을 감당해야 한다. 겸손이라는 이름으로 자신의 능력을 부정하는 것은 오히려 무책임한 태도일 수 있다.',
    '그렇다면 오만이란 무엇인가.',
    '자신의 능력을 믿는 일인가. 자신의 능력만으로 충분하다고 믿는 일인가. 타인보다 우월하다고 생각하는 것과 타인에게 의존할 필요가 없다고 생각하는 것은 얼마나 다른가.',
    '서재훈은 오만하다.',
    '자신의 능력을 의심하지 않고, 자신의 선택에 자신이 있으며, 때로는 타인의 의견을 들을 가치가 없다고 판단하기도 한다. 그러나 그 오만은 무책임한 허세와는 다르다. 그는 자신이 내뱉은 말에 책임을 지고, 자신이 내린 명령의 결과를 감당하며, 자신이 지키겠다고 선언한 영역을 쉽게 포기하지 않는다.',
    '그는 자신이 지지 않을 것이라고 믿는다.',
    '패배란 무엇인가. 전투에서 패하는 일인가, 자신이 지키고자 했던 것을 잃는 일인가. 자신의 판단이 틀렸음을 인정하는 일인가, 아니면 틀렸음을 알면서도 끝내 바로잡지 못하는 일인가.',
    '패배하지 않는다는 것은 단 한 번도 쓰러지지 않는다는 뜻인가. 몇 번이고 쓰러지더라도 다시 일어나는 일인가. 혹은 자신이 잃은 것들을 전부 자신의 것으로 인정하고, 그럼에도 앞으로 나아가는 일인가.',
    '태양은 매일 떠오른다.',
    '밤이 찾아오면 지평선 아래로 사라지는 것처럼 보이지만, 그것은 사라진 것이 아니다. 지구의 반대편에서도 여전히 빛나고 있다. 누군가에게는 밤이지만 누군가에게는 낮이다. 태양은 자신이 보이지 않는다고 해서 존재를 멈추지 않는다.',
    '그렇다면 태양에게 패배란 존재하지 않는가.',
    '빛을 잃지 않는 것과 누구에게도 지지 않는 것은 같은 의미인가. 영원히 떠오르는 존재에게도 밤은 필요한가. 지지 않는 태양은 과연 쉬는 법을 알고 있는가.',
    '서재훈은 겨울의 태양을 닮았다.',
    '겨울의 태양은 높이 떠오르지 않는다. 빛은 선명하지만 온기는 충분하지 않고, 그늘은 길며, 해가 지고 나면 추위가 더욱 깊어진다. 그러나 겨울의 태양도 떠오른다. 아무것도 피어나지 않는 땅 위에 빛을 내리고, 얼어붙은 풍경을 드러내며, 자신이 존재한다는 사실을 알린다.',
    '그는 누군가를 따뜻하게 만들기 위해 빛나는 사람이 아니다.',
    '그저 자신의 자리에 존재하고, 자신의 영역을 밝히며, 그곳에서 벌어지는 일을 지켜보는 사람이다. 그 빛이 누군가에게는 구원이 되고 누군가에게는 위협이 되더라도, 그는 자신의 빛을 거두지 않는다.',
    '그렇기에 그는 지지 않는 태양이다.',
    '그러나 태양은 모든 것을 비출 수 있어도 모든 것을 구할 수는 없다. 가장 높은 곳에서 세상을 내려다보아도 모든 사람의 얼굴을 기억할 수는 없으며, 자신의 빛이 닿는 곳마다 생명이 피어나는 것도 아니다.',
    '빛은 때로 눈을 멀게 하고, 열은 때로 모든 것을 태운다.',
    '그렇다면 태양은 자신이 만들어 낸 그늘에 대해서도 책임을 져야 하는가. 자신이 비추지 못한 곳에서 일어난 일까지 자신의 책임이라고 할 수 있는가. 빛을 내리는 것만으로 충분한가, 아니면 빛이 닿지 않는 곳까지 내려가야 하는가.',
    '서재훈은 아직 그 질문에 답하지 않는다.',
    '다만 그는 여전히 상공에 있다. 누구보다 높은 곳에서, 누구보다 넓은 전장을 내려다보며, 자신이 내린 판단의 결과를 자신의 이름으로 받아들인다.',
    '그는 패배하지 않을 것이다.',
    '적어도 자신이 패배했다고 인정하기 전까지는.',
  ];

  // 서재훈 그림의 색 지도 (200×137로 줄인 것: 파일로 열어도 캔버스가 막히지 않게 직접 담아둬요)
  const THUMB = "data:image/webp;base64,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";

  const T = { heartIn: 250, heartGo: 2300, sun: 2700, clouds: 3000, morph: 7900 };
  // 하늘: 높은 고도의 짙은 파랑 → 지평선 쪽 옅은 파랑
  const SKY = [[0, '#13294b'], [0.55, '#3a6798'], [1, '#9dbbd8']];
  const SUN_CORE = [255, 248, 228], SUN_EDGE = [246, 186, 86], HALO = [255, 224, 150];
  const LIT = [252, 252, 255], SHADE = [150, 172, 204]; // 구름 윗면 · 아랫면

  // 가로로 주기가 있는 값 잡음 (오른쪽 끝이 왼쪽 처음과 이어져요)
  const hash = (i, j) => { let h = (i * 374761393 + j * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
  const smooth = (t) => t * t * (3 - 2 * t);
  function noise(x, y, P) {
    const xi = Math.floor(x), yi = Math.floor(y), fx = smooth(x - xi), fy = smooth(y - yi);
    const a = ((xi % P) + P) % P, b = (a + 1) % P;
    const v00 = hash(a, yi), v10 = hash(b, yi), v01 = hash(a, yi + 1), v11 = hash(b, yi + 1);
    return (v00 + (v10 - v00) * fx) * (1 - fy) + (v01 + (v11 - v01) * fx) * fy;
  }
  const fbm = (x, y, P) => noise(x, y, P) * 0.5 + noise(x * 2, y * 2, P * 2) * 0.27 + noise(x * 4, y * 4, P * 4) * 0.15 + noise(x * 8, y * 8, P * 8) * 0.08;

  GlyphBloom.define('jaehun', {
    heart: HEART,
    text: TEXT,
    portraitFrom: '그렇기에 그는 지지 않는 태양이다.', // ← 서재훈 그림은 여기서부터 읽혀요
    thumb: THUMB,
    images: {},
    fade: 0.26,
    heartColor: [255, 244, 214],
    saturate: 1,
    ink: (c) => [c[0] * 0.92, c[1] * 0.95, c[2]], // 먹색에 아주 살짝 남색
    T,

    build(m, rnd, imgs, { clamp, mix, stream }) {
      const { W, H } = m;
      const phone = W < H;
      const glyphs = [];

      /* 태양: 동심원을 따라 테마 문장이 빙글 (안쪽 고리 몇 자리는 큰 문장 글자들 몫) */
      const sx = W / 2, sy = H * (phone ? 0.22 : 0.27);
      const Rs = phone ? W * 0.17 : Math.min(W * 0.075, H * 0.13);
      const heart = HEART.replace(/\s+/g, '');
      const step = m.lh * 0.95;
      const ring = []; // 해 글자 자리
      let hi = 0;
      for (let i = 0; i * step <= Rs * 1.5; i++) {
        const r = i * step, n = i === 0 ? 1 : Math.round((2 * Math.PI * r) / (m.cw * 0.95));
        const halo = r > Rs;
        for (let k = 0; k < n; k++) {
          const th = -Math.PI / 2 + (k / n) * Math.PI * 2;
          const fall = halo ? 1 - (r - Rs) / (Rs * 0.5) : 1;
          if (halo && rnd() > fall * 0.9) continue; // 바깥 햇무리는 성글게
          ring.push({ x: sx + r * Math.cos(th), y: sy + r * Math.sin(th), r, th, i, halo, ch: heart[hi++ % heart.length],
            c: halo ? HALO : mix(SUN_CORE, SUN_EDGE, clamp(r / Rs) ** 1.6), al: halo ? 0.45 * fall ** 1.3 : 1 });
        }
      }
      const targets = ring.slice(0, heart.length).map((s) => ({ ...s, extra: { rr: s.r, th0: s.th, w: (s.i % 2 ? 1 : -1) * 0.00004 } }));

      /* 구름: 높이가 다른 세 겹이 서로 다른 빠르기로 흘러가요 (먼 구름은 느리고 옅게) */
      const margin = Math.round(W * 0.3);
      const Lw = Math.round((W + margin * 2) / m.cw) * m.cw, L0 = -margin;
      // b: 구름 밑면 높이, hg: 구름 키, v: 흐르는 빠르기(px/ms), a: 진하기, thr: 문턱, sky: 하늘색에 묻히는 정도, sc: 가로 잡음 칸 수
      const layers = phone
        ? [{ b: 0.3, hg: 0.12, v: 0.004, a: 0.55, thr: 0.64, sky: 0.4, sc: 5 }, { b: 0.62, hg: 0.15, v: 0.008, a: 0.85, thr: 0.585, sky: 0.15, sc: 4 }, { b: 0.99, hg: 0.22, v: 0.013, a: 1, thr: 0.6, sky: 0, sc: 3 }]
        : [{ b: 0.3, hg: 0.15, v: 0.005, a: 0.55, thr: 0.64, sky: 0.4, sc: 7 }, { b: 0.62, hg: 0.17, v: 0.009, a: 0.85, thr: 0.585, sky: 0.15, sc: 6 }, { b: 0.99, hg: 0.28, v: 0.015, a: 1, thr: 0.6, sky: 0, sc: 4 }];
      const next = stream(TEXT);
      const clouds = [[], [], []];
      layers.forEach((Ly, li) => {
        const P = Ly.sc, base = H * Ly.b, span = H * Ly.hg;
        // 뭉게구름: 밑면은 평평하고(밑면 가까이 두툼), 위로 갈수록 잡음에 맡겨 몽글몽글
        const dens = (x, y) => {
          const up = (base - y) / span; // 밑면 0 → 꼭대기 1
          if (up < 0 || up > 1) return 0;
          return fbm(((x - L0) / Lw) * P, (y / Lw) * P * 1.7 + li * 17.3, P) * 0.75 + 0.3 * (1 - up) ** 1.5;
        };
        for (let r = 0; (r + 1) * m.lh <= H; r++) {
          const y = r * m.lh + m.lh / 2;
          if (y > base || y < base - span) continue;
          for (let x = L0 + m.cw / 2; x < L0 + Lw; x += m.cw) {
            const d = dens(x, y);
            if (d < Ly.thr) continue;
            // 빛은 위에서: 윗면·꼭대기는 하얗게, 밑면은 푸르스름한 그늘
            const above = dens(x, y - m.lh * 2.5), up = (base - y) / span;
            const lit = clamp(0.2 + up * 0.9 + (d - above) * 4);
            const c = mix(mix(SHADE, LIT, lit), [58, 103, 152], Ly.sky);
            clouds[li].push({ x, y, ch: next(), c, al: Ly.a * (0.35 + 0.65 * clamp((d - Ly.thr) / 0.06)), li, v: Ly.v });
          }
        }
      });

      const push = (s, g) => glyphs.push(Object.assign({ ch: s.ch, x1: s.x, y1: s.y, c1: s.c, al: s.al }, g));
      // 먼 구름 → 태양 → 가운데 구름 → 가까운 구름 순서로 겹쳐요
      const cloudIn = (s) => {
        const dir = s.li === 1 ? -1 : 1; // 가운데 겹은 반대쪽에서 모여들어요
        push(s, { x0: s.x - dir * (60 + rnd() * 220), y0: s.y + (rnd() - 0.5) * 50, t1: T.clouds + s.li * 350 + rnd() * 2400, d1: 1600, lw: Lw, l0: L0, rel: 1, v: s.v });
      };
      clouds[0].forEach(cloudIn);
      ring.slice(heart.length).forEach((s) => {
        const t1 = s.halo ? T.sun + 900 + (s.r - Rs) / (Rs * 0.5) * 600 + rnd() * 300 : T.sun + (s.r / Rs) * 900;
        push(s, { x0: sx + (s.x - sx) * 0.4, y0: sy + (s.y - sy) * 0.4, t1, d1: 800, rr: s.r, th0: s.th, w: (s.i % 2 ? 1 : -1) * 0.00004 });
      });
      clouds[1].forEach(cloudIn);
      clouds[2].forEach(cloudIn);

      const grad = (x) => {
        const gr = x.createLinearGradient(0, 0, 0, H);
        SKY.forEach(([p, c]) => gr.addColorStop(p, c));
        return gr;
      };
      let sky = null;
      return {
        center: { x: W / 2, y: H * 0.5 },
        targets,
        glyphs,
        spread: Math.min(W, H) * 0.3,
        paint(x) { x.fillStyle = sky || (sky = grad(x)); x.fillRect(0, 0, W, H); },
        off(g, t, o) {
          if (g.lw) { // 구름: 옆으로 흘러가고, 화면 밖으로 나가면 반대편에서 다시 들어와요
            const X = g.x1 + g.v * t - g.l0;
            o.x = (((X % g.lw) + g.lw) % g.lw) + g.l0 - g.x1;
            o.y = Math.sin(t / 2400 + g.x1 * 0.004) * 1.2;
          } else if (g.rr) { // 해: 고리마다 반대 방향으로 아주 천천히 돌아요
            const th = g.th0 + g.w * t;
            o.x = sx + g.rr * Math.cos(th) - g.x1; o.y = sy + g.rr * Math.sin(th) - g.y1;
          } else { o.x = 0; o.y = 0; }
        },
      };
    },
  });
})();
