import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://voluntariadocaba.com";
const SITE_NAME = "Red de Voluntarios en CABA por Venezuela";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Red de Voluntarios por la reconstrucción de Venezuela. Únete, dona y participa en nuestros eventos en CABA.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Red de Voluntarios por la reconstrucción de Venezuela. Únete, dona y participa en nuestros eventos en CABA.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Red de Voluntarios por la reconstrucción de Venezuela. Únete, dona y participa en nuestros eventos en CABA.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Red de Voluntarios por la reconstrucción de Venezuela. Únete, dona y participa en nuestros eventos en CABA.",
  areaServed: { "@type": "City", name: "Buenos Aires" },
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
      <head>
        <meta name="theme-color" content="#102542" />
        <link rel="canonical" href={SITE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
