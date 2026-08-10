import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { publicApi, adminApi } from "../../lib/api";

const AdminHouseBlend = () => {
  const [ratios, setRatios] = useState([]);

  const load = async () => setRatios(await publicApi.houseBlendRatios());
  useEffect(() => { load(); }, []);

  const update = (i, patch) => setRatios((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i) => setRatios((rs) => rs.filter((_, idx) => idx !== i));
  const addRow = () => setRatios((rs) => [...rs, { value: "", label: "", price: 0, note: "", sort_order: rs.length + 1 }]);

  const save = async () => {
    const cleaned = ratios
      .filter((r) => r.value && r.label)
      .map((r, idx) => ({
        value: r.value,
        label: r.label,
        price: Number(r.price) || 0,
        note: r.note || "",
        sort_order: idx + 1,
      }));
    try {
      await adminApi.saveRatios(cleaned);
      toast.success("Rasio House Blend tersimpan");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Gagal menyimpan");
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif-warm text-4xl text-[#3B2412]">House Blend</h1>
          <p className="mt-1 text-sm text-[#3B2412]/70">
            Atur rasio dan harga House Blend Arabica + Robusta.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={addRow} className="btn-outline rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1">
            <Plus className="h-4 w-4" /> Rasio
          </button>
          <button onClick={save} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1">
            <Save className="h-4 w-4" /> Simpan
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#3B2412]/10 bg-[#FBF6EC]">
        <table className="w-full text-sm">
          <thead className="bg-[#3B2412]/5">
            <tr>
              <th className="th">Value (30/70)</th>
              <th className="th">Label (30 / 70)</th>
              <th className="th">Harga /kg</th>
              <th className="th">Catatan rasa</th>
              <th className="th"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3B2412]/10">
            {ratios.map((r, i) => (
              <tr key={r.value || `ratio-${i}`}>
                <td className="td"><input className="input" value={r.value} onChange={(e) => update(i, { value: e.target.value })} placeholder="30/70" /></td>
                <td className="td"><input className="input" value={r.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="30 / 70" /></td>
                <td className="td"><input type="number" className="input" value={r.price} onChange={(e) => update(i, { price: e.target.value })} /></td>
                <td className="td"><input className="input" value={r.note} onChange={(e) => update(i, { note: e.target.value })} /></td>
                <td className="td text-right">
                  <button onClick={() => remove(i)} className="text-[#7B1F32] hover:bg-[#7B1F32]/10 rounded-full h-8 w-8 inline-flex items-center justify-center">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {ratios.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-[#3B2412]/60">Belum ada rasio. Tekan “Rasio” untuk menambah.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHouseBlend;
