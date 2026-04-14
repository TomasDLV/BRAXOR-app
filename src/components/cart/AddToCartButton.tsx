"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";

interface Props {
  product: Omit<CartItem, "quantity">;
  variant?: "full" | "icon";
}

export default function AddToCartButton({ product, variant = "full" }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (variant === "icon") {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(); }}
        aria-label="Agregar al carrito"
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer flex-shrink-0 ${
          added
            ? "bg-green-500 border border-green-500 text-white"
            : "bg-white/5 border border-white/10 hover:border-yellow-500/60 hover:bg-yellow-500/10 text-zinc-400 hover:text-yellow-500"
        }`}
      >
        {added ? <Check size={15} strokeWidth={3} /> : <ShoppingCart size={15} strokeWidth={2} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm px-6 py-4 rounded-xl transition-all duration-300 cursor-pointer ${
        added
          ? "bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.3)]"
          : "bg-white/[0.06] border border-white/10 hover:border-yellow-500/50 hover:bg-yellow-500/10 text-white hover:text-yellow-400"
      }`}
    >
      {added ? (
        <>
          <Check size={18} strokeWidth={3} />
          Agregado al carrito
        </>
      ) : (
        <>
          <ShoppingCart size={18} strokeWidth={2} />
          Agregar al carrito
        </>
      )}
    </button>
  );
}
