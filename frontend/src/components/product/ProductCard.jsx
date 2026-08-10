import { useState } from "react";
import { Minus, Plus, MessageCircle, Instagram, ShoppingBag } from "lucide-react";
import { formatRupiah, buildWhatsAppLink, buildProductMessage, brand as brandDefault } from "../../mock/mock";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";

const processColor = {
  Wine: "bg-[#7B1F32] text-[#F6EFE4]",
  Honey: "bg-[#C9A227] text-[#2A1D0B]",
  Natural: "bg-[#1B7A43] text-[#F6EFE4]",
  Peaberry: "bg-[#3B2412] text-[#F6EFE4]",
  Luwak: "bg-[#2A1D0B] text-[#C9A227]",
  "Semi Washed": "bg-[#F6EFE4] text-[#3B2412] border border-[#3B2412]/25",
  Gayo: "bg-[#1B7A43] text-[#F6EFE4]",
  Lintong: "bg-[#5A3A22] text-[#F6EFE4]",
  Mandheling: "bg-[#3B2412] text-[#F6EFE4]",
  "Medium Roast": "bg-[#8A5A3C] text-[#F6EFE4]",
  "Medium–Dark": "bg-[#5A3A22] text-[#F6EFE4]",
  Caramel: "bg-[#C9A227] text-[#2A1D0B]",
};

const fallbackImageFor = (p) => {
  const map = {
    "arabica-specialty": "https://images.unsplash.com/photo-1524350876685-274059332603?crop=entropy&cs=srgb&fm=jpg&q=85",
    "arabica-premium": "https://images.unsplash.com/photo-1562051036-e0eea191d42f?crop=entropy&cs=srgb&fm=jpg&q=85",
    robusta: "https://images.unsplash.com/photo-1512372388054-a322888e67a6",
    "house-blend": "https://images.unsplash.com/photo-1598825659313-7264573d08db",
  };
  return map[p.category] || "";
};

const ProductCard = ({ product, brand = brandDefault }) => {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const isPremium = product.badge === "Premium" || product.badge === "Eksklusif";
  const image = product.image || fallbackImageFor(product);

  const waPhone = brand.admins?.[0]?.phone || brandDefault.admins[0].phone;
  const waLink = buildWhatsAppLink(waPhone, buildProductMessage(product, qty));

  const addToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      qty,
      process: product.process,
    });
    toast.success(`${product.name} × ${qty} kg ditambahkan ke keranjang`);
  };

  return (
    <article className="card-lift bg-[#FBF6EC] rounded-3xl border border-[#3B2412]/10 overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#3B2412]/5">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#3B2412]/30 text-xs">Tanpa foto</div>
        )}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-semibold ${
              isPremium ? "bg-[#C9A227] text-[#2A1D0B]" : "bg-[#1B7A43] text-[#F6EFE4]"
            }`}
          >
            {product.badge}
          </div>
        )}
        {product.process && (
          <div className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold ${processColor[product.process] || "bg-[#3B2412] text-[#F6EFE4]"}`}>
            {product.process}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif-warm text-xl text-[#3B2412] leading-tight">{product.name}</h3>
        {product.desc && <p className="mt-1 text-sm text-[#3B2412]/70 line-clamp-2">{product.desc}</p>}

        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-serif-warm text-2xl text-[#1B7A43]">{formatRupiah(product.price)}</span>
          <span className="text-xs text-[#3B2412]/60">/ kg</span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-[#3B2412]/25 overflow-hidden">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="qty-btn h-9 w-9 flex items-center justify-center text-[#3B2412]" aria-label="Kurangi jumlah">
              <Minus className="h-4 w-4" />
            </button>
            <div className="w-10 text-center text-sm font-semibold">{qty} kg</div>
            <button type="button" onClick={() => setQty((q) => q + 1)} className="qty-btn h-9 w-9 flex items-center justify-center text-[#3B2412]" aria-label="Tambah jumlah">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button type="button" onClick={addToCart} className="btn-outline rounded-full px-4 h-9 text-xs font-semibold inline-flex items-center gap-1">
            <ShoppingBag className="h-3.5 w-3.5" /> Keranjang
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary rounded-full h-10 inline-flex items-center justify-center gap-1.5 text-xs font-semibold">
            <MessageCircle className="h-3.5 w-3.5" /> Pesan WA
          </a>
          <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-full h-10 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#3B2412] text-[#F6EFE4] hover:bg-[#5A3A22] transition-colors">
            <Instagram className="h-3.5 w-3.5" /> Chat IG
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
