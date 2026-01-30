// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header"; // <--- IMPORTANTE: Asegúrate de importar tu Header aquí si no lo tienes

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Toram Stateos App",
  description: "Aplicación de pedidos de stateos para gremio de Toram Online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`font-sans ${inter.className} bg-gray-900 text-white`}>
        
        {/* Header Fijo */}
        <Header />

        {/* Sidebar */}
        <Sidebar />

        {/* MAIN: 
            1. lg:ml-64 -> Deja espacio a la izquierda para la Sidebar en PC
            2. pt-16    -> IMPORTANTE: Deja espacio arriba para el Header (h-16)
        */}
        <main className="min-h-screen lg:ml-64 pt-16 transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}