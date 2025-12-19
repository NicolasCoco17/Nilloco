'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [telefono, setTelefono] = useState("");
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telefono }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.error || "Error al iniciar sesión ❌");
        setLoading(false);
        return;
      }

      // ✅ LOGIN OK
      localStorage.setItem("userTelefono", telefono);
      localStorage.setItem("userNick", data.nick);

      router.push("/pedidos");

    } catch (error) {
      setMensaje("Error de conexión ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold text-center text-white">
        Iniciar Sesión
      </h1>

      {mensaje && (
        <p className="p-2 text-center text-sm bg-red-800 rounded text-white">
          {mensaje}
        </p>
      )}

      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="w-full p-2 rounded bg-white text-black"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 rounded text-white font-bold transition
          ${loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
