const SCREENS = {
  splash: Splash,
  login: Login,
  home: Home,
  receiptCategory: ReceiptCategory,
  receiptUpload: ReceiptUpload,
  receiptStatus: ReceiptStatus,
  route: RouteMap,
  admin: AdminDashboard,
  reward: RewardSelect,
};

function Router() {
  const nav = useNav();
  const Screen = SCREENS[nav.screen] || Splash;
  return <Screen />;
}

function App() {
  return (
    <AppStateProvider>
      <NavProvider>
        <Router />
      </NavProvider>
    </AppStateProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
