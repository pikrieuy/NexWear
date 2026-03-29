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
  const [debouncedKw, setDebouncedKw] = useState(localKw);
  const [catFilter, setCatFilter] = useState("all");
  const [sortType, setSortType] = useState("newest");
  const [priceRange, setPriceRange] = useState(1000000);
  const [recentSearches, setRecentSearches] = useState(() => JSON.parse(localStorage.getItem('recentSearches') || '[]'));
  const [showSug, setShowSug] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKw(localKw), 300);
    return () => clearTimeout(timer);
  }, [localKw]);

  useEffect(() => {
    const kwToSave = debouncedKw.trim();
    if (kwToSave && kwToSave.length >= 2) {
      setRecentSearches(prev => {
        const arr = [kwToSave, ...prev.filter(k => k.toLowerCase() !== kwToSave.toLowerCase())].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(arr));
        return arr;
      });
    }
  }, [debouncedKw]);

  const kw = debouncedKw.toLowerCase().trim();
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

  let items = allProducts.filter((p) => {
    const matchCat = catFilter === "all" || p.cat === catFilter;
    const matchKw  = !kw || p.name.toLowerCase().includes(kw) || (p.desc || "").toLowerCase().includes(kw);
    const matchPrice = p.price <= priceRange;
    return matchCat && matchKw && matchPrice;
  });

  const suggestions = localKw.trim() 
    ? Array.from(new Set(allProducts.filter(p => p.name.toLowerCase().includes(localKw.trim().toLowerCase())).map(p => p.name))).slice(0, 5)
    : recentSearches;

  if (sortType === "price_asc") items.sort((a, b) => a.price - b.price);
  else if (sortType === "price_desc") items.sort((a, b) => b.price - a.price);
  else if (sortType === "popular") items.sort((a, b) => (parseInt(b.sold) || 0) - (parseInt(a.sold) || 0));
  else items.sort((a, b) => parseInt(String(b.id).replace(/\D/g, '') || 0) - parseInt(String(a.id).replace(/\D/g, '') || 0));

  return (
    <div className="page-anim">
      <button onClick={() => navigate("home")} style={backBtnStyle}>← KEMBALI</button>

      {/* Search input */}
      <div style={{ margin: "0 12px 16px", position: "relative" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={localKw}
            onChange={(e) => setLocalKw(e.target.value)}
            onFocus={() => setShowSug(true)}
            onBlur={() => setTimeout(() => setShowSug(false), 200)}
            placeholder="Cari produk..."
            autoFocus
            style={{
              flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,245,255,0.3)",
              color: "#fff", fontFamily: "'Share Tech Mono',monospace", fontSize: 13,
              padding: "12px 16px", outline: "none", letterSpacing: 1,
            }}
          />
          {localKw && (
            <button onClick={() => setLocalKw("")} style={{ background: "rgba(255,45,120,0.15)", border: "1px solid rgba(255,45,120,0.4)", color: "var(--pink)", padding: "0 16px", cursor: "pointer", fontSize: 16 }} className="glitch-btn">✕</button>
          )}
        </div>
        
        {/* Autocomplete / Recent Searches Dropdown */}
        {showSug && suggestions.length > 0 && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--mid)", border: "1px solid rgba(0,245,255,0.3)", zIndex: 100, marginTop: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.8)" }}>
            <div style={{ padding: "8px 12px", fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: "rgba(255,255,255,0.3)", borderBottom: "1px solid rgba(255,255,255,0.05)", letterSpacing: 1 }}>
              {localKw.trim() ? "SUGESTI PENCARIAN:" : "PENCARIAN TERAKHIR:"}
            </div>
            {suggestions.map((sug, idx) => (
              <div key={idx} onClick={() => { setLocalKw(sug); setShowSug(false); }}
                style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontFamily: "'Share Tech Mono',monospace", fontSize: 13, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>{localKw.trim() ? "🔍" : "⏱️"}</span> {sug}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Options */}
      <div style={{ margin: "0 12px 16px", display: "flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.02)", padding: "12px 16px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 1, width: 80 }}>MAKS HARGA</div>
        <input 
          type="range" min="10000" max="1500000" step="10000" 
          value={priceRange} onChange={e => setPriceRange(parseInt(e.target.value))}
          style={{ flex: 1, accentColor: "var(--cyan)" }}
        />
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, fontWeight: 700, color: "var(--yellow)", width: 90, textAlign: "right" }}>Rp {new Intl.NumberFormat('id-ID').format(priceRange)}</div>
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 12px 16px" }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>
          {kw ? <>HASIL <span style={{ color: "var(--pink)" }}>"{debouncedKw.toUpperCase()}"</span></> : <>SEMUA <span style={{ color: "var(--pink)" }}>PRODUK</span></>}
          <span style={{ display: "block", fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6, fontWeight: 400 }}>{items.length} produk</span>
        </div>
        <select value={sortType} onChange={(e) => setSortType(e.target.value)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,245,255,0.3)", color: "var(--cyan)", fontFamily: "'Share Tech Mono',monospace", fontSize: 11, padding: "8px 12px", outline: "none", cursor: "pointer" }}>
          <option value="newest" style={{background: "#0a0519"}}>🆕 Terbaru</option>
          <option value="popular" style={{background: "#0a0519"}}>🔥 Terpopuler</option>
          <option value="price_asc" style={{background: "#0a0519"}}>💲 Termurah</option>
          <option value="price_desc" style={{background: "#0a0519"}}>💎 Termahal</option>
        </select>
      </div>

      {items.length === 0
        ? <div>
            <div style={{ margin: "0 12px 24px", padding: 60, textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", fontFamily: "'Press Start 2P',monospace", fontSize: 8, letterSpacing: 1, lineHeight: 2 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              TIDAK ADA HASIL<br />
              <span style={{ fontSize: 7, color: "rgba(255,255,255,0.2)" }}>Coba kata kunci lain</span>
            </div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 900, color: "var(--yellow)", textTransform: "uppercase", letterSpacing: 1, margin: "0 12px 16px" }}>🔥 REKOMENDASI TERLARIS</div>
            <ProductGrid products={[...allProducts].sort((a,b) => (parseInt(b.sold)||0) - (parseInt(a.sold)||0)).slice(0, 6)} navigate={navigate} onAddCart={onAddCart} />
          </div>
        : <ProductGrid products={items} navigate={navigate} onAddCart={onAddCart} />
      }
    </div>
  );
}
