import { Plus, Sparkles } from "lucide-react";
import { formatRupiah } from "../../mock/mock";

const Recommendations = ({ items, onAdd }) => {
  if (!items || items.length === 0) return null;
  return (
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
        {items.map((p) => (
          <div
            key={p.id}
            className="rounded-xl bg-[#F6EFE4] border border-[#3B2412]/10 overflow-hidden flex flex-col"
          >
            <div className="aspect-square bg-[#3B2412]/5 overflow-hidden">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#3B2412]/30 text-xs">
                  Tanpa foto
                </div>
              )}
            </div>
            <div className="p-3 flex flex-col flex-1">
              <div className="text-[10px] uppercase tracking-widest text-[#3B2412]/60">
                {p.process || p.region || ""}
              </div>
              <div className="font-serif-warm text-sm text-[#3B2412] leading-tight line-clamp-2">
                {p.name}
              </div>
              <div className="mt-1 text-sm font-semibold text-[#1B7A43]">
                {formatRupiah(p.price)}/kg
              </div>
              <button
                type="button"
                onClick={() => onAdd(p)}
                className="mt-auto pt-2 btn-outline rounded-full h-8 text-[11px] font-semibold inline-flex items-center justify-center gap-1"
              >
                <Plus className="h-3 w-3" /> Tambahkan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
