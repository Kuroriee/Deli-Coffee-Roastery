import { Minus, Plus, Trash2 } from "lucide-react";
import { formatRupiah } from "../../mock/mock";

const CartItems = ({ items, updateQty, removeItem }) => (
  <div className="space-y-4">
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
              <h3 className="font-serif-warm text-lg text-[#3B2412]">{item.name}</h3>
              <div className="text-xs text-[#3B2412]/60">
                {item.variant || item.process || "1 kg per unit"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#3B2412]/60">{formatRupiah(item.price)} / kg</div>
              <div className="font-serif-warm text-xl text-[#1B7A43]">
                {formatRupiah(item.price * item.qty)}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="inline-flex items-center rounded-full border border-[#3B2412]/25 overflow-hidden">
              <button
                type="button"
                onClick={() => updateQty(item.id, item.variant, item.qty - 1)}
                className="qty-btn h-9 w-9 flex items-center justify-center text-[#3B2412]"
                aria-label="Kurangi"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="w-12 text-center text-sm font-semibold">{item.qty} kg</div>
              <button
                type="button"
                onClick={() => updateQty(item.id, item.variant, item.qty + 1)}
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
);

export default CartItems;
