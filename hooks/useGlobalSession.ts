// hooks/useGlobalSession.ts

'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useGlobalSession() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
    const [userNick, setUserNick] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // 1. Verificar sesión en localStorage
        const tel = localStorage.getItem("userTelefono");
        const nick = localStorage.getItem("userNick");
        
        if (tel && nick) {
            setIsLoggedIn(true);
            setUserNick(nick);
        } else {
            setIsLoggedIn(false);
            setUserNick(null);
        }
    }, []); // Se ejecuta solo al montar

    // MODIFICACIÓN: Acepta un path de redirección opcional. Si es null, no redirige.
    const logout = (redirectPath: string | null = '/') => { 
        // Limpieza de todos los ítems de sesión y borrador
        localStorage.removeItem("userTelefono");
        localStorage.removeItem("userNick");
        localStorage.removeItem("draftPedido");
        
        // 2. Forzar la actualización del estado del hook
        setIsLoggedIn(false);
        setUserNick(null);

        // 3. Redirección condicional
        if (redirectPath) {
            // Usa replace para evitar que la página de login esté en el historial
            router.replace(redirectPath);
        }
        
        // Nota: Si solo limpias el estado local sin recargar o redirigir,
        // la página actual (ej. /pedidos) se quedará mostrando la vista de no logueado.
    };

    return { isLoggedIn, userNick, logout };
}
