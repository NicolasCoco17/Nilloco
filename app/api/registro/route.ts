//api/registro

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, password, nick, gremio, telefono } = await req.json();

    // Validación básica
    if (!email || !password || !nick) {
      return NextResponse.json({ error: "Email, contraseña y nick son obligatorios" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Crear el usuario en Supabase Auth (Capa de seguridad)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

    // 2. Crear el perfil en tu tabla 'usuarios' (Capa de datos de juego)
    // El 'id' debe ser el mismo que generó Auth
    const { data: profileData, error: dbError } = await supabase
      .from("usuarios")
      .insert([{ 
        id: authData.user?.id, 
        email, 
        nick, 
        gremio, 
        telefono 
      }])
      .select()
      .single();

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json({ success: true, user: profileData });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}