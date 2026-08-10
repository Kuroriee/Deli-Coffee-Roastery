import { useEffect, useState } from "react";
import { Minus, Plus, MessageCircle, Instagram, ShoppingBag, SlidersHorizontal } from "lucide-react";
import {
  brand as brandDefault,
  buildProductMessage,
  buildWhatsAppLink,
  formatRupiah,
  houseBlend as houseBlendDefault,
} from "../../mock/mock";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";

const HouseBlendCard = ({ houseBlend = houseBlendDefault, brand = brandDefault }) => {
  const ratios = houseBlend.ratios || houseBlendDefault.ratios;
  const defaultRatio = ratios[Math.floor(ratios.length / 2)] || ratios[0];
  const [ratio, setRatio] = useState(defaultRatio);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    // ensure ratio stays valid if list updates
    if (!ratios.find((r) => r.value === ratio.value)) {
      setRatio(defaultRatio);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratios.length]);

  const productLike = {
    id: houseBlend.id || "hb-arabica-robusta",
    name: `House Blend Arabika+Robusta — ${ratio.value}`,
    process: `Arabika/Robusta ${ratio.value}`,
    price: ratio.price,
  };

  const waPhone = brand.admins?.[0]?.phone || brandDefault.admins[0].phone;
  const waLink = buildWhatsAppLink(waPhone, buildProductMessage(productLike, qty));

  const addToCart = () => {
    addItem({
      id: houseBlend.id || "hb-arabica-robusta",
      name: "House Blend Arabica + Robusta",
      variant: `Rasio ${ratio.value}`,
      price: ratio.price,
      qty,
    });
    toast.success(`House Blend ${ratio.value} × ${qty} kg ditambahkan`);
  };

  return (
    <article className="card-lift bg-[#FBF6EC] rounded-3xl border border-[#3B2412]/10 overflow-hidden lg:col-span-2">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
          <img src="https://images.unsplash.com/photo-1598825659313-7264573d08db" alt="House Blend" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute top-3 left-3 bg-[#1B7A43] text-[#F6EFE4] rounded-full px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-semibold">
            Signature
          </div>
          <div className="absolute bottom-3 left-3 bg-[#3B2412] text-[#F6EFE4] rounded-full px-3 py-1 text-[11px] font-semibold flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Rasio dapat diatur
          </div>
        </div>

        <div className="p-6 md:p-7 flex flex-col">
          <h3 className="font-serif-warm text-2xl md:text-3xl text-[#3B2412]">House Blend Arabica + Robusta</h3>
          <p className="mt-2 text-sm text-[#3B2412]/75 leading-relaxed">
            Racikan seimbang antara acidity arabika dan body robusta. Pilih rasio favorit Anda.
          </p>

          <div className="mt-5">
            <div className="text-xs uppercase tracking-[0.2em] text-[#3B2412]/60 font-semibold">
              Pilih Rasio Arabika / Robusta
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ratios.map((r) => {
                const active = r.value === ratio.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRatio(r)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                      active
                        ? "bg-[#1B7A43] border-[#1B7A43] text-[#F6EFE4]"
                        : "border-[#3B2412]/25 text-[#3B2412] hover:border-[#1B7A43] hover:text-[#1B7A43]"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-[#3B2412]/70 italic">{ratio.note}</p>
          </div>

          <div className="mt-5 flex items-baseline gap-1">
            <span className="font-serif-warm text-3xl text-[#1B7A43]">{formatRupiah(ratio.price)}</span>
            <span className="text-xs text-[#3B2412]/60">/ kg</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-[#3B2412]/25 overflow-hidden">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="qty-btn h-9 w-9 flex items-center justify-center text-[#3B2412]"><Minus className="h-4 w-4" /></button>
              <div className="w-10 text-center text-sm font-semibold">{qty} kg</div>
              <button type="button" onClick={() => setQty((q) => q + 1)} className="qty-btn h-9 w-9 flex items-center justify-center text-[#3B2412]"><Plus className="h-4 w-4" /></button>
            </div>
            <button type="button" onClick={addToCart} className="btn-outline rounded-full px-4 h-9 text-xs font-semibold inline-flex items-center gap-1">
              <ShoppingBag className="h-3.5 w-3.5" /> Keranjang
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary rounded-full h-10 inline-flex items-center justify-center gap-1.5 text-xs font-semibold">
              <MessageCircle className="h-3.5 w-3.5" /> Pesan via WhatsApp
            </a>
            <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-full h-10 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#3B2412] text-[#F6EFE4] hover:bg-[#5A3A22] transition-colors">
              <Instagram className="h-3.5 w-3.5" /> Chat via Instagram
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HouseBlendCard;
