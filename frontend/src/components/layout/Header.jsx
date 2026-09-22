import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, Instagram, Menu, X, Coffee } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useCatalog } from "../../hooks/useCatalog";

const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/katalog", label: "Katalog" },
  { to: "/kontak", label: "Kontak" },
];

const Header = () => {
  const { count } = useCart();
  const { brand } = useCatalog();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 bg-[#F6EFE4]/85 backdrop-blur border-b border-[#3B2412]/10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative flex items-center justify-center h-10 w-10 rounded-full bg-[#3B2412] text-[#F6EFE4] group-hover:bg-[#1B7A43] transition-colors">
            <img
              src="/logo.png"
              alt="Deli Coffee"
              className="h-full w-full object-cover rounded-full"
            />
          </span>
          <div className="leading-tight">
            <div className="font-script text-2xl text-[#3B2412] -mb-1">
              Deli Coffee<span className="text-[#C9A227]">*</span>
            </div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-[#3B2412]/60 font-sans-clean">
              Roastery Co.
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? "text-[#1B7A43]"
                    : "text-[#3B2412] hover:text-[#1B7A43]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Deli Coffee"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-[#3B2412] hover:bg-[#3B2412] hover:text-[#F6EFE4] transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </a>

          <Link
            to="/keranjang"
            aria-label="Keranjang pesanan"
            className="relative inline-flex h-10 items-center gap-2 px-3 rounded-full bg-[#3B2412] text-[#F6EFE4] hover:bg-[#1B7A43] transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-sm font-medium">Keranjang</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C9A227] text-[#2A1D0B] text-[10px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-[#3B2412] hover:bg-[#3B2412] hover:text-[#F6EFE4] transition-colors"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#3B2412]/10 bg-[#F6EFE4]">
          <div className="px-5 py-3 flex flex-col">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `py-2 text-base font-medium ${
                    isActive ? "text-[#1B7A43]" : "text-[#3B2412]"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-base font-medium text-[#3B2412] flex items-center gap-2"
            >
              <Instagram className="h-4 w-4" /> @{brand.instagram}
            </a>
            {brand.tiktok && (
              <a
                href={brand.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Deli Coffee"
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-[#3B2412] hover:bg-[#3B2412] hover:text-[#F6EFE4] transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            )}
            {brand.tiktokShop && (
              <a
                href={brand.tiktokShop}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Shop Deli Coffee"
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-[#3B2412] hover:bg-[#3B2412] hover:text-[#F6EFE4] transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            )}
            {brand.shopee && (
              <a
                href={brand.shopee}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shopee Deli Coffee"
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-[#3B2412] hover:bg-[#3B2412] hover:text-[#F6EFE4] transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M15.941 17.963c.23-1.879-.98-3.077-4.175-4.097-1.548-.528-2.277-1.22-2.26-2.171.065-1.056 1.048-1.825 2.352-1.85a5.29 5.29 0 012.883.89c.116.072.197.06.263-.04.09-.144.315-.493.39-.62.051-.08.061-.186-.068-.28-.185-.137-.704-.415-.983-.532a6.47 6.47 0 00-2.511-.514c-1.91.008-3.413 1.215-3.54 2.826-.081 1.163.495 2.107 1.73 2.827.263.152 1.68.716 2.244.892 1.774.552 2.695 1.542 2.478 2.697-.197 1.047-1.299 1.724-2.818 1.744-1.203-.046-2.287-.537-3.127-1.19l-.141-.11c-.104-.08-.218-.075-.287.03-.05.077-.376.547-.458.67-.077.108-.035.168.045.234.35.293.817.613 1.134.775a6.71 6.71 0 002.829.727 4.905 4.905 0 002.075-.354c1.095-.465 1.803-1.394 1.945-2.554zM12 1.401c-2.068 0-3.754 1.95-3.833 4.39h7.665C15.751 3.35 14.066 1.4 12 1.4zm7.851 22.598-.08.001-15.784-.002c-1.074-.04-1.863-.91-1.971-1.991l-.01-.195-.707-15.526a.459.459 0 01.45-.494h4.975C6.845 2.568 9.16 0 12 0c2.838 0 5.153 2.569 5.275 5.79h4.968a.459.459 0 01.458.483l-.773 15.588-.007.131c-.094 1.094-.979 1.977-2.07 2.006z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
