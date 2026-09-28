// 화천 Town MICE 프로토타입 목업 데이터
// 실제 더픽트 API 연동 없음. 오늘 시연용 하드코딩.
// 숫자 출처: 2026 산천어축제 1인 평균 지출 8만 930원 (강원일보 2026.5.21). 그 외 임계값은 "가정" 표기.

const EVENT = {
  name: "2026 얼음나라 화천산천어축제",
  ticketNo: "#HC2026",
  dday: "D-3",
  threshold1day: 80930,
  thresholdStay: 150000,
};

const CATEGORIES = [
  { id: "stay", label: "숙박", needsAddressProof: true },
  { id: "market", label: "전통시장·특산물", needsAddressProof: false },
  { id: "restaurant", label: "음식점", needsAddressProof: false },
  { id: "mart", label: "마트·편의점", needsAddressProof: false },
  { id: "experience", label: "체험·레저", needsAddressProof: false },
  { id: "etc", label: "기타", needsAddressProof: false },
];

const RECEIPT_TYPES = [
  { id: "paper", label: "종이 영수증" },
  { id: "digital", label: "전자 영수증" },
];

const REGIONS = [
  { id: "hwacheon-hanam", name: "화천·하남", desc: "산천어축제, 화천읍 상권" },
  { id: "gandong", name: "간동", desc: "평화의 댐, 파로호" },
  { id: "sangseo-sanae", name: "상서·사내", desc: "파크골프장, 비수구미" },
];

const NFC_SPOTS = [
  { id: "spot1", name: "평화의 댐 전망대", regionId: "gandong" },
  { id: "spot2", name: "산천어축제 얼음광장", regionId: "hwacheon-hanam" },
  { id: "spot3", name: "파크골프장 입구", regionId: "sangseo-sanae" },
];

const initialReceipts = [];
