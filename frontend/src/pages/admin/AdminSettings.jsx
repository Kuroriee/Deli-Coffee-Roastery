import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { publicApi, adminApi } from "../../lib/api";

const AdminSettings = () => {
  const [s, setS] = useState(null);

  const load = async () => setS(await publicApi.settings());
  useEffect(() => { load(); }, []);

  if (!s) return <div>Memuat…</div>;

  const set = (patch) => setS({ ...s, ...patch });
  const setAdmin = (i, patch) => set({ admins: s.admins.map((a, idx) => (idx === i ? { ...a, ...patch } : a)) });
  const addAdmin = () => set({ admins: [...(s.admins || []), { name: "", phone: "", display: "" }] });
  const rmAdmin = (i) => set({ admins: s.admins.filter((_, idx) => idx !== i) });

  const save = async () => {
    try {
      await adminApi.saveSettings({
        ...s,
        opening_hour: Number(s.opening_hour) || 9,
        closing_hour: Number(s.closing_hour) || 21,
        rating: Number(s.rating) || 0,
        review_count: Number(s.review_count) || 0,
      });
      toast.success("Pengaturan disimpan");
    } catch (e) {
      toast.error("Gagal menyimpan");
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif-warm text-4xl text-[#3B2412]">Pengaturan Brand</h1>
          <p className="mt-1 text-sm text-[#3B2412]/70">Info dasar yang muncul di seluruh website.</p>
        </div>
        <button onClick={save} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1">
          <Save className="h-4 w-4" /> Simpan
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <F label="Brand"><input className="input" value={s.brand_name} onChange={(e) => set({ brand_name: e.target.value })} /></F>
        <F label="Nama Lengkap"><input className="input" value={s.full_name} onChange={(e) => set({ full_name: e.target.value })} /></F>
        <F label="Tagline" full><input className="input" value={s.tagline} onChange={(e) => set({ tagline: e.target.value })} /></F>
        <F label="Sub Tagline" full><input className="input" value={s.sub_tagline} onChange={(e) => set({ sub_tagline: e.target.value })} /></F>
        <F label="Instagram (tanpa @)"><input className="input" value={s.instagram} onChange={(e) => set({ instagram: e.target.value })} /></F>
        <F label="Plus Code"><input className="input" value={s.plus_code} onChange={(e) => set({ plus_code: e.target.value })} /></F>
        <F label="Alamat" full><textarea rows={2} className="input" value={s.address} onChange={(e) => set({ address: e.target.value })} /></F>
        <F label="Jam Buka (0-23)"><input type="number" className="input" value={s.opening_hour} onChange={(e) => set({ opening_hour: e.target.value })} /></F>
        <F label="Jam Tutup (0-23)"><input type="number" className="input" value={s.closing_hour} onChange={(e) => set({ closing_hour: e.target.value })} /></F>
        <F label="Rating Google"><input type="number" step="0.1" className="input" value={s.rating} onChange={(e) => set({ rating: e.target.value })} /></F>
        <F label="Jumlah Ulasan"><input type="number" className="input" value={s.review_count} onChange={(e) => set({ review_count: e.target.value })} /></F>
        <F label="Google Place ID (untuk tarik ulasan otomatis)" full>
          <input className="input" value={s.google_place_id || ""} onChange={(e) => set({ google_place_id: e.target.value })} placeholder="ChIJ..." />
        </F>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-warm text-2xl text-[#3B2412]">Admin / Kontak WA</h2>
          <button onClick={addAdmin} className="btn-outline rounded-full px-3 py-1.5 text-xs inline-flex items-center gap-1">
            <Plus className="h-3 w-3" /> Tambah
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {(s.admins || []).map((a, i) => (
            <div key={a.phone || `admin-${i}`} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center bg-[#FBF6EC] rounded-2xl p-3 border border-[#3B2412]/10">
              <input className="input" value={a.name} placeholder="Nama" onChange={(e) => setAdmin(i, { name: e.target.value })} />
              <input className="input" value={a.phone} placeholder="Nomor WA (0812…)" onChange={(e) => setAdmin(i, { phone: e.target.value })} />
              <input className="input" value={a.display} placeholder="Tampilan (0812-...)" onChange={(e) => setAdmin(i, { display: e.target.value })} />
              <button onClick={() => rmAdmin(i)} className="text-[#7B1F32] hover:bg-[#7B1F32]/10 rounded-full h-9 inline-flex items-center gap-1 px-3 text-sm justify-center">
                <Trash2 className="h-3.5 w-3.5" /> Hapus
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const F = ({ label, children, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="text-xs uppercase tracking-widest text-[#3B2412]/60 font-semibold">{label}</label>
    <div className="mt-1">{children}</div>
  </div>
);

export default AdminSettings;
