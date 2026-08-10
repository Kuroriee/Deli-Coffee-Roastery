import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Minus, Plus, Trash2, MessageCircle, Instagram, ShoppingBag,
  ArrowRight, Truck, Info, User, Phone, StickyNote, Loader2, Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../hooks/useCatalog";
import { formatRupiah } from "../mock/mock";
import { publicApi } from "../lib/api";
import { toast } from "sonner";

const STORAGE_CUSTOMER = "deli_coffee_customer_v1";

const CartPage = () => {
  const { items, updateQty, removeItem, clear, addItem, total: subtotal, count } = useCart();
  const { brand, zones, products, houseBlend } = useCatalog();
  const [zoneId, setZoneId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [customer, setCustomer] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOMER);
      return raw ? JSON.parse(raw) : { name: "", phone: "", note: "" };
    } catch (err) {
      console.warn("CartPage: gagal baca customer info", err);
      return { name: "", phone: "", note: "" };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOMER, JSON.stringify(customer));
    } catch (err) {
      console.warn("CartPage: gagal simpan customer info ke localStorage", err);
    }
  }, [customer]);

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

  // "Sering dibeli bersama" — prioritas kategori yang sama, keluarkan yang sudah di keranjang
  const recommendations = useMemo(() => {
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
  }, [products, items]);

  const quickAdd = (p) => {
    addItem({ id: p.id, name: p.name, price: p.price, qty: 1, process: p.process });
    toast.success(`${p.name} ditambahkan`);
  };

  const canSubmit =
    items.length > 0 &&
    customer.name.trim().length >= 2 &&
    customer.phone.trim().length >= 6;

  const submitOrder = async (admin) => {
    if (!canSubmit) {
      toast.error("Isi nama & nomor HP terlebih dahulu (min 2 & 6 karakter)");
      return;
    }
    setSubmitting(true);
    try {
      const res = await publicApi.createOrder({
        customer_name: customer.name.trim(),
        customer_phone: customer.phone.trim(),
        customer_note: customer.note?.trim() || "",
        items: items.map((i) => ({
          product_id: i.id,
          name: i.name,
          variant: i.variant || "",
          price: Number(i.price),
          qty: Number(i.qty),
        })),
        zone_id: zone?.id || "",
        zone_name: zone?.name || "",
        shipping_cost: shipping,
        admin_phone: admin.phone,
        admin_name: admin.name,
      });
      // open WA in new tab
      window.open(res.wa_url, "_blank", "noopener,noreferrer");
      toast.success("Pesanan dicatat. Membuka WhatsApp…");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Gagal membuat pesanan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 md:py-16">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#1B7A43] font-semibold">Keranjang Pesanan</div>
          <h1 className="font-serif-warm text-4xl md:text-5xl mt-2 text-[#3B2412]">Rangkuman pesanan Anda</h1>
          <p className="mt-2 text-[#3B2412]/75 max-w-xl">
            Isi kontak Anda, pilih zona pengiriman, lalu tekan “Pesan Sekarang” — ringkasan otomatis
            terkirim ke WhatsApp admin dan tercatat di sistem kami.
          </p>
        </div>
        {items.length > 0 && (
          <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-sm text-[#3B2412]/70 hover:text-[#7B1F32]">
            <Trash2 className="h-4 w-4" /> Kosongkan keranjang
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-14 rounded-3xl border border-[#3B2412]/15 bg-[#FBF6EC] p-10 text-center">
          <div className="h-14 w-14 mx-auto rounded-full bg-[#3B2412] text-[#F6EFE4] flex items-center justify-center">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-serif-warm text-2xl text-[#3B2412]">Keranjang masih kosong</h2>
          <p className="mt-2 text-[#3B2412]/70">Yuk pilih kopi favorit Anda dulu, lalu kembali ke sini untuk memesan.</p>
          <Link to="/katalog" className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold mt-6">
            Jelajahi Katalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {/* Items */}
            {items.map((item) => (
              <div key={`${item.id}-${item.variant || ""}`} className="rounded-2xl border border-[#3B2412]/10 bg-[#FBF6EC] p-4 md:p-5 flex flex-col sm:flex-row gap-4">
                <div className="h-20 w-20 rounded-xl bg-[#3B2412] text-[#F6EFE4] flex items-center justify-center font-serif-warm text-xl flex-shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-start justify-between">
                    <div>
                      <h3 className="font-serif-warm text-lg text-[#3B2412]">{item.name}</h3>
                      <div className="text-xs text-[#3B2412]/60">{item.variant || item.process || "1 kg per unit"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#3B2412]/60">{formatRupiah(item.price)} / kg</div>
                      <div className="font-serif-warm text-xl text-[#1B7A43]">{formatRupiah(item.price * item.qty)}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-[#3B2412]/25 overflow-hidden">
                      <button type="button" onClick={() => updateQty(item.id, item.variant, item.qty - 1)} className="qty-btn h-9 w-9 flex items-center justify-center text-[#3B2412]"><Minus className="h-4 w-4" /></button>
                      <div className="w-12 text-center text-sm font-semibold">{item.qty} kg</div>
                      <button type="button" onClick={() => updateQty(item.id, item.variant, item.qty + 1)} className="qty-btn h-9 w-9 flex items-center justify-center text-[#3B2412]"><Plus className="h-4 w-4" /></button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.id, item.variant)} className="inline-flex items-center gap-1 text-xs text-[#3B2412]/60 hover:text-[#7B1F32]">
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Rekomendasi — Sering Dibeli Bersama */}
            {recommendations.length > 0 && (
              <div className="rounded-2xl border border-[#3B2412]/10 bg-[#FBF6EC] p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#C9A227]" />
                  <div className="text-xs uppercase tracking-widest text-[#3B2412]/60 font-semibold">
                    Sering Dibeli Bersama
                  </div>
                </div>
                <p className="mt-1 text-xs text-[#3B2412]/70">
                  Pelanggan lain juga suka menambah kopi ini ke keranjang mereka.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {recommendations.map((p) => (
                    <div key={p.id} className="rounded-xl bg-[#F6EFE4] border border-[#3B2412]/10 overflow-hidden flex flex-col">
                      <div className="aspect-square bg-[#3B2412]/5 overflow-hidden">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#3B2412]/30 text-xs">Tanpa foto</div>
                        )}
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <div className="text-[10px] uppercase tracking-widest text-[#3B2412]/60">
                          {p.process || p.region || ""}
                        </div>
                        <div className="font-serif-warm text-sm text-[#3B2412] leading-tight line-clamp-2">{p.name}</div>
                        <div className="mt-1 text-sm font-semibold text-[#1B7A43]">{formatRupiah(p.price)}/kg</div>
                        <button
                          type="button"
                          onClick={() => quickAdd(p)}
                          className="mt-auto pt-2 btn-outline rounded-full h-8 text-[11px] font-semibold inline-flex items-center justify-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Tambahkan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer contact */}
            <div className="rounded-2xl border border-[#3B2412]/10 bg-[#FBF6EC] p-5">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#1B7A43]" />
                <div className="text-xs uppercase tracking-widest text-[#3B2412]/60 font-semibold">
                  Kontak Anda
                </div>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-[#3B2412]/60 font-semibold">Nama lengkap</label>
                  <div className="mt-1 flex items-center gap-2 bg-[#F6EFE4] rounded-xl border border-[#3B2412]/20 px-3">
                    <User className="h-4 w-4 text-[#3B2412]/40" />
                    <input
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="mis. Rina P."
                      className="flex-1 bg-transparent py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-[#3B2412]/60 font-semibold">No. HP / WA</label>
                  <div className="mt-1 flex items-center gap-2 bg-[#F6EFE4] rounded-xl border border-[#3B2412]/20 px-3">
                    <Phone className="h-4 w-4 text-[#3B2412]/40" />
                    <input
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="0812-xxxx-xxxx"
                      className="flex-1 bg-transparent py-2.5 text-sm outline-none"
                      inputMode="tel"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-widest text-[#3B2412]/60 font-semibold">Catatan (opsional)</label>
                  <div className="mt-1 flex items-start gap-2 bg-[#F6EFE4] rounded-xl border border-[#3B2412]/20 px-3">
                    <StickyNote className="h-4 w-4 text-[#3B2412]/40 mt-2.5" />
                    <textarea
                      value={customer.note}
                      onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
                      placeholder="Grind halus, pengiriman siang, dsb."
                      className="flex-1 bg-transparent py-2.5 text-sm outline-none min-h-[60px] resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping zones */}
            {zones && zones.length > 0 && (
              <div className="rounded-2xl border border-[#3B2412]/10 bg-[#FBF6EC] p-5">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#1B7A43]" />
                  <div className="text-xs uppercase tracking-widest text-[#3B2412]/60 font-semibold">Zona Pengiriman</div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {zones.map((z) => {
                    const active = zoneId === z.id;
                    return (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => setZoneId(z.id)}
                        className={`text-left rounded-2xl border p-3 transition-colors ${
                          active
                            ? "border-[#1B7A43] bg-[#1B7A43]/5"
                            : "border-[#3B2412]/15 hover:border-[#1B7A43]/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-sm text-[#3B2412]">{z.name}</div>
                          <div className="text-sm font-semibold text-[#1B7A43]">
                            {z.cost === 0 ? "Gratis" : formatRupiah(z.cost)}
                          </div>
                        </div>
                        {z.description && <div className="text-xs text-[#3B2412]/70 mt-0.5">{z.description}</div>}
                        {z.eta && <div className="text-[10px] text-[#3B2412]/50 mt-1 uppercase tracking-widest">ETA: {z.eta}</div>}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 text-[11px] text-[#3B2412]/60 flex items-start gap-1">
                  <Info className="h-3 w-3 mt-0.5" />
                  Ongkir bersifat estimasi. Admin akan konfirmasi jika ada penyesuaian saat WhatsApp.
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit rounded-3xl bg-[#3B2412] text-[#F6EFE4] p-6">
            <h2 className="font-serif-warm text-2xl">Ringkasan</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#F6EFE4]/75">Item</span><span>{count} kg</span></div>
              <div className="flex justify-between"><span className="text-[#F6EFE4]/75">Subtotal</span><span>{formatRupiah(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[#F6EFE4]/75">Pengiriman{zone ? ` — ${zone.name}` : ""}</span><span>{shipping === 0 ? "Gratis" : formatRupiah(shipping)}</span></div>
              <div className="flex justify-between pt-2 border-t border-[#F6EFE4]/10"><span className="font-semibold">Estimasi total</span><span className="font-bold text-[#C9A227]">{formatRupiah(total)}</span></div>
            </div>

            {!canSubmit && (
              <div className="mt-4 text-xs bg-[#C9A227]/20 border border-[#C9A227]/40 rounded-xl p-3 text-[#F6EFE4]">
                Isi nama & nomor HP di atas untuk mengaktifkan tombol Pesan Sekarang.
              </div>
            )}

            <div className="mt-6 space-y-2">
              {admins[0] && (
                <button
                  type="button"
                  disabled={!canSubmit || submitting}
                  onClick={() => submitOrder(admins[0])}
                  className="btn-amber w-full rounded-full h-12 inline-flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                  Pesan Sekarang — WhatsApp {admins[0].name}
                </button>
              )}
              {admins[1] && (
                <button
                  type="button"
                  disabled={!canSubmit || submitting}
                  onClick={() => submitOrder(admins[1])}
                  className="w-full rounded-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-[#1B7A43] hover:bg-[#145F34] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="h-4 w-4" /> Alternatif: {admins[1].name}
                </button>
              )}
              <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-full rounded-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold border border-[#F6EFE4]/40 hover:bg-[#F6EFE4] hover:text-[#3B2412] transition-colors">
                <Instagram className="h-4 w-4" /> Chat via Instagram
              </a>
            </div>

            <div className="mt-6 text-[10px] uppercase tracking-widest text-[#F6EFE4]/50">
              Pesanan tercatat di sistem kami sebagai referensi. Konfirmasi tetap dilakukan via chat.
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;
