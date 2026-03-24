// ─────────────────────────────────────────
//  src/App.jsx
// ─────────────────────────────────────────

import { useState, useCallback, useEffect } from "react";
import { supabase } from "./supabase";
import { useStore } from "./store/useStore";
import "./styles/global.css";

import StarField  from "./components/StarField";
import Header     from "./components/Header";
import Ticker     from "./components/Ticker";
import CartPanel  from "./components/CartPanel";
import BottomNav  from "./components/BottomNav";
import Toast      from "./components/Toast";

import AuthPage    from "./pages/AuthPage";
import HomePage    from "./pages/HomePage";
import DetailPage  from "./pages/DetailPage";
import { CategoryPage, SearchPage }          from "./pages/CategoryPages";
import { CartPage, AddressPage, CheckoutPage, SuccessPage } from "./pages/CheckoutPages";
import { OrdersPage, SellerPage, NotifPage, ChatPage } from "./pages/OtherPages";
import ProfilePage from "./pages/ProfilePage";

import { CATEGORY_MAP } from "./data/products";

export default function App() {
  const store = useStore();

  // ── Auth State ──
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    }).catch(() => {
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Routing State ──
  const [currentPage,   setCurrentPage]   = useState("home");
  const [pageParam,     setPageParam]     = useState(null);
  const [cartPanelOpen, setCartPanelOpen] = useState(false);
  const [searchVal,     setSearchVal]     = useState("");
  const [globalToast,   setGlobalToast]   = useState("");

  const showToast = (msg) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(""), 2500);
  };

  const navigate = useCallback((page, param) => {
    if (page === "cart_panel") { setCartPanelOpen(true); return; }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
    setPageParam(param || null);
  }, []);

  const handleAddCart = useCallback((product) => {
    store.addToCart(product);
    showToast(`✓ ${product.name} ditambahkan ke keranjang!`);
  }, [store]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("home");
    showToast("✓ Berhasil logout!");
  };

  const commonProps = {
    navigate,
    allProducts: store.allProducts,
    onAddCart:   handleAddCart,
  };

  const renderPage = () => {
    if (CATEGORY_MAP[currentPage]) {
      return <CategoryPage catKey={currentPage} {...commonProps} />;
    }

    switch (currentPage) {
      case "home":
        return <HomePage {...commonProps} />;


      case "search":
        return <SearchPage keyword={searchVal} {...commonProps} />;

      case "detail":
        return (
          <DetailPage
            productId={pageParam}
            allProducts={store.allProducts}
            navigate={navigate}
            addToCart={store.addToCart}
            addReview={store.addReview}
          />
        );

      case "cart":
        return (
          <CartPage
            cart={store.cart}
            cartTotal={store.cartTotal}
            couponDiscount={store.couponDiscount}
            navigate={navigate}
            removeFromCart={store.removeFromCart}
            updateCartQty={store.updateCartQty}
            applyCoupon={store.applyCoupon}
          />
        );

      case "address":
        return (
          <AddressPage
            addresses={store.addresses}
            selectedAddressId={store.selectedAddressId}
            setSelectedAddressId={store.setSelectedAddressId}
            saveAddress={store.saveAddress}
            deleteAddress={store.deleteAddress}
            navigate={navigate}
          />
        );

      case "checkout":
        return (
          <CheckoutPage
            cart={store.cart}
            cartTotal={store.cartTotal}
            couponDiscount={store.couponDiscount}
            addresses={store.addresses}
            selectedAddressId={store.selectedAddressId}
            shippingCost={store.shippingCost}
            setShippingCost={store.setShippingCost}
            navigate={navigate}
            placeOrder={store.placeOrder}
          />
        );

      case "success":
        return <SuccessPage navigate={navigate} />;

      case "orders":
        return (
          <OrdersPage
            orders={store.orders}
            cancelOrder={store.cancelOrder}      // ← FIX: ganti setOrders
            completeOrder={store.completeOrder}  // ← FIX: tambah completeOrder
            navigate={navigate}
          />
        );

      case "seller":
        return (
          <SellerPage
            sellerProducts={store.sellerProducts}
            orders={store.orders}
            navigate={navigate}
            saveSellerProduct={store.saveSellerProduct}
            deleteSellerProduct={store.deleteSellerProduct}
            currentUser={store.currentUser}      // ← FIX: tambah currentUser
          />
        );

      case "profile":
        return <ProfilePage user={user} navigate={navigate} />;

      case "notif":
        return <NotifPage navigate={navigate} />;

      case "chat":
        return <ChatPage navigate={navigate} />;

      default:
        return <HomePage {...commonProps} />;
    }
  };

  // ── Loading ──
  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#05020f", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: "#ff2d78", letterSpacing: 3, textShadow: "0 0 20px rgba(255,45,120,0.5)", animation: "pulse 1.5s ease-in-out infinite" }}>
          NEXWEAR
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'Share Tech Mono', monospace", letterSpacing: 2 }}>
          LOADING...
        </div>
      </div>
    );
  }

  // ── Belum login ──
  if (!user) {
    return (
      <>
        <StarField />
        <AuthPage onLogin={setUser} />
      </>
    );
  }

  // ── Sudah login ──
  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <StarField />
      <Toast msg={globalToast} />

      <Header
        currentPage={currentPage}
        navigate={navigate}
        cartCount={store.cartCount}
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        user={user}
        onLogout={handleLogout}
      />

      <Ticker />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1300, margin: "0 auto", padding: "0 0 40px" }}>
        {renderPage()}
      </main>

      <CartPanel
        isOpen={cartPanelOpen}
        onClose={() => setCartPanelOpen(false)}
        cart={store.cart}
        navigate={navigate}
      />

      <BottomNav
        currentPage={currentPage}
        navigate={navigate}
        cartCount={store.cartCount}
      />
    </div>
  );
}