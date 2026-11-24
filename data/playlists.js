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
      { title: 'i think of you the most', artist: 'yung kai', url: 'https://youtu.be/RAvFybdrPpo', lrcId: 38199818 },
      { title: 'Fantasy', artist: 'khai dreams', url: 'https://youtu.be/vysjRahYFz0', lrcId: 2158310 },
      { title: 'blue', artist: 'yung kai', url: 'https://youtu.be/98zHKN-xSHk', lrcId: 30984601 },
    ],
  },
  'sehyun-yunwoo': {
    tracks: [
      { title: 'LOVE YOU LESS', artist: 'Joji', url: 'https://youtu.be/fuz9LP4tP4g', lrcId: 31960875 },
      { title: 'over', artist: 'quiet morning', url: 'https://youtu.be/-pNE7nG-nKA' },
      { title: '꿈에 카메라를 가져올걸', artist: '꿈에 카메라를 가져올걸', url: 'https://youtu.be/5oekhGIANSs' },
    ],
  },
  // 테마곡(mp3)은 사이트 안에서 바로 재생되고, data/lyrics.js에 가사가 있으면 가사창이 떠요
  'yungang-gyuna': {
    tracks: [
      { title: '君の夏に 触れさせて', artist: 'Original Theme', src: 'assets/pairs/yungang-gyuna/theme.mp3', lyrics: 'yungang-gyuna' },
      { title: 'W / X / Y', artist: 'Tani Yuuki', url: 'https://youtu.be/FgAMCLzLE9c' },
      { title: 'Somebody To You', artist: 'The Vamps', url: 'https://youtu.be/A4MevL6dvUw', lrcId: 18569107 },
    ],
  },
  'kangwoo-junhee': {
    tracks: [
      { title: '言えない秘密', artist: 'Original Theme', src: 'assets/pairs/kangwoo-junhee/theme.mp3', lyrics: 'kangwoo-junhee' },
      { title: '幽霊', artist: 'odol', url: 'https://youtu.be/9vILjuCHGwA' },
      { title: '恋煩い', artist: 'Ryukku to Soine Gohan', url: 'https://youtu.be/knQvHmpq0jM', lrcArtist: 'リュックと添い寝ごはん' },
      { title: '怪獣の花唄', artist: 'Vaundy', url: 'https://youtu.be/ENQANfv2ANQ', lrcId: 24720751 },
    ],
  },
  'yunje-ijae': {
    tracks: [
      { title: 'Je te laisserai des mots', artist: 'Patrick Watson', url: 'https://youtu.be/XZfyyk0_Yqs', lrcId: 7592384 },
      { title: 'Do It Again', artist: 'Sydney Ross Mitchell', url: 'https://youtu.be/oIPzreHewY4' },
    ],
  },
  'hwi-hyunwoo': {
    tracks: [
      { title: 'a Joke', artist: 'TRPP', url: 'https://youtu.be/qK_UwoNhH2E' },
      { title: 'Duvet', artist: 'Boa', url: 'https://youtu.be/adtntJCreYE', lrcId: 7964863 },
      { title: 'Go away', artist: 'TRPP', url: 'https://youtu.be/_ExMkEEh-RA' },
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
      { title: 'DAISIES', artist: 'Justin Bieber', url: 'https://youtu.be/msGuqelopMA', lrcId: 30348638 },
    ],
  },
  'taeo-banhee': {
    tracks: [
      { title: 'Dandelions', artist: 'Ruth B.', url: 'https://youtu.be/W8a4sUabCUo', lrcId: 7223798 },
      { title: 'My Love Mine All Mine', artist: 'Mitski', url: 'https://youtu.be/CwGbMYLjIpQ', lrcId: 7366803 },
      { title: 'うたのけはい', artist: 'Ichiko Aoba', url: 'https://youtu.be/79OrYwtn1GQ', lrcId: 889825 },
    ],
  },
  'doha-hanseong': {
    tracks: [
      { title: '너의 궤도', artist: 'dossi', url: 'https://youtu.be/3JeNVo6wxaw' },
      { title: 'ブルー', artist: 'indrop (feat. vallyutaite)', url: 'https://youtu.be/ZnwbiJR_488', line: '이렇게나 아름다운 하늘인데 나만이 이곳에 홀로' },
      { title: '飛行船', artist: '優里', url: 'https://youtu.be/8EF-3BDP6bE', lrcId: 16173399 },
      { title: 'パレード', artist: 'ヨルシカ', url: 'https://youtu.be/RoBOoFgdlvU', lrcId: 9098176, lrcShift: -2.3, lrcSkip: [23], lrcAt: { 22: 258 } },
    ],
  },
};
