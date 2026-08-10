import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package, Tag, Truck, Star, ArrowRight, Coffee, Blend, ClipboardList,
  ImagePlus, AlertTriangle, ImageOff, DollarSign, EyeOff, TrendingUp, Calendar,
} from "lucide-react";
import { publicApi, adminApi } from "../../lib/api";
import { formatRupiah } from "../../mock/mock";
import api from "../../lib/api";

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

const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

const AdminDashboard = () => {
  const [data, setData] = useState({ p: 0, c: 0, z: 0, t: 0, o: 0, ratios: [] });
  const [month, setMonth] = useState(currentMonth);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState(null);

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

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/admin/stats/daily", { params: { month } });
        setStats(r.data);
      } catch {
        setStats(null);
      }
    })();
  }, [month]);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/admin/stats/restock-alerts");
        setAlerts(r.data);
      } catch {
        setAlerts(null);
      }
    })();
  }, []);

  const maxCount = useMemo(
    () => Math.max(1, ...(stats?.days || []).map((d) => d.count)),
    [stats]
  );

  const monthLabel = (() => {
    try {
      const [y, m] = month.split("-").map(Number);
      return new Date(y, m - 1, 1).toLocaleString("id-ID", { month: "long", year: "numeric" });
    } catch { return month; }
  })();

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

      {/* ---- Monthly chart ---- */}
      <section className="mt-10 rounded-3xl bg-[#FBF6EC] border border-[#3B2412]/10 p-6">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#1B7A43]" />
              <h2 className="font-serif-warm text-2xl text-[#3B2412]">
                Ringkasan {monthLabel}
              </h2>
            </div>
            <p className="text-sm text-[#3B2412]/70 mt-0.5">
              Jumlah pesanan per hari. Batang lebih tinggi = hari lebih ramai.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#3B2412]/60" />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-full border border-[#3B2412]/25 bg-[#F6EFE4] text-sm px-3 py-2"
            />
          </div>
        </div>

        {stats && (
          <>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniStat label="Total Pesanan" value={stats.total_count} />
              <MiniStat label="Total Nilai" value={formatRupiah(stats.total_revenue)} />
              <MiniStat
                label="Rata-rata / hari"
                value={(stats.total_count / Math.max(1, stats.days.length)).toFixed(1)}
              />
              <MiniStat
                label="Hari Terbaik"
                value={
                  (() => {
                    const best = [...stats.days].sort((a, b) => b.count - a.count)[0];
                    return best && best.count
                      ? `${new Date(best.date).getDate()} (${best.count})`
                      : "–";
                  })()
                }
              />
            </div>

            {/* Bar chart */}
            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[520px]">
                <div className="flex items-end gap-1 h-40">
                  {stats.days.map((d) => {
                    const h = (d.count / maxCount) * 100;
                    const dt = new Date(d.date);
                    const isToday = d.date === new Date().toISOString().slice(0, 10);
                    return (
                      <div
                        key={d.date}
                        className="flex-1 flex flex-col items-center gap-1 group"
                        title={`${dt.toLocaleDateString("id-ID")}\n${d.count} pesanan · ${formatRupiah(d.revenue)}`}
                      >
                        <div
                          className={`w-full rounded-t-md transition-colors ${
                            d.count === 0 ? "bg-[#3B2412]/10" : isToday ? "bg-[#C9A227]" : "bg-[#1B7A43]"
                          } group-hover:opacity-80`}
                          style={{ height: `${h}%`, minHeight: d.count > 0 ? 4 : 2 }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-1 mt-1">
                  {stats.days.map((d) => (
                    <div key={d.date} className="flex-1 text-center text-[9px] text-[#3B2412]/50">
                      {new Date(d.date).getDate()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        {!stats && (
          <div className="mt-6 text-sm text-[#3B2412]/60">Memuat data grafik…</div>
        )}
      </section>

      {/* ---- Restock / attention alerts ---- */}
      <section className="mt-8 rounded-3xl bg-[#3B2412] text-[#F6EFE4] p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#C9A227]" />
          <h2 className="font-serif-warm text-2xl">Pengingat Produk</h2>
        </div>
        <p className="text-sm text-[#F6EFE4]/70 mt-0.5">
          Produk yang perlu diperbarui foto atau harganya sebelum tampil optimal.
        </p>

        {alerts ? (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <AlertBlock
              icon={ImageOff}
              title="Belum ada foto"
              items={alerts.no_image}
              color="#C9A227"
              emptyMsg="Semua produk sudah punya foto."
            />
            <AlertBlock
              icon={DollarSign}
              title="Harga masih 0"
              items={alerts.zero_price}
              color="#7B1F32"
              emptyMsg="Semua produk sudah punya harga."
            />
            <AlertBlock
              icon={EyeOff}
              title="Produk nonaktif"
              items={alerts.inactive}
              color="#8A5A3C"
              emptyMsg="Semua produk aktif."
            />
          </div>
        ) : (
          <div className="mt-4 text-sm text-[#F6EFE4]/60">Memuat pengingat…</div>
        )}
      </section>

      {/* ---- House Blend + Quick actions (existing) ---- */}
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

        <div className="rounded-3xl bg-[#1B7A43] text-[#F6EFE4] p-6">
          <h2 className="font-serif-warm text-2xl">Aksi cepat</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link to="/admin/produk" className="rounded-xl bg-[#F6EFE4] text-[#1B7A43] px-4 py-3 text-sm font-semibold text-center hover:bg-white transition-colors">
              + Tambah Produk
            </Link>
            <Link to="/admin/foto" className="rounded-xl bg-[#C9A227] text-[#2A1D0B] px-4 py-3 text-sm font-semibold text-center hover:bg-[#E4C25A] transition-colors inline-flex items-center justify-center gap-1">
              <ImagePlus className="h-4 w-4" /> Import Foto
            </Link>
            <Link to="/admin/pesanan" className="rounded-xl border border-[#F6EFE4]/40 px-4 py-3 text-sm font-semibold text-center hover:bg-[#F6EFE4] hover:text-[#1B7A43] transition-colors">
              Cek Pesanan
            </Link>
            <Link to="/admin/pengaturan" className="rounded-xl border border-[#F6EFE4]/40 px-4 py-3 text-sm font-semibold text-center hover:bg-[#F6EFE4] hover:text-[#1B7A43] transition-colors">
              Pengaturan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value }) => (
  <div className="rounded-xl bg-[#F6EFE4] border border-[#3B2412]/10 p-3">
    <div className="text-[10px] uppercase tracking-widest text-[#3B2412]/60">{label}</div>
    <div className="font-serif-warm text-lg text-[#3B2412] mt-0.5">{value}</div>
  </div>
);

const AlertBlock = ({ icon: Icon, title, items, color, emptyMsg }) => (
  <div className="rounded-2xl bg-[#F6EFE4]/10 border border-[#F6EFE4]/15 p-4">
    <div className="flex items-center gap-2">
      <span className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: color, color: "#2A1D0B" }}>
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-[10px] uppercase tracking-widest text-[#F6EFE4]/60">
          {items.length} produk
        </div>
      </div>
    </div>
    {items.length === 0 ? (
      <div className="mt-3 text-xs text-[#F6EFE4]/60">{emptyMsg}</div>
    ) : (
      <>
        <ul className="mt-3 space-y-1 max-h-40 overflow-y-auto pr-1">
          {items.slice(0, 6).map((p) => (
            <li key={p.id} className="text-xs text-[#F6EFE4]/85 flex items-center justify-between gap-2">
              <span className="truncate">{p.name}</span>
              <Link to="/admin/produk" className="text-[10px] text-[#C9A227] hover:underline whitespace-nowrap">Perbaiki →</Link>
            </li>
          ))}
          {items.length > 6 && (
            <li className="text-[10px] text-[#F6EFE4]/50">+{items.length - 6} lainnya…</li>
          )}
        </ul>
      </>
    )}
  </div>
);

export default AdminDashboard;
