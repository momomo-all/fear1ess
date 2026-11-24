// 두 사람의 메시지 기록이에요. 여기만 고치면 화면에 그대로 나와요.
// - since : D-day를 세는 시작일 (이날이 D+1)
// - me    : 오른쪽 말풍선 쪽 사람 (요피엘: 새하얀 바탕 + 초록 글씨)
// - them  : 왼쪽 말풍선 쪽 사람 (재혁: 불타는 붉은 머리색)
// - label : 대화창 맨 위에 보이는 이름 (요피엘이 저장해 둔 이름)
// - log   : 위에서부터 순서대로. from은 'me' 또는 'them', time은 그 위에 작게 뜨는 시간(없어도 돼요)
window.PAIR_CHAT = {
  since: '2026-01-22',
  me: '요피엘',
  them: '권재혁',
  label: '재혁',
  typing: true, // 맨 아래에 재혁이가 계속 '입력 중…'
  log: [
    { from: 'me', text: '재혁.' },
    { from: 'me', text: '검고 네모난 상자 안에 사람이 갇혀 있다.' },
    { from: 'me', text: '꺼내 주어야 하는가.' },
    { from: 'them', text: '그거 TV야.' },
    { from: 'them', text: '건들지 마.' },
    { from: 'me', text: '아름답지 않다. 부숴도 되는가.' },
    { from: 'them', text: '작작 해라 진짜' },
    { from: 'them', text: '야 왜 답이 없어' },
    { from: 'them', text: '야 씨발 이미 부순 거 아니지?' },
    { from: 'me', text: '부쉈다.' },
    { from: 'me', text: '사람이 없었다.' },
    { from: 'them', text: '이런 씨발' },
  ],
};
