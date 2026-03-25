// ─────────────────────────────────────────
//  src/pages/DetailPage.jsx
//  Halaman detail produk + form ulasan
// ─────────────────────────────────────────

import { useState } from "react";
import { fmt, discPct, starsStr, avgRating, fmtDate } from "../utils";
import { backBtnStyle, labelStyle, qtyBtnStyle } from "../styles/shared";
import Toast from "../components/Toast";

const BADGE_COLORS = {
  "pcb-new":  { bg: "var(--cyan)",   color: "#000" },
  "pcb-hot":  { bg: "var(--pink)",   color: "#fff" },
  "pcb-sale": { bg: "var(--yellow)", color: "#000" },
};

export default function DetailPage({ productId, allProducts, navigate, addToCart, addReview }) {
  const p = allProducts.find((x) => x.id === productId);

  const [qty,     setQty]     = useState(1);
  const [zoomImg, setZoomImg] = useState(false);

  const [selectedStar, setSelectedStar] = useState(0);
  const [reviewName,   setReviewName]   = useState("");
  const [reviewText,   setReviewText]   = useState("");
  const [toast,        setToast]        = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  if (!p) return (
    <div className="page-anim" style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
      Produk tidak ditemukan
    </div>
  );

  const avg  = avgRating(p.reviews);
  const disc  = discPct(p.price, p.oldPrice);
  const badge = BADGE_COLORS[p.badgeClass] || { bg: "#333", color: "#fff" };
  const isSoldOut = p.stock !== undefined && p.stock !== null && p.stock <= 0;

  const handleAddCart = () => {
    addToCart(p, "", "", qty);
    showToast(`✓ ${p.name} ditambahkan ke keranjang!`);
  };

  const handleBuyNow = () => {
    addToCart(p, "", "", qty);
    navigate("address");
  };

  const handleSubmitReview = () => {
    if (!selectedStar)         { showToast("⚠️ Pilih rating bintang dulu!"); return; }
    if (!reviewName.trim())    { showToast("⚠️ Masukkan nama kamu!"); return; }
    if (!reviewText.trim())    { showToast("⚠️ Tulis ulasanmu dulu!"); return; }

    addReview(p.id, {
      author: reviewName.trim(),
      star:   selectedStar,
      text:   reviewText.trim(),
      date:   fmtDate(),
    });

    setSelectedStar(0); setReviewName(""); setReviewText("");
    showToast("✓ Ulasan berhasil dikirim!");
  };

  return (
    <div className="page-anim">
      <Toast msg={toast} />

      {/* Lightbox */}
      {zoomImg && (
        <div
          onClick={() => setZoomImg(false)}
          style={{ position: "fixed", inset: 0, zIndex: 3000, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}
        >
          <img src={p.image_url} alt={p.name} style={{ maxWidth: "85vw", maxHeight: "85vh", objectFit: "contain", boxShadow: "0 0 60px rgba(0,245,255,0.2)" }} />
          <div style={{ position: "absolute", top: 20, right: 24, fontSize: 28, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>✕</div>
        </div>
      )}

      <button onClick={() => navigate("home")} style={backBtnStyle}>← KEMBALI</button>

      {/* ── Main Detail ── */}
      <div className="detail-layout" style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: 32, padding: "24px 24px 0" }}>

        {/* LEFT: Visual */}
        <div>
          <div style={{ height: 380, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", border: "1px solid rgba(0,245,255,0.2)" }}>
            <div style={{ position: "absolute", inset: 0, background: p.bg }} />
            {/* Scanline */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)", zIndex: 1 }} />
            {/* SOLD OUT overlay */}
            {isSoldOut && (
              <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }}>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 14, color: "#fff", letterSpacing: 3, background: "rgba(60,60,60,0.95)", padding: "12px 24px", border: "1px solid rgba(255,255,255,0.2)" }}>
                  SOLD OUT
                </div>
              </div>
            )}
            {/* Grid */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px", zIndex: 1 }} />
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.name}
                onClick={() => setZoomImg(true)}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 2, cursor: "zoom-in" }}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                <span style={{ fontSize: 100, display: "block", filter: "drop-shadow(0 0 30px rgba(255,255,255,0.35))", animation: "float 3s ease-in-out infinite" }}>{p.emoji}</span>
              </div>
            )}
          </div>
          {/* Bonus Banner */}
          {p.bonus?.length > 0 && (
            <div style={{ marginTop: 12, background: "linear-gradient(135deg,#1a0040,#3d0010)", border: "1px solid rgba(255,45,120,0.4)", padding: 14, animation: "pulse-pink 3s infinite" }}>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: "var(--yellow)", marginBottom: 8, letterSpacing: 1 }}>🎁 BONUS DARI SELLER</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", lineHeight: 1.8 }}>{p.bonus.map((b) => `✓ ${b}`).join("\n")}</div>
            </div>
          )}
        </div>

        {/* RIGHT: Info */}
        <div>
          <div style={{ display: "inline-block", fontFamily: "'Press Start 2P',monospace", fontSize: 7, padding: "4px 10px", marginBottom: 10, background: badge.bg, color: badge.color }}>{p.badgeText}</div>
          <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 24, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{p.name}</h1>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", letterSpacing: 1, marginBottom: 12 }}>SKU: {p.id.toUpperCase()}-2077 · NEXWEAR</div>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 14, color: "var(--yellow)" }}>{avg ? starsStr(parseFloat(avg)) : "☆☆☆☆☆"}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5, marginTop: 2 }}>{avg ? `${avg} · ${p.reviews.length} ulasan` : "0 ulasan"}</span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 28, fontWeight: 900, color: "var(--yellow)", textShadow: "0 0 16px rgba(255,229,0,0.5)" }}>Rp {fmt(p.price)}</div>
            {p.oldPrice > 0 && (
              <>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>Rp {fmt(p.oldPrice)}</div>
                <div style={{ background: "var(--pink)", color: "#fff", fontFamily: "'Press Start 2P',monospace", fontSize: 8, padding: "4px 8px" }}>-{disc}%</div>
              </>
            )}
          </div>

          {p.flash && (
            <div style={{ background: "rgba(255,45,120,0.08)", border: "1px solid rgba(255,45,120,0.2)", padding: "10px 14px", marginBottom: 16, fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: "var(--pink)", letterSpacing: 1 }}>
              ⚡ FLASH SALE · BERAKHIR HARI INI
            </div>
          )}

          {/* Desc */}
          <div style={{ marginBottom: 14 }}>
            <span style={labelStyle}>DESKRIPSI PRODUK</span>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, letterSpacing: 0.3 }}>{p.desc}</div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "14px 0" }} />

          {/* Quantity */}
          <span style={labelStyle}>JUMLAH</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtnStyle}>−</button>
            <input value={qty} readOnly style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "'Orbitron',monospace", fontSize: 14, fontWeight: 700, width: 52, textAlign: "center", height: 32 }} />
            <button onClick={() => setQty((q) => Math.min(99, q + 1))} style={qtyBtnStyle}>+</button>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", letterSpacing: 0.5, marginLeft: 8 }}>Stok: {p.stock || 247}</span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {isSoldOut ? (
              <div style={{ flex: 1, fontFamily: "'Press Start 2P',monospace", fontSize: 10, background: "rgba(60,60,60,0.5)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)", padding: 14, textAlign: "center", letterSpacing: 2 }}>
                STOK HABIS
              </div>
            ) : (
              <>
                <button onClick={handleAddCart} style={{ flex: 1, fontFamily: "'Press Start 2P',monospace", fontSize: 8, background: "transparent", border: "2px solid var(--cyan)", color: "var(--cyan)", padding: 14, cursor: "pointer", letterSpacing: 1 }}>+ KERANJANG</button>
                <button onClick={handleBuyNow}  style={{ flex: 1, fontFamily: "'Press Start 2P',monospace", fontSize: 8, background: "var(--pink)", border: "2px solid var(--pink)", color: "#fff", padding: 14, cursor: "pointer", letterSpacing: 1, animation: "pulse-pink 2s infinite" }}>BELI SEKARANG</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      <ReviewsSection product={p} avg={avg} selectedStar={selectedStar} setSelectedStar={setSelectedStar} reviewName={reviewName} setReviewName={setReviewName} reviewText={reviewText} setReviewText={setReviewText} onSubmit={handleSubmitReview} />
    </div>
  );
}

function ReviewsSection({ product: p, avg, selectedStar, setSelectedStar, reviewName, setReviewName, reviewText, setReviewText, onSubmit }) {
  return (
    <div style={{ padding: "32px 24px", borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 24 }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 18, fontWeight: 900, color: "#fff", textTransform: "uppercase" }}>⭐ ULASAN PRODUK</div>
        {avg && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 40, fontWeight: 900, color: "var(--yellow)" }}>{avg}</span>
            <div>
              <div style={{ fontSize: 18, color: "var(--yellow)", marginBottom: 2 }}>{starsStr(parseFloat(avg))}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>{p.reviews.length} ulasan</div>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <div style={{ background: "var(--card)", border: "1px solid rgba(0,245,255,0.15)", padding: 20, marginBottom: 20 }}>
        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: "var(--cyan)", letterSpacing: 2, marginBottom: 14 }}>✏️ TULIS ULASAN</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="star-pick" onClick={() => setSelectedStar(n)} style={{ fontSize: 28, color: n <= selectedStar ? "var(--yellow)" : "rgba(255,255,255,0.2)" }}>★</span>
          ))}
        </div>
        <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Nama kamu..." maxLength={40}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'Share Tech Mono',monospace", fontSize: 12, padding: "10px 14px", marginBottom: 10, outline: "none" }} />
        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Bagikan pengalamanmu..." rows={3} maxLength={400}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'Share Tech Mono',monospace", fontSize: 12, padding: "10px 14px", marginBottom: 10, outline: "none", resize: "vertical" }} />
        <button onClick={onSubmit} style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, background: "var(--pink)", border: "none", color: "#fff", padding: "10px 20px", cursor: "pointer", letterSpacing: 1, animation: "pulse-pink 2s infinite" }}>KIRIM ULASAN →</button>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {p.reviews.length === 0
          ? <div style={{ padding: 20, textAlign: "center", color: "rgba(255,255,255,0.3)", fontFamily: "'Press Start 2P',monospace", fontSize: 7, letterSpacing: 1 }}>BELUM ADA ULASAN. JADILAH YANG PERTAMA!</div>
          : [...p.reviews].reverse().map((r, i) => (
            <div key={i} style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.07)", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 10, fontWeight: 700, color: "var(--cyan)" }}>{r.author}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>{r.date}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--yellow)", marginBottom: 6 }}>{starsStr(r.star)}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, letterSpacing: 0.5 }}>{r.text}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}