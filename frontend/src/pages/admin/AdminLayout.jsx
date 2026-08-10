import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Coffee,
  LayoutDashboard,
  Package,
  Tag,
  Blend,
  Truck,
  Star,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  ClipboardList,
  ImagePlus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/pesanan", icon: ClipboardList, label: "Pesanan" },
  { to: "/admin/produk", icon: Package, label: "Produk" },
  { to: "/admin/foto", icon: ImagePlus, label: "Import Foto" },
  { to: "/admin/kategori", icon: Tag, label: "Kategori" },
  { to: "/admin/house-blend", icon: Blend, label: "House Blend" },
  { to: "/admin/ongkir", icon: Truck, label: "Zona Ongkir" },
  { to: "/admin/testimoni", icon: Star, label: "Testimoni" },
  { to: "/admin/pengaturan", icon: SettingsIcon, label: "Pengaturan" },
];

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6EFE4]">
        <div className="h-10 w-10 border-4 border-[#1B7A43] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6EFE4] flex">
      <aside className="w-64 bg-[#3B2412] text-[#F6EFE4] flex flex-col fixed h-full">
        <Link to="/admin" className="flex items-center gap-3 px-5 py-5 border-b border-[#F6EFE4]/10">
          <span className="h-10 w-10 rounded-full bg-[#F6EFE4] text-[#3B2412] flex items-center justify-center">
            <Coffee className="h-5 w-5" />
          </span>
          <div>
            <div className="font-script text-2xl leading-none">Deli Coffee<span className="text-[#C9A227]">*</span></div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-[#F6EFE4]/60">Admin Panel</div>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? "bg-[#1B7A43] text-[#F6EFE4]"
                    : "text-[#F6EFE4]/80 hover:bg-[#5A3A22] hover:text-[#F6EFE4]"
                }`
              }
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[#F6EFE4]/10">
          <div className="flex items-center gap-3 px-2 py-2">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="h-9 w-9 rounded-full" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-[#C9A227] text-[#2A1D0B] flex items-center justify-center text-sm font-bold">
                {(user.name || user.email || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="leading-tight overflow-hidden">
              <div className="text-sm font-semibold truncate">{user.name}</div>
              <div className="text-[10px] text-[#F6EFE4]/60 truncate">{user.email}</div>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#F6EFE4]/70 hover:bg-[#5A3A22]"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Lihat website
          </a>
          <button
            type="button"
            onClick={logout}
            className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#F6EFE4]/80 hover:bg-[#7B1F32]/40"
          >
            <LogOut className="h-3.5 w-3.5" /> Keluar
          </button>
        </div>
      </aside>

      <main className="ml-64 flex-1 min-h-screen">
        <div className="p-6 md:p-10 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
