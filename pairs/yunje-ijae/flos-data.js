// yunje-ijae FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · avatar 정사각형 프사 (있으면 이걸 먼저 써요)
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - incoming: 메일함을 열면 나중에 도착하는 신규 메일 (위에서부터 차례로)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// - boot    : 켤 때 접속 기록 [문장, 결과] (안 적으면 기본)
// - mission : 내 게이트 상태·활동 기록 바꾸기 / status, statusCls : 연락처 상태 표시 (red = 빨강)
// - flow    : 단말기 문구 바꾸기 (출격 버튼, 로딩, 존명 창, 통신 끝 등. js/flos.js 위쪽 T 참고)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "yunje-ijae",
  "color": "#2f4fc4",
  "dispatch": "[경보] SS급 빌런 CHASER 출현",
  "me": {
    "name": "강윤제",
    "en": "KANG YUNJE",
    "code": "RIVER",
    "cls": "GUIDE",
    "rank": "S",
    "img": "../../assets/pairs/yunje-ijae/yunje-char.webp",
    "face": [
      0.74,
      0.26
    ],
    "href": "yunje.html",
    "line": "“당신의 곁에 있는 것이 현재로서는 가장 합리적인 상태입니다.”",
    "avatar": "../../assets/pairs/yunje-ijae/yunje-avatar.webp",
    "status": "MISSING",
    "statusCls": "red"
  },
  "them": {
    "name": "신이재",
    "en": "SHIN IJAE",
    "code": "CHASER",
    "cls": "SENTINEL",
    "rank": "SS",
    "img": "../../assets/pairs/yunje-ijae/ijae.webp",
    "face": [
      0.59,
      0.34
    ],
    "href": "ijae.html",
    "line": "",
    "avatar": "../../assets/pairs/yunje-ijae/ijae-avatar.webp",
    "status": "VILLAIN",
    "statusCls": "red",
    "unit": "FEARLESS 지부 (이탈 · 빌런 재분류)"
  },
  "ok": [
    "경고. 지부 통제 밖의 회선입니다.",
    "이 교신은 기록되지 않습니다."
  ],
  "comms": [
    {
      "who": "them",
      "text": "윤제 씨, 단말기 아직 안 껐어요?"
    },
    {
      "who": "me",
      "text": "지부가 감청 중입니다. 끄는 게 합리적이겠죠."
    },
    {
      "who": "them",
      "text": "그럼 왜 아직 켜 놨어요?"
    },
    {
      "who": "me",
      "text": "…마지막 공문이 실종 보고였습니다. 제가 실종됐다더군요."
    },
    {
      "who": "them",
      "text": "틀린 말은 아니네요. 이제 아무도 못 찾을 테니까."
    },
    {
      "who": "me",
      "text": "당신 곁에 있는 것이, 현재로서는 가장 합리적인 상태입니다."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-SG-0828",
      "title": "전담 페어 지정 통보 — SS급 센티넬–S급 가이드 전담 페어 지정의 건",
      "from": "FEARLESS 지부",
      "to": "가이드 강윤제 (RIVER · S급)",
      "date": "2025. 08. 28.",
      "sign": "FEARLESS 지부장 K",
      "body": [
        "귀하의 노고에 감사드립니다.",
        [
          "지부는 아래 인원의 가이딩 적합도 검사 결과에 따라, 두 사람을 공식 전담 페어로 지정하였음을 통보합니다.",
          [
            "센티넬 CHASER · 신이재 (SS급)",
            "가이드 RIVER · 강윤제 (S급)"
          ]
        ],
        [
          "지정 사항",
          [
            "전담 가이드는 해당 센티넬의 출격 전후 가이딩을 전담한다.",
            "전담 가이드는 센티넬 CHASER의 현장 출동 시 즉시 동행할 수 있도록 대기한다.",
            "페어의 해제는 지부의 승인 없이 할 수 없다."
          ]
        ]
      ]
    }
  ],
  "story": [],
  "incoming": [
    {
      "ab": "K",
      "no": "FL-EM-0901",
      "secret": "TOP SECRET · 극비",
      "from": "K (지부장)",
      "sign": "FEARLESS 지부장 K",
      "to": "FEARLESS 지부 소속 전 인원",
      "title": "[긴급] SS급 센티넬 CHASER 접촉 금지 명령",
      "body": [
        "SS급 센티넬 CHASER(신이재)가 지부의 통제를 벗어났음을 알립니다.",
        [
          "현재 상태",
          [
            "대상은 금일부로 빌런으로 재분류됨.",
            "대상의 위치는 파악되지 않음."
          ]
        ],
        [
          "지시 사항",
          [
            "전 인원은 대상과의 접촉을 금한다.",
            "대상을 목격할 경우 교전하지 말고 즉시 지부에 보고한다.",
            "대상과 주고받은 교신 기록은 전량 지부에 제출한다."
          ]
        ]
      ]
    },
    {
      "ab": "K",
      "no": "FL-EM-0902",
      "secret": "TOP SECRET · 극비",
      "from": "K (지부장)",
      "sign": "FEARLESS 지부장 K",
      "to": "FEARLESS 지부 소속 전 인원",
      "title": "[실종] S급 가이드 RIVER(강윤제) 실종 보고",
      "body": [
        "CHASER의 이탈 시점을 전후하여, 전담 가이드 RIVER(강윤제)와의 연락이 두절되었음을 알립니다.",
        [
          "확인 사항",
          [
            "RIVER의 단말기 신호는 파주 비무장지대 인근에서 마지막으로 확인됨.",
            "현장에서 교전 흔적은 발견되지 않음.",
            "RIVER는 CHASER와 동행 중일 가능성이 높음."
          ]
        ],
        [
          "지시 사항",
          [
            "RIVER를 발견할 경우 즉시 보호하여 지부에 인계한다.",
            "RIVER의 단말기로 수신되는 모든 교신은 지부가 감청한다."
          ]
        ]
      ],
      "ps": "…살아만 있게, 강윤제."
    }
  ],
  "boot": [
    [
      "FL-OS KERNEL",
      "LOADED"
    ],
    [
      "RIVER ACCESS — GUIDE BIOMETRICS",
      "OK"
    ],
    [
      "CHASER ACCESS — SENTINEL BIOMETRICS",
      "REVOKED"
    ],
    [
      "PAIR LINK CHASER / RIVER",
      "LOST"
    ]
  ],
  "mission": {
    "state": "빌런 반응 · 추적 중",
    "log": [
      [
        9,
        "SS급 빌런 반응 감지 (CHASER)"
      ],
      [
        5,
        "RIVER 단말기 신호 · 동일 좌표에서 확인"
      ],
      [
        1,
        "지부 추적 팀 접근 중"
      ]
    ]
  },
  "flow": {
    "standby": "ALERT",
    "standbyGo": "▶ SCAN에서 신호 확인",
    "done": "OFF GRID",
    "doneGo": "지부 회선 이탈 · 위치 추적 불가",
    "link": "LINK LOST",
    "linkDone": "LINK LOST",
    "linkRed": true,
    "openerSub": "경보 · 신규 메일",
    "openerDone": "오프라인",
    "alert": "INCOMING SIGNAL // UNREGISTERED",
    "ask": "응답하시겠습니까?",
    "askBtn": "▶ 응답",
    "loadHead": "UNREGISTERED CHANNEL // BYPASSING HQ",
    "ld1": "› 지부 감청 회선 우회 중... <em>{place}</em>",
    "ld2": "› 페어 링크 재접속... <em>강윤제 ↔ 신이재</em>",
    "chips": [
      "TRACE BLOCKED",
      "ROUTE MASKED",
      "CHANNEL OPEN"
    ],
    "okHead": "SYSTEM // UNAUTHORIZED ACCESS",
    "okBtn": "▶ CONTINUE <small>/ 회선 열기</small>",
    "commEnd": "— 회선 차단 · 기록 없음 —",
    "commBtn": "▶ 접속 종료",
    "target": "▶ CHASER 신호",
    "footR": "SIGNAL MASKED"
  }
};
