import { MessageCircle, Instagram, Loader2 } from "lucide-react";
import { formatRupiah } from "../../mock/mock";

const OrderSummary = ({
  subtotal,
  shipping,
  total,
  count,
  zoneName,
  admins,
  instagramUrl,
  canSubmit,
  submitting,
  onOrder, // (admin) => void
}) => (
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
        <span className="text-[#F6EFE4]/75">
          Pengiriman{zoneName ? ` — ${zoneName}` : ""}
        </span>
        <span>{shipping === 0 ? "Gratis" : formatRupiah(shipping)}</span>
      </div>
      <div className="flex justify-between pt-2 border-t border-[#F6EFE4]/10">
        <span className="font-semibold">Estimasi total</span>
        <span className="font-bold text-[#C9A227]">{formatRupiah(total)}</span>
      </div>
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
          onClick={() => onOrder(admins[0])}
          className="btn-amber w-full rounded-full h-12 inline-flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageCircle className="h-4 w-4" />
          )}
          Pesan Sekarang — WhatsApp {admins[0].name}
        </button>
      )}
      {admins[1] && (
        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={() => onOrder(admins[1])}
          className="w-full rounded-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-[#1B7A43] hover:bg-[#145F34] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle className="h-4 w-4" /> Alternatif: {admins[1].name}
        </button>
      )}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full rounded-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold border border-[#F6EFE4]/40 hover:bg-[#F6EFE4] hover:text-[#3B2412] transition-colors"
      >
        <Instagram className="h-4 w-4" /> Chat via Instagram
      </a>
    </div>

    <div className="mt-6 text-[10px] uppercase tracking-widest text-[#F6EFE4]/50">
      Pesanan tercatat di sistem kami sebagai referensi. Konfirmasi tetap dilakukan via chat.
    </div>
  </aside>
);

export default OrderSummary;
