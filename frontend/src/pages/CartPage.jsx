import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  MessageCircle,
  Instagram,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { brand, buildCartMessage, buildWhatsAppLink, formatRupiah } from "../mock/mock";

const CartPage = () => {
  const { items, updateQty, removeItem, clear, total, count } = useCart();

  const message = buildCartMessage(items);
  const waLinkPrimary = buildWhatsAppLink(brand.admins[0].phone, message);
  const waLinkSecondary = buildWhatsAppLink(brand.admins[1].phone, message);

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
            Kami tidak memakai payment gateway. Setelah Anda meninjau daftar,
            tekan “Pesan Sekarang” untuk mengirim ringkasan pesanan otomatis ke
            WhatsApp admin.
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
        <div className="mt-14 rounded-3xl border border-[#3B2412]/15 bg-[#FBF6EC] p-10 text-center">
          <div className="h-14 w-14 mx-auto rounded-full bg-[#3B2412] text-[#F6EFE4] flex items-center justify-center">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-serif-warm text-2xl text-[#3B2412]">
            Keranjang masih kosong
          </h2>
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
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.variant || ""}`}
                className="rounded-2xl border border-[#3B2412]/10 bg-[#FBF6EC] p-4 md:p-5 flex flex-col sm:flex-row gap-4"
              >
                <div className="h-20 w-20 rounded-xl bg-[#3B2412] text-[#F6EFE4] flex items-center justify-center font-serif-warm text-xl flex-shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-start justify-between">
                    <div>
                      <h3 className="font-serif-warm text-lg text-[#3B2412]">
                        {item.name}
                      </h3>
                      <div className="text-xs text-[#3B2412]/60">
                        {item.variant || item.process || "1 kg per unit"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#3B2412]/60">
                        {formatRupiah(item.price)} / kg
                      </div>
                      <div className="font-serif-warm text-xl text-[#1B7A43]">
                        {formatRupiah(item.price * item.qty)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-[#3B2412]/25 overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(item.id, item.variant, item.qty - 1)
                        }
                        className="qty-btn h-9 w-9 flex items-center justify-center text-[#3B2412]"
                        aria-label="Kurangi"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="w-12 text-center text-sm font-semibold">
                        {item.qty} kg
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateQty(item.id, item.variant, item.qty + 1)
                        }
                        className="qty-btn h-9 w-9 flex items-center justify-center text-[#3B2412]"
                        aria-label="Tambah"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id, item.variant)}
                      className="inline-flex items-center gap-1 text-xs text-[#3B2412]/60 hover:text-[#7B1F32]"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* summary */}
          <aside className="lg:sticky lg:top-24 h-fit rounded-3xl bg-[#3B2412] text-[#F6EFE4] p-6">
            <h2 className="font-serif-warm text-2xl">Ringkasan</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#F6EFE4]/75">Item</span>
                <span>{count} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#F6EFE4]/75">Estimasi total</span>
                <span className="font-semibold">{formatRupiah(total)}</span>
              </div>
              <div className="text-xs text-[#F6EFE4]/60 pt-2 border-t border-[#F6EFE4]/10">
                Harga belum termasuk ongkos kirim. Admin akan mengonfirmasi
                ketersediaan & ongkir setelah pesanan dikirim.
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <a
                href={waLinkPrimary}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-amber w-full rounded-full h-12 inline-flex items-center justify-center gap-2 text-sm font-bold"
              >
                <MessageCircle className="h-4 w-4" /> Pesan Sekarang — WhatsApp {brand.admins[0].name}
              </a>
              <a
                href={waLinkSecondary}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-[#1B7A43] hover:bg-[#145F34] transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> Alternatif: {brand.admins[1].name}
              </a>
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold border border-[#F6EFE4]/40 hover:bg-[#F6EFE4] hover:text-[#3B2412] transition-colors"
              >
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
