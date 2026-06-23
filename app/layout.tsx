import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "./providers";
import { buildOrganizationSchema, SITE_URL } from "@/lib/json-ld";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Re-descubre app — Actividades para jóvenes en Barcelona",
    template: "%s — Re-descubre app",
  },
  description:
    "Descubre actividades presenciales saludables para jóvenes de 12 a 25 años en Barcelona. Paddle surf, teatro, robótica, escalada y mucho más. Menos pantallas, más vida.",
  keywords: [
    "actividades Barcelona jóvenes",
    "ocio saludable adolescentes",
    "alternativas pantallas jóvenes",
    "actividades extraescolares Barcelona",
    "agenda semanal jóvenes",
    "clases deporte Barcelona",
    "talleres creativos Barcelona",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "Re-descubre app",
    title: "Re-descubre app — Actividades para jóvenes en Barcelona",
    description:
      "Descubre actividades presenciales saludables para jóvenes de 12 a 25 años en Barcelona. Menos pantallas, más vida.",
    images: [
      {
        url: "/img/paddelSurf_cover.jpg",
        width: 1200,
        height: 630,
        alt: "Paddle surf en Barcelona — Re-descubre app",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Re-descubre app — Actividades para jóvenes en Barcelona",
    description: "Descubre actividades presenciales saludables para jóvenes en Barcelona.",
    images: ["/img/paddelSurf_cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${plusJakarta.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-body bg-surface text-ink">
        {/* Schema Organization: describe la plataforma a los crawlers de IA y buscadores */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
        />
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
