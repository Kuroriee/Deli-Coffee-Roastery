import { useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Coffee, Filter, ShoppingBag } from "lucide-react";
import { heroImages } from "../mock/mock";
import { useCatalog } from "../hooks/useCatalog";
import ProductCard from "../components/product/ProductCard";
import HouseBlendCard from "../components/product/HouseBlendCard";

const ProductsPage = () => {
  const { categoryId } = useParams();
  const activeId = categoryId || "all";
  const { categories, products, houseBlend, brand } = useCatalog();

  const filtered = useMemo(() => {
    if (activeId === "all") return products;
    if (activeId === "house-blend") return [];
    return products.filter((p) => p.category === activeId);
  }, [activeId, products]);

  const showHouseBlend = activeId === "all" || activeId === "house-blend";
  const activeCategory = categories.find((c) => c.id === activeId);
  const olshopLinks = [
    brand.tiktokShop && {
      key: "tiktokShop",
      href: brand.tiktokShop,
      label: "TikTok Shop / Tokopedia",
    },
    brand.shopee && { key: "shopee", href: brand.shopee, label: "Shopee" },
  ].filter(Boolean);

  return (
    <div>
      <section className="relative overflow-hidden bg-[#3B2412] text-[#F6EFE4]">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImages.brewing})` }}
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.3em] text-[#C9A227] font-semibold">
            Katalog Produk
          </div>
          <h1 className="font-serif-warm text-4xl md:text-5xl mt-2">
            {activeCategory ? activeCategory.name : "Semua Kopi Kami"}
          </h1>
          <p className="mt-3 max-w-2xl text-[#F6EFE4]/85">
            {activeCategory
              ? activeCategory.description
              : "Jelajahi seluruh lini kopi Deli Coffee — dari specialty process eksperimental, arabika premium klasik, robusta bold, hingga house blend andalan."}
          </p>
        </div>
      </section>

      <section className="sticky top-16 z-30 bg-[#F6EFE4]/85 backdrop-blur border-b border-[#3B2412]/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto">
          <div className="hidden sm:inline-flex items-center gap-1 text-xs text-[#3B2412]/60 font-semibold uppercase tracking-widest pr-2">
            <Filter className="h-3.5 w-3.5" /> Kategori
          </div>
          <NavLink
            to="/katalog"
            end
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${isActive && activeId === "all" ? "bg-[#1B7A43] border-[#1B7A43] text-[#F6EFE4]" : "border-[#3B2412]/25 text-[#3B2412] hover:border-[#1B7A43] hover:text-[#1B7A43]"}`
            }
          >
            Semua
          </NavLink>
          {categories.map((c) => (
            <NavLink
              key={c.id}
              to={`/katalog/${c.id}`}
              className={() =>
                `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${activeId === c.id ? "bg-[#1B7A43] border-[#1B7A43] text-[#F6EFE4]" : "border-[#3B2412]/25 text-[#3B2412] hover:border-[#1B7A43] hover:text-[#1B7A43]"}`
              }
            >
              {c.short}
            </NavLink>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        {olshopLinks.length > 0 && (
          <div className="mb-8 rounded-2xl bg-[#3B2412] text-[#F6EFE4] px-5 py-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-[#C9A227] shrink-0" />
              <div>
                <div className="font-serif-warm text-lg leading-tight">
                  Yok, belanja di olshop kami
                </div>
                <p className="text-sm text-[#F6EFE4]/80">
                  {brand.shopee
                    ? "TikTok Shop ada, Shopee pun ada, Kak. Tinggal klik, kopi sampai ke rumah lah."
                    : "Udah ada di TikTok Shop / Tokopedia, Kak. Tinggal klik, kopi sampai ke rumah lah."}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {olshopLinks.map((l) => (
                <a
                  key={l.key}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#F6EFE4] text-[#3B2412] px-4 py-2 text-sm font-semibold hover:bg-[#1B7A43] hover:text-[#F6EFE4] transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
        {filtered.length === 0 && !showHouseBlend && (
          <div className="text-center py-16 text-[#3B2412]/60">
            Belum ada produk di kategori ini.
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} brand={brand} />
          ))}
          {showHouseBlend && (
            <HouseBlendCard houseBlend={houseBlend} brand={brand} />
          )}
        </div>

        <div className="mt-14 rounded-3xl border border-dashed border-[#3B2412]/30 p-6 md:p-8 bg-[#FBF6EC] flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[#1B7A43] text-[#F6EFE4] flex items-center justify-center flex-shrink-0">
            <Coffee className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-serif-warm text-lg text-[#3B2412]">
              Kemasan default 1 kg, custom ukuran tersedia via chat.
            </div>
            <p className="text-sm text-[#3B2412]/70">
              Ingin 250 g / 500 g atau grind ready? Sampaikan via WhatsApp — tim
              kami siap bantu menyesuaikan kebutuhan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
