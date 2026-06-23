import type { Metadata } from "next";
import AgendaClient from "@/components/agenda/AgendaClient";
import { SITE_URL } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Mi agenda semanal",
  description:
    "Organiza tus actividades semanales con el planificador de Re-descubre app. Visualiza tu semana y mantén un equilibrio saludable: máximo 2 actividades por día.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: `${SITE_URL}/agenda`,
    title: "Mi agenda semanal — Re-descubre app",
    description:
      "Planificador semanal de actividades para jóvenes. Organiza tu semana y desconecta de las pantallas.",
  },
  keywords: ["agenda actividades Barcelona", "planificador semanal jóvenes", "organizar actividades"],
};

export default function AgendaPage() {
  return <AgendaClient />;
}
