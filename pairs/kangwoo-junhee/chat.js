// 두 사람의 메시지 기록이에요. 여기만 고치면 화면에 그대로 나와요.
// - since : D-day를 세는 시작일 (이날이 D+1)
// - me    : 오른쪽 말풍선 쪽 사람 (강우: 짙은 보라)
// - them  : 왼쪽 말풍선 쪽 사람 (준희: 새하얀 바탕 + 파란 글씨)
// - label : 대화창 맨 위에 보이는 이름 (강우가 저장해 둔 이름)
// - log   : 위에서부터 순서대로. from은 'me' 또는 'them', time은 그 위에 작게 뜨는 시간(없어도 돼요)
window.PAIR_CHAT = {
  since: '2025-08-13',
  me: '백강우',
  them: '우준희',
  label: '토끼',
  typing: true, // 맨 아래에 준희가 계속 '입력 중…'
  log: [
    { from: 'them', text: '형.' },
    { from: 'them', text: '혀엉.' },
    { from: 'them', text: '왜 답 안 해요.' },
    { from: 'them', text: '3분 지났는데 답이 없네요. 잘 살아요.' },
    { from: 'me', text: '무슨 일인데.' },
    { from: 'them', text: '보고 싶어서요.' },
    { from: 'them', text: '설마 나 안 보고 싶은 거 아니죠? 형. 그런 말 하면 저 진짜 상처 받아요.' },
    { from: 'them', text: '...근데 왜 항상 내가 형한테 먼저 문자 보내요? 다른 집 남친들은 문자도 먼저 보내주고, 늘 먼저 제안한다는데.' },
    { from: 'me', text: '아니 내가 제안할게.' },
    { from: 'me', text: '이제 제안할게.' },
    { from: 'them', text: '딴 남자들은 다 알아서 하는데.' },
    { from: 'me', text: '싸우지 말자고 제안한다.' },
  ],
};
