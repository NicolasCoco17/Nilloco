// hooks/usePedidoForm.ts

'use client'
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { statersDisponibles } from "@/lib/staters";

// Definición de tipos para el formulario de pedido
type PedidoFormType = {
  nombre: string;
  tipo: "Normal" | "Mensual";
  categoria: "Arma" | "Armadura";
  stats: string;
  comentarios: string;
  pot: number | string;
};

export function usePedidoForm() {
    const [puedeHacerMensual, setPuedeHacerMensual] = useState(true);
    // Cambiado a null para que PedidoForm.tsx muestre el estado de "Cargando"
    const [telefono, setTelefono] = useState<string | null>(undefined); 
    const [nick, setNick] = useState<string | null>(undefined);
    
    const [form, setForm] = useState<PedidoFormType>({
      nombre: "",
      tipo: "Normal",
      categoria: "Arma",
      stats: "",
      comentarios: "",
      pot: "",
    });
    
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // 1. Cargar datos del usuario y restaurar borrador
    useEffect(() => {
        const tel = localStorage.getItem("userTelefono");
        const nk = localStorage.getItem("userNick");
        const mensual = localStorage.getItem("puedeHacerMensual") === "true";

        // Cargar sesión si existe (SIN REDIRECCIÓN AQUÍ)
        if (tel && nk) {
            setTelefono(tel);
            setNick(nk);
            setPuedeHacerMensual(mensual);
        } else {
            setTelefono(null); // Establecer a null si no hay sesión
            setNick(null);
            setPuedeHacerMensual(false); 
        }

        // Restaurar formulario (se ejecuta y guarda el progreso sin importar si hay sesión)
        const saved = localStorage.getItem("draftPedido");
        if (saved) {
            const savedForm = JSON.parse(saved);
            setForm(prev => ({ ...prev, ...savedForm }));
        }

        // Forzar tipo Normal si Mensual no es posible
        if (!mensual && form.tipo === "Mensual") {
            setForm(prev => ({ ...prev, tipo: "Normal", nombre: "" }));
        }

    }, [router]);

    // Manejador de cambios (Guarda el borrador en localStorage en cada pulsación)
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        let finalValue: string | number = value;
        if (name === "pot" && type === "number") {
            finalValue = value === "" ? "" : Number(value);
        }
        
        if (name === "tipo" && value === "Mensual" && !puedeHacerMensual) {
            return;
        }

        const updated = { ...form, [name]: finalValue as PedidoFormType[keyof PedidoFormType] };
        setForm(updated);
        // GUARDA EL PROGRESO DEL FORMULARIO EN LOCALSTORAGE
        localStorage.setItem("draftPedido", JSON.stringify(updated)); 
    }, [form, puedeHacerMensual]);
    
    const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = { ...form, categoria: e.target.value as "Arma" | "Armadura" };
        setForm(updated);
        localStorage.setItem("draftPedido", JSON.stringify(updated));
    }, [form]);

    const handleTypeChange = useCallback((newType: "Normal" | "Mensual") => {
        if (newType === "Mensual" && !puedeHacerMensual) {
            return;
        }
        
        let updated: PedidoFormType;
        if (newType === "Mensual") {
            updated = { ...form, tipo: newType, nombre: "CocoN" };
        } else {
            updated = { ...form, tipo: newType, nombre: "" };
        }
        setForm(updated);
        localStorage.setItem("draftPedido", JSON.stringify(updated));
    }, [form, puedeHacerMensual]);

    // Manejador de cierre de sesión
    const handleLogout = useCallback(() => {
        localStorage.removeItem("userTelefono");
        localStorage.removeItem("userNick");
        localStorage.removeItem("puedeHacerMensual");
        localStorage.removeItem("draftPedido"); // Limpiar borrador al salir
        router.replace("/");
    }, [router]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");

        // *** CAMBIO CLAVE: Bloquear si no hay sesión y redirigir al login ***
        if (!telefono || !nick) {
            setMensaje("Debes Iniciar Sesión para enviar el Pedido. 🔒");
            setLoading(false);
            // Redirigir al login (raíz)
            router.push("/");
            return;
        }

        // ... (Resto de Validaciones) ...
        if (!form.nombre || !form.categoria || !form.stats) {
            setMensaje("Los campos Stater/Nombre, Categoría y Stats son obligatorios. ❌");
            setLoading(false);
            return;
        }
        
        if (form.tipo === 'Mensual' && form.nombre !== "CocoN") {
            setMensaje("Error: El tipo Mensual requiere que el stater sea CocoN. ❌");
            setLoading(false);
            return;
        }

        if (form.tipo === 'Mensual' && !puedeHacerMensual) {
            setMensaje("No puedes enviar otro pedido mensual este mes. ❌");
            setLoading(false);
            return;
        }
        
        const potValue = typeof form.pot === 'string' && form.pot === '' ? 0 : Number(form.pot);

        try {
            // Lógica de Supabase: Inserción
            const { error } = await supabase.from("stateos").insert([{
                Telefono: telefono,
                Nombre: form.nombre,
                Tipo: form.tipo,
                Categoria: form.categoria,
                Stats: form.stats,
                Stater: nick,
                Comentarios: form.comentarios,
                Fecha: new Date().toISOString(),
                Pot: potValue,
            }]);

            if (error) {
                console.error("Error al insertar pedido:", error);
                setMensaje("Error al enviar el pedido a la base de datos. ❌");
                setLoading(false);
                return;
            }
            
            setMensaje("¡Pedido enviado con éxito! ✅");
            localStorage.removeItem("draftPedido"); // Limpiar borrador al enviar con éxito
            setForm({
                nombre: "",
                tipo: puedeHacerMensual ? "Normal" : "Normal",
                categoria: "Arma",
                stats: "",
                comentarios: "",
                pot: "",
            });

        } catch (err) {
            console.error(err);
            setMensaje("Error inesperado al procesar el pedido. ❌");
        }

        setLoading(false);
    };

    return {
        form, mensaje, loading, telefono, nick,
        puedeHacerMensual, statersDisponibles,
        handleChange, handleCategoryChange, handleTypeChange,
        handleSubmit, handleLogout,
    };
}
