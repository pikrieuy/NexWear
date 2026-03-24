// ─────────────────────────────────────────
//  src/pages/OtherPages.jsx
// ─────────────────────────────────────────
import { useState } from "react";
import { fmt } from "../utils";
import { backBtnStyle } from "../styles/shared";
import ProductFormModal from "../components/ProductFormModal";
import Toast from "../components/Toast";

const STATUS_STYLE = {
  Dikemas:  { bg: "rgba(255,229,0,0.15)", color: "var(--yellow)", border: "rgba(255,229,0,0.3)" },
  Dikirim:  { bg: "rgba(0,245,255,0.1)",  color: "var(--cyan)",   border: "rgba(0,245,255,0.3)" },
  Selesai:  { bg: "rgba(0,200,100,0.1)",  color: "#00c864",       border: "rgba(0,200,100,0.3)" },
  diproses: { bg: "rgba(255,229,0,0.15)", color: "var(--yellow)", border: "rgba(255,229,0,0.3)" },
  dikirim:  { bg: "rgba(0,245,255,0.1)",  color: "var(--cyan)",   border: "rgba(0,245,255,0.3)" },
  selesai:  { bg: "rgba(0,200,100,0.1)",  color: "#00c864",       border: "rgba(0,200,100,0.3)" },
};

// ─────────────────────────────────────────
//  OrdersPage
// ─────────────────────────────────────────
export function OrdersPage({ orders, cancelOrder, completeOrder, navigate }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? orders
    : orders.filter((o) => (o.status || "").toLowerCase() === filter.toLowerCase());

  return (
    <div className="page-anim">
      <button onClick={() => navigate("home")} style={backBtnStyle}>← KEMBALI</button>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 2, margin: "0 12px 20px" }}>
        LACAK <span style={{ color: "var(--pink)" }}>PESANAN</span>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 0, margin: "0 12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {[{ k: "all", l: "SEMUA" }, { k: "Dikemas", l: "DIKEMAS" }, { k: "Dikirim", l: "DIKIRIM" }, { k: "Selesai", l: "SELESAI" }].map((t) => (
          <div key={t.k} onClick={() => setFilter(t.k)}
            style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, padding: "10px 16px", color: filter === t.k ? "var(--pink)" : "rgba(255,255,255,0.65)", cursor: "pointer", borderBottom: filter === t.k ? "2px solid var(--pink)" : "2px solid transparent", letterSpacing: 1, transition: "all 0.2s" }}>
            {t.l}
          </div>
        ))}
      </div>

      <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0
          ? <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)", fontFamily: "'Press Start 2P',monospace", fontSize: 7, letterSpacing: 1, border: "1px dashed rgba(255,255,255,0.1)" }}>
              Belum ada pesanan {filter !== "all" ? filter : ""}.
            </div>
          : [...filtered].map((o) => {
            const items = o.order_items || o.items || [];
            const sc = STATUS_STYLE[o.status] || STATUS_STYLE.Dikemas;
            return (
              <div key={o.id} style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.07)", padding: 16 }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: "var(--yellow)" }}>
                    ORDER #{String(o.id).slice(0, 8).toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, padding: "4px 10px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    {(o.status || "DIKEMAS").toUpperCase()}
                  </div>
                </div>

                {/* Item Thumbnails */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {items.slice(0, 3).map((ci, i) => (
                    <div key={i} style={{ width: 56, height: 56, position: "relative", border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, overflow: "hidden" }}>
                      <div style={{ position: "absolute", inset: 0, background: ci.bg || "#0a0519" }} />
                      {ci.image_url
                        ? <img src={ci.image_url} alt={ci.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.currentTarget.style.display = "none"} />
                        : <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{ci.emoji || "🛍"}</span>
                      }
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, border: "1px solid rgba(255,255,255,0.07)", background: "#0a0519", color: "rgba(255,255,255,0.4)" }}>
                      +{items.length - 3}
                    </div>
                  )}
                </div>

                {/* Item Detail — size & color */}
                {items.length > 0 && (
                  <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                    {items.map((ci, i) => (
                      <div key={i} style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>
                        {ci.emoji} {ci.name} · <span style={{ color: "rgba(255,255,255,0.6)" }}>Ukuran: {ci.size}</span> · <span style={{ color: "rgba(255,255,255,0.6)" }}>Warna: {ci.color}</span> · x{ci.qty}
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>{o.date} · {items.length} produk</div>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 700, color: "var(--yellow)" }}>Rp {fmt(o.total)}</div>
                    {o.courier && (
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                        🚚 {o.courier.toUpperCase()} · 💳 {o.payment}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(o.status === "Dikemas" || o.status === "diproses") && (
                      <button onClick={() => cancelOrder(o.id)}
                        style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, background: "transparent", border: "1px solid rgba(255,45,120,0.4)", color: "var(--pink)", padding: "6px 10px", cursor: "pointer" }}>
                        BATAL
                      </button>
                    )}
                    {(o.status === "Dikirim" || o.status === "dikirim") && (
                      <button onClick={() => completeOrder(o.id)}
                        style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, background: "transparent", border: "1px solid rgba(0,245,255,0.3)", color: "var(--cyan)", padding: "6px 10px", cursor: "pointer" }}>
                        SELESAI
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  SellerPage
// ─────────────────────────────────────────
export function SellerPage({ sellerProducts, orders, navigate, saveSellerProduct, deleteSellerProduct, currentUser }) {
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [toast,       setToast]       = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  // Hanya tampil produk milik user yang login
  const myProducts = sellerProducts.filter(p => p.user_id === currentUser?.id);

  const totalRevenue = myProducts.reduce((s, p) => s + (p.revenue || 0), 0);

  const totalOrders = orders.filter((o) => {
    const items = o.order_items || o.items || [];
    return items.some((ci) => myProducts.some((sp) => sp.id === (ci.productId || ci.product_id)));
  }).length;

  const avgRatingVal = myProducts.length > 0
    ? (myProducts.reduce((s, p) => {
        const r = p.reviews || [];
        return s + (r.length > 0 ? r.reduce((a, rv) => a + rv.star, 0) / r.length : 0);
      }, 0) / myProducts.length).toFixed(1)
    : "-";

  const handleSave = (data, editingId) => {
    saveSellerProduct(data, editingId);
    showToast(editingId ? "✓ Produk diperbarui!" : "✓ Produk berhasil ditambahkan!");
  };

  return (
    <div className="page-anim">
      <Toast msg={toast} />
      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditProduct(null); }}
        onSave={handleSave}
        editProduct={editProduct}
      />

      <button onClick={() => navigate("home")} style={backBtnStyle}>← KEMBALI</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 12px 20px", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: "var(--cyan)", letterSpacing: 3, marginBottom: 6 }}>// SELLER CENTER</div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 28, fontWeight: 900, color: "#fff", textTransform: "uppercase" }}>TOKO <span style={{ color: "var(--pink)" }}>KAMU</span></div>
        </div>
        <button onClick={() => { setEditProduct(null); setModalOpen(true); }}
          style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, background: "var(--pink)", border: "none", color: "#fff", padding: "12px 20px", cursor: "pointer", letterSpacing: 1, animation: "pulse-pink 2s infinite" }}>
          + TAMBAH PRODUK
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, margin: "0 12px 24px" }}>
        {[
          { icon: "📦", val: myProducts.length,        label: "PRODUK AKTIF" },
          { icon: "🛒", val: totalOrders,               label: "TOTAL ORDER"  },
          { icon: "💰", val: `Rp ${fmt(totalRevenue)}`, label: "PENDAPATAN"   },
          { icon: "⭐", val: avgRatingVal,               label: "RATING TOKO"  },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--card)", border: "1px solid rgba(0,245,255,0.15)", padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 20, fontWeight: 900, color: "var(--cyan)", marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Product List */}
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: 1, margin: "0 12px 12px" }}>PRODUK SAYA</div>
      <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 10 }}>
        {myProducts.length === 0
          ? <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)", fontFamily: "'Press Start 2P',monospace", fontSize: 7, letterSpacing: 1, lineHeight: 2, border: "1px dashed rgba(255,255,255,0.1)" }}>
              Belum ada produk. Klik "+ TAMBAH PRODUK" untuk mulai berjualan!
            </div>
          : myProducts.map((p) => (
            <div key={p.id} style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.07)", padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 80, height: 80, position: "relative", flexShrink: 0, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: p.bg }} />
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.currentTarget.style.display = "none"} />
                  : <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{p.emoji}</span>
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", textTransform: "uppercase", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 900, color: "var(--yellow)", marginBottom: 4 }}>Rp {fmt(p.price)}</div>
                 <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 1 }}>
                   Stok: {p.stock ?? 0} · Terjual: {parseInt(p.sold) || 0} · {p.cat}
                </div>
                {p.reviews?.length > 0 && (
                  <div style={{ fontSize: 9, color: "var(--yellow)", marginTop: 2 }}>⭐ {(p.reviews.reduce((a, r) => a + r.star, 0) / p.reviews.length).toFixed(1)} ({p.reviews.length} ulasan)</div>
                )}
                {p.bonus?.length > 0 && (
                  <div style={{ display: "inline-block", background: "rgba(255,45,120,0.15)", border: "1px solid rgba(255,45,120,0.3)", color: "var(--pink)", fontFamily: "'Press Start 2P',monospace", fontSize: 6, padding: "2px 6px", marginTop: 4 }}>🎁 {p.bonus.length} BONUS</div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                <button onClick={() => { setEditProduct(p); setModalOpen(true); }} style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, background: "rgba(0,245,255,0.15)", border: "1px solid rgba(0,245,255,0.4)", color: "var(--cyan)", padding: "6px 12px", cursor: "pointer" }}>✏ EDIT</button>
                <button onClick={() => { deleteSellerProduct(p.id); showToast("✓ Produk dihapus."); }} style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, background: "rgba(255,45,120,0.15)", border: "1px solid rgba(255,45,120,0.4)", color: "var(--pink)", padding: "6px 12px", cursor: "pointer" }}>🗑 HAPUS</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  NotifPage
// ─────────────────────────────────────────
export function NotifPage({ navigate }) {
  const notifs = [
    { icon: "⚡", title: "Flash Sale dimulai!",  sub: "Koleksi Cyber Fashion diskon 40% selama 8 jam" },
    { icon: "📦", title: "Pesanan dikirim",      sub: "ORDER sudah dalam perjalanan"                  },
    { icon: "🎁", title: "Voucher baru untukmu", sub: "Gunakan kode NEX20 untuk diskon 20%"            },
  ];
  return (
    <div className="page-anim">
      <button onClick={() => navigate("home")} style={backBtnStyle}>← KEMBALI</button>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 2, margin: "0 12px 20px" }}>NOTIFIKASI</div>
      <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 10 }}>
        {notifs.map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "var(--card)", border: "1px solid rgba(255,255,255,0.07)", padding: 16 }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{n.icon}</span>
            <div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{n.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>{n.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  ChatPage
// ─────────────────────────────────────────
export function ChatPage({ navigate }) {
  return (
    <div className="page-anim">
      <button onClick={() => navigate("home")} style={backBtnStyle}>← KEMBALI</button>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 2, margin: "0 12px 20px" }}>PESAN <span style={{ color: "var(--pink)" }}>MASUK</span></div>
      <div style={{ padding: "0 12px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "var(--card)", border: "1px solid rgba(255,255,255,0.07)", padding: 16 }}>
          <span style={{ fontSize: 24 }}>🏪</span>
          <div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 4 }}>NEXWEAR Official</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Terima kasih sudah belanja! Ada yang bisa dibantu?</div>
          </div>
        </div>
      </div>
    </div>
  );
}