// 두 사람의 메시지 기록이에요. 여기만 고치면 화면에 그대로 나와요.
// - since : D-day를 세는 시작일 (이날이 D+1)
// - me    : 오른쪽 말풍선 쪽 사람 (윤강: 남색 + 레몬색 글씨)
// - them  : 왼쪽 말풍선 쪽 사람 (규나: 꿀빛 골드)
// - label : 대화창 맨 위에 보이는 이름 (윤강이 저장해 둔 이름)
// - log   : 위에서부터 순서대로. from은 'me' 또는 'them', time은 그 위에 작게 뜨는 시간(없어도 돼요)
window.PAIR_CHAT = {
  since: '2025-08-14',
  me: '서윤강',
  them: '김규나',
  label: '내 고양이❤️',
  log: [
    { from: 'them', text: '서윤강. 니가 내 아이스크림 다 처먹었냐?', time: '오후 2:17' },
    { from: 'me', text: '응.' },
    { from: 'them', text: '죽을래?' },
    { from: 'me', text: '규나야, 생각해 봐.' },
    { from: 'me', text: '아이스크림 누구 거야.' },
    { from: 'them', text: '내 거.' },
    { from: 'me', text: '누구 돈으로 샀는데.' },
    { from: 'them', text: '내 돈으로.' },
    { from: 'me', text: '너 누구 거야.' },
    { from: 'them', text: '뒤지고 싶냐 진짜??' },
    { from: 'me', text: '규나야.', time: '오후 6:42' },
    { from: 'me', text: '잘못 했어.' },
    { from: 'me', text: '진짜로. 다음부터 아이스크림에 손도 안 댈게 ㅠㅠ' },
    { from: 'me', text: '문만 열어주라, 제발...' },
    { from: 'them', text: '맨입으로? 죽을래?' },
    { from: 'them', text: '아이스크림 다섯 개 사와.' },
    { from: 'them', text: '제일 비싼 걸로.' },
    { from: 'me', text: '응, 당연하지. 진짜 금방 다녀올게. 사랑해❤️' },
  ],
};
