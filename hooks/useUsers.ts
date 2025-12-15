'use client'
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useUsers() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error al consultar Supabase:", error);
      } else {
        setRows(data ?? []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return { rows, loading };
}

