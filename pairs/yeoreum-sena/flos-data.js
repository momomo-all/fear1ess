// yeoreum-sena FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "yeoreum-sena",
  "color": "#e59ab4",
  "dispatch": "게이트 발생 — 전투 페어 출격 대기",
  "me": {
    "name": "한여름",
    "en": "HAN YEOREUM",
    "code": "SUMMER",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/yeoreum-sena/yeoreum-char.webp",
    "face": [
      0.85,
      0.26
    ],
    "href": "yeoreum.html",
    "line": "“…움직일 수 없을 겁니다.”"
  },
  "them": {
    "name": "윤세나",
    "en": "YOON SENA",
    "code": "SIREN",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/yeoreum-sena/sena-char.webp",
    "face": [
      0.28,
      0.16
    ],
    "href": "sena.html",
    "line": "“몸이 무겁다구요? …아, 그 정도면 아직 얕아요.”"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 세이렌, 썸머."
  ],
  "comms": [
    {
      "who": "them",
      "text": "오늘 바다 냄새가 나요."
    },
    {
      "who": "me",
      "text": "게이트 쪽 습도가 높습니다."
    },
    {
      "who": "them",
      "text": "깊은 데까지 끌고 들어갈게요. 따라올 수 있어요?"
    },
    {
      "who": "me",
      "text": "제가 멈춰 두겠습니다. 그 사이에 끝내세요."
    },
    {
      "who": "them",
      "text": "얕게 하지 마요. 저 지루한 거 싫어해요."
    },
    {
      "who": "me",
      "text": "…움직일 수 없게 해 두죠."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-SS-0008",
      "title": "전투 페어 지정 통보 — S급 센티넬 2인 전투 페어 지정의 건",
      "from": "FEARLESS 지부",
      "to": "센티넬 한여름 (SUMMER · S급)",
      "date": "2025. 08. 27.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 노고에 감사드립니다.",
        [
          "지부는 아래 인원을 전투 페어로 지정하였음을 통보합니다.",
          [
            "센티넬 SUMMER · 한여름 (S급)",
            "센티넬 SIREN · 윤세나 (S급)"
          ]
        ],
        [
          "준수 사항",
          [
            "페어 인원은 작전 중 상호 위치를 공유한다.",
            "페어 인원 간의 마찰은 지부에 보고한다.",
            "페어의 해제는 지부의 승인 없이 할 수 없다."
          ]
        ]
      ]
    }
  ],
  "story": []
};
