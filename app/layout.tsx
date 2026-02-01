// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

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
        {/* Header Fijo (asegúrate de que tenga z-index alto en su CSS, ej: z-50) */}
        <Header />

        {/* Sidebar (asegúrate de que tenga z-index alto, ej: z-40) */}
        <Sidebar />

        {/* 
          WRAPPER DEL CONTENIDO:
          1. lg:ml-64: Empuja todo el contenido (Main y Footer) a la derecha en PC.
          2. flex flex-col min-h-screen: Hace que el footer se pegue al fondo si hay poco contenido.
        */}
        <div className="lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
          
          {/* MAIN CONTENT */}
          {/* pt-24 compensa el Header fijo */}
          <main className="flex-grow pt-24 px-4">
            {children}
          </main>

          {/* COPYRIGHT FOOTER */}
          <footer className="w-full py-6 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} Nilloco Online. Todos los derechos reservados.
            </p>
          </footer>
          
        </div>
      </body>
    </html>
  );
}