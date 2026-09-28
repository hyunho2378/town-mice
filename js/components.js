// ---------- 아이콘 ----------
// 스킬 절대 규칙: 이모지 아이콘 금지, lucide-react 또는 inline SVG만.
// 빌드 도구가 없어 npm의 lucide-react 패키지를 그대로 import할 수 없다. 규칙이 명시적으로
// 허용한 다른 경로인 inline SVG로 직접 그린다. lucide와 같은 스타일(24x24, stroke 기반,
// round cap, 2px)로 통일한다. 크기는 규칙대로 16/20/24 세 단계만 쓴다.
function Icon({ name, size = 24, className = "", strokeWidth = 2 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
  };
  switch (name) {
    case "chevronLeft":
      return (
        <svg {...common}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M4 11l8-7 8 7" />
          <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
        </svg>
      );
    case "receipt":
      return (
        <svg {...common}>
          <path d="M6 3h12v17l-2-1.3L14 20l-2-1.3L10 20l-2-1.3L6 20V3z" />
          <path d="M9 8h6M9 12h6" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" />
          <path d="M9 4v14M15 6v14" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 20V10M12 20V4M20 20v-7" />
          <path d="M4 20h16" />
        </svg>
      );
    case "award":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="5" />
          <path d="M8.5 12.5L7 21l5-2.5L17 21l-1.5-8.5" />
        </svg>
      );
    case "square":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.2" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      );
    case "gift":
      return (
        <svg {...common}>
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8" />
          <path d="M12 8c-1.5-3-5-3-5-1s3 1 5 1zM12 8c1.5-3 5-3 5-1s-3 1-5 1z" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
          <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    default:
      return null;
  }
}

// ---------- 화천군 공식 캐릭터 ----------
// 출처: 화천군청 상징물 페이지(ihc.go.kr). 기본 캐릭터 산이와 진이(진달래 남매요정),
// 보조 캐릭터 달이(수달), 연이(연꽃), 물이(맑은 물), 천이(산천어). 저작권은 화천군에 있다.
// 스킬의 일러스트 규칙(unDraw, 단색)은 장식용 삽화에 관한 것이고, 이건 지자체 공식 브랜드
// 에셋이라 다르다. 색을 바꾸거나 변형하지 않고 원본 그대로 쓴다.
const CHARACTER_NAMES = {
  sani: "산이",
  jini: "진이",
  muli: "물이",
  yeoni: "연이",
  dali: "달이",
  cheoni: "천이",
};

function Character({ name, size = 64, className = "" }) {
  return (
    <img
      src={`./assets/characters/${name}.svg`}
      alt={`화천군 공식 캐릭터 ${CHARACTER_NAMES[name] || name}`}
      style={{ height: size, width: "auto" }}
      className={className}
      draggable={false}
    />
  );
}

// ---------- 상단 바 ----------
function TopBar({ title, backTo }) {
  const nav = useNav();
  return (
    <div className="sticky top-0 z-sticky flex items-center h-14 px-2 bg-surface border-b border-border shadow-sm">
      <button
        onClick={() => nav.goBack(backTo)}
        className="press tap-target-44 flex items-center justify-center text-text-secondary"
        aria-label="뒤로가기"
      >
        <Icon name="chevronLeft" size={24} />
      </button>
      <div className="flex-1 text-center text-label-lg text-text-primary -ml-11">{title}</div>
    </div>
  );
}

// ---------- 하단 탭 바 ----------
function BottomNav() {
  const nav = useNav();
  const tabs = [
    { screen: "home", label: "홈", icon: "home" },
    { screen: "receiptCategory", label: "영수증인증", icon: "receipt" },
    { screen: "reward", label: "여름 보상", icon: "gift" },
    FEATURES.nfcRoute ? { screen: "route", label: "화천 동선", icon: "map" } : null,
    { screen: "admin", label: "대행사 화면", icon: "chart" },
  ].filter(Boolean);
  return (
    <div className="fixed bottom-0 left-0 right-0 z-sticky">
      <div className="phone-frame !min-h-0 !shadow-none">
        <div className={`grid ${tabs.length === 5 ? "grid-cols-5" : "grid-cols-4"} border-t border-border bg-surface shadow-nav`}>
          {tabs.map((t) => (
            <button
              key={t.screen}
              onClick={() => nav.replace(t.screen)}
              className={`press flex flex-col items-center justify-center gap-1 py-2 min-h-[44px] text-caption-sm ${
                nav.screen === t.screen ? "text-primary" : "text-text-tertiary"
              }`}
            >
              <Icon name={t.icon} size={20} />
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Row: 인증현황 카드의 key-value 한 줄. 라벨은 눕고 값은 굵게, 위계를 굵기 차이로 낸다.
function Row({ label, value, strong, accent }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-caption-md text-text-secondary">{label}</span>
      <span
        className={`${strong ? "text-title-sm" : "text-label-md"} ${
          accent ? "!text-primary" : "text-text-primary"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// Stat: 대행사 화면의 핵심 지표 카드. 숫자가 화면에서 가장 눈에 띄어야 해서 title-md를 쓴다.
function Stat({ label, value }) {
  return (
    <div className="bg-surface-sunken shadow-inner rounded-lg py-3 px-2">
      <div className="text-caption-sm text-text-tertiary">{label}</div>
      <div className="text-title-md text-text-primary mt-0.5">{value}</div>
    </div>
  );
}


// 한글 목적격 조사(을/를) 자동 선택. 마지막 글자에 받침이 있으면 "을", 없으면 "를".
function withObjectParticle(word) {
  const last = word.charCodeAt(word.length - 1);
  if (last < 0xac00 || last > 0xd7a3) return word + "를";
  const hasBatchim = (last - 0xac00) % 28 !== 0;
  return word + (hasBatchim ? "을" : "를");
}

// 축제 시작일까지 D-day. 하드코딩하지 않고 오늘 날짜로 계산한다.
function ddayLabel(dateStr) {
  const today = new Date();
  const start = new Date(dateStr + "T00:00:00");
  const diff = Math.ceil((start - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
  if (diff > 0) return "D-" + diff;
  if (diff === 0) return "D-DAY";
  return "진행 중";
}

function won(n) {
  return n.toLocaleString("ko-KR") + "원";
}

function findLabel(list, id, key) {
  const found = list.find((x) => x.id === id);
  return found ? found[key || "label"] ?? found.name : id;
}
