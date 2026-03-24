// ─────────────────────────────────────────
//  src/pages/ProfilePage.jsx
//  Halaman profil user — edit nama & avatar
// ─────────────────────────────────────────

import { useState, useRef } from "react";
import { supabase } from "../supabase";
import { backBtnStyle } from "../styles/shared";
import Toast from "../components/Toast";

export default function ProfilePage({ user, navigate }) {
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Nexwear User"
  );
  const [avatar,   setAvatar]   = useState(user?.user_metadata?.avatar_url || "");
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState("");
  const fileRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim(), avatar_url: avatar },
    });
    setSaving(false);
    if (error) showToast(`⚠️ Gagal menyimpan: ${error.message}`);
    else showToast("✓ Profil berhasil diperbarui!");
  };

  const handleAvatarLocal = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="page-anim">
      <Toast msg={toast} />
      <button onClick={() => navigate("home")} style={backBtnStyle}>← KEMBALI</button>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 12px 60px" }}>
        {/* Header */}
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 22, fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: 2, marginBottom: 32 }}>
          PROFIL <span style={{ color: "var(--pink)" }}>KAMU</span>
        </div>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{ width: 100, height: 100, borderRadius: "50%", background: avatar ? "transparent" : "linear-gradient(135deg,var(--pink),var(--cyan))", border: "2px solid rgba(0,245,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", position: "relative", flexShrink: 0 }}
          >
            {avatar
              ? <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setAvatar("")} />
              : <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 28, fontWeight: 900, color: "#fff" }}>{initials}</span>
            }
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0"}
            >
              <span style={{ fontSize: 20 }}>📷</span>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarLocal} />
          <div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{displayName}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: 1, marginBottom: 10 }}>{user?.email}</div>
            <button onClick={() => fileRef.current?.click()} style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, background: "transparent", border: "1px solid rgba(0,245,255,0.4)", color: "var(--cyan)", padding: "6px 12px", cursor: "pointer", letterSpacing: 1 }}>GANTI FOTO</button>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "var(--card)", border: "1px solid rgba(0,245,255,0.12)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: "var(--cyan)", letterSpacing: 2, marginBottom: 4 }}>INFORMASI AKUN</div>

          <div>
            <label style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: "rgba(255,255,255,0.5)", letterSpacing: 2, display: "block", marginBottom: 8 }}>NAMA TAMPILAN</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nama kamu"
              style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "'Share Tech Mono',monospace", fontSize: 14, padding: "10px 14px", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: "rgba(255,255,255,0.5)", letterSpacing: 2, display: "block", marginBottom: 8 }}>EMAIL</label>
            <input
              value={user?.email || ""}
              readOnly
              style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", fontFamily: "'Share Tech Mono',monospace", fontSize: 14, padding: "10px 14px", outline: "none", cursor: "not-allowed" }}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, background: saving ? "rgba(255,45,120,0.3)" : "var(--pink)", color: "#fff", border: "none", padding: 14, cursor: saving ? "default" : "pointer", letterSpacing: 1, transition: "background 0.2s" }}
          >
            {saving ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
          </button>
        </div>

        {/* Stats */}
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "Bergabung", value: new Date(user?.created_at || Date.now()).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) },
            { label: "Member", value: "NEXWEAR" },
            { label: "Status", value: "AKTIF" },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 12, fontWeight: 700, color: "var(--cyan)", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
