// components/LoginForm.tsx

'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/hooks/useAuth";

export default function LoginForm({ mode }: { mode: 'login' | 'registro' }) {
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState(""); 
  const [gremio, setGremio] = useState(""); 
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(""); 

    if (mode === "login") {
      // Lógica de Login
      const { data, error } = await loginUser(telefono);

      if (error || !data) {
        setMensaje("Usuario no encontrado ❌");
      } else {
        localStorage.setItem("userTelefono", telefono);
        localStorage.setItem("userNick", data.nick);
        router.push("/pedidos");
      }

    } else {
      // Lógica de Registro con 3 campos
      const { data, error } = await registerUser(telefono, nombre, gremio);
      if (error) {
         setMensaje(`Error al registrar ❌: ${error.message}`);
         console.error("Error de registro:", error);
      } else {
        localStorage.setItem("userTelefono", telefono);
        localStorage.setItem("userNick", nombre);
        router.push("/pedidos");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      
      {mensaje && (
        <p className="p-2 text-center text-sm bg-red-800 rounded">{mensaje}</p>
      )}

      {/* Teléfono */}
      <input
        className="p-2 border rounded w-full bg-white text-black" 
        placeholder="Teléfono del jugador"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      {/* Campos adicionales para el REGISTRO (Solo si mode="registro") */}
      {mode === "registro" && (
        <>
          <input
            className="p-2 border rounded w-full bg-white text-black"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            className="p-2 border rounded w-full bg-white text-black"
            placeholder="Gremio"
            value={gremio}
            onChange={(e) => setGremio(e.target.value)}
          />
        </>
      )}

      <button className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition">
        {mode === "login" ? "Iniciar Sesión" : "Registrarse"}
      </button>
      
    </form>
  );
}
