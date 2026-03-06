// ─────────────────────────────────────────
//  src/store/useStore.js
// ─────────────────────────────────────────

import { supabase } from '../supabase'
import { useState, useMemo, useCallback, useEffect } from "react";
import { COUPONS } from "../data/products";
import { genId } from "../utils";

export function useStore() {

  // ─────────────────────────────────────────
  //  CURRENT USER
  // ─────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ─────────────────────────────────────────
  //  PRODUCTS
  // ─────────────────────────────────────────
  const [products, setProducts]             = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);

  useEffect(() => {
    supabase.from('products').select('*').then(({ data, error }) => {
      if (error) { console.error('❌ Products error:', error); return; }
      setProducts(data.map(p => ({
        ...p,
        id:         'p' + p.id,
        oldPrice:   p.old_price,
        desc:       p.description,
        badgeClass: p.badge_class,
        badgeText:  p.badge_text,
        reviews:    [],
        bonus:      [],
        stock:      p.stock ?? 100,
      })))
    })
  }, [])

  useEffect(() => {
    supabase.from('seller_products').select('*').then(({ data, error }) => {
      if (error) { console.error('❌ Seller products error:', error); return; }
      setSellerProducts((data || []).map(p => ({
        ...p,
        oldPrice:   p.old_price,
        desc:       p.description,
        badgeClass: p.badge_class,
        badgeText:  p.badge_text,
        bonus:      p.bonus || [],
        reviews:    [],
        stock:      p.stock ?? 0,
      })))
    })
  }, [currentUser])

  // Load reviews dan distribute ke produk
  useEffect(() => {
    supabase.from('reviews').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) { console.error('❌ Reviews error:', error); return; }
      const reviews = data || [];
      setProducts(prev => prev.map(p => ({
        ...p,
        reviews: reviews.filter(r => r.product_id === p.id),
      })));
      setSellerProducts(prev => prev.map(p => ({
        ...p,
        reviews: reviews.filter(r => r.product_id === p.id),
      })));
    })
  }, [])

  // ─────────────────────────────────────────
  //  CART
  // ─────────────────────────────────────────
  const [cart, setCart] = useState([]);

  // ─────────────────────────────────────────
  //  ORDERS (per user)
  // ─────────────────────────────────────────
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Orders error:', error)
        else setOrders(data || [])
      })
  }, [currentUser])

  // ─────────────────────────────────────────
  //  ADDRESS — tersimpan ke Supabase
  // ─────────────────────────────────────────
  const [addresses, setAddresses]                 = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Load alamat dari Supabase saat user login
  useEffect(() => {
    if (!currentUser) {
      setAddresses([]);
      setSelectedAddressId(null);
      return;
    }
    supabase
      .from('addresses')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) { console.error('❌ Addresses error:', error); return; }
        const addrs = data || [];
        setAddresses(addrs);
        // Auto-pilih alamat pertama kalau belum ada yang dipilih
        if (addrs.length > 0 && !selectedAddressId) {
          setSelectedAddressId(addrs[0].id);
        }
      })
  }, [currentUser])

  // ─────────────────────────────────────────
  //  CHECKOUT EXTRAS
  // ─────────────────────────────────────────
  const [shippingCost, setShippingCost]     = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // ─────────────────────────────────────────
  //  DERIVED
  // ─────────────────────────────────────────
  const allProducts = useMemo(
    () => [...products, ...sellerProducts],
    [products, sellerProducts]
  );
  const cartTotal = useMemo(
    () => cart.reduce((s, ci) => s + ci.price * ci.qty, 0),
    [cart]
  );
  const cartCount = useMemo(
    () => cart.reduce((s, ci) => s + ci.qty, 0),
    [cart]
  );

  // ─────────────────────────────────────────
  //  CART ACTIONS
  // ─────────────────────────────────────────
  const addToCart = useCallback((product, size = "M", color = "Neon Pink", qty = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (ci) => ci.productId === product.id && ci.size === size && ci.color === color
      );
      if (existing) {
        return prev.map((ci) =>
          ci.id === existing.id ? { ...ci, qty: ci.qty + qty } : ci
        );
      }
      return [...prev, {
        id:        genId("ci"),
        productId: product.id,
        name:      product.name,
        emoji:     product.emoji,
        bg:        product.bg,
        price:     product.price,
        size,
        color,
        qty,
      }];
    });
  }, []);

  const removeFromCart = useCallback((cartItemId) => {
    setCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
  }, []);

  const updateCartQty = useCallback((cartItemId, delta) => {
    setCart((prev) =>
      prev.map((ci) =>
        ci.id === cartItemId ? { ...ci, qty: Math.max(1, ci.qty + delta) } : ci
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ─────────────────────────────────────────
  //  COUPON
  // ─────────────────────────────────────────
  const applyCoupon = useCallback((code) => {
    const rate = COUPONS[code.toUpperCase()] || 0;
    if (rate) { setCouponDiscount(Math.floor(cartTotal * rate)); return true; }
    setCouponDiscount(0);
    return false;
  }, [cartTotal]);

  // ─────────────────────────────────────────
  //  ORDER — + update sold & stock otomatis
  // ─────────────────────────────────────────
  const placeOrder = useCallback(async (orderData) => {
    const newOrder = {
      total:   orderData.total,
      status:  'Dikemas',
      date:    new Date().toLocaleDateString('id-ID'),
      courier: orderData.courier,
      payment: orderData.payment,
      address: orderData.address,
      user_id: currentUser?.id,
    }

    const { data, error } = await supabase
      .from('orders').insert(newOrder).select().single()
    if (error) { console.error('Gagal simpan order:', error); return; }

    // Simpan order items
    const items = cart.map(item => ({
      order_id:   data.id,
      product_id: String(item.productId || item.id),
      name:       item.name,
      price:      item.price,
      qty:        item.qty,
      size:       item.size,
      color:      item.color,
      emoji:      item.emoji,
      bg:         item.bg || '#0a0519',
    }))
    await supabase.from('order_items').insert(items)

    // Update sold & stock untuk setiap produk yang dibeli
    for (const item of cart) {
      const pid = String(item.productId || item.id);
      const qtyBought = item.qty;

      if (pid.startsWith('p')) {
        const numericId = parseInt(pid.replace('p', ''));
        const prod = products.find(p => p.id === pid);
        if (prod) {
          const newSold  = (parseInt(prod.sold) || 0) + qtyBought;
          const newStock = Math.max(0, (prod.stock ?? 100) - qtyBought);
          await supabase.from('products').update({ sold: String(newSold), stock: newStock }).eq('id', numericId);
          setProducts(prev => prev.map(p =>
            p.id === pid ? { ...p, sold: String(newSold), stock: newStock } : p
          ));
        }
      } else {
        const prod = sellerProducts.find(p => p.id === pid);
        if (prod) {
          const newSold    = (parseInt(prod.sold) || 0) + qtyBought;
          const newStock   = Math.max(0, (prod.stock ?? 0) - qtyBought);
          const newRevenue = (prod.revenue || 0) + (item.price * qtyBought);
          await supabase.from('seller_products').update({ sold: String(newSold), stock: newStock, revenue: newRevenue }).eq('id', pid);
          setSellerProducts(prev => prev.map(p =>
            p.id === pid ? { ...p, sold: String(newSold), stock: newStock, revenue: newRevenue } : p
          ));
        }
      }
    }

    setOrders(prev => [{ ...data, order_items: items }, ...prev])
    clearCart();
    setCouponDiscount(0);
    setShippingCost(0);
  }, [cart, currentUser, products, sellerProducts, clearCart])

  // ─────────────────────────────────────────
  //  ORDER STATUS ACTIONS
  // ─────────────────────────────────────────
  const cancelOrder = useCallback(async (orderId) => {
    const { error } = await supabase.from('orders').delete().eq('id', orderId)
    if (error) { console.error('Gagal cancel order:', error); return; }
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  const completeOrder = useCallback(async (orderId) => {
    const { error } = await supabase.from('orders').update({ status: 'Selesai' }).eq('id', orderId)
    if (error) { console.error('Gagal complete order:', error); return; }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Selesai' } : o));
  }, []);

  // ─────────────────────────────────────────
  //  REVIEWS — simpan ke Supabase
  // ─────────────────────────────────────────
  const addReview = useCallback(async (productId, review) => {
    const record = {
      product_id:   productId,
      product_type: String(productId).startsWith('p') ? 'regular' : 'seller',
      author:       review.author,
      star:         review.star,
      text:         review.text,
      date:         review.date,
    }

    const { data, error } = await supabase.from('reviews').insert(record).select().single()
    if (error) { console.error('Gagal simpan review:', error); return; }

    const newReview = { ...record, id: data.id };

    if (String(productId).startsWith('p')) {
      setProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, reviews: [newReview, ...p.reviews] } : p
      ));
    } else {
      setSellerProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, reviews: [newReview, ...p.reviews] } : p
      ));
    }
  }, []);

  // ─────────────────────────────────────────
  //  SELLER PRODUCTS ACTIONS
  // ─────────────────────────────────────────
  const saveSellerProduct = useCallback(async (data, editingId) => {
    const record = {
      id:          editingId || genId("sp"),
      name:        data.name        || "",
      price:       data.price       || 0,
      old_price:   data.oldPrice    || 0,
      emoji:       data.emoji       || "🌸",
      bg:          data.bg          || "linear-gradient(135deg,#0d0020,#3d0080,#ff2d78)",
      cat:         data.cat         || "bikini",
      badge_class: data.badgeClass  || "pcb-new",
      badge_text:  data.badgeText   || "NEW",
      sold:        data.sold        || "0",
      rating:      data.rating      || 5,
      description: data.desc        || "",
      flash:       data.flash       || false,
      stock:       data.stock       || 0,
      revenue:     data.revenue     || 0,
      bonus:       data.bonus       || [],
      user_id:     currentUser?.id,
    }

    if (editingId) {
      const { error } = await supabase.from('seller_products').update(record).eq('id', editingId).eq('user_id', currentUser?.id)
      if (error) { console.error('Gagal update produk:', error); return; }
      setSellerProducts(prev => prev.map(p =>
        p.id === editingId
          ? { ...p, ...data, oldPrice: record.old_price, desc: record.description, badgeClass: record.badge_class, badgeText: record.badge_text }
          : p
      ))
    } else {
      const { error } = await supabase.from('seller_products').insert(record)
      if (error) { console.error('Gagal tambah produk:', error); return; }
      setSellerProducts(prev => [...prev, {
        ...record,
        oldPrice:   record.old_price,
        desc:       record.description,
        badgeClass: record.badge_class,
        badgeText:  record.badge_text,
        reviews:    [],
      }])
    }
  }, [currentUser])

  const deleteSellerProduct = useCallback(async (id) => {
    const { error } = await supabase.from('seller_products').delete().eq('id', id).eq('user_id', currentUser?.id)
    if (error) { console.error('Gagal hapus produk:', error); return; }
    setSellerProducts(prev => prev.filter(p => p.id !== id))
  }, [currentUser])

  // ─────────────────────────────────────────
  //  ADDRESS ACTIONS — tersimpan ke Supabase
  // ─────────────────────────────────────────
  const saveAddress = useCallback(async (formData) => {
    if (!currentUser) return null;

    const newAddr = {
      id:      genId("a"),
      user_id: currentUser.id,
      name:    formData.name,
      phone:   formData.phone,
      street:  formData.street,
      city:    formData.city,
      postal:  formData.postal,
      prov:    formData.prov,
    };

    const { error } = await supabase.from('addresses').insert(newAddr);
    if (error) { console.error('Gagal simpan alamat:', error); return null; }

    setAddresses(prev => [...prev, newAddr]);
    setSelectedAddressId(newAddr.id);
    return newAddr;
  }, [currentUser]);

  const deleteAddress = useCallback(async (id) => {
    const { error } = await supabase.from('addresses').delete().eq('id', id).eq('user_id', currentUser?.id);
    if (error) { console.error('Gagal hapus alamat:', error); return; }
    setAddresses(prev => prev.filter(a => a.id !== id));
    setSelectedAddressId(prev => (prev === id ? (addresses.find(a => a.id !== id)?.id || null) : prev));
  }, [currentUser, addresses]);

  // ─────────────────────────────────────────
  //  RETURN
  // ─────────────────────────────────────────
  return {
    currentUser,
    allProducts,
    sellerProducts,
    cart,
    cartTotal,
    cartCount,
    orders,
    addresses,
    selectedAddressId,
    shippingCost,
    couponDiscount,
    setOrders,
    setSelectedAddressId,
    setShippingCost,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    applyCoupon,
    placeOrder,
    cancelOrder,
    completeOrder,
    addReview,
    saveSellerProduct,
    deleteSellerProduct,
    saveAddress,
    deleteAddress,
  };
}