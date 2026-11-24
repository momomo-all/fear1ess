// hwi-hyunwoo FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "hwi-hyunwoo",
  "color": "#d9a93a",
  "dispatch": "게이트 발생 — 정식 페어 출격 대기",
  "me": {
    "name": "윤 휘",
    "en": "YOON HWI",
    "code": "GLORY",
    "cls": "GUIDE",
    "rank": "S",
    "img": "../../assets/pairs/hwi-hyunwoo/hwi-char.webp",
    "face": [
      0.55,
      0.22
    ],
    "href": "hwi.html",
    "line": "“피어 있는 동안은 전부 네 거야.”"
  },
  "them": {
    "name": "진현우",
    "en": "JIN HYUNWOO",
    "code": "PRIDE",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/hwi-hyunwoo/hyunwoo-char.webp",
    "face": [
      0.17,
      0.26
    ],
    "href": "hyunwoo.html",
    "line": "“꿇어, 그렇지.”"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 프라이드, 글로리."
  ],
  "comms": [
    {
      "who": "them",
      "text": "위치."
    },
    {
      "who": "me",
      "text": "네 바로 뒤."
    },
    {
      "who": "them",
      "text": "앞으로 나와. 옆에 서."
    },
    {
      "who": "me",
      "text": "명령이야?"
    },
    {
      "who": "them",
      "text": "명령이야."
    },
    {
      "who": "me",
      "text": "네, 네. 센티넬님. 피어 있는 동안은 전부 네 거니까."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-GP-0007",
      "title": "페어 결성 통보 — 신규 입사자 정식 페어 지정의 건",
      "from": "FEARLESS 지부",
      "to": "가이드 윤 휘 (GLORY · S급)",
      "date": "2025. 12. 12.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 입사를 축하드립니다.",
        [
          "입사 적성 평가 결과, 아래 두 인원의 동조율이 기준치를 크게 웃돌아 정식 페어로 지정하오니 업무에 참고하시기 바랍니다.",
          [
            "센티넬 PRIDE · 진현우 (S급)",
            "가이드 GLORY · 윤 휘 (S급)"
          ]
        ],
        [
          "준수 사항",
          [
            "페어는 모든 임무에 함께 출동한다.",
            "가이드는 센티넬의 상태를 항시 확인하고 지원한다.",
            "본 지정은 별도의 해제 통보가 있을 때까지 유지한다."
          ]
        ]
      ]
    }
  ],
  "story": []
};
