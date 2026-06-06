/**
 * Exportación de eventos a calendarios externos (Google, Apple, Outlook).
 *
 * Enfoque: enlaces "plantilla" + archivo `.ics` estándar (RFC 5545).
 * No usa la API de Google Calendar ni OAuth — no requiere configuración de
 * servicios y funciona también con Apple Calendar (que no tiene API web).
 *
 * Las horas se interpretan como hora local de la zona del evento (por defecto
 * Europe/Madrid, ya que las actividades son presenciales en Barcelona) y se
 * convierten a UTC para que el calendario las muestre correctamente sin
 * depender de la zona horaria del dispositivo.
 */

export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  timeZone?: string; // por defecto "Europe/Madrid"
  url?: string; // enlace a la página de la actividad
}

const DEFAULT_TZ = "Europe/Madrid";

// ---------------------------------------------------------------------------
// Conversión de hora local (zona del evento) → UTC, con DST correcto
// ---------------------------------------------------------------------------

/** Offset en ms de `timeZone` respecto a UTC en el instante `date`. */
function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  let hour = get("hour");
  if (hour === 24) hour = 0; // algunos entornos formatean medianoche como 24
  const asUTC = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    hour,
    get("minute"),
    get("second")
  );
  return asUTC - date.getTime();
}

/** Convierte una hora "de pared" en `timeZone` al instante UTC equivalente. */
function zonedWallTimeToUtc(
  dateStr: string,
  timeStr: string,
  timeZone: string
): Date {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = timeStr.split(":").map(Number);
  const naiveUtc = Date.UTC(y, mo - 1, d, h, mi, 0);
  // Aproximación inicial y un refinamiento para los bordes de cambio de hora.
  const firstOffset = getTimeZoneOffsetMs(new Date(naiveUtc), timeZone);
  const refinedOffset = getTimeZoneOffsetMs(
    new Date(naiveUtc - firstOffset),
    timeZone
  );
  return new Date(naiveUtc - refinedOffset);
}

/** Date → "YYYYMMDDTHHMMSSZ" (formato básico UTC para iCalendar / Google). */
function toUtcBasic(d: Date): string {
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function getUtcInstants(ev: CalendarEvent): { start: Date; end: Date } {
  const tz = ev.timeZone ?? DEFAULT_TZ;
  return {
    start: zonedWallTimeToUtc(ev.date, ev.startTime, tz),
    end: zonedWallTimeToUtc(ev.date, ev.endTime, tz),
  };
}

// ---------------------------------------------------------------------------
// Enlaces de calendario (Google / Outlook)
// ---------------------------------------------------------------------------

function fullDetails(ev: CalendarEvent): string {
  const parts: string[] = [];
  if (ev.description) parts.push(ev.description);
  if (ev.url) parts.push(`Ver actividad: ${ev.url}`);
  return parts.join("\n\n");
}

export function googleCalendarUrl(ev: CalendarEvent): string {
  const { start, end } = getUtcInstants(ev);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${toUtcBasic(start)}/${toUtcBasic(end)}`,
    details: fullDetails(ev),
  });
  if (ev.location) params.set("location", ev.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(ev: CalendarEvent): string {
  const { start, end } = getUtcInstants(ev);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: ev.title,
    body: fullDetails(ev),
    startdt: start.toISOString(),
    enddt: end.toISOString(),
  });
  if (ev.location) params.set("location", ev.location);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Archivo .ics (Apple Calendar, descarga universal)
// ---------------------------------------------------------------------------

/** Escapa texto para un valor iCalendar (RFC 5545 §3.3.11). */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Plegado de líneas a 75 octetos (RFC 5545 §3.1). */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let rest = line;
  chunks.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 0) {
    chunks.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  return chunks.join("\r\n");
}

function uid(ev: CalendarEvent): string {
  const seed = `${ev.date}-${ev.startTime}-${ev.title}`.replace(/\s+/g, "");
  // base36 de un hash simple, suficiente para un UID estable por evento
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return `${Math.abs(h).toString(36)}-${Date.now().toString(36)}@re-descubre`;
}

export function buildICS(ev: CalendarEvent): string {
  const { start, end } = getUtcInstants(ev);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Re-descubre//Agenda//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid(ev)}`,
    `DTSTAMP:${toUtcBasic(new Date())}`,
    `DTSTART:${toUtcBasic(start)}`,
    `DTEND:${toUtcBasic(end)}`,
    `SUMMARY:${escapeICS(ev.title)}`,
  ];
  const details = fullDetails(ev);
  if (details) lines.push(`DESCRIPTION:${escapeICS(details)}`);
  if (ev.location) lines.push(`LOCATION:${escapeICS(ev.location)}`);
  if (ev.url) lines.push(`URL:${escapeICS(ev.url)}`);
  lines.push("STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR");
  return lines.map(foldLine).join("\r\n");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 50);
}

/** Descarga el evento como archivo .ics (Apple Calendar y resto de apps). */
export function downloadICS(ev: CalendarEvent, filename?: string): void {
  const ics = buildICS(ev);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? `${slugify(ev.title) || "evento"}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
