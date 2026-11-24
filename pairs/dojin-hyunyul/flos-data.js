// dojin-hyunyul FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "dojin-hyunyul",
  "color": "#8fb3d9",
  "dispatch": "게이트 발생 — 협동 페어 출격 대기",
  "me": {
    "name": "서도진",
    "en": "SEO DOJIN",
    "code": "NOVA",
    "cls": "SENTINEL",
    "rank": "A",
    "img": "../../assets/pairs/dojin-hyunyul/dojin-char.webp",
    "face": [
      0.55,
      0.22
    ],
    "href": "dojin.html",
    "line": "“저는 그저 당신을 지킬 뿐입니다. 무너지지 않게.”"
  },
  "them": {
    "name": "김현율",
    "en": "KIM HYUNYUL",
    "code": "PULSE",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/dojin-hyunyul/hyunyul-char.webp",
    "face": [
      0.66,
      0.24
    ],
    "href": "hyunyul.html",
    "line": "“또 그렇게 숨 죽이면… 장난치고 싶어지잖아요.”"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 펄스, 노바."
  ],
  "comms": [
    {
      "who": "them",
      "text": "또 숨 죽이고 있네요."
    },
    {
      "who": "me",
      "text": "작전 전입니다."
    },
    {
      "who": "them",
      "text": "그렇게 보고만 있으면 장난치고 싶어지잖아요."
    },
    {
      "who": "me",
      "text": "현장에선 제 시야 밖으로 나가지 마십시오."
    },
    {
      "who": "them",
      "text": "감시예요, 걱정이에요?"
    },
    {
      "who": "me",
      "text": "…지키는 겁니다. 무너지지 않게."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-SS-0012",
      "title": "협동 페어 지정 통보 — S급 센티넬–A급 센티넬 협동 페어 지정의 건",
      "from": "FEARLESS 지부",
      "to": "센티넬 서도진 (NOVA · A급)",
      "date": "2025. 10. 22.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 노고에 감사드립니다.",
        [
          "지부는 아래 인원을 공식 협동 페어로 지정하였음을 통보합니다.",
          [
            "센티넬 PULSE · 김현율 (S급)",
            "센티넬 NOVA · 서도진 (A급)"
          ]
        ],
        [
          "지정 사항",
          [
            "두 센티넬은 현장 출동 시 함께 행동한다.",
            "페어의 해제는 지부의 승인 없이 할 수 없다."
          ]
        ],
        [
          "별첨 (열람 제한)",
          [
            "A급 센티넬 NOVA는 S급 센티넬 PULSE의 동향을 지부장에게 직접 보고한다."
          ]
        ]
      ]
    }
  ],
  "story": []
};
