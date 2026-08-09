import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Instagram,
  MessageCircle,
  ArrowRight,
  Flame,
  Leaf,
  Coffee,
  Sparkles
} from "lucide-react";
import {
  brand,
  categories,
  heroImages,
  testimonials
} from "../mock/mock";

const StatChip = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-[#F6EFE4] border border-[#3B2412]/10 rounded-full pl-2 pr-4 py-2 shadow-sm">
    <span className="h-8 w-8 rounded-full bg-[#1B7A43] text-[#F6EFE4] flex items-center justify-center">
      <Icon className="h-4 w-4" />
    </span>
    <div className="leading-tight">
      <div className="text-[10px] uppercase tracking-widest text-[#3B2412]/60">
        {label}
      </div>
      <div className="text-sm font-semibold text-[#3B2412]">{value}</div>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImages.hero})` }}
          aria-hidden
        />
        <div className="absolute inset-0 hero-gradient" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-24 md:py-36 text-[#F6EFE4]">
          <div className="max-w-2xl fade-up">
            <div className="inline-flex items-center gap-2 bg-[#F6EFE4]/15 backdrop-blur border border-[#F6EFE4]/25 rounded-full px-3 py-1 text-xs tracking-widest uppercase">
              <Sparkles className="h-3.5 w-3.5 text-[#C9A227]" />
              Roastery Lokal — Medan, Sumatera Utara
            </div>
            <h1 className="font-serif-warm mt-5 text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
              {brand.tagline.split(",")[0]},
              <span className="block text-[#C9A227] font-script text-5xl sm:text-6xl md:text-7xl mt-2">
                dipanggang di Medan.
              </span>
            </h1>
            <p className="mt-5 text-[#F6EFE4]/85 text-lg max-w-xl">
              {brand.subTagline} Pesan langsung melalui WhatsApp atau DM Instagram —
              tanpa ribet, tanpa checkout online.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/katalog"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                Lihat Katalog Kopi <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-[#F6EFE4]/60 hover:bg-[#F6EFE4] hover:text-[#3B2412] transition-colors"
              >
                <Instagram className="h-4 w-4" /> @{brand.instagram}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <StatChip icon={Star} label="Rating Google" value={`${brand.rating} / 5 · ${brand.reviewCount} ulasan`} />
              <StatChip icon={Flame} label="Roasting" value="Harian, batch kecil" />
              <StatChip icon={Leaf} label="Asal biji" value="Dataran tinggi Sumatera" />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE / TICKER */}
      <section className="bg-[#3B2412] text-[#F6EFE4]/90 py-3 border-y border-[#3B2412]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs tracking-[0.25em] uppercase">
          <span>Arabica Wine</span>
          <span className="text-[#C9A227]">•</span>
          <span>Gayo Specialty</span>
          <span className="text-[#C9A227]">•</span>
          <span>Robusta Caramel</span>
          <span className="text-[#C9A227]">•</span>
          <span>Luwak Eksklusif</span>
          <span className="text-[#C9A227]">•</span>
          <span>House Blend</span>
          <span className="text-[#C9A227]">•</span>
          <span>Mandheling</span>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 md:py-28 grid gap-10 md:grid-cols-2 items-center">
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
            <img
              src={heroImages.roasting}
              alt="Proses roasting kopi"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:block absolute -bottom-8 -right-6 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-[#F6EFE4]">
            <img src={heroImages.green} alt="Biji kopi hijau" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-4 -left-4 bg-[#C9A227] text-[#2A1D0B] rounded-full px-4 py-1 font-script text-2xl">
            est. Medan
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#1B7A43] font-semibold">
            Tentang Kami
          </div>
          <h2 className="font-serif-warm text-3xl md:text-5xl mt-3 text-[#3B2412]">
            Dari kebun Sumatera,
            <span className="block text-[#1B7A43]">ke cangkir Anda.</span>
          </h2>
          <p className="mt-5 text-[#3B2412]/85 leading-relaxed">
            <span className="font-semibold text-[#3B2412]">Deli Coffee Roastery Co.</span>{" "}
            adalah roastery keluarga yang berbasis di Medan Denai. Kami memilih biji
            langsung dari petani di Gayo, Lintong, dan Mandheling, lalu memanggangnya
            dalam batch kecil agar setiap karakter khas biji tetap terjaga.
          </p>
          <p className="mt-4 text-[#3B2412]/85 leading-relaxed">
            Mulai dari <span className="italic">Wine Process</span> yang berkarakter buah,
            hingga <span className="italic">House Blend</span> harian yang seimbang —
            semua bisa dipesan langsung via WhatsApp atau DM Instagram.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: Flame, k: "Batch Kecil", v: "Roasting harian" },
              { icon: Leaf, k: "Single Origin", v: "Sumatera pilihan" },
              { icon: Coffee, k: "Fresh", v: "Dikemas segar" }
            ].map((f) => (
              <div
                key={f.k}
                className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 p-4"
              >
                <f.icon className="h-5 w-5 text-[#1B7A43]" />
                <div className="mt-2 text-sm font-semibold text-[#3B2412]">
                  {f.k}
                </div>
                <div className="text-xs text-[#3B2412]/70">{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-[#FBF6EC] border-y border-[#3B2412]/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#1B7A43] font-semibold">
                Katalog
              </div>
              <h2 className="font-serif-warm text-3xl md:text-4xl mt-2 text-[#3B2412]">
                Empat lini kopi, satu roastery.
              </h2>
            </div>
            <Link
              to="/katalog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B7A43] hover:text-[#145F34]"
            >
              Lihat semua produk <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/katalog/${c.id}`}
                className="group card-lift bg-[#F6EFE4] rounded-3xl overflow-hidden border border-[#3B2412]/10"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-warm text-xl text-[#3B2412]">
                      {c.short}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-[#1B7A43] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="mt-2 text-sm text-[#3B2412]/75 leading-relaxed line-clamp-3">
                    {c.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.3em] text-[#1B7A43] font-semibold">
            Testimoni Pelanggan
          </div>
          <h2 className="font-serif-warm text-3xl md:text-4xl mt-2 text-[#3B2412]">
            Rating <span className="text-[#C9A227]">{brand.rating}</span>{" "}
            dari {brand.reviewCount} ulasan Google.
          </h2>
          <p className="mt-3 text-[#3B2412]/75">
            Cerita nyata dari pelanggan yang sudah menyeduh kopi Deli Coffee di rumah,
            kedai, dan warung mereka.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl bg-[#FBF6EC] border border-[#3B2412]/10 p-6 card-lift"
            >
              <div className="flex gap-1 text-[#C9A227]">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#C9A227]" />
                ))}
              </div>
              <p className="mt-3 text-[#3B2412]/85 leading-relaxed text-sm">
                “{t.text}”
              </p>
              <div className="mt-5 pt-4 border-t border-[#3B2412]/10">
                <div className="text-sm font-semibold text-[#3B2412]">{t.name}</div>
                <div className="text-xs text-[#3B2412]/60 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {t.city}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-[#1B7A43] text-[#F6EFE4] p-8 md:p-14">
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImages.brewing})` }}
            aria-hidden
          />
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#C9A227] font-semibold">
                Cara Pesan
              </div>
              <h3 className="font-serif-warm text-3xl md:text-4xl mt-2">
                Pilih kopi favorit,
                <span className="block">kami siapkan hari ini juga.</span>
              </h3>
              <p className="mt-3 text-[#F6EFE4]/85 max-w-md">
                Pesan langsung dari halaman produk lewat WhatsApp atau DM Instagram —
                admin kami akan segera membalas dengan info stok & ongkos kirim.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/katalog"
                className="btn-amber inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                <Coffee className="h-4 w-4" /> Jelajahi Katalog
              </Link>
              <a
                href={`https://wa.me/62${brand.admins[0].phone.substring(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-[#F6EFE4] hover:bg-[#F6EFE4] hover:text-[#1B7A43] transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Admin
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
