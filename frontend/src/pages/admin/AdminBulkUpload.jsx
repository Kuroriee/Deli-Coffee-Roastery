import { useEffect, useState } from "react";
import { Upload, ImagePlus, X, CheckCircle2, Save, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { publicApi, adminApi } from "../../lib/api";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AdminBulkUpload = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [photos, setPhotos] = useState([]); // [{ name, dataUrl, productId }]
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [ps, cs] = await Promise.all([adminApi.listProducts(), publicApi.categories()]);
      setProducts(ps);
      setCategories(cs);
    })();
  }, []);

  const catShort = (id) => categories.find((c) => c.id === id)?.short || id;

  const onPickFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newPhotos = [];
    for (const f of files) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 2 * 1024 * 1024) {
        toast.error(`${f.name} > 2MB, dilewati`);
        continue;
      }
      const dataUrl = await readFileAsDataUrl(f);
      // auto-suggest by filename match to product id or slug of name
      const stem = f.name.replace(/\.[^/.]+$/, "").toLowerCase();
      const match = products.find(
        (p) =>
          p.id.toLowerCase() === stem ||
          p.name.toLowerCase().replace(/\s+/g, "-").includes(stem) ||
          stem.includes(p.id.toLowerCase())
      );
      newPhotos.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: f.name,
        dataUrl,
        productId: match?.id || "",
      });
    }
    setPhotos((p) => [...p, ...newPhotos]);
    e.target.value = "";
  };

  const setAssign = (photoId, productId) =>
    setPhotos((ps) => ps.map((p) => (p.id === photoId ? { ...p, productId } : p)));

  const removePhoto = (photoId) => setPhotos((ps) => ps.filter((p) => p.id !== photoId));

  const saveAll = async () => {
    const assignments = photos
      .filter((p) => p.productId)
      .map((p) => ({ product_id: p.productId, image: p.dataUrl }));
    if (!assignments.length) {
      toast.error("Belum ada foto yang di-assign ke produk");
      return;
    }
    setSaving(true);
    try {
      const res = await adminApi.bulkAssignImages(assignments);
      toast.success(`${res.updated} foto tersimpan${res.not_found?.length ? `, ${res.not_found.length} produk tidak ditemukan` : ""}`);
      // remove successful photos
      setPhotos((ps) => ps.filter((p) => !p.productId || res.not_found?.includes(p.productId)));
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const assignedCount = photos.filter((p) => p.productId).length;

  const filteredProducts = products.filter((p) =>
    !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif-warm text-4xl text-[#3B2412]">Import Foto Massal</h1>
          <p className="mt-1 text-sm text-[#3B2412]/70">
            Pilih banyak foto sekaligus, lalu tentukan produk untuk masing-masing foto.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="btn-outline rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1 cursor-pointer">
            <Upload className="h-4 w-4" /> Pilih Banyak Foto
            <input type="file" accept="image/*" multiple hidden onChange={onPickFiles} />
          </label>
          <button
            onClick={saveAll}
            disabled={saving || assignedCount === 0}
            className="btn-primary rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-1 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Semua ({assignedCount})
          </button>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-[#3B2412]/25 bg-[#FBF6EC] p-14 text-center">
          <ImagePlus className="h-10 w-10 mx-auto text-[#3B2412]/40" />
          <div className="mt-3 font-serif-warm text-xl text-[#3B2412]">Belum ada foto</div>
          <p className="mt-1 text-sm text-[#3B2412]/60">
            Tekan <b>Pilih Banyak Foto</b> untuk mulai. Nama file yang cocok dengan ID produk akan
            di-assign otomatis.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 relative max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#3B2412]/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari produk di dropdown…"
              className="w-full pl-9 pr-3 py-2 rounded-full border border-[#3B2412]/25 bg-[#FBF6EC] text-sm"
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((ph) => (
              <div key={ph.id} className="rounded-2xl bg-[#FBF6EC] border border-[#3B2412]/10 overflow-hidden">
                <div className="relative aspect-[4/3] bg-[#3B2412]/5 overflow-hidden">
                  <img src={ph.dataUrl} alt={ph.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(ph.id)}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  {ph.productId && (
                    <div className="absolute bottom-2 left-2 bg-[#1B7A43] text-[#F6EFE4] rounded-full px-2 py-0.5 text-[10px] font-semibold inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Assigned
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-[10px] uppercase tracking-widest text-[#3B2412]/60 truncate">
                    {ph.name}
                  </div>
                  <label className="block mt-2 text-[10px] uppercase tracking-widest text-[#3B2412]/60 font-semibold">
                    Assign ke Produk
                  </label>
                  <select
                    value={ph.productId}
                    onChange={(e) => setAssign(ph.id, e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-[#3B2412]/25 bg-[#F6EFE4] text-sm"
                  >
                    <option value="">— pilih produk —</option>
                    {filteredProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{catShort(p.category)}] {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-xs text-[#3B2412]/60">
            Foto yang belum di-assign akan diabaikan saat menyimpan. Setelah tersimpan, kartu foto
            yang berhasil akan hilang dari daftar ini.
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBulkUpload;
