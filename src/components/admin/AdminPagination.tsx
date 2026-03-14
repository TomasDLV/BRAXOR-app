"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminPagination({
  total,
  perPage,
}: {
  total: number;
  perPage: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  // Build page range around currentPage
  const delta = 2;
  const rangeStart = Math.max(1, currentPage - delta);
  const rangeEnd = Math.min(totalPages, currentPage + delta);
  const pages = Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);

  const btnBase =
    "flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer";

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
      <p className="text-zinc-600 text-xs font-mono">
        Página <span className="text-zinc-400">{currentPage}</span> de{" "}
        <span className="text-zinc-400">{totalPages}</span> &mdash;{" "}
        <span className="text-zinc-400">{total}</span> registros
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} />
        </button>

        {/* First page */}
        {rangeStart > 1 && (
          <>
            <button onClick={() => goTo(1)} className={`${btnBase} text-zinc-500 hover:text-white hover:bg-zinc-800`}>
              1
            </button>
            {rangeStart > 2 && (
              <span className="text-zinc-700 px-1 text-xs font-mono">…</span>
            )}
          </>
        )}

        {/* Page range */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`${btnBase} ${
              p === currentPage
                ? "bg-yellow-500 text-black"
                : "text-zinc-500 hover:text-white hover:bg-zinc-800"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Last page */}
        {rangeEnd < totalPages && (
          <>
            {rangeEnd < totalPages - 1 && (
              <span className="text-zinc-700 px-1 text-xs font-mono">…</span>
            )}
            <button
              onClick={() => goTo(totalPages)}
              className={`${btnBase} text-zinc-500 hover:text-white hover:bg-zinc-800`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
