//useUsers.ts

'use client'
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useUsers() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Cambiamos "users" por "usuarios"
      const { data, error } = await supabase.from("usuarios").select("*");
      if (error) {
        console.error("Error al consultar la tabla usuarios:", error);
      } else {
        setRows(data ?? []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return { rows, loading };
}