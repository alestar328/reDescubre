/**
 * ⚠️ DEMO-MOCK — Actividades y proveedores HARDCODEADOS solo para presentación.
 *
 * Sirve para que el catálogo tenga contenido rico durante las demos, conviviendo
 * con las actividades reales de Supabase. Cada actividad se marca con `isMock`.
 *
 * 🧹 CÓMO QUITARLO TODO MÁS TARDE:
 *   1. Borra este archivo (`lib/mock-showcase.ts`).
 *   2. Elimina las líneas marcadas con "DEMO-MOCK" en:
 *        - app/actividades/page.tsx
 *        - app/actividades/[id]/page.tsx
 *   3. (Opcional) Quita el badge "Demo" marcado con "DEMO-MOCK" en
 *        components/activities/ActivityCard.tsx
 *        components/activities/ActivityDetailClient.tsx
 *   4. (Opcional) Quita el campo `isMock` del tipo Activity en lib/mock-data.ts.
 *
 * Buscar "DEMO-MOCK" en el proyecto lista todos los puntos a revertir.
 */

import {
  activities as rawMockActivities,
  providers as mockProviders,
  type Activity,
  type Provider,
} from "@/lib/mock-data";

/** Actividades mock etiquetadas (isMock) para distinguirlas de las reales. */
export const showcaseActivities: Activity[] = rawMockActivities.map((a) => ({
  ...a,
  isMock: true,
}));

export function getShowcaseActivityById(id: string): Activity | undefined {
  return showcaseActivities.find((a) => a.id === id);
}

export function getShowcaseProviderById(id: string): Provider | undefined {
  return mockProviders.find((p) => p.id === id);
}

/** Une las actividades reales con las de presentación (reales primero). */
export function withShowcase(dbActivities: Activity[]): Activity[] {
  return [...dbActivities, ...showcaseActivities];
}
