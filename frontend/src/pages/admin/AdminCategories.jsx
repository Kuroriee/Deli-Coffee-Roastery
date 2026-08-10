import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { publicApi, adminApi } from "../../lib/api";

const EMPTY = { id: null, name: "", short: "", description: "", image: "", sort_order: 0 };

const AdminCategories = () => {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => setRows(await publicApi.categories());
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing.name || !editing.short) {
      toast.error("Nama dan short wajib diisi");
      return;
    }
    try {
      await adminApi.saveCategory(editing);
      toast.success("Kategori tersimpan");
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Gagal menyimpan");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Hapus kategori ini?")) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success("Kategori dihapus");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Gagal menghapus");
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif-warm text-4xl text-[#3B2412]">Kategori</h1>
          <p className="mt-1 text-sm text-[#3B2412]/70">Kelompokkan produk agar mudah ditelusuri pelanggan.</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1">
          <Plus className="h-4 w-4" /> Tambah Kategori
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((c) => (
          <div key={c.id} className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 overflow-hidden">
            <div className="aspect-[16/9] bg-[#3B2412]/5 overflow-hidden">
              {c.image && <img src={c.image} alt={c.name} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
              <div className="text-xs text-[#3B2412]/60 uppercase tracking-widest">{c.id}</div>
              <div className="font-serif-warm text-lg text-[#3B2412]">{c.name}</div>
              <div className="text-xs text-[#3B2412]/70 mt-1 line-clamp-2">{c.description}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(c)} className="btn-outline rounded-full px-3 py-1.5 text-xs inline-flex items-center gap-1">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button onClick={() => remove(c.id)} className="rounded-full px-3 py-1.5 text-xs inline-flex items-center gap-1 text-[#7B1F32] hover:bg-[#7B1F32]/10">
                  <Trash2 className="h-3 w-3" /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-[#FBF6EC] w-full max-w-lg rounded-3xl">
            <div className="flex items-center justify-between p-5 border-b border-[#3B2412]/10">
              <h2 className="font-serif-warm text-2xl text-[#3B2412]">{editing.id ? "Edit Kategori" : "Tambah Kategori"}</h2>
              <button onClick={() => setEditing(null)} className="h-9 w-9 rounded-full hover:bg-[#3B2412]/10 flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <F label="Nama Lengkap"><input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></F>
              <F label="Nama Pendek (chip)"><input className="input" value={editing.short} onChange={(e) => setEditing({ ...editing, short: e.target.value })} /></F>
              <F label="ID (opsional, auto)"><input className="input" value={editing.id || ""} onChange={(e) => setEditing({ ...editing, id: e.target.value })} placeholder="contoh: arabica-specialty" /></F>
              <F label="Deskripsi"><textarea rows={3} className="input" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></F>
              <F label="URL Gambar"><input className="input" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></F>
              <F label="Urutan"><input type="number" className="input" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></F>
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

export default AdminCategories;
