// ─────────────────────────────────────────
//  src/components/ProductCard.jsx
//  Card produk reusable untuk semua grid
// ─────────────────────────────────────────

import { fmt, starsStr } from "../utils";

const BADGE_COLORS = {
  "pcb-new": { bg: "var(--cyan)", color: "#000" },
  "pcb-hot": { bg: "var(--pink)", color: "#fff" },
  "pcb-sale": { bg: "var(--yellow)", color: "#000" },
};

export default function ProductCard({ product: p, navigate, onAddCart }) {
  const badge     = BADGE_COLORS[p.badgeClass] || { bg: "#333", color: "#fff" };
  const isSoldOut = p.stock !== undefined && p.stock !== null && p.stock <= 0;

  return (
    <div
      className="product-card"
      onClick={() => navigate("detail", p.id)}
      style={{ background: "var(--card)", cursor: "pointer", opacity: isSoldOut ? 0.85 : 1 }}
    >
      {/* Badge */}
      <div
        style={{
          position: "absolute", top: 6, left: 6,
          fontFamily: "'Press Start 2P', monospace", fontSize: 8,
          padding: "3px 6px",
          background: isSoldOut ? "rgba(80,80,80,0.9)" : badge.bg,
          color: isSoldOut ? "#fff" : badge.color,
          zIndex: 5,
        }}
      >
        {isSoldOut ? "SOLD" : p.badgeText}
      </div>

      {/* Wishlist */}
      <div className="pc-wish" style={{ position: "absolute", top: 6, right: 6, zIndex: 5, fontSize: 14, cursor: "pointer" }}>
        🤍
      </div>

      {/* Visual */}
      <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {/* Background gradient */}
        <div style={{ position: "absolute", inset: 0, background: p.bg }} />
        {/* Scanline overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)", zIndex: 1 }} />
        {/* Grid pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px", zIndex: 1 }} />

        {p.image_url ? (
          <img src={p.image_url} alt={p.name}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 2, transition: "transform 0.3s ease", filter: isSoldOut ? "grayscale(60%)" : "none" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <span style={{ fontSize: 64, display: "block", filter: isSoldOut ? "grayscale(80%) drop-shadow(0 0 10px rgba(255,255,255,0.2))" : "drop-shadow(0 0 20px rgba(255,255,255,0.4))", animation: isSoldOut ? "none" : "float 3s ease-in-out infinite" }}>{p.emoji}</span>
          </div>
        )}

        {/* SOLD OUT overlay */}
        {isSoldOut && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.55)" }}>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 10, color: "#fff", letterSpacing: 2, background: "rgba(80,80,80,0.9)", padding: "8px 14px", border: "1px solid rgba(255,255,255,0.2)" }}>
              SOLD OUT
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div
          style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 700,
            color: isSoldOut ? "rgba(255,255,255,0.5)" : "#fff", letterSpacing: 0.5, marginBottom: 4,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            textTransform: "uppercase",
          }}
        >
          {p.name}
        </div>

        {p.oldPrice > 0 && (
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textDecoration: "line-through", marginBottom: 2 }}>
            Rp {fmt(p.oldPrice)}
          </div>
        )}

        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 900, color: isSoldOut ? "rgba(255,255,255,0.35)" : "var(--yellow)", textDecoration: isSoldOut ? "line-through" : "none", textShadow: isSoldOut ? "none" : "0 0 8px rgba(255,229,0,0.5)" }}>
          Rp {fmt(p.price)}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", letterSpacing: 0.5 }}>{p.sold} terjual</span>
          <span style={{ fontSize: 9, color: "var(--yellow)" }}>{starsStr(p.rating)}</span>
        </div>

        {/* Add to Cart / Sold Out button */}
        <div className="pc-addcart-wrap">
          {isSoldOut ? (
            <div style={{ display: "block", width: "100%", marginTop: 8, fontFamily: "'Press Start 2P', monospace", fontSize: 8, background: "rgba(80,80,80,0.5)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", padding: 7, textAlign: "center", letterSpacing: 1 }}>
              HABIS TERJUAL
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onAddCart(p); }}
              style={{
                display: "block", width: "100%", marginTop: 8,
                fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                background: "var(--pink)", color: "#fff", border: "none",
                padding: 7, cursor: "pointer", letterSpacing: 1,
              }}
            >
              + KERANJANG
            </button>
          )}
        </div>
      </div>
    </div>
  );
}