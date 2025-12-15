// app/page.tsx

"use client";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";


export default function LoginPage() {
  // Estado para manejar el modo actual: 'login' o 'registro'
  const [mode, setMode] = useState<'login' | 'registro'>('login');
  
  const isLogin = mode === 'login';
  const toggleMode = () => {
    setMode(isLogin ? 'registro' : 'login');
  };

  return (
    // Aplicamos los estilos visuales de fondo (bg-login y bg-cover)
    <main className="min-h-screen flex items-center justify-center bg-login bg-cover">
      <div className="bg-black/70 p-8 rounded-xl shadow-2xl max-w-sm w-full text-white">
        
        {/* Título que cambia según el modo */}
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin 
            ? "Bienvenid@ a nuestra página de Toram Online" 
            : "Crear una Cuenta"
          }
        </h1>

        {/* Pasamos el estado 'mode' actual al LoginForm */}
        <LoginForm mode={mode} />
        
        {/* Mensaje y botón para alternar el modo */}
        <p className="text-center text-sm mt-4">
          {isLogin 
            ? "¿No tienes cuenta? " 
            : "¿Ya tienes cuenta? "
          }
          
          <Link
            href={isLogin ? "/registro" : "/"}
            className="text-blue-400 hover:text-blue-300 font-semibold underline"
          >
           {isLogin ? "Regístrate" : "Iniciar Sesión"}
          </Link>

        </p>

      </div>
    </main>
  );
}
