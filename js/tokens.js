/*
 * tokens.js — 화천 Town MICE PASS 디자인 토큰
 *
 * UI_DESIGN_SYSTEM_PLAYBOOK.md(온새마루 DS v5)의 구조를 이 프로젝트 크기에 맞게 가져왔다.
 * 값은 그대로 베끼지 않고 다시 잡았다: 온새마루는 블루 브랜드의 데스크톱 포함 마케팅
 * 사이트라 섹션 간격이 48~96까지 간다. 이 프로젝트는 핑크 브랜드의 430px 폰 화면
 * 하나뿐이라 섹션 간격을 24~40으로 줄였다. 구조(역할별 색 이름, 크기+굵기+행간+자간을
 * 한 세트로 고정하는 타이포, 5단계 반경, 그림자 단계)는 그대로 따른다.
 *
 * 빌드 도구가 없는 환경이라 import/export 대신 순수 전역 스크립트로 둔다. index.html이
 * Tailwind CDN보다 먼저 이 파일을 로드해 Tailwind 설정과 컴포넌트가 같은 값을 참조한다.
 *
 * 플랫폼: A형 앱 고정형 (기준 390px, 최대 430px, 웹에서도 폰 화면처럼 중앙 고정)
 */

// ---------- 색 ----------
// "생화이트(#FFFFFF)를 표면에 쓰지 않는다"는 지시에 따라 surface 계열은 전부
// 브랜드 톤이 살짝 섞인 오프화이트로 잡았다. 순수 흰색은 primary 위에 얹는
// 텍스트(textOnPrimary)에만 남긴다(표면이 아니라 대비를 위한 글자색이라 다르다).
const colors = {
  // 브랜드
  primary: "#F04898",
  primaryPressed: "#D63286",
  primarySubtle: "#FDE7F0",
  accent: "#FFE000",
  accentSubtle: "#FFF6C2",

  // 텍스트 (따뜻한 톤. 차가운 회색 대신 잉크에 핑크를 아주 살짝 섞었다)
  textPrimary: "#241B20",
  textSecondary: "#6E5C63",
  textTertiary: "#9C8B92",
  textOnPrimary: "#FFFFFF",
  textDanger: "#B42318",

  // 표면 (생화이트 금지. 전부 오프화이트나 톤온톤)
  background: "#F1EBEE",
  surface: "#FCF8FA",
  surfaceRaised: "#FFFDFE",
  surfaceSunken: "#F3E9EE",
  surfaceInverse: "#221A1E",

  border: "#E6D9E0",
  borderStrong: "#C9B4BF",
  borderFocus: "#F04898",

  success: "#1E9E5A",
  successSoft: "#E5F6ED",
  danger: "#DC3545",
  dangerSoft: "#FBE7E9",

  scrim: "rgba(30,17,22,0.5)",
};

// ---------- 타이포 ----------
// 크기, 굵기, 행간, 자간을 한 세트로 고정한다. 페이지에서 font-bold 등으로
// 따로 덮어쓰지 않는다(굵게 보여야 하면 역할을 올린다, 예: bodyMd -> labelMd).
// caption과 subheadline이 비슷한 크기라도 굵기(400 vs 600)로 위계를 낸다.
const typography = {
  displayLg: { size: 34, weight: 700, leading: 1.15, tracking: "-0.02em" },   // 스플래시 로고 텍스트
  titleLg:   { size: 24, weight: 700, leading: 1.25, tracking: "-0.012em" },  // 화면 대표 제목(로그인, 완료 화면)
  titleMd:   { size: 20, weight: 700, leading: 1.3,  tracking: "-0.01em" },   // 카드 섹션 헤더, 이벤트명
  titleSm:   { size: 17, weight: 600, leading: 1.35, tracking: "-0.004em" }, // 리스트 항목 제목
  bodyLg:    { size: 17, weight: 400, leading: 1.6,  tracking: "0em" },       // 입력값, 본문
  bodyMd:    { size: 15, weight: 400, leading: 1.6,  tracking: "0em" },       // 보조 본문, 설명
  labelLg:   { size: 16, weight: 600, leading: 1.4,  tracking: "0em" },       // 큰 버튼
  labelMd:   { size: 14, weight: 600, leading: 1.4,  tracking: "0em" },       // 표준 버튼, 칩, 탭
  labelSm:   { size: 13, weight: 600, leading: 1.4,  tracking: "0.005em" },  // 작은 버튼, 배지 글자
  captionMd: { size: 13, weight: 400, leading: 1.5,  tracking: "0.005em" },  // 도움말, 메타
  captionSm: { size: 11, weight: 400, leading: 1.4,  tracking: "0.01em" },   // 잔글자, 배지 숫자
};

// ---------- 간격 ----------
// 부품 안(component)과 화면 안 큰 블록 사이(section)를 나눈다.
// 지금까지 카드 사이를 mt-4(16)로만 붙여서 "위계가 안 보인다"는 지적이 나왔다.
// 카드와 섹션 사이는 항상 section 값을 쓰고, 카드 내부는 component 값만 쓴다.
const spacing = {
  component: { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32 },
  section: { sm: 24, md: 32, lg: 40 },
};

// ---------- 반경 ----------
// 5단계뿐이다. 버튼, 칩, 입력칸을 알약(pill) 모양으로 만들지 않는다(원은 아바타,
// 점, 토글, 진행 막대, 순수 숫자 배지에만 쓴다).
const radius = {
  none: 0,
  sm: 4,   // 작은 배지, 상태 표시(StatusPill), 체크박스
  md: 8,   // 버튼, 칩, 입력칸, 카테고리 그리드
  lg: 12,  // 카드, 모달 시트, 팝오버
  full: 9999, // 아바타, 점, 토글, 진행바, 순수 숫자 배지에만
};

// ---------- 그림자 ----------
// sm/md/lg 세 단계 + inset(오목한 안쪽 느낌, 진행률 트랙과 입력칸 눌림에 사용).
// 이전에는 그림자가 하나뿐이라 표면이 붙어 있는지 떠 있는지 구분이 안 됐다.
const shadow = {
  sm: "0 1px 2px rgba(36,20,24,0.06), 0 1px 1px rgba(36,20,24,0.04)",
  md: "0 8px 20px rgba(36,20,24,0.12), 0 2px 6px rgba(36,20,24,0.08)",
  lg: "0 20px 48px rgba(36,20,24,0.22), 0 8px 20px rgba(36,20,24,0.14)",
  inset: "inset 0 1px 3px rgba(36,20,24,0.12)",
  frame: "0 0 40px rgba(36,20,24,0.10)",
};

const layout = {
  baseWidth: 390,
  maxWidth: 430,
  margin: 16,
  gutter: 8,
  columns: 4,
  minTouchTarget: 44,
};

const fonts = {
  sans: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Apple SD Gothic Neo",
    "Pretendard Variable",
    "Pretendard",
    "system-ui",
    "sans-serif",
  ].join(", "),
};

const motion = {
  duration: { fast: 120, base: 200, slow: 320 },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    enter: "cubic-bezier(0.05, 0.7, 0.1, 1)",
    exit: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  },
  pressScale: 0.97,
};

const zIndex = {
  base: 0,
  stickyHeader: 10,
  bottomNav: 10,
  modal: 30,
  toast: 40,
};
