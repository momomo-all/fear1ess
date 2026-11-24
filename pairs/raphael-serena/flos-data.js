// raphael-serena FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "raphael-serena",
  "color": "#7fb6e8",
  "dispatch": "게이트 발생 — 전담 페어 출격 대기",
  "link": "SENTINEL ↔ HEALER",
  "me": {
    "name": "라파엘",
    "en": "RAPHAEL",
    "code": "RAPHAEL",
    "cls": "UNCLASSIFIED",
    "rank": "?",
    "role": "FEARLESS · 등급 미확인",
    "img": "../../assets/pairs/raphael-serena/raphael-char.webp",
    "face": [
      0.6,
      0.28
    ],
    "href": "raphael.html",
    "line": "“나그네여, 두려워 말라. 내가 너를 집으로 데려가리라.”"
  },
  "them": {
    "name": "하나은",
    "en": "HA NAEUN",
    "code": "SERENA",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/raphael-serena/serena-char.webp",
    "face": [
      0.25,
      0.26
    ],
    "href": "serena.html",
    "line": "“한 방에, 주님 곁으로.”"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 세레나, 라파엘."
  ],
  "comms": [
    {
      "who": "them",
      "text": "오늘도 한 방에 끝낼게요."
    },
    {
      "who": "me",
      "text": "다치지 않는 게 먼저예요."
    },
    {
      "who": "them",
      "text": "다치면 고쳐 주실 거잖아요."
    },
    {
      "who": "me",
      "text": "그럼요. 그래도 다치지 않았으면 좋겠어요."
    },
    {
      "who": "them",
      "text": "…알았어요. 손등 하나 안 긁히고 올게요."
    },
    {
      "who": "me",
      "text": "두려워 말아요. 집으로 데려갈게요."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-SG-1207",
      "title": "전담 페어 지정 통보 — S급 센티넬 전담 페어 지정의 건 (특례)",
      "from": "FEARLESS 지부",
      "to": "라파엘 (RAPHAEL · ?급)",
      "date": "2025. 11. 22.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 노고에 감사드립니다.",
        [
          "지부는 아래 인원의 가이딩 적합도 검사 및 특이 능력 평가 결과에 따라, 두 사람을 공식 전담 페어로 지정하였음을 통보합니다.",
          [
            "센티넬 SERENA · 하나은 (S급)",
            "?? RAPHAEL · רְפָאֵל (등급 미확인)"
          ]
        ],
        [
          "특례 사유",
          [
            "RAPHAEL의 등급 및 능력 분류는 현재까지 확인되지 않았다.",
            "다만 치유 및 안정화 능력이 확인되어, 센티넬 SERENA의 전담 인원으로 이례적으로 지정한다."
          ]
        ],
        [
          "지정 사항",
          [
            "RAPHAEL은 해당 센티넬의 출격 전후 치유 및 안정화를 전담한다.",
            "RAPHAEL은 센티넬 SERENA의 현장 출동 시 즉시 동행할 수 있도록 대기한다.",
            "페어의 해제는 지부의 승인 없이 할 수 없다."
          ]
        ]
      ]
    }
  ],
  "story": []
};
