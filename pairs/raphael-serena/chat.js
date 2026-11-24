// 두 사람의 메시지 기록이에요. 여기만 고치면 화면에 그대로 나와요.
// - since : D-day를 세는 시작일 (이날이 D+1)
// - me    : 오른쪽 말풍선 쪽 사람 (라파엘: 짙은 남색 + 금빛 글씨)
// - them  : 왼쪽 말풍선 쪽 사람 (세레나: 붉은 망토색)
// - label : 대화창 맨 위에 보이는 이름 (라파엘이 저장해 둔 이름)
// - log   : 위에서부터 순서대로. from은 'me' 또는 'them', time은 그 위에 작게 뜨는 시간(없어도 돼요)
window.PAIR_CHAT = {
  since: '2025-11-22',
  me: '라파엘',
  them: '하나은',
  label: 'Serena',
  typing: false,
  log: [
    { from: 'them', text: '오늘 출격 세 건.', time: '오후 11:42' },
    { from: 'them', text: '전부 한 방에 끝냈어요.' },
    { from: 'me', text: '수고하셨네요.' },
    { from: 'me', text: '다친 곳은 없어요?' },
    { from: 'them', text: '없어요.' },
    { from: 'them', text: '아, 손등 조금 긁혔다.' },
    { from: 'them', text: '고쳐 주실 거죠?' },
    { from: 'me', text: '그럼요. 지금 갈게요.' },
    { from: 'me', text: '조금만 기다려 줘요.' },
  ],
};
