import { NextResponse } from "next/server";
import { verifyKey } from "discord-interactions";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const signature = req.headers.get("x-signature-ed25519");
  const timestamp = req.headers.get("x-signature-timestamp");
  const rawBody = await req.text();

  // 1. Validar que la petición viene de Discord (Obligatorio)
  const isValid = verifyKey(
    rawBody,
    signature || "",
    timestamp || "",
    process.env.DISCORD_PUBLIC_KEY!
  );

  if (!isValid) {
    return new NextResponse("Firma inválida", { status: 401 });
  }

  const interaction = JSON.parse(rawBody);

  // 2. Responder al PING inicial de Discord para activar la URL
  if (interaction.type === 1) {
    return NextResponse.json({ type: 1 });
  }

  // 3. Manejar el clic del botón
  if (interaction.type === 3) {
    const { custom_id, member } = interaction;
    
    // El custom_id lo definimos como "terminar_IDDEPEDIDO"
    const [accion, pedidoId] = custom_id.split("_");

    if (accion === "terminar") {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Actualizar estado en Supabase
      const { error } = await supabase
        .from("stateos")
        .update({ 
          estado: "Terminado",
          finalizado_por: member.user.username 
        })
        .eq("id", pedidoId);

      if (error) {
        return NextResponse.json({
          type: 4,
          data: { content: "❌ Error al actualizar la DB", flags: 64 }
        });
      }

      // Responder en Discord que se logró
      return NextResponse.json({
        type: 7, // 7 = Actualiza el mensaje original
        data: { 
          content: `✅ **Pedido #${pedidoId} finalizado** por ${member.user.username}.`,
          components: [] // Quitamos el botón para que no lo pulsen de nuevo
        }
      });
    }
  }

  return NextResponse.json({ type: 1 });
}