// hooks/useGlobalSession.ts

'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useGlobalSession() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
    const [userNick, setUserNick] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const tel = localStorage.getItem("userTelefono");
        const nick = localStorage.getItem("userNick");
        
        if (tel && nick) {
            setIsLoggedIn(true);
            setUserNick(nick);
        } else {
            setIsLoggedIn(false);
            setUserNick(null);
        }
    }, []);

    const logout = (redirectPath: string | null = '/') => { 
        // 1. Limpieza de datos
        localStorage.removeItem("userTelefono");
        localStorage.removeItem("userNick");
        localStorage.removeItem("draftPedido");
        localStorage.removeItem("puedeHacerMensual"); // Agregado para limpiar todo
        
        // 2. Actualizar estado local
        setIsLoggedIn(false);
        setUserNick(null);

        // 3. Redirección o Recarga forzada
        if (redirectPath) {
            router.replace(redirectPath);
            // Opcional: forzar recarga tras redirección para limpiar otros hooks
            setTimeout(() => window.location.reload(), 100);
        } else {
            // Si no hay redirección (como pides), refrescamos la página actual.
            // Esto hará que usePedidoForm vuelva a leer el localStorage vacío y se bloquee.
            window.location.reload();
        }
    };

    return { isLoggedIn, userNick, logout };
}
