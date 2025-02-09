import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import { ThemeProvider } from "@/lib/theme-provider";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emre Can Öner - Software Developer",
  description: "Personal website and blog of Emre Can Öner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <div className="bg-background">
            <Navbar />
            <ScrollProgress />
            <main className="min-h-screen">
              {children}
            </main>
            <BackToTop />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
