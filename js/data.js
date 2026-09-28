// 화천 Town MICE 프로토타입 목업 데이터
// 실제 더픽트 API 연동 없음. 오늘 시연용 하드코딩.
// 숫자 출처: 2026 산천어축제 1인 평균 지출 8만 930원 (강원일보 2026.5.21). 그 외 임계값은 "가정" 표기.
// 게이지와 보상 모델은 "겨울 영수증, 여름 화천"(허주은, 2026.9.28) 제안을 그대로 구현했다.

// 제안서 실행 계획: 2027년 1월 산천어축제 시범 운영.
// 2027 축제 기간 출처: 한국관광공사 대한민국 구석구석 축제 정보(2027.01.09~01.31).
const EVENT = {
  name: "2027 얼음나라 화천산천어축제",
  ticketNo: "#HC2027",
  startDate: "2027-01-09",
  periodLabel: "2027.1.9~1.31",
};

// 제안서 "스케이트보드 MVP: 더픽트 화면에 보상 선택과 게이지 두 가지만 추가"에 맞춰
// 제안서에 없는 NFC 동선과 권역 스탬프는 화면에서 숨긴다(코드는 남겨 둔다).
const FEATURES = { nfcRoute: false };

// 일행 초대 코드(시연용 고정값)
const GROUP_CODE_DEMO = "HC27-0128";

// 게이지 규칙(전부 "가정" 표기, 제안서 원문 그대로).
// 5만원당 10~15 게이지라고 했으므로 중간값 12.5를 쓴다. 문턱 100 = 약 40만원(제안서의
// 33만~50만원 범위 중앙).
const GAUGE = {
  amountUnit: 50000,
  pointsPerUnit: 12.5,
  threshold: 100,
  validWindowLabel: "산천어축제 기간 + 4주 (2027.1.9~2.28)",
  rewardWindowLabel: "8월 초 토마토축제 기간 (2026년 기준 7.31~8.9)",
};

function amountToGauge(amount) {
  return (Number(amount) / GAUGE.amountUnit) * GAUGE.pointsPerUnit;
}

// 여름 보상 3종. 캐릭터는 화천군 공식 보조 캐릭터를 매칭했다(연구자 매칭, 화천군이
// 공식 지정한 매칭은 아니다).
//  - 물이: "쪽빛 맑은 물의 고장 화천의 상징물" -> 물놀이 보상
//  - 달이: "생명과 대지의 창조, 풍요와 장수를 상징"하는 수달, 보금자리 상징 -> 숙박 보상
//  - 연이: "인간과 자연에게 이로움을 주는 도우미"인 연꽃 -> 토마토(농산물) 보상
// 캐릭터 원본 색이 화천군 CI 3색과 자연히 겹친다(물이=하늘색, 천이=초록, 달이=주황).
// 캐릭터 배경 카드도 같은 테마색을 써서 하나의 세트처럼 보이게 한다.
const REWARDS = [
  {
    id: "waterpark",
    name: "붕어섬 물놀이",
    desc: "워터슬라이드, 집라인 이용권",
    reason: "7월 중순부터 운영하는 여름 시설",
    character: "muli",
    characterName: "물이",
    theme: "blue",
  },
  {
    id: "tomato",
    name: "토마토 박스",
    desc: "화천 토마토 특산물 박스",
    reason: "축제 현장에서만 수령 (택배 없음)",
    character: "cheoni",
    characterName: "천이",
    theme: "green",
  },
  {
    id: "stay",
    name: "화천 숙박권",
    desc: "화천 관내 숙소 숙박권",
    reason: "토마토축제 기간에만 사용",
    character: "dali",
    characterName: "달이",
    theme: "orange",
  },
];

// 시연용 가짜 영수증 사진첩. 실제 카메라와 OCR 연동 없이 고른 즉시 자동 인식된 것처럼 채운다.
// 1번(숙박)은 그 자체로 게이지 100(40만원)을 채워 발표에서 한 번에 보상까지 보여줄 수 있다.
const SAMPLE_RECEIPTS = [
  {
    id: "sample-stay",
    label: "화천 산천어펜션 2박",
    category: "stay",
    regionId: "hwacheon-hanam",
    merchant: "화천 산천어펜션",
    amount: 400000,
    theme: "orange",
  },
  {
    id: "sample-restaurant",
    label: "화천 시내 식당",
    category: "restaurant",
    regionId: "hwacheon-hanam",
    merchant: "화천 시내 식당",
    amount: 45000,
    theme: "blue",
  },
  {
    id: "sample-market",
    label: "간동 농산물 직판장",
    category: "market",
    regionId: "gandong",
    merchant: "간동 농산물 직판장",
    amount: 32000,
    theme: "green",
  },
];

// 가운데점 대신 공백으로 붙인 복합 명사(전통시장 특산물, 체험 레저)로 통일한다.
const CATEGORIES = [
  { id: "stay", label: "숙박", needsAddressProof: true },
  { id: "market", label: "전통시장 특산물", needsAddressProof: false },
  { id: "restaurant", label: "음식점", needsAddressProof: false },
  { id: "mart", label: "마트 편의점", needsAddressProof: false },
  { id: "experience", label: "체험 레저", needsAddressProof: false },
  { id: "etc", label: "기타", needsAddressProof: false },
];

const RECEIPT_TYPES = [
  { id: "paper", label: "종이 영수증" },
  { id: "digital", label: "전자 영수증" },
];

// 화천 하남권처럼 두 지명을 가운데점으로 묶던 표기를 버리고, 권역을 하나의 이름(하남권 등)으로
// 부른 뒤 desc에서 문장으로 풀어 쓴다.
const REGIONS = [
  { id: "hwacheon-hanam", name: "화천 하남권", desc: "산천어축제, 화천읍 상권" },
  { id: "gandong", name: "간동권", desc: "평화의 댐, 파로호" },
  { id: "sangseo-sanae", name: "상서 사내권", desc: "파크골프장, 비수구미" },
];

const NFC_SPOTS = [
  { id: "spot1", name: "평화의 댐 전망대", regionId: "gandong" },
  { id: "spot2", name: "산천어축제 얼음광장", regionId: "hwacheon-hanam" },
  { id: "spot3", name: "파크골프장 입구", regionId: "sangseo-sanae" },
];

const initialReceipts = [];
