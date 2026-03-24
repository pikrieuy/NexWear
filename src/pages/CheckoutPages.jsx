// ─────────────────────────────────────────
//  src/pages/CheckoutPages.jsx
// ─────────────────────────────────────────
import { useState } from "react";
import { fmt } from "../utils";
import { backBtnStyle, addrInputStyle } from "../styles/shared";
import Toast from "../components/Toast";
import { PROVINCES } from "../data/products";

// ─────────────────────────────────────────
//  CartPage
// ─────────────────────────────────────────
export function CartPage({ cart, cartTotal, couponDiscount, navigate, removeFromCart, updateCartQty, applyCoupon }) {
  const [couponInput, setCouponInput] = useState("");
  const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleCoupon = () => {
    const ok = applyCoupon(couponInput.trim());
    showToast(ok ? `✓ Voucher berhasil! (${couponInput.toUpperCase()})` : "⚠️ Kode voucher tidak valid!");
  };

  return (
    <div className="page-anim" style={{ padding: "0 0 40px" }}>
      <Toast msg={toast} />
      <button onClick={() => navigate("home")} style={backBtnStyle}>← LANJUT BELANJA</button>
      <div style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 24, fontWeight: 900, color: "#fff", textTransform: "uppercase", marginBottom: 20 }}>
          KERANJANG <span style={{ color: "var(--pink)" }}>BELANJA</span>
        </div>
        <div className="cart-layout" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.4)", fontFamily: "'Press Start 2P',monospace", fontSize: 8, letterSpacing: 1 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                <div>Keranjang kamu kosong.</div>
                <button onClick={() => navigate("home")} style={{ marginTop: 16, fontFamily: "'Press Start 2P',monospace", fontSize: 8, background: "transparent", border: "2px solid var(--cyan)", color: "var(--cyan)", padding: "10px 24px", cursor: "pointer" }}>MULAI BELANJA</button>
              </div>
            ) : cart.map((ci) => (
              <CartItem key={ci.id} item={ci} onRemove={removeFromCart} onQty={updateCartQty} />
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: "var(--card)", border: "1px solid rgba(0,245,255,0.15)", padding: 20, alignSelf: "start", position: "sticky", top: 120 }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, fontWeight: 700, color: "var(--cyan)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>RINGKASAN PESANAN</div>
            {[
              { l: "Subtotal",     v: `Rp ${fmt(cartTotal)}`,        c: undefined       },
              { l: "Ongkos Kirim", v: "GRATIS",                       c: "var(--cyan)"   },
              { l: "Diskon",       v: `-Rp ${fmt(couponDiscount)}`,   c: "var(--pink)"   },
            ].map((r) => (
              <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>{r.l}</span>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, fontWeight: 700, color: r.c || "#fff" }}>{r.v}</span>
              </div>
            ))}
            <div style={{ display: "flex", margin: "14px 0" }}>
              <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="KODE VOUCHER"
                style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "'Share Tech Mono',monospace", fontSize: 11, padding: "8px 12px", outline: "none" }} />
              <button onClick={handleCoupon} style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, background: "var(--cyan)", color: "#000", border: "none", padding: "0 12px", cursor: "pointer" }}>PAKAI</button>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 12, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 900, color: "#fff" }}>TOTAL</span>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 20, fontWeight: 900, color: "var(--yellow)", textShadow: "0 0 12px rgba(255,229,0,0.4)" }}>Rp {fmt(Math.max(0, cartTotal - couponDiscount))}</span>
            </div>
            <button onClick={() => navigate("address")} style={{ display: "block", width: "100%", marginTop: 16, fontFamily: "'Press Start 2P',monospace", fontSize: 9, background: "var(--pink)", border: "none", color: "#fff", padding: 14, cursor: "pointer", letterSpacing: 1, animation: "pulse-pink 2s infinite" }}>PILIH ALAMAT →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item: ci, onRemove, onQty }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--card)", border: "1px solid rgba(255,255,255,0.07)", padding: 14 }}>
      <div style={{ width: 80, height: 80, position: "relative", flexShrink: 0, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: ci.bg || "#0a0519" }} />
        {ci.image_url
          ? <img src={ci.image_url} alt={ci.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.currentTarget.style.display = "none"} />
          : <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{ci.emoji}</span>
        }
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, fontWeight: 700, color: "#fff", textTransform: "uppercase", marginBottom: 4 }}>{ci.name}</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 900, color: "var(--yellow)", marginBottom: 8 }}>Rp {fmt(ci.price)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button onClick={() => onQty(ci.id, -1)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", width: 28, height: 28, fontSize: 16, cursor: "pointer" }}>−</button>
            <input value={ci.qty} readOnly style={{ background: "var(--card)", borderTop: "1px solid rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.15)", borderLeft: "none", borderRight: "none", color: "#fff", width: 40, textAlign: "center", fontFamily: "'Orbitron',monospace", fontSize: 12, height: 28 }} />
            <button onClick={() => onQty(ci.id, 1)}  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", width: 28, height: 28, fontSize: 16, cursor: "pointer" }}>+</button>
          </div>
          <button onClick={() => onRemove(ci.id)} style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, background: "transparent", border: "1px solid rgba(255,45,120,0.3)", color: "var(--pink)", padding: "4px 8px", cursor: "pointer" }}>HAPUS</button>
        </div>
      </div>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 900, color: "var(--yellow)", textShadow: "0 0 8px rgba(255,229,0,0.4)", flexShrink: 0 }}>Rp {fmt(ci.price * ci.qty)}</div>
    </div>
  );
}

// ─────────────────────────────────────────
//  AddressPage
// ─────────────────────────────────────────
export function AddressPage({ addresses, selectedAddressId, setSelectedAddressId, saveAddress, deleteAddress, navigate }) {
  const [form, setForm] = useState({ name: "", phone: "", street: "", city: "", postal: "", prov: "" });
  const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.phone || !form.street || !form.city || !form.prov) { showToast("⚠️ Lengkapi semua field!"); return; }
    saveAddress(form);
    setForm({ name: "", phone: "", street: "", city: "", postal: "", prov: "" });
    showToast("✓ Alamat berhasil disimpan!");
  };

  return (
    <div className="page-anim">
      <Toast msg={toast} />
      <button onClick={() => navigate("cart")} style={backBtnStyle}>← KEMBALI KE KERANJANG</button>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 2, margin: "0 12px 20px" }}>PILIH <span style={{ color: "var(--pink)" }}>ALAMAT PENGIRIMAN</span></div>
      <div className="address-layout" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, padding: "0 12px" }}>
        {/* Address List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {addresses.length === 0
            ? <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.3)", fontFamily: "'Press Start 2P',monospace", fontSize: 7, border: "1px dashed rgba(255,255,255,0.1)" }}>Belum ada alamat tersimpan</div>
            : addresses.map((a) => (
              <div key={a.id} className="addr-card" onClick={() => setSelectedAddressId(a.id)}
                style={{ background: a.id === selectedAddressId ? "rgba(0,245,255,0.05)" : "var(--card)", border: `2px solid ${a.id === selectedAddressId ? "var(--cyan)" : "rgba(255,255,255,0.07)"}`, padding: 16, cursor: "pointer", transition: "all 0.2s", position: "relative" }}>
                {a.id === selectedAddressId && <span style={{ position: "absolute", top: 10, right: 10, fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: "var(--cyan)", letterSpacing: 1 }}>✓ DIPILIH</span>}
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{a.name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, letterSpacing: 0.5 }}>{a.street}, {a.city}, {a.prov} {a.postal}<br />{a.phone}</div>
                <button onClick={(e) => { e.stopPropagation(); deleteAddress(a.id); }} style={{ marginTop: 10, fontFamily: "'Press Start 2P',monospace", fontSize: 6, background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", padding: "4px 8px", cursor: "pointer" }}>🗑 HAPUS</button>
              </div>
            ))
          }
        </div>
        {/* Add Form */}
        <div style={{ background: "var(--card)", border: "1px solid rgba(0,245,255,0.15)", padding: 20 }}>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: "var(--cyan)", letterSpacing: 2, marginBottom: 16 }}>➕ TAMBAH ALAMAT BARU</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[{ k: "name", ph: "Nama Penerima" }, { k: "phone", ph: "No. Telepon" }, { k: "street", ph: "Alamat Jalan & No." }].map((f) => (
              <input key={f.k} value={form[f.k]} onChange={(e) => set(f.k, e.target.value)} placeholder={f.ph} style={addrInputStyle} />
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input value={form.city}   onChange={(e) => set("city", e.target.value)}   placeholder="Kota"     style={addrInputStyle} />
              <input value={form.postal} onChange={(e) => set("postal", e.target.value)} placeholder="Kode Pos" style={addrInputStyle} />
            </div>
            <select value={form.prov} onChange={(e) => set("prov", e.target.value)} style={addrInputStyle}>
              <option value="">Pilih Provinsi</option>
              {PROVINCES.map((p) => <option key={p} value={p} style={{ background: "#0a0519" }}>{p}</option>)}
            </select>
            <button onClick={handleSave} style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, background: "var(--cyan)", color: "#000", border: "none", padding: 12, cursor: "pointer", letterSpacing: 1 }}>SIMPAN ALAMAT</button>
          </div>
        </div>
      </div>
      <div style={{ padding: "20px 12px 0" }}>
        <button onClick={() => { if (!selectedAddressId) { alert("Pilih alamat dulu!"); return; } navigate("checkout"); }}
          style={{ display: "block", width: "100%", fontFamily: "'Press Start 2P',monospace", fontSize: 9, background: "var(--pink)", border: "none", color: "#fff", padding: 14, cursor: "pointer", letterSpacing: 1, animation: "pulse-pink 2s infinite" }}>
          LANJUT KE CHECKOUT →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  CheckoutPage
// ─────────────────────────────────────────
export function CheckoutPage({ cart, cartTotal, couponDiscount, addresses, selectedAddressId, shippingCost, setShippingCost, navigate, placeOrder }) {
  // ── FIX: state untuk tracking pilihan kurir & pembayaran ──
  const [selectedShip, setSelectedShip] = useState("jne");
  const [selectedPay,  setSelectedPay]  = useState("transfer");

  const addr  = addresses.find((a) => a.id === selectedAddressId);
  const total = Math.max(0, cartTotal - couponDiscount + shippingCost);

  // ── FIX: kirim semua data yang dibutuhkan ke placeOrder ──
  const handlePlaceOrder = async () => {
    if (!addr) { alert("Pilih alamat dulu!"); return; }
    await placeOrder({
      total,
      courier: selectedShip,
      payment: selectedPay,
      address: addr,
      
    });
    navigate("success");
  };

  const SHIPPING = [
    { v: "jne",     name: "JNE Express",  desc: "1-2 hari kerja",  price: "GRATIS",    priceColor: "var(--cyan)",   cost: 0     },
    { v: "jnt",     name: "J&T Express",  desc: "2-3 hari kerja",  price: "GRATIS",    priceColor: "var(--cyan)",   cost: 0     },
    { v: "sicepat", name: "SiCepat BEST", desc: "Hari yang sama",  price: "Rp 15.000", priceColor: "var(--yellow)", cost: 15000 },
  ];
  const PAYMENTS = [
    { v: "transfer", icon: "🏦", name: "Transfer Bank"         },
    { v: "gopay",    icon: "💚", name: "GoPay"                 },
    { v: "ovo",      icon: "💜", name: "OVO"                   },
    { v: "qris",     icon: "📲", name: "QRIS"                  },
    { v: "cod",      icon: "💵", name: "COD (Bayar di Tempat)" },
  ];

  const cardStyle  = { background: "var(--card)", border: "1px solid rgba(0,245,255,0.15)", padding: 20 };
  const titleStyle = { fontFamily: "'Orbitron',sans-serif", fontSize: 11, fontWeight: 700, color: "var(--cyan)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" };

  return (
    <div className="page-anim">
      <button onClick={() => navigate("address")} style={backBtnStyle}>← KEMBALI</button>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 2, margin: "0 12px 20px" }}>CHECKOUT <span style={{ color: "var(--pink)" }}>PEMBAYARAN</span></div>
      <div className="checkout-layout" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, padding: "0 12px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Address */}
          <div style={cardStyle}>
            <div style={titleStyle}>📍 ALAMAT PENGIRIMAN</div>
            {addr ? (
              <>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{addr.name} · {addr.phone}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, letterSpacing: 0.5 }}>{addr.street}, {addr.city}, {addr.prov} {addr.postal}</div>
              </>
            ) : <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Belum ada alamat</div>}
          </div>

          {/* Shipping — FIX: onChange update selectedShip + shippingCost */}
          <div style={cardStyle}>
            <div style={titleStyle}>🚀 METODE PENGIRIMAN</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SHIPPING.map((opt) => (
                <label key={opt.v} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: 10, border: `1px solid ${selectedShip === opt.v ? "rgba(0,245,255,0.4)" : "rgba(255,255,255,0.07)"}` }}>
                  <input
                    type="radio" name="ship" value={opt.v}
                    checked={selectedShip === opt.v}
                    onChange={() => { setSelectedShip(opt.v); setShippingCost(opt.cost); }}
                    style={{ accentColor: "var(--pink)" }}
                  />
                  <div style={{ flex: 1 }}>
                    <span style={{ display: "block", fontFamily: "'Orbitron',sans-serif", fontSize: 10, fontWeight: 700, color: "#fff" }}>{opt.name}</span>
                    <span style={{ display: "block", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginTop: 2 }}>{opt.desc}</span>
                  </div>
                  <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, fontWeight: 700, color: opt.priceColor }}>{opt.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment — FIX: onChange update selectedPay */}
          <div style={cardStyle}>
            <div style={titleStyle}>💳 METODE PEMBAYARAN</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {PAYMENTS.map((opt) => (
                <label key={opt.v} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 12px", border: `1px solid ${selectedPay === opt.v ? "rgba(255,45,120,0.5)" : "rgba(255,255,255,0.07)"}` }}>
                  <input
                    type="radio" name="pay" value={opt.v}
                    checked={selectedPay === opt.v}
                    onChange={() => setSelectedPay(opt.v)}
                    style={{ accentColor: "var(--pink)" }}
                  />
                  <span style={{ fontSize: 18 }}>{opt.icon}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: 0.5 }}>{opt.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Items */}
          <div style={cardStyle}>
            <div style={titleStyle}>🛒 RINGKASAN PRODUK</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cart.map((ci) => (
                <div key={ci.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, background: ci.bg }}>{ci.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 9, fontWeight: 700, color: "#fff", textTransform: "uppercase" }}>{ci.name}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{ci.size} · {ci.color} · x{ci.qty}</div>
                  </div>
                  <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, fontWeight: 700, color: "var(--yellow)" }}>Rp {fmt(ci.price * ci.qty)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div style={{ background: "var(--card)", border: "1px solid rgba(255,45,120,0.3)", padding: 20, position: "sticky", top: 120, alignSelf: "start" }}>
          <div style={{ ...titleStyle, borderColor: "rgba(255,45,120,0.3)" }}>💰 TOTAL PEMBAYARAN</div>
          <div style={{ marginBottom: 12 }}>
            {[
              { l: "Subtotal", v: `Rp ${fmt(cartTotal)}`,                                                              c: undefined       },
              { l: "Ongkir",   v: shippingCost > 0 ? `Rp ${fmt(shippingCost)}` : "GRATIS",                             c: shippingCost > 0 ? undefined : "var(--cyan)" },
              { l: "Diskon",   v: `-Rp ${fmt(couponDiscount)}`,                                                         c: "var(--pink)"   },
            ].map((r) => (
              <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                <span>{r.l}</span><span style={{ color: r.c }}>{r.v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 16px" }}>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, fontWeight: 900, color: "#fff" }}>TOTAL</span>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 24, fontWeight: 900, color: "var(--yellow)", textShadow: "0 0 12px rgba(255,229,0,0.4)" }}>Rp {fmt(total)}</span>
          </div>
          <div style={{ marginBottom: 12, padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Kurir: </span>
            <span style={{ color: "var(--cyan)", fontWeight: 700 }}>{SHIPPING.find(s => s.v === selectedShip)?.name}</span>
            <span style={{ margin: "0 8px", color: "rgba(255,255,255,0.2)" }}>·</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Bayar: </span>
            <span style={{ color: "var(--pink)", fontWeight: 700 }}>{PAYMENTS.find(p => p.v === selectedPay)?.name}</span>
          </div>
          <button onClick={handlePlaceOrder} style={{ display: "block", width: "100%", fontFamily: "'Press Start 2P',monospace", fontSize: 9, background: "var(--pink)", border: "none", color: "#fff", padding: 14, cursor: "pointer", letterSpacing: 1, animation: "pulse-pink 2s infinite" }}>BAYAR SEKARANG →</button>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>🔒 Transaksi 100% Aman & Terlindungi</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  SuccessPage
// ─────────────────────────────────────────
export function SuccessPage({ navigate }) {
  return (
    <div className="page-anim" style={{ maxWidth: 600, margin: "60px auto", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 24, animation: "float 2s ease-in-out infinite" }}>✅</div>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 28, fontWeight: 900, color: "var(--cyan)", textShadow: "0 0 20px var(--cyan)", textTransform: "uppercase", marginBottom: 12 }}>PEMBAYARAN BERHASIL!</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1, marginBottom: 32, lineHeight: 1.8 }}>Terima kasih telah berbelanja di NEXWEAR!<br />Pesanan kamu sedang diproses oleh seller.</div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => navigate("orders")} style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, background: "transparent", border: "2px solid var(--cyan)", color: "var(--cyan)", padding: "12px 20px", cursor: "pointer" }}>LACAK PESANAN</button>
        <button onClick={() => navigate("home")}   style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, background: "var(--pink)", border: "2px solid var(--pink)", color: "#fff", padding: "12px 20px", cursor: "pointer", animation: "pulse-pink 2s infinite" }}>BELANJA LAGI</button>
      </div>
    </div>
  );
}