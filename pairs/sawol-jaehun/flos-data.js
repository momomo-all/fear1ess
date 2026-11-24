// sawol-jaehun FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
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
  "id": "sawol-jaehun",
  "color": "#62b6e0",
  "dispatch": "게이트 발생 — 전담 페어 출격 대기",
  "me": {
    "name": "이사월",
    "en": "LEE SAWOL",
    "code": "SOL",
    "cls": "GUIDE",
    "rank": "S",
    "img": "../../assets/pairs/sawol-jaehun/sawol.webp",
    "face": [
      0.34,
      0.26
    ],
    "href": "sawol.html",
    "line": "“괜찮아요, 제가 여기에 있어요!”",
    "avatar": "../../assets/pairs/sawol-jaehun/sawol-avatar.webp"
  },
  "them": {
    "name": "서재훈",
    "en": "SEO JAEHUN",
    "code": "MUSTANG",
    "cls": "SENTINEL",
    "rank": "S",
    "img": "../../assets/pairs/sawol-jaehun/jaehun-char.webp",
    "face": [
      0.576,
      0.278
    ],
    "href": "jaehun.html",
    "line": "“그 정도로 놀랄 일인가?”",
    "avatar": "../../assets/pairs/sawol-jaehun/jaehun-avatar.webp"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 복귀하십시오, 머스탱, 솔."
  ],
  "comms": [
    {
      "who": "them",
      "text": "가이딩 수치."
    },
    {
      "who": "me",
      "text": "98퍼센트요! 오늘 컨디션 최상이에요."
    },
    {
      "who": "them",
      "text": "나머지 2는."
    },
    {
      "who": "me",
      "text": "현장 가기 직전에 해 드릴게요 ㅎㅎ 제 옆에서 떨어지지 마세요, 형."
    },
    {
      "who": "them",
      "text": "그건 내가 할 말이다."
    }
  ],
  "mails": [
    {
      "ab": "K",
      "no": "FL-SG-0401",
      "from": "K (지부장)",
      "to": "가이드 이사월 (SOL · S급)",
      "date": "2025. 08. 12.",
      "sign": "FEARLESS 지부장 K",
      "title": "S급 센티넬 MUSTANG 전담 가이드 지정 통보",
      "body": [
        "귀하의 노고에 감사드립니다.",
        "지부는 S급 센티넬 MUSTANG(서재훈)의 전담 가이드로 귀하를 지정하였음을 통보합니다.",
        [
          "배정 사유",
          [
            "대상 센티넬은 등록 이래 지부가 배정한 가이드 및 센티넬 전원과의 페어 체결을 거부하였으며, 정식 페어를 유지한 이력이 없음.",
            "현재 지부 소속 가이드 중 배정 가능한 인원은 귀하가 유일함."
          ]
        ],
        [
          "유의 사항",
          [
            "대상은 무시와 협력, 어느 방식에도 반응하지 않는 것으로 보고됨.",
            "기존 보고서의 ‘감정 결여’ 소견은 현재 유효하지 않음. 대상의 반응은 예측할 수 없음.",
            "전담 가이드는 대상의 출격 전후 가이딩을 전담하며, 배정은 지부의 승인 없이 해제할 수 없음."
          ]
        ]
      ],
      "ps": "자네밖에 남지 않았네. 머스탱을 맡아 주게."
    }
  ],
  "story": []
};
