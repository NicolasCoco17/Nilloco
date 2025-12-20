'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { statersDisponibles } from "@/lib/staters";

type PedidoFormType = {
  stater: string;
  tipo: "Normal" | "Mensual";
  categoria: "Arma" | "Armadura";
  stats: string;
  gamble: string;
  pot: number | string;
};

export function usePedidoForm() {
  const router = useRouter();
  
  // Cambiamos 'telefono' por 'email' para que coincida con tu nueva lógica
  const [email, setEmail] = useState<string | null>(null);
  const [nick, setNick] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [puedeHacerMensual, setPuedeHacerMensual] = useState(true);

  const [form, setForm] = useState<PedidoFormType>({
    stater: "",
    tipo: "Normal",
    categoria: "Arma",
    stats: "",
    gamble: "",
    pot: "",
  });

  useEffect(() => {
    // 1. Cargamos los datos del nuevo sistema de login
    const savedNick = localStorage.getItem("userNick");
    const savedEmail = localStorage.getItem("userEmail");
    
    setNick(savedNick);
    setEmail(savedEmail);

    // 2. Recuperar borradores si existen
    const saved = localStorage.getItem("draftPedido");
    if (saved) setForm(prev => ({ ...prev, ...JSON.parse(saved) }));
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => {
      const u = { ...prev, [name]: value };
      localStorage.setItem("draftPedido", JSON.stringify(u));
      return u;
    });
  };

  const handleTypeChange = (tipo: "Normal" | "Mensual") => {
    // Si es mensual, bloqueamos el stater a "CocoN" (o el que decidas)
    setForm(prev => ({ 
      ...prev, 
      tipo, 
      stater: tipo === "Mensual" ? "CocoN" : "" 
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, categoria: e.target.value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nick) {
      setMensaje("Debes estar logueado para pedir ❌");
      return;
    }

    setLoading(true);
    try {
      // 3. Enviamos el pedido a tu API
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,        // Usamos email ahora
          nombre: nick, // El nick del usuario logueado
          stater: form.stater,
          tipo: form.tipo,
          categoria: form.categoria,
          stats: form.stats,
          pot: form.pot || 0,
          gamble: form.gamble,
        }),
      });

      if (res.ok) {
        setMensaje("Pedido enviado con éxito ✅");
        // Limpiamos el form pero mantenemos el tipo en Normal
        setForm({ stater: "", tipo: "Normal", categoria: "Arma", stats: "", gamble: "", pot: "" });
        localStorage.removeItem("draftPedido");
      } else {
        const d = await res.json();
        setMensaje(d.error || "Error al enviar ❌");
      }
    } catch {
      setMensaje("Error de conexión ❌");
    } finally {
      setLoading(false);
    }
  };

  return { 
    form, 
    mensaje, 
    loading, 
    nick, 
    puedeHacerMensual, 
    statersDisponibles, 
    handleChange, 
    handleTypeChange, 
    handleCategoryChange, 
    handleSubmit 
  };
}