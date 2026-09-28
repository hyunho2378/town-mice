function TopBar({ title, backTo }) {
  const nav = useNav();
  return (
    <div className="sticky top-0 z-10 flex items-center h-14 px-3 bg-white border-b border-gray-100">
      <button
        onClick={() => nav.goBack(backTo)}
        className="w-9 h-9 flex items-center justify-center text-xl text-gray-600"
        aria-label="뒤로가기"
      >
        {"<"}
      </button>
      <div className="flex-1 text-center font-semibold text-[15px] text-gray-800 -ml-9">{title}</div>
    </div>
  );
}

function BottomNav() {
  const nav = useNav();
  const tabs = [
    { screen: "home", label: "홈", icon: "🏠" },
    { screen: "receiptCategory", label: "영수증인증", icon: "🧾" },
    { screen: "route", label: "화천 동선", icon: "🗺️" },
    { screen: "admin", label: "대행사 화면", icon: "📊" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <div className="phone-frame !min-h-0 shadow-none">
        <div className="grid grid-cols-4 border-t border-gray-100 bg-white">
          {tabs.map((t) => (
            <button
              key={t.screen}
              onClick={() => nav.replace(t.screen)}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] ${
                nav.screen === t.screen ? "text-pink-brand font-semibold" : "text-gray-400"
              }`}
            >
              <span className="text-base leading-none">{t.icon}</span>
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
      <span className="text-gray-400">{label}</span>
      <span
        className={`${strong ? "text-lg font-bold text-gray-900" : "font-medium"} ${
          accent ? "text-pink-brand font-bold" : "text-gray-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg py-3">
      <div className="text-[11px] text-gray-400">{label}</div>
      <div className="text-base font-bold text-gray-800 mt-0.5">{value}</div>
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
