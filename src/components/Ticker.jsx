// ─────────────────────────────────────────
//  src/components/Ticker.jsx
//  Marquee promo berjalan
// ─────────────────────────────────────────

const ITEMS = [
  "★ GRATIS ONGKIR SETIAP HARI",
  "◆ GARANSI UANG KEMBALI 30 HARI",
  "★ KUALITAS PREMIUM BAHAN TERBAIK",
  "◆ BAHAN SPACE-GRADE NANO-TECH",
  "★ PIXEL COLLECTION 2077 TERSEDIA",
  "◆ BAYAR DI TEMPAT TERSEDIA",
];

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div
      style={{
        background: "var(--pink)", overflow: "hidden",
        whiteSpace: "nowrap", padding: "5px 0",
        position: "relative", zIndex: 10,
      }}
    >
      <div className="ticker-inner">
        {doubled.map((t, i) => (
          <span key={i} style={{ margin: "0 32px" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
