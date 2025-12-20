'use client'
import { usePedidoForm } from "@/hooks/usePedidoForm";

export default function PedidoForm() {
  const {
    form,
    mensaje,
    loading,
    nick,
    puedeHacerMensual,
    yaPidioEstaCategoriaMensual,
    statersDisponibles,
    handleChange,
    handleCategoryChange,
    handleTypeChange,
    handleSubmit,
  } = usePedidoForm();

  if (nick === undefined) { 
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
             Cargando sesión...
         </div>
      );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
      <div className="text-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-extrabold text-gray-900">Formulario de Pedidos</h1>
          <p className="text-sm text-gray-700 mt-2">Bienvenido, <span className="font-bold text-blue-600">{nick || 'Invitado'}</span>.</p>
      </div>

      {!nick && (
          <div className="p-3 rounded-lg mb-4 text-sm font-medium text-center bg-yellow-100 text-yellow-800 border border-yellow-300">
              ⚠️ Debes **Iniciar Sesión** para enviar el pedido.
          </div>
      )}

      {/* Alerta de Disponibilidad Mensual */}
      {nick && (
        <div className={`p-3 rounded-lg mb-4 text-xs font-bold text-center border ${
          yaPidioEstaCategoriaMensual 
            ? 'bg-red-100 text-red-800 border-red-200' 
            : 'bg-blue-100 text-blue-800 border-blue-200'
        }`}>
            {yaPidioEstaCategoriaMensual 
              ? `❌ Ya solicitaste tu mensual de ${form.categoria}.` 
              : puedeHacerMensual 
                ? `✅ Tienes disponible 1 ${form.categoria} mensual.` 
                : "⚠️ Límite mensual total alcanzado (2/2)."}
        </div>
      )}

      {mensaje && (
        <div className={`p-3 rounded-lg mb-4 text-center text-sm font-bold border ${
          mensaje.includes('❌') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tipo de Pedido */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block">Tipo de Pedido</label>
          <div className="flex space-x-2">
              <button
                  type="button"
                  onClick={() => handleTypeChange("Normal")}
                  className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${
                    form.tipo === 'Normal' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
                  }`}
              > Normal </button>
              <button
                  type="button"
                  disabled={!puedeHacerMensual || !nick}
                  onClick={() => handleTypeChange("Mensual")}
                  className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${
                    form.tipo === 'Mensual' 
                      ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'
                  } ${(!puedeHacerMensual || !nick) ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
              > Mensual </button>
          </div>
        </div>

        {/* Categoría con Radio Buttons */}
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <label className="text-sm font-bold text-gray-700 block mb-1">Categoría del Equipo</label>
            <div className="flex space-x-8 justify-center">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="radio" name="categoria" value="Arma" checked={form.categoria === 'Arma'} onChange={handleCategoryChange} className="w-4 h-4 text-blue-600" /> 
                <span className="text-gray-700 group-hover:text-blue-600 font-medium">Arma</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="radio" name="categoria" value="Armadura" checked={form.categoria === 'Armadura'} onChange={handleCategoryChange} className="w-4 h-4 text-blue-600" /> 
                <span className="text-gray-700 group-hover:text-blue-600 font-medium">Armadura</span>
              </label>
            </div>
        </div>

        {/* Stater Solicitado */}
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700">Stater / Encargado</label>
          {form.tipo === 'Normal' ? (
            <select
                name="stater"
                value={form.stater}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 outline-none transition-colors"
                required
            >
                <option value="">Selecciona un Stater</option>
                {statersDisponibles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <input
                type="text"
                value="CocoN (Especialista Mensual)"
                readOnly
                className="w-full p-3 border-2 border-green-200 bg-green-50 rounded-lg text-green-800 font-bold cursor-not-allowed"
            />
          )}
        </div>
        
        <div className="space-y-1">
           <label className="text-sm font-bold text-gray-700">POT</label>
           <input type="number" name="pot" value={form.pot} onChange={handleChange} placeholder="Ej: 94" className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 outline-none" />
        </div>

        <div className="space-y-1">
           <label className="text-sm font-bold text-gray-700">Stats Deseados</label>
           <textarea name="stats" value={form.stats} onChange={handleChange} placeholder="Atk14% Cd10% Cd10 Cr30..." className="w-full p-3 border-2 border-gray-200 rounded-lg h-24 text-gray-900 focus:border-blue-500 outline-none resize-none" required />
        </div>

        <div className="space-y-1">
           <label className="text-sm font-bold text-gray-700">Gamble </label>
           <textarea name="gamble" value={form.gamble} onChange={handleChange} placeholder="Opcional..." className="w-full p-3 border-2 border-gray-200 rounded-lg h-16 text-gray-900 focus:border-blue-500 outline-none resize-none" />
        </div>

        {nick ? (
          <button 
            type="submit" 
            disabled={loading || yaPidioEstaCategoriaMensual} 
            className={`w-full py-4 rounded-xl font-black text-white shadow-xl transition-all transform active:scale-95 ${
              (loading || yaPidioEstaCategoriaMensual) 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            }`}
          >
            {loading ? "PROCESANDO..." : yaPidioEstaCategoriaMensual ? "CATEGORÍA AGOTADA" : "ENVIAR PEDIDO"}
          </button>
        ) : (
          <button type="button" onClick={() => window.location.href = "/login"} className="w-full py-4 rounded-xl font-bold text-white bg-yellow-500 hover:bg-yellow-600 shadow-lg transition-transform active:scale-95">
            INICIAR SESIÓN PARA PEDIR 🔒
          </button>
        )}
      </form> 
    </div>
  );
}