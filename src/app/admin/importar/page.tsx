import ImportExcelClient from "@/components/admin/ImportExcelClient";
import { FileSpreadsheet } from "lucide-react";

export const metadata = { title: "Importar Productos — Bräxor Admin" };

export default function ImportarPage() {
  return (
    <main className="flex-1 p-6 md:p-10 overflow-auto">
      <div className="max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center">
              <FileSpreadsheet size={18} className="text-yellow-500" strokeWidth={2} />
            </div>
            <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.25em]">
              Carga Masiva
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Importar Productos
          </h1>
          <p className="text-zinc-500 text-sm mt-2 leading-relaxed max-w-lg">
            Subí tu archivo de inventario en formato Excel o CSV. El sistema actualiza precios de productos existentes y crea los nuevos como borradores.
          </p>
        </div>

        {/* Columns reference card */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-8">
          <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-4">
            Columnas reconocidas automáticamente
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { field: "SKU *", variants: "sku, codigo, code, ref, referencia, Código Interno", required: true },
              { field: "Nombre", variants: "nombre, name, descripcion, producto, item", required: false },
              { field: "Precio", variants: "precio, price, pvp, valor, importe", required: false },
              { field: "Stock", variants: "stock, cantidad, qty, existencia", required: false },
              { field: "Marca", variants: "marca, brand, fabricante", required: false },
              { field: "Categoría", variants: "categoria, rubro, tipo, familia", required: false },
            ].map(({ field, variants, required }) => (
              <div key={field} className="flex flex-col gap-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {field}
                  {required && <span className="text-yellow-500 text-[9px] font-black">REQUERIDO</span>}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">{variants}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-zinc-600 text-[10px] leading-relaxed">
              * Si el <strong className="text-zinc-400">SKU ya existe</strong> → solo se actualiza precio y stock.
              Si es <strong className="text-zinc-400">SKU nuevo</strong> → se crea como borrador (inactivo) con los datos disponibles.
              Los campos no reconocidos se ignoran.
            </p>
          </div>
        </div>

        <ImportExcelClient />
      </div>
    </main>
  );
}
