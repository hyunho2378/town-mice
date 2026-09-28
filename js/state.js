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

// ---------- 앱 상태 ----------
// 스킬 절대 규칙: localStorage/sessionStorage 금지. 백엔드가 없어 순수 메모리 상태로만 둔다.
// 제안서 흐름: 영수증을 올리면 보상 3개가 열리고(2단계), 목표 보상을 먼저 고른 뒤(3단계)
// 게이지 100을 채우면 그 보상을 받고 나머지 둘은 할인가로 열린다(4단계).
// 여름 영수증은 다음 겨울 게이지로 이어진다(5단계).
const AppStateContext = createContext(null);

const INITIAL_STATE = {
  user: null,
  receipts: initialReceipts,
  taggedSpots: [],
  members: [],            // 일행(가족, 동행) 이름. 영수증을 한 계정에 합산한다.
  season: "winter",       // "winter" | "summer". 여름은 시연용으로 넘긴다.
  targetRewardId: null,   // 먼저 고른 목표 보상
  bundlePurchased: [],    // 묶음 할인가로 구매한 보상 id
};

function AppStateProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);

  const login = (name, phone) => setState((s) => ({ ...s, user: { name, phone } }));

  const addReceipt = (receipt) => {
    setState((s) => ({
      ...s,
      receipts: [
        { id: Date.now(), status: "처리중", season: s.season, createdAt: new Date().toISOString(), ...receipt },
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
    }, 900); // 로딩 짧게(발표 시연용)
  };

  const tagSpot = (spotId) =>
    setState((s) => (s.taggedSpots.includes(spotId) ? s : { ...s, taggedSpots: [...s.taggedSpots, spotId] }));

  const addMember = (name) =>
    setState((s) => (!name || s.members.includes(name) ? s : { ...s, members: [...s.members, name] }));
  const removeMember = (name) => setState((s) => ({ ...s, members: s.members.filter((m) => m !== name) }));

  const selectTargetReward = (rewardId) => setState((s) => ({ ...s, targetRewardId: rewardId }));
  const buyBundle = (rewardId) =>
    setState((s) => (s.bundlePurchased.includes(rewardId) ? s : { ...s, bundlePurchased: [...s.bundlePurchased, rewardId] }));
  const setSeason = (season) => setState((s) => ({ ...s, season }));

  const verified = state.receipts.filter((r) => r.status === "인증완료");
  const winterVerified = verified.filter((r) => r.season === "winter");
  const summerVerified = verified.filter((r) => r.season === "summer");
  const winterAmount = winterVerified.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const summerAmount = summerVerified.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const totalVerifiedAmount = winterAmount + summerAmount;

  // 겨울 게이지: 겨울 영수증만 센다. 5만원당 12.5(가정), 문턱 100.
  const gaugeRaw = amountToGauge(winterAmount);
  const gauge = Math.min(GAUGE.threshold, Math.round(gaugeRaw * 10) / 10);
  const gaugeFraction = gauge / GAUGE.threshold;
  const gaugeFull = gauge >= GAUGE.threshold;
  const amountToThreshold = Math.max(0, Math.ceil(((GAUGE.threshold - gaugeRaw) / GAUGE.pointsPerUnit) * GAUGE.amountUnit));

  // 다음 겨울 게이지: 여름 영수증을 같은 규칙으로 센다(가정).
  const nextWinterGauge = Math.min(GAUGE.threshold, Math.round(amountToGauge(summerAmount) * 10) / 10);

  const rewardsOpen = winterVerified.length > 0; // 제안서 2단계: 영수증을 올리면 보상 3개가 열린다
  const targetReward = REWARDS.find((r) => r.id === state.targetRewardId) || null;
  const achieved = gaugeFull && !!targetReward;  // 제안서 4단계

  // 일행 합산: 결제자별 인증 금액
  const payers = [state.user?.name, ...state.members].filter(Boolean);
  const amountByPayer = payers.map((p) => ({
    name: p,
    amount: winterVerified.filter((r) => r.payer === p).reduce((s, r) => s + Number(r.amount || 0), 0),
  }));

  const regionProgress = REGIONS.map((region) => {
    const verifiedInRegion = verified.some((r) => r.regionId === region.id);
    const taggedInRegion = NFC_SPOTS.some((spot) => spot.regionId === region.id && state.taggedSpots.includes(spot.id));
    return { ...region, done: verifiedInRegion || taggedInRegion };
  });
  const completedRegions = regionProgress.filter((r) => r.done).length;

  const value = {
    state,
    login,
    addReceipt,
    tagSpot,
    addMember,
    removeMember,
    selectTargetReward,
    buyBundle,
    setSeason,
    derived: {
      verified,
      winterVerified,
      summerVerified,
      winterAmount,
      summerAmount,
      totalVerifiedAmount,
      gauge,
      gaugeFraction,
      gaugeFull,
      amountToThreshold,
      nextWinterGauge,
      rewardsOpen,
      targetReward,
      achieved,
      payers,
      amountByPayer,
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
