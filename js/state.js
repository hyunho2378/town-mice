const { createContext, useContext, useState } = React;

// ---------- 간단한 화면 스택 내비게이션 (라우터 라이브러리 없이 구현) ----------
const NavContext = createContext(null);

function NavProvider({ children }) {
  const [stack, setStack] = useState([{ screen: "splash", params: {} }]);

  const navigate = (screen, params = {}) => setStack((s) => [...s, { screen, params }]);
  const replace = (screen, params = {}) => setStack(() => [{ screen, params }]);
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

// ---------- 앱 상태 (로그인, 영수증, NFC 태그, 여름 보상 선택) ----------
// 스킬 절대 규칙: localStorage/sessionStorage 금지, 인증은 httpOnly 쿠키.
// 백엔드가 없어 쿠키 발급이 불가능해 지속성 자체를 포기하고 순수 메모리 상태로만 둔다.
const AppStateContext = createContext(null);

function AppStateProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    receipts: initialReceipts,
    taggedSpots: [],
    selectedRewardId: null,
  });

  const login = (name, phone) => setState((s) => ({ ...s, user: { name, phone } }));

  const addReceipt = (receipt) => {
    setState((s) => ({
      ...s,
      receipts: [
        { id: Date.now(), status: "처리중", createdAt: new Date().toISOString(), ...receipt },
        ...s.receipts,
      ],
    }));
    // 시연용: 잠시 후 인증 완료로 자동 전환한다(실제로는 더픽트 AI 인증 절차).
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

  const selectReward = (rewardId) => setState((s) => ({ ...s, selectedRewardId: rewardId }));

  const reset = () =>
    setState({ user: null, receipts: initialReceipts, taggedSpots: [], selectedRewardId: null });

  const verified = state.receipts.filter((r) => r.status === "인증완료");
  const totalVerifiedAmount = verified.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const hasStayReceipt = verified.some((r) => r.category === "stay");

  // 게이지: 인증된 영수증 금액을 게이지 점수로 환산한다(5만원당 12.5, 문턱 100).
  const gaugeRaw = amountToGauge(totalVerifiedAmount);
  const gauge = Math.min(GAUGE.threshold, Math.round(gaugeRaw * 10) / 10);
  const gaugeFraction = gauge / GAUGE.threshold;
  const rewardUnlocked = gauge >= GAUGE.threshold;
  const amountToThreshold = Math.max(
    0,
    Math.ceil(((GAUGE.threshold - gaugeRaw) / GAUGE.pointsPerUnit) * GAUGE.amountUnit)
  );
  const selectedReward = REWARDS.find((r) => r.id === state.selectedRewardId) || null;

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
    selectReward,
    reset,
    derived: {
      verified,
      totalVerifiedAmount,
      hasStayReceipt,
      gauge,
      gaugeFraction,
      rewardUnlocked,
      amountToThreshold,
      selectedReward,
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
