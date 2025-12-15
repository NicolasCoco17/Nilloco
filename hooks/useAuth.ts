// hooks/useAuth.ts

"use client";
import { supabase } from "@/lib/supabase";

// Login por teléfono
export async function loginUser(telefono: string) {
  return supabase
    .from("users") // <-- Usamos la tabla 'users'
    .select("id, nick") 
    .eq("telefono", telefono)
    .single();
}

// Registrar nuevo usuario (Finalizado con los 3 campos)
export async function registerUser(telefono: string, nick: string, gremio: string) {
  return supabase.from("users").insert([{ telefono, nick, gremio }]).select().single();
}

// Cerrar sesión
export function logoutUser() {
  localStorage.removeItem("userTelefono");
  localStorage.removeItem("userNick");
  localStorage.removeItem("savedForm");
}
