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
      <div className="text-caption tracking-widest opacity-90 mb-2">TOWN MICE × 더픽트</div>
      <div className="text-large-title font-bold mb-3">화천 PASS</div>
      <div className="text-callout opacity-90">한 번의 인증으로, 화천을 한 바퀴!</div>
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
        <div className="text-title3 font-semibold">회원가입이 완료되었습니다.</div>
        <div className="text-footnote opacity-90 mt-2">화천 PASS로 이동합니다</div>
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
        <div className="text-title2 font-bold text-text-primary mb-1">로그인</div>
        <div className="text-footnote text-text-tertiary mb-8">화천 PASS, Powered by 더픽트</div>

        {step === "name" ? (
          <div>
            <label className="text-caption text-text-tertiary">이름</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="w-full border-b-2 border-border focus:border-primary outline-none py-3 text-body mt-1"
            />
          </div>
        ) : (
          <div>
            <label className="text-caption text-text-tertiary">휴대폰 번호</label>
            <input
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="휴대폰 번호를 입력해주세요"
              inputMode="numeric"
              className="w-full border-b-2 border-border focus:border-primary outline-none py-3 text-body mt-1"
            />
          </div>
        )}
      </div>
      <div className="p-6">
        <button
          disabled={!canNext}
          onClick={handleNext}
          className={`press w-full py-4 min-h-[44px] rounded-xl font-semibold text-body text-on-primary ${
            canNext ? "bg-primary" : "bg-text-tertiary"
          }`}
        >
          {step === "name" ? "다음" : "시작하기"}
        </button>
        <div className="text-caption text-text-tertiary text-center mt-4">
          로그인하시면 아래 내용에 동의하는 것으로 간주됩니다
          <br />
          <span className="underline">개인정보처리방침</span> <span className="underline">이용약관</span>
        </div>
      </div>
    </div>
  );
}

// ---------------- Home ----------------
function Home() {
  const nav = useNav();
  const { state, derived } = useAppState();
  const { totalVerifiedAmount, neededForStay, hasStayReceipt, completedRegions, regionProgress } = derived;

  const stayProgressFraction = Math.min(1, totalVerifiedAmount / EVENT.thresholdStay);

  return (
    <div className="phone-frame bg-background pb-24">
      <div className="bg-primary text-on-primary px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="text-caption opacity-80">Bill Concert × Town MICE</div>
        <div className="text-title3 font-semibold mt-1">{EVENT.name}</div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-footnote opacity-90">{EVENT.ticketNo}</div>
          <div className="bg-on-primary/20 rounded-full px-3 py-1 text-caption font-semibold">{EVENT.dday}</div>
        </div>
        <div className="text-caption opacity-80 mt-1">{state.user?.name}님 환영합니다</div>
      </div>

      {/* 인증현황 카드. Bill Concert 실제 화면 구조를 그대로 따른다 */}
      <div className="mx-4 -mt-6 bg-surface rounded-2xl shadow-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-subheadline font-semibold text-text-primary">인증현황 ({derived.verified.length})</div>
          <button
            onClick={() => nav.navigate("receiptCategory")}
            className="press min-h-[44px] px-3 bg-primary text-on-primary rounded-full text-footnote font-semibold"
          >
            영수증 인증하기
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Row label="총 인증 금액" value={won(totalVerifiedAmount)} strong />
          <Row label="1박 누적 목표" value={won(EVENT.thresholdStay) + " (가정)"} />
          <Row label="목표까지 남은 금액" value={won(neededForStay)} accent />
        </div>
        <div className="mt-3">
          <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
            {/* width가 아닌 transform: scaleX로 진행률을 표현한다(layout 유발 속성 금지 규칙) */}
            <div
              className="h-full w-full bg-primary origin-left"
              style={{ transform: `scaleX(${stayProgressFraction})`, transition: "transform var(--motion-base) var(--motion-standard)" }}
            />
          </div>
          <div className="text-caption text-text-tertiary mt-1">
            {hasStayReceipt ? "숙박 인증 완료. 1박 코스가 확정됐어요" : "숙박 영수증을 더하면 목표를 쉽게 채워요"}
          </div>
        </div>
      </div>

      {/* 화천 권역 스탬프. 동해사이형 진행 로직을 이식했다 */}
      <div className="mx-4 mt-4 bg-surface rounded-2xl shadow-card p-5">
        <div className="text-subheadline font-semibold text-text-primary mb-3">화천 권역 스탬프 ({completedRegions}/3)</div>
        <div className="grid grid-cols-3 gap-2">
          {regionProgress.map((r) => (
            <div
              key={r.id}
              className={`rounded-xl p-3 text-center border ${
                r.done ? "bg-accent-soft border-accent" : "bg-surface-muted border-border"
              }`}
            >
              <Icon name={r.done ? "award" : "square"} size={20} className={`mx-auto ${r.done ? "text-primary" : "text-text-tertiary"}`} />
              <div className="text-caption font-semibold mt-1 text-text-primary">{r.name}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => nav.navigate("route")}
          className="press w-full mt-3 min-h-[44px] text-footnote text-primary font-semibold border border-primary rounded-lg"
        >
          화천 동선 보러가기
        </button>
      </div>

      <div className="mx-4 mt-4 bg-surface rounded-2xl shadow-card p-5">
        <div className="text-subheadline font-semibold text-text-primary mb-2">내 티켓 보기</div>
        <div className="text-footnote text-text-tertiary">목표 달성 시 다음 시즌 체험과 공연 입장 혜택으로 전환됩니다</div>
      </div>

      <BottomNav />
    </div>
  );
}

// ---------------- ReceiptCategory ----------------
function ReceiptCategory() {
  const nav = useNav();
  return (
    <div className="phone-frame bg-surface pb-24">
      <TopBar title="영수증 인증" backTo="home" />
      <div className="p-5">
        <div className="text-footnote text-text-tertiary mb-1">01</div>
        <div className="text-title3 font-semibold text-text-primary mb-5">지출 카테고리를 선택하세요</div>

        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => nav.navigate("receiptUpload", { categoryId: c.id })}
              className="press border border-border rounded-xl py-4 min-h-[44px] text-subheadline font-semibold text-text-primary hover:border-primary hover:text-primary hover:bg-primary-soft"
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-6 bg-surface-muted rounded-xl p-4 text-footnote text-text-secondary leading-relaxed">
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
    <div className="phone-frame bg-surface pb-28">
      <TopBar title="영수증 인증" backTo="receiptCategory" />

      {showStayNotice && (
        <div className="fixed inset-0 z-modal bg-scrim flex items-end">
          <div className="phone-frame !min-h-0 !shadow-none p-0">
            <div className="bg-surface rounded-t-2xl p-5">
              <div className="text-title3 font-semibold text-text-primary mb-2">잠깐, 추가 자료가 필요할 수 있어요</div>
              <div className="text-subheadline text-text-secondary leading-relaxed mb-4">
                숙박 영수증은 추가 자료가 필요할 수 있어요. 실제 가맹점 주소를 확인할 수 있는 자료를 올려 주세요.
                <br />
                증빙자료: 실제 주소가 기입된 예약 내역, 인보이스, 거래명세서 등
              </div>
              <button
                onClick={() => setShowStayNotice(false)}
                className="press w-full min-h-[44px] bg-primary text-on-primary rounded-xl py-3 text-body font-semibold"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5 space-y-6">
        <div>
          <div className="text-footnote text-text-tertiary mb-1">선택한 카테고리</div>
          <div className="inline-block bg-primary-soft text-primary text-subheadline font-semibold rounded-full px-3 py-1">
            {category.label}
          </div>
        </div>

        <div>
          <div className="text-subheadline font-semibold text-text-primary mb-2">영수증 종류</div>
          <div className="grid grid-cols-2 gap-2">
            {RECEIPT_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`press min-h-[44px] rounded-lg text-subheadline font-medium border ${
                  type === t.id ? "border-primary text-primary bg-primary-soft" : "border-border text-text-secondary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-subheadline font-semibold text-text-primary mb-2">
            방문 권역 (영수증 주소 기준 자동 판정, 오늘은 직접 선택)
          </div>
          <div className="grid grid-cols-1 gap-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRegionId(r.id)}
                className={`press flex items-center justify-between min-h-[44px] px-3 rounded-lg text-subheadline border ${
                  regionId === r.id ? "border-primary bg-primary-soft" : "border-border"
                }`}
              >
                <span className="font-medium text-text-primary">{r.name}</span>
                <span className="text-caption text-text-tertiary">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-caption text-text-tertiary">가맹점명</label>
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="예: 화천전통시장"
              className="w-full border-b-2 border-border focus:border-primary outline-none py-2 mt-1 text-body"
            />
          </div>
          <div>
            <label className="text-caption text-text-tertiary">결제 금액(원)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="예: 35000"
              inputMode="numeric"
              className="w-full border-b-2 border-border focus:border-primary outline-none py-2 mt-1 text-body"
            />
          </div>
        </div>

        <div>
          <div className="text-subheadline font-semibold text-text-primary mb-2">영수증 업로드</div>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl py-8 cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <Icon name="plus" size={24} className="text-text-tertiary" />
            <div className="text-footnote text-text-tertiary mt-2 text-center px-4">
              {fileName || "영수증은 잘 펼쳐서 가려지지 않게 촬영 후 업로드해 주세요"}
            </div>
          </label>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <div className="phone-frame !min-h-0 !shadow-none p-4">
          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={`press w-full py-4 min-h-[44px] rounded-xl font-semibold text-body text-on-primary ${
              canSubmit ? "bg-primary" : "bg-text-tertiary"
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
    <div className="phone-frame bg-background pb-24">
      <TopBar title="인증현황" backTo="home" />
      <div className="p-4 space-y-3">
        {state.receipts.length === 0 && (
          <div className="text-center text-subheadline text-text-tertiary py-16">아직 인증한 영수증이 없어요</div>
        )}
        {state.receipts.map((r) => (
          <div key={r.id} className="bg-surface rounded-xl p-4 shadow-card flex items-center justify-between">
            <div>
              <div className="text-subheadline font-semibold text-text-primary">{r.merchant}</div>
              <div className="text-caption text-text-tertiary mt-1">
                {findLabel(CATEGORIES, r.category)} 지역 {findLabel(REGIONS, r.regionId, "name")}
              </div>
              <div className="text-subheadline font-bold text-text-primary mt-1">
                {Number(r.amount).toLocaleString("ko-KR")}원
              </div>
            </div>
            <span
              className={`text-caption font-semibold px-3 py-1.5 min-h-[28px] flex items-center rounded-full ${
                r.status === "인증완료" ? "bg-accent-soft text-text-primary" : "bg-surface-muted text-text-tertiary"
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
    <div className="phone-frame bg-background pb-24">
      <TopBar title="화천 동선" backTo="home" />
      <div className="p-4">
        <div className="bg-surface rounded-xl p-4 text-footnote text-text-secondary leading-relaxed mb-4">
          영수증 인증은 결제 순간의 위치를 잡아줍니다. 결제가 없는 전망대와 산책로 같은 지점은{" "}
          <span className="font-semibold text-primary">NFC 태그</span>로 방문을 확인합니다.
        </div>

        {REGIONS.map((region) => {
          const progress = derived.regionProgress.find((r) => r.id === region.id);
          const spots = NFC_SPOTS.filter((s) => s.regionId === region.id);
          return (
            <div key={region.id} className="bg-surface rounded-xl p-4 mb-3 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-subheadline font-bold text-text-primary">{region.name}</div>
                  <div className="text-caption text-text-tertiary">{region.desc}</div>
                </div>
                <Icon name="award" size={24} className={progress && progress.done ? "text-primary" : "text-border"} />
              </div>
              <div className="space-y-2 mt-2">
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
                      className={`press w-full flex items-center justify-between min-h-[44px] px-3 rounded-lg border text-subheadline ${
                        done ? "border-accent bg-accent-soft text-text-primary" : "border-border text-text-secondary"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="pin" size={16} />
                        {spot.name}
                      </span>
                      <span className="text-caption font-semibold">
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
    <div className="phone-frame bg-background pb-24">
      <TopBar title="대행사 화천군 리포트" backTo="home" />
      <div className="p-4 space-y-4">
        <div className="bg-primary text-on-primary rounded-xl p-4">
          <div className="text-caption opacity-80">{EVENT.name}</div>
          <div className="text-footnote mt-1 font-semibold">검증 소비 리포트 (실시간, 시연용 가상 데이터)</div>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card">
          <div className="text-subheadline font-semibold text-text-primary mb-3">핵심 지표</div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <Stat label="인증 건수" value={verified.length + "건"} />
            <Stat label="총 인증 금액" value={won(derived.totalVerifiedAmount)} />
            <Stat label="축제 권역 밖 소비 비율" value={outsideRatio + "%"} />
            <Stat label="숙박 인증 건수" value={stayCount + "건"} />
          </div>
          <div className="text-caption text-text-tertiary mt-3">
            실제 서비스에서는 더픽트 인증 API 결과와 NFC 태그 로그를 합산합니다. 지금은 오늘 시연 입력값 기준입니다.
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card">
          <div className="text-subheadline font-semibold text-text-primary mb-3">권역별 인증 금액</div>
          {byRegion.map((r) => {
            const frac = derived.totalVerifiedAmount ? r.amount / derived.totalVerifiedAmount : 0;
            return (
              <div key={r.id} className="mb-2">
                <div className="flex justify-between text-subheadline mb-1">
                  <span className="text-text-secondary">{r.name}</span>
                  <span className="font-semibold text-text-primary">{won(r.amount)}</span>
                </div>
                <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
                  <div
                    className="h-full w-full bg-accent origin-left"
                    style={{ transform: `scaleX(${frac})`, transition: "transform var(--motion-base) var(--motion-standard)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card">
          <div className="text-subheadline font-semibold text-text-primary mb-2">카테고리별 인증</div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const count = verified.filter((v) => v.category === c.id).length;
              if (!count) return null;
              return (
                <span key={c.id} className="text-caption bg-surface-muted rounded-full px-3 py-1 text-text-secondary">
                  {c.label} {count}
                </span>
              );
            })}
            {verified.length === 0 && <span className="text-caption text-text-tertiary">인증 데이터 없음</span>}
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card text-footnote text-text-secondary leading-relaxed">
          이 리포트는 축제 대행사가 결과보고서와 다음 입찰 제안서에 쓰는 근거 자료입니다. 화천군은 상품권 환급 예산이
          실제로 어느 상권에서 쓰였는지 확인할 수 있습니다.
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
