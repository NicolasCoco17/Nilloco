//api/login

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Validar email y contraseña con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Email o contraseña incorrectos ❌" }, { status: 401 });
    }

    // 2. Buscar los datos adicionales (Nick y Gremio) usando el ID del usuario
    const { data: profile, error: dbError } = await supabase
      .from("usuarios")
      .select("nick, gremio")
      .eq("id", authData.user.id)
      .single();

    if (dbError) return NextResponse.json({ error: "No se encontró el perfil" }, { status: 404 });

    return NextResponse.json({
      token: authData.session?.access_token,
      nick: profile.nick,
      gremio: profile.gremio,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}