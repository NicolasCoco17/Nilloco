//// components/PedidoForm.tsx

'use client'
import { usePedidoForm } from "@/hooks/usePedidoForm";

export default function PedidoForm() {
  const {
    form,
    mensaje,
    loading,
    nick,
    puedeHacerMensual,
    statersDisponibles,
    handleChange,
    handleCategoryChange,
    handleTypeChange,
    handleSubmit,
    handleLogout,
  } = usePedidoForm();

  if (nick === undefined) { 
     // Mostrar carga inicial mientras usePedidoForm.ts resuelve la sesión
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            Cargando sesión...
        </div>
     );
  }

  return (
    // Tarjeta blanca limpia y centrada
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full">
        
      {/* ENCABEZADO: Títulos en Negro, Borde Oscuro */}
      {/* CORRECCIÓN: ELIMINACIÓN DEL CARÁCTER '>' QUE CAUSÓ EL ERROR DE PARSING */}
      <div className="text-center mb-6 pb-4 border-b border-gray-700">
          <h1 className="text-2xl font-extrabold text-gray-900">
              Formulario de Pedidos
          </h1>
          <p className="text-sm text-gray-700 mt-2">
              {/* Saludo condicional, incluso si nick es null */}
              Bienvenido, {nick || 'Invitado'}.
          </p>
      </div>

      {/* LEYENDA - Visible para Invitados */}
      {!nick && (
          <div className="p-3 rounded-lg mb-4 text-sm font-medium text-center bg-yellow-100 text-yellow-800 border border-yellow-300">
              ⚠️ Solo puedes visualizar y preparar el pedido. Para enviarlo, debes **Iniciar Sesión**.
          </div>
      )}

      {/* Mensaje de Sesión y Límite Mensual - Solo Visible para Logueados */}
      {nick && (
        <div className={`p-3 rounded-lg mb-4 text-xs font-medium text-center ${puedeHacerMensual ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
            {puedeHacerMensual ? 
                "✅ Puedes realizar pedidos Mensuales." : 
                "⚠️ Límite de 2 pedidos Mensuales alcanzado este mes. Solo puedes enviar pedidos Normales."
            }
        </div>
      )}

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
                  // Deshabilitar si no puede hacer mensual o si no está logueado
                  disabled={!puedeHacerMensual || !nick}
                  onClick={() => handleTypeChange("Mensual")}
                  className={`w-1/2 py-2 rounded-lg font-bold transition duration-150 border-2 text-sm
                      ${form.tipo === 'Mensual' && nick && puedeHacerMensual
                          ? 'bg-green-600 text-white border-green-600 shadow-md' 
                          : 'bg-white text-gray-900 border-gray-400'}
                      ${(!puedeHacerMensual || !nick) 
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
        
        {/* Pot del equipo */}
        <input
          type="number"
          name="pot"
          value={form.pot}
          onChange={handleChange}
          placeholder="Pot del equipo "
          className="w-full p-3 border border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-900"
        />
          
        {/* Stats Deseados */}
        <textarea
          name="stats"
          value={form.stats}
          onChange={handleChange}
          placeholder="Stats Deseados (Ej: Ele Dte Atk CD)"
          className="w-full p-3 border border-gray-700 rounded-lg resize-none h-20 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-900"
          required
        />

        {/* Comentarios / ¿Es Gamble? */}
        <textarea
          name="comentarios"
          value={form.comentarios}
          onChange={handleChange}
          placeholder="(Es Gamble?)"
          className="w-full p-3 border border-gray-700 rounded-lg resize-none h-16 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-900"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition duration-200 mt-6 bg-blue-600 hover:bg-blue-700
              ${loading ? "bg-gray-400 cursor-not-allowed" : ""}`}
        >
          {loading ? "Enviando Pedido..." : "Enviar Pedido"}
        </button>
      </form>
        
    </div>
  );
}
