import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Tag, Truck, Star, ArrowRight, Coffee, Blend, ClipboardList, ImagePlus } from "lucide-react";
import { publicApi, adminApi } from "../../lib/api";
import { formatRupiah } from "../../mock/mock";

const Stat = ({ icon: Icon, label, value, to, color = "#1B7A43" }) => (
  <Link
    to={to}
    className="card-lift bg-[#FBF6EC] border border-[#3B2412]/10 rounded-3xl p-6 flex items-center gap-4"
  >
    <div
      className="h-12 w-12 rounded-full flex items-center justify-center text-[#F6EFE4]"
      style={{ background: color }}
    >
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1">
      <div className="text-xs uppercase tracking-widest text-[#3B2412]/60">{label}</div>
      <div className="font-serif-warm text-2xl text-[#3B2412]">{value}</div>
    </div>
    <ArrowRight className="h-4 w-4 text-[#3B2412]/60" />
  </Link>
);

const AdminDashboard = () => {
  const [data, setData] = useState({ p: 0, c: 0, z: 0, t: 0, o: 0, ratios: [] });

  useEffect(() => {
    (async () => {
      try {
        const [prods, cats, zones, tsts, ratios, orders] = await Promise.all([
          publicApi.products(),
          publicApi.categories(),
          publicApi.shippingZones(),
          publicApi.testimonials(),
          publicApi.houseBlendRatios(),
          adminApi.listOrders("new").catch(() => []),
        ]);
        setData({ p: prods.length, c: cats.length, z: zones.length, t: tsts.length, o: orders.length, ratios });
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3">
        <Coffee className="h-6 w-6 text-[#1B7A43]" />
        <h1 className="font-serif-warm text-4xl text-[#3B2412]">Dashboard</h1>
      </div>
      <p className="mt-2 text-[#3B2412]/70">
        Ringkasan singkat katalog dan konten website Deli Coffee.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat icon={ClipboardList} label="Pesanan Baru" value={data.o} to="/admin/pesanan" color="#7B1F32" />
        <Stat icon={Package} label="Produk" value={data.p} to="/admin/produk" color="#1B7A43" />
        <Stat icon={Tag} label="Kategori" value={data.c} to="/admin/kategori" color="#3B2412" />
        <Stat icon={Truck} label="Zona Ongkir" value={data.z} to="/admin/ongkir" color="#C9A227" />
        <Stat icon={Star} label="Testimoni" value={data.t} to="/admin/testimoni" color="#5A3A22" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-[#FBF6EC] border border-[#3B2412]/10 p-6">
          <div className="flex items-center gap-2">
            <Blend className="h-4 w-4 text-[#1B7A43]" />
            <h2 className="font-serif-warm text-2xl text-[#3B2412]">House Blend</h2>
          </div>
          <div className="mt-4 divide-y divide-[#3B2412]/10">
            {data.ratios.map((r) => (
              <div key={r.value} className="flex justify-between py-2 text-sm">
                <span className="text-[#3B2412]">Rasio {r.label}</span>
                <span className="font-semibold text-[#1B7A43]">{formatRupiah(r.price)}/kg</span>
              </div>
            ))}
          </div>
          <Link to="/admin/house-blend" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1B7A43]">
            Kelola rasio <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-3xl bg-[#3B2412] text-[#F6EFE4] p-6">
          <h2 className="font-serif-warm text-2xl">Aksi cepat</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link to="/admin/produk" className="rounded-xl bg-[#1B7A43] px-4 py-3 text-sm font-semibold text-center hover:bg-[#145F34] transition-colors">
              + Tambah Produk
            </Link>
            <Link to="/admin/foto" className="rounded-xl bg-[#C9A227] text-[#2A1D0B] px-4 py-3 text-sm font-semibold text-center hover:bg-[#E4C25A] transition-colors inline-flex items-center justify-center gap-1">
              <ImagePlus className="h-4 w-4" /> Import Foto
            </Link>
            <Link to="/admin/pesanan" className="rounded-xl border border-[#F6EFE4]/40 px-4 py-3 text-sm font-semibold text-center hover:bg-[#F6EFE4] hover:text-[#3B2412] transition-colors">
              Cek Pesanan
            </Link>
            <Link to="/admin/pengaturan" className="rounded-xl border border-[#F6EFE4]/40 px-4 py-3 text-sm font-semibold text-center hover:bg-[#F6EFE4] hover:text-[#3B2412] transition-colors">
              Pengaturan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
