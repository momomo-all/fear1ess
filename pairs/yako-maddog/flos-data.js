// yako-maddog FL-OS 단말기 내용이에요. 여기만 고치면 단말기에 그대로 나와요.
// - color   : 페어 색 (단말기 강조색)
// - me      : 유저캐 (단말기 주인) / them : 페어 상대
//   · code 코드네임, cls SENTINEL·GUIDE, rank 등급, face 그림 속 얼굴 위치 [가로, 세로] (0~1)
// - dispatch: 홈 화면 출동 명령 제목 / ok : 출격 확인(존명) 문구
// - comms   : 출격 전 대화. who 'me' = 유저캐, 'them' = 상대 (초안이에요!)
// - mails   : 메일함 (body 한 줄 = 문단, ['제목', ['가', '나']] = 하위 항목)
// - story   : 이야기 메뉴에 나오는 기록 (없으면 비워 두기)
// - boot    : 켤 때 접속 기록 [문장, 결과] (안 적으면 기본)
// - mission : 내 게이트 상태·활동 기록 바꾸기 / status, statusCls : 연락처 상태 표시 (red = 빨강)
// - flow    : 단말기 문구 바꾸기 (출격 버튼, 로딩, 존명 창, 통신 끝 등. js/flos.js 위쪽 T 참고)
// 출격하는 게이트 위치는 js/flos.js 위쪽 GATES 목록에 있어요.
window.FLOS = {
  "id": "yako-maddog",
  "color": "#c2323c",
  "dispatch": "언더하운드 게이트 발생 — 대상 MAD DOG 접근 확인",
  "link": "TARGET ↔ AGENT",
  "me": {
    "name": "야코",
    "en": "YUGA RYUTO",
    "code": "野狐",
    "cls": "SENTINEL",
    "rank": "S",
    "role": "FEARLESS JP · 협조 파견",
    "unit": "FEARLESS 일본지부 (협조 파견)",
    "img": "../../assets/pairs/yako-maddog/yako-char.webp",
    "face": [
      0.2,
      0.24
    ],
    "href": "yako.html",
    "line": "“아아, 정말이지 속 편하시네요. 무리하지 않는 편이 좋으실 텐데.”"
  },
  "them": {
    "name": "매드독",
    "en": "HAN JIHU",
    "code": "MAD DOG",
    "cls": "SENTINEL",
    "rank": "S",
    "unit": "추방 · 언더하운드",
    "img": "../../assets/pairs/yako-maddog/maddog-char.webp",
    "face": [
      0.74,
      0.26
    ],
    "href": "maddog.html",
    "line": "“내가 길들여졌다고 생각하면 곤란한데.”",
    "status": "TARGET",
    "statusCls": "red"
  },
  "ok": [
    "존명, 임무 출격 확인했습니다.",
    "무사 귀환하십시오, 야코."
  ],
  "comms": [
    {
      "who": "them",
      "text": "따라오지 마."
    },
    {
      "who": "me",
      "text": "어머, 같은 방향일 뿐인데요?"
    },
    {
      "who": "them",
      "text": "게이트는 내가 혼자 처리해."
    },
    {
      "who": "me",
      "text": "무리하지 않는 편이 좋으실 텐데. 목줄은 제가 쥐고 있잖아요."
    },
    {
      "who": "them",
      "text": "…개새끼 취급하지 마."
    },
    {
      "who": "me",
      "text": "귀여운 강아지 취급인데요. 갑시다, 지후."
    }
  ],
  "mails": [
    {
      "ab": "HQ",
      "no": "FL-UH-0010",
      "secret": "TOP SECRET · 극비",
      "title": "특수 임무 지령서 — 추방 센티넬 MAD DOG 포섭 또는 제거의 건",
      "from": "FEARLESS 한국지부장",
      "to": "일본지부 센티넬 「 野狐 」 (협조 파견)",
      "date": "2026. 01. 25.",
      "sign": "FEARLESS 한국지부장",
      "body": [
        "귀하의 협조 파견에 감사드립니다.",
        [
          "아래 대상은 추방 이후 무법 도시 언더하운드에서 ‘미친 개’라는 악명을 떨치고 있으며, 그간 파견된 센티넬과 가이드 다수가 제압에 실패하였습니다. 이에 귀하에게 본 임무를 지시합니다.",
          [
            "담당 없음 일본지부 호칭 「野狐」 · 幽牙 流刀 (S급)",
            "대상 MAD DOG 추방 · 언더하운드 잠적 · 한지후 볼펜으로 지워져 있음 (S급)"
          ]
        ],
        [
          "지시 사항",
          [
            "가능한 한 대상을 포섭하여 본부로 귀환시킨다.",
            "필요하다고 판단될 시 대상의 사살을 허가한다.",
            "위험하다고 판단될 시 즉시 귀환한다."
          ]
        ]
      ]
    }
  ],
  "story": [],
  "incoming": [
    {
      "ab": "HQ",
      "no": "FL-UH-0011",
      "secret": "TOP SECRET · 극비",
      "from": "FEARLESS 한국지부장",
      "sign": "FEARLESS 한국지부장",
      "to": "일본지부 센티넬 「野狐」 (협조 파견)",
      "title": "[독촉] 특수 임무 경과 보고 요청",
      "body": [
        "귀하의 정기 보고가 예정일로부터 지연되고 있습니다.",
        [
          "확인 요청",
          [
            "임무 대상 MAD DOG의 현재 위치",
            "포섭 진행 경과",
            "귀하의 신변 이상 유무"
          ]
        ],
        "본 메일 수신 즉시 회신하여 주시기 바랍니다."
      ]
    },
    {
      "ab": "HQ",
      "no": "FL-UH-0012",
      "secret": "TOP SECRET · 극비",
      "from": "FEARLESS 한국지부장",
      "sign": "FEARLESS 한국지부장",
      "to": "일본지부 센티넬 「野狐」 (협조 파견)",
      "title": "[경고] 협조 파견 인원 즉시 귀환 명령",
      "body": [
        "귀하의 단말기 신호가 대상의 은신처로 추정되는 좌표에 장기간 머물러 있음이 확인되었습니다.",
        [
          "지시 사항",
          [
            "귀하는 본 메일 수신 후 72시간 이내에 본부로 귀환한다.",
            "귀환이 어려울 경우 그 사유를 보고한다.",
            "기한 내 응답이 없을 경우, 귀하 역시 관리 대상으로 분류한다."
          ]
        ]
      ],
      "ps": "…설마 거기서 같이 지내고 있는 건 아니겠지."
    }
  ],
  "flow": {
    "openerSub": "본부 메일 수신"
  }
};
