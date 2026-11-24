// geonwoo-jaeha FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "geonwoo-jaeha",
  "color": "#d8262b",
  "dispatch": "게이트 발생 — 전투 페어 출격 대기",
  "me": {
    "name": "강건우",
    "en": "KANG GEONWOO",
    "code": "STEEL",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/geonwoo-jaeha/geonwoo-char.webp",
    "face": [
      0.77,
      0.26
    ],
    "href": "geonwoo.html",
    "line": "“얼마나 버티는지 좀 볼까?”"
  },
  "them": {
    "name": "백재하",
    "en": "BAEK JAEHA",
    "code": "GISELLE",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/geonwoo-jaeha/jaeha-char.webp",
    "face": [
      0.63,
      0.24
    ],
    "href": "jaeha.html",
    "line": "“멍청한 거 티내지 마. 없어 보여.”"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 지젤, 스틸."
  ],
  "comms": [
    {
      "who": "them",
      "text": "발목 잡지 마."
    },
    {
      "who": "me",
      "text": "그 말 그대로 돌려줄게."
    },
    {
      "who": "them",
      "text": "멍청한 거 티 내지 말고 계획대로 움직여."
    },
    {
      "who": "me",
      "text": "계획은 네가 짰고, 끝내는 건 내가 하지."
    },
    {
      "who": "them",
      "text": "…얼마나 버티는지 볼게."
    },
    {
      "who": "me",
      "text": "그건 내 대사인데."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-SS-0006",
      "title": "전투 페어 지정 통보 — S급 센티넬 2인 전투 페어 지정의 건",
      "from": "FEARLESS 지부",
      "to": "센티넬 강건우 (STEEL · S급)",
      "date": "2025. 08. 17.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 노고에 감사드립니다.",
        [
          "지부는 아래 인원을 전투 페어로 지정하였음을 통보합니다.",
          [
            "센티넬 STEEL · 강건우 (S급)",
            "센티넬 GISELLE · 백재하 (S급)"
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
