// ─────────────────────────────────────────
//  src/data/products.js
//  Semua data produk default & konstanta UI
// ─────────────────────────────────────────

export const INITIAL_PRODUCTS = [
  { id:"p1", name:"Cyber Jacket Alpha",  emoji:"🧥", bg:"linear-gradient(135deg,#0d001a,#4b0082,#ff2d78)", price:649000, oldPrice:899000, sold:"2.1rb", rating:5, badgeClass:"pcb-new",  badgeText:"NEW",  cat:"outwear",  desc:"Jaket oversized edisi cyber dengan bahan nano-ripstop anti-air. Lapisan dalam fleece premium, cocok untuk semua cuaca.", bonus:[], reviews:[], flash:true  },
  { id:"p2", name:"Neon Street Tee",     emoji:"👕", bg:"linear-gradient(135deg,#001a10,#004030,#00f5c8)", price:299000, oldPrice:0,      sold:"3.8rb", rating:5, badgeClass:"pcb-hot",  badgeText:"HOT",  cat:"clothing", desc:"Kaos streetwear dengan motif neon grid. Bahan katun combed 30s premium, sablon anti-crack dan anti-luntur.", bonus:[], reviews:[], flash:true  },
  { id:"p3", name:"Pixel Runner X",      emoji:"👟", bg:"linear-gradient(135deg,#0a0a00,#404000,#ffe500)", price:489000, oldPrice:799000, sold:"1.5rb", rating:4, badgeClass:"pcb-sale", badgeText:"-39%", cat:"shoes",    desc:"Sepatu lari edisi pixel art limited. Sol air-cushion teknologi terbaru, upper mesh breathable anti-bau.", bonus:[], reviews:[], flash:true  },
  { id:"p4", name:"Dark Matter Hoodie",  emoji:"🫱", bg:"linear-gradient(135deg,#0a0000,#800020,#ff2d78)", price:549000, oldPrice:749000, sold:"987",   rating:5, badgeClass:"pcb-hot",  badgeText:"HOT",  cat:"outwear",  desc:"Hoodie premium unisex dengan bahan fleece tebal. Desain minimalis dark academia dengan logo emboss.", bonus:[], reviews:[], flash:false },
  { id:"p5", name:"Aurora Cargo Pants",  emoji:"👖", bg:"linear-gradient(135deg,#001830,#003060,#00f5ff)", price:429000, oldPrice:0,      sold:"744",   rating:5, badgeClass:"pcb-new",  badgeText:"NEW",  cat:"clothing", desc:"Cargo pants futuristik dengan 8 saku fungsional. Bahan tech-fabric ringan dan tahan lama.", bonus:[], reviews:[], flash:false },
  { id:"p6", name:"Hologram Bag Pro",    emoji:"👜", bg:"linear-gradient(135deg,#100020,#5500aa,#ff88ff)", price:389000, oldPrice:0,      sold:"523",   rating:4, badgeClass:"pcb-hot",  badgeText:"HOT",  cat:"accessory",desc:"Tas hologram eksklusif dengan efek shimmer 3D. Material vegan leather premium, kapasitas 20L.", bonus:[], reviews:[], flash:false },
  { id:"p7", name:"Galaxy Set Bundle",   emoji:"🛍️", bg:"linear-gradient(135deg,#001030,#0066ff,#00f5ff)", price:899000, oldPrice:1299000,sold:"1.2rb", rating:5, badgeClass:"pcb-sale", badgeText:"-31%", cat:"set",      desc:"Bundle Galaxy Set: jaket + kaos + celana cargo. Hemat 400rb vs beli satuan. Edisi terbatas 2077.", bonus:[], reviews:[], flash:true  },
  { id:"p8", name:"Pixel Storm Sneakers",emoji:"👠", bg:"linear-gradient(135deg,#0a0020,#004080,#ff00aa)", price:559000, oldPrice:0,      sold:"631",   rating:4, badgeClass:"pcb-new",  badgeText:"NEW",  cat:"shoes",    desc:"Sneakers platform edisi pixel storm dengan sol chunky 5cm. Upper metalik futuristik, insole memory foam.", bonus:[], reviews:[], flash:false },
];

export const CATEGORY_MAP = {
  outwear: { title: "KOLEKSI", span: "OUT WEAR", cat: "outwear" },
  accessory: { title: "KOLEKSI", span: "ACCESSORY", cat: "accessory" },
  device: { title: "KOLEKSI", span: "DEVICE", cat: "device" },
  utility: { title: "KOLEKSI", span: "UTILITY", cat: "utility" },
  clothing: { title: "KOLEKSI", span: "CLOTHING", cat: "clothing" },
  shoes: { title: "KOLEKSI", span: "SHOES", cat: "shoes" },
  set: { title: "KOLEKSI", span: "SET", cat: "set" },
  newarrivals: { title: "", span: "NEW ARRIVALS", cat: "all" },
  sale: { title: "", span: "SALE & PROMO", cat: "all" },
};

export const NAV_TABS = [
  { page: "home", label: "🏠 BERANDA" },
  { page: "outwear", label: "🧥 OUT WEAR" },
  { page: "accessory", label: "👜 ACCESSORY" },
  { page: "device", label: "⌚ DEVICE" },
  { page: "utility", label: "🧣 UTILITY" },
  { page: "clothing", label: "👗 CLOTHING" },
  { page: "shoes", label: "👠 SHOES" },
  { page: "set", label: "🛍️ SET" },
  { page: "newarrivals", label: "🆕 NEW ARRIVALS" },
  { page: "sale", label: "🏷️ SALE" },
  { page: "seller", label: "📦 JUAL" },
];

export const CAT_ITEMS = [
  { icon: "🧥", label: "OUT WEAR",     page: "outwear"     },
  { icon: "👜", label: "ACCESSORY",    page: "accessory"   },
  { icon: "⌚", label: "DEVICE",       page: "device"      },
  { icon: "🧣", label: "UTILITY",      page: "utility"     },
  { icon: "👗", label: "CLOTHING",     page: "clothing"    },
  { icon: "👠", label: "SHOES",        page: "shoes"       },
  { icon: "🛍️", label: "SET",          page: "set"         },
  { icon: "🆕", label: "NEW ARRIVALS", page: "newarrivals" },
  { icon: "🏷️", label: "SALE",         page: "sale"        },
];

export const BG_OPTIONS = [
  { value: "linear-gradient(135deg,#0d0020,#3d0080,#ff2d78)", label: "🌸 Neon Pink" },
  { value: "linear-gradient(135deg,#001530,#004060,#00f5ff)", label: "🌊 Ocean Cyan" },
  { value: "linear-gradient(135deg,#100020,#5500aa,#ff88ff)", label: "🦋 Cyber Purple" },
  { value: "linear-gradient(135deg,#0d0020,#5500aa,#ffe500)", label: "⚡ Thunder Yellow" },
  { value: "linear-gradient(135deg,#002010,#007050,#00f5c8)", label: "🌿 Aurora Green" },
  { value: "linear-gradient(135deg,#0a0000,#800020,#ff2d78)", label: "🌹 Dark Rose" },
];

export const BADGE_OPTIONS = [
  { value: "pcb-new|NEW", label: "🆕 NEW" },
  { value: "pcb-hot|HOT", label: "🔥 HOT" },
  { value: "pcb-sale|SALE", label: "🏷️ SALE" },
];

export const PROVINCES = [
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur",
  "Bali", "Sumatera Utara", "Sulawesi Selatan", "Kalimantan Timur",
];

export const COUPONS = {
  NEX20:   0.20,
  PIXEL50: 0.10,
  CYBER15: 0.15,
};

export const DEFAULT_ADDRESSES = [
  { id: "a1", name: "Nexwear User", phone: "+62 812-3456-7890", street: "Jl. Galaxy No. 77", city: "Bandung", postal: "40132", prov: "Jawa Barat" },
  { id: "a2", name: "Nexwear User 2", phone: "+62 813-9876-5432", street: "Jl. Pixel Blok C No. 12", city: "Jakarta", postal: "12345", prov: "DKI Jakarta" },
];