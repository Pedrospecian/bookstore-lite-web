import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// Aplica o tema salvo (ou a preferência do sistema) no <html> antes da
// hidratação, pra não piscar tema claro e depois trocar pro escuro.
const THEME_INIT_SCRIPT = `
  (function () {
    try {
      var stored = localStorage.getItem("theme");
      var theme = stored === "light" || stored === "dark"
        ? stored
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.style.colorScheme = theme;
    } catch (e) {}
  })();
`;

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Public_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Alfarrábio - Livraria",
  description: "Catálogo de livros - projeto de portfólio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
