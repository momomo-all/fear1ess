// 두 사람의 메시지 기록이에요. 여기만 고치면 화면에 그대로 나와요.
// - since : D-day를 세는 시작일 (이날이 D+1)
// - me    : 오른쪽 말풍선 쪽 사람 (휘: 나팔꽃 보라)
// - them  : 왼쪽 말풍선 쪽 사람 (현우: 검은 군복 + 금빛 글씨)
// - label : 대화창 맨 위에 보이는 이름 (휘가 저장해 둔 이름)
// - log   : 위에서부터 순서대로. from은 'me' 또는 'them', time은 그 위에 작게 뜨는 시간(없어도 돼요)
// ※ 지금 대화는 임시로 지어 둔 거예요 (31세, 휘가 돌아온 뒤)
window.PAIR_CHAT = {
  since: '2025-12-12',
  me: '윤 휘',
  them: '진현우',
  label: '현우',
  typing: false,
  log: [
    { from: 'them', text: '크리스마스에 뭐 해.', time: '오전 1:12' },
    { from: 'me', text: '일.' },
    { from: 'them', text: '빼.' },
    { from: 'me', text: '왜.' },
    { from: 'them', text: '4년 전엔 네가 없었잖아.' },
    { from: 'me', text: '...' },
    { from: 'me', text: '깨어날 줄 알았으면 안 갔어.' },
    { from: 'them', text: '알아.' },
    { from: 'them', text: '그러니까 이번엔 옆에 있어.' },
    { from: 'them', text: '명령이야.' },
    { from: 'me', text: '네, 네. 센티넬님.' },
  ],
};
