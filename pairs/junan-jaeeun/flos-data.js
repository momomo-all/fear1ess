// junan-jaeeun FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "junan-jaeeun",
  "color": "#7b5cff",
  "dispatch": "게이트 발생 — 전담 페어 출격 대기",
  "me": {
    "name": "천주난",
    "en": "CHEON JUNAN",
    "code": "SMILE",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/junan-jaeeun/junan-char.webp",
    "face": [
      0.32,
      0.21
    ],
    "href": "junan.html",
    "line": "“오늘도 나랑 같이 있어 줄 거야? 진짜로?”"
  },
  "them": {
    "name": "신재은",
    "en": "SHIN JAEEUN",
    "code": "DIOR",
    "cls": "GUIDE",
    "rank": "A",
    "img": "../../assets/pairs/junan-jaeeun/jaeeun-char.webp",
    "face": [
      0.43,
      0.2
    ],
    "href": "jaeeun.html",
    "line": "“왜 그렇게 긴장해요? …내가 뭐라도 할까봐?”"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 디올, 스마일."
  ],
  "comms": [
    {
      "who": "them",
      "text": "주난 씨, 출격 전 가이딩."
    },
    {
      "who": "me",
      "text": "형아! 손 줘 손!"
    },
    {
      "who": "them",
      "text": "착하네. 오늘 보고서는 내가 써요."
    },
    {
      "who": "me",
      "text": "내가 대신 써 주께!"
    },
    {
      "who": "them",
      "text": "오타 세 개 나요."
    },
    {
      "who": "me",
      "text": "真个啊… 그래도 형아 옆에 있을 거야. 진짜로!"
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-SG-0009",
      "title": "전담 페어 지정 통보 — S급 센티넬–A급 가이드 전담 페어 지정의 건",
      "from": "FEARLESS 지부",
      "to": "센티넬 천주난 (SMILE · S급)",
      "date": "2025. 09. 08.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 노고에 감사드립니다.",
        [
          "지부는 아래 인원의 가이딩 적합도 검사 결과에 따라, 두 사람을 공식 전담 페어로 지정하였음을 통보합니다.",
          [
            "센티넬 SMILE · 천주난 (S급)",
            "가이드 DIOR · 신재은 (A급)"
          ]
        ],
        [
          "지정 사항",
          [
            "전담 가이드는 해당 센티넬의 출격 전후 가이딩을 전담한다.",
            "전담 가이드는 센티넬 SMILE의 현장 출동 시 즉시 동행할 수 있도록 대기한다.",
            "페어의 해제는 지부의 승인 없이 할 수 없다."
          ]
        ]
      ]
    }
  ],
  "story": []
};
