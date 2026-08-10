import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { publicApi, adminApi } from "../../lib/api";
import { formatRupiah } from "../../mock/mock";

const EMPTY = { id: null, name: "", description: "", cost: 0, eta: "", sort_order: 0, active: true };

const AdminShipping = () => {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => setRows(await publicApi.shippingZones());
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.name) {
      toast.error("Nama zona wajib");
      return;
    }
    try {
      await adminApi.saveZone({ ...editing, cost: Number(editing.cost) || 0 });
      toast.success("Zona tersimpan");
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Gagal menyimpan");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus zona ini?")) return;
    await adminApi.deleteZone(id);
    toast.success("Zona dihapus");
    load();
  };

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif-warm text-4xl text-[#3B2412]">Zona Ongkir</h1>
          <p className="mt-1 text-sm text-[#3B2412]/70">Estimasi ongkir per wilayah. Muncul di halaman keranjang & pesan WhatsApp.</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1">
          <Plus className="h-4 w-4" /> Tambah Zona
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#3B2412]/10 bg-[#FBF6EC]">
        <table className="w-full text-sm">
          <thead className="bg-[#3B2412]/5">
            <tr>
              <th className="th">Nama</th>
              <th className="th">Deskripsi</th>
              <th className="th">Ongkir</th>
              <th className="th">Estimasi</th>
              <th className="th">Urut</th>
              <th className="th">Aktif</th>
              <th className="th"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3B2412]/10">
            {rows.map((z) => (
              <tr key={z.id}>
                <td className="td font-semibold">{z.name}</td>
                <td className="td text-[#3B2412]/70">{z.description}</td>
                <td className="td text-[#1B7A43] font-semibold">{formatRupiah(z.cost)}</td>
                <td className="td">{z.eta}</td>
                <td className="td">{z.sort_order}</td>
                <td className="td">{z.active ? "✓" : "–"}</td>
                <td className="td text-right whitespace-nowrap">
                  <button onClick={() => setEditing(z)} className="rounded-full h-8 w-8 inline-flex items-center justify-center hover:bg-[#3B2412]/10"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(z.id)} className="rounded-full h-8 w-8 inline-flex items-center justify-center text-[#7B1F32] hover:bg-[#7B1F32]/10"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-[#3B2412]/60">Belum ada zona ongkir.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-[#FBF6EC] w-full max-w-lg rounded-3xl">
            <div className="flex items-center justify-between p-5 border-b border-[#3B2412]/10">
              <h2 className="font-serif-warm text-2xl text-[#3B2412]">{editing.id ? "Edit Zona" : "Tambah Zona"}</h2>
              <button onClick={() => setEditing(null)} className="h-9 w-9 rounded-full hover:bg-[#3B2412]/10 flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <F label="Nama Zona"><input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></F>
              <F label="Deskripsi"><input className="input" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Ongkir (Rp)"><input type="number" className="input" value={editing.cost} onChange={(e) => setEditing({ ...editing, cost: e.target.value })} /></F>
                <F label="Estimasi tiba"><input className="input" value={editing.eta} onChange={(e) => setEditing({ ...editing, eta: e.target.value })} /></F>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <F label="Urutan"><input type="number" className="input" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></F>
                <F label="Status">
                  <label className="inline-flex items-center gap-2 text-sm mt-2">
                    <input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Aktif
                  </label>
                </F>
              </div>
            </div>
            <div className="p-5 border-t border-[#3B2412]/10 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-full px-4 py-2 text-sm text-[#3B2412]/70 hover:bg-[#3B2412]/10">Batal</button>
              <button onClick={save} className="btn-primary rounded-full px-6 py-2 text-sm font-semibold">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const F = ({ label, children }) => (
  <div>
    <label className="text-xs uppercase tracking-widest text-[#3B2412]/60 font-semibold">{label}</label>
    <div className="mt-1">{children}</div>
  </div>
);

export default AdminShipping;
