//app/login/page.tsx

'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMensaje("Email o contraseña incorrectos ❌");
      setLoading(false);
      return;
    }

    router.push("/pedidos");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-login bg-cover px-4">
      <div className="bg-black/70 p-8 rounded-xl shadow-2xl max-w-sm w-full text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        {mensaje && (
          <p className="p-2 mb-4 text-center text-sm bg-red-800 rounded">
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-white text-black"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-white text-black"
            required
          />

          <button
            disabled={loading}
            className={`w-full p-2 rounded font-bold ${
              loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-blue-400 underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
}
