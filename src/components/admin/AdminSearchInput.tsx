"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export default function AdminSearchInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative flex-1">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0d0d0d] border border-zinc-800 text-white text-sm pl-9 pr-8 py-[9px] rounded-lg focus:outline-none focus:border-yellow-500/50 placeholder-zinc-700 transition-colors"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
