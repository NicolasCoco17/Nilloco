//hooks/usePedidoForm.ts

'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FORMULAS_ARMAS, FormulaArma } from "@/data/formulas/armas";
import { filtrarFormulasArma } from "@/utils/formulas";

type PedidoFormType = {
  tipo: "Normal" | "Mensual";
  categoria: "Arma" | "Armadura";
  stater: string;
  pot: number | "";
  formulaId: string;
  elemento: string;
  dte: string;
  custom: boolean;
  customText: string;
  stats: string;
  gamble: string;
};

export function usePedidoForm() {
  const [form, setForm] = useState<PedidoFormType>({
    tipo: "Normal",
    categoria: "Arma",
    stater: "",
    pot: "",
    formulaId: "",
    elemento: "",
    dte: "",
    custom: false,
    customText: "",
    stats: "",
    gamble: "",
  });

  const [nick, setNick] = useState<string | null | undefined>(undefined);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensualesUsados, setMensualesUsados] = useState<string[]>([]);

  const statersDisponibles = ["CocoN", "Stater 2", "Stater 3", "Stater 4"];

  // =========================
  // SESSION / USER DATA
  // =========================
  useEffect(() => {
    const loadData = async () => {
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

      const { data: pedidos } = await supabase
        .from("stateos")
        .select("categoria")
        .eq("usuario_id", user.id)
        .eq("tipo", "Mensual");

      if (pedidos) setMensualesUsados(pedidos.map(p => p.categoria));
    };

    loadData();
  }, []);

  // =========================
  // FORM HELPERS
  // =========================
  const formulasDisponibles: FormulaArma[] =
    form.pot !== ""
      ? filtrarFormulasArma(FORMULAS_ARMAS, {
          pot: Number(form.pot),
          elemento: form.elemento,
          dte: form.dte,
        })
      : [];

  const formulaSeleccionada = FORMULAS_ARMAS.find(
    f => f.id === form.formulaId
  );

  // =========================
  // HANDLERS
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setForm(prev => {
      let updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Si cambia el POT, resetear fórmula
      if (name === "pot") {
        updated.formulaId = "";
        updated.elemento = "";
        updated.dte = "";
      }

      // Si cambia la fórmula
      if (name === "formulaId") {
        const formula = FORMULAS_ARMAS.find(f => f.id === value);
        updated.elemento = formula?.usaElemento ? prev.elemento : "";
        updated.dte = formula?.usaDte ? prev.dte : "";
      }

      // Si activa custom
      if (name === "custom" && checked) {
        updated.formulaId = "";
        updated.elemento = "";
        updated.dte = "";
      }

      return updated;
    });
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

  // =========================
  // SUBMIT
  // =========================
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

      if (form.tipo === "Mensual") {
        setMensualesUsados([...mensualesUsados, form.categoria]);
      }

      setForm({
        tipo: "Normal",
        categoria: "Arma",
        stater: "",
        pot: "",
        formulaId: "",
        elemento: "",
        dte: "",
        custom: false,
        customText: "",
        stats: "",
        gamble: "",
      });
    } catch {
      setMensaje("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EXPORT
  // =========================
  const puedeHacerMensual = mensualesUsados.length < 2;
  const yaPidioEstaCategoriaMensual =
    form.tipo === "Mensual" && mensualesUsados.includes(form.categoria);

  return {
    form,
    mensaje,
    loading,
    nick,
    puedeHacerMensual,
    yaPidioEstaCategoriaMensual,
    statersDisponibles,
    formulasDisponibles,
    formulaSeleccionada,
    handleChange,
    handleCategoryChange,
    handleTypeChange,
    handleSubmit,
  };
}
