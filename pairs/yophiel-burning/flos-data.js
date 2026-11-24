// yophiel-burning FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "yophiel-burning",
  "color": "#e2552a",
  "dispatch": "게이트 발생 — 보호관리 개체 동행 출격",
  "link": "GUIDE ↔ ENTITY",
  "me": {
    "name": "요피엘",
    "en": "YOPHIEL",
    "code": "YOPHIEL",
    "cls": "UNCLASSIFIED",
    "rank": "?",
    "role": "FEARLESS · 임시 보호관리 개체",
    "unit": "FEARLESS 임시 보호관리",
    "img": "../../assets/pairs/yophiel-burning/yophiel-char.webp",
    "face": [
      0.42,
      0.26
    ],
    "href": "yophiel.html",
    "line": "“아름다움이 있으라. 무엇이 막겠는가?”"
  },
  "them": {
    "name": "권재혁",
    "en": "KWON JAEHYEOK",
    "code": "BURNING",
    "cls": "GUIDE",
    "rank": "S",
    "img": "../../assets/pairs/yophiel-burning/burning-char.webp",
    "face": [
      0.74,
      0.3
    ],
    "href": "burning.html",
    "line": "“작작 놀다 와. 씨발, 나만 힘드니까.”"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 버닝, 요피엘."
  ],
  "comms": [
    {
      "who": "them",
      "text": "야. 날개 접어. 눈에 띈다고."
    },
    {
      "who": "me",
      "text": "접으면 아름답지 않다."
    },
    {
      "who": "them",
      "text": "씨발, 아름다운 거 따지지 말고 내 뒤에 붙어 있어."
    },
    {
      "who": "me",
      "text": "게이트 너머는 내가 온 곳이다. 길은 내가 안다."
    },
    {
      "who": "them",
      "text": "…그러니까 더 붙어 있으라고."
    },
    {
      "who": "me",
      "text": "알겠다, 재혁. 작작 놀다 오겠다."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-GT-0031",
      "title": "임시 보호관리 지정 통보 — 게이트 출현 미확인 개체의 임시 보호관리 위임의 건",
      "from": "FEARLESS 지부",
      "to": "요피엘 (YOPHIEL · ?급)",
      "date": "2026. 01. 22.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 노고에 감사드립니다.",
        [
          "최근 게이트에서 출현한 미확인 개체(코드네임 YOPHIEL)에 대한 1차 관찰 결과는 아래와 같습니다.",
          [
            "외형은 인간형이며, 등 뒤에 한 쌍의 날개가 있음. (천사형)",
            "인간 사회에 대한 기본 상식이 전혀 없음.",
            "현재까지 위해 행위는 관찰되지 않음."
          ]
        ],
        [
          "이에 지부는 아래 인원을 해당 개체의 임시 보호관리 책임자로 지정하오니, 개체의 교화 및 인간 사회 적응을 지원하여 주시기 바랍니다.",
          [
            "책임 가이드 BURNING · 권재혁 (S급)",
            "?? YOPHIEL · יוֹפִיאֵל (등급 미확인)"
          ]
        ],
        [
          "준수 사항",
          [
            "개체는 책임 가이드의 동행 없이 외출할 수 없다.",
            "책임 가이드는 개체의 적응 경과를 매주 지부에 보고한다.",
            "위해 징후가 확인될 경우 즉시 지부에 보고한다.",
            "본 지정은 임시이며, 개체의 분류가 확정될 때까지 유지한다."
          ]
        ]
      ]
    }
  ],
  "story": []
};
