"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-all cursor-pointer"
    >
      <LogOut size={16} strokeWidth={2} />
      Cerrar Sesión
    </button>
  );
}
