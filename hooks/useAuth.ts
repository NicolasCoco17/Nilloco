// hooks/useAuth.ts

"use client";
import { supabase } from "@/lib/supabase";

// Login profesional con Email y Password
export async function loginUser(email: string, password: string) {
  // 1. Autentica en el sistema de seguridad de Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { data: null, error };

  // 2. Una vez logueado, buscamos su Nick y Gremio en tu tabla 'usuarios'
  const { data: profile, error: profileError } = await supabase
    .from("usuarios")
    .select("nick, gremio")
    .eq("id", data.user.id)
    .single();

  return { 
    user: data.user, 
    profile, 
    error: profileError 
  };
}

// Registro profesional
export async function registerUser(email: string, password: string, nick: string, gremio: string, telefono: string) {
  // 1. Crea el usuario en Supabase Auth
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) return { data: null, error: authError };

  // 2. Crea el perfil en tu tabla 'usuarios' usando el ID generado
  const { data: profile, error: dbError } = await supabase
    .from("usuarios")
    .insert([{ 
      id: data.user?.id, 
      nick, 
      gremio, 
      email,
      telefono 
    }])
    .select()
    .single();

  return { user: data.user, profile, error: dbError };
}

// Cerrar sesión
export async function logoutUser() {
  await supabase.auth.signOut(); // Cierra sesión en el servidor
  localStorage.clear(); // Limpia todo el rastro local
}