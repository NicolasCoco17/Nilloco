'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState(""); // Cambiado
  const [password, setPassword] = useState(""); // Nuevo
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Enviamos email y password
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "Credenciales incorrectas ❌");
        setLoading(false);
        return;
      }

      // ✅ Guardamos el token y los datos del perfil
      localStorage.setItem("token", data.token); 
      localStorage.setItem("userNick", data.nick);

      router.push("/pedidos");
    } catch (error) {
      setMensaje("Error de conexión ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-login bg-cover px-4">
      <div className="bg-black/70 p-8 rounded-xl shadow-2xl max-w-sm w-full text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        {mensaje && (
          <p className="p-2 mb-4 text-center text-sm bg-red-800 rounded text-white">
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" // Tipo email para validación básica
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-white text-black outline-none"
            required
          />

          <input
            type="password" // Tipo password para ocultar caracteres
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-white text-black outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded text-white font-bold transition ${
              loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-blue-400 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
}