"use client";

import { CalendarPlus, Apple, Download } from "lucide-react";
import {
  type CalendarEvent,
  googleCalendarUrl,
  outlookCalendarUrl,
  downloadICS,
} from "@/lib/calendar/calendar-export";

interface AddToCalendarMenuProps {
  event: CalendarEvent;
  /** Se llama tras elegir una opción (para cerrar un contenedor, mostrar toast, etc.). */
  onPicked?: (provider: "google" | "apple" | "outlook" | "ics") => void;
}

/** Logo de Google en SVG (no existe icono de marca en lucide). */
function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

const ROW =
  "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-ink rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left";

export default function AddToCalendarMenu({
  event,
  onPicked,
}: AddToCalendarMenuProps) {
  return (
    <div className="space-y-2">
      <a
        href={googleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onPicked?.("google")}
        className={ROW}
      >
        <GoogleGlyph />
        <span className="flex-1">Google Calendar</span>
        <span className="text-xs text-ink-light">Se abre en una pestaña</span>
      </a>

      <button
        type="button"
        onClick={() => {
          downloadICS(event);
          onPicked?.("apple");
        }}
        className={ROW}
      >
        <Apple className="w-4 h-4 text-ink" />
        <span className="flex-1">Apple Calendar</span>
        <span className="text-xs text-ink-light">Descarga .ics</span>
      </button>

      <a
        href={outlookCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onPicked?.("outlook")}
        className={ROW}
      >
        <CalendarPlus className="w-4 h-4 text-[#0078D4]" />
        <span className="flex-1">Outlook</span>
        <span className="text-xs text-ink-light">Se abre en una pestaña</span>
      </a>

      <button
        type="button"
        onClick={() => {
          downloadICS(event);
          onPicked?.("ics");
        }}
        className={ROW}
      >
        <Download className="w-4 h-4 text-ink-light" />
        <span className="flex-1">Descargar archivo .ics</span>
        <span className="text-xs text-ink-light">Otras apps</span>
      </button>
    </div>
  );
}
