import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await req.json();

    // 1. Insertamos en Supabase y obtenemos el ID generado
    const { data: pedido, error: dbError } = await supabase
      .from("stateos")
      .insert({
        email: body.email,
        nombre: body.nombre,
        stater: body.stater,
        tipo: body.tipo,
        categoria: body.categoria,
        stats: body.stats,
        pot: Number(body.pot) || 0,
        gamble: body.gamble || "",
        estado: "Pendiente"
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // 2. Enviar a Discord usando el BOT
    const CHANNEL_ID = "TU_ID_DE_CANAL_DE_PRUEBAS";
    const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

    const response = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${DISCORD_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [{
          title: `⚒️ NUEVO PEDIDO #${pedido.id}`,
          color: body.tipo === "Mensual" ? 5763719 : 3447003,
          fields: [
            { name: "👤 Usuario", value: body.nombre, inline: true },
            { name: "📦 Item", value: body.stater, inline: true },
            { name: "📊 Potencia", value: body.pot.toString(), inline: true },
            { name: "📜 Stats", value: body.stats }
          ],
          footer: { text: `ID del Pedido: ${pedido.id}` }
        }],
        components: [
          {
            type: 1, // Action Row
            components: [
              {
                type: 2, // Button
                style: 3, // Green (Success)
                label: "Marcar como Terminado ✅",
                // El custom_id lleva el ID del pedido para que la otra API sepa cuál actualizar
                custom_id: `terminar_${pedido.id}`
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      console.error("Error enviando a Discord:", await response.json());
    }

    return NextResponse.json({ success: true, id: pedido.id });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}