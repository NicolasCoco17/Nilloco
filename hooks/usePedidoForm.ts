//hooks/usepedidoform.ts

'use client'
import { useEffect, useState, useCallback } from "react";
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
  const [telefono, setTelefono] = useState<string | null>(null);
  const [nick, setNick] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [puedeHacerMensual, setPuedeHacerMensual] = useState(true); // Lógica de límite

  const [form, setForm] = useState<PedidoFormType>({
    stater: "",
    tipo: "Normal",
    categoria: "Arma",
    stats: "",
    gamble: "",
    pot: "",
  });

  useEffect(() => {
    setTelefono(localStorage.getItem("userTelefono"));
    setNick(localStorage.getItem("userNick"));
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
    setForm(prev => ({ ...prev, tipo, stater: tipo === "Mensual" ? "CocoN" : "" }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, categoria: e.target.value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telefono,
          nombre: nick,
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
        setForm({ stater: "", tipo: "Normal", categoria: "Arma", stats: "", gamble: "", pot: "" });
        localStorage.removeItem("draftPedido");
      } else {
        const d = await res.json();
        setMensaje(d.error || "Error ❌");
      }
    } catch {
      setMensaje("Error de conexión ❌");
    } finally {
      setLoading(false);
    }
  };

  return { form, mensaje, loading, nick, puedeHacerMensual, statersDisponibles, handleChange, handleTypeChange, handleCategoryChange, handleSubmit };
}