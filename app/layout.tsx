import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";

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
        
        {/* ELIMINAMOS el div que tenía "hidden lg:block" */}
        <Sidebar />

        {/* Ajustamos el main: 
          - ml-0 por defecto (móvil)
          - lg:ml-64 solo en pantallas grandes para dejar espacio al menú fijo
        */}
        <main className="min-h-screen lg:ml-64 transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
