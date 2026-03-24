// ─────────────────────────────────────────
//  src/components/Header.jsx
//  Header sticky: logo, search, icon, nav tabs
// ─────────────────────────────────────────

import { NAV_TABS } from "../data/products";

export default function Header({ currentPage, navigate, cartCount, searchVal, setSearchVal, user, onLogout }) {
  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 800,
        background: "rgba(5,2,15,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,245,255,0.25)",
      }}
    >
      <TopBar navigate={navigate} user={user} onLogout={onLogout} />
      <MainBar navigate={navigate} cartCount={cartCount} searchVal={searchVal} setSearchVal={setSearchVal} />
      <NavTabs currentPage={currentPage} navigate={navigate} />
    </header>
  );
}

/* ── Top Bar ── */
function TopBar({ navigate, user, onLogout }) {
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div
      style={{
        background: "linear-gradient(90deg,#1a0040,#3d0010,#001a40)",
        padding: "7px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 10, letterSpacing: "1.5px", color: "rgba(255,255,255,0.55)",
      }}
    >
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <span onClick={() => navigate("seller")} style={{ cursor: "pointer" }}>// Seller Center</span>
        <span>·</span>
        <span style={{ cursor: "pointer" }}>Download App</span>
        <span>·</span>
        <span onClick={() => navigate("orders")} style={{ cursor: "pointer" }}>Lacak Pesanan</span>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span style={{ color: "var(--yellow)" }}>★ Free Ongkir</span>
        <span onClick={() => navigate("flash")} style={{ cursor: "pointer" }}>Promo Hari Ini</span>

        {/* Separator */}
        <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>

        {/* User info */}
        {user && (
          <>
            <span onClick={() => navigate("profile")} style={{ color: "var(--neon-cyan, #00f5ff)", letterSpacing: 1, cursor: "pointer" }}>
              👤 {displayName}
            </span>
            <button
              onClick={onLogout}
              style={{
                fontFamily:    "'Press Start 2P', monospace",
                fontSize:      9,
                background:    "transparent",
                border:        "1px solid rgba(255,45,120,0.4)",
                color:         "var(--pink, #ff2d78)",
                padding:       "4px 10px",
                cursor:        "pointer",
                letterSpacing: 1,
                transition:    "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,45,120,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
            >
              LOGOUT
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main Bar ── */
function MainBar({ navigate, cartCount, searchVal, setSearchVal }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 24px" }}>
      {/* Logo */}
      <div className="logo" onClick={() => navigate("home")}>
        NEX<em>WEAR</em>
      </div>

      {/* Search */}
      <div
        style={{
          flex: 1, display: "flex", height: 46,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(0,245,255,0.35)",
        }}
      >
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && navigate("search")}
          placeholder="CARI BAJU, SEPATU, AKSESORIS..."
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "#fff", fontFamily: "'Share Tech Mono', monospace",
            fontSize: 13, padding: "0 16px", letterSpacing: 1,
          }}
        />
        <button
          onClick={() => navigate("search")}
          style={{
            background: "var(--pink)", border: "none", padding: "0 24px",
            cursor: "pointer", fontFamily: "'Press Start 2P', monospace",
            fontSize: 9, color: "#fff", letterSpacing: 1, whiteSpace: "nowrap",
          }}
        >
          [ CARI ]
        </button>
      </div>

      {/* Icons */}
      <div style={{ display: "flex", gap: 24, alignItems: "center", flexShrink: 0 }}>
        <HeaderIcon icon="🛒" badge={cartCount} label="CART" onClick={() => navigate("cart_panel")} />
      </div>
    </div>
  );
}

function HeaderIcon({ icon, badge, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative", cursor: "pointer", fontSize: 22,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      }}
    >
      {icon}
      {badge > 0 && (
        <div
          style={{
            position: "absolute", top: -4, right: -6,
            background: "var(--pink)",
            fontFamily: "'Press Start 2P', monospace", fontSize: 7,
            minWidth: 18, height: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "pulse-pink 2s infinite",
          }}
        >
          {badge}
        </div>
      )}
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: 0.5 }}>
        {label}
      </span>
    </div>
  );
}

/* ── Nav Tabs ── */
function NavTabs({ currentPage, navigate }) {
  return (
    <nav style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.07)", overflowX: "auto", scrollbarWidth: "none" }}>
      {NAV_TABS.map((t) => (
        <div
          key={t.page}
          onClick={() => navigate(t.page)}
          className="nav-tab"
          style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: 13,
            color: currentPage === t.page ? "var(--pink)" : "rgba(255,255,255,0.75)",
            padding: "13px 18px", whiteSpace: "nowrap", cursor: "pointer",
            borderBottom: currentPage === t.page ? "2px solid var(--pink)" : "2px solid transparent",
            background: currentPage === t.page ? "rgba(255,45,120,0.04)" : "transparent",
            transition: "all 0.2s", letterSpacing: 0.5,
          }}
        >
          {t.label}
        </div>
      ))}
    </nav>
  );
}