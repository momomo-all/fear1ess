// 페어별 노래 묶음이에요. 바탕화면의 playlist.exe에 페어 목록으로 보여요.
// 키는 data/pairs.js의 id예요 (예: 'sawol-jaehun').
//
// 노래 한 곡은 이렇게 적어요:
//   { title: '곡 제목', artist: '가수', url: 'https://youtu.be/...' }
//   - url : 누르면 새 탭에서 열려요 (유튜브, 스포티파이, 멜론 등 아무 링크나)
//   - line: 이 곡을 고른 이유가 된 가사 한 줄 (한국어로). 페어 화면 곡 목록에 제목 아래로 보여요
//           예) { title: '...', artist: '...', url: '...', line: '마음에 든 한 줄' }//   - 유튜브 곡 가사는 lrclib.net에서 자동으로 불러와요 (못 찾으면 가사창이 안 떠요)
//   - lrcId: lrclib에서 쓸 가사 번호를 콕 집어요 (자동으로 고른 가사가 이상할 때. lrclib.net/api/get/번호)
//   - lrcShift: 영상 앞에 인트로가 있어 가사가 일찍 넘어가면, 가사 시간을 이만큼(초) 미뤄요 (예: 12.5)
//   - lrcSkip : 가사창에서 뺄 줄 번호 목록 (lrclib 가사의 0부터 센 번호. 예: [23])
//   - lrcAt   : 특정 줄만 영상 시간(초)을 콕 집어 정해요. 예: { 22: 258 } → 22번 줄을 4:18에
//   - lrcArtist: 가사 찾을 때만 쓰는 가수 이름 (lrclib에 일본어 이름으로만 있을 때 등). 화면엔 artist가 보여요
//   - src : 대신 음악 파일 경로를 적으면 (예: 'assets/music/song.mp3') 플레이어에서 바로 재생돼요
//
// 페어 전체 플레이리스트 링크가 따로 있으면 link에 적어요 (목록 위에 "전체 듣기" 버튼이 생겨요)
//
// 예시:
// 'sawol-jaehun': {
//   link: 'https://youtube.com/playlist?list=...',
//   tracks: [
//     { title: '곡 제목', artist: '가수', url: 'https://youtu.be/...' },
//   ],
// },
window.PLAYLISTS = {
  'sawol-jaehun': {
    tracks: [
      { title: 'i think of you the most', artist: 'yung kai', url: 'https://youtu.be/RAvFybdrPpo', lrcId: 38199818, line: '내가 떠올리는 건 너와 저 하늘' },
      { title: 'Fantasy', artist: 'khai dreams', url: 'https://youtu.be/vysjRahYFz0', lrcId: 2158310, line: '넌 언제나 내게 환상 같았다는 거 알고 있었어?' },
      { title: 'blue', artist: 'yung kai', url: 'https://youtu.be/98zHKN-xSHk', lrcId: 30984601, line: '그러니까 너와 함께 날게 해 줘' },
    ],
  },
  'sehyun-yunwoo': {
    tracks: [
      { title: 'LOVE YOU LESS', artist: 'Joji', url: 'https://youtu.be/fuz9LP4tP4g', lrcId: 31960875, line: '내가 덜 사랑하면 넌 날 더 사랑할까?' },
      { title: 'Stitches', artist: 'Shawn Mendes', url: 'https://youtu.be/PQOdz2O4BfI', lrcId: 3714117 },
      { title: 'over', artist: 'quiet morning', url: 'https://youtu.be/-pNE7nG-nKA', line: '하지만 넌 나의 밤을 채우는 존재야' },
      { title: '꿈에 카메라를 가져올걸', artist: '꿈에 카메라를 가져올걸', url: 'https://youtu.be/5oekhGIANSs' },
    ],
  },
  'becker-dohwan': {
    tracks: [
      { title: 'Heart With Your Name On It', artist: 'New Medicine', url: 'https://youtu.be/5CMmddl5d8k', lrcId: 4190065, lrcFix: { 9: 'Hooking up and having fun', 13: 'When you wallow me off on Friday night', 21: 'Hooking up and having fun', 33: 'Hooking up and having fun' }, lrcSkip: [14] },
    ],
  },
  'yuwon-jaehyun': {
    tracks: [
      { title: "Kiki's Song", artist: 'Mree', url: 'https://youtu.be/hC3Sl6Un9L0', lrcId: 38297251 },
      { title: '夢うつつ', artist: 'Lamp', url: 'https://youtu.be/AJdTBPuZkHU', lrcId: 16570704 },
      { title: '月の丘', artist: '青葉市子', url: 'https://youtu.be/ske5X_BLr1I', lrcId: 37792390 },
    ],
  },
  // 테마곡(mp3)은 사이트 안에서 바로 재생되고, data/lyrics.js에 가사가 있으면 가사창이 떠요
  'yungang-gyuna': {
    tracks: [
      { title: '君の夏に 触れさせて', artist: 'Original Theme', src: 'assets/pairs/yungang-gyuna/theme.mp3', lyrics: 'yungang-gyuna', line: '나의 여름에 닿아줘 다시 한 번' },
      { title: 'W / X / Y', artist: 'Tani Yuuki', url: 'https://youtu.be/FgAMCLzLE9c', line: '네가 건네준 태양이 달에 가려지지 않게' },
      { title: 'Somebody To You', artist: 'The Vamps', url: 'https://youtu.be/A4MevL6dvUw', lrcId: 18569107, line: '내가 되고 싶은 건 하나 뿐이야\n너에게 소중한 누군가' },
    ],
  },
  'kangwoo-junhee': {
    tracks: [
      { title: '言えない秘密', artist: 'Original Theme', src: 'assets/pairs/kangwoo-junhee/theme.mp3', lyrics: 'kangwoo-junhee', line: '서로의 남은 반쪽이 될 수 있다면' },
      { title: '幽霊', artist: 'odol', url: 'https://youtu.be/9vILjuCHGwA', line: '멀고도 가깝게 느껴지는 건 내 탓일까\n나답지 않게 나답지 않을 만큼 긴장해서' },
      { title: '恋煩い', artist: 'Ryukku to Soine Gohan', url: 'https://youtu.be/knQvHmpq0jM', lrcArtist: 'リュックと添い寝ごはん', line: '눈에 보일 정도의 사랑인데도 닿을 수 없어' },
      { title: '怪獣の花唄', artist: 'Vaundy', url: 'https://youtu.be/ENQANfv2ANQ', lrcId: 24720751, line: '어디에 가버린 거야 언제나 찾고 있다고' },
    ],
  },
  'yunje-ijae': {
    tracks: [
      { title: 'Je te laisserai des mots', artist: 'Patrick Watson', url: 'https://youtu.be/XZfyyk0_Yqs', lrcId: 7592384, line: '그대 발걸음이 지나간 자리 근처에서 겨울 시간의 틈새에 숨겨둔 채' },
      { title: 'Do It Again', artist: 'Sydney Ross Mitchell', url: 'https://youtu.be/oIPzreHewY4', line: '금방 깨질 것처럼 조심스럽게 날 만져줘\n도자기처럼 혹은 날개가 부러진 새처럼' },
    ],
  },
  'hwi-hyunwoo': {
    tracks: [
      { title: '챠우챠우', artist: '델리스파이스', url: 'https://youtu.be/wecpRs9p00E', lrcId: 38991356 },
      { title: 'a Joke', artist: 'TRPP', url: 'https://youtu.be/qK_UwoNhH2E', line: '밖을 봐 우리가 없어 정말 재미없는 농담이지' },
      { title: 'Duvet', artist: 'Boa', url: 'https://youtu.be/adtntJCreYE', lrcId: 7964863, line: '넌 내가 널 상처 입힐 생각이 없다는 걸 알잖아' },
      { title: 'Go away', artist: 'TRPP', url: 'https://youtu.be/_ExMkEEh-RA', line: '용감하지 못한 울음은 참아내야 하네 이해할 수 없는 걸' },
      { title: '시간을 달리네', artist: '한로로', url: 'https://youtu.be/zIA9Z_UxQL8' },
    ],
  },
  'raphael-serena': {
    tracks: [
      { title: 'Young and Beautiful', artist: 'Lana Del Rey', url: 'https://youtu.be/Te11UaHOHMQ', lrcId: 7774503 },
    ],
  },
  'juho-jaehyung': {
    tracks: [
      { title: 'Closer (ft. Halsey)', artist: 'The Chainsmokers', url: 'https://youtu.be/cjiRUCcTWYE', line: '우린 영원히 그때 그대로일 거야' },
      { title: 'Run It', artist: 'Midnight Kids', url: 'https://youtu.be/uYbT05fIdhY', lrcId: 35153640 },
    ],
  },
  'uyeon-suho': {
    tracks: [
      { title: 'DAISIES', artist: 'Justin Bieber', url: 'https://youtu.be/msGuqelopMA', lrcId: 30348638, line: '왜냐하면 내 머릿속이 온통 너로 가득하니까' },
    ],
  },
  'anhwa-yujun': {
    tracks: [
      { title: '今日の日はさようなら', artist: 'Megumi Hayashibara', url: 'https://youtu.be/COw1pRQrTOo', lrcId: 8379571, line: '오늘은 이제 안녕' },
      { title: '추억 속의 그대', artist: 'dossi', url: 'https://youtu.be/o3IZhn2O_aM', line: '그대가 다시 올 순 없어도 지나간 추억만은 영원히' },
    ],
  },
  'chanyang-sion': {
    tracks: [
      { title: 'Wave', artist: '찬민', url: 'https://youtu.be/rMAwOI81kB8', lrcId: 13876628, line: '나 눈을 감으면 내 심장을 이 바다에 묻어줘요' },
      { title: '美しい鰭', artist: 'Spitz', url: 'https://youtu.be/n2m9ebS3tEo', lrcId: 16571773, line: '흐르는 대로 흘러가진다면\n저항해 볼까 아름다운 지느러미로' },
      { title: '絶縁', artist: 'Trooper Salute', url: 'https://youtu.be/uFbiNCSR5V4', line: '숨이 끊어지자 피복을 몸에 걸치고\n은빛 꿈을 꾸었어 절연이야' },
    ],
  },
  'taeo-banhee': {
    tracks: [
      { title: 'Dandelions', artist: 'Ruth B.', url: 'https://youtu.be/W8a4sUabCUo', lrcId: 7223798, line: '네 눈 속에서 영원을 봐' },
      { title: 'My Love Mine All Mine', artist: 'Mitski', url: 'https://youtu.be/CwGbMYLjIpQ', lrcId: 7366803, line: '제가 떠날 차례가 되면 남겨질 그녀를 위해 계속 빛나주실래요?' },
      { title: 'うたのけはい', artist: 'Ichiko Aoba', url: 'https://youtu.be/79OrYwtn1GQ', lrcId: 889825, line: '어제 본 무지갯빛 풍경보다\n지금 떨어지는 온기에 닿아 있고 싶어' },
    ],
  },
  'doha-hanseong': {
    tracks: [
      { title: '너의 궤도', artist: 'dossi', url: 'https://youtu.be/3JeNVo6wxaw', line: '난 이런 게 조금씩 어려워\n아 만약에 우리가 지금 만날 수 있다면' },
      { title: '飛行船', artist: '優里', url: 'https://youtu.be/8EF-3BDP6bE', lrcId: 16173399, line: '떠안은 전부를 내던지더라도 저 넓은 푸름에' },
      { title: 'ブルー', artist: 'indrop (feat. vallyutaite)', url: 'https://youtu.be/ZnwbiJR_488', line: '이렇게나 아름다운 하늘인데 나만이 이곳에 홀로' },
      { title: 'パレード', artist: 'ヨルシカ', url: 'https://youtu.be/RoBOoFgdlvU', lrcId: 9098176, lrcShift: -2.3, lrcSkip: [23], lrcAt: { 22: 258 }, line: '아주 잠깐만이어도 좋아 혼자만의 퍼레이드를' },
    ],
  },
  'jaeo-yeonwoo': {
    tracks: [
      { title: 'skeletons', artist: 'keshi', url: 'https://youtu.be/Pz-kASAP8aM', lrcId: 3602063 },
    ],
  },
};
