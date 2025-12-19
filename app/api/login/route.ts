import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { telefono } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("users")
      .select("nick, gremio")
      .eq("telefono", telefono)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Usuario no encontrado o teléfono incorrecto ❌" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      nick: data.nick,
      gremio: data.gremio,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}