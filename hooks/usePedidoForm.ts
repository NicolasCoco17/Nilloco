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

  const statersDisponibles = [
    "CocoN",
    "Nilloco",
    "Stater 3",
    "Stater 4",
  ];

  // 🔐 Sesión (solo para mostrar nick)
  useEffect(() => {
    const loadSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setNick(null);
        return;
      }

      const { data: profile } = await supabase
        .from("usuarios")
        .select("nick")
        .eq("id", user.id)
        .single();

      setNick(profile?.nick ?? null);
    };

    loadSession();
  }, []);

  // ✍️ handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

  // 📦 ENVÍO REAL (API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      setMensaje("❌ Debes iniciar sesión para enviar pedidos");
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
        setLoading(false);
        return;
      }

      setMensaje("✅ Pedido enviado correctamente");
      setForm({
        tipo: "Normal",
        categoria: "Arma",
        stater: "",
        pot: "",
        stats: "",
        gamble: "",
      });

    } catch {
      setMensaje("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    mensaje,
    loading,
    nick,
    statersDisponibles,
    handleChange,
    handleCategoryChange,
    handleTypeChange,
    handleSubmit,
  };
}
