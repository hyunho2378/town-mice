# DESIGN.md — 화천 Town MICE PASS

fullstack-product-setup 스킬과 UI_DESIGN_SYSTEM_PLAYBOOK.md(온새마루 DS v5)의 산출물 형식을 따른 축약본이다. 온새마루 플레이북은 블루 브랜드, 데스크톱 포함 서비스이다. 이 프로젝트는 핑크 브랜드이고 430px 폰 화면 하나다. 구조(역할별 색 이름, 크기+굵기+행간+자간을 한 세트로 고정하는 타이포, 5단계 반경, 그림자 단계)는 그대로 가져오고 값은 이 프로젝트 크기에 맞게 다시 잡았다.

**v2 개정(2026.9.28)**: 타이포가 위계 없이 다 똑같이 보인다는 지적, 섹션 사이가 붙어 있다는 지적, 생화이트(순수 흰색) 표면이 너무 안 보인다는 지적을 받고 3절~7절을 통째 개정해 동해사이 로직은 그대로 두고 표면과 위계만 다시 잡았다.

## 0. 플랫폼

**A형 앱 고정형.** 기준 뷰포트 390px, 최대 430px, 웹에서도 `.phone-frame` 클래스로 중앙 고정한다.

## 1. 환경 제약과 그로 인한 이탈

이 환경은 Vite와 esbuild의 네이티브 바이너리가 macOS 코드사인 정책에 막혀 빌드 도구를 쓸 수 없었다. 스킬의 기본 기술 스택(React 18 + Vite + Tailwind CSS)에서 다음을 바꿨다.

- **번들러 없음.** React/ReactDOM/Babel standalone을 CDN(unpkg)에서 불러오고, `index.html`이 `js/*.js`를 fetch해 Babel로 그때그때 JSX를 변환한 뒤 하나로 합쳐 `eval`한다.
- **tokens.js는 `import`/`export`가 없는 순수 전역 스크립트다.** `index.html`이 Tailwind CDN보다 먼저 이 파일을 일반 `<script src>`로 로드한다.
- **localStorage를 쓰지 않는다.** 백엔드가 없어 httpOnly 쿠키로 못 바꾼다. 지속성을 포기하고 순수 메모리 상태로 둔다.
- **타이포 굵기 고정을 Tailwind 유틸이 아니라 별도 CSS 클래스로 만든다.** Tailwind의 `fontSize` 설정은 크기와 행간만 담고 굵기를 못 담는다(플레이북 §2.2가 요구하는 "크기·굵기·줄 간격 한 세트"를 지키려면 필요). `index.html`이 `typography` 값을 읽어 `.text-title-lg` 같은 클래스를 직접 만들어 `<head>`에 주입한다.

## 2. 색 (tokens.js `colors`)

더픽트 Bill Concert 실제 화면 캡처(2026.9.28)에서 뽑은 핑크·옐로를 브랜드색으로 쓴다. **생화이트(순수 #FFFFFF) 표면은 쓰지 않는다.** 카드·배경 전부 브랜드 톤이 살짝 섞인 오프화이트다. 순수 흰색은 primary 위에 얹는 글자(`textOnPrimary`)에만 남긴다. 이건 표면이 아니라 대비를 위한 글자색이라 다르다.

| 키 | HEX | 쓰는 곳 |
|---|---|---|
| primary | #F04898 | CTA 면, 활성 탭, 진행률 채움 |
| primaryPressed | #D63286 | 눌림 상태(예약) |
| primarySubtle | #FDE7F0 | 선택된 칩·버튼 배경 |
| accent | #FFE000 | 완료 뱃지, 스탬프, 관리자 강조 바 |
| accentSubtle | #FFF6C2 | 완료 상태 배경 |
| textPrimary | #241B20 | 본문(차가운 회색 대신 잉크에 핑크를 아주 살짝 섞음) |
| textSecondary | #6E5C63 | 보조 텍스트 |
| textTertiary | #9C8B92 | 캡션, 비활성 |
| textOnPrimary | #FFFFFF | 컬러 배경 위 텍스트(유일하게 허용된 순수 흰색) |
| textDanger | #B42318 | 오류 문구 |
| background | #F1EBEE | 화면 배경(오프화이트, 생화이트 아님) |
| surface | #FCF8FA | 카드(오프화이트) |
| surfaceRaised | #FFFDFE | 카드보다 한 단 밝은 면(입력칸, 모달) |
| surfaceSunken | #F3E9EE | 오목한 면(입력칸 안, 진행률 트랙, 배지 배경) |
| surfaceInverse | #221A1E | 어두운 면(예약, 토스트) |
| border | #E6D9E0 | 기본 경계선 |
| borderStrong | #C9B4BF | 입력칸 테두리 |
| success/successSoft, danger/dangerSoft | #1E9E5A/#E5F6ED, #DC3545/#FBE7E9 | 예약 |
| scrim | rgba(30,17,22,0.5) | 바텀시트 모달 배경 |

## 3. 타이포그래피 (tokens.js `typography`, 플레이북 §2.2 구조 차용)

12단계로 다시 잡았다. **문제는 위계가 없어서 글자들이 다 똑같이 보인다는 지적이었다.** 해결: 크기, 굵기, 행간, 자간을 한 세트로 못 박아 별도 CSS 클래스(`text-title-lg` 등)로 만들어 `index.html`이 로드한다. 페이지에서 `font-bold` 같은 걸로 덮어쓰면 물리적으로 못 박은 값이 무시되지 않는다(클래스 자체가 굵기까지 담고 있어서 덮어쓸 자리가 없다).

| 역할 | 클래스 | size/weight | leading | tracking | 쓰는 곳 |
|---|---|---|---|---|---|
| displayLg | `.text-display-lg` | 34/700 | 1.15 | -0.02em | 스플래시 "화천 PASS" |
| titleLg | `.text-title-lg` | 24/700 | 1.25 | -0.012em | 화면 대표 제목(로그인, 완료 화면) |
| titleMd | `.text-title-md` | 20/700 | 1.3 | -0.01em | 이벤트명, 카드 대표 헤더 |
| titleSm | `.text-title-sm` | 17/600 | 1.35 | -0.004em | 섹션 헤더, 리스트 항목 제목 |
| bodyLg | `.text-body-lg` | 17/400 | 1.6 | 0 | 입력값 |
| bodyMd | `.text-body-md` | 15/400 | 1.6 | 0 | 보조 본문 |
| labelLg | `.text-label-lg` | 16/600 | 1.4 | 0 | 큰 버튼 |
| labelMd | `.text-label-md` | 14/600 | 1.4 | 0 | 표준 버튼, 리스트 값 |
| labelSm | `.text-label-sm` | 13/600 | 1.4 | 0.005em | 작은 버튼, 상태 뱃지 |
| captionMd | `.text-caption-md` | 13/400 | 1.5 | 0.005em | 도움말, 메타 |
| captionSm | `.text-caption-sm` | 11/400 | 1.4 | 0.01em | 잔글자, 탭 라벨 |

캡션(13/400)과 label-sm(13/400 아님, weight 600)은 크기가 같지만 굵기로 위계를 낸다. 크기만으로 위계를 만들지 않는다는 플레이북 원칙을 그대로 따랐다.

폰트: `-apple-system, BlinkMacSystemFont, Apple SD Gothic Neo, Pretendard Variable, Pretendard, system-ui, sans-serif`. Pretendard Variable은 jsDelivr CDN으로 실제 로드한다.

## 4. 간격 (tokens.js `spacing`)

부품 안(component)과 화면 안 큰 블록 사이(section)를 나눈다. 온새마루는 48~96까지 쓰지만(데스크톱 마케팅 페이지 포함), 이 프로젝트는 430px 폰 화면 하나뿐이라 24~40으로 줄였다.

| 구분 | 이름 | 값 |
|---|---|---|
| 부품 안 | xxs/xs/sm/md/lg/xl | 4/8/12/16/24/32 |
| 섹션(카드) 사이 | sm/md/lg | 24/32/40 |

**바뀐 것**: Home과 관리자 화면의 카드 사이가 `mt-4`(16, 부품 간격)로만 붙어 있었다. 카드는 서로 다른 정보 단위라 섹션 간격을 써야 한다. 지금은 `mt-8`(32, section-md)로 띄운다.

## 5. 반경 (tokens.js `radius`, Tailwind `theme.borderRadius` 통째 교체)

5단계뿐이다. **버튼·칩·배지를 알약(pill) 모양으로 만들지 않는다.** 원은 아바타·점·토글·진행 막대·순수 숫자 배지에만 쓴다. 이전에는 버튼과 배지 8곳이 `rounded-full`이었다. Tailwind의 `theme.borderRadius`를 extend가 아니라 통째로 교체해서, 실수로 `rounded-2xl`이나 `rounded-3xl`을 써도 카드 반경(12)으로 흡수되게 안전망을 걸었다.

| 클래스 | px | 쓰는 곳 |
|---|---|---|
| `rounded-none` | 0 | 예약 |
| `rounded`(DEFAULT), `rounded-sm` | 4 | 상태 뱃지(인증완료/처리중), D-day 배지 |
| `rounded-md`, `rounded-lg` | 8 | 버튼, 칩, 입력칸, 카테고리 그리드 |
| `rounded-xl`, `rounded-2xl`, `rounded-3xl` | 12 | 카드, 모달 시트 |
| `rounded-full` | 9999 | 스피너, 진행률 트랙과 채움, 아이콘 원 |

## 6. 그림자 (tokens.js `shadow`, Tailwind `theme.boxShadow` 통째 교체)

이전엔 그림자가 하나뿐이라 표면이 붙어 있는지 떠 있는지 구분이 안 됐다. sm/md/lg 세 단계 + **이너 섀도(inset)**를 추가했다.

| 클래스 | 값 | 쓰는 곳 |
|---|---|---|
| `shadow-sm` | 은은한 드롭섀도 | 보조 카드, 눌리지 않은 선택 버튼 |
| `shadow-md`(`shadow-card`와 동일) | 뚜렷한 드롭섀도 | 화면의 주요 카드. 대부분의 카드가 여기 |
| `shadow-lg` | 깊은 드롭섀도 | 바텀시트 모달 |
| `shadow-inner` | 안쪽으로 파인 이너 섀도 | 입력칸, 진행률 트랙(`inset-well` 클래스), 완료 전 스탬프 칸, 처리중 뱃지 |

입력칸에 이너 섀도를 넣어서 "오목하게 눌린 자리"처럼 보이게 했다. 이전에는 아래 테두리 2px 하나뿐이라 얇아 보인다는 지적을 받았다.

## 7. 컴포넌트 위계 보정 (Row, Stat)

- `Row`(인증현황 카드의 key-value 줄): 라벨은 caption-md, 값은 label-md, "총 인증 금액"처럼 강조가 필요한 값은 title-sm까지 올린다.
- `Stat`(대행사 화면 통계 카드): 라벨 caption-sm, 값은 title-md로 크게 키웠다. 핵심 지표 숫자가 화면에서 가장 먼저 보여야 한다는 이유다. 이전엔 값이 `text-body font-bold`(17px)라 라벨과 별 차이가 안 났다.

## 8. 절대 규칙 준수 현황

| 규칙 | 상태 |
|---|---|
| localStorage/sessionStorage 금지 | 준수 |
| TypeScript 금지 | 준수 |
| 색·간격·폰트·반경·그림자 하드코딩 금지 | 준수(hex는 tokens.js에만, 반경·그림자는 Tailwind theme 통째 교체로 안전망까지) |
| 이모지 아이콘 금지 | 준수(inline SVG) |
| hover에 scale 금지 / press 0.97 허용 | 준수 |
| 애니메이션은 transform·opacity만 | 준수(진행률 바 scaleX) |
| 44px 최소 터치 타깃 | 준수 |
| 알약형 버튼·칩 금지 | 준수(반경 5단계로 강제) |
| 순수 흰색 표면 금지 | 준수(surface 계열 전부 오프화이트) |
| 접근성 3종 미디어쿼리 | 준수 |

## 9. 미룬 것

IA.md, COMPONENTS.md, PATTERNS.md, ROUTES.md, PROGRESS.md, SESSION_HEADER.md는 만들지 않았다. 화면이 8개뿐이고 발표가 임박해 문서화보다 동작하는 프로토타입과 규칙 준수를 우선했다.
