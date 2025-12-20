//hooks/usePedidoForm.ts

'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PedidoFormType = {
  tipo: "Normal" | "Mensual";
  categoria: "Arma" | "Armadura";
  stater: string;
  pot: number | "";
  stats: string;
  gamble: string;
};

export function usePedidoForm() {
  const [form, setForm] = useState<PedidoFormType>({
    tipo: "Normal",
    categoria: "Arma",
    stater: "",
    pot: "",
    stats: "",
    gamble: "",
  });

  const [nick, setNick] = useState<string | null | undefined>(undefined);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensualesUsados, setMensualesUsados] = useState<string[]>([]);

  const statersDisponibles = ["CocoN", "Stater 2", "Stater 3", "Stater 4"];

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNick(null);
        return;
      }

      // Cargar Nick
      const { data: profile } = await supabase.from("usuarios").select("nick").eq("id", user.id).single();
      setNick(profile?.nick ?? null);

      // Cargar qué mensuales ya pidió (esto no afecta a los normales)
      const { data: pedidos } = await supabase
        .from("stateos")
        .select("categoria")
        .eq("usuario_id", user.id)
        .eq("tipo", "Mensual");

      if (pedidos) setMensualesUsados(pedidos.map(p => p.categoria));
    };
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, categoria: e.target.value as any }));
  };

  const handleTypeChange = (tipo: "Normal" | "Mensual") => {
    setForm(prev => ({
      ...prev,
      tipo,
      stater: tipo === "Mensual" ? "CocoN" : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      setMensaje("❌ Debes iniciar sesión");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setMensaje(`❌ ${data.error}`);
        return;
      }

      setMensaje("✅ Pedido enviado correctamente");
      // Si fue mensual, lo añadimos a la lista local para bloquear el botón de inmediato
      if (form.tipo === "Mensual") {
        setMensualesUsados([...mensualesUsados, form.categoria]);
      }
      
      setForm({ tipo: "Normal", categoria: "Arma", stater: "", pot: "", stats: "", gamble: "" });
    } catch {
      setMensaje("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Lógica para exportar al componente
  const puedeHacerMensual = mensualesUsados.length < 2;
  const yaPidioEstaCategoriaMensual = form.tipo === "Mensual" && mensualesUsados.includes(form.categoria);

  return {
    form, mensaje, loading, nick, 
    puedeHacerMensual, yaPidioEstaCategoriaMensual,
    statersDisponibles, handleChange, handleCategoryChange, handleTypeChange, handleSubmit,
  };
}