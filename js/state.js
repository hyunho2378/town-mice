const { createContext, useContext, useEffect, useState } = React;

// ---------- 간단한 화면 스택 내비게이션 (라우터 라이브러리 없이 구현) ----------
const NavContext = createContext(null);

function NavProvider({ children }) {
  const [stack, setStack] = useState([{ screen: "splash", params: {} }]);

  const navigate = (screen, params = {}) =>
    setStack((s) => [...s, { screen, params }]);

  const replace = (screen, params = {}) =>
    setStack(() => [{ screen, params }]);

  const goBack = (fallback) =>
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : fallback ? [{ screen: fallback, params: {} }] : s));

  const current = stack[stack.length - 1];

  return (
    <NavContext.Provider value={{ screen: current.screen, params: current.params, navigate, replace, goBack }}>
      {children}
    </NavContext.Provider>
  );
}

function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}

// ---------- 앱 상태 (로그인, 영수증, NFC 태그) ----------
const AppStateContext = createContext(null);
const STORAGE_KEY = "townmice-demo-state-v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* ignore */
  }
  return { user: null, receipts: initialReceipts, taggedSpots: [] };
}

function AppStateProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = (name, phone) => setState((s) => ({ ...s, user: { name, phone } }));

  const addReceipt = (receipt) => {
    setState((s) => ({
      ...s,
      receipts: [
        { id: Date.now(), status: "처리중", createdAt: new Date().toISOString(), ...receipt },
        ...s.receipts,
      ],
    }));
    // 시연용: 잠시 후 인증 완료로 자동 전환 (실제로는 더픽트 AI 인증 절차)
    setTimeout(() => {
      setState((s) => ({
        ...s,
        receipts: s.receipts.map((r, idx) =>
          idx === 0 && r.status === "처리중" ? { ...r, status: "인증완료" } : r
        ),
      }));
    }, 2200);
  };

  const tagSpot = (spotId) =>
    setState((s) => (s.taggedSpots.includes(spotId) ? s : { ...s, taggedSpots: [...s.taggedSpots, spotId] }));

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, receipts: initialReceipts, taggedSpots: [] });
  };

  const verified = state.receipts.filter((r) => r.status === "인증완료");
  const totalVerifiedAmount = verified.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const hasStayReceipt = verified.some((r) => r.category === "stay");
  const neededForStay = Math.max(EVENT.thresholdStay - totalVerifiedAmount, 0);
  const neededForDay = Math.max(EVENT.threshold1day - totalVerifiedAmount, 0);

  const regionProgress = REGIONS.map((region) => {
    const verifiedInRegion = verified.some((r) => r.regionId === region.id);
    const taggedInRegion = NFC_SPOTS.some(
      (spot) => spot.regionId === region.id && state.taggedSpots.includes(spot.id)
    );
    return { ...region, done: verifiedInRegion || taggedInRegion };
  });
  const completedRegions = regionProgress.filter((r) => r.done).length;

  const value = {
    state,
    login,
    addReceipt,
    tagSpot,
    reset,
    derived: {
      verified,
      totalVerifiedAmount,
      hasStayReceipt,
      neededForStay,
      neededForDay,
      regionProgress,
      completedRegions,
    },
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
