// ─────────────────────────────────────────
//  src/components/BottomNav.jsx
//  Navigasi bawah (mobile-friendly)
// ─────────────────────────────────────────

const NAV_ITEMS = [
  { page: "home",   icon: "🏠", label: "HOME"    },
  { page: "search", icon: "🔍", label: "CARI"    },
  { page: "cart",   icon: null,  label: "CART", center: true },
  { page: "orders", icon: "📋", label: "PESANAN" },
  { page: "seller", icon: "🏪", label: "JUAL"    },
];

export default function BottomNav({ currentPage, navigate, cartCount }) {
  return (
    <nav
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        height: "var(--bh)",
        background: "rgba(5,2,15,0.98)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(0,245,255,0.2)",
        display: "flex", zIndex: 800,
      }}
    >
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.page}
          item={item}
          isActive={currentPage === item.page}
          cartCount={cartCount}
          onClick={() => navigate(item.page)}
        />
      ))}
    </nav>
  );
}

function NavItem({ item, isActive, cartCount, onClick }) {
  const activeColor = "var(--pink)";
  const mutedColor  = "rgba(255,255,255,0.65)";

  if (item.center) {
    return (
      <div
        onClick={onClick}
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
          borderRight: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            width: 44, height: 44, background: "var(--pink)",
            borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 20, marginBottom: -6,
            animation: "pulse-pink 2s infinite", position: "relative",
          }}
        >
          🛒
          {cartCount > 0 && (
            <div
              style={{
                position: "absolute", top: -2, right: -2,
                background: "var(--yellow)", color: "#000",
                fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                minWidth: 16, height: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {cartCount}
            </div>
          )}
        </div>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: mutedColor, letterSpacing: 0.5, marginTop: 4 }}>
          {item.label}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 4,
        cursor: "pointer",
        borderRight: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <span style={{ fontSize: 18, color: isActive ? activeColor : "rgba(255,255,255,0.6)" }}>
        {item.icon}
      </span>
      <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: isActive ? activeColor : mutedColor, letterSpacing: 0.5 }}>
        {item.label}
      </span>
    </div>
  );
}
