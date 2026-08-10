import { User, Phone, StickyNote } from "lucide-react";

const CustomerForm = ({ customer, onChange }) => (
  <div className="rounded-2xl border border-[#3B2412]/10 bg-[#FBF6EC] p-5">
    <div className="flex items-center gap-2">
      <User className="h-4 w-4 text-[#1B7A43]" />
      <div className="text-xs uppercase tracking-widest text-[#3B2412]/60 font-semibold">
        Kontak Anda
      </div>
    </div>
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      <div>
        <label className="text-[11px] uppercase tracking-widest text-[#3B2412]/60 font-semibold">
          Nama lengkap
        </label>
        <div className="mt-1 flex items-center gap-2 bg-[#F6EFE4] rounded-xl border border-[#3B2412]/20 px-3">
          <User className="h-4 w-4 text-[#3B2412]/40" />
          <input
            value={customer.name}
            onChange={(e) => onChange({ ...customer, name: e.target.value })}
            placeholder="mis. Rina P."
            className="flex-1 bg-transparent py-2.5 text-sm outline-none"
          />
        </div>
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-widest text-[#3B2412]/60 font-semibold">
          No. HP / WA
        </label>
        <div className="mt-1 flex items-center gap-2 bg-[#F6EFE4] rounded-xl border border-[#3B2412]/20 px-3">
          <Phone className="h-4 w-4 text-[#3B2412]/40" />
          <input
            value={customer.phone}
            onChange={(e) => onChange({ ...customer, phone: e.target.value })}
            placeholder="0812-xxxx-xxxx"
            className="flex-1 bg-transparent py-2.5 text-sm outline-none"
            inputMode="tel"
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="text-[11px] uppercase tracking-widest text-[#3B2412]/60 font-semibold">
          Catatan (opsional)
        </label>
        <div className="mt-1 flex items-start gap-2 bg-[#F6EFE4] rounded-xl border border-[#3B2412]/20 px-3">
          <StickyNote className="h-4 w-4 text-[#3B2412]/40 mt-2.5" />
          <textarea
            value={customer.note}
            onChange={(e) => onChange({ ...customer, note: e.target.value })}
            placeholder="Grind halus, pengiriman siang, dsb."
            className="flex-1 bg-transparent py-2.5 text-sm outline-none min-h-[60px] resize-y"
          />
        </div>
      </div>
    </div>
  </div>
);

export default CustomerForm;
