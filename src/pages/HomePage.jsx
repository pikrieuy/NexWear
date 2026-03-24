// ─────────────────────────────────────────
//  src/pages/HomePage.jsx
//  Halaman utama: hero, kategori, rekomendasi
// ─────────────────────────────────────────

import { useState, useEffect, useMemo } from "react";
import { CAT_ITEMS } from "../data/products";
import { fmt, discPct } from "../utils";
import ProductGrid from "../components/ProductGrid";
import SkeletonGrid from "../components/SkeletonGrid";

/* ── Countdown Hook ── */
function useCountdown(initialSecs) {
  const [secs, setSecs] = useState(initialSecs);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return [h, m, s];
}

/* ── Slides Data ── */
const SLIDES = [
  { bg:"linear-gradient(135deg,#05020f,#2a0060,#3d0020)", eye:"// NEW ARRIVAL 2077 //", title:"NEXWEAR\nCOLLECTION", sub:"FASHION · PIXEL ART · FUTURE STYLE", cta:"BELANJA SEKARANG →", ctaPage:"newarrivals", titleColor:"#fff", ctaBg:"var(--pink)", deco:"✨" },
  { bg:"linear-gradient(135deg,#001530,#003a60,#001a40)", eye:"// PROMO SPESIAL //",    title:"DISKON 40%",            sub:"OUT WEAR · CLOTHING · ACCESSORIES",  cta:"KLAIM DISKON →",    ctaPage:"sale",        titleColor:"var(--cyan)",   ctaBg:"var(--cyan)",   deco:"🛍️" },
  { bg:"linear-gradient(135deg,#100020,#3d0060,#200050)", eye:"// CYBER EDITION //",   title:"CYBER\nFASHION",        sub:"LIMITED · EXCLUSIVE · PIXEL STYLE",  cta:"LIHAT KOLEKSI →",  ctaPage:"clothing",    titleColor:"var(--purple)", ctaBg:"var(--purple)", deco:"🦋" },
];

export default function HomePage({ allProducts, navigate, onAddCart }) {
  const [slide, setSlide] = useState(0);
  const [filter, setFilter] = useState("all");
  const [h, m, s] = useCountdown(8 * 3600 + 45 * 60 + 23);

  // Auto-advance carousel
  useEffect(() => {
    const id = setInterval(() => setSlide((c) => (c + 1) % 3), 4000);
    return () => clearInterval(id);
  }, []);


  const filteredProducts = useMemo(() => {
    let list = [...allProducts];
    if (filter === "terlaris")   list.sort((a, b) => parseFloat(b.sold) - parseFloat(a.sold));
    if (filter === "terbaru")    list = list.filter((p) => p.badgeText === "NEW").concat(list.filter((p) => p.badgeText !== "NEW"));
    if (filter === "harga-asc")  list.sort((a, b) => a.price - b.price);
    if (filter === "harga-desc") list.sort((a, b) => b.price - a.price);
    if (filter === "rating")     list = list.filter((p) => p.rating === 5).concat(list.filter((p) => p.rating !== 5));
    return list;
  }, [allProducts, filter]);

  const cur = SLIDES[slide];

  return (
    <div className="page-anim">
      {/* ── Hero ── */}
      <HeroBanner cur={cur} slide={slide} setSlide={setSlide} navigate={navigate} />

      {/* ── Category Strip ── */}
      <CategoryStrip navigate={navigate} />

      {/* ── Mini Banners ── */}
      <MiniBanners />


      {/* ── Rekomendasi ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 12px 8px" }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 900, color: "#fff", textTransform: "uppercase" }}>
          REKOMENDASI <span style={{ color: "var(--pink)" }}>UNTUK KAMU</span>
        </div>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "var(--cyan)", cursor: "pointer" }}>LIHAT SEMUA &gt;</div>
      </div>

      {/* Filter Tabs */}
      <FilterTabs filter={filter} setFilter={setFilter} />

      {/* Product Grid */}
      {filteredProducts.length === 0
        ? <SkeletonGrid count={10} />
        : <ProductGrid products={filteredProducts} navigate={navigate} onAddCart={onAddCart} />
      }

      {/* Footer */}
      <SiteFooter navigate={navigate} />
    </div>
  );
}

/* ────────────────────────────────────────
   SUB-COMPONENTS
──────────────────────────────────────── */

function HeroBanner({ cur, slide, setSlide, navigate }) {
  return (
    <div style={{ display: "flex", gap: 4, padding: "12px 12px 0" }}>
      {/* Main Slide */}
      <div style={{ flex: 1, position: "relative", height: 260, overflow: "hidden", border: "1px solid rgba(0,245,255,0.2)", cursor: "pointer" }}>
        <div style={{ position: "absolute", inset: 0, background: cur.bg, transition: "background 0.5s" }} />
        <div style={{ position: "relative", zIndex: 2, padding: 32, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: "var(--yellow)", letterSpacing: 3, marginBottom: 12, display: "block" }}>{cur.eye}</span>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "clamp(22px,4vw,42px)", fontWeight: 900, lineHeight: 1, color: cur.titleColor, letterSpacing: -1, animation: "rgb-shift 3s infinite", marginBottom: 8, whiteSpace: "pre-line" }}>{cur.title}</h1>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 2, marginBottom: 20 }}>{cur.sub}</p>
          <button onClick={() => navigate(cur.ctaPage)} style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, background: cur.ctaBg, color: cur.titleColor === "var(--cyan)" ? "#000" : "#fff", border: "none", padding: "10px 20px", cursor: "pointer", letterSpacing: 1, animation: "pulse-pink 2s infinite", width: "fit-content" }}>{cur.cta}</button>
        </div>
        <div style={{ position: "absolute", right: 30, top: "50%", transform: "translateY(-50%)", fontSize: 80, animation: "float 3s ease-in-out infinite", filter: "drop-shadow(0 0 20px rgba(255,45,120,0.6))", zIndex: 2 }}>{cur.deco}</div>
        {/* Dots */}
        <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 3 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 18 : 6, height: 6, background: i === slide ? "var(--pink)" : "rgba(255,255,255,0.3)", cursor: "pointer", transition: "all 0.2s" }} />
          ))}
        </div>
      </div>
      {/* Side Panels */}
      <div className="hero-side" style={{ display: "flex", flexDirection: "column", gap: 4, width: 180, flexShrink: 0 }}>
        {[{ bg: "linear-gradient(135deg,#1a0040,#3d0060)", icon: "🔥", label: "NEW ARRIVALS", sub: "TERBARU", page: "newarrivals" },
          { bg: "linear-gradient(135deg,#001a30,#003060)", icon: "🎁", label: "BUNDLE SET",  sub: "HEMAT LEBIH",  page: "bundle" }].map((sp) => (
          <div key={sp.page} onClick={() => navigate(sp.page)} style={{ flex: 1, position: "relative", overflow: "hidden", cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <div style={{ position: "absolute", inset: 0, background: sp.bg }} />
            <span style={{ fontSize: 32, animation: "float 3s ease-in-out infinite", position: "relative", zIndex: 1 }}>{sp.icon}</span>
            <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: "#fff", letterSpacing: 1, position: "relative", zIndex: 1 }}>{sp.label}</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1, position: "relative", zIndex: 1 }}>{sp.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryStrip({ navigate }) {
  return (
    <div className="cat-strip" style={{ display: "grid", gridTemplateColumns: "repeat(9,1fr)", margin: "12px 12px 0", background: "var(--card)", border: "1px solid rgba(0,245,255,0.12)", padding: "16px 8px" }}>
      {CAT_ITEMS.map((c, i) => (
        <div key={i} className="cat-item" onClick={() => c.page && navigate(c.page)}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: c.page ? "pointer" : "default", padding: "8px 4px" }}>
          <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(0,245,255,0.07)", border: "1px solid rgba(0,245,255,0.15)", transition: "all 0.2s" }}>
            <span className="cat-icon" style={{ fontSize: 22, filter: "drop-shadow(0 0 6px rgba(0,245,255,0.5))" }}>{c.icon}</span>
          </div>
          <span className="cat-label" style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 13, color: "rgba(255,255,255,0.7)", textAlign: "center", letterSpacing: 0.5 }}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

function MiniBanners() {
  const banners = [
    { bg: "linear-gradient(135deg,#1a0040,#ff2d78)", icon: "🎯", label: "CASHBACK 25%",  sub: "Min. Belanja 200rb" },
    { bg: "linear-gradient(135deg,#001a40,#00f5ff)", icon: "🚀", label: "FREE ONGKIR",   sub: "Setiap Hari"       },
    { bg: "linear-gradient(135deg,#200050,#b400ff)", icon: "🏷️", label: "FLASH SALE",    sub: "Tiap Jam 12 & 20" },
    { bg: "linear-gradient(135deg,#1a1000,#ffe500)", icon: "🏆", label: "TOP BRAND",     sub: "Produk Terpilih"  },
  ];
  return (
    <div className="mini-banners" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, margin: "12px 12px 0" }}>
      {banners.map((b, i) => (
        <div key={i} style={{ position: "relative", height: 90, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
          <div style={{ position: "absolute", inset: 0, background: b.bg }} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <span style={{ fontSize: 26, display: "block", marginBottom: 4 }}>{b.icon}</span>
            <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: "#fff", letterSpacing: 1, textShadow: "0 0 8px rgba(0,0,0,0.8)", display: "block" }}>{b.label}</span>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "rgba(255,255,255,0.55)", letterSpacing: 1, marginTop: 3, display: "block" }}>{b.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FilterTabs({ filter, setFilter }) {
  const TABS = [
    { k: "all",        l: "SEMUA"    },
    { k: "terlaris",   l: "TERLARIS" },
    { k: "terbaru",    l: "TERBARU"  },
    { k: "harga-asc",  l: "HARGA ↑"  },
    { k: "harga-desc", l: "HARGA ↓"  },
    { k: "rating",     l: "RATING ⭐" },
  ];
  return (
    <div style={{ display: "flex", gap: 0, margin: "0 12px", overflowX: "auto", scrollbarWidth: "none", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      {TABS.map((tab) => (
        <div
          key={tab.k}
          onClick={() => setFilter(tab.k)}
          style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 12, padding: "10px 16px",
            color: filter === tab.k ? "var(--pink)" : "rgba(255,255,255,0.7)",
            cursor: "pointer",
            borderBottom: filter === tab.k ? "2px solid var(--pink)" : "2px solid transparent",
            whiteSpace: "nowrap", letterSpacing: 0.5, transition: "all 0.2s",
          }}
        >
          {tab.l}
        </div>
      ))}
    </div>
  );
}

function SiteFooter({ navigate }) {
  const COLS = [
    { h: "Kategori",  links: ["Out Wear", "Accessory", "Device", "Utility", "Clothing", "Shoes", "Set", "New Arrivals", "Sale"] },
    { h: "Layanan",   links: ["Size Guide", "Lacak Pesanan", "Return & Refund", "Live Chat", "FAQ"] },
    { h: "Ikuti Kami",links: ["Instagram", "TikTok", "Pinterest", "Shopee Official", "Tokopedia"] },
  ];
  return (
    <footer style={{ margin: "32px 12px 0", background: "var(--card)", border: "1px solid rgba(0,245,255,0.1)", padding: 32 }}>
      <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 24 }}>
        <div>
          <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 14, color: "var(--cyan)", textShadow: "0 0 10px var(--cyan)", display: "block", marginBottom: 12 }}>NEX<em style={{ color: "var(--pink)", fontStyle: "normal" }}>WEAR</em></span>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, letterSpacing: 0.5, marginBottom: 14 }}>Fashion dari masa depan. Dibuat untuk mereka yang berani tampil beda di alam semesta gaya.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["SSL", "VISA", "GOPAY", "OVO", "COD"].map((b) => (
              <span key={b} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: "rgba(255,255,255,0.5)", padding: "4px 8px" }}>{b}</span>
            ))}
          </div>
        </div>
        {COLS.map((col) => (
          <div key={col.h}>
            <h4 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, fontWeight: 700, color: "var(--cyan)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{col.h}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {col.links.map((l) => <li key={l}><a href="#" style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: 0.5 }}>{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>
        <p>© 2077 NEXWEAR · ALL RIGHTS RESERVED</p>
        <p>POWERED BY PIXEL TECHNOLOGY ⚡</p>
      </div>
    </footer>
  );
}