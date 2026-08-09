import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, Instagram, Menu, X, Coffee } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { brand } from "../../mock/mock";

const navLinks = [
  { to: "/", label: "Beranda" },
  { to: "/katalog", label: "Katalog" },
  { to: "/kontak", label: "Kontak" }
];

const Header = () => {
  const { count } = useCart();
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
            <Coffee className="h-5 w-5" />
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
