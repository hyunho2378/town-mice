const { useEffect } = React;

// ---------------- Splash ----------------
function Splash() {
  const nav = useNav();
  const { state } = useAppState();

  useEffect(() => {
    const t = setTimeout(() => {
      nav.replace(state.user ? "home" : "login");
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="phone-frame flex flex-col items-center justify-center bg-shell text-on-primary">
      <div className="text-caption-md tracking-widest opacity-90 mb-2">TOWN MICE × 더픽트</div>
      <div className="text-display-lg mb-3">화천 PASS</div>
      <div className="text-body-lg opacity-90">한 번의 인증으로, 화천을 한 바퀴!</div>
      <div className="mt-10 w-8 h-8 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
    </div>
  );
}

// ---------------- Login ----------------
// Bill Concert 틀(스플래시, 로그인)은 더픽트 핑크(shell)를 그대로 쓴다. 그 안의 화천
// 콘텐츠(홈부터)만 화천 CI 블루(primary)를 쓴다.
function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("name");
  const { login } = useAppState();
  const nav = useNav();

  const canNext = step === "name" ? name.trim().length > 0 : phone.trim().length > 0;

  const handleNext = () => {
    if (step === "name") {
      setStep("phone");
      return;
    }
    login(name, phone);
    setStep("done");
    setTimeout(() => nav.replace("home"), 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && canNext) handleNext();
  };

  if (step === "done") {
    return (
      <div className="phone-frame flex flex-col items-center justify-center bg-shell text-on-primary px-8 text-center">
        <Icon name="check" size={48} className="mb-4" />
        <div className="text-title-lg">회원가입이 완료되었습니다.</div>
        <div className="text-body-md opacity-90 mt-2">화천 PASS로 이동합니다</div>
      </div>
    );
  }

  return (
    <div className="phone-frame flex flex-col bg-surface">
      <div className="h-14 flex items-center px-2">
        {step === "phone" && (
          <button
            onClick={() => setStep("name")}
            className="press tap-target-44 flex items-center justify-center text-text-secondary"
            aria-label="뒤로가기"
          >
            <Icon name="chevronLeft" size={24} />
          </button>
        )}
      </div>
      <div className="flex-1 px-6 pt-4">
        <div className="text-title-lg text-text-primary mb-1">로그인</div>
        <div className="text-caption-md text-text-tertiary mb-10">화천 PASS, Powered by 더픽트</div>

        {step === "name" ? (
          <div>
            <label className="text-label-sm text-text-secondary">이름</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="이름을 입력해주세요"
              className="w-full bg-surface-sunken shadow-inner border border-border-strong rounded-lg px-4 py-3 text-body-lg text-text-primary placeholder:text-text-tertiary focus:border-shell outline-none mt-2"
            />
          </div>
        ) : (
          <div>
            <label className="text-label-sm text-text-secondary">휴대폰 번호</label>
            <input
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="휴대폰 번호를 입력해주세요"
              inputMode="numeric"
              className="w-full bg-surface-sunken shadow-inner border border-border-strong rounded-lg px-4 py-3 text-body-lg text-text-primary placeholder:text-text-tertiary focus:border-shell outline-none mt-2"
            />
          </div>
        )}
      </div>
      <div className="p-6">
        <button
          disabled={!canNext}
          onClick={handleNext}
          className={`press w-full py-4 min-h-[44px] rounded-lg shadow-md text-label-lg text-on-primary ${
            canNext ? "bg-shell" : "bg-text-tertiary shadow-none"
          }`}
        >
          {step === "name" ? "다음" : "시작하기"}
        </button>
        <div className="text-caption-sm text-text-tertiary text-center mt-6 leading-relaxed">
          로그인하시면 아래 내용에 동의하는 것으로 간주됩니다
          <br />
          <span className="underline">개인정보처리방침</span> <span className="underline">이용약관</span>
        </div>
      </div>
    </div>
  );
}

// ---------------- Home ----------------
// "겨울 영수증, 여름 화천"(허주은 제안) 구현.
// 화천 CI 3색(블루 286C, 연두 376C, 노랑 152C)을 캐러셀에 그대로 쓴다. 앱 안쪽 색은 전부
// 화천 블루(primary)이고, 핑크(shell)는 스플래시와 로그인에만 남긴다.
function Home() {
  const nav = useNav();
  const { state, derived, setSeason } = useAppState();
  const { winterAmount, summerAmount, gauge, gaugeFraction, gaugeFull, amountToThreshold, rewardsOpen, targetReward, achieved, nextWinterGauge, payers } = derived;
  const isSummer = state.season === "summer";

  return (
    <div className="phone-frame bg-background pb-32">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <div className="text-caption-sm text-text-tertiary">Bill Concert × Town MICE</div>
          <div className="text-title-sm text-text-primary mt-0.5">{state.user?.name}님, 안녕하세요</div>
        </div>
        <div className="text-label-sm text-text-secondary bg-surface rounded-lg shadow-sm px-3 py-2">
          {isSummer ? "여름 화천" : ddayLabel(EVENT.startDate)}
        </div>
      </div>

      {/* 여름 화천 보상 캐러셀. 축제 이름 대신 실제 받을 수 있는 것 세 개를 돌린다 */}
      <div className="mx-4 mt-2">
        <RewardCarousel rewards={REWARDS} />
      </div>

      {/* 겨울 영수증 게이지 카드 */}
      <div className="mx-4 mt-6 bg-surface rounded-xl shadow-md p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="text-title-sm text-text-primary">겨울 영수증 게이지</div>
          <div className="text-title-lg text-primary">
            {gauge}
            <span className="text-caption-md text-text-tertiary"> /{GAUGE.threshold}</span>
          </div>
        </div>
        <div className="text-caption-md text-text-tertiary">화천 가게 영수증 5만원마다 게이지 12.5 (가정)</div>
        <div className="text-caption-md text-text-tertiary mb-4">인증 기간: {GAUGE.validWindowLabel}</div>

        <div className="w-full h-3 rounded-full inset-well overflow-hidden">
          <div
            className="h-full w-full bg-primary rounded-full origin-left"
            style={{ transform: `scaleX(${gaugeFraction})`, transition: "transform var(--motion-base) var(--motion-standard)" }}
          />
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <Row label={`일행 ${payers.length}명 합산 영수증`} value={won(winterAmount)} strong />
          <Row
            label={achieved ? "받은 여름 보상" : targetReward ? `${targetReward.name}까지 남은 금액` : "목표 보상"}
            value={achieved ? targetReward.name : targetReward ? won(amountToThreshold) : rewardsOpen ? "고르기 전" : "영수증을 올리면 열려요"}
            accent
          />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => nav.navigate("group")}
            className="press min-h-[48px] flex items-center justify-center gap-1.5 text-label-md text-primary border border-primary rounded-lg"
          >
            <Icon name="users" size={18} />
            일행 합산
          </button>
          {rewardsOpen && !targetReward ? (
            <button
              onClick={() => nav.navigate("reward")}
              className="press min-h-[48px] bg-primary text-on-primary rounded-lg shadow-md text-label-md"
            >
              목표 보상 고르기
            </button>
          ) : (
            <button
              onClick={() => nav.navigate("receiptUpload")}
              className="press min-h-[48px] bg-primary text-on-primary rounded-lg shadow-md text-label-md"
            >
              영수증 인증하기
            </button>
          )}
        </div>
      </div>

      {/* 여름 화천 보상 현황 */}
      <div className="mx-4 mt-6 bg-surface rounded-xl shadow-md p-5">
        <div className="flex items-center justify-between">
          <div className="text-title-sm text-text-primary">여름 화천 보상</div>
          <button onClick={() => nav.navigate("reward")} className="press min-h-[44px] px-2 text-label-sm text-primary">
            자세히
          </button>
        </div>
        <div className="text-caption-md text-text-tertiary mb-4">{GAUGE.rewardWindowLabel}</div>
        <div className="grid grid-cols-3 gap-3">
          {REWARDS.map((r) => {
            const isTarget = targetReward && targetReward.id === r.id;
            const isBundle = achieved && !isTarget;
            const bought = state.bundlePurchased.includes(r.id);
            const status = !rewardsOpen ? "잠김" : achieved ? (isTarget ? "받음" : bought ? "구매함" : "할인가") : isTarget ? "목표" : "선택 가능";
            const theme = themeClasses(r.theme);
            return (
              <div
                key={r.id}
                className={`rounded-lg p-3 flex flex-col items-center text-center border ${
                  isTarget || isBundle ? `${theme.bg} ${theme.border} shadow-sm` : "bg-surface-sunken shadow-inner border-transparent"
                } ${!rewardsOpen ? "opacity-60" : ""}`}
              >
                <Character name={r.character} size={48} />
                <div className="text-label-md text-text-primary mt-2">{r.name}</div>
                <div className={`text-caption-sm mt-0.5 ${isTarget ? theme.ink : "text-text-tertiary"}`}>{status}</div>
              </div>
            );
          })}
        </div>
        {achieved && (
          <div className="mt-4 bg-surface-sunken shadow-inner rounded-lg p-3 text-caption-md text-text-secondary leading-relaxed">
            {withObjectParticle(targetReward.name)} 받았어요. 나머지 두 보상은 묶음 할인가로 열려서 여름에 함께 쓰면 1박 코스가 돼요.
          </div>
        )}
      </div>

      {achieved && (
        <div className="mx-4 mt-6 bg-surface rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="text-title-sm text-text-primary">여름 영수증, 다음 겨울로</div>
            <Character name="jini" size={40} />
          </div>
          {isSummer ? (
            <>
              <div className="text-caption-md text-text-tertiary mb-4">여름 화천에서 쓴 영수증이 다음 겨울 산천어축제 혜택 게이지로 쌓여요 (같은 규칙, 가정)</div>
              <div className="w-full h-3 rounded-full inset-well overflow-hidden">
                <div
                  className="h-full w-full bg-primary rounded-full origin-left"
                  style={{ transform: `scaleX(${nextWinterGauge / GAUGE.threshold})`, transition: "transform var(--motion-base) var(--motion-standard)" }}
                />
              </div>
              <div className="flex flex-col gap-1 mt-4">
                <Row label="여름 인증 영수증" value={won(summerAmount)} />
                <Row label="다음 겨울 게이지" value={`${nextWinterGauge} /${GAUGE.threshold}`} accent />
              </div>
            </>
          ) : (
            <>
              <div className="text-caption-md text-text-tertiary mb-4">8월 초 여름 화천에서 영수증을 올리면 다음 겨울 산천어축제 혜택으로 이어져요</div>
              <button
                onClick={() => setSeason("summer")}
                className="press w-full min-h-[48px] text-label-md text-primary border border-primary rounded-lg"
              >
                시연: 8월 여름 화천으로 넘기기
              </button>
            </>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

// ---------------- RewardSelect ----------------
// 게이지가 차기 전: 목표 보상을 고른다(바꿀 수 있음). 게이지 100 달성 후: 목표 보상은 받고,
// 나머지 둘은 묶음 할인가로 구매할 수 있다. 할인 금액은 제안서에 없어 "확정 전"으로 둔다.
function RewardSelect() {
  const nav = useNav();
  const { state, selectTargetReward, buyBundle, derived } = useAppState();
  const { rewardsOpen, targetReward, achieved, amountToThreshold, gauge } = derived;
  const [pickedId, setPickedId] = useState(state.targetRewardId);

  const handleConfirm = () => {
    if (!pickedId) return;
    selectTargetReward(pickedId);
    nav.replace("home");
  };

  return (
    <div className="phone-frame bg-surface pb-32">
      <TopBar title="여름 보상" backTo="home" />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-6">
          <Character name="sani" size={56} />
          <div>
            <div className="text-title-lg text-text-primary">
              {achieved ? "게이지 100 달성" : rewardsOpen ? "목표 보상을 고르세요" : "아직 잠겨 있어요"}
            </div>
            <div className="text-caption-md text-text-tertiary mt-1">
              {achieved
                ? "목표 보상을 받았어요. 나머지 둘은 할인가로 살 수 있어요"
                : rewardsOpen
                ? `지금 게이지 ${gauge}. 고른 보상을 향해 게이지가 쌓여요`
                : "화천 가게 영수증을 한 장 올리면 세 보상이 열려요"}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {REWARDS.map((r) => {
            const picked = pickedId === r.id;
            const isTarget = targetReward && targetReward.id === r.id;
            const bought = state.bundlePurchased.includes(r.id);
            const theme = themeClasses(r.theme);
            const highlighted = achieved ? isTarget : picked;
            return (
              <div
                key={r.id}
                className={`flex items-center gap-4 rounded-lg border p-4 ${
                  highlighted ? `${theme.bg} ${theme.border} shadow-md` : "border-border bg-surface-raised shadow-sm"
                } ${!rewardsOpen ? "opacity-60" : ""}`}
              >
                <Character name={r.character} size={64} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-title-sm text-text-primary">{r.name}</div>
                  <div className="text-body-md text-text-secondary mt-0.5">{r.desc}</div>
                  <div className="text-caption-md text-text-tertiary mt-1">여름에 다시 와야 하는 이유: {r.reason}</div>
                  {achieved ? (
                    isTarget ? (
                      <div className="text-label-sm text-primary mt-2">받음</div>
                    ) : (
                      <button
                        onClick={() => buyBundle(r.id)}
                        disabled={bought}
                        className={`press mt-2 min-h-[44px] px-4 rounded-lg text-label-sm ${
                          bought ? "bg-surface-sunken shadow-inner text-text-tertiary" : "bg-primary text-on-primary shadow-sm"
                        }`}
                      >
                        {bought ? "구매함 (시연)" : "묶음 할인가로 구매 (할인 금액 확정 전)"}
                      </button>
                    )
                  ) : (
                    rewardsOpen && (
                      <button
                        onClick={() => setPickedId(r.id)}
                        aria-pressed={picked}
                        className={`press mt-2 min-h-[44px] px-4 rounded-lg text-label-sm border ${
                          picked ? "bg-primary text-on-primary border-primary" : "border-primary text-primary"
                        }`}
                      >
                        {picked ? "목표로 선택됨" : "이걸 목표로"}
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-surface-sunken shadow-inner rounded-lg p-4 text-caption-md text-text-secondary leading-relaxed">
          세 보상 모두 {GAUGE.rewardWindowLabel}에 화천읍 권역에 모여 있어요. 어느 보상을 골라도 여름 화천 1박으로 이어져요.
          {!achieved && targetReward && ` 지금 목표까지 ${won(amountToThreshold)} 남았어요.`}
        </div>
      </div>

      {!achieved && rewardsOpen && (
        <div className="fixed bottom-0 left-0 right-0">
          <div className="phone-frame !min-h-0 !shadow-none p-4 bg-surface border-t border-border">
            <button
              disabled={!pickedId}
              onClick={handleConfirm}
              className={`press w-full py-4 min-h-[44px] rounded-lg text-label-lg text-on-primary ${
                pickedId ? "bg-primary shadow-md" : "bg-text-tertiary"
              }`}
            >
              {targetReward ? "목표 바꾸기" : "이 보상을 목표로 모으기"}
            </button>
          </div>
        </div>
      )}
      {(achieved || !rewardsOpen) && <BottomNav />}
    </div>
  );
}

// ---------------- GroupScreen ----------------
// 제안서 규칙 "가족, 일행 영수증을 한 계정에 합산". 초대 코드는 시연용 고정값이다.
function GroupScreen() {
  const { state, derived, addMember, removeMember } = useAppState();
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    const n = newName.trim();
    if (!n) return;
    addMember(n);
    setNewName("");
  };

  return (
    <div className="phone-frame bg-background pb-28">
      <TopBar title="일행 합산" backTo="home" />
      <div className="p-4 flex flex-col gap-6">
        <div className="bg-surface rounded-xl shadow-md p-5">
          <div className="text-title-sm text-text-primary">한 계정에 모아요</div>
          <div className="text-caption-md text-text-tertiary mt-1 mb-4">가족과 일행의 영수증을 합쳐 게이지를 채워요. 게이지 100은 약 40만원(가정)이라 혼자보다 함께가 빨라요.</div>
          <div className="bg-surface-sunken shadow-inner rounded-lg p-4 flex items-center justify-between">
            <span className="text-caption-md text-text-secondary">초대 코드 (시연용)</span>
            <span className="text-title-sm text-text-primary tracking-wider">{GROUP_CODE_DEMO}</span>
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-md p-5">
          <div className="text-title-sm text-text-primary mb-3">일행 ({derived.payers.length}명)</div>
          <div className="flex gap-2 mb-4">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="일행 이름"
              className="flex-1 min-w-0 bg-surface-sunken shadow-inner border border-border-strong rounded-lg px-3 py-2.5 text-body-lg text-text-primary placeholder:text-text-tertiary focus:border-primary outline-none"
            />
            <button
              onClick={handleAdd}
              className="press min-h-[44px] px-4 bg-primary text-on-primary rounded-lg shadow-sm text-label-md"
            >
              추가
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {derived.amountByPayer.map((p, idx) => (
              <div key={p.name} className="flex items-center justify-between min-h-[44px] px-3 rounded-lg bg-surface-raised border border-border">
                <span className="text-label-md text-text-primary">
                  {p.name}
                  {idx === 0 && <span className="text-caption-sm text-text-tertiary"> (본인)</span>}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-label-md text-text-secondary">{won(p.amount)}</span>
                  {idx > 0 && (
                    <button
                      onClick={() => removeMember(p.name)}
                      className="press tap-target-44 flex items-center justify-center text-text-tertiary"
                      aria-label={`${p.name} 빼기`}
                    >
                      <Icon name="x" size={16} />
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

// ---------------- ReceiptCategory ----------------
function ReceiptCategory() {
  const nav = useNav();
  return (
    <div className="phone-frame bg-surface pb-28">
      <TopBar title="영수증 인증" backTo="home" />
      <div className="p-5">
        <div className="text-label-sm text-primary mb-2">STEP 01</div>
        <div className="text-title-lg text-text-primary mb-6">지출 카테고리를 선택하세요</div>

        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => nav.navigate("receiptUpload", { categoryId: c.id })}
              className="press border border-border bg-surface-raised rounded-lg py-4 min-h-[44px] shadow-sm text-label-lg text-text-primary hover:border-primary hover:text-primary hover:bg-primary-subtle"
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-8 bg-surface-sunken shadow-inner rounded-lg p-4 text-caption-md text-text-secondary leading-relaxed">
          영수증에 결제일시, 가맹점명, 금액, 주소가 모두 표시되어 있어야 인증이 가능해요.
          <br />
          <span className="text-text-tertiary">인증 불가 사례: 주소가 없는 배달앱 영수증, 배달 전표, 주소가 잘린 캡처본</span>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

// ---------------- ReceiptUpload ----------------
// 발표 시연용으로 실제 타이핑을 없앤다. 업로드 자리를 누르면 iOS 액션시트 스타일 모달이 뜨고,
// 사진 보관함에서 샘플 영수증 하나를 고르면 카테고리, 가맹점, 금액, 지역이 즉시 자동으로 채워진다
// (실제로는 더픽트 AI 인증). 카메라 버튼은 가장 빠른 데모 경로(숙박 40만원, 게이지 100)로 바로 간다.
function ReceiptUpload() {
  const nav = useNav();
  const { state, addReceipt, derived } = useAppState();

  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [regionId, setRegionId] = useState("");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [payer, setPayer] = useState(state.user?.name || "");
  const [fileName, setFileName] = useState("");
  const [picker, setPicker] = useState(null); // null | "sheet" | "gallery" | "reading"

  const categoryInfo = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const canSubmit = regionId && amount && merchant && fileName;

  const applySample = (sample) => {
    setCategory(sample.category);
    setRegionId(sample.regionId);
    setMerchant(sample.merchant);
    setAmount(String(sample.amount));
    setFileName(sample.label + ".jpg");
    setPicker("reading");
    setTimeout(() => setPicker(null), 700); // 로딩 짧게(발표 시연용)
  };

  const handleSubmit = () => {
    addReceipt({ category, categoryLabel: categoryInfo.label, type: "digital", regionId, amount: Number(amount), merchant, payer });
    nav.navigate("receiptStatus");
  };

  return (
    <div className="phone-frame bg-surface pb-32">
      <TopBar title="영수증 인증" backTo="home" />

      <div className="p-5 space-y-7">
        <div>
          <div className="text-title-sm text-text-primary mb-3">영수증 사진</div>
          <button
            onClick={() => setPicker("sheet")}
            className="press w-full flex flex-col items-center justify-center bg-surface-sunken shadow-inner border-2 border-dashed border-border-strong rounded-lg py-8"
          >
            {fileName ? (
              <>
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${themeClasses(SAMPLE_RECEIPTS.find((s) => s.merchant === merchant)?.theme || "blue").bg}`}>
                  <Icon name="receipt" size={24} className="text-text-secondary" />
                </div>
                <div className="text-label-md text-text-primary mt-2">{fileName}</div>
                <div className="text-caption-md text-text-tertiary mt-1">다시 선택하려면 눌러 주세요</div>
              </>
            ) : (
              <>
                <Icon name="plus" size={24} className="text-text-tertiary" />
                <div className="text-caption-md text-text-tertiary mt-2 text-center px-4">눌러서 영수증 사진을 올려 주세요</div>
              </>
            )}
          </button>
        </div>

        <div>
          <div className="text-title-sm text-text-primary mb-3">지출 카테고리</div>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`press min-h-[44px] rounded-lg text-label-sm border ${
                  category === c.id ? "border-primary text-primary bg-primary-subtle" : "border-border bg-surface-raised text-text-secondary shadow-sm"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          {categoryInfo.needsAddressProof && (
            <div className="mt-3 bg-primary-subtle rounded-lg p-3 text-caption-md text-ci-blue-ink leading-relaxed">
              숙박 영수증은 실제 가맹점 주소가 보이는 예약 내역이나 인보이스를 함께 올려야 해요.
            </div>
          )}
        </div>

        <div>
          <div className="text-title-sm text-text-primary mb-1">결제한 사람</div>
          <div className="text-caption-md text-text-tertiary mb-3">일행 영수증도 이 계정 게이지에 합산돼요</div>
          <div className="flex flex-wrap gap-2">
            {derived.payers.map((name) => (
              <button
                key={name}
                onClick={() => setPayer(name)}
                aria-pressed={payer === name}
                className={`press min-h-[44px] px-4 rounded-lg text-label-md border ${
                  payer === name ? "border-primary text-primary bg-primary-subtle" : "border-border bg-surface-raised text-text-secondary shadow-sm"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-title-sm text-text-primary mb-3">방문 권역</div>
          <div className="grid grid-cols-1 gap-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRegionId(r.id)}
                className={`press flex items-center justify-between min-h-[44px] px-3 rounded-lg border ${
                  regionId === r.id ? "border-primary bg-primary-subtle" : "border-border bg-surface-raised shadow-sm"
                }`}
              >
                <span className="text-label-md text-text-primary">{r.name}</span>
                <span className="text-caption-sm text-text-tertiary">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-label-sm text-text-secondary">가맹점명</label>
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="예: 화천전통시장"
              className="w-full bg-surface-sunken shadow-inner border border-border-strong rounded-lg px-3 py-2.5 text-body-lg text-text-primary placeholder:text-text-tertiary focus:border-primary outline-none mt-1.5"
            />
          </div>
          <div>
            <label className="text-label-sm text-text-secondary">결제 금액(원)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="예: 35000"
              inputMode="numeric"
              className="w-full bg-surface-sunken shadow-inner border border-border-strong rounded-lg px-3 py-2.5 text-body-lg text-text-primary placeholder:text-text-tertiary focus:border-primary outline-none mt-1.5"
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <div className="phone-frame !min-h-0 !shadow-none p-4 bg-surface border-t border-border">
          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`press w-full py-4 min-h-[48px] rounded-lg text-label-lg text-on-primary ${
              canSubmit ? "bg-primary shadow-md" : "bg-text-tertiary"
            }`}
          >
            인증 요청하기
          </button>
        </div>
      </div>

      {/* 가짜 iOS 액션시트: 사진 앱 선택 UI를 최대한 그대로 흉내낸다 */}
      {picker === "sheet" && (
        <div className="fixed inset-0 z-modal bg-scrim flex items-end" onClick={() => setPicker(null)}>
          <div className="phone-frame !min-h-0 !shadow-none p-0" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-up p-3 pb-6 flex flex-col gap-2">
              <div className="bg-surface-raised rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setPicker("gallery")}
                  className="press w-full min-h-[56px] flex items-center justify-center gap-2 text-label-lg text-primary border-b border-border"
                >
                  <Icon name="receipt" size={20} />
                  사진 보관함에서 선택
                </button>
                <button
                  onClick={() => applySample(SAMPLE_RECEIPTS[0])}
                  className="press w-full min-h-[56px] flex items-center justify-center gap-2 text-label-lg text-primary"
                >
                  카메라로 촬영
                </button>
              </div>
              <button
                onClick={() => setPicker(null)}
                className="press w-full min-h-[56px] bg-surface-raised rounded-xl shadow-lg text-label-lg text-text-primary"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 가짜 사진 보관함: 샘플 영수증 3장 중 하나를 고른다 */}
      {picker === "gallery" && (
        <div className="fixed inset-0 z-modal bg-scrim flex items-end">
          <div className="phone-frame !min-h-0 !shadow-none p-0">
            <div className="sheet-up bg-surface-raised rounded-t-xl shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-title-sm text-text-primary">최근 항목</div>
                <button onClick={() => setPicker(null)} className="press tap-target-44 flex items-center justify-center text-text-tertiary" aria-label="닫기">
                  <Icon name="x" size={20} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {SAMPLE_RECEIPTS.map((sr) => {
                  const theme = themeClasses(sr.theme);
                  return (
                    <button
                      key={sr.id}
                      onClick={() => applySample(sr)}
                      className={`press flex flex-col items-center justify-center gap-1 rounded-lg p-3 aspect-square border ${theme.bg} ${theme.border}`}
                    >
                      <Icon name="receipt" size={28} className={theme.ink} />
                      <div className="text-caption-sm text-text-secondary text-center leading-tight">{sr.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 인식 중 스켈레톤. opacity만 애니메이션한다(레이아웃 유발 속성 금지 규칙) */}
      {picker === "reading" && (
        <div className="fixed inset-0 z-modal bg-scrim flex items-center justify-center">
          <div className="bg-surface-raised rounded-xl shadow-lg p-6 flex flex-col items-center gap-3 w-64">
            <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin" />
            <div className="text-label-md text-text-primary">영수증을 읽고 있어요</div>
            <div className="w-full h-2 rounded-full bg-surface-sunken overflow-hidden">
              <div className="h-full w-full bg-primary animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- ReceiptStatus ----------------
function ReceiptStatus() {
  const { state } = useAppState();
  return (
    <div className="phone-frame bg-background pb-28">
      <TopBar title="인증현황" backTo="home" />
      <div className="p-4 flex flex-col gap-3">
        {state.receipts.length === 0 && (
          <div className="text-center text-body-md text-text-tertiary py-16">아직 인증한 영수증이 없어요</div>
        )}
        {state.receipts.map((r) => (
          <div key={r.id} className="bg-surface rounded-xl shadow-md p-4 flex items-center justify-between">
            <div>
              <div className="text-title-sm text-text-primary">{r.merchant}</div>
              <div className="text-caption-md text-text-tertiary mt-1">
                {r.season === "summer" ? "여름" : "겨울"}, {findLabel(CATEGORIES, r.category)}, {findLabel(REGIONS, r.regionId, "name")}{r.payer ? `, ${r.payer}` : ""}
              </div>
              <div className="text-label-lg text-text-primary mt-1.5">
                {Number(r.amount).toLocaleString("ko-KR")}원
              </div>
            </div>
            <span
              className={`text-label-sm px-2.5 py-1.5 min-h-[28px] flex items-center rounded ${
                r.status === "인증완료" ? "bg-primary-subtle text-primary" : "bg-surface-sunken shadow-inner text-text-tertiary"
              }`}
            >
              {r.status === "인증완료" ? "인증완료" : "처리중"}
            </span>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}

// ---------------- RouteMap ----------------
function RouteMap() {
  const { state, tagSpot, derived } = useAppState();
  const [tapped, setTapped] = useState(null);

  return (
    <div className="phone-frame bg-background pb-28">
      <TopBar title="화천 동선" backTo="home" />
      <div className="p-4">
        <div className="bg-surface rounded-xl shadow-sm p-4 text-caption-md text-text-secondary leading-relaxed mb-6">
          영수증 인증은 결제 순간의 위치를 잡아줍니다. 결제가 없는 전망대와 산책로 같은 지점은{" "}
          <span className="text-label-sm text-primary">NFC 태그</span>로 방문을 확인합니다.
        </div>

        {REGIONS.map((region, idx) => {
          const progress = derived.regionProgress.find((r) => r.id === region.id);
          const spots = NFC_SPOTS.filter((s) => s.regionId === region.id);
          return (
            <div key={region.id} className={`bg-surface rounded-xl shadow-md p-4 ${idx > 0 ? "mt-4" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-title-sm text-text-primary">{region.name}</div>
                  <div className="text-caption-md text-text-tertiary">{region.desc}</div>
                </div>
                <Icon name="award" size={24} className={progress && progress.done ? "text-primary" : "text-border-strong"} />
              </div>
              <div className="flex flex-col gap-2">
                {spots.map((spot) => {
                  const done = state.taggedSpots.includes(spot.id);
                  return (
                    <button
                      key={spot.id}
                      onClick={() => {
                        tagSpot(spot.id);
                        setTapped(spot.id);
                        setTimeout(() => setTapped(null), 1500);
                      }}
                      className={`press w-full flex items-center justify-between min-h-[44px] px-3 rounded-lg border ${
                        done ? "border-primary bg-primary-subtle text-primary" : "border-border bg-surface-raised shadow-sm text-text-secondary"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-label-md">
                        <Icon name="pin" size={16} />
                        {spot.name}
                      </span>
                      <span className="text-caption-sm font-medium">
                        {tapped === spot.id ? "태그 완료" : done ? "방문 완료" : "NFC 태그하기"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}

function KpiRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-caption-md text-text-secondary">{label}</span>
      <span className="text-label-md text-text-primary">{value}</span>
    </div>
  );
}

// ---------------- AdminDashboard ----------------
function AdminDashboard() {
  const { state, derived } = useAppState();
  const verified = derived.verified;

  const byRegion = REGIONS.map((r) => ({
    ...r,
    amount: verified.filter((v) => v.regionId === r.id).reduce((s, v) => s + Number(v.amount), 0),
  }));

  // 축제장이 있는 화천 하남권 밖(간동권, 상서 사내권)에서 인증된 소비 비율
  const FESTIVAL_REGION = "hwacheon-hanam";
  const outsideAmount = verified
    .filter((v) => v.regionId !== FESTIVAL_REGION)
    .reduce((s, v) => s + Number(v.amount), 0);
  const outsideRatio = derived.totalVerifiedAmount > 0 ? Math.round((outsideAmount / derived.totalVerifiedAmount) * 100) : 0;

  const stayCount = verified.filter((v) => v.category === "stay").length;

  return (
    <div className="phone-frame bg-background pb-28">
      <TopBar title="대행사 화천군 리포트" backTo="home" />
      <div className="p-4 flex flex-col gap-6">
        <div className="bg-primary text-on-primary rounded-xl shadow-md p-4">
          <div className="text-caption-sm opacity-80">{EVENT.name}</div>
          <div className="text-label-md mt-1">검증 소비 리포트 (실시간, 시연용 가상 데이터)</div>
        </div>

        <div className="bg-surface rounded-xl shadow-md p-5">
          <div className="text-title-sm text-text-primary mb-4">핵심 지표</div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <Stat label="인증 건수" value={verified.length + "건"} />
            <Stat label="총 인증 금액" value={won(derived.totalVerifiedAmount)} />
            <Stat label="축제 권역 밖 소비 비율" value={outsideRatio + "%"} />
            <Stat label="숙박 인증 건수" value={stayCount + "건"} />
          </div>
          <div className="text-caption-sm text-text-tertiary mt-4">
            실제 서비스에서는 더픽트 인증 API 결과를 합산합니다. 지금은 오늘 시연 입력값 기준입니다.
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-md p-5">
          <div className="text-title-sm text-text-primary mb-4">권역별 인증 금액</div>
          {byRegion.map((r, idx) => {
            const frac = derived.totalVerifiedAmount ? r.amount / derived.totalVerifiedAmount : 0;
            return (
              <div key={r.id} className={idx > 0 ? "mt-3" : ""}>
                <div className="flex justify-between text-label-md mb-1.5">
                  <span className="text-text-secondary">{r.name}</span>
                  <span className="text-text-primary">{won(r.amount)}</span>
                </div>
                <div className="w-full h-2.5 rounded-full inset-well overflow-hidden">
                  <div
                    className="h-full w-full bg-primary rounded-full origin-left"
                    style={{ transform: `scaleX(${frac})`, transition: "transform var(--motion-base) var(--motion-standard)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 겨울 영수증, 여름 화천 성과지표. 제안서 성과지표 그대로. 여름 수치는 8월 이후 측정이라
            지금은 비교 기준만 보여주고 값을 지어내지 않는다 */}
        <div className="bg-surface rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-title-sm text-text-primary">겨울에서 여름으로</div>
            <Character name="sani" size={40} />
          </div>

          <div className="text-label-sm text-text-secondary mb-2">여름 보상 선택 (겨울 손님이 원하는 것)</div>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {REWARDS.map((r) => {
              const chosen = derived.targetReward && derived.targetReward.id === r.id;
              const theme = themeClasses(r.theme);
              return (
                <div
                  key={r.id}
                  className={`rounded-lg p-2 flex flex-col items-center text-center ${
                    chosen ? `${theme.bg} shadow-sm` : "bg-surface-sunken shadow-inner"
                  }`}
                >
                  <Character name={r.character} size={36} />
                  <div className="text-caption-sm text-text-secondary mt-1">{r.name}</div>
                  <div className="text-label-md text-text-primary">{chosen ? 1 : 0}명</div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <KpiRow label="겨울 인증 영수증 총액" value={won(derived.winterAmount)} />
            <KpiRow label="여름 인증 영수증 총액" value={won(derived.summerAmount)} />
            <KpiRow label="8월 초 화천 숙박 인증" value={derived.summerVerified.filter((v) => v.category === "stay").length + "건"} />
            <KpiRow label="게이지 100 달성자" value={(derived.achieved ? 1 : 0) + "명"} />
            <KpiRow
              label="묶음 할인 이용"
              value={derived.achieved ? `${state.bundlePurchased.length} / 2건` : "달성자 없음"}
            />
            <KpiRow
              label="겨울 참가자 중 여름 재방문"
              value={derived.winterVerified.length ? `${derived.summerVerified.length ? 1 : 0} / 1명` : "참가자 없음"}
            />
            <div className="text-caption-sm text-text-tertiary">
              비교 기준: 강원 인구감소지역 재방문율 31.9% (연합뉴스 2025.10.13). 위 값은 오늘 시연 입력 기준이고, 보상 없이도 다시 왔을 사람과 구분되지 않아 인과가 아닌 정황 근거다.
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-md p-5">
          <div className="text-title-sm text-text-primary mb-3">카테고리별 인증</div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const count = verified.filter((v) => v.category === c.id).length;
              if (!count) return null;
              return (
                <span key={c.id} className="text-label-sm bg-surface-sunken shadow-inner rounded-lg px-3 py-1.5 text-text-secondary">
                  {c.label} {count}
                </span>
              );
            })}
            {verified.length === 0 && <span className="text-caption-md text-text-tertiary">인증 데이터 없음</span>}
          </div>
        </div>

        {/* 제안서 "영수증 4주, 사장님이 홍보대사" 기준. 가게 계산대에 두는 안내물 미리보기 */}
        <div className="bg-surface rounded-xl shadow-md p-5">
          <div className="text-title-sm text-text-primary mb-1">가게 안내물 미리보기</div>
          <div className="text-caption-md text-text-tertiary mb-4">화천 가게 계산대에 두는 안내물. 사장님이 홍보대사가 된다</div>
          <div className="bg-primary rounded-lg shadow-md p-5 flex items-center gap-4">
            <Character name="dali" size={72} className="shrink-0" />
            <div className="text-on-primary">
              <div className="text-title-md">영수증 버리지 마세요</div>
              <div className="text-title-sm mt-1">여름 숙박권 돼요</div>
              <div className="text-caption-md opacity-90 mt-2">{GAUGE.validWindowLabel} 인증</div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-sm p-5 text-caption-md text-text-secondary leading-relaxed">
          이 리포트는 축제 대행사가 결과보고서와 다음 입찰 제안서에 쓰는 근거 자료입니다. 화천군은 상품권 환급 예산이
          실제로 어느 상권에서 쓰였는지 확인할 수 있습니다.
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
