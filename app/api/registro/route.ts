import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { telefono, nick, gremio } = await req.json();

    if (!telefono || !nick || !gremio) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insertar nuevo usuario
    const { data, error } = await supabase
      .from("users")
      .insert([{ telefono, nick, gremio }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Código de duplicado en Postgres
        return NextResponse.json({ error: "El teléfono ya está registrado 📱" }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar el registro" },
      { status: 500 }
    );
  }
}