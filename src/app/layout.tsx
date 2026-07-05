import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Red de Voluntarios",
  description:
    "Red de Voluntarios por la reconstrucción de Venezuela. Únete, dona y participa en nuestros eventos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
