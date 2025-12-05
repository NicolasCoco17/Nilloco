// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Variables de entorno definidas en .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente de Supabase listo para usar en toda la app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)