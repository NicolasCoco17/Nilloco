'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Turnstile } from "react-turnstile"; // <--- Importamos Turnstile

console.log("DEBUG CLAVE:", process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estado para el token del captcha
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    // 1. Validar Captcha antes de enviar nada
    if (!captchaToken) {
      setMensaje("Por favor completa el captcha antibots 🤖");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: captchaToken // <--- Enviamos el token a Supabase
      }
    });

    if (error) {
      setMensaje("Email o contraseña incorrectos ❌");
      setLoading(false);
      // Opcional: Puedes resetear el captcha aquí si quieres forzar a hacerlo de nuevo
      return;
    }

    router.push("/pedidos");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-login bg-cover px-4">
      <div className="bg-black/80 p-8 rounded-xl w-full max-w-md text-white border border-gray-800">
        <h1 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
          Iniciar Sesión
        </h1>
  
        {mensaje && (
          <p className="mb-4 text-center text-sm bg-red-900/30 border border-red-500/50 p-2 rounded text-red-200">
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo electrónico"
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white focus:border-cyan-500 focus:outline-none transition"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Contraseña"
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white focus:border-cyan-500 focus:outline-none transition"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />

          {/* --- CAPTCHA CLOUDFLARE --- */}
          <div className="flex justify-center py-2">
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
              <Turnstile
                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onVerify={(token) => setCaptchaToken(token)}
                theme="dark"
              />
            ) : (
              <div className="text-red-500 text-xs border border-red-500 p-2">
                ⚠️ Error: La SiteKey no se ha cargado. Revisa las variables en Vercel y haz Redeploy.
              </div>
            )}
          </div>
          
          <button 
            disabled={loading || !captchaToken} // Deshabilitado si carga o no hay captcha
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded font-bold text-white transition duration-200"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-cyan-400 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}