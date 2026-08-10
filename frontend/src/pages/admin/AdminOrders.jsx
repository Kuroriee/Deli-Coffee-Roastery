import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw, CheckCircle2, XCircle, Trash2, Phone, MapPin, Package,
  MessageCircle, Filter, Download,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "../../lib/api";
import { formatRupiah, buildWhatsAppLink } from "../../mock/mock";
import { API_BASE } from "../../lib/api";

const STATUS_LABELS = {
  new: { label: "Baru", color: "bg-[#C9A227]/20 text-[#8A6E14] border-[#C9A227]/40" },
  fulfilled: { label: "Selesai", color: "bg-[#1B7A43]/15 text-[#1B7A43] border-[#1B7A43]/40" },
  cancelled: { label: "Batal", color: "bg-[#7B1F32]/15 text-[#7B1F32] border-[#7B1F32]/40" },
};

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [exportMonth, setExportMonth] = useState(currentMonth);

  const downloadCsv = async () => {
    try {
      const url = `${API_BASE}/admin/orders/export.csv?month=${encodeURIComponent(exportMonth)}${status ? `&status=${status}` : ""}`;
      // Use fetch with credentials so cookie is included
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) {
        toast.error(`Gagal unduh CSV (${res.status})`);
        return;
      }
      const blob = await res.blob();
      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `deli-coffee-orders-${exportMonth}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      toast.success("CSV terunduh");
    } catch (e) {
      toast.error("Gagal unduh CSV");
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      setOrders(await adminApi.listOrders(status || null));
    } catch (e) {
      toast.error("Gagal memuat pesanan");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status]);

  const updateStatus = async (id, s) => {
    try {
      await adminApi.updateOrderStatus(id, s);
      toast.success("Status diperbarui");
      load();
    } catch { toast.error("Gagal memperbarui"); }
  };

  const removeOrder = async (id) => {
    if (!window.confirm("Hapus pesanan ini?")) return;
    await adminApi.deleteOrder(id);
    toast.success("Pesanan dihapus");
    load();
  };

  const totals = useMemo(() => {
    const totalNew = orders.filter((o) => o.status === "new").length;
    const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + (o.total || 0), 0);
    return { totalNew, revenue };
  }, [orders]);

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif-warm text-4xl text-[#3B2412]">Pesanan Masuk</h1>
          <p className="mt-1 text-sm text-[#3B2412]/70">
            Log tiap kali pelanggan menekan “Pesan Sekarang” di keranjang.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="month"
            value={exportMonth}
            onChange={(e) => setExportMonth(e.target.value)}
            className="rounded-full border border-[#3B2412]/25 bg-[#FBF6EC] text-sm px-3 py-2"
          />
          <button
            onClick={downloadCsv}
            className="btn-amber rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1"
            title="Unduh laporan pesanan bulan terpilih"
          >
            <Download className="h-4 w-4" /> Unduh CSV
          </button>
          <button onClick={load} className="btn-outline rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatBox label="Pesanan Baru" value={totals.totalNew} />
        <StatBox label="Total Ditampilkan" value={orders.length} />
        <StatBox label="Estimasi Nilai (non-batal)" value={formatRupiah(totals.revenue)} />
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-[#3B2412]/60" />
        {[
          { v: "", l: "Semua" },
          { v: "new", l: "Baru" },
          { v: "fulfilled", l: "Selesai" },
          { v: "cancelled", l: "Batal" },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setStatus(f.v)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
              status === f.v ? "bg-[#1B7A43] border-[#1B7A43] text-[#F6EFE4]" : "border-[#3B2412]/25 text-[#3B2412] hover:border-[#1B7A43]"
            }`}
          >
            {f.l}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {orders.length === 0 && (
          <div className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 p-10 text-center text-[#3B2412]/60">
            {loading ? "Memuat…" : "Belum ada pesanan."}
          </div>
        )}
        {orders.map((o) => {
          const st = STATUS_LABELS[o.status] || STATUS_LABELS.new;
          const waMsg = `Halo ${o.customer_name}, terima kasih pesanannya di Deli Coffee.`;
          const waLink = buildWhatsAppLink(o.customer_phone, waMsg);
          return (
            <div key={o.id} className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 overflow-hidden">
              <div className="p-4 md:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`rounded-full px-3 py-1 text-[10px] tracking-widest uppercase font-semibold border ${st.color}`}>{st.label}</span>
                      <span className="text-xs text-[#3B2412]/60">{fmtDate(o.created_at)}</span>
                      <span className="text-xs text-[#3B2412]/40">· #{o.id.slice(-6)}</span>
                    </div>
                    <div className="mt-2 font-serif-warm text-xl text-[#3B2412]">{o.customer_name}</div>
                    <div className="text-sm text-[#3B2412]/70 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {o.customer_phone}</span>
                      {o.zone_name && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {o.zone_name}</span>}
                      <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> Ke {o.admin_name || o.admin_phone}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#3B2412]/60">Total estimasi</div>
                    <div className="font-serif-warm text-2xl text-[#1B7A43]">{formatRupiah(o.total)}</div>
                    <div className="text-[11px] text-[#3B2412]/60">Sub {formatRupiah(o.subtotal)} + Ongkir {formatRupiah(o.shipping_cost)}</div>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(o.items || []).map((it, i) => (
                    <div key={i} className="text-xs bg-[#F6EFE4] rounded-lg px-3 py-2 flex items-center justify-between border border-[#3B2412]/10">
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3 text-[#1B7A43]" />
                        <span className="font-semibold text-[#3B2412]">{it.name}</span>
                        {it.variant && <span className="text-[#3B2412]/60">({it.variant})</span>}
                      </div>
                      <div className="text-[#3B2412]/70">× {it.qty} kg</div>
                    </div>
                  ))}
                </div>

                {o.customer_note && (
                  <div className="mt-3 text-xs bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-lg p-2 text-[#3B2412]">
                    <b>Catatan pelanggan:</b> {o.customer_note}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {o.status !== "fulfilled" && (
                    <button onClick={() => updateStatus(o.id, "fulfilled")} className="rounded-full px-3 py-1.5 text-xs font-semibold bg-[#1B7A43] text-[#F6EFE4] hover:bg-[#145F34] inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Tandai Selesai
                    </button>
                  )}
                  {o.status !== "cancelled" && (
                    <button onClick={() => updateStatus(o.id, "cancelled")} className="rounded-full px-3 py-1.5 text-xs font-semibold border border-[#7B1F32]/40 text-[#7B1F32] hover:bg-[#7B1F32]/10 inline-flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Batalkan
                    </button>
                  )}
                  {o.status !== "new" && (
                    <button onClick={() => updateStatus(o.id, "new")} className="rounded-full px-3 py-1.5 text-xs text-[#3B2412]/70 hover:bg-[#3B2412]/10">
                      Kembalikan ke Baru
                    </button>
                  )}
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="rounded-full px-3 py-1.5 text-xs font-semibold btn-outline inline-flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" /> WA ke Pelanggan
                  </a>
                  <button onClick={() => removeOrder(o.id)} className="ml-auto rounded-full h-8 w-8 inline-flex items-center justify-center text-[#7B1F32] hover:bg-[#7B1F32]/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatBox = ({ label, value }) => (
  <div className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 p-4">
    <div className="text-[10px] uppercase tracking-widest text-[#3B2412]/60">{label}</div>
    <div className="font-serif-warm text-2xl text-[#3B2412] mt-1">{value}</div>
  </div>
);

export default AdminOrders;
