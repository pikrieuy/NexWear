// ─────────────────────────────────────────
//  src/styles/shared.js
//  Reusable inline style objects
//  Import di component yang butuh: import { backBtnStyle, ... } from '../styles/shared'
// ─────────────────────────────────────────

export const backBtnStyle = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 10,
  background: "transparent",
  border: "1px solid rgba(0,245,255,0.3)",
  color: "var(--cyan)",
  padding: "8px 16px",
  cursor: "pointer",
  margin: "16px 12px",
  display: "inline-block",
  letterSpacing: 1,
  transition: "all 0.2s",
};

export const labelStyle = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 9,
  color: "rgba(255,255,255,0.65)",
  letterSpacing: 2,
  marginBottom: 8,
  textTransform: "uppercase",
  display: "block",
};

export const qtyBtnStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "#fff",
  width: 32,
  height: 32,
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
};

export const addrInputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: 12,
  padding: "10px 14px",
  outline: "none",
  width: "100%",
};

export const formInputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: 12,
  padding: "10px 14px",
  outline: "none",
  width: "100%",
};

export const formLabelStyle = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 8,
  color: "rgba(255,255,255,0.65)",
  letterSpacing: 2,
  textTransform: "uppercase",
  display: "block",
  marginBottom: 6,
};

export const sectionTitleStyle = {
  fontFamily: "'Orbitron', sans-serif",
  fontSize: 22,
  fontWeight: 900,
  color: "#fff",
  textTransform: "uppercase",
  letterSpacing: 2,
  margin: "0 12px 20px",
};

export const cardStyle = {
  background: "var(--card)",
  border: "1px solid rgba(0,245,255,0.15)",
  padding: 20,
};

export const checkoutCardTitleStyle = {
  fontFamily: "'Orbitron', sans-serif",
  fontSize: 11,
  fontWeight: 700,
  color: "var(--cyan)",
  letterSpacing: 2,
  textTransform: "uppercase",
  marginBottom: 16,
  paddingBottom: 10,
  borderBottom: "1px solid rgba(255,255,255,0.07)",
};

export const orbitronPrice = {
  fontFamily: "'Orbitron', sans-serif",
  fontSize: 20,
  fontWeight: 900,
  color: "var(--yellow)",
  textShadow: "0 0 12px rgba(255,229,0,0.4)",
};

export const checkoutBtn = {
  display: "block",
  width: "100%",
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 10,
  background: "var(--pink)",
  border: "none",
  color: "#fff",
  padding: 14,
  cursor: "pointer",
  letterSpacing: 1,
  animation: "pulse-pink 2s infinite",
};

export const pressBtnOutline = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 10,
  background: "transparent",
  border: "2px solid var(--cyan)",
  color: "var(--cyan)",
  padding: "12px 20px",
  cursor: "pointer",
  letterSpacing: 1,
};

export const pressBtnSolid = {
  fontFamily: "'Press Start 2P', monospace",
  fontSize: 8,
  background: "var(--pink)",
  border: "2px solid var(--pink)",
  color: "#fff",
  padding: "12px 20px",
  cursor: "pointer",
  letterSpacing: 1,
  animation: "pulse-pink 2s infinite",
};
