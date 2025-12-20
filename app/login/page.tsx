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
    <main className="min-h-screen flex items-center justify-center bg-login bg-cover px-4">
      {/* Agregamos text-white aquí para que todo el texto sea legible */}
      <div className="bg-black/80 p-8 rounded-xl w-full max-w-md text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
  
        {mensaje && <p className="mb-4 text-center text-red-400">{mensaje}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo electrónico"
            className="w-full p-2 rounded bg-white text-black"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Contraseña"
            className="w-full p-2 rounded bg-white text-black"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />

          <button 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded font-bold text-white transition duration-200"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        {/* Enlace para ir a registro, centrado y con color */}
        <p className="text-center mt-4">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-blue-400 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}