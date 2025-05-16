
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a professional sans-serif font
import './globals.css';
import { AuthProvider } from '@/contexts/AuthProvider';
import { DataProvider } from '@/contexts/DataProvider';
import { Toaster } from "@/components/ui/toaster"; // ShadCN Toaster

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SGAD-Baxtech',
  description: 'Sistema de Gestión de Asistencia Docente - Baxtech.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <DataProvider>
            {children}
            <Toaster />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
