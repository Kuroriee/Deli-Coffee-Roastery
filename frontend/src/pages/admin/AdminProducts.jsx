import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, X, Upload, ImagePlus, Search, Blend, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { publicApi, adminApi } from "../../lib/api";
import { formatRupiah } from "../../mock/mock";

const EMPTY = {
  id: null,
  category: "",
  name: "",
  process: "",
  region: "",
  price: 0,
  badge: "",
  desc: "",
  image: "",
  active: true,
  sort_order: 0,
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [ps, cs] = await Promise.all([adminApi.listProducts(), publicApi.categories()]);
    setProducts(ps);
    setCategories(cs);
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return products.filter(
      (p) =>
        (!catFilter || p.category === catFilter) &&
        (!q || p.name.toLowerCase().includes(q.toLowerCase()))
    );
  }, [products, q, catFilter]);

  const startNew = () => setEditing({ ...EMPTY, category: categories[0]?.id || "" });

  const onSave = async () => {
    if (!editing.name || !editing.category) {
      toast.error("Nama dan kategori wajib diisi");
      return;
    }
    try {
      await adminApi.saveProduct({ ...editing, price: Number(editing.price) || 0 });
      toast.success("Produk tersimpan");
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Gagal menyimpan");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Hapus produk ini?")) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success("Produk dihapus");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Gagal menghapus");
    }
  };

  const onUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maks 2MB");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setEditing((cur) => ({ ...cur, image: dataUrl }));
  };

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif-warm text-4xl text-[#3B2412]">Produk</h1>
          <p className="mt-1 text-sm text-[#3B2412]/70">
            Kelola daftar biji kopi, harga, dan foto produk.
          </p>
        </div>
        <button type="button" onClick={startNew} className="btn-primary rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1">
          <Plus className="h-4 w-4" /> Tambah Produk
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3B2412]/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari produk…"
            className="w-full pl-9 pr-3 py-2 rounded-full border border-[#3B2412]/25 bg-[#FBF6EC] text-sm"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-full border border-[#3B2412]/25 bg-[#FBF6EC] text-sm px-4 py-2"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catFilter === "house-blend" && (
          <div className="col-span-full rounded-3xl bg-[#1B7A43] text-[#F6EFE4] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#F6EFE4] text-[#1B7A43] flex items-center justify-center flex-shrink-0">
              <Blend className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="font-serif-warm text-2xl">House Blend dikelola terpisah</div>
              <p className="text-sm text-[#F6EFE4]/85 mt-1">
                Karena House Blend memakai <b>sistem rasio</b> (30/70 sampai 70/30) dengan harga berbeda per rasio,
                pengelolaannya ada di menu khusus <b>House Blend</b>, bukan di daftar produk biasa.
              </p>
            </div>
            <Link
              to="/admin/house-blend"
              className="rounded-full bg-[#C9A227] text-[#2A1D0B] px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-1 hover:bg-[#E4C25A] transition-colors"
            >
              Buka House Blend <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
        {filtered.map((p) => (
          <div key={p.id} className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 overflow-hidden">
            <div className="aspect-[4/3] bg-[#3B2412]/5 overflow-hidden">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#3B2412]/40 text-xs">
                  Tanpa foto
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="text-xs text-[#3B2412]/60">
                {categories.find((c) => c.id === p.category)?.short || p.category}
              </div>
              <div className="font-serif-warm text-lg text-[#3B2412]">{p.name}</div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-[#1B7A43] font-semibold text-sm">{formatRupiah(p.price)}/kg</div>
                {!p.active && <span className="text-[10px] uppercase text-[#7B1F32]">nonaktif</span>}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing(p)} className="btn-outline rounded-full px-3 py-1.5 text-xs inline-flex items-center gap-1">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button onClick={() => onDelete(p.id)} className="rounded-full px-3 py-1.5 text-xs inline-flex items-center gap-1 text-[#7B1F32] hover:bg-[#7B1F32]/10">
                  <Trash2 className="h-3 w-3" /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && catFilter !== "house-blend" && (
          <div className="col-span-full text-center py-16 text-[#3B2412]/60">
            Tidak ada produk yang cocok.
          </div>
        )}
      </div>

      {/* Editor Sheet */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#FBF6EC] w-full max-w-2xl rounded-3xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#3B2412]/10 sticky top-0 bg-[#FBF6EC]">
              <h2 className="font-serif-warm text-2xl text-[#3B2412]">
                {editing.id ? "Edit Produk" : "Tambah Produk"}
              </h2>
              <button onClick={() => setEditing(null)} className="h-9 w-9 rounded-full hover:bg-[#3B2412]/10 flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 grid gap-4 md:grid-cols-2">
              {/* image */}
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-[#3B2412]/60 font-semibold">
                  Foto Produk
                </label>
                <div className="mt-2 flex items-start gap-4">
                  <div className="h-28 w-28 rounded-xl overflow-hidden bg-[#3B2412]/10 flex items-center justify-center">
                    {editing.image ? (
                      <img src={editing.image} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus className="h-6 w-6 text-[#3B2412]/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="btn-outline rounded-full px-4 py-2 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer">
                      <Upload className="h-3 w-3" /> Unggah foto
                      <input type="file" accept="image/*" hidden onChange={onUploadImage} />
                    </label>
                    <input
                      value={editing.image || ""}
                      onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                      placeholder="Atau tempel URL gambar…"
                      className="mt-2 w-full px-3 py-2 rounded-lg border border-[#3B2412]/25 bg-[#F6EFE4] text-xs"
                    />
                    <p className="mt-1 text-[10px] text-[#3B2412]/60">Foto disimpan sebagai base64. Maks 2MB.</p>
                  </div>
                </div>
              </div>

              <Field label="Nama" required>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" />
              </Field>
              <Field label="Kategori" required>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input">
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </Field>
              <Field label="Proses / Label Bawah">
                <input value={editing.process} onChange={(e) => setEditing({ ...editing, process: e.target.value })} className="input" placeholder="Mis. Wine, Honey, Gayo" />
              </Field>
              <Field label="Region">
                <input value={editing.region || ""} onChange={(e) => setEditing({ ...editing, region: e.target.value })} className="input" placeholder="Mis. Gayo, Lintong" />
              </Field>
              <Field label="Harga (Rp / kg)" required>
                <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className="input" />
              </Field>
              <Field label="Badge (Premium / Eksklusif)">
                <input value={editing.badge || ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} className="input" />
              </Field>
              <Field label="Deskripsi" full>
                <textarea rows={3} value={editing.desc || ""} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} className="input" />
              </Field>
              <Field label="Urutan">
                <input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="input" />
              </Field>
              <Field label="Status">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                  Aktif (tampil di website)
                </label>
              </Field>
            </div>

            <div className="p-5 border-t border-[#3B2412]/10 flex justify-end gap-2 sticky bottom-0 bg-[#FBF6EC]">
              <button onClick={() => setEditing(null)} className="rounded-full px-4 py-2 text-sm text-[#3B2412]/70 hover:bg-[#3B2412]/10">Batal</button>
              <button onClick={onSave} className="btn-primary rounded-full px-6 py-2 text-sm font-semibold">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children, required, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="text-xs uppercase tracking-widest text-[#3B2412]/60 font-semibold">
      {label}
      {required && <span className="text-[#7B1F32]"> *</span>}
    </label>
    <div className="mt-1">{children}</div>
  </div>
);

export default AdminProducts;
