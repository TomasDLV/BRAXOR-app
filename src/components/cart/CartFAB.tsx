"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartFAB() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      aria-label={`Carrito (${totalItems} productos)`}
      className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center bg-[#1a1a1a] border border-white/10 hover:border-yellow-500/50 hover:bg-[#222] shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_30px_rgba(234,179,8,0.2)] hover:scale-110 transition-all duration-300 cursor-pointer group"
    >
      <ShoppingCart size={22} className="text-zinc-400 group-hover:text-yellow-500 transition-colors" strokeWidth={2} />

      {/* Badge */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-yellow-500 text-black text-[10px] font-black rounded-full flex items-center justify-center px-1 leading-none shadow-[0_0_10px_rgba(234,179,8,0.5)]"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
