/**
 * Server Component — puede exportar `metadata` y schemas JSON-LD.
 * Carga actividades desde Supabase; cae back a mock-data si la BD está vacía.
 */
import type { Metadata } from "next";
import type { Activity } from "@/lib/mock-data";
import { buildItemListSchema, SITE_URL } from "@/lib/json-ld";
import { createClient } from "@/lib/supabase/server";
import { getPublishedActivities } from "@/lib/supabase/queries";
import { withShowcase } from "@/lib/mock-showcase"; // DEMO-MOCK
import CatalogoClient from "./catalogo-client";

export const metadata: Metadata = {
  title: "Actividades en Barcelona",
  description:
    "Explora el catálogo completo de actividades presenciales para jóvenes de 12 a 25 años en Barcelona. Filtra por categoría, precio, duración y día de la semana.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/actividades`,
    title: "Actividades en Barcelona — Despeja tu mente",
    description:
      "Catálogo de actividades presenciales saludables para jóvenes en Barcelona: paddle surf, teatro, robótica, escalada y mucho más.",
    images: [{ url: "/img/kayak_cover.jpg", width: 1200, height: 630 }],
  },
  keywords: [
    "actividades Barcelona",
    "ocio jóvenes Barcelona",
    "paddle surf Barcelona",
    "escalada Barcelona",
    "teatro joven Barcelona",
    "clases inglés Barcelona",
    "actividades gratuitas Barcelona",
    "plan fin de semana jóvenes",
  ],
};

export default async function ActividadesPage() {
  // Cargar actividades reales desde Supabase
  let dbActivities: Activity[] = [];

  try {
    const supabase = await createClient();
    dbActivities = await getPublishedActivities(supabase);
  } catch {
    // Supabase no disponible o error de red → solo se mostrarán las de presentación
  }

  // DEMO-MOCK: combinar las reales con las actividades de presentación
  const displayActivities = withShowcase(dbActivities);

  const itemListSchema = buildItemListSchema(displayActivities);

  return (
    <>
      {/* Schema ItemList: permite a los crawlers descubrir todas las fichas de actividad */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <CatalogoClient initialActivities={displayActivities} />
    </>
  );
}
