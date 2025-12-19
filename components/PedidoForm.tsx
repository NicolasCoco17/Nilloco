//component/pedidoform.tsx

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
  } = usePedidoForm();

  if (nick === undefined) { 
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            Cargando sesión...
        </div>
     );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full">
      <div className="text-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-extrabold text-gray-900">Formulario de Pedidos</h1>
          <p className="text-sm text-gray-700 mt-2">Bienvenido, {nick || 'Invitado'}.</p>
      </div>

      {!nick && (
          <div className="p-3 rounded-lg mb-4 text-sm font-medium text-center bg-yellow-100 text-yellow-800 border border-yellow-300">
              ⚠️ Debes **Iniciar Sesión** para enviar el pedido.
          </div>
      )}

      {nick && (
        <div className={`p-3 rounded-lg mb-4 text-xs font-medium text-center ${puedeHacerMensual ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
            {puedeHacerMensual ? "✅ Tienes pedidos Mensuales disponibles." : "⚠️ Límite mensual alcanzado (2/2)."}
        </div>
      )}

      {mensaje && (
        <div className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${mensaje.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Pedido */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 block">Tipo de Pedido</label>
          <div className="flex space-x-2">
              <button
                  type="button"
                  onClick={() => handleTypeChange("Normal")}
                  className={`flex-1 py-2 rounded-lg font-bold border-2 text-sm transition ${form.tipo === 'Normal' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
              > Normal </button>
              <button
                  type="button"
                  disabled={!puedeHacerMensual || !nick}
                  onClick={() => handleTypeChange("Mensual")}
                  className={`flex-1 py-2 rounded-lg font-bold border-2 text-sm transition ${form.tipo === 'Mensual' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'} ${(!puedeHacerMensual || !nick) ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
              > Mensual </button>
          </div>
        </div>

        {/* Stater Solicitado */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 block">Stater / Item</label>
          {form.tipo === 'Normal' ? (
            <select
                name="stater"
                value={form.stater}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                required
            >
                <option value="">Selecciona un Stater</option>
                {statersDisponibles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <input
                type="text"
                value="CocoN"
                readOnly
                className="w-full p-3 border border-red-200 bg-red-50 rounded-lg text-gray-900 font-bold cursor-not-allowed"
            />
          )}
        </div>

        {/* Categoría */}
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 block">Categoría</label>
            <div className="flex space-x-6 text-gray-800">
              <label className="flex items-center space-x-2"><input type="radio" name="categoria" value="Arma" checked={form.categoria === 'Arma'} onChange={handleCategoryChange} /> <span>Arma</span></label>
              <label className="flex items-center space-x-2"><input type="radio" name="categoria" value="Armadura" checked={form.categoria === 'Armadura'} onChange={handleCategoryChange} /> <span>Armadura</span></label>
            </div>
        </div>
        
        <input type="number" name="pot" value={form.pot} onChange={handleChange} placeholder="Pot del equipo" className="w-full p-3 border border-gray-300 rounded-lg text-gray-900" />
        <textarea name="stats" value={form.stats} onChange={handleChange} placeholder="Stats Deseados" className="w-full p-3 border border-gray-300 rounded-lg h-20 text-gray-900" required />
        <textarea name="gamble" value={form.gamble} onChange={handleChange} placeholder="¿Es Gamble? (Comentarios)" className="w-full p-3 border border-gray-300 rounded-lg h-16 text-gray-900" />

        {nick ? (
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-bold text-white shadow-md ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}>
            {loading ? "Enviando..." : "Enviar Pedido"}
          </button>
        ) : (
          <button type="button" onClick={() => window.location.href = "/login"} className="w-full py-3 rounded-lg font-bold text-white bg-yellow-500 hover:bg-yellow-600">
            Iniciar sesión 🔒
          </button>
        )}
      </form> 
    </div>
  );
}