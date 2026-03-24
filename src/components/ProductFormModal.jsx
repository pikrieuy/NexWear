// ─────────────────────────────────────────
//  src/components/ProductFormModal.jsx
// ─────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { BG_OPTIONS, BADGE_OPTIONS } from "../data/products";
import { formInputStyle, formLabelStyle } from "../styles/shared";
import { supabase } from "../supabase";

const DEFAULT_FORM = {
  name: "", price: "", oldPrice: "", stock: "",
  cat: "clothing", emoji: "👕",
  bg: BG_OPTIONS[0].value,
  badge: "pcb-new|NEW",
  desc: "",
  image_url: "",
};

// ── Nama bucket Supabase Storage ──
const BUCKET = "product-images";

export default function ProductFormModal({ isOpen, onClose, onSave, editProduct }) {
  const [form, setForm]             = useState(DEFAULT_FORM);
  const [bonusList, setBonusList]   = useState([]);
  const [bonusInput, setBonusInput] = useState("");

  // State upload gambar
  const [imageFile,     setImageFile]     = useState(null);    // file mentah dari input
  const [imagePreview,  setImagePreview]  = useState("");      // URL preview lokal
  const [uploading,     setUploading]     = useState(false);   // loading state
  const [uploadError,   setUploadError]   = useState("");      // pesan error
  const fileInputRef = useRef(null);

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset / populate form saat modal dibuka
  useEffect(() => {
    if (!isOpen) return;
    if (editProduct) {
      setForm({
        name:      editProduct.name,
        price:     editProduct.price,
        oldPrice:  editProduct.oldPrice || "",
        stock:     editProduct.stock    || "",
        cat:       editProduct.cat,
        emoji:     editProduct.emoji,
        bg:        editProduct.bg,
        badge:     `${editProduct.badgeClass}|${editProduct.badgeText}`,
        desc:      editProduct.desc,
        image_url: editProduct.image_url || "",
      });
      setImagePreview(editProduct.image_url || "");
      setBonusList([...(editProduct.bonus || [])]);
    } else {
      setForm(DEFAULT_FORM);
      setImagePreview("");
      setBonusList([]);
    }
    setImageFile(null);
    setUploadError("");
    setBonusInput("");
  }, [isOpen, editProduct]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ── Pilih file gambar ──
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar (JPG, PNG, WebP)");
      return;
    }
    // Validasi ukuran (maks 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran gambar maksimal 5 MB");
      return;
    }

    setUploadError("");
    setImageFile(file);
    // Tampilkan preview lokal sebelum upload
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── Upload ke Supabase Storage ──
  const uploadImage = async () => {
    if (!imageFile) return form.image_url; // Tidak ada file baru → pakai URL lama

    setUploading(true);
    setUploadError("");

    const ext      = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `products/${fileName}`;

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, imageFile, { cacheControl: "3600", upsert: false });

    if (uploadErr) {
      setUploadError("Gagal upload gambar: " + uploadErr.message);
      setUploading(false);
      return null;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    setUploading(false);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Nama produk wajib diisi!");
    if (!form.price)       return alert("Harga produk wajib diisi!");
    if (!form.desc.trim()) return alert("Deskripsi produk wajib diisi!");

    // Upload gambar dulu (jika ada file baru)
    const finalImageUrl = await uploadImage();
    if (finalImageUrl === null) return; // Upload gagal, batal simpan

    const [badgeClass, badgeText] = form.badge.split("|");
    onSave(
      {
        ...form,
        price:     parseInt(form.price),
        oldPrice:  parseInt(form.oldPrice) || 0,
        stock:     parseInt(form.stock)    || 0,
        badgeClass,
        badgeText,
        bonus:     [...bonusList],
        image_url: finalImageUrl || "",
      },
      editProduct?.id
    );
    onClose();
  };

  const addBonus = () => {
    if (!bonusInput.trim()) return;
    setBonusList((prev) => [...prev, bonusInput.trim()]);
    setBonusInput("");
  };

  const removeBonus = (idx) => setBonusList((prev) => prev.filter((_, i) => i !== idx));

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    set("image_url", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position:             "fixed",
        inset:                0,
        zIndex:               2000,
        display:              "flex",
        alignItems:           "center",
        justifyContent:       "center",
        padding:              "70px 16px 80px",
        background:           "rgba(0,0,0,0.88)",
        backdropFilter:       "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:    "#0d0a1f",
          border:        "1px solid rgba(0,245,255,0.35)",
          borderRadius:  2,
          width:         "100%",
          maxWidth:      760,
          maxHeight:     "calc(100vh - 160px)",
          overflowY:     "auto",
          boxShadow:     "0 0 80px rgba(0,245,255,0.12), 0 0 160px rgba(180,0,255,0.08)",
          animation:     "pageIn 0.25s ease",
          display:       "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header sticky ── */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "18px 24px",
          borderBottom:   "1px solid rgba(255,255,255,0.07)",
          background:     "#0d0a1f",
          position:       "sticky",
          top:            0,
          zIndex:         10,
          flexShrink:     0,
        }}>
          <div>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: "var(--cyan)", letterSpacing: 3, marginBottom: 6 }}>
              // SELLER CENTER
            </div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, fontWeight: 900, color: "#fff", textTransform: "uppercase" }}>
              {editProduct ? "✏ EDIT PRODUK" : "➕ TAMBAH PRODUK BARU"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background:     "rgba(255,45,120,0.1)",
              border:         "1px solid rgba(255,45,120,0.4)",
              color:          "var(--pink)",
              fontSize:       16,
              width:          36,
              height:         36,
              cursor:         "pointer",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              flexShrink:     0,
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "24px 24px 8px", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* ── UPLOAD FOTO PRODUK ── */}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ ...formLabelStyle, display: "block", marginBottom: 8 }}>
                📸 FOTO PRODUK
              </label>

              {imagePreview ? (
                // Preview gambar
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width:        "100%",
                      maxWidth:     320,
                      maxHeight:    220,
                      objectFit:    "cover",
                      border:       "1px solid rgba(0,245,255,0.3)",
                      display:      "block",
                    }}
                  />
                  <button
                    onClick={removeImage}
                    style={{
                      position:   "absolute",
                      top:        6,
                      right:      6,
                      background: "rgba(0,0,0,0.75)",
                      border:     "1px solid rgba(255,45,120,0.6)",
                      color:      "var(--pink)",
                      fontSize:   13,
                      width:      28,
                      height:     28,
                      cursor:     "pointer",
                      display:    "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Hapus gambar"
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      marginTop:     8,
                      fontFamily:    "'Press Start 2P',monospace",
                      fontSize:      7,
                      background:    "rgba(0,245,255,0.1)",
                      border:        "1px solid rgba(0,245,255,0.4)",
                      color:         "var(--cyan)",
                      padding:       "8px 14px",
                      cursor:        "pointer",
                      display:       "block",
                      letterSpacing: 1,
                    }}
                  >
                    GANTI FOTO
                  </button>
                </div>
              ) : (
                // Drop zone / pilih file
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border:         "2px dashed rgba(0,245,255,0.3)",
                    padding:        "32px 20px",
                    textAlign:      "center",
                    cursor:         "pointer",
                    background:     "rgba(0,245,255,0.03)",
                    transition:     "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,245,255,0.6)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)"}
                >
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📷</div>
                  <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: "var(--cyan)", letterSpacing: 1, marginBottom: 8 }}>
                    KLIK UNTUK PILIH FOTO
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                    JPG, PNG, WebP · Maks 5 MB
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                    Jika kosong, tampilan pakai gradient tema
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {/* Error upload */}
              {uploadError && (
                <div style={{ marginTop: 8, fontSize: 10, color: "var(--pink)", letterSpacing: 0.5 }}>
                  ⚠ {uploadError}
                </div>
              )}
            </div>

            <FormField label="NAMA PRODUK *" full>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Contoh: Cyber Jacket Alpha"
                style={formInputStyle}
                autoFocus
              />
            </FormField>

            <FormField label="HARGA NORMAL (Rp) *">
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="450000"
                style={formInputStyle}
              />
            </FormField>

            <FormField label="HARGA CORET (Rp)">
              <input
                type="number"
                value={form.oldPrice}
                onChange={(e) => set("oldPrice", e.target.value)}
                placeholder="600000 (opsional)"
                style={formInputStyle}
              />
            </FormField>

            <FormField label="STOK *">
              <input
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="100"
                style={formInputStyle}
              />
            </FormField>

            <FormField label="KATEGORI">
              <select value={form.cat} onChange={(e) => set("cat", e.target.value)} style={formInputStyle}>
                {[
                  ["outwear",   "🧥 Out Wear"    ],
                  ["accessory", "💍 Accessory"   ],
                  ["device",    "📱 Device"      ],
                  ["utility",   "🛠️ Utility"     ],
                  ["clothing",  "👕 Clothing"    ],
                  ["shoes",     "👟 Shoes"       ],
                  ["set",       "🎁 Set"         ],
                ].map(([v, l]) => (
                  <option key={v} value={v} style={{ background: "#0a0519" }}>{l}</option>
                ))}
              </select>
            </FormField>

            <FormField label="WARNA TEMA (fallback)">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <select
                  value={form.bg}
                  onChange={(e) => set("bg", e.target.value)}
                  style={{ ...formInputStyle, flex: 1 }}
                >
                  {BG_OPTIONS.map((b) => (
                    <option key={b.value} value={b.value} style={{ background: "#0a0519" }}>{b.label}</option>
                  ))}
                </select>
                <div style={{
                  width:          40,
                  height:         40,
                  flexShrink:     0,
                  background:     form.bg,
                  border:         "1px solid rgba(255,255,255,0.15)",
                }} />
              </div>
            </FormField>

            <FormField label="BADGE">
              <select value={form.badge} onChange={(e) => set("badge", e.target.value)} style={formInputStyle}>
                {BADGE_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value} style={{ background: "#0a0519" }}>{b.label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="DESKRIPSI PRODUK *" full>
              <textarea
                value={form.desc}
                onChange={(e) => set("desc", e.target.value)}
                rows={3}
                placeholder="Jelaskan produkmu secara detail: bahan, ukuran, keunggulan..."
                style={{ ...formInputStyle, resize: "vertical", minHeight: 80 }}
              />
            </FormField>

            {/* Bonus Section */}
            <div style={{ gridColumn: "1/-1", paddingBottom: 8 }}>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: "var(--yellow)", letterSpacing: 2, marginBottom: 4 }}>
                🎁 BONUS UNTUK PEMBELI (Opsional)
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, marginBottom: 10 }}>
                Tambahkan bonus eksklusif untuk menarik lebih banyak pembeli!
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                {bonusList.map((b, i) => (
                  <div key={i} style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        8,
                    background: "rgba(255,45,120,0.1)",
                    border:     "1px solid rgba(255,45,120,0.25)",
                    padding:    "6px 10px",
                  }}>
                    <span style={{ flex: 1, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>🎁 {b}</span>
                    <button onClick={() => removeBonus(i)} style={{ background: "transparent", border: "none", color: "var(--pink)", cursor: "pointer", fontSize: 14 }}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={bonusInput}
                  onChange={(e) => setBonusInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addBonus()}
                  placeholder="Contoh: Tote bag gratis, Pouch cantik..."
                  style={{ ...formInputStyle, flex: 1 }}
                />
                <button onClick={addBonus} style={{
                  fontFamily:    "'Press Start 2P',monospace",
                  fontSize:      7,
                  background:    "rgba(255,229,0,0.15)",
                  border:        "1px solid rgba(255,229,0,0.4)",
                  color:         "var(--yellow)",
                  padding:       "0 14px",
                  cursor:        "pointer",
                  whiteSpace:    "nowrap",
                  letterSpacing: 1,
                }}>
                  + BONUS
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer sticky ── */}
        <div style={{
          display:        "flex",
          justifyContent: "flex-end",
          gap:            12,
          padding:        "16px 24px",
          borderTop:      "1px solid rgba(255,255,255,0.07)",
          background:     "#0d0a1f",
          position:       "sticky",
          bottom:         0,
          flexShrink:     0,
          zIndex:         10,
        }}>
          <button onClick={onClose} style={{
            fontFamily:    "'Press Start 2P',monospace",
            fontSize:      8,
            background:    "transparent",
            border:        "1px solid rgba(255,255,255,0.2)",
            color:         "rgba(255,255,255,0.5)",
            padding:       "10px 20px",
            cursor:        "pointer",
            letterSpacing: 1,
          }}>
            BATAL
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            style={{
              fontFamily:    "'Press Start 2P',monospace",
              fontSize:      8,
              background:    uploading ? "rgba(255,45,120,0.4)" : "var(--pink)",
              border:        "none",
              color:         "#fff",
              padding:       "10px 24px",
              cursor:        uploading ? "not-allowed" : "pointer",
              letterSpacing: 1,
              animation:     uploading ? "none" : "pulse-pink 2s infinite",
              opacity:       uploading ? 0.7 : 1,
            }}
          >
            {uploading ? "UPLOADING..." : "SIMPAN PRODUK →"}
          </button>
        </div>

      </div>
    </div>
  );
}

function FormField({ label, full, children }) {
  return (
    <div style={{ gridColumn: full ? "1/-1" : "auto", display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={formLabelStyle}>{label}</label>
      {children}
    </div>
  );
}