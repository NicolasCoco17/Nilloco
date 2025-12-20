'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  // 1. Agregamos email y password al estado inicial
  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    nick: "", 
    gremio: "", 
    telefono: "" 
  });
  
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // Envía los 5 campos
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al registrar");

      setMensaje("¡Registro exitoso! Revisa tu email ✅");
      
      // Guardamos el Nick para uso inmediato en la web
      localStorage.setItem("userNick", form.nick);

      // Redirigimos al login para que entre con sus nuevas credenciales
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setMensaje(err.message + " ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-login bg-cover px-4">
      <div className="bg-black/80 p-8 rounded-xl shadow-2xl max-w-md w-full text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Registro</h1>
        
        {mensaje && (
          <p className={`p-3 mb-4 text-center rounded text-sm ${mensaje.includes('✅') ? 'bg-green-700' : 'bg-red-800'}`}>
            {mensaje}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Campos de Autenticación */}
          <input
            type="email"
            placeholder="Correo electrónico (Para recuperar cuenta)"
            required
            className="w-full p-2 rounded bg-white text-black outline-none"
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            className="w-full p-2 rounded bg-white text-black outline-none"
            onChange={(e) => setForm({...form, password: e.target.value})}
          />

          <hr className="border-gray-600 my-2" />

          {/* Campos de Perfil */}
          <input
            type="text"
            placeholder="Nick en el juego"
            required
            className="w-full p-2 rounded bg-white text-black outline-none"
            onChange={(e) => setForm({...form, nick: e.target.value})}
          />
          <input
            type="text"
            placeholder="Gremio"
            required
            className="w-full p-2 rounded bg-white text-black outline-none"
            onChange={(e) => setForm({...form, gremio: e.target.value})}
          />
          <input
            type="text"
            placeholder="Teléfono (Referencia)"
            className="w-full p-2 rounded bg-white text-black outline-none"
            onChange={(e) => setForm({...form, telefono: e.target.value})}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded font-bold transition"
          >
            {loading ? "Creando usuario..." : "Finalizar Registro"}
          </button>
        </form>

        <Link href="/login" className="text-blue-400 underline block text-center mt-4 text-sm">
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </div>
    </main>
  );
}