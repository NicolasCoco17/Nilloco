'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PedidoForm from "@/components/PedidoForm";

export default function PedidoPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Solo consultamos si hay sesión, NO redirigimos
      await supabase.auth.getUser();
      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Cargando...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-login bg-cover px-4">
        <PedidoForm />
    </main>
  );
}
