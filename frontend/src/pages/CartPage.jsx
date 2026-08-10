import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Minus, Plus, Trash2, MessageCircle, Instagram, ShoppingBag,
  ArrowRight, Truck, Info,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCatalog } from "../hooks/useCatalog";
import { buildWhatsAppLink, formatRupiah } from "../mock/mock";

const buildCartMessageWithZone = (items, zone) => {
  if (!items.length) return "";
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = zone ? zone.cost : 0;
  const total = subtotal + shipping;
  const body = items
    .map(
      (i, idx) =>
        `${idx + 1}. ${i.name}${i.variant ? ` — ${i.variant}` : ""} × ${i.qty} kg  (${formatRupiah(
          i.price
        )}/kg)`
    )
    .join("\n");
  const lines = [
    "Halo Deli Coffee, saya ingin memesan beberapa produk:",
    "",
    body,
    "",
    `Subtotal   : ${formatRupiah(subtotal)}`,
  ];
  if (zone) {
    lines.push(`Pengiriman : ${zone.name} — ${formatRupiah(shipping)}${zone.eta ? ` (${zone.eta})` : ""}`);
  }
  lines.push(`Estimasi total: ${formatRupiah(total)}.`);
  lines.push("");
  lines.push("Mohon info ketersediaan & konfirmasi pengiriman. Terima kasih!");
  return lines.join("\n");
};

const CartPage = () => {
  const { items, updateQty, removeItem, clear, total: subtotal, count } = useCart();
  const { brand, zones } = useCatalog();
  const [zoneId, setZoneId] = useState(null);

  useEffect(() => {
    if (zones && zones.length && !zoneId) {
      // default to pickup if exists (cost 0), else first
      const pickup = zones.find((z) => z.cost === 0);
      setZoneId((pickup || zones[0]).id);
    }
  }, [zones, zoneId]);

  const zone = useMemo(() => zones.find((z) => z.id === zoneId) || null, [zones, zoneId]);
  const shipping = zone?.cost || 0;
  const total = subtotal + shipping;

  const message = buildCartMessageWithZone(items, zone);
  const admins = brand.admins || [];
  const waLink1 = admins[0]
    ? buildWhatsAppLink(admins[0].phone, message)
    : "#";
  const waLink2 = admins[1]
    ? buildWhatsAppLink(admins[1].phone, message)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 md:py-16">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#1B7A43] font-semibold">Keranjang Pesanan</div>
          <h1 className="font-serif-warm text-4xl md:text-5xl mt-2 text-[#3B2412]">Rangkuman pesanan Anda</h1>
          <p className="mt-2 text-[#3B2412]/75 max-w-xl">
            Kami tidak memakai payment gateway. Pilih zona pengiriman lalu tekan “Pesan Sekarang” — ringkasan
            lengkap otomatis dikirim ke WhatsApp admin.
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

            {/* Shipping zone selector */}
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
              <div className="flex justify-between">
                <span className="text-[#F6EFE4]/75">Item</span>
                <span>{count} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F6EFE4]/75">Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F6EFE4]/75">Pengiriman{zone ? ` — ${zone.name}` : ""}</span>
                <span>{shipping === 0 ? "Gratis" : formatRupiah(shipping)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#F6EFE4]/10">
                <span className="font-semibold">Estimasi total</span>
                <span className="font-bold text-[#C9A227]">{formatRupiah(total)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {admins[0] && (
                <a href={waLink1} target="_blank" rel="noopener noreferrer" className="btn-amber w-full rounded-full h-12 inline-flex items-center justify-center gap-2 text-sm font-bold">
                  <MessageCircle className="h-4 w-4" /> Pesan Sekarang — WhatsApp {admins[0].name}
                </a>
              )}
              {waLink2 && (
                <a href={waLink2} target="_blank" rel="noopener noreferrer" className="w-full rounded-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-[#1B7A43] hover:bg-[#145F34] transition-colors">
                  <MessageCircle className="h-4 w-4" /> Alternatif: {admins[1].name}
                </a>
              )}
              <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-full rounded-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold border border-[#F6EFE4]/40 hover:bg-[#F6EFE4] hover:text-[#3B2412] transition-colors">
                <Instagram className="h-4 w-4" /> Chat via Instagram
              </a>
            </div>

            <div className="mt-6 text-[10px] uppercase tracking-widest text-[#F6EFE4]/50">
              Tanpa checkout online — semua konfirmasi dilakukan langsung dengan admin.
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;
