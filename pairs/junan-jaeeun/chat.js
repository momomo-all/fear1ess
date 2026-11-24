// 두 사람의 메시지 기록이에요. 여기만 고치면 화면에 그대로 나와요.
// - since : D-day를 세는 시작일 (이날이 D+1)
// - me    : 오른쪽 말풍선 쪽 사람 (주난: 남색 후드 바탕 + 보랏빛 글씨)
// - them  : 왼쪽 말풍선 쪽 사람 (재은: 검은 제복 바탕 + 금빛 글씨)
// - label : 대화창 맨 위에 보이는 이름 (주난이 저장해 둔 이름)
// - log   : 위에서부터 순서대로. from은 'me' 또는 'them', time은 그 위에 작게 뜨는 시간(없어도 돼요)
//   예) { from: 'me', text: '안녕', time: '오후 3:12' },
//   주난이는 아직 한국어가 서툴러서 오타가 나요 (일부러예요!)
window.PAIR_CHAT = {
  since: '2025-09-08',
  me: '천주난',
  them: '신재은',
  label: '♥ 爱侬 ♥',
  typing: false, // true면 맨 아래에 재은이 계속 '입력 중…'
  log: [
    { from: 'me', text: '형아', time: '오후 11:42' },
    { from: 'me', text: '형아 임무 끈났어?' },
    { from: 'me', text: '나 기달리고 잇어' },
    { from: 'me', text: '형아 안 보니까 심심해서 죽엇서' },
    { from: 'them', text: '아직요. 보고서 쓰는 중이에요.', time: '오후 11:58' },
    { from: 'me', text: '보거서 내가 대신 써줄께' },
    { from: 'me', text: '나 이제 한국말 잘 해' },
    { from: 'them', text: '방금 두 줄에 오타가 세 개예요.' },
    { from: 'me', text: '……' },
    { from: 'me', text: '형아 나빠' },
    { from: 'me', text: '그래도 조아 ☺' },
    { from: 'them', text: '착하네. 금방 갈게요, 기다려요.' },
    { from: 'me', text: '真个啊? 진짜??' },
    { from: 'me', text: '문 앞에서 기달릴께!!' },
  ],
};
