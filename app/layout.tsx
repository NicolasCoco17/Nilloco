import "./globals.css";
import { Inter } from "next/font/google";

/*import Header from "@/components/Header";*/
import Sidebar from "@/components/Sidebar";
/*import FloatingCats from "@/components/FloatingCats";*/

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
      <body className={`font-sans ${inter.className} bg-gray-900`}>
        
        {/* Sidebar solo en desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Contenido principal */}
        <main className="min-h-screen lg:ml-64 p-4 transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}

