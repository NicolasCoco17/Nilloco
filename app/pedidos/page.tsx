// app/pedidos/page.tsx
'use client';

import PedidoForm from "@/components/PedidoForm";
import Header from '@/components/Header';

export default function PedidosPage() {
    return (
        <>
            <Header /> 

            {/* Ajuste de márgenes:
                - pt-16: Para compensar la altura del Header fijo.
                - lg:ml-64: Para compensar el ancho del menú lateral.
                - lg:pt-0: Se restablece el padding superior en escritorio.
            */}
            <main className="min-h-screen flex flex-col items-center justify-center 
                             pt-16 lg:pt-0 
                             sm:px-4 md:px-6 lg:px-16 
                             bg-[url('/NILLOCO_ONLINE[1].png')] bg-cover bg-center 
                             sm:bg-auto sm:bg-top md:bg-contain md:bg-top lg:bg-cover lg:bg-center">
                {/* Contenido centrado dentro del área de la página */}
                <div className="p-4 w-full max-w-4xl flex items-center justify-center">
                    <PedidoForm />
                </div>
            </main>
        </>
    );
}
