// ─────────────────────────────────────────
//  src/components/SkeletonGrid.jsx
//  Loading skeleton untuk product grid
// ─────────────────────────────────────────

const shimmer = {
  background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)",
  backgroundSize: "200% 100%",
  animation: "skshimmer 1.4s ease-in-out infinite",
};

// Inject keyframe sekali
if (typeof document !== "undefined" && !document.getElementById("sk-style")) {
  const s = document.createElement("style");
  s.id = "sk-style";
  s.textContent = `@keyframes skshimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`;
  document.head.appendChild(s);
}

function SkeletonCard() {
  return (
    <div style={{ background: "var(--card)", border: "1px solid rgba(255,255,255,0.04)" }}>
      {/* Image area */}
      <div style={{ height: 180, ...shimmer }} />
      {/* Info */}
      <div style={{ padding: 10 }}>
        <div style={{ height: 10, width: "70%", marginBottom: 8, ...shimmer }} />
        <div style={{ height: 8,  width: "40%", marginBottom: 8, ...shimmer }} />
        <div style={{ height: 13, width: "55%", marginBottom: 10, ...shimmer }} />
        <div style={{ height: 8,  width: "90%", ...shimmer }} />
      </div>
    </div>
  );
}

export default function SkeletonGrid({ count = 10 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, padding: "12px 12px 60px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
