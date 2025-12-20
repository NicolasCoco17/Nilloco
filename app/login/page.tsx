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
    setMensaje("");
    setLoading(true);

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
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-black/80 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        {mensaje && <p className="mb-4 text-center text-red-400">{mensaje}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button disabled={loading}>{loading ? "Ingresando..." : "Entrar"}</button>
        </form>

        <p className="text-center mt-4">
          ¿No tienes cuenta? <Link href="/registro">Regístrate</Link>
        </p>
      </div>
    </main>
  );
}
