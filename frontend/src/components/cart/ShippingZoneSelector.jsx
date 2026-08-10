import { Truck, Info } from "lucide-react";
import { formatRupiah } from "../../mock/mock";

const ShippingZoneSelector = ({ zones, zoneId, onSelect }) => {
  if (!zones || zones.length === 0) return null;
  return (
    <div className="rounded-2xl border border-[#3B2412]/10 bg-[#FBF6EC] p-5">
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-[#1B7A43]" />
        <div className="text-xs uppercase tracking-widest text-[#3B2412]/60 font-semibold">
          Zona Pengiriman
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {zones.map((z) => {
          const active = zoneId === z.id;
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => onSelect(z.id)}
              className={`text-left rounded-2xl border p-3 transition-colors ${
                active
                  ? "border-[#1B7A43] bg-[#1B7A43]/5"
                  : "border-[#3B2412]/15 hover:border-[#1B7A43]/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm text-[#3B2412]">{z.name}</div>
                <div className="text-sm font-semibold text-[#1B7A43]">
                  {z.cost === 0 ? "Gratis" : formatRupiah(z.cost)}
                </div>
              </div>
              {z.description && (
                <div className="text-xs text-[#3B2412]/70 mt-0.5">{z.description}</div>
              )}
              {z.eta && (
                <div className="text-[10px] text-[#3B2412]/50 mt-1 uppercase tracking-widest">
                  ETA: {z.eta}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-[11px] text-[#3B2412]/60 flex items-start gap-1">
        <Info className="h-3 w-3 mt-0.5" />
        Ongkir bersifat estimasi. Admin akan konfirmasi jika ada penyesuaian saat WhatsApp.
      </div>
    </div>
  );
};

export default ShippingZoneSelector;
