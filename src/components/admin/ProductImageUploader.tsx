"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing-client";

interface Props {
  onUploadComplete: (url: string) => void;
  existingUrl?: string;
}

export default function ProductImageUploader({ onUploadComplete, existingUrl }: Props) {
  const [state, setState] = useState<"idle" | "uploading" | "uploaded" | "error">(
    existingUrl ? "uploaded" : "idle"
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl ?? null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("productImage", {
    onClientUploadComplete: (res) => {
      const url = res[0]?.ufsUrl;
      if (url) {
        setPreviewUrl(url);
        setState("uploaded");
        onUploadComplete(url);
      }
    },
    onUploadError: (err) => {
      setErrorMsg(err.message);
      setState("error");
    },
  });

  const handleFileChange = async (file: File) => {
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setState("uploading");
    await startUpload([file]);
  };

  const handleReset = () => {
    setState("idle");
    setPreviewUrl(null);
    setErrorMsg("");
    onUploadComplete("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
        Imagen del Producto{" "}
        <span className="text-zinc-700 normal-case tracking-normal font-normal">(opcional)</span>
      </label>

      {state === "idle" && (
        <label className="relative flex flex-col items-center justify-center gap-3 h-36 bg-[#111] border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-yellow-500/50 hover:bg-zinc-900/50 transition-all group">
          <Upload size={24} className="text-zinc-600 group-hover:text-yellow-500/70 transition-colors" />
          <div className="text-center">
            <p className="text-zinc-500 text-xs font-semibold">Hacé click o arrastrá una imagen</p>
            <p className="text-zinc-700 text-[10px] mt-0.5">PNG, JPG, WEBP · Máx. 16MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file);
            }}
          />
        </label>
      )}

      {state === "uploading" && (
        <div className="flex flex-col items-center justify-center gap-3 h-36 bg-[#111] border border-zinc-800 rounded-xl">
          {previewUrl && (
            <div className="relative w-20 h-20 opacity-50">
              <Image src={previewUrl} alt="preview" fill className="object-cover rounded-lg" unoptimized />
            </div>
          )}
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
            <span className="w-4 h-4 border-2 border-zinc-600 border-t-yellow-500 rounded-full animate-spin" />
            Subiendo imagen...
          </div>
        </div>
      )}

      {state === "uploaded" && previewUrl && (
        <div className="relative h-36 bg-[#111] border border-zinc-800 rounded-xl overflow-hidden group">
          <Image src={previewUrl} alt="Imagen del producto" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-400 drop-shadow-lg" />
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="absolute top-2 right-2 w-6 h-6 bg-black/70 hover:bg-red-500/80 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center justify-center gap-2 h-36 bg-red-500/5 border border-red-500/30 rounded-xl">
          <AlertCircle size={24} className="text-red-400" />
          <p className="text-red-400 text-xs font-medium">{errorMsg || "Error al subir la imagen"}</p>
          <button
            type="button"
            onClick={handleReset}
            className="text-zinc-500 hover:text-zinc-300 text-[10px] uppercase tracking-widest font-bold transition-colors cursor-pointer"
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
