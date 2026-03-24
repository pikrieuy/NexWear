// ─────────────────────────────────────────
//  src/pages/CategoryPages.jsx
//  FlashSalePage + CategoryPage + SearchPage
// ─────────────────────────────────────────

// ✅ SEMUA import harus di atas — tidak boleh inline di tengah file
import { useState, useEffect } from "react";
import { CATEGORY_MAP } from "../data/products";
import { backBtnStyle } from "../styles/shared";
import ProductGrid from "../components/ProductGrid";

// ─────────────────────────────────────────
//  FlashSalePage
// ─────────────────────────────────────────
export function FlashSalePage({ allProducts, navigate, onAddCart }) {
  const [secs, setSecs] = useState(8 * 3600 + 45 * 60 + 23);
  useEffect(() => { const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(id); }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  const flashItems = allProducts.filter((p) => p.flash);

  return (
    <div className="page-anim">
      <button onClick={() => navigate("home")} style={backBtnStyle}>← KEMBALI</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 12px 16px", padding: 20, background: "var(--card)", border: "1px solid rgba(255,45,120,0.3)" }}>
        <div>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: "var(--yellow)", letterSpacing: 3, marginBottom: 8 }}>⚡ FLASH SALE</div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 28, fontWeight: 900, color: "var(--pink)", textShadow: "0 0 20px rgba(255,45,120,0.5)", textTransform: "uppercase" }}>DISKON GILA-GILAAN</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 8 }}>BERAKHIR DALAM:</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[h, m, s].map((t, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ background: "#1a0030", border: "1px solid rgba(255,45,120,0.4)", color: "var(--yellow)", fontFamily: "'Press Start 2P',monospace", fontSize: 22, padding: "8px 12px" }}>{t}</span>
                {i < 2 && <span style={{ color: "var(--pink)", fontWeight: "bold", fontSize: 28 }}>:</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
      <ProductGrid products={flashItems} navigate={navigate} onAddCart={onAddCart} />
    </div>
  );
}

// ─────────────────────────────────────────
//  CategoryPage
// ─────────────────────────────────────────
export function CategoryPage({ catKey, allProducts, navigate, onAddCart }) {
  const info  = CATEGORY_MAP[catKey] || { title: "KOLEKSI", span: "PRODUK", cat: "all" };
  const items = info.cat === "all" ? allProducts : allProducts.filter((p) => p.cat === info.cat);
  return (
    <div className="page-anim">
      <button onClick={() => navigate("home")} style={backBtnStyle}>← KEMBALI</button>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 24, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 1, margin: "16px 12px 16px" }}>
        {info.title} <span style={{ color: "var(--pink)" }}>{info.span}</span>
      </div>
      {items.length === 0
        ? <div style={{ margin: "0 12px", padding: 40, textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", fontFamily: "'Press Start 2P',monospace", fontSize: 8, letterSpacing: 1, lineHeight: 2 }}>
            Belum ada produk di kategori ini.
          </div>
        : <ProductGrid products={items} navigate={navigate} onAddCart={onAddCart} />
      }
    </div>
  );
}

// ─────────────────────────────────────────
//  SearchPage
// ─────────────────────────────────────────
export function SearchPage({ keyword, allProducts, navigate, onAddCart }) {
  const [localKw,  setLocalKw]  = useState(keyword || "");
  const [catFilter, setCatFilter] = useState("all");

  const kw    = localKw.toLowerCase().trim();
  const CATS  = [
    { k: "all",       l: "🔍 Semua"    },
    { k: "outwear",   l: "🧥 Out Wear" },
    { k: "clothing",  l: "👕 Clothing" },
    { k: "shoes",     l: "👟 Shoes"    },
    { k: "accessory", l: "💍 Accessory"},
    { k: "device",    l: "📱 Device"   },
    { k: "utility",   l: "🛠️ Utility"  },
    { k: "set",       l: "🎁 Set"      },
  ];

  const items = allProducts.filter((p) => {
    const matchCat = catFilter === "all" || p.cat === catFilter;
    const matchKw  = !kw || p.name.toLowerCase().includes(kw) || (p.desc || "").toLowerCase().includes(kw);
    return matchCat && matchKw;
  });

  return (
    <div className="page-anim">
      <button onClick={() => navigate("home")} style={backBtnStyle}>← KEMBALI</button>

      {/* Search input */}
      <div style={{ margin: "0 12px 16px", display: "flex", gap: 8 }}>
        <input
          value={localKw}
          onChange={(e) => setLocalKw(e.target.value)}
          placeholder="Cari produk..."
          autoFocus
          style={{
            flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,245,255,0.3)",
            color: "#fff", fontFamily: "'Share Tech Mono',monospace", fontSize: 13,
            padding: "12px 16px", outline: "none", letterSpacing: 1,
          }}
        />
        {localKw && (
          <button onClick={() => setLocalKw("")} style={{ background: "rgba(255,45,120,0.15)", border: "1px solid rgba(255,45,120,0.4)", color: "var(--pink)", padding: "0 16px", cursor: "pointer", fontSize: 16 }}>✕</button>
        )}
      </div>

      {/* Category filter tabs */}
      <div style={{ display: "flex", gap: 0, margin: "0 12px 16px", overflowX: "auto", scrollbarWidth: "none", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {CATS.map((c) => (
          <div key={c.k} onClick={() => setCatFilter(c.k)}
            style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, padding: "9px 14px", color: catFilter === c.k ? "var(--cyan)" : "rgba(255,255,255,0.6)", cursor: "pointer", borderBottom: catFilter === c.k ? "2px solid var(--cyan)" : "2px solid transparent", whiteSpace: "nowrap", letterSpacing: 1, transition: "all 0.2s" }}>
            {c.l}
          </div>
        ))}
      </div>

      {/* Result header */}
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 1, margin: "0 12px 16px" }}>
        {kw ? <>HASIL <span style={{ color: "var(--pink)" }}>"{localKw.toUpperCase()}"</span></> : <>SEMUA <span style={{ color: "var(--pink)" }}>PRODUK</span></>}
        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 12, fontWeight: 400 }}>{items.length} produk</span>
      </div>

      {items.length === 0
        ? <div style={{ margin: "0 12px", padding: 60, textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", fontFamily: "'Press Start 2P',monospace", fontSize: 8, letterSpacing: 1, lineHeight: 2 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            TIDAK ADA HASIL<br />
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.2)" }}>Coba kata kunci lain</span>
          </div>
        : <ProductGrid products={items} navigate={navigate} onAddCart={onAddCart} />
      }
    </div>
  );
}
