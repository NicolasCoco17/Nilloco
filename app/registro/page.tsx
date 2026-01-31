'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, User, Shield, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Turnstile } from "react-turnstile"; // <--- Importamos Turnstile

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nick: "",
    gremio: "",
  });

  const [mensaje, setMensaje] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estado para el token del captcha
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    // Validar Captcha
    if (!captchaToken) {
      setMensaje({ type: 'error', text: "Debes completar el captcha para continuar." });
      setLoading(false);
      return;
    }

    // 1. Validaciones básicas
    if (form.password !== form.confirmPassword) {
      setMensaje({ type: 'error', text: "Las contraseñas no coinciden" });
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setMensaje({ type: 'error', text: "La contraseña debe tener al menos 6 caracteres" });
      setLoading(false);
      return;
    }

    // 2. Registro en Supabase Auth con Captcha
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        captchaToken: captchaToken, // <--- Enviamos el token
        data: {
          nick: form.nick,
          gremio: form.gremio,
        },
      },
    });

    if (error) {
      setMensaje({ type: 'error', text: error.message });
      setLoading(false);
      return;
    }

    // 3. Éxito
    setMensaje({ type: 'success', text: "¡Registro exitoso! Revisa tu email para confirmar." });
    
    // Opcional: Redirigir después de unos segundos
    setTimeout(() => router.push("/login"), 3000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-login bg-cover bg-center px-4 relative">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 bg-[#121212] border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-white">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Crear Cuenta
          </h1>
          <p className="text-gray-400 text-sm mt-2">Únete a la comunidad de Nilloco Online</p>
        </div>

        {mensaje && (
          <div className={`p-3 mb-6 rounded-lg flex items-center gap-2 text-sm ${
            mensaje.type === 'success' 
              ? "bg-green-500/10 text-green-400 border border-green-500/20" 
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {mensaje.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {mensaje.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                required
                className="w-full bg-[#0a0a0a] border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* Nick & Gremio */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider ml-1">Nick</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Tu Nick"
                  required
                  className="w-full bg-[#0a0a0a] border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                  onChange={(e) => setForm({ ...form, nick: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider ml-1">Gremio</label>
              <div className="relative group">
                <Shield className="absolute left-3 top-3 text-gray-500 group-focus-within:text-green-400 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Nombre"
                  required
                  className="w-full bg-[#0a0a0a] border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-gray-600"
                  onChange={(e) => setForm({ ...form, gremio: e.target.value })}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-800 my-4" />

          {/* Contraseñas */}
          <div className="space-y-4">
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="password"
                placeholder="Contraseña"
                required
                className="w-full bg-[#0a0a0a] border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                required
                className="w-full bg-[#0a0a0a] border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {/* --- CAPTCHA CLOUDFLARE --- */}
          <div className="flex justify-center py-2">
            <Turnstile
              // Usamos la variable de entorno aquí 👇
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
              onVerify={(token) => setCaptchaToken(token)}
              theme="dark"
            />
          </div>

          <button
            disabled={loading || !captchaToken} // Bloquear si no hay captcha
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={20} /> Registrando...
                </>
            ) : (
                "Registrarse"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}