// yungang-gyuna FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · avatar 정사각형 프사 (있으면 이걸 먼저 써요)
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "yungang-gyuna",
  "color": "#9cc46a",
  "dispatch": "게이트 발생 — 전담 페어 출격 대기",
  "me": {
    "name": "서윤강",
    "en": "SEO YUNGANG",
    "code": "PANTHER",
    "cls": "GUIDE",
    "rank": "S",
    "img": "../../assets/pairs/yungang-gyuna/yungang-char.webp",
    "face": [
      0.7,
      0.26
    ],
    "href": "yungang.html",
    "line": "“죽으란 법은 없구나.”",
    "avatar": "../../assets/pairs/yungang-gyuna/yungang-avatar.webp"
  },
  "them": {
    "name": "김규나",
    "en": "KIM GYUNA",
    "code": "KITTY",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/yungang-gyuna/gyuna-char.webp",
    "face": [
      0.42,
      0.22
    ],
    "href": "gyuna.html",
    "line": "“키 작다고 무시하지 마. 눈 높이 맞춰 줘?”",
    "avatar": "../../assets/pairs/yungang-gyuna/gyuna-avatar.webp"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 키티, 팬서."
  ],
  "comms": [
    {
      "who": "them",
      "text": "늦었어."
    },
    {
      "who": "me",
      "text": "1분 늦었어, 규나야. 아이스크림 사 오느라."
    },
    {
      "who": "them",
      "text": "…무슨 맛."
    },
    {
      "who": "me",
      "text": "제일 비싼 걸로. 다녀와서 같이 먹자."
    },
    {
      "who": "them",
      "text": "다치면 안 먹어 줄 거야."
    },
    {
      "who": "me",
      "text": "응, 안 다칠게. 네 옆에 딱 붙어 있을게."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-SG-0720",
      "title": "전담 페어 지정 통보 — S급 센티넬–가이드 전담 페어 지정의 건",
      "from": "FEARLESS 지부",
      "to": "가이드 서윤강 (PANTHER · S급)",
      "date": "2025. 08. 14.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 노고에 감사드립니다.",
        [
          "지부는 아래 인원의 가이딩 적합도 검사 결과에 따라, 두 사람을 공식 전담 페어로 지정하였음을 통보합니다.",
          [
            "센티넬 KITTY · 김규나 (S급)",
            "가이드 PANTHER · 서윤강 (S급)"
          ]
        ],
        [
          "지정 사항",
          [
            "전담 가이드는 해당 센티넬의 출격 전후 가이딩을 전담한다.",
            "전담 가이드는 센티넬 KITTY의 현장 출동 시 즉시 동행할 수 있도록 대기한다.",
            "페어의 해제는 지부의 승인 없이 할 수 없다."
          ]
        ]
      ]
    }
  ],
  "story": []
};
