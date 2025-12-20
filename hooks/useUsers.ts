//useUsers.ts

'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Usuario = {
  id: string;
  email: string;
  nick: string;
  gremio: string | null;
  telefono: string | null;
};

export function useUsers() {
  const [rows, setRows] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 🔐 (opcional) validar sesión
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("No autenticado");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("usuarios")
        .select("id, email, nick, gremio, telefono");

      if (error) {
        console.error(error);
        setError("Error al cargar usuarios");
      } else {
        setRows(data ?? []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return { rows, loading, error };
}
