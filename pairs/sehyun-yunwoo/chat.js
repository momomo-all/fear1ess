// 두 사람의 메시지 기록이에요. 여기만 고치면 화면에 그대로 나와요.
// - since : D-day를 세는 시작일 (이날이 D+1)
// - me    : 오른쪽 말풍선 쪽 사람 (세현: 검은 셔츠 바탕 + 푸른 눈 글씨)
// - them  : 왼쪽 말풍선 쪽 사람 (윤우: 흰 셔츠 바탕 + 금빛 글씨)
// - label : 대화창 맨 위에 보이는 이름 (세현이 저장해 둔 이름)
// - log   : 위에서부터 순서대로. from은 'me' 또는 'them', time은 그 위에 작게 뜨는 시간(없어도 돼요)
//   예) { from: 'me', text: '안녕', time: '오후 3:12' },
window.PAIR_CHAT = {
  since: '2026-03-03',
  me: '한세현',
  them: '지윤우',
  label: '윤우 형',
  typing: false, // true면 맨 아래에 윤우가 계속 '입력 중…'
  log: [
    { from: 'me', text: '형', time: '오후 11:02' },
    { from: 'me', text: '임무 끝났죠' },
    { from: 'me', text: '끝난 거 알아요 상황실에 다 떠요' },
    { from: 'me', text: '근데 왜 연락이 없어요' },
    { from: 'me', text: '형' },
    { from: 'me', text: '형 왜 답장 안 하냐고요' },
    { from: 'me', text: '읽지도 않네' },
    { from: 'me', text: '벌써 자요?' },
    { from: 'me', text: '아니면 딴 가이드랑 있어요?' },
    { from: 'me', text: '대답해요' },
    { from: 'me', text: '형', time: '오전 1:47' },
    { from: 'me', text: '진짜 화낼 거예요' },
    { from: 'me', text: '…' },
    { from: 'them', text: '헐', time: '오전 6:12' },
    { from: 'them', text: '지금 일어났어' },
    { from: 'them', text: '40통 뭔데~~' },
  ],
  // - drafts : 세현이가 아래 입력칸에 쳤다가 지우는 말 (보내지는 못해요). 위에서부터 차례로, 끝나면 처음부터 다시
  drafts: [
    '꺼져요',
    '왜 일찍 자냐고요',
    '형 진짜 짜증나',
    '형 미워요',
    '다시는 연락 안 해요',
    '보고 싶었다고요',
  ],
};
