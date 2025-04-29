import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Chaiyaphum Hospital Marathon 2025",
  description: "งานวิ่งมาราธอนการกุศล โรงพยาบาลชัยภูมิ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white`}>
        <Providers>
          <Navbar />
          <main className="flex-1 w-full pt-20">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
