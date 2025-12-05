"use client";

import { useState, useEffect, Suspense } from "react";
// Importa la configuración de Supabase. ¡Asegúrate de que esté en "@/lib/supabase"!
import { supabase } from "@/lib/supabase"; 
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, UserPlus } from 'lucide-react'; // Iconos para un look limpio

// Definición de tipos para el formulario
type LoginForm = {
  telefono: string;
  nick?: string;
};

// Componente con la lógica principal
function LoginContent() {
  const [form, setForm] = useState<LoginForm>({ telefono: "", nick: "" });
  const [mode, setMode] = useState<'login' | 'registro'>('login');
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer el modo (login/registro) desde la URL al cargar
  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'registro') {
      setMode('registro');
    } else {
      setMode('login'); 
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(""); 

    const telefonoTrim = form.telefono.trim();
    if (!telefonoTrim) {
      setMensaje("Ingresa un teléfono válido ❌");
      setLoading(false);
      return;
    }

    if (mode === 'registro' && (!form.nick || form.nick.trim() === "")) {
      setMensaje("Para el registro, ingresa tu Nick ❌");
      setLoading(false);
      return;
    }

    try {
      // Lógica de Supabase: Búsqueda, Registro e Ingreso (mantenida igual)
      // ------------------------------------------------------------------
      const { data: usuarioExistente, error: errorSelect } = await supabase
        .from("users")
        .select("*")
        .eq("telefono", telefonoTrim)
        .single();

      if (errorSelect && errorSelect.code !== "PGRST116") {
        console.error(errorSelect);
        setMensaje("Error al consultar el usuario ❌");
        setLoading(false);
        return;
      }
      
      let userNickValue: string = ''; 
      let isRegistrationSuccess = false;

      if (!usuarioExistente) {
        if (mode === 'registro') {
          const { data: nuevoUsuario, error: errorInsert } = await supabase
            .from("users")
            .insert([{ telefono: telefonoTrim, nick: form.nick!.trim() }])
            .select()
            .single();

          if (errorInsert) {
            console.error(errorInsert);
            setMensaje("Error al crear usuario. Verifica que el Nick no esté en uso. ❌");
            setLoading(false);
            return;
          }
          userNickValue = nuevoUsuario.nick as string; 
          isRegistrationSuccess = true;
          
        } else {
          setMensaje("Teléfono no registrado. Usa la opción REGISTRO. ❌");
          setLoading(false);
          return;
        }

      } else {
        if (mode === 'registro') {
          setMensaje("Este teléfono ya está registrado. Usa la opción LOGIN. ❌");
          setLoading(false);
          return;
        }
        
        userNickValue = usuarioExistente.nick as string;
      }

      if(isRegistrationSuccess) {
          setMensaje("Registro exitoso! Redirigiendo a pedidos... ✅");
          await new Promise(resolve => setTimeout(resolve, 1500)); 
      }
      
      // Chequeo de límites mensuales
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);
      const finMes = new Date(inicioMes);
      finMes.setMonth(finMes.getMonth() + 1);

      const { data: pedidosMensuales, error: errorPedidos } = await supabase
        .from("stateos")
        .select("*")
        .eq("Telefono", telefonoTrim)
        .eq("Tipo", "Mensual")
        .gte("Fecha", inicioMes.toISOString())
        .lt("Fecha", finMes.toISOString());

      if (errorPedidos) {
        console.error(errorPedidos);
        setMensaje("Error al consultar pedidos mensuales ❌");
        setLoading(false);
        return;
      }

      const puedeHacerMensual = (pedidosMensuales?.length || 0) < 2;

      // Guardar en localStorage y redirigir
      localStorage.setItem("userTelefono", telefonoTrim);
      localStorage.setItem("userNick", userNickValue); 
      localStorage.setItem("puedeHacerMensual", String(puedeHacerMensual));
      
      router.push("/pedidos");
      // ------------------------------------------------------------------

    } catch (err) {
      console.error(err);
      setMensaje("Error inesperado ❌");
    }

    setLoading(false);
  };

  return (
    // Contenedor principal con la imagen de fondo
    <main className="min-h-screen flex items-center justify-center p-4 
                    bg-[url('/fondo.png')] bg-cover bg-center">
      {/* Tarjeta blanca semitransparente con esquinas redondeadas */}
      <div className="bg-white/95 text-gray-900 p-8 rounded-xl shadow-2xl max-w-sm w-full backdrop-blur-sm">
        
        {/* Encabezado limpio con icono */}
        <div className="flex items-center justify-center mb-6">
            {mode === 'login' ? (
                <LogIn className="h-7 w-7 text-blue-600 mr-3" />
            ) : (
                <UserPlus className="h-7 w-7 text-green-600 mr-3" />
            )}
            <h1 className="text-2xl font-extrabold">
                {mode === 'login' ? 'Bienvenid@ a nuestra pagina de Toram Online' : 'Crear Cuenta'}
            </h1>
        </div>

        {mensaje && (
          <div className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${mensaje.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensaje}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="relative">
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono del jugador"
              className="w-full p-3 border border-black-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              required
            />
          </div>

          {mode === 'registro' && (
            <div className="relative">
                <input
                type="text"
                name="nick"
                value={form.nick ?? ""} 
                onChange={handleChange}
                placeholder="Nick del jugador (Requerido para Registro)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                required
                />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition duration-200 
                ${loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : (mode === 'login' ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700")
                }`}
          >
            {loading ? "Procesando..." : (mode === 'login' ? 'Ingresar' : 'Registrar')}
          </button>
        </form>

        {/* Enlace para cambiar de modo con estilo moderno */}
        <div className="text-center mt-5 text-sm text-gray-600">
            {mode === 'login' ? (
                <p>¿No tienes cuenta? 
                    <button type="button" onClick={() => router.replace("/login?mode=registro")} className="text-blue-600 font-semibold hover:text-blue-800 transition duration-150 ml-1">Regístrate</button>
                </p>
            ) : (
                <p>¿Ya tienes cuenta? 
                    <button type="button" onClick={() => router.replace("/login?mode=login")} className="text-blue-600 font-semibold hover:text-blue-800 transition duration-150 ml-1">Ingresa</button>
                </p>
            )}
        </div>
      </div>
    </main>
  );
}

// Wrapper necesario para usar useSearchParams en Next.js App Router
export default function LoginPageWrapper() {
    return (
        <Suspense fallback={<p>Cargando...</p>}>
            <LoginContent />
        </Suspense>
    );
}
