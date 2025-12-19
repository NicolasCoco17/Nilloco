//api/pedido

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Esto fuerza a Next.js a no usar caché y leer las variables frescas
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Intentamos obtener las variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 2. Si faltan, lanzamos un error claro para depurar
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Faltan Variables de Entorno:", { 
        url: !!supabaseUrl, 
        key: !!supabaseKey 
      });
      return NextResponse.json(
        { error: "Error de configuración: Variables de entorno no cargadas." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();

    const { error } = await supabase.from("stateos").insert({
      Telefono: body.telefono,
      Nombre: body.nombre,
      Stater: body.stater,
      Tipo: body.tipo,
      Categoria: body.categoria,
      Stats: body.stats,
      Pot: Number(body.pot) || 0,
      Gamble: body.gamble || "",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Error Crítico:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}