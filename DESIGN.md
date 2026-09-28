# DESIGN.md — 화천 Town MICE PASS

fullstack-product-setup 스킬의 산출물 형식을 따른 축약본이다. 하켓ATON 시간 제약으로 IA.md, COMPONENTS.md, PATTERNS.md, ROUTES.md, PROGRESS.md, SESSION_HEADER.md는 만들지 않았다. 아래 "미룬 것" 절에 이유와 순서를 적었다.

## 0. 플랫폼

**A형 앱 고정형.** 기준 뷰포트 390px, 최대 430px, 웹에서도 `.phone-frame` 클래스로 중앙 고정한다. B형(320~3840 반응형)은 이번 범위에 없다.

## 1. 환경 제약과 그로 인한 이탈

이 환경은 Vite와 esbuild의 네이티브 바이너리가 macOS 코드사인 정책에 막혀 빌드 도구를 쓸 수 없었다. 그래서 스킬의 기본 기술 스택(React 18 + Vite + Tailwind CSS)에서 다음을 바꿨다.

- **번들러 없음.** React/ReactDOM/Babel standalone을 CDN(unpkg)에서 불러오고, `index.html`이 `js/*.js`를 fetch해 Babel로 그때그때 JSX를 변환한 뒤 하나로 합쳐 `eval`한다(개별 파일을 따로 eval하면 최상위 `const`가 파일 간에 공유되지 않아서 합쳐서 실행한다).
- **tokens.js는 `import`/`export`가 없는 순수 전역 스크립트다.** 번들러가 없어 ES 모듈을 못 쓴다. `index.html`이 Tailwind CDN보다 먼저 이 파일을 일반 `<script src>`로 로드해, 이후 Tailwind 설정과 컴포넌트가 같은 전역 변수(`colors`, `typography` 등)를 참조한다. 값의 출처는 여전히 tokens.js 하나뿐이다.
- **`localStorage`를 아예 쓰지 않는다.** 절대 규칙(인증은 httpOnly 쿠키)을 지키려면 백엔드가 필요한데, 오늘은 백엔드가 없다. 지속성을 포기하고 순수 메모리 상태로 바꿨다. 새로고침하면 초기화된다. 실제 서비스로 넘어갈 때 Node/Express + httpOnly 쿠키로 교체해야 한다(3절 참고).

## 2. 색상 (tokens.js `colors`)

더픽트 Bill Concert(bill.thepict.co.kr) 실제 화면 캡처(2026.9.28)에서 추출한 브랜드 색을 그대로 쓴다.

| 이름 | HEX | 역할 |
|---|---|---|
| primary | #F04898 | CTA, 활성 탭, 진행률 바 |
| primaryDark | #D63286 | 눌림 상태(현재 미사용, 예약) |
| primarySoft | #FDE7F0 | 선택된 칩·버튼 배경 |
| accent | #FFE000 | 완료 뱃지, 스탬프, 관리자 화면 강조 바 |
| accentSoft | #FFF6C2 | 완료 상태 배경 |
| textPrimary | #1F2024 | 본문 텍스트 |
| textSecondary | #6B7280 | 보조 텍스트 |
| textTertiary | #9CA3AF | 캡션, 비활성 |
| textOnPrimary | #FFFFFF | 컬러 배경 위 텍스트 |
| surface | #FFFFFF | 카드, 시트 |
| surfaceMuted | #F5F5F6 | 카드 안 서브 영역 |
| background | #ECECEC | 화면 배경 |
| border | #E5E7EB | 구분선, 테두리 |
| success / successSoft | #1E9E5A / #E5F6ED | 예약, 미사용 |
| danger | #DC3545 | 예약, 미사용 |
| scrim | rgba(17,17,19,0.45) | 바텀시트 모달 배경 |

## 3. 타이포그래피 (Apple HIG, tokens.js `typography`)

고정 px, clamp 없음(A형이라 B형 유동 스케일 불필요). 크기별 tracking과 leading을 따로 둔다.

| 역할 | size/weight | leading | tracking | 쓰는 곳 |
|---|---|---|---|---|
| largeTitle | 34/700 | 1.1 | -0.02em | 스플래시 "화천 PASS" |
| title1 | 28/700 | 1.15 | -0.015em | 예약(현재 미사용) |
| title2 | 22/700 | 1.2 | -0.01em | 로그인 헤딩 |
| title3 | 20/600 | 1.25 | -0.005em | 카드 헤딩, 완료 화면 문구 |
| body | 17/400 | 1.6 | 0 | 입력값, 버튼 텍스트 |
| callout | 16/400 | 1.6 | 0 | 스플래시 태그라인 |
| subheadline | 15/400 | 1.5 | 0 | 섹션 헤더, 리스트 항목 |
| footnote | 13/400 | 1.45 | 0.005em | 보조 설명, 버튼 라벨 |
| caption | 12/400 | 1.4 | 0.01em | 라벨, 뱃지, 통계 |

폰트: `-apple-system, BlinkMacSystemFont, Apple SD Gothic Neo, Pretendard Variable, Pretendard, system-ui, sans-serif`. Pretendard Variable은 jsDelivr CDN(`pretendardvariable-dynamic-subset.min.css`)으로 실제 로드한다.

## 4. 간격과 레이아웃

8pt 스케일(4/8/12/16/20/24/32/40/48). Tailwind CDN의 기본 숫자 스페이싱(`p-1`~`p-12`)이 이 값과 1:1로 맞아떨어져서 별도 오버라이드는 하지 않았다. 화면 좌우 마진은 16px(`mx-4`, `p-4` 계열)로 통일했다.

터치 타깃 최소 44px. `TopBar` 뒤로가기 버튼과 하단 탭바, 모든 액션 버튼에 `min-h-[44px]` 또는 `.tap-target-44`(44×44 고정)를 적용했다.

## 5. 아이콘

기본 라이브러리는 lucide-react이지만, 번들러가 없어 npm 패키지를 그대로 못 쓴다. 규칙이 명시적으로 허용한 대안(inline SVG)으로 `components.js`의 `Icon` 컴포넌트에 직접 그렸다. 24×24 viewBox, stroke 기반, round cap, strokeWidth 2로 lucide와 같은 스타일을 맞췄다. 크기는 16/20/24 세 단계만 썼다(32/48은 이번 화면에 필요 없었다). 이모지는 전부 제거했다.

## 6. 모션 (tokens.js `motion`)

- duration: fast 120ms, base 200ms, slow 320ms(슬로우는 미사용)
- easing: standard `cubic-bezier(0.2,0,0,1)`
- press 피드백: `scale(0.97)`, `.press` 클래스로 모든 인터랙티브 요소에 적용(절대 규칙이 허용한 유일한 scale)
- 애니메이션은 `transform`과 `opacity`만 사용한다. 진행률 바는 `width` 대신 `transform: scaleX()` + `transform-origin: left`로 그린다(레이아웃 유발 속성 회피).
- `prefers-reduced-motion`, `prefers-contrast`, `prefers-reduced-transparency` 3종을 `index.html` 전역 CSS에서 처리한다.

## 7. z-index (tokens.js `zIndex`)

| 이름 | 값 | 쓰는 곳 |
|---|---|---|
| stickyHeader / bottomNav | 10 | 상단 바, 하단 탭바 |
| modal | 30 | 숙박 증빙 안내 바텀시트 |
| toast | 40 | 예약(미사용) |

## 8. 가운데점(·) 사용 금지

사용자 지시로 인터페이스 어디에도 가운데점을 쓰지 않는다. 대신:

- 병기 지명(예: 화천·하남)은 하나의 권역 이름으로 합쳤다(예: "화천 하남권") + 설명은 desc 필드에 문장으로 풀었다.
- 복합 카테고리명(전통시장·특산물 등)은 공백으로 이어 붙였다("전통시장 특산물").
- 구분자로 쓰던 자리는 괄호, 쉼표, "와/과" 접속사, 줄바꿈으로 바꿨다.

## 9. 절대 규칙 준수 현황

| 규칙 | 상태 |
|---|---|
| localStorage/sessionStorage 금지 | 준수(3절 참고, 백엔드 없어 지속성 자체를 포기) |
| TypeScript 금지 | 준수(JS + JSX만) |
| 색상·간격·폰트 하드코딩 금지 | 준수(hex는 tokens.js 16곳에만 존재, grep으로 확인) |
| 이모지 아이콘 금지 | 준수(inline SVG로 전환) |
| hover에 scale 금지 / press 0.97 허용 | 준수 |
| 애니메이션은 transform·opacity만 | 준수(진행률 바 scaleX로 전환) |
| 44px 최소 터치 타깃 | 준수(TopBar 뒤로가기 36→44px 등 수정) |
| 네이티브 select·date 금지 | 원래부터 준수(전부 커스텀 버튼 그리드) |
| 접근성 3종 미디어쿼리 | 준수(index.html 전역 CSS) |

## 10. 미룬 것

IA.md, COMPONENTS.md, PATTERNS.md, ROUTES.md, PROGRESS.md, SESSION_HEADER.md는 만들지 않았다. 화면이 8개뿐이고 하켓ATON 발표가 임박해 문서화보다 동작하는 프로토타입과 규칙 준수를 우선했다. 발표 후 여유가 있으면 이 순서로 만든다.

1. IA.md — 화면 목록(스플래시, 로그인, 홈, 영수증 카테고리, 영수증 업로드, 인증현황, 화천 동선, 대행사 리포트)과 이동 흐름
2. COMPONENTS.md — `Icon`, `TopBar`, `BottomNav`, `Row`, `Stat` 스펙
3. PATTERNS.md — 카드, 리스트, 바텀시트 모달, 빈 상태(`아직 인증한 영수증이 없어요`) 패턴
4. ROUTES.md — 지금은 React Router가 아니라 자체 스택 기반 내비게이션(`useNav`)이라, 실제 배포 시 React Router v6로 옮기면서 같이 정리
5. PROGRESS.md, SESSION_HEADER.md
