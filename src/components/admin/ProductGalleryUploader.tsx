"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, AlertCircle } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing-client";

interface Props {
  existingImages?: string[];
  onChange: (urls: string[]) => void;
}

export default function ProductGalleryUploader({ existingImages = [], onChange }: Props) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { startUpload } = useUploadThing("productGallery", {
    onClientUploadComplete: (res) => {
      const urls = res.map((f) => f.ufsUrl);
      const next = [...images, ...urls];
      setImages(next);
      onChange(next);
      setUploading(false);
    },
    onUploadError: (err) => {
      setError(err.message);
      setUploading(false);
    },
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    // Upload one at a time to avoid size-mismatch issues with UploadThing
    for (const file of Array.from(files)) {
      await startUpload([file]);
    }
  };

  const remove = (url: string) => {
    const next = images.filter((u) => u !== url);
    setImages(next);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
        Fotos Adicionales{" "}
        <span className="text-zinc-700 normal-case tracking-normal font-normal">
          (hasta 10 · se muestran en el carrusel junto a la imagen portada)
        </span>
      </label>

      {/* Thumbnails grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((url, i) => (
            <div key={url} className="relative group aspect-square rounded-lg overflow-hidden bg-[#111] border border-zinc-800">
              <Image src={url} alt={`Imagen ${i + 1}`} fill className="object-cover" unoptimized />

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => remove(url)}
                  title="Eliminar"
                  className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors"
                >
                  <X size={11} className="text-white" strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {images.length < 10 && (
        <label className={`relative flex flex-col items-center justify-center gap-2 h-24 bg-[#111] border-2 border-dashed rounded-xl cursor-pointer transition-all group ${
          uploading
            ? "border-yellow-500/40 cursor-not-allowed"
            : "border-zinc-700 hover:border-yellow-500/50 hover:bg-zinc-900/50"
        }`}>
          {uploading ? (
            <>
              <span className="w-5 h-5 border-2 border-zinc-600 border-t-yellow-500 rounded-full animate-spin" />
              <p className="text-zinc-500 text-xs font-semibold">Subiendo...</p>
            </>
          ) : (
            <>
              <Upload size={20} className="text-zinc-600 group-hover:text-yellow-500/70 transition-colors" />
              <div className="text-center">
                <p className="text-zinc-500 text-xs font-semibold">Agregar fotos</p>
                <p className="text-zinc-700 text-[10px]">PNG, JPG, WEBP · Máx. 16MB c/u · {10 - images.length} restantes</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </>
          )}
        </label>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs font-medium">
          <AlertCircle size={13} />
          {error}
        </div>
      )}
    </div>
  );
}
