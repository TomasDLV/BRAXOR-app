import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { Zap } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = Boolean(params.error);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Carbon fiber texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #fff 0px, #fff 1px,
            transparent 1px, transparent 8px
          ), repeating-linear-gradient(
            -45deg,
            #fff 0px, #fff 1px,
            transparent 1px, transparent 8px
          )`,
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <Zap size={22} className="text-black" strokeWidth={3} />
          </div>
          <div className="text-center">
            <h1 className="text-white font-black uppercase tracking-widest text-2xl leading-none">
              Bräxor
            </h1>
            <p className="text-zinc-600 text-xs uppercase tracking-widest mt-1">
              Panel de Administración
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
          {hasError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium px-4 py-3 rounded-lg mb-6">
              Credenciales incorrectas. Intentá de nuevo.
            </div>
          )}

          <form
            action={async (formData: FormData) => {
              "use server";
              try {
                await signIn("credentials", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  redirectTo: "/admin",
                });
              } catch (err) {
                if (err instanceof AuthError) {
                  redirect("/login?error=1");
                }
                throw err;
              }
            }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="admin@braxor.com"
                className="bg-[#0a0a0a] border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-zinc-400 text-xs uppercase tracking-widest font-bold">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="bg-[#0a0a0a] border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/70 placeholder-zinc-700 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest text-sm px-6 py-3 rounded-lg transition-colors mt-1 cursor-pointer"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
