// kangwoo-junhee FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
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
  "id": "kangwoo-junhee",
  "color": "#d42a22",
  "dispatch": "게이트 발생 — 전담 페어 출격 대기",
  "me": {
    "name": "백강우",
    "en": "BAEK KANGWOO",
    "code": "VIOLET",
    "cls": "GUIDE",
    "rank": "S",
    "img": "../../assets/pairs/kangwoo-junhee/kangwoo-char.webp",
    "face": [
      0.68,
      0.21
    ],
    "href": "kangwoo.html",
    "line": "“반항은 허용되지 않습니다.”",
    "avatar": "../../assets/pairs/kangwoo-junhee/kangwoo-avatar.webp"
  },
  "them": {
    "name": "우준희",
    "en": "WOO JUNHEE",
    "code": "BLANC",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/kangwoo-junhee/junhee-char.webp",
    "face": [
      0.77,
      0.27
    ],
    "href": "junhee.html",
    "line": "“귀여워 보였죠? 그래서 당한 거예요.”",
    "avatar": "../../assets/pairs/kangwoo-junhee/junhee-avatar.webp"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 블랑, 비올레."
  ],
  "comms": [
    {
      "who": "them",
      "text": "형, 가이딩 아직이에요."
    },
    {
      "who": "me",
      "text": "출격 전 수치는 충분해."
    },
    {
      "who": "them",
      "text": "충분한 거랑 제가 원하는 건 다르잖아요."
    },
    {
      "who": "me",
      "text": "작전 중이야. 반항은 허용되지 않아."
    },
    {
      "who": "them",
      "text": "그럼 돌아와서 두 배로 받을게요. 약속해요, 형."
    },
    {
      "who": "me",
      "text": "…무사히 돌아오면."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-SG-1201",
      "title": "전담 페어 지정 통보 — S급 센티넬–가이드 전담 페어 지정의 건",
      "from": "FEARLESS 지부",
      "to": "가이드 백강우 (VIOLET · S급)",
      "date": "2025. 08. 13.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 노고에 감사드립니다.",
        [
          "지부는 아래 인원의 가이딩 적합도 검사 결과에 따라, 두 사람을 공식 전담 페어로 지정하였음을 통보합니다.",
          [
            "센티넬 BLANC · 우준희 (S급)",
            "가이드 VIOLET · 백강우 (S급)"
          ]
        ],
        [
          "지정 사항",
          [
            "전담 가이드는 해당 센티넬의 출격 전후 가이딩을 전담한다.",
            "전담 가이드는 센티넬 BLANC의 현장 출동 시 즉시 동행할 수 있도록 대기한다.",
            "페어의 해제는 지부의 승인 없이 할 수 없다."
          ]
        ]
      ]
    }
  ],
  "story": []
};
