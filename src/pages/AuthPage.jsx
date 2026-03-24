// ─────────────────────────────────────────
//  src/pages/AuthPage.jsx
//  Halaman Login & Register
// ─────────────────────────────────────────

import { useState } from "react";
import { supabase } from "../supabase";

export default function AuthPage({ onLogin }) {
  const [mode, setMode]         = useState("login"); // "login" | "register"
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const inputStyle = {
    width:          "100%",
    background:     "rgba(255,255,255,0.05)",
    border:         "1px solid rgba(0,245,255,0.2)",
    color:          "#fff",
    fontFamily:     "'Share Tech Mono', monospace",
    fontSize:       13,
    padding:        "12px 16px",
    outline:        "none",
    boxSizing:      "border-box",
    letterSpacing:  1,
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!email || !password) { setError("Email dan password wajib diisi!"); return; }
    if (mode === "register" && !name.trim()) { setError("Nama wajib diisi!"); return; }
    if (password.length < 6) { setError("Password minimal 6 karakter!"); return; }

    setLoading(true);

    if (mode === "login") {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError("Email atau password salah!");
      } else {
        onLogin(data.user);
      }

    } else {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (err) {
        setError(err.message);
      } else if (data.user && !data.session) {
        // Email konfirmasi dikirim
        setSuccess("Cek email kamu untuk verifikasi akun! Lalu login.");
        setMode("login");
        setPassword("");
      } else {
        onLogin(data.user);
      }
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight:      "100vh",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      padding:        "20px 16px",
      background:     "#05020f",
      position:       "relative",
      overflow:       "hidden",
    }}>

      {/* Background glow */}
      <div style={{
        position:   "absolute",
        top:        "30%",
        left:       "50%",
        transform:  "translate(-50%, -50%)",
        width:      600,
        height:     600,
        background: "radial-gradient(circle, rgba(180,0,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position:   "absolute",
        bottom:     "10%",
        right:      "10%",
        width:      400,
        height:     400,
        background: "radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width:         "100%",
        maxWidth:      420,
        background:    "rgba(13,10,31,0.95)",
        border:        "1px solid rgba(0,245,255,0.2)",
        boxShadow:     "0 0 60px rgba(0,245,255,0.08), 0 0 120px rgba(180,0,255,0.06)",
        position:      "relative",
        zIndex:        1,
      }}>

        {/* Header */}
        <div style={{
          padding:      "32px 32px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          textAlign:    "center",
        }}>
          <div style={{
            fontFamily:    "'Press Start 2P', monospace",
            fontSize:      18,
            color:         "var(--neon-pink, #ff2d78)",
            letterSpacing: 3,
            marginBottom:  8,
            textShadow:    "0 0 20px rgba(255,45,120,0.5)",
          }}>
            NEXWEAR
          </div>
          <div style={{
            fontFamily:    "'Orbitron', sans-serif",
            fontSize:      11,
            color:         "rgba(255,255,255,0.4)",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}>
            {mode === "login" ? "Masuk ke akun kamu" : "Buat akun baru"}
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {[["login", "LOGIN"], ["register", "DAFTAR"]].map(([m, label]) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              style={{
                flex:          1,
                fontFamily:    "'Press Start 2P', monospace",
                fontSize:      10,
                padding:       "14px 0",
                background:    "transparent",
                border:        "none",
                borderBottom:  mode === m ? "2px solid var(--neon-pink, #ff2d78)" : "2px solid transparent",
                color:         mode === m ? "var(--neon-pink, #ff2d78)" : "rgba(255,255,255,0.35)",
                cursor:        "pointer",
                letterSpacing: 2,
                transition:    "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ padding: "28px 32px 32px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Nama — hanya register */}
          {mode === "register" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "var(--neon-cyan, #00f5ff)", letterSpacing: 2 }}>
                NAMA LENGKAP
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                style={inputStyle}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "var(--neon-cyan, #00f5ff)", letterSpacing: 2 }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="email@kamu.com"
              style={inputStyle}
              autoFocus
            />
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "var(--neon-cyan, #00f5ff)", letterSpacing: 2 }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={mode === "register" ? "Minimal 6 karakter" : "••••••••"}
              style={inputStyle}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background:    "rgba(255,45,120,0.1)",
              border:        "1px solid rgba(255,45,120,0.3)",
              color:         "#ff2d78",
              padding:       "10px 14px",
              fontSize:      10,
              fontFamily:    "'Share Tech Mono', monospace",
              letterSpacing: 0.5,
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              background:    "rgba(0,245,255,0.08)",
              border:        "1px solid rgba(0,245,255,0.3)",
              color:         "#00f5ff",
              padding:       "10px 14px",
              fontSize:      10,
              fontFamily:    "'Share Tech Mono', monospace",
              letterSpacing: 0.5,
            }}>
              ✓ {success}
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              fontFamily:    "'Press Start 2P', monospace",
              fontSize:      9,
              background:    loading ? "rgba(255,45,120,0.4)" : "var(--neon-pink, #ff2d78)",
              border:        "none",
              color:         "#fff",
              padding:       "14px 0",
              cursor:        loading ? "not-allowed" : "pointer",
              letterSpacing: 1,
              marginTop:     4,
              transition:    "all 0.2s",
            }}
          >
            {loading ? "LOADING..." : mode === "login" ? "MASUK →" : "DAFTAR →"}
          </button>

          {/* Switch mode */}
          <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5 }}>
            {mode === "login" ? (
              <>Belum punya akun?{" "}
                <span onClick={() => { setMode("register"); setError(""); }} style={{ color: "var(--neon-cyan, #00f5ff)", cursor: "pointer", textDecoration: "underline" }}>
                  Daftar sekarang
                </span>
              </>
            ) : (
              <>Sudah punya akun?{" "}
                <span onClick={() => { setMode("login"); setError(""); }} style={{ color: "var(--neon-cyan, #00f5ff)", cursor: "pointer", textDecoration: "underline" }}>
                  Login di sini
                </span>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}