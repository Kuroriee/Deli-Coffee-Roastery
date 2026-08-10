import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Star, RefreshCw, Info } from "lucide-react";
import { toast } from "sonner";
import { adminApi, publicApi } from "../../lib/api";

const EMPTY = { id: null, name: "", city: "", text: "", rating: 5, source: "manual", sort_order: 0, active: true };

const AdminTestimonials = () => {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [gr, setGr] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const load = async () => setRows(await adminApi.listTestimonials());
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.name || !editing.text) {
      toast.error("Nama dan isi wajib diisi");
      return;
    }
    await adminApi.saveTestimonial({ ...editing, rating: Number(editing.rating) || 5 });
    toast.success("Testimoni tersimpan");
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus testimoni ini?")) return;
    await adminApi.deleteTestimonial(id);
    toast.success("Testimoni dihapus");
    load();
  };

  const fetchGoogle = async () => {
    setSyncing(true);
    try {
      const res = await publicApi.googleReviews();
      setGr(res);
      if (!res.available) {
        toast.error(res.reason || "Google Reviews belum aktif");
      } else {
        toast.success(`Berhasil menarik ${res.reviews?.length || 0} ulasan Google`);
      }
    } catch (e) {
      toast.error("Gagal memuat Google Reviews");
    } finally {
      setSyncing(false);
    }
  };

  const importGoogle = async (rv) => {
    await adminApi.saveTestimonial({
      name: rv.name,
      city: rv.city || "",
      text: rv.text,
      rating: rv.rating || 5,
      source: "google",
      sort_order: 0,
      active: true,
    });
    toast.success("Ditambahkan ke testimoni");
    load();
  };

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif-warm text-4xl text-[#3B2412]">Testimoni</h1>
          <p className="mt-1 text-sm text-[#3B2412]/70">Ulasan pelanggan yang tampil di beranda.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchGoogle} disabled={syncing} className="btn-outline rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1">
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> Tarik dari Google
          </button>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1">
            <Plus className="h-4 w-4" /> Testimoni Baru
          </button>
        </div>
      </div>

      {gr && !gr.available && (
        <div className="mt-4 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/40 p-4 text-sm text-[#3B2412] flex gap-2 items-start">
          <Info className="h-4 w-4 mt-0.5 text-[#C9A227]" />
          <div>
            <b>Google Reviews belum aktif.</b> Alasan: {gr.reason}. Silakan set <code>GOOGLE_PLACES_API_KEY</code> di server (env) dan isi <b>Google Place ID</b> di Pengaturan.
          </div>
        </div>
      )}

      {gr && gr.available && gr.reviews?.length > 0 && (
        <div className="mt-6 rounded-2xl border border-[#3B2412]/10 bg-[#FBF6EC] p-4">
          <div className="font-serif-warm text-lg text-[#3B2412]">Google Reviews terkini ({gr.review_count} ulasan, rating {gr.rating})</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {gr.reviews.map((rv, i) => (
              <div key={i} className="rounded-xl border border-[#3B2412]/10 p-3 bg-[#F6EFE4]">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-[#3B2412]">{rv.name}</div>
                  <div className="flex text-[#C9A227] text-xs">{Array.from({length: rv.rating}).map((_,k)=>"★").join("")}</div>
                </div>
                <p className="text-xs text-[#3B2412]/75 mt-1 line-clamp-3">{rv.text}</p>
                <button onClick={() => importGoogle(rv)} className="mt-2 btn-outline rounded-full px-3 py-1 text-xs">+ Impor ke testimoni</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((t) => (
          <div key={t.id} className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex text-[#C9A227]">{Array.from({length: t.rating || 5}).map((_,i)=>(<Star key={i} className="h-4 w-4 fill-[#C9A227]" />))}</div>
              <span className="text-[10px] uppercase tracking-widest text-[#3B2412]/50">{t.source}</span>
            </div>
            <p className="mt-2 text-sm text-[#3B2412]/85 line-clamp-4">“{t.text}”</p>
            <div className="mt-3 pt-3 border-t border-[#3B2412]/10 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-[#3B2412]/60">{t.city}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(t)} className="rounded-full h-8 w-8 inline-flex items-center justify-center hover:bg-[#3B2412]/10"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(t.id)} className="rounded-full h-8 w-8 inline-flex items-center justify-center text-[#7B1F32] hover:bg-[#7B1F32]/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-[#FBF6EC] w-full max-w-lg rounded-3xl">
            <div className="flex items-center justify-between p-5 border-b border-[#3B2412]/10">
              <h2 className="font-serif-warm text-2xl text-[#3B2412]">{editing.id ? "Edit Testimoni" : "Testimoni Baru"}</h2>
              <button onClick={() => setEditing(null)} className="h-9 w-9 rounded-full hover:bg-[#3B2412]/10 flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <F label="Nama"><input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></F>
                <F label="Kota"><input className="input" value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} /></F>
              </div>
              <F label="Isi Testimoni"><textarea rows={4} className="input" value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} /></F>
              <div className="grid grid-cols-3 gap-3">
                <F label="Rating (1-5)"><input type="number" min={1} max={5} className="input" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: e.target.value })} /></F>
                <F label="Urutan"><input type="number" className="input" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></F>
                <F label="Aktif"><label className="inline-flex items-center gap-2 text-sm mt-2"><input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Tampilkan</label></F>
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

export default AdminTestimonials;
