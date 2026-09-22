import { Instagram, ShoppingBag, MessageCircle, Star } from "lucide-react";
import { useCatalog } from "../hooks/useCatalog";

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const ShopeeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M15.941 17.963c.23-1.879-.98-3.077-4.175-4.097-1.548-.528-2.277-1.22-2.26-2.171.065-1.056 1.048-1.825 2.352-1.85a5.29 5.29 0 012.883.89c.116.072.197.06.263-.04.09-.144.315-.493.39-.62.051-.08.061-.186-.068-.28-.185-.137-.704-.415-.983-.532a6.47 6.47 0 00-2.511-.514c-1.91.008-3.413 1.215-3.54 2.826-.081 1.163.495 2.107 1.73 2.827.263.152 1.68.716 2.244.892 1.774.552 2.695 1.542 2.478 2.697-.197 1.047-1.299 1.724-2.818 1.744-1.203-.046-2.287-.537-3.127-1.19l-.141-.11c-.104-.08-.218-.075-.287.03-.05.077-.376.547-.458.67-.077.108-.035.168.045.234.35.293.817.613 1.134.775a6.71 6.71 0 002.829.727 4.905 4.905 0 002.075-.354c1.095-.465 1.803-1.394 1.945-2.554zM12 1.401c-2.068 0-3.754 1.95-3.833 4.39h7.665C15.751 3.35 14.066 1.4 12 1.4zm7.851 22.598-.08.001-15.784-.002c-1.074-.04-1.863-.91-1.971-1.991l-.01-.195-.707-15.526a.459.459 0 01.45-.494h4.975C6.845 2.568 9.16 0 12 0c2.838 0 5.153 2.569 5.275 5.79h4.968a.459.459 0 01.458.483l-.773 15.588-.007.131c-.094 1.094-.979 1.977-2.07 2.006z" />
  </svg>
);

const LinksPage = () => {
  const { brand } = useCatalog();

  // --- CTA utama (tombol solid, di atas) ---
  // Tambah/hapus/ubah baris di sini sesuka kamu.
  const primaryLinks = [
    {
      key: "katalog",
      href: "/katalog",
      label: "Lihat Katalog Produk",
      icon: ShoppingBag,
      internal: true,
    },
    brand.admins?.[0] && {
      key: "whatsapp",
      href: `https://wa.me/${(brand.admins[0].phone || "").replace(/\D/g, "")}`,
      label: `Pesan via WhatsApp — ${brand.admins[0].name}`,
      icon: MessageCircle,
    },
  ].filter(Boolean);

  // --- Link sosmed (tombol outline, di bawah) ---
  const socialLinks = [
    brand.instagramUrl && {
      key: "instagram",
      href: brand.instagramUrl,
      label: `Instagram — @${brand.instagram}`,
      icon: Instagram,
    },
    brand.tiktok && {
      key: "tiktok",
      href: brand.tiktok,
      label: "TikTok",
      icon: TikTokIcon,
    },
    brand.tiktokShop && {
      key: "tiktokShop",
      href: brand.tiktokShop,
      label: "TikTok Shop",
      icon: TikTokIcon,
    },
    brand.shopee && {
      key: "shopee",
      href: brand.shopee,
      label: "Shopee",
      icon: ShopeeIcon,
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F6EFE4] text-[#3B2412] flex flex-col items-center px-5 py-14">
      <div className="w-full max-w-sm flex flex-col items-center">
        <span className="h-20 w-20 rounded-full bg-[#3B2412] text-[#F6EFE4] flex items-center justify-center overflow-hidden">
          <img
            src="/logo.png"
            alt="Deli Coffee"
            className="h-full w-full object-cover rounded-full"
          />
        </span>

        <h1 className="font-script text-4xl mt-5 leading-none">
          Deli Coffee<span className="text-[#C9A227]">*</span>
        </h1>
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#3B2412]/60 mt-1">
          Roastery Co. — Medan
        </p>

        <p className="font-serif-warm text-lg text-center mt-4 leading-snug">
          {brand.tagline || "Kopi Nusantara, Dipanggang di Kota Medan"}
        </p>

        {brand.rating && (
          <div className="mt-3 flex items-center gap-1.5 text-sm">
            <div className="flex items-center gap-0.5 text-[#C9A227]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-[#C9A227]" />
              ))}
            </div>
            <span className="text-[#3B2412]/70">
              {brand.rating} — {brand.reviewCount} ulasan Google
            </span>
          </div>
        )}

        <div className="w-full mt-9 flex flex-col gap-3">
          {primaryLinks.map((l) => {
            const Icon = l.icon;
            return (
                <a
                key={l.key}
                href={l.href}
                target={l.internal ? undefined : "_blank"}
                rel={l.internal ? undefined : "noopener noreferrer"}
                className="w-full flex items-center gap-3 rounded-2xl bg-[#3B2412] text-[#F6EFE4] px-5 py-4 font-medium hover:bg-[#1B7A43] transition-colors"
                >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{l.label}</span>
              </a>
            );
          })}
        </div>

        {socialLinks.length > 0 && (
          <div className="w-full mt-3 flex flex-col gap-3">
            {socialLinks.map((l) => {
              const Icon = l.icon;
              return (
                <a
                  key={l.key}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 rounded-2xl border border-[#3B2412]/25 px-5 py-4 font-medium hover:border-[#3B2412] hover:bg-[#3B2412]/5 transition-colors"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{l.label}</span>
                </a>
              );
            })}
          </div>
        )}

        <a href="/"
          className="mt-10 text-sm text-[#3B2412]/60 hover:text-[#1B7A43] transition-colors"
        >
          ← Kembali ke website
        </a>
      </div>
    </div>
  );
};

export default LinksPage;