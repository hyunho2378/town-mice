// ---------- 아이콘 ----------
// 스킬 절대 규칙: 이모지 아이콘 금지, lucide-react 또는 inline SVG만.
// 빌드 도구가 없어 npm의 lucide-react 패키지를 그대로 import할 수 없다(이 환경은
// Vite/esbuild 네이티브 바이너리가 코드사인 정책에 막힌다). 그래서 규칙이 명시적으로
// 허용한 다른 경로인 inline SVG로 직접 그린다. lucide와 같은 스타일(24x24, stroke
// 기반, round cap, 2px)로 통일한다. 크기는 규칙대로 16/20/24/32/48 다섯 단계만 쓴다.
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

// ---------- 상단 바 ----------
function TopBar({ title, backTo }) {
  const nav = useNav();
  return (
    <div className="sticky top-0 z-sticky flex items-center h-14 px-2 bg-surface border-b border-border">
      <button
        onClick={() => nav.goBack(backTo)}
        className="press tap-target-44 flex items-center justify-center text-text-secondary"
        aria-label="뒤로가기"
      >
        <Icon name="chevronLeft" size={24} />
      </button>
      <div className="flex-1 text-center font-semibold text-subheadline text-text-primary -ml-11">{title}</div>
    </div>
  );
}

// ---------- 하단 탭 바 ----------
function BottomNav() {
  const nav = useNav();
  const tabs = [
    { screen: "home", label: "홈", icon: "home" },
    { screen: "receiptCategory", label: "영수증인증", icon: "receipt" },
    { screen: "route", label: "화천 동선", icon: "map" },
    { screen: "admin", label: "대행사 화면", icon: "chart" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-sticky">
      <div className="phone-frame !min-h-0 !shadow-none">
        <div className="grid grid-cols-4 border-t border-border bg-surface">
          {tabs.map((t) => (
            <button
              key={t.screen}
              onClick={() => nav.replace(t.screen)}
              className={`press flex flex-col items-center justify-center gap-1 py-2 min-h-[44px] text-caption ${
                nav.screen === t.screen ? "text-primary font-semibold" : "text-text-tertiary"
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

function Row({ label, value, strong, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-footnote text-text-secondary">{label}</span>
      <span
        className={`${strong ? "text-title3 font-bold text-text-primary" : "text-subheadline font-medium text-text-primary"} ${
          accent ? "!text-primary !font-bold" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-surface-muted rounded-lg py-3">
      <div className="text-caption text-text-tertiary">{label}</div>
      <div className="text-body font-bold text-text-primary mt-0.5">{value}</div>
    </div>
  );
}

function won(n) {
  return n.toLocaleString("ko-KR") + "원";
}

function findLabel(list, id, key) {
  const found = list.find((x) => x.id === id);
  return found ? found[key || "label"] ?? found.name : id;
}
