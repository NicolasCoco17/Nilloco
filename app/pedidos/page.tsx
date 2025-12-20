// app/pedidos/page.tsx

'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Tu cliente de supabase

export default function PedidoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Buscamos su gremio en la tabla de usuarios
      const { data: profile } = await supabase
        .from('usuarios')
        .select('gremio')
        .eq('id', user.id)
        .single();

      const gremiosPermitidos = ['DarkCats', 'Organization Xlll'];
      
      if (!profile || !gremiosPermitidos.includes(profile.gremio)) {
        router.push('/acceso-denegado'); // ¡Aquí el bloqueo!
      } else {
        setLoading(false);
      }
    }
    checkAccess();
  }, []);

  if (loading) return <p>Cargando búnker...</p>;

  return (
    // Aquí va tu formulario normal que ya tenías
    <form>...</form>
  );
}