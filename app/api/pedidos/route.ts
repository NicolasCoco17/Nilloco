//app/api/pedidos

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      tipo,
      categoria,
      pot,
      stats,
      gamble,
      stater,
    } = body;

    // 1️⃣ Cliente con SERVICE ROLE (solo backend)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2️⃣ Obtenemos sesión desde headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para enviar pedidos" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const { data: userData, error: userError } =
      await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json(
        { error: "Sesión inválida" },
        { status: 401 }
      );
    }

    const user = userData.user;

    // 3️⃣ Buscamos perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from("usuarios")
      .select("id, gremio")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 403 }
      );
    }

    // 4️⃣ Validamos gremio
    const gremiosPermitidos = ["DarkCats", "Organization Xlll"];

    if (!gremiosPermitidos.includes(profile.gremio)) {
      return NextResponse.json(
        { error: "No tienes permisos para enviar pedidos" },
        { status: 403 }
      );
    }

    // 5️⃣ Validación pedido mensual estricta (1 Arma, 1 Armadura)
    if (tipo === "Mensual") {
      const { data: pedidosMensuales } = await supabase
        .from("stateos")
        .select("categoria")
        .eq("usuario_id", user.id)
        .eq("tipo", "Mensual");

      if (pedidosMensuales) {
        // Regla 1: Máximo 2 totales (Arma + Armadura)
        if (pedidosMensuales.length >= 2) {
          return NextResponse.json({ error: "Límite mensual alcanzado (2/2)" }, { status: 403 });
        }

        // Regla 2: No repetir la misma categoría en mensual
        const yaPidioEsaCategoria = pedidosMensuales.some(p => p.categoria === categoria);
        if (yaPidioEsaCategoria) {
          return NextResponse.json({ error: `Ya solicitaste el mensual de ${categoria}. Solo puedes pedir uno de cada uno.` }, { status: 403 });
        }
      }
    }

    // 6️⃣ Insertamos pedido
    const { error: insertError } = await supabase.from("stateos").insert({
      usuario_id: user.id,
      categoria,
      pot,
      stats,
      gamble,
      tipo,
      stater,
      estado_pedido: "Pendiente",
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Error al guardar el pedido" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
