"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ShoppingCart, ArrowRight, ImageOff } from "lucide-react";
import { useCart } from "@/context/CartContext";

const WA_NUMBER = "5493816390854";

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

interface CustomerData {
  name: string;
  phone: string;
  city: string;
  notes: string;
}

type Step = "cart" | "checkout";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, totalItems } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [customer, setCustomer] = useState<CustomerData>({ name: "", phone: "", city: "", notes: "" });

  // Reset to cart step when closed
  useEffect(() => {
    if (!isOpen) setTimeout(() => setStep("cart"), 400);
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function buildWhatsAppMessage(): string {
    const lines: string[] = [];
    lines.push("*PEDIDO - Braxor Off-Road*");
    lines.push("--------------------------------");
    lines.push("");
    lines.push("*Cliente:*");
    lines.push(`Nombre: ${customer.name}`);
    lines.push(`Telefono: ${customer.phone}`);
    if (customer.city) lines.push(`Localidad: ${customer.city}`);
    lines.push("");
    lines.push("*Productos:*");
    lines.push("");

    items.forEach((item, i) => {
      lines.push(`${i + 1}. *${item.name}*`);
      lines.push(`   Marca: ${item.brand} | Cat: ${item.category}`);
      if (item.showPrice && item.price) {
        lines.push(`   Precio: ${formatARS(item.price)} c/u`);
      } else {
        lines.push(`   Precio: A consultar`);
      }
      lines.push(`   Cantidad: ${item.quantity}`);
      if (item.sku) lines.push(`   SKU: ${item.sku}`);
      lines.push("");
    });

    if (customer.notes.trim()) {
      lines.push(`*Notas:* ${customer.notes}`);
      lines.push("");
    }

    lines.push("--------------------------------");
    lines.push("_Enviado desde braxor.com_");
    return lines.join("\n");
  }

  function handleSendWhatsApp() {
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    clearCart();
    closeCart();
  }

  const pricedTotal = items
    .filter((i) => i.showPrice && i.price)
    .reduce((sum, i) => sum + (i.price! * i.quantity), 0);

  const hasPrices = items.some((i) => i.showPrice && i.price);
  const canCheckout = customer.name.trim() && customer.phone.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0f0f0f] border-l border-white/[0.08] z-[61] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] flex-shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="text-yellow-500" strokeWidth={2} />
                <span className="text-white font-black uppercase tracking-wider text-sm">
                  {step === "cart" ? "Carrito" : "Finalizar pedido"}
                </span>
                {step === "cart" && totalItems > 0 && (
                  <span className="bg-yellow-500 text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {step === "checkout" && (
                  <button
                    onClick={() => setStep("cart")}
                    className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    ← Volver
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === "cart" ? (
                  <motion.div
                    key="cart-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-4 py-24 px-6 text-center">
                        <ShoppingCart size={48} className="text-zinc-800" strokeWidth={1} />
                        <p className="text-zinc-500 text-sm font-medium">Tu carrito está vacío</p>
                        <p className="text-zinc-700 text-xs">Explorá el catálogo y agregá productos</p>
                        <button
                          onClick={closeCart}
                          className="text-yellow-500 hover:text-yellow-400 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          Ver catálogo →
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col divide-y divide-white/[0.06]">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-4 p-5">
                            {/* Image */}
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06] flex-shrink-0 relative">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <ImageOff size={20} className="text-zinc-700" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                              <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest truncate">
                                {item.brand} · {item.category}
                              </p>
                              <p className="text-white text-sm font-bold leading-tight line-clamp-2">
                                {item.name}
                              </p>
                              <p className="text-yellow-500 text-sm font-black">
                                {item.showPrice && item.price
                                  ? formatARS(item.price)
                                  : "Consultar precio"}
                              </p>

                              {/* Qty + remove */}
                              <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                                  >
                                    <Minus size={12} strokeWidth={3} />
                                  </button>
                                  <span className="text-white text-xs font-black w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                                  >
                                    <Plus size={12} strokeWidth={3} />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="w-7 h-7 flex items-center justify-center text-zinc-700 hover:text-red-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={13} strokeWidth={2} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="checkout-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 flex flex-col gap-5"
                  >
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      Completá tus datos y te enviamos el pedido por WhatsApp. Nuestro equipo te contacta para confirmar disponibilidad y precio final.
                    </p>

                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-black mb-1.5 block">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          value={customer.name}
                          onChange={(e) => setCustomer((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Juan Pérez"
                          className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-yellow-500/60 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-700 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-black mb-1.5 block">
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          value={customer.phone}
                          onChange={(e) => setCustomer((p) => ({ ...p, phone: e.target.value }))}
                          placeholder="381 123-4567"
                          className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-yellow-500/60 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-700 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-black mb-1.5 block">
                          Localidad
                        </label>
                        <input
                          type="text"
                          value={customer.city}
                          onChange={(e) => setCustomer((p) => ({ ...p, city: e.target.value }))}
                          placeholder="Yerba Buena, Tucumán"
                          className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-yellow-500/60 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-700 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-500 text-[10px] uppercase tracking-widest font-black mb-1.5 block">
                          Notas / Vehículo
                        </label>
                        <textarea
                          value={customer.notes}
                          onChange={(e) => setCustomer((p) => ({ ...p, notes: e.target.value }))}
                          placeholder="Ej: Toyota Hilux 2022, consulto por instalación..."
                          rows={3}
                          className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-yellow-500/60 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-700 outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>

                    {/* Order summary */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                      <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-black mb-3">
                        Resumen del pedido
                      </p>
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-2 mb-2">
                          <span className="text-zinc-400 text-xs line-clamp-1 flex-1">
                            {item.quantity}× {item.name}
                          </span>
                          <span className="text-zinc-300 text-xs font-bold flex-shrink-0">
                            {item.showPrice && item.price
                              ? formatARS(item.price * item.quantity)
                              : "—"}
                          </span>
                        </div>
                      ))}
                      {hasPrices && (
                        <div className="flex justify-between items-center border-t border-white/[0.06] mt-3 pt-3">
                          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                            Subtotal ref.
                          </span>
                          <span className="text-yellow-500 text-base font-black">
                            {formatARS(pricedTotal)}
                          </span>
                        </div>
                      )}
                      <p className="text-zinc-700 text-[10px] mt-2 leading-relaxed">
                        * Precios de referencia. El precio final se confirma por WhatsApp.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="flex-shrink-0 p-5 border-t border-white/[0.08] flex flex-col gap-3 bg-[#0f0f0f]">
                {step === "cart" && hasPrices && (
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                      Subtotal ref.
                    </span>
                    <span className="text-white text-lg font-black">
                      {formatARS(pricedTotal)}
                    </span>
                  </div>
                )}

                {step === "cart" ? (
                  <button
                    onClick={() => setStep("checkout")}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-sm px-6 py-4 rounded-xl transition-all cursor-pointer shadow-[0_0_30px_rgba(234,179,8,0.3)]"
                  >
                    Continuar con el pedido
                    <ArrowRight size={16} strokeWidth={3} />
                  </button>
                ) : (
                  <button
                    onClick={handleSendWhatsApp}
                    disabled={!canCheckout}
                    className={`w-full flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm px-6 py-4 rounded-xl transition-all cursor-pointer ${
                      canCheckout
                        ? "bg-[#25d366] hover:bg-[#20ba5a] text-white shadow-[0_0_30px_rgba(37,211,102,0.25)]"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Enviar pedido por WhatsApp
                  </button>
                )}

                {step === "cart" && (
                  <button
                    onClick={clearCart}
                    className="text-zinc-700 hover:text-zinc-500 text-[10px] uppercase tracking-widest font-bold transition-colors cursor-pointer text-center"
                  >
                    Vaciar carrito
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
