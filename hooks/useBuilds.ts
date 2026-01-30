// hooks/useBuilds.ts
"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export type BuildDB = {
  id: string;
  name: string;
  data: any; // El JSON completo de la calculadora
  created_at: string;
};

export function useBuilds() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [builds, setBuilds] = useState<BuildDB[]>([]);

  // 1. Obtener lista de builds del usuario
  const fetchBuilds = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from("builds")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando builds:", error);
    } else {
      setBuilds(data || []);
    }
    setLoading(false);
  }, [user]);

  // 2. Guardar nueva build
  const saveBuildCloud = async (name: string, buildData: any) => {
    if (!user) {
      alert("Debes iniciar sesión para guardar en la nube.");
      return false;
    }

    setLoading(true);
    const { error } = await supabase.from("builds").insert({
      user_id: user.id,
      name: name,
      data: buildData
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error al guardar: " + error.message);
      return false;
    }

    alert("✅ Build guardada en la nube exitosamente.");
    fetchBuilds(); // Recargar la lista
    return true;
  };

  // 3. Borrar build
  const deleteBuildCloud = async (id: string) => {
    if (!confirm("¿Borrar esta build de la nube?")) return;

    setLoading(true);
    const { error } = await supabase.from("builds").delete().eq("id", id);
    setLoading(false);

    if (error) {
      alert("Error al borrar");
    } else {
      fetchBuilds(); // Actualizar lista visual
    }
  };

  return {
    builds,
    loading,
    fetchBuilds,
    saveBuildCloud,
    deleteBuildCloud
  };
}