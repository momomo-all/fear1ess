// sehyun-yunwoo FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "sehyun-yunwoo",
  "color": "#22a6d6",
  "dispatch": "게이트 발생 — 전담 페어 출격 대기",
  "me": {
    "name": "한세현",
    "en": "HAN SEHYUN",
    "code": "X",
    "cls": "GUIDE",
    "rank": "S",
    "img": "../../assets/pairs/sehyun-yunwoo/sehyun-char.webp",
    "face": [
      0.58,
      0.23
    ],
    "href": "sehyun.html",
    "line": "“비키세요, 상대하고 싶지 않습니다.”"
  },
  "them": {
    "name": "지윤우",
    "en": "JI YUNWOO",
    "code": "SIEG",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/sehyun-yunwoo/yunwoo-char.webp",
    "face": [
      0.32,
      0.25
    ],
    "href": "yunwoo.html",
    "line": "“살아 돌아왔으면 됐지, 뭘 그렇게 의미를 둬.”"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 지크, 엑스."
  ],
  "comms": [
    {
      "who": "them",
      "text": "표정 풀어."
    },
    {
      "who": "me",
      "text": "이번엔 다치지 마요."
    },
    {
      "who": "them",
      "text": "살아 돌아오면 됐지."
    },
    {
      "who": "me",
      "text": "그 말 또 하면 진짜 화낼 거예요."
    },
    {
      "who": "them",
      "text": "…알았어. 안 다칠게."
    },
    {
      "who": "me",
      "text": "끝나면 바로 연락해요. 얼굴 보기 전까진 안 잘 거니까."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-SG-0014",
      "title": "전담 페어 지정 통보 — S급 센티넬–가이드 전담 페어 지정의 건",
      "from": "FEARLESS 지부",
      "to": "가이드 한세현 (X · S급)",
      "date": "2026. 03. 03.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 노고에 감사드립니다.",
        [
          "지부는 아래 인원의 가이딩 적합도 검사 결과에 따라, 두 사람을 공식 전담 페어로 지정하였음을 통보합니다.",
          [
            "센티넬 SIEG · 지윤우 (S급)",
            "가이드 한세현 (S급)"
          ]
        ],
        [
          "지정 사항",
          [
            "전담 가이드는 해당 센티넬의 출격 전후 가이딩을 전담한다.",
            "전담 가이드는 센티넬 SIEG의 현장 출동 시 즉시 동행할 수 있도록 대기한다.",
            "페어의 해제는 지부의 승인 없이 할 수 없다."
          ]
        ]
      ]
    }
  ],
  "story": []
};
