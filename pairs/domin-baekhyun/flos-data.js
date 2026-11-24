// domin-baekhyun FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "domin-baekhyun",
  "color": "#3fbf72",
  "dispatch": "게이트 발생 — 전투 페어 출격 대기",
  "me": {
    "name": "윤도민",
    "en": "YOON DOMIN",
    "code": "TOMA",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/domin-baekhyun/domin-char.webp",
    "face": [
      0.48,
      0.26
    ],
    "href": "domin.html",
    "line": "“미래 같은 건, 바꾸면 그만이야.”"
  },
  "them": {
    "name": "하백현",
    "en": "HA BAEKHYUN",
    "code": "CHERVIL",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/domin-baekhyun/baekhyun-char.webp",
    "face": [
      0.27,
      0.24
    ],
    "href": "baekhyun.html",
    "line": "“더 숨겨봐. 네 숨, 내가 다 들춰낼 테니까.”"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 체르빌, 토마."
  ],
  "comms": [
    {
      "who": "them",
      "text": "또 뭘 봤어."
    },
    {
      "who": "me",
      "text": "별거 아니야."
    },
    {
      "who": "them",
      "text": "숨 고르는 거 다 들려. 숨기지 마."
    },
    {
      "who": "me",
      "text": "…이번 게이트, 끝이 좋지 않아."
    },
    {
      "who": "them",
      "text": "그래서?"
    },
    {
      "who": "me",
      "text": "바꾸면 그만이지. 위치 공유 켜 둬."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-SS-0007",
      "title": "전투 페어 지정 통보 — S급 센티넬 2인 전투 페어 지정의 건",
      "from": "FEARLESS 지부",
      "to": "센티넬 윤도민 (TOMA · S급)",
      "date": "2025. 08. 19.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 노고에 감사드립니다.",
        [
          "지부는 아래 인원을 전투 페어로 지정하였음을 통보합니다.",
          [
            "센티넬 TOMA · 윤도민 (S급)",
            "센티넬 CHERVIL · 하백현 (S급)"
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
