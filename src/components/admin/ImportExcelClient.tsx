"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, RefreshCw } from "lucide-react";

interface ImportResult {
  success: boolean;
  updated: number;
  created: number;
  skipped: number;
  errors: string[];
  total: number;
}

type Status = "idle" | "loading" | "success" | "error";

const ACCEPTED = ".xlsx,.xls,.csv";
const MAX_SIZE_MB = 10;

export default function ImportExcelClient() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const processFile = useCallback(async (file: File) => {
    // Client-side validation
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext ?? "")) {
      setErrorMsg("Formato no soportado. Usá .xlsx, .xls o .csv");
      setStatus("error");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`El archivo supera los ${MAX_SIZE_MB}MB permitidos.`);
      setStatus("error");
      return;
    }

    setFileName(file.name);
    setStatus("loading");
    setResult(null);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/products/import-excel", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Error al procesar el archivo.");
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("success");
    } catch {
      setErrorMsg("Error de conexión. Verificá tu internet e intentá de nuevo.");
      setStatus("error");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  // ── Idle / Drop zone ────────────────────────────────────────────────────────
  if (status === "idle") {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 cursor-pointer ${
          dragging
            ? "border-yellow-500/60 bg-yellow-500/5 scale-[1.01]"
            : "border-zinc-700 hover:border-zinc-500 bg-white/[0.02] hover:bg-white/[0.04]"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
          dragging ? "bg-yellow-500/20" : "bg-zinc-800"
        }`}>
          <FileSpreadsheet
            size={32}
            className={`transition-colors ${dragging ? "text-yellow-500" : "text-zinc-500"}`}
            strokeWidth={1.5}
          />
        </div>

        <div>
          <p className="text-white font-bold text-base mb-1">
            {dragging ? "Soltá el archivo acá" : "Arrastrá tu Excel o CSV acá"}
          </p>
          <p className="text-zinc-500 text-sm">o hacé click para seleccionar</p>
          <p className="text-zinc-700 text-xs mt-2 font-mono">.xlsx · .xls · .csv · Máx. {MAX_SIZE_MB}MB</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Upload size={14} strokeWidth={3} />
            Seleccionar archivo
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-12 text-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
          <div className="absolute inset-0 rounded-full border-2 border-t-yellow-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileSpreadsheet size={20} className="text-zinc-500" strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <p className="text-white font-bold text-base mb-1">Procesando archivo...</p>
          <p className="text-zinc-500 text-sm font-mono truncate max-w-xs">{fileName}</p>
          <p className="text-zinc-700 text-xs mt-2">Esto puede tardar unos segundos según el tamaño</p>
        </div>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
        <div className="flex items-start gap-3">
          <AlertCircle size={22} className="text-red-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <p className="text-red-300 font-bold text-base mb-1">Error al procesar el archivo</p>
            <p className="text-red-400/70 text-sm">{errorMsg}</p>
          </div>
        </div>
        <button
          onClick={reset}
          className="self-start flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw size={13} strokeWidth={3} />
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // ── Success ─────────────────────────────────────────────────────────────────
  if (status === "success" && result) {
    return (
      <div className="flex flex-col gap-5">

        {/* Main result card */}
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
          <div className="flex items-center gap-3 mb-5">
            <CheckCircle2 size={22} className="text-green-400" strokeWidth={2} />
            <p className="text-green-300 font-black text-base uppercase tracking-wide">
              Importación completada
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total filas", value: result.total, color: "text-zinc-300" },
              { label: "Precios actualizados", value: result.updated, color: "text-blue-400" },
              { label: "Productos creados", value: result.created, color: "text-green-400" },
              { label: "Filas omitidas", value: result.skipped, color: "text-zinc-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-black/30 rounded-xl p-4 text-center">
                <p className={`text-3xl font-black ${color}`}>{value}</p>
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold mt-1">{label}</p>
              </div>
            ))}
          </div>

          {result.created > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="text-zinc-500 text-xs leading-relaxed">
                <span className="text-yellow-500 font-bold">{result.created} producto{result.created !== 1 ? "s" : ""} nuevo{result.created !== 1 ? "s" : ""}</span> creado{result.created !== 1 ? "s" : ""} como borrador (inactivo).
                Entrá a <strong className="text-zinc-300">Productos</strong> y completá la imagen, descripción y categoría de cada uno para activarlos.
              </p>
            </div>
          )}
        </div>

        {/* Errors / warnings */}
        {result.errors.length > 0 && (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={15} className="text-yellow-500" strokeWidth={2} />
              <p className="text-yellow-400 text-xs font-black uppercase tracking-widest">
                {result.errors.length} advertencia{result.errors.length !== 1 ? "s" : ""}
              </p>
            </div>
            <ul className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
              {result.errors.map((err, i) => (
                <li key={i} className="text-zinc-500 text-xs font-mono">
                  {err}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl transition-all cursor-pointer"
          >
            <Upload size={13} strokeWidth={3} />
            Importar otro archivo
          </button>
          <a
            href="/admin/productos"
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl transition-all"
          >
            Ver Productos →
          </a>
        </div>
      </div>
    );
  }

  return null;
}
