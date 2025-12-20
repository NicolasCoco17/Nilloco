'use client'
import { usePedidoForm } from "@/hooks/usePedidoForm";

export default function PedidoForm() {
  const {
    form, mensaje, loading, nick, puedeHacerMensual, yaPidioEstaCategoriaMensual,
    statersDisponibles, handleChange, handleCategoryChange, handleTypeChange, handleSubmit,
  } = usePedidoForm();

  if (nick === undefined) return <div className="text-white">Cargando sesión...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full">
      <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-4">Formulario de Pedidos</h1>
      
      {/* Alerta de Mensuales */}
      {nick && form.tipo === "Mensual" && (
        <div className={`p-2 rounded-lg mb-4 text-xs font-bold text-center ${yaPidioEstaCategoriaMensual ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
          {yaPidioEstaCategoriaMensual 
            ? `⚠️ Ya solicitaste el mensual de ${form.categoria}.` 
            : `✅ Puedes solicitar 1 ${form.categoria} mensual.`}
        </div>
      )}

      {mensaje && (
        <div className={`p-3 rounded-lg mb-4 text-center text-sm font-bold ${mensaje.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900">Tipo de Pedido</label>
          <div className="flex space-x-2">
            <button type="button" onClick={() => handleTypeChange("Normal")} className={`flex-1 py-2 rounded-lg font-bold border-2 ${form.tipo === 'Normal' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}>Normal</button>
            <button type="button" disabled={!puedeHacerMensual} onClick={() => handleTypeChange("Mensual")} className={`flex-1 py-2 rounded-lg font-bold border-2 ${form.tipo === 'Mensual' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'} ${!puedeHacerMensual ? 'opacity-50 cursor-not-allowed' : ''}`}>Mensual</button>
          </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 block">Categoría</label>
            <div className="flex space-x-6 text-gray-800">
              <label className="flex items-center space-x-2"><input type="radio" name="categoria" value="Arma" checked={form.categoria === 'Arma'} onChange={handleCategoryChange} /> <span>Arma</span></label>
              <label className="flex items-center space-x-2"><input type="radio" name="categoria" value="Armadura" checked={form.categoria === 'Armadura'} onChange={handleCategoryChange} /> <span>Armadura</span></label>
            </div>
        </div>

        {/* ... (Demás campos de input iguales) ... */}

        <button 
          type="submit" 
          disabled={loading || yaPidioEstaCategoriaMensual || !nick} 
          className={`w-full py-3 rounded-lg font-bold text-white shadow-md ${
            (loading || yaPidioEstaCategoriaMensual || !nick) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Enviando..." : yaPidioEstaCategoriaMensual ? "Límite de categoría alcanzado" : "Enviar Pedido"}
        </button>
      </form>
    </div>
  );
}