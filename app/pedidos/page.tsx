"use client";

import { useState, useEffect, Suspense } from "react";
// Importa la configuración de Supabase. ¡Asegúrate de que esté en "@/lib/supabase"!
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";
import { ScrollText, LogOut } from 'lucide-react'; // Iconos para un look limpio

// Definición de tipos para el formulario de pedido
type PedidoForm = {
  nombre: string; // Ahora representa el Stater Seleccionado / Item
  tipo: "Normal" | "Mensual";
  categoria: "Arma" | "Armadura";
  stats: string;
  comentarios: string;
  pot: number | string; 
};

function PedidosContent() {
  const [puedeHacerMensual, setPuedeHacerMensual] = useState(true);
  const [telefono, setTelefono] = useState("");
  const [nick, setNick] = useState("");
  
  // Lista fija de Staters disponibles para pedidos "Normales"
  const statersDisponibles = ["CocoN", "Slayer", "Warrior", "Mage", "Rogue"];

  const [form, setForm] = useState<PedidoForm>({
    nombre: "", // Se inicializa vacío para forzar la selección en Normal
    tipo: "Normal",
    categoria: "Arma", // Valor por defecto
    stats: "",
    comentarios: "",
    pot: "",
  });
  
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Cargar datos del usuario desde localStorage al iniciar
  useEffect(() => {
    const tel = localStorage.getItem("userTelefono");
    const nk = localStorage.getItem("userNick");
    const mensual = localStorage.getItem("puedeHacerMensual") === "true";

    if (!tel || !nk) {
        router.replace("/login");
        return;
    }

    setTelefono(tel);
    setNick(nk);
    setPuedeHacerMensual(mensual);

    // Si no puede hacer mensual, forzamos el tipo Normal y aseguramos que 'nombre' no sea 'CocoN' (si no estaba en el estado inicial)
    if (!mensual) {
        setForm(prev => ({ ...prev, tipo: "Normal", nombre: "" })); 
    }
  }, [router]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let finalValue: string | number = value;
    if (name === "pot" && type === "number") {
        finalValue = value === "" ? "" : Number(value);
    }
    
    if (name === "tipo" && value === "Mensual" && !puedeHacerMensual) {
        return;
    }

    // Esto maneja el cambio del <select> de 'nombre' cuando el tipo es 'Normal'
    setForm(prev => ({ ...prev, [name]: finalValue as PedidoForm[keyof PedidoForm] }));
  };
  
  // Manejador específico para los radio buttons de Categoría
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, categoria: e.target.value as "Arma" | "Armadura" }));
  };

  // Manejador para el cambio de Tipo (Normal/Mensual) con botones
  const handleTypeChange = (newType: "Normal" | "Mensual") => {
    if (newType === "Mensual" && !puedeHacerMensual) {
        return;
    }
    
    if (newType === "Mensual") {
        // Si es Mensual, fijamos el 'nombre' a "CocoN"
        setForm(prev => ({ ...prev, tipo: newType, nombre: "CocoN" }));
    } else {
        // Si es Normal, limpiamos 'nombre' para que el usuario seleccione uno del desplegable
        setForm(prev => ({ ...prev, tipo: newType, nombre: "" }));
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userTelefono");
    localStorage.removeItem("userNick");
    localStorage.removeItem("puedeHacerMensual");
    router.replace("/login");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    if (!telefono || !nick) {
        setMensaje("Error de sesión. Por favor, reintenta el login. ❌");
        setLoading(false);
        return;
    }

    // Validaciones
    // Ahora 'nombre' representa el stater, por lo que debe estar seleccionado/fijado.
    if (!form.nombre || !form.categoria || !form.stats) {
        setMensaje("Los campos Stater/Nombre, Categoría y Stats son obligatorios. ❌");
        setLoading(false);
        return;
    }
    
    if (form.tipo === 'Mensual' && form.nombre !== "CocoN") {
        // Esto previene envío si el tipo es mensual pero por alguna razón el nombre no es el fijo
        setMensaje("Error: El tipo Mensual requiere que el stater sea CocoN. ❌");
        setLoading(false);
        return;
    }

    if (form.tipo === 'Mensual' && !puedeHacerMensual) {
        setMensaje("No puedes enviar otro pedido mensual este mes. ❌");
        setLoading(false);
        return;
    }
    
    // Asegura que pot sea numérico para Supabase
    const potValue = typeof form.pot === 'string' && form.pot === '' ? 0 : Number(form.pot);

    try {
      // Lógica de Supabase: Inserción
      const { error } = await supabase.from("stateos").insert([{
        Telefono: telefono, 
        Nombre: form.nombre, // NOTA: Este campo ahora contiene el Stater Seleccionado/Fijado
        Tipo: form.tipo,
        Categoria: form.categoria,
        Stats: form.stats,
        Stater: nick, // El stater que hace el pedido (el usuario logueado)
        Comentarios: form.comentarios,
        Fecha: new Date().toISOString(),
        Pot: potValue,
      }]);

      if (error) {
        console.error("Error al insertar pedido:", error);
        setMensaje("Error al enviar el pedido a la base de datos. ❌");
        setLoading(false);
        return;
      }
      
      setMensaje("¡Pedido enviado con éxito! ✅");
      setForm({
        nombre: "", // Resetear a vacío para que se vea el placeholder del select
        tipo: puedeHacerMensual ? "Normal" : "Normal", 
        categoria: "Arma",
        stats: "",
        comentarios: "",
        pot: "",
      });

    } catch (err) {
      console.error(err);
      setMensaje("Error inesperado al procesar el pedido. ❌");
    }

    setLoading(false);
  };

  if (!telefono) {
    // Pantalla de carga (manteniendo texto blanco sobre fondo oscuro)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            Cargando sesión...
        </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 
                    bg-[url('/fondo.png')] bg-cover bg-center">
      
      {/* Tarjeta blanca limpia y centrada */}
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full">
        
        {/* ENCABEZADO: Títulos en Negro, Borde Oscuro */}
        <div className="text-center mb-6 pb-4 border-b border-gray-700">
            <h1 className="text-2xl font-extrabold text-gray-900">
                Formulario de Pedidos
            </h1>
            <p className="text-sm text-gray-700 mt-2">
                Bienvenido, {nick}.
            </p>
        </div>
        
        {/* Mensaje sobre el límite mensual (COLORES SIN MODIFICAR) */}
        <div className={`p-3 rounded-lg mb-4 text-xs font-medium text-center ${puedeHacerMensual ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
            {puedeHacerMensual ? 
                "✅ Puedes realizar pedidos Mensuales." : 
                "⚠️ Límite de 2 pedidos Mensuales alcanzado este mes. Solo puedes enviar pedidos Normales."
            }
        </div>

        {mensaje && (
          <div className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${mensaje.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Tipo de pedido (Botones en lugar de Select) */}
          <div className="space-y-2 pt-1">
            <label className="text-sm font-semibold text-gray-900 block">Tipo de Pedido</label>
            <div className="flex space-x-4">
                {/* Botón Normal */}
                <button
                    type="button"
                    onClick={() => handleTypeChange("Normal")}
                    className={`w-1/2 py-2 rounded-lg font-bold transition duration-150 border-2 text-sm
                        ${form.tipo === 'Normal' 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                            : 'bg-white text-gray-900 border-gray-400 hover:bg-gray-50'}`}
                >
                    Normal
                </button>

                {/* Botón Mensual */}
                <button
                    type="button"
                    disabled={!puedeHacerMensual}
                    onClick={() => handleTypeChange("Mensual")}
                    className={`w-1/2 py-2 rounded-lg font-bold transition duration-150 border-2 text-sm
                        ${form.tipo === 'Mensual' && puedeHacerMensual
                            ? 'bg-green-600 text-white border-green-600 shadow-md' 
                            : 'bg-white text-gray-900 border-gray-400'}
                        ${!puedeHacerMensual 
                            ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                            : 'hover:bg-gray-50'}`}
                >
                    Mensual
                </button>
            </div>
          </div>

          {/* Nombre del Stater / Item (Condicional) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 block">
              {form.tipo === 'Normal' ? 'Stater Solicitado' : 'Stater Fijo (Mensual)'}
            </label>
            
            {form.tipo === 'Normal' ? (
              // Desplegable para tipo Normal
              <select
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-900"
                  required
              >
                  <option value="" disabled>Selecciona un Stater</option>
                  {statersDisponibles.map(stater => (
                      <option key={stater} value={stater}>{stater}</option>
                  ))}
              </select>
            ) : (
              // Input fijo y deshabilitado para tipo Mensual
              <input
                  type="text"
                  name="nombre"
                  value="CocoN" // Valor fijo
                  readOnly
                  placeholder="CocoN"
                  className="w-full p-3 border border-red-700 rounded-lg text-gray-900 bg-red-50 cursor-not-allowed font-medium"
                  required
              />
            )}
          </div>

          {/* Categoría (Radio Buttons) */}
          <div className="space-y-2 pt-1 text-gray-900">
            {/* Etiqueta de Categoría en Negro */}
            <label className="text-sm font-semibold text-gray-900 block">Categoría</label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="categoria"
                  value="Arma"
                  checked={form.categoria === 'Arma'}
                  onChange={handleCategoryChange}
                  className="form-radio text-blue-600 h-4 w-4"
                />
                <span>Arma</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="categoria"
                  value="Armadura"
                  checked={form.categoria === 'Armadura'}
                  onChange={handleCategoryChange}
                  className="form-radio text-blue-600 h-4 w-4"
                />
                <span>Armadura</span>
              </label>
            </div>
          </div>
          
          {/* Stats Deseados */}
          <textarea
            name="stats"
            value={form.stats}
            onChange={handleChange}
            placeholder="Stats Deseados (Ej: Ele Dte Atk CD)"
            // Texto en negro y borde más oscuro
            className="w-full p-3 border border-gray-700 rounded-lg resize-none h-20 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-900"
            required
          />
          
          {/* Pot del equipo */}
          <input
            type="number"
            name="pot"
            value={form.pot}
            onChange={handleChange}
            placeholder="Pot del equipo "
            // Texto en negro y borde más oscuro
            className="w-full p-3 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-900"
          />

          {/* ¿Es Custom?*/}
          <textarea
            name="comentarios"
            value={form.comentarios}
            onChange={handleChange}
            placeholder="(Es Gamble?)"
            // Texto en negro y borde más oscuro
            className="w-full p-3 border border-gray-700 rounded-lg resize-none h-16 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-900"
          />

          <button
            type="submit"
            disabled={loading}
            // Botón primario azul (COLORES SIN MODIFICAR)
            className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition duration-200 mt-6 bg-blue-600 hover:bg-blue-700
                ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
          >
            {loading ? "Enviando Pedido..." : "Enviar Pedido"}
          </button>
        </form>
        
        {/* Botón de Cerrar Sesión: Texto en Negro, Borde Oscuro y Hover Gris */}
        <div className="text-center mt-3">
            <button
                type="button"
                onClick={handleLogout}
                className="w-full py-3 mt-2 border border-gray-700 rounded-lg font-bold text-gray-900 hover:bg-gray-200 transition duration-150"
            >
                Cerrar Sesión
            </button>
        </div>

      </div>
    </main>
  );
}

// Wrapper para usar Suspense si es necesario (aunque useRouter lo maneja mejor aquí)
export default function PedidosPageWrapper() {
    return (
        <PedidosContent />
    );
}
