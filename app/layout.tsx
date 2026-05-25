import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
  title: "Re-descubre — Actividades en Barcelona",
  description:
    "Actividades chulas para conectar contigo y con otros. Menos pantallas, más vida — agenda actividades y añádelas a tu calendario personal.",
  keywords: ["actividades Barcelona", "jóvenes", "ocio saludable", "sin pantallas", "agenda", "calendario"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${plusJakarta.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-body bg-surface text-ink">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
