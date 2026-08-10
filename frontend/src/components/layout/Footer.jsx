import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Clock, Coffee, Star } from "lucide-react";
import { useCatalog } from "../../hooks/useCatalog";

const Footer = () => {
  const { brand } = useCatalog();
  return (
    <footer className="mt-20 bg-[#3B2412] text-[#F6EFE4]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="h-11 w-11 rounded-full bg-[#F6EFE4] text-[#3B2412] flex items-center justify-center">
              <Coffee className="h-5 w-5" />
            </span>
            <div>
              <div className="font-script text-3xl leading-none">
                Deli Coffee<span className="text-[#C9A227]">*</span>
              </div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#F6EFE4]/60">
                Roastery Co. — Medan
              </div>
            </div>
          </div>
          <p className="mt-5 text-[#F6EFE4]/80 max-w-md leading-relaxed">
            Roastery lokal Medan yang memanggang biji arabika dan robusta pilihan
            dari dataran tinggi Sumatera. Setiap batch dipanggang harian, dikemas
            segar untuk Anda.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-[#C9A227]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#C9A227]" />
              ))}
            </div>
            <span className="text-[#F6EFE4]/80">
              {brand.rating} — {brand.reviewCount} ulasan Google
            </span>
          </div>
        </div>

        <div>
          <div className="font-serif-warm text-lg mb-4">Navigasi</div>
          <ul className="space-y-2 text-[#F6EFE4]/80 text-sm">
            <li><Link to="/" className="hover:text-[#C9A227]">Beranda</Link></li>
            <li><Link to="/katalog" className="hover:text-[#C9A227]">Katalog</Link></li>
            <li><Link to="/katalog/house-blend" className="hover:text-[#C9A227]">House Blend</Link></li>
            <li><Link to="/kontak" className="hover:text-[#C9A227]">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-serif-warm text-lg mb-4">Kontak</div>
          <ul className="space-y-3 text-sm text-[#F6EFE4]/85">
            {brand.admins.map((a) => (
              <li key={a.phone} className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-[#C9A227]" />
                <span>
                  {a.name} — <span className="whitespace-nowrap">{a.display}</span>
                </span>
              </li>
            ))}
            <li className="flex items-start gap-2">
              <Instagram className="h-4 w-4 mt-0.5 text-[#C9A227]" />
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C9A227]"
              >
                @{brand.instagram}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-[#C9A227]" />
              <span>{brand.address}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-[#C9A227]" />
              <span>Buka setiap hari, mulai 09.00 WIB</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#F6EFE4]/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 text-xs text-[#F6EFE4]/60 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © {new Date().getFullYear()} Deli Coffee Roastery Co. — Dipanggang di
            Medan dengan hati.
          </div>
          <div>Kopi Nusantara · Arabika · Robusta · House Blend</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
