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
    <div className="phone-frame flex flex-col items-center justify-center bg-primary text-on-primary">
      <div className="text-caption-md tracking-widest opacity-90 mb-2">TOWN MICE × 더픽트</div>
      <div className="text-display-lg mb-3">화천 PASS</div>
      <div className="text-body-lg opacity-90">한 번의 인증으로, 화천을 한 바퀴!</div>
      <div className="mt-10 w-8 h-8 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
    </div>
  );
}

// ---------------- Login ----------------
function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("name");
  const { login } = useAppState();
  const nav = useNav();

  const canNext = step === "name" ? name.trim().length > 0 : phone.trim().length >= 9;

  const handleNext = () => {
    if (step === "name") {
      setStep("phone");
      return;
    }
    login(name, phone);
    setStep("done");
    setTimeout(() => nav.replace("home"), 900);
  };

  if (step === "done") {
    return (
      <div className="phone-frame flex flex-col items-center justify-center bg-primary text-on-primary px-8 text-center">
        <Icon name="check" size={48} className="mb-4" />
        <div className="text-title-lg">회원가입이 완료되었습니다.</div>
        <div className="text-body-md opacity-90 mt-2">화천 PASS로 이동합니다</div>
      </div>
    );
  }

  return (
    <div className="phone-frame flex flex-col bg-surface">
      <div className="h-14 flex items-center px-2">
        <button
          onClick={() => (step === "phone" ? setStep("name") : nav.goBack("splash"))}
          className="press tap-target-44 flex items-center justify-center text-text-secondary"
          aria-label="뒤로가기"
        >
          <Icon name="chevronLeft" size={24} />
        </button>
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
              placeholder="이름을 입력해주세요"
              className="w-full bg-surface-sunken shadow-inner border border-border-strong rounded-lg px-4 py-3 text-body-lg text-text-primary placeholder:text-text-tertiary focus:border-primary outline-none mt-2"
            />
          </div>
        ) : (
          <div>
            <label className="text-label-sm text-text-secondary">휴대폰 번호</label>
            <input
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="휴대폰 번호를 입력해주세요"
              inputMode="numeric"
              className="w-full bg-surface-sunken shadow-inner border border-border-strong rounded-lg px-4 py-3 text-body-lg text-text-primary placeholder:text-text-tertiary focus:border-primary outline-none mt-2"
            />
          </div>
        )}
      </div>
      <div className="p-6">
        <button
          disabled={!canNext}
          onClick={handleNext}
          className={`press w-full py-4 min-h-[44px] rounded-lg shadow-md text-label-lg text-on-primary ${
            canNext ? "bg-primary" : "bg-text-tertiary shadow-none"
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
// "겨울 영수증, 여름 화천"(허주은 제안) 구현. 겨울에 쓴 영수증이 게이지로 쌓이고,
// 게이지 100을 채우면 여름 보상 3개 중 하나를 고른다.
function Home() {
  const nav = useNav();
  const { state, derived } = useAppState();
  const { totalVerifiedAmount, gauge, gaugeFraction, rewardUnlocked, amountToThreshold, selectedReward, completedRegions, regionProgress } = derived;

  return (
    <div className="phone-frame bg-background pb-28">
      <div className="bg-primary text-on-primary px-5 pt-6 pb-10 rounded-b-xl shadow-md flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-caption-sm opacity-80">Bill Concert × Town MICE</div>
          <div className="text-title-md mt-1">{EVENT.name}</div>
          <div className="flex items-center gap-2 mt-4">
            <div className="text-body-md opacity-90">{EVENT.ticketNo}</div>
            <div className="bg-on-primary/20 rounded px-2.5 py-1 text-label-sm">{EVENT.dday}</div>
          </div>
          <div className="text-caption-md opacity-80 mt-2">{state.user?.name}님 환영합니다</div>
        </div>
        {/* 천이(산천어): 겨울 산천어축제 단계를 상징 */}
        <Character name="cheoni" size={72} className="shrink-0 -mb-2" />
      </div>

      {/* 겨울 영수증 게이지 카드 */}
      <div className="mx-4 -mt-6 bg-surface rounded-xl shadow-md p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="text-title-sm text-text-primary">겨울 영수증 게이지</div>
          <div className="text-label-md text-primary">
            {gauge}
            <span className="text-caption-md text-text-tertiary"> / {GAUGE.threshold}</span>
          </div>
        </div>
        <div className="text-caption-md text-text-tertiary mb-4">화천 가게 영수증 5만원마다 게이지 12.5 (가정)</div>

        <div className="w-full h-3 rounded-full inset-well overflow-hidden">
          {/* width가 아닌 transform: scaleX로 진행률을 표현한다(layout 유발 속성 금지 규칙) */}
          <div
            className="h-full w-full bg-primary rounded-full origin-left"
            style={{ transform: `scaleX(${gaugeFraction})`, transition: "transform var(--motion-base) var(--motion-standard)" }}
          />
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <Row label="인증한 영수증 합계" value={won(totalVerifiedAmount)} strong />
          <Row
            label={selectedReward ? "받은 여름 보상" : rewardUnlocked ? "여름 보상 열림" : "게이지 100까지 남은 금액"}
            value={selectedReward ? selectedReward.name : rewardUnlocked ? "선택 가능" : won(amountToThreshold)}
            accent
          />
        </div>

        {rewardUnlocked && !selectedReward ? (
          <button
            onClick={() => nav.navigate("reward")}
            className="press w-full mt-4 min-h-[44px] bg-primary text-on-primary rounded-lg shadow-md text-label-lg"
          >
            여름 보상 고르기
          </button>
        ) : (
          <button
            onClick={() => nav.navigate("receiptCategory")}
            className="press w-full mt-4 min-h-[44px] bg-primary text-on-primary rounded-lg shadow-md text-label-lg"
          >
            영수증 인증하기
          </button>
        )}
      </div>

      {/* 여름 화천 보상 미리보기. 게이지가 차기 전에도 무엇을 받는지 보여줘서 동기를 만든다 */}
      <div className="mx-4 mt-8 bg-surface rounded-xl shadow-md p-5">
        <div className="text-title-sm text-text-primary">여름 화천 보상</div>
        <div className="text-caption-md text-text-tertiary mt-1 mb-4">{GAUGE.rewardWindowLabel}</div>
        <div className="grid grid-cols-3 gap-3">
          {REWARDS.map((r) => {
            const isChosen = selectedReward && selectedReward.id === r.id;
            const isBundle = selectedReward && selectedReward.id !== r.id;
            return (
              <div
                key={r.id}
                className={`rounded-lg p-3 flex flex-col items-center text-center border ${
                  isChosen
                    ? "bg-accent-subtle border-accent shadow-sm"
                    : isBundle
                    ? "bg-primary-subtle border-primary"
                    : "bg-surface-sunken shadow-inner border-transparent"
                } ${!rewardUnlocked && !selectedReward ? "opacity-60" : ""}`}
              >
                <Character name={r.character} size={48} />
                <div className="text-label-sm text-text-primary mt-2">{r.name}</div>
                <div className="text-caption-sm text-text-tertiary mt-0.5">
                  {isChosen ? "받음" : isBundle ? "할인가" : rewardUnlocked ? "선택 가능" : "잠김"}
                </div>
              </div>
            );
          })}
        </div>
        {selectedReward && (
          <div className="mt-4 bg-surface-sunken shadow-inner rounded-lg p-3 text-caption-md text-text-secondary leading-relaxed">
            {withObjectParticle(selectedReward.name)} 받았어요. 나머지 두 보상은 묶음 할인가로 열려서 여름에 함께 쓰면 1박 코스가 돼요.
          </div>
        )}
      </div>

      {/* 화천 권역 스탬프. 동해사이형 진행 로직을 이식했다 */}
      <div className="mx-4 mt-8 bg-surface rounded-xl shadow-md p-5">
        <div className="text-title-sm text-text-primary mb-4">화천 권역 스탬프 ({completedRegions}/3)</div>
        <div className="grid grid-cols-3 gap-3">
          {regionProgress.map((r) => (
            <div
              key={r.id}
              className={`rounded-lg p-3 text-center border ${
                r.done ? "bg-accent-subtle border-accent shadow-sm" : "bg-surface-sunken shadow-inner border-transparent"
              }`}
            >
              <Icon name={r.done ? "award" : "square"} size={20} className={`mx-auto ${r.done ? "text-primary" : "text-text-tertiary"}`} />
              <div className="text-label-sm text-text-primary mt-1">{r.name}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => nav.navigate("route")}
          className="press w-full mt-4 min-h-[44px] text-label-md text-primary border border-primary rounded-lg"
        >
          화천 동선 보러가기
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

// ---------------- RewardSelect ----------------
// 게이지 100 달성 후 여름 보상 3개 중 하나를 고른다. 고른 보상은 받고, 나머지 둘은
// 묶음 할인가로 열린다(제안서 원문: "보상 하나를 달성하면 나머지 두 개를 할인가로 구매").
function RewardSelect() {
  const nav = useNav();
  const { selectReward, derived } = useAppState();
  const [pickedId, setPickedId] = useState(null);

  const handleConfirm = () => {
    if (!pickedId) return;
    selectReward(pickedId);
    nav.replace("home");
  };

  return (
    <div className="phone-frame bg-surface pb-32">
      <TopBar title="여름 보상 고르기" backTo="home" />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-6">
          <Character name="sani" size={56} />
          <div>
            <div className="text-title-lg text-text-primary">게이지 100 달성</div>
            <div className="text-caption-md text-text-tertiary mt-1">여름 보상 하나를 고르면 나머지 둘은 할인가로 열려요</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {REWARDS.map((r) => {
            const picked = pickedId === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setPickedId(r.id)}
                className={`press w-full flex items-center gap-4 text-left rounded-lg border p-4 min-h-[44px] ${
                  picked ? "border-primary bg-primary-subtle shadow-md" : "border-border bg-surface-raised shadow-sm"
                }`}
                aria-pressed={picked}
              >
                <Character name={r.character} size={64} className="shrink-0" />
                <div className="min-w-0">
                  <div className="text-title-sm text-text-primary">{r.name}</div>
                  <div className="text-body-md text-text-secondary mt-0.5">{r.desc}</div>
                  <div className="text-caption-md text-text-tertiary mt-1">여름에 다시 와야 하는 이유: {r.reason}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 bg-surface-sunken shadow-inner rounded-lg p-4 text-caption-md text-text-secondary leading-relaxed">
          세 보상 모두 {GAUGE.rewardWindowLabel}에 화천읍 권역에 모여 있어요. 어느 보상을 골라도 여름 화천 1박으로 이어져요.
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <div className="phone-frame !min-h-0 !shadow-none p-4 bg-surface border-t border-border">
          <button
            disabled={!pickedId}
            onClick={handleConfirm}
            className={`press w-full py-4 min-h-[44px] rounded-lg text-label-lg text-on-primary ${
              pickedId ? "bg-primary shadow-md" : "bg-text-tertiary"
            }`}
          >
            이 보상 받기
          </button>
        </div>
      </div>
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
function ReceiptUpload() {
  const nav = useNav();
  const { addReceipt } = useAppState();
  const categoryId = nav.params?.categoryId || CATEGORIES[0].id;
  const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];

  const [type, setType] = useState("");
  const [regionId, setRegionId] = useState("");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [fileName, setFileName] = useState("");
  const [showStayNotice, setShowStayNotice] = useState(category.needsAddressProof);

  const canSubmit = type && regionId && amount && merchant && fileName;
  const inputClass =
    "w-full bg-surface-sunken shadow-inner border border-border-strong rounded-lg px-3 py-2.5 text-body-lg text-text-primary placeholder:text-text-tertiary focus:border-primary outline-none mt-1.5";

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFileName(f.name);
  };

  const handleSubmit = () => {
    addReceipt({
      category: category.id,
      categoryLabel: category.label,
      type,
      regionId,
      amount: Number(amount),
      merchant,
    });
    nav.navigate("receiptStatus");
  };

  return (
    <div className="phone-frame bg-surface pb-32">
      <TopBar title="영수증 인증" backTo="receiptCategory" />

      {showStayNotice && (
        <div className="fixed inset-0 z-modal bg-scrim flex items-end">
          <div className="phone-frame !min-h-0 !shadow-none p-0">
            <div className="bg-surface-raised rounded-t-xl shadow-lg p-6">
              <div className="text-title-sm text-text-primary mb-2">잠깐, 추가 자료가 필요할 수 있어요</div>
              <div className="text-body-md text-text-secondary leading-relaxed mb-5">
                숙박 영수증은 추가 자료가 필요할 수 있어요. 실제 가맹점 주소를 확인할 수 있는 자료를 올려 주세요.
                <br />
                증빙자료: 실제 주소가 기입된 예약 내역, 인보이스, 거래명세서 등
              </div>
              <button
                onClick={() => setShowStayNotice(false)}
                className="press w-full min-h-[44px] bg-primary text-on-primary rounded-lg shadow-md py-3 text-label-lg"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5 space-y-8">
        <div>
          <div className="text-caption-md text-text-tertiary mb-2">선택한 카테고리</div>
          <div className="inline-block bg-primary-subtle text-primary text-label-md rounded-lg px-3 py-1.5">
            {category.label}
          </div>
        </div>

        <div>
          <div className="text-title-sm text-text-primary mb-3">영수증 종류</div>
          <div className="grid grid-cols-2 gap-2">
            {RECEIPT_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`press min-h-[44px] rounded-lg text-label-md border ${
                  type === t.id ? "border-primary text-primary bg-primary-subtle" : "border-border bg-surface-raised text-text-secondary shadow-sm"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-title-sm text-text-primary mb-3">
            방문 권역
          </div>
          <div className="text-caption-md text-text-tertiary -mt-2 mb-3">영수증 주소 기준 자동 판정, 오늘은 직접 선택</div>
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
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-label-sm text-text-secondary">결제 금액(원)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="예: 35000"
              inputMode="numeric"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <div className="text-title-sm text-text-primary mb-3">영수증 업로드</div>
          <label className="flex flex-col items-center justify-center bg-surface-sunken shadow-inner border-2 border-dashed border-border-strong rounded-lg py-8 cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <Icon name="plus" size={24} className="text-text-tertiary" />
            <div className="text-caption-md text-text-tertiary mt-2 text-center px-4">
              {fileName || "영수증은 잘 펼쳐서 가려지지 않게 촬영 후 업로드해 주세요"}
            </div>
          </label>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <div className="phone-frame !min-h-0 !shadow-none p-4 bg-surface border-t border-border">
          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`press w-full py-4 min-h-[44px] rounded-lg text-label-lg text-on-primary ${
              canSubmit ? "bg-primary shadow-md" : "bg-text-tertiary"
            }`}
          >
            인증 요청하기
          </button>
        </div>
      </div>
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
                {findLabel(CATEGORIES, r.category)} 지역 {findLabel(REGIONS, r.regionId, "name")}
              </div>
              <div className="text-label-lg text-text-primary mt-1.5">
                {Number(r.amount).toLocaleString("ko-KR")}원
              </div>
            </div>
            <span
              className={`text-label-sm px-2.5 py-1.5 min-h-[28px] flex items-center rounded ${
                r.status === "인증완료" ? "bg-accent-subtle text-text-primary" : "bg-surface-sunken shadow-inner text-text-tertiary"
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
                        done ? "border-accent bg-accent-subtle text-text-primary" : "border-border bg-surface-raised shadow-sm text-text-secondary"
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

// ---------------- AdminDashboard ----------------
function AdminDashboard() {
  const { derived } = useAppState();
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
            실제 서비스에서는 더픽트 인증 API 결과와 NFC 태그 로그를 합산합니다. 지금은 오늘 시연 입력값 기준입니다.
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
                    className="h-full w-full bg-accent rounded-full origin-left"
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
              const chosen = derived.selectedReward && derived.selectedReward.id === r.id;
              return (
                <div
                  key={r.id}
                  className={`rounded-lg p-2 flex flex-col items-center text-center ${
                    chosen ? "bg-accent-subtle shadow-sm" : "bg-surface-sunken shadow-inner"
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
            <div className="flex items-center justify-between">
              <span className="text-caption-md text-text-secondary">겨울 참가자 중 여름 재방문 비율</span>
              <span className="text-label-sm text-text-tertiary">8월 이후 측정</span>
            </div>
            <div className="text-caption-sm text-text-tertiary -mt-2">비교 기준: 강원 인구감소지역 재방문율 31.9% (연합뉴스 2025.10.13)</div>
            <div className="flex items-center justify-between">
              <span className="text-caption-md text-text-secondary">묶음 할인 이용률</span>
              <span className="text-label-sm text-text-tertiary">8월 이후 측정</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption-md text-text-secondary">게이지 100 달성자</span>
              <span className="text-label-md text-text-primary">{derived.rewardUnlocked ? 1 : 0}명</span>
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

        <div className="bg-surface rounded-xl shadow-sm p-5 text-caption-md text-text-secondary leading-relaxed">
          이 리포트는 축제 대행사가 결과보고서와 다음 입찰 제안서에 쓰는 근거 자료입니다. 화천군은 상품권 환급 예산이
          실제로 어느 상권에서 쓰였는지 확인할 수 있습니다.
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
