import {
  MapPin,
  Phone,
  Instagram,
  Clock,
  MessageCircle,
  Star,
  Navigation
} from "lucide-react";
import { buildWhatsAppLink } from "../mock/mock";
import { useCatalog } from "../hooks/useCatalog";

const isOpenNow = (b) => {
  const now = new Date();
  const h = now.getHours();
  return h >= (b.openingHour || 9) && h < (b.closingHour || 21);
};

const ContactPage = () => {
  const { brand } = useCatalog();
  const open = isOpenNow(brand);

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#1B7A43] font-semibold">
            Kontak Kami
          </div>
          <h1 className="font-serif-warm text-4xl md:text-5xl mt-2 text-[#3B2412]">
            Mampir ke roastery kami
            <span className="block text-[#1B7A43]">di Medan Denai.</span>
          </h1>
          <p className="mt-3 text-[#3B2412]/75 max-w-lg">
            Ingin lihat langsung prosesnya, atau sekadar ngobrol soal kopi? Kami
            selalu senang kedatangan tamu. Ini semua cara untuk terhubung dengan
            Deli Coffee.
          </p>

          <div
            className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              open
                ? "bg-[#1B7A43] text-[#F6EFE4]"
                : "bg-[#3B2412] text-[#F6EFE4]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                open ? "bg-[#C9A227]" : "bg-[#C9A227]/60"
              }`}
            />
            {open ? "Sedang Buka" : "Sedang Tutup"} · Jam buka 09.00 WIB
          </div>

          <div className="mt-8 space-y-4">
            {(brand.admins || []).map((a) => (
              <div
                key={a.phone}
                className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 p-5 flex items-center gap-4"
              >
                <div className="h-11 w-11 rounded-full bg-[#1B7A43] text-[#F6EFE4] flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-[#3B2412]/60 uppercase tracking-widest">
                    Admin
                  </div>
                  <div className="font-semibold text-[#3B2412]">
                    {a.name} — {a.display}
                  </div>
                </div>
                <a
                  href={buildWhatsAppLink(
                    a.phone,
                    `Halo ${a.name}, saya ingin bertanya soal kopi Deli Coffee.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary rounded-full px-4 h-10 inline-flex items-center gap-1.5 text-xs font-semibold"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </div>
            ))}

            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl bg-[#3B2412] text-[#F6EFE4] p-5 hover:bg-[#5A3A22] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-[#C9A227] text-[#2A1D0B] flex items-center justify-center">
                  <Instagram className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-[#F6EFE4]/60 uppercase tracking-widest">
                    Instagram
                  </div>
                  <div className="font-semibold">@{brand.instagram}</div>
                </div>
                <span className="text-xs">DM kami →</span>
              </div>
            </a>

            <div className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 p-5 flex items-start gap-4">
              <div className="h-11 w-11 rounded-full bg-[#3B2412] text-[#F6EFE4] flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-[#3B2412]/60 uppercase tracking-widest">
                  Alamat Roastery
                </div>
                <div className="font-semibold text-[#3B2412]">{brand.address}</div>
                <div className="text-xs text-[#3B2412]/60 mt-1">
                  Plus Code: {brand.plusCode}
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    brand.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#1B7A43] hover:underline"
                >
                  <Navigation className="h-3.5 w-3.5" /> Buka di Google Maps
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-full bg-[#C9A227] text-[#2A1D0B] flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-[#3B2412]/60 uppercase tracking-widest">
                  Jam Operasional
                </div>
                <div className="font-semibold text-[#3B2412]">Setiap hari mulai 09.00 WIB</div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-full bg-[#1B7A43] text-[#F6EFE4] flex items-center justify-center">
                <Star className="h-5 w-5 fill-[#F6EFE4]" />
              </div>
              <div>
                <div className="text-xs text-[#3B2412]/60 uppercase tracking-widest">
                  Ulasan Google
                </div>
                <div className="font-semibold text-[#3B2412]">
                  {brand.rating} / 5 · {brand.reviewCount} ulasan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-3xl overflow-hidden border border-[#3B2412]/15 shadow-xl bg-[#FBF6EC]">
            <iframe
              title="Peta Deli Coffee Roastery"
              className="w-full h-[420px] md:h-[560px]"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                brand.address
              )}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-4 rounded-2xl bg-[#3B2412] text-[#F6EFE4] p-5">
            <div className="font-serif-warm text-xl">
              Kunjungi kami langsung.
            </div>
            <p className="text-sm text-[#F6EFE4]/80 mt-1">
              Ingin melihat proses roasting atau cupping? Beritahu kami dulu via
              WhatsApp supaya kami bisa siapkan sesi kecil untuk Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
