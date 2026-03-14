"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirmar",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  const isDanger = variant === "danger";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="pointer-events-auto w-full max-w-sm bg-[#111] border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

              {/* Franja superior de color */}
              <div
                className={`h-0.5 w-full ${isDanger ? "bg-red-500" : "bg-yellow-500"}`}
              />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${
                      isDanger
                        ? "bg-red-500/10 border border-red-500/20"
                        : "bg-yellow-500/10 border border-yellow-500/20"
                    }`}
                  >
                    {isDanger ? (
                      <ShieldAlert
                        size={18}
                        strokeWidth={2}
                        className="text-red-400"
                      />
                    ) : (
                      <AlertTriangle
                        size={18}
                        strokeWidth={2}
                        className="text-yellow-400"
                      />
                    )}
                  </div>

                  <button
                    onClick={onCancel}
                    className="text-zinc-600 hover:text-zinc-400 transition-colors mt-0.5 cursor-pointer"
                    aria-label="Cerrar"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                </div>

                {/* Texto */}
                <div className="mb-6">
                  <h2
                    id="modal-title"
                    className="text-white font-black uppercase tracking-tight text-lg mb-1.5"
                  >
                    {title}
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Separador */}
                <div className="border-t border-zinc-800 mb-5" />

                {/* Acciones */}
                <div className="flex gap-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-colors cursor-pointer ${
                      isDanger
                        ? "bg-red-500 hover:bg-red-400 text-white"
                        : "bg-yellow-500 hover:bg-yellow-400 text-black"
                    }`}
                  >
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
