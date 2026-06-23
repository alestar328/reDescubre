/**
 * Helpers para generar schemas JSON-LD (Schema.org) a partir del mock data.
 * Cuando se integre Supabase, estos helpers recibirán los mismos tipos de dato
 * y no necesitarán cambios — solo actualizar los imports.
 *
 * Estándar de referencia: https://schema.org
 * Validador: https://validator.schema.org / Google Rich Results Test
 */

import type { Activity, Provider } from "./mock-data";

// Actualizar cuando el sitio esté en producción
export const SITE_URL = "https://redescubreapp.com";

// ISO 3166-1 alpha-2 para los países del mock data
const COUNTRY_CODES: Record<string, string> = {
  España: "ES",
  Perú: "PE",
};

/** Convierte minutos a duración ISO 8601 (PT90M, PT1H30M, etc.) */
export function minutesToISO8601(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `PT${h}H${m}M`;
  if (h > 0) return `PT${h}H`;
  return `PT${m}M`;
}

// ---------------------------------------------------------------------------
// Schema builders
// ---------------------------------------------------------------------------

/** Schema Organization para el sitio completo (inyectado en el layout raíz) */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Re-descubre app",
    url: SITE_URL,
    description:
      "Plataforma que conecta a jóvenes y familias con actividades presenciales saludables en Barcelona como alternativa al tiempo de pantalla.",
    areaServed: [
      { "@type": "City", name: "Barcelona", containedInPlace: { "@type": "Country", name: "España" } },
      { "@type": "City", name: "Sabadell", containedInPlace: { "@type": "Country", name: "España" } },
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Jóvenes de 12 a 25 años y sus familias",
      suggestedMinAge: 12,
      suggestedMaxAge: 25,
    },
  } as const;
}

/** Schema WebSite con SearchAction para el buscador interno (home) */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Re-descubre app",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/actividades?categoria={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  } as const;
}

/**
 * Schema Course para la ficha de detalle de cada actividad.
 * Usamos Course (y no Event) porque las actividades son recurrentes (schedules semanales).
 */
export function buildCourseSchema(activity: Activity, provider?: Provider | null) {
  const countryCode = COUNTRY_CODES[activity.country] ?? "ES";

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: activity.title,
    description: activity.description,
    url: `${SITE_URL}/actividades/${activity.id}`,
    image: activity.imagePath
      ? `${SITE_URL}${activity.imagePath}`
      : undefined,
    provider: provider
      ? {
          "@type": "Organization",
          name: provider.name,
          url: provider.website || undefined,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      price: activity.price ?? 0,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    location: {
      "@type": "Place",
      name: activity.neighborhood || activity.location,
      address: {
        "@type": "PostalAddress",
        streetAddress: activity.location,
        addressLocality: activity.city,
        addressCountry: countryCode,
      },
    },
    audience: {
      "@type": "Audience",
      suggestedMinAge: activity.minAge,
      suggestedMaxAge: activity.maxAge,
    },
    timeRequired: minutesToISO8601(activity.durationMin),
    inLanguage: "es",
  };
}

/**
 * Schema ItemList para el catálogo de actividades.
 * Permite a los crawlers descubrir todas las fichas de una sola página.
 */
export function buildItemListSchema(activityList: Activity[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Actividades presenciales en Barcelona",
    description:
      "Catálogo de actividades presenciales saludables para jóvenes de 12 a 25 años en Barcelona",
    numberOfItems: activityList.length,
    itemListElement: activityList.map((activity, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/actividades/${activity.id}`,
      name: activity.title,
    })),
  };
}
