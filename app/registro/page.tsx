//app/registro/page.tsx

'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nick: "",
    gremio: "",
    telefono: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nick: form.nick,
          gremio: form.gremio,
          telefono: form.telefono,
        },
      },
    });

    if (error) {
      setMensaje(error.message + " ❌");
      setLoading(false);
      return;
    }

    setMensaje("¡Registro exitoso! Revisá tu email ✅");
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-login bg-cover px-4">
      <div className="bg-black/80 p-8 rounded-xl shadow-2xl max-w-md w-full text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Registro</h1>

        {mensaje && (
          <p className={`p-3 mb-4 text-center rounded text-sm ${
            mensaje.includes("✅") ? "bg-green-700" : "bg-red-800"
          }`}>
            {mensaje}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            className="w-full p-2 rounded bg-white text-black"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Contraseña"
            required
            className="w-full p-2 rounded bg-white text-black"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <hr className="border-gray-600" />

          <input
            type="text"
            placeholder="Nick"
            required
            className="w-full p-2 rounded bg-white text-black"
            onChange={(e) => setForm({ ...form, nick: e.target.value })}
          />

          <input
            type="text"
            placeholder="Gremio"
            required
            className="w-full p-2 rounded bg-white text-black"
            onChange={(e) => setForm({ ...form, gremio: e.target.value })}
          />

          <input
            type="text"
            placeholder="Teléfono"
            className="w-full p-2 rounded bg-white text-black"
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded font-bold"
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
