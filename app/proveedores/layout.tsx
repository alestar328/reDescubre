// Layout de segment para la página de proveedores.
// Exporta metadata desde aquí porque page.tsx es un Client Component.
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Para proveedores",
  description:
    "¿Tienes una academia, escuela o taller en Barcelona? Publica tus actividades en Re-descubre app y llega a miles de jóvenes que buscan exactamente lo que ofreces. Sin comisión en fase beta.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/proveedores`,
    title: "Para proveedores — Re-descubre app",
    description:
      "Publica tus actividades y llega a jóvenes de Barcelona que buscan exactamente lo que ofreces. Gratis en fase beta.",
    images: [{ url: "/img/kayak_cover.jpg", width: 1200, height: 630 }],
  },
  keywords: [
    "publicar actividades Barcelona",
    "academia Barcelona jóvenes",
    "talleres Barcelona",
    "escuela deportes Barcelona",
    "proveedor actividades jóvenes",
  ],
};

export default function ProveedoresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
