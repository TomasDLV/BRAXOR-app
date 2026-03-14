"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toggleProductActive, toggleProductPrice } from "@/actions/productActions";
import { Eye, EyeOff, DollarSign } from "lucide-react";

type Variant = "active" | "price";

interface Config {
  activeClass: string;
  inactiveClass: string;
  activeLabel: string;
  inactiveLabel: string;
  activeTitle: string;
  inactiveTitle: string;
  ActiveIcon: React.ElementType;
  InactiveIcon: React.ElementType;
}

const CONFIGS: Record<Variant, Config> = {
  active: {
    activeClass: "text-emerald-500 hover:text-zinc-500",
    inactiveClass: "text-zinc-600 hover:text-emerald-500",
    activeLabel: "Activo",
    inactiveLabel: "Inactivo",
    activeTitle: "Visible en catálogo — click para ocultar",
    inactiveTitle: "Oculto en catálogo — click para activar",
    ActiveIcon: Eye,
    InactiveIcon: EyeOff,
  },
  price: {
    activeClass: "text-yellow-500 hover:text-zinc-500",
    inactiveClass: "text-zinc-600 hover:text-yellow-500",
    activeLabel: "Precio visible",
    inactiveLabel: "Precio oculto",
    activeTitle: "Precio visible — click para ocultar",
    inactiveTitle: "Precio oculto — click para mostrar",
    ActiveIcon: DollarSign,
    InactiveIcon: DollarSign,
  },
};

function ToggleButton({ value, variant }: { value: boolean; variant: Variant }) {
  const { pending } = useFormStatus();
  const cfg = CONFIGS[variant];
  const Icon = value ? cfg.ActiveIcon : cfg.InactiveIcon;

  return (
    <button
      type="submit"
      disabled={pending}
      title={value ? cfg.activeTitle : cfg.inactiveTitle}
      className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-40 cursor-pointer ${
        value ? cfg.activeClass : cfg.inactiveClass
      }`}
    >
      {pending ? (
        <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Icon
          size={13}
          strokeWidth={2}
          className={!value && variant === "price" ? "opacity-40" : ""}
        />
      )}
      {value ? cfg.activeLabel : cfg.inactiveLabel}
    </button>
  );
}

export function ToggleActiveButton({ id, isActive }: { id: string; isActive: boolean }) {
  return (
    <form action={toggleProductActive}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="isActive" value={String(isActive)} />
      <ToggleButton value={isActive} variant="active" />
    </form>
  );
}

export function TogglePriceButton({
  id,
  showPrice,
  hasPrice,
}: {
  id: string;
  showPrice: boolean;
  hasPrice: boolean;
}) {
  const [showMsg, setShowMsg] = useState(false);

  if (!hasPrice) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowMsg(true);
            setTimeout(() => setShowMsg(false), 3500);
          }}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-700 cursor-not-allowed select-none"
        >
          <DollarSign size={13} strokeWidth={2} className="opacity-30" />
          Sin precio
        </button>
        {showMsg && (
          <div className="absolute left-0 top-full mt-1.5 z-20 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
            Precio no disponible. Editá el producto y agregá uno.
          </div>
        )}
      </div>
    );
  }

  return (
    <form action={toggleProductPrice}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="showPrice" value={String(showPrice)} />
      <ToggleButton value={showPrice} variant="price" />
    </form>
  );
}
