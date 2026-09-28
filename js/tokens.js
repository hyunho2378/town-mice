/*
 * tokens.js — 화천 Town MICE PASS 디자인 토큰
 * 색상, 타이포, 간격, 모션 값의 단일 출처. 컴포넌트에 값을 직접 적지 않고 이 파일을 거친다.
 * 빌드 도구가 없는 환경이라 import/export 대신 순수 전역 스크립트로 둔다(index.html에서
 * babel 변환 없이 가장 먼저 로드해 Tailwind 설정과 컴포넌트가 같은 값을 참조하게 한다).
 *
 * 플랫폼: A형 앱 고정형 (기준 390px, 최대 430px, 웹에서도 폰 화면처럼 중앙 고정)
 * 근거: 더픽트 Bill Concert(bill.thepict.co.kr) 실제 화면 캡처(2026.9.28)에서 추출한 브랜드 색.
 */

const colors = {
  // 브랜드
  primary: "#F04898",
  primaryDark: "#D63286",
  primarySoft: "#FDE7F0",
  accent: "#FFE000",
  accentSoft: "#FFF6C2",

  // 텍스트
  textPrimary: "#1F2024",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  textOnPrimary: "#FFFFFF",

  // 표면과 경계
  surface: "#FFFFFF",
  surfaceMuted: "#F5F5F6",
  background: "#ECECEC",
  border: "#E5E7EB",

  // 상태
  success: "#1E9E5A",
  successSoft: "#E5F6ED",
  danger: "#DC3545",

  // 모달 백드느
  scrim: "rgba(17,17,19,0.45)",
};

// A형(Apple HIG) 고정 타이포 스케일. 크기별 tracking과 leading을 따로 둔다(스킬 "타이포그래피 규율").
const typography = {
  largeTitle: { size: 34, weight: 700, leading: 1.1, tracking: "-0.02em" },
  title1: { size: 28, weight: 700, leading: 1.15, tracking: "-0.015em" },
  title2: { size: 22, weight: 700, leading: 1.2, tracking: "-0.01em" },
  title3: { size: 20, weight: 600, leading: 1.25, tracking: "-0.005em" },
  body: { size: 17, weight: 400, leading: 1.6, tracking: "0em" },
  callout: { size: 16, weight: 400, leading: 1.6, tracking: "0em" },
  subheadline: { size: 15, weight: 400, leading: 1.5, tracking: "0em" },
  footnote: { size: 13, weight: 400, leading: 1.45, tracking: "0.005em" },
  caption: { size: 12, weight: 400, leading: 1.4, tracking: "0.01em" },
};

// 8pt 간격 스케일. Tailwind 기본 숫자 유틸(p-1, p-2 ...)이 이 값과 1:1로 맞아떨어진다.
const spacing = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 };

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

const shadow = {
  card: "0 8px 24px rgba(20,20,20,0.08)",
  frame: "0 0 40px rgba(0,0,0,0.08)",
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
