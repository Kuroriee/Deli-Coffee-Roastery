import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "../context/CartContext";
import { useCatalog } from "../hooks/useCatalog";
import { useCheckout } from "../hooks/useCheckout";

import CartItems from "../components/cart/CartItems";
import CustomerForm from "../components/cart/CustomerForm";
import ShippingZoneSelector from "../components/cart/ShippingZoneSelector";
import Recommendations from "../components/cart/Recommendations";
import OrderSummary from "../components/cart/OrderSummary";

const pickRecommendations = (products, items) => {
  if (!products || products.length === 0) return [];
  const inCartIds = new Set(items.map((i) => i.id));
  const cartCategories = new Set(
    items
      .map((i) => products.find((p) => p.id === i.id)?.category)
      .filter(Boolean)
  );
  const eligible = products.filter((p) => !inCartIds.has(p.id) && p.active !== false);
  const scored = eligible.map((p) => ({
    p,
    score:
      (cartCategories.has(p.category) ? 2 : 0) +
      (p.badge === "Premium" || p.badge === "Eksklusif" ? 1 : 0) +
      Math.random() * 0.5,
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map((s) => s.p);
};

const CartPage = () => {
  const { items, updateQty, removeItem, clear, addItem, total: subtotal, count } = useCart();
  const { brand, zones, products } = useCatalog();
  const [zoneId, setZoneId] = useState(null);

  useEffect(() => {
    if (zones && zones.length && !zoneId) {
      const pickup = zones.find((z) => z.cost === 0);
      setZoneId((pickup || zones[0]).id);
    }
  }, [zones, zoneId]);

  const zone = useMemo(() => zones.find((z) => z.id === zoneId) || null, [zones, zoneId]);
  const shipping = zone?.cost || 0;
  const total = subtotal + shipping;
  const admins = brand.admins || [];

  const { customer, setCustomer, submitting, canSubmit, submitOrder } = useCheckout({
    items,
    zone,
    subtotal,
    shipping,
  });

  const recommendations = useMemo(() => pickRecommendations(products, items), [products, items]);

  const quickAdd = (p) => {
    addItem({ id: p.id, name: p.name, price: p.price, qty: 1, process: p.process });
    toast.success(`${p.name} ditambahkan`);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 md:py-16">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#1B7A43] font-semibold">
            Keranjang Pesanan
          </div>
          <h1 className="font-serif-warm text-4xl md:text-5xl mt-2 text-[#3B2412]">
            Rangkuman pesanan Anda
          </h1>
          <p className="mt-2 text-[#3B2412]/75 max-w-xl">
            Isi kontak Anda, pilih zona pengiriman, lalu tekan “Pesan Sekarang” — ringkasan otomatis
            terkirim ke WhatsApp admin dan tercatat di sistem kami.
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1 text-sm text-[#3B2412]/70 hover:text-[#7B1F32]"
          >
            <Trash2 className="h-4 w-4" /> Kosongkan keranjang
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <CartItems items={items} updateQty={updateQty} removeItem={removeItem} />
            <Recommendations items={recommendations} onAdd={quickAdd} />
            <CustomerForm customer={customer} onChange={setCustomer} />
            <ShippingZoneSelector zones={zones} zoneId={zoneId} onSelect={setZoneId} />
          </div>
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            count={count}
            zoneName={zone?.name}
            admins={admins}
            instagramUrl={brand.instagramUrl}
            canSubmit={canSubmit}
            submitting={submitting}
            onOrder={submitOrder}
          />
        </div>
      )}
    </div>
  );
};

const EmptyCart = () => (
  <div className="mt-14 rounded-3xl border border-[#3B2412]/15 bg-[#FBF6EC] p-10 text-center">
    <div className="h-14 w-14 mx-auto rounded-full bg-[#3B2412] text-[#F6EFE4] flex items-center justify-center">
      <ShoppingBag className="h-6 w-6" />
    </div>
    <h2 className="mt-4 font-serif-warm text-2xl text-[#3B2412]">Keranjang masih kosong</h2>
    <p className="mt-2 text-[#3B2412]/70">
      Yuk pilih kopi favorit Anda dulu, lalu kembali ke sini untuk memesan.
    </p>
    <Link
      to="/katalog"
      className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold mt-6"
    >
      Jelajahi Katalog <ArrowRight className="h-4 w-4" />
    </Link>
  </div>
);

export default CartPage;
