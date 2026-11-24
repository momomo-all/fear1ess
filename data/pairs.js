// 페어 목록이에요. 여기 적힌 순서대로 바이닐 상자에 꽂혀요. (줄 순서를 바꾸면 바이닐 순서도 바뀌어요)
// - title : 페어 이름
// - tagline : 둘의 관계를 담은 한 줄. 있으면 페어 이름 대신 크게 보여요 (\n을 넣으면 큰 제목에서 거기서 줄이 바뀌어요)
// - spine   : (책장) 책등에 적을 글자. 없으면 페어 이름
// - chars : 아래에 작게 보일 캐릭터 이름 (적은 순서대로 보여요)
// - codes : 검색용 코드네임, 다른 이름 (화면엔 검색 결과에만 작게 보여요)
// - color : 테마 색 (배경 빛, 바이닐 라벨 색)
// - cover : 썸네일 이미지 경로 (없으면 color로 커버가 자동으로 만들어져요)
// - coverPos : 썸네일을 정사각형으로 자를 때 보여 줄 위치 (예: '10% 50%' 왼쪽 위주). 안 적으면 가운데
// - site  : 페어 사이트 경로 (있으면 커버를 눌러 들어갈 수 있어요)
// - group : 분류 ('fearless' / 'vestal' / 'else'). 안 적으면 'fearless'예요 ('else'는 맨 아래 책장 목록에 따로 적어요)
window.PAIRS = [
  { id: 'sawol-jaehun', title: '사월재훈', tagline: '소란스러운 봄의 교향곡', chars: ['이사월', '서재훈'], codes: ['SOL', '솔', 'MUSTANG', '머스탱'], color: '#62b6e0', cover: 'assets/pairs/sawol-jaehun/cover.webp', coverPos: '78% 50%', site: 'pairs/sawol-jaehun/index.html' },

  { id: 'yungang-gyuna', title: '윤강규나', tagline: '레몬을 깨물었더니', chars: ['서윤강', '김규나'], codes: ['PANTHER', '팬서', 'KITTY', '키티'], color: '#9cc46a', cover: 'assets/pairs/yungang-gyuna/cover.webp', site: 'pairs/yungang-gyuna/index.html' },
  { id: 'kangwoo-junhee', title: '강우준희', tagline: '사랑의 동경과 미완의 환상', chars: ['백강우', '우준희'], codes: ['VIOLET', '비올레', 'BLANC', '블랑'], color: '#d42a22', cover: 'assets/pairs/kangwoo-junhee/cover.webp', site: 'pairs/kangwoo-junhee/index.html' },
  { id: 'yunje-ijae', title: '윤제이재', tagline: '浪漫의 失調', chars: ['강윤제', '신이재'], codes: ['RIVER', '리버', 'CHASER', '체이서'], color: '#2f4fc4', cover: 'assets/pairs/yunje-ijae/cover.webp', site: 'pairs/yunje-ijae/index.html' },
  { id: 'hwi-hyunwoo', title: '휘현우', tagline: 'Forever Till The End of Time', chars: ['윤 휘', '진현우'], codes: ['GLORY', '글로리', 'PRIDE', '프라이드'], color: '#d9a93a', cover: 'assets/pairs/hwi-hyunwoo/cover.webp', site: 'pairs/hwi-hyunwoo/index.html' },
  { id: 'raphael-serena', title: '라파엘세레나', tagline: '戀愛로의 引導', chars: ['라파엘', '세레나'], codes: ['RAPHAEL', 'SERENA', '하나은'], color: '#7fb6e8', cover: 'assets/pairs/raphael-serena/cover.webp', site: 'pairs/raphael-serena/index.html' },
  { id: 'yophiel-burning', title: '요피엘버닝', tagline: '가장 아름다운 결점', chars: ['요피엘', '버닝'], codes: ['YOPHIEL', 'BURNING', '권재혁'], color: '#e2552a', cover: 'assets/pairs/yophiel-burning/cover.webp', site: 'pairs/yophiel-burning/index.html' },
  { id: 'geonwoo-jaeha', title: '건우재하', tagline: '완전무결한 오답', chars: ['강건우', '백재하'], codes: ['STEEL', '스틸', 'GISELLE', '지젤'], color: '#d8262b', cover: 'assets/pairs/geonwoo-jaeha/cover.webp', coverPos: '5% 50%', site: 'pairs/geonwoo-jaeha/index.html' },
  { id: 'domin-baekhyun', title: '도민백현', tagline: '萬象의 視線', chars: ['윤도민', '하백현'], codes: ['TOMA', '토마', 'CHERVIL', '체르빌'], color: '#3fbf72', cover: 'assets/pairs/domin-baekhyun/cover.webp', coverPos: '75% 50%', site: 'pairs/domin-baekhyun/index.html' },
  { id: 'yeoreum-sena', title: '여름세나', tagline: '나비와 바다', chars: ['한여름', '윤세나'], codes: ['SUMMER', '썸머', 'SIREN', '세이렌'], color: '#e59ab4', cover: 'assets/pairs/yeoreum-sena/cover.webp', coverPos: '5% 50%', site: 'pairs/yeoreum-sena/index.html' },
  { id: 'junan-jaeeun', title: '주난재은', tagline: 'Good boy, Come on.', chars: ['천주난', '신재은'], codes: ['SMILE', '스마일', 'DIOR', '디올'], color: '#7b5cff', cover: 'assets/pairs/junan-jaeeun/cover.webp', coverPos: '40% 50%', site: 'pairs/junan-jaeeun/index.html' },
  { id: 'yako-maddog', title: '야코매드독', tagline: '들여우와 들개', chars: ['야코', '매드독'], codes: ['MAD DOG', '幽牙 流刀', '野狐'], color: '#c2323c', cover: 'assets/pairs/yako-maddog/cover.webp', coverPos: '70% 50%', site: 'pairs/yako-maddog/index.html' },
  { id: 'sehyun-yunwoo', title: '세현윤우', tagline: '꿈에 카메라를 가져올 걸', chars: ['한세현', '지윤우'], codes: ['X', '엑스', 'SIEG', '지크'], color: '#22a6d6', cover: 'assets/pairs/sehyun-yunwoo/cover.webp', coverPos: '80% 50%', site: 'pairs/sehyun-yunwoo/index.html' },
  // 요나단 베커: S급 센티넬, Miller, "₍ᐢ⸝⸝› ̫ ‹⸝⸝ᐢ₎♡" / 이도환: S급 센티넬, Trigger, "…처음 보는 얼굴이네요. …빌런?"
  { id: 'becker-dohwan', title: '베커도환', tagline: '(-꒪⩊꒪-)♡', chars: ['요나단 베커', '이도환'], codes: ['MILLER', '밀러', 'TRIGGER', '트리거'], color: '#e0899f' },
  // 서도진: A급 센티넬, Nova, "저는 그저 당신을 지킬 뿐입니다. 무너지지 않게." / 김현율: S급 센티넬, Pulse, "또 그렇게 숨 죽이면... 장난치고 싶어지잖아요."
  { id: 'dojin-hyunyul', title: '도진현율', tagline: '창백한 푸른 점', chars: ['서도진', '김현율'], codes: ['NOVA', '노바', 'PULSE', '펄스'], color: '#8fb3d9', cover: 'assets/pairs/dojin-hyunyul/cover.webp', coverPos: '35% 40%', site: 'pairs/dojin-hyunyul/index.html' },
  // 민도하: A급 센티넬, Flow, (대사 아직 없음) / 주한성: S급 센티넬, Imperial, "내 폭격부대보다 우아한 곳은 없지. 안 그래?"
  { id: 'doha-hanseong', title: '도하한성', tagline: '수평선의 날개', chars: ['민도하', '주한성'], codes: ['FLOW', '플로우', 'IMPERIAL', '임페리얼'], color: '#4a78a8' },
  // 유태오: A급 가이드, Luca, "실컷 놀다 와, 버니. 네 뒤는 내가 맡을 테니까." / 연반희: S급 센티넬, Burst, "흐흥, 그건 제 잔상입니다만."
  { id: 'taeo-banhee', title: '태오반희', tagline: '영영 돌아오지 않을\n어제의 꿈에게', chars: ['유태오', '연반희'], codes: ['LUCA', '루카', 'BURST', '버스트'], color: '#8a6fb0', cover: 'assets/pairs/taeo-banhee/cover.webp', coverPos: '75% 40%', site: 'pairs/taeo-banhee/index.html' },

  // ↓ 아직 그림·페이지가 없는 페어예요 (커버는 색으로 자동, 누르면 '준비 중')
  { id: 'yuwon-jaehyun', title: '유원재현', tagline: '영원한 천국', chars: ['나유원', '신재현'], color: '#b9a3ea' },
  { id: 'mari-cross', title: '마리크로스', tagline: 'Mary on a Cross', chars: ['하나', '크로스'], color: '#6e2d5e' },
  { id: 'jaeo-yeonwoo', title: '재오연우', chars: ['성재오', '하연우'], color: '#3fa89c' },
  { id: 'juho-jaehyung', title: '주호재형', chars: ['공주호', '유지형'], color: '#e6894a' },
  { id: 'uju-hajin', title: '우주하진', tagline: '고양이 우주 정복 노트!', chars: ['온우주', '연하진'], color: '#24306b' },
  // 천우연(내 캐릭터) x 강수호(캐치) — 코드네임 페탈 · 캐치
  { id: 'uyeon-suho', title: '우연수호', tagline: '연주된 적 없는 에튀드', chars: ['천우연', '강수호'], codes: ['PETAL', '페탈', 'CATCH', '캐치'], color: '#e7a1a6' },
  // 피안화(내 캐릭터, 작중 이름 안화) x 한유준(크러쉬)
  { id: 'anhwa-yujun', title: '안화유준', tagline: '바다의 노래를 들으러 가자', chars: ['피안화', '한유준'], codes: ['CRUSH', '크러쉬', '안화'], color: '#a3b8c8' },
  { id: 'chanyang-sion', title: '찬양시온', tagline: '처음과 같이\n이제와 항상 영원히', chars: ['백찬양', '하시온'], codes: ['DIVINE', '디바인', 'BANG', '뱅'], color: '#c9a45c' },
];

// ↓ Something else: 바이닐 대신 책장에 꽂히는 책들이에요 (group: 'else')
//   site가 없는 책은 '아직 쓰는 중인 책'으로 흐리게 보여요
window.PAIRS.push(
  { id: 'lucian-dietrich', group: 'else', title: '루시안디트리히', tagline: '천국도 지옥도 구하지 않는 연인들처럼', spine: 'Rosenberg', chars: ['루시안 로젠베르크', '디트리히 로젠베르크'], color: '#7a1f2b', site: 'pairs/lucian-dietrich/index.html' },

  // ↓ 더미 책이에요. 실제 페어로 바꿔주세요!
  { id: 'else-dummy-2', group: 'else', title: '제목 미정', chars: ['원작 캐릭터', '내 캐릭터'], color: '#2f4a3a' },
  { id: 'else-dummy-3', group: 'else', title: '제목 미정', chars: ['원작 캐릭터', '내 캐릭터'], color: '#3b3550' },
  { id: 'else-dummy-4', group: 'else', title: '제목 미정', chars: ['원작 캐릭터', '내 캐릭터'], color: '#5a4326' },
  { id: 'else-dummy-5', group: 'else', title: '제목 미정', chars: ['원작 캐릭터', '내 캐릭터'], color: '#26384f' },
  { id: 'else-dummy-6', group: 'else', title: '제목 미정', chars: ['원작 캐릭터', '내 캐릭터'], color: '#4a2a3e' },
);
