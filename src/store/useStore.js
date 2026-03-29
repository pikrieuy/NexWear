// ─────────────────────────────────────────
//  src/store/useStore.js
// ─────────────────────────────────────────

import { supabase } from '../supabase'
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { COUPONS } from "../data/products";
import { genId } from "../utils";

export function useStore() {

  // ─────────────────────────────────────────
  //  CURRENT USER
  // ─────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);
  const currentUserRef = useRef(null);
  const cartRef        = useRef([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      currentUserRef.current = user;
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      currentUserRef.current = user;
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
        image_url:  p.image_url || "",
        reviews:    [],
        stock:      p.stock ?? 0,
      })))
    })
  }, [currentUser])

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
  useEffect(() => { cartRef.current = cart; }, [cart]);

  // ─────────────────────────────────────────
  //  ORDERS
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
  //  ADDRESS
  // ─────────────────────────────────────────
  const [addresses, setAddresses]                 = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

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
        if (addrs.length > 0) {
          setSelectedAddressId(prev => prev || addrs[0].id);
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
  const addToCart = useCallback((product, size = "M", color = "", qty = 1) => {
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
        image_url: product.image_url || "",
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
  //  ORDER — pakai ref supaya tidak stale closure
  // ─────────────────────────────────────────
  const placeOrder = useCallback(async (orderData) => {
    // Pakai ref untuk dapat nilai terbaru, bukan closure yang bisa stale
    const currentCart = cartRef.current;
    const user        = currentUserRef.current;

    console.log('🛒 placeOrder dipanggil, user:', user?.id, 'cart:', currentCart.length);

    if (!user) { console.error('❌ User belum login!'); return; }
    if (!currentCart.length) { console.error('❌ Cart kosong!'); return; }

    const newOrder = {
      total:   orderData.total,
      status:  'Dikemas',
      date:    new Date().toLocaleDateString('id-ID'),
      courier: orderData.courier,
      payment: orderData.payment,
      address: orderData.address,
      user_id: user.id,
    }

    const { data, error } = await supabase
      .from('orders').insert(newOrder).select().single()
    if (error) { console.error('❌ Gagal simpan order:', error); return; }
    console.log('✅ Order tersimpan:', data.id)

    const items = currentCart.map(item => ({
      order_id:   data.id,
      product_id: String(item.productId || item.id),
      name:       item.name,
      price:      item.price,
      qty:        item.qty,
      size:       item.size,
      color:      item.color,
      emoji:      item.emoji,
      bg:         item.bg || '#0a0519',
      image_url:  item.image_url || '',
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(items)
    if (itemsError) { console.error('❌ Gagal simpan items:', itemsError); return; }
    console.log('✅ Items tersimpan, update sold/stock...')

    // Update sold & stock — fetch fresh dari DB supaya tidak stale
    for (const item of currentCart) {
      const pid       = String(item.productId || item.id);
      const qtyBought = item.qty;

      if (pid.startsWith('p')) {
        const numericId = parseInt(pid.replace('p', ''));
        const { data: freshProd } = await supabase
          .from('products').select('sold, stock').eq('id', numericId).single()
        if (!freshProd) continue;

        const stockAvailable = parseInt(freshProd.stock ?? 100, 10);
        if (stockAvailable < qtyBought) {
          window.dispatchEvent(new CustomEvent('toast', { detail: `❌ Maaf, stok ${item.name} tidak cukup. (Sisa: ${stockAvailable})` }));
          continue; // skip updating DB for this item, but since it's order_items, we should ideally rollback. We just skip negative stock here.
        }

        const newSold  = parseInt(freshProd.sold || 0, 10) + qtyBought;
        const newStock = stockAvailable - qtyBought;

        await supabase.from('products').update({ sold: newSold, stock: newStock }).eq('id', numericId)
        setProducts(prev => prev.map(p =>
          p.id === pid ? { ...p, sold: newSold, stock: newStock } : p
        ));
        console.log(`✅ ${pid}: sold=${newSold}, stock=${newStock}`)

      } else {
        const { data: freshProd } = await supabase
          .from('seller_products').select('sold, stock, revenue').eq('id', pid).single()
        if (!freshProd) continue;

        const stockAvailable = parseInt(freshProd.stock ?? 0, 10);
        if (stockAvailable < qtyBought) {
          window.dispatchEvent(new CustomEvent('toast', { detail: `❌ Maaf, stok ${item.name} tidak cukup. (Sisa: ${stockAvailable})` }));
          continue;
        }

        const newSold    = parseInt(freshProd.sold || 0, 10) + qtyBought;
        const newStock   = stockAvailable - qtyBought;
        const newRevenue = (freshProd.revenue || 0) + (item.price * qtyBought);

        await supabase.from('seller_products').update({ sold: newSold, stock: newStock, revenue: newRevenue }).eq('id', pid)
        setSellerProducts(prev => prev.map(p =>
          p.id === pid ? { ...p, sold: newSold, stock: newStock, revenue: newRevenue } : p
        ));
        console.log(`✅ seller ${pid}: sold=${newSold}, stock=${newStock}`)
      }
    }

    setOrders(prev => [{ ...data, order_items: items }, ...prev])
    clearCart();
    setCouponDiscount(0);
    setShippingCost(0);
  }, [clearCart])

  // ─────────────────────────────────────────
  //  ORDER STATUS ACTIONS
  // ─────────────────────────────────────────
  const cancelOrder = useCallback(async (orderId) => {
    // Cari data order untuk merevert stok
    setOrders(prev => {
      const order = prev.find(o => o.id === orderId);
      if (order && (order.order_items || order.items)) {
        const items = order.order_items || order.items || [];
        
        // Group items to prevent concurrent read-modify-write on same product
        const grouped = {};
        items.forEach(item => {
           const pid = String(item.product_id || item.productId || item.id);
           if (!grouped[pid]) grouped[pid] = { ...item, totalRestoredQty: parseInt(item.qty, 10) };
           else grouped[pid].totalRestoredQty += parseInt(item.qty, 10);
        });

        // Revert stock sequentially
        const revertStock = async () => {
          for (const pid of Object.keys(grouped)) {
            const item = grouped[pid];
            const qty = item.totalRestoredQty;
            
            if (pid.startsWith('p')) {
              const numericId = parseInt(pid.replace('p', ''), 10);
              const { data: freshProd } = await supabase.from('products').select('sold, stock').eq('id', numericId).single();
              if (freshProd) {
                 const newSold = Math.max(0, parseInt(freshProd.sold || 0, 10) - qty);
                 const newStock = parseInt(freshProd.stock || 0, 10) + qty;
                 await supabase.from('products').update({ sold: newSold, stock: newStock }).eq('id', numericId);
              }
            } else {
              const { data: freshProd } = await supabase.from('seller_products').select('sold, stock, revenue').eq('id', pid).single();
              if (freshProd) {
                 const newSold = Math.max(0, parseInt(freshProd.sold || 0, 10) - qty);
                 const newStock = parseInt(freshProd.stock || 0, 10) + qty;
                 const newRev = Math.max(0, (parseFloat(freshProd.revenue) || 0) - (parseFloat(item.price) * qty));
                 await supabase.from('seller_products').update({ sold: newSold, stock: newStock, revenue: newRev }).eq('id', pid);
              }
            }
          }
        };
        revertStock();
      }
      return prev;
    });

    const { error: itemsError } = await supabase.from('order_items').delete().eq('order_id', orderId);
    if (itemsError) { console.error('Gagal hapus order items:', itemsError); return; }

    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (error) { console.error('Gagal cancel order:', error); return; }
    
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  const completeOrder = useCallback(async (orderId) => {
    const { error } = await supabase.from('orders').update({ status: 'Selesai' }).eq('id', orderId)
    if (error) { console.error('Gagal complete order:', error); return; }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Selesai' } : o));
  }, []);

  // ─────────────────────────────────────────
  //  REVIEWS
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
    const user = currentUserRef.current;
    const record = {
      id:          editingId || genId("sp"),
      name:        data.name        || "",
      price:       data.price       || 0,
      old_price:   data.oldPrice    || 0,
      emoji:       data.emoji       || "🌸",
      bg:          data.bg          || "linear-gradient(135deg,#0d0020,#3d0080,#ff2d78)",
      cat:         data.cat         || "clothing",
      badge_class: data.badgeClass  || "pcb-new",
      badge_text:  data.badgeText   || "NEW",
      sold:        0,
      rating:      data.rating      || 5,
      description: data.desc        || "",
      flash:       data.flash       || false,
      stock:       parseInt(data.stock, 10) || 0,
      revenue:     data.revenue     || 0,
      bonus:       data.bonus       || [],
      image_url:   data.image_url   || "",
      user_id:     user?.id,
    }
    if (editingId) {
      const { error } = await supabase.from('seller_products').update(record).eq('id', editingId).eq('user_id', user?.id)
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
  }, [])

  const deleteSellerProduct = useCallback(async (id) => {
    const user = currentUserRef.current;
    const { error } = await supabase.from('seller_products').delete().eq('id', id).eq('user_id', user?.id)
    if (error) { console.error('Gagal hapus produk:', error); return; }
    setSellerProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  // ─────────────────────────────────────────
  //  ADDRESS ACTIONS
  // ─────────────────────────────────────────
  const saveAddress = useCallback(async (formData) => {
    const user = currentUserRef.current;
    if (!user) return null;
    const newAddr = {
      id:      genId("a"),
      user_id: user.id,
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
  }, []);

  const deleteAddress = useCallback(async (id) => {
    const user = currentUserRef.current;
    const { error } = await supabase.from('addresses').delete().eq('id', id).eq('user_id', user?.id);
    if (error) { console.error('Gagal hapus alamat:', error); return; }
    setAddresses(prev => {
      const remaining = prev.filter(a => a.id !== id);
      setSelectedAddressId(remaining.length > 0 ? remaining[0].id : null);
      return remaining;
    });
  }, []);

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