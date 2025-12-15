// app/registro/page.tsx

"use client";
import LoginForm from "@/components/LoginForm";
import Link from 'next/link'; // Importamos Link para el enlace de login

export default function RegisterPage() {
  return (
    // Conservamos los estilos de fondo
    <main className="min-h-screen flex items-center justify-center bg-login bg-cover">
      <div className="bg-black/70 p-8 rounded-xl shadow-2xl max-w-sm w-full text-white">
        
        {/* Título específico de Registro */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Crear una Cuenta
        </h1>
        
        {/* Pasamos el modo "registro" fijo */}
        <LoginForm mode="registro" />
        
        {/* Enlace para volver a la página de login */}
        <p className="text-center text-sm mt-4">
          ¿Ya tienes cuenta? 
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline ml-1">
            Iniciar Sesión
          </Link>
        </p>

      </div>
    </main>
  );
}
