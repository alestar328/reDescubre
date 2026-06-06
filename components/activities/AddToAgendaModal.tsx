"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { X, CalendarDays, Clock3, LogIn, Loader2, CheckCircle2 } from "lucide-react";
import { Activity } from "@/lib/mock-data";
import Toast from "@/components/common/Toast";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { addAgendaItem } from "@/lib/supabase/queries";
import AddToCalendarMenu from "@/components/calendar/AddToCalendarMenu";
import type { CalendarEvent } from "@/lib/calendar/calendar-export";

interface AddToAgendaModalProps {
  activity: Activity;
  isOpen: boolean;
  onClose: () => void;
}

const WEEKDAY_TO_DOW: Record<string, number> = {
  Domingo: 0,
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sábado: 6,
};

const TIME_STEP_MIN = 30; // granularidad de los horarios de inicio en franjas flexibles

function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function toHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Próximas `count` fechas (desde hoy, incluido) cuyo día de la semana es `dow`. */
function upcomingDatesForWeekday(dow: number, count: number): Date[] {
  const result: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 90 && result.length < count; i++) {
    if (d.getDay() === dow) result.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return result;
}

export default function AddToAgendaModal({
  activity,
  isOpen,
  onClose,
}: AddToAgendaModalProps) {
  const { user } = useAuth();

  const [slotIdx, setSlotIdx] = useState(0);
  const [selectedDate, setSelectedDate] = useState(""); // ISO "YYYY-MM-DD"
  const [startMin, setStartMin] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [savedEvent, setSavedEvent] = useState<CalendarEvent | null>(null);

  const slot = activity.schedules[slotIdx];

  // Fechas disponibles para el día de la semana de la franja elegida
  const dates = useMemo(() => {
    if (!slot) return [];
    const dow = WEEKDAY_TO_DOW[slot.weekday];
    if (dow === undefined) return [];
    return upcomingDatesForWeekday(dow, 6);
  }, [slot]);

  // Horas de inicio posibles dentro de una ventana flexible
  const startOptions = useMemo(() => {
    if (!slot?.isFlexible) return [];
    const s = toMin(slot.startTime);
    const e = toMin(slot.endTime);
    const dur = activity.durationMin;
    const opts: number[] = [];
    for (let t = s; t + dur <= e; t += TIME_STEP_MIN) opts.push(t);
    if (opts.length === 0) opts.push(s); // la actividad ocupa toda la ventana
    return opts;
  }, [slot, activity.durationMin]);

  if (!isOpen) return null;

  function selectSlot(i: number) {
    setSlotIdx(i);
    setSelectedDate("");
    setStartMin(null);
    setError(null);
  }

  function computeTimes(): { start: string; end: string } {
    if (slot.isFlexible) {
      const s = startMin ?? startOptions[0] ?? toMin(slot.startTime);
      const end = Math.min(s + activity.durationMin, toMin(slot.endTime));
      return { start: toHHMM(s), end: toHHMM(end) };
    }
    return { start: slot.startTime, end: slot.endTime };
  }

  async function handleConfirm() {
    if (!user || !selectedDate || !slot) return;
    setIsSaving(true);
    setError(null);

    const { start, end } = computeTimes();
    const supabase = createClient();
    const { error: insertError } = await addAgendaItem(supabase, {
      user_id: user.id,
      activity_id: activity.id,
      date: selectedDate,
      start_time: start,
      end_time: end,
    });

    setIsSaving(false);

    if (insertError) {
      // 23505 = clave única (user, activity, date) → ya estaba agendada ese día
      setError(
        insertError.code === "23505"
          ? "Ya tienes esta actividad agendada ese día."
          : "No se pudo añadir a tu agenda. Inténtalo de nuevo."
      );
      return;
    }

    setShowToast(true);

    // Mostrar las opciones de calendario externo en lugar de cerrar.
    const location = [activity.location, activity.neighborhood, activity.city]
      .filter(Boolean)
      .join(", ");
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/actividades/${activity.id}`
        : undefined;
    setSavedEvent({
      title: activity.title,
      description: activity.description,
      location: location || undefined,
      date: selectedDate,
      startTime: start,
      endTime: end,
      url,
    });
  }

  function handleClose() {
    onClose();
    setShowToast(false);
    setSavedEvent(null);
    setSelectedDate("");
    setStartMin(null);
    setSlotIdx(0);
  }

  const canConfirm = !!user && !!selectedDate && !!slot && !isSaving;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-slide-up max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-ink">
                {savedEvent ? "¡Añadida a tu agenda!" : "Añadir a mi agenda"}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-ink-light hover:text-ink hover:bg-sand transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {savedEvent ? (
              <div className="space-y-5">
                <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-200 p-3.5">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold">{activity.title}</p>
                    <p className="text-green-700">
                      {new Date(`${savedEvent.date}T00:00:00`).toLocaleDateString(
                        "es-ES",
                        { weekday: "long", day: "numeric", month: "long" }
                      )}
                      {" · "}
                      {savedEvent.startTime}–{savedEvent.endTime}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-ink mb-1">
                    Añádela también a tu calendario
                  </p>
                  <p className="text-xs text-ink-light mb-3">
                    Recibe un recordatorio en tu móvil el día de la actividad.
                  </p>
                  <AddToCalendarMenu event={savedEvent} />
                </div>
              </div>
            ) : (
              <>
            <div>
              <p className="text-sm font-medium text-ink mb-1">Actividad</p>
              <p className="text-base font-display font-bold text-ink">{activity.title}</p>
            </div>

            {!user ? (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm text-ink-light">
                  Inicia sesión para guardar esta actividad en tu agenda.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar sesión
                </Link>
              </div>
            ) : activity.schedules.length === 0 ? (
              <p className="text-sm text-ink-light py-3 text-center bg-sand rounded-xl border border-border border-dashed">
                Esta actividad aún no tiene horarios disponibles.
              </p>
            ) : (
              <>
                {/* 1. Elegir franja (día + horario del proveedor) */}
                <div>
                  <p className="text-sm font-medium text-ink mb-1.5">
                    Horario {activity.schedules.length > 1 ? "(elige uno)" : ""}
                  </p>
                  <div className="flex flex-col gap-2">
                    {activity.schedules.map((s, i) => (
                      <button
                        key={`${s.weekday}-${s.startTime}-${s.endTime}-${i}`}
                        onClick={() => selectSlot(i)}
                        className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm border transition-colors text-left ${
                          slotIdx === i
                            ? "bg-primary/5 border-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="font-medium text-ink">{s.weekday}</span>
                        <span className="flex items-center gap-1.5 text-ink-light">
                          <Clock3 className="w-3.5 h-3.5" />
                          {s.startTime}–{s.endTime}
                          {s.isFlexible && (
                            <span className="ml-1 text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                              flexible
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Elegir fecha (solo días que coinciden con la franja) */}
                <div>
                  <p className="text-sm font-medium text-ink mb-1.5">Fecha</p>
                  <div className="grid grid-cols-3 gap-2">
                    {dates.map((d) => {
                      const iso = toISODate(d);
                      const label = d.toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      });
                      return (
                        <button
                          key={iso}
                          onClick={() => setSelectedDate(iso)}
                          className={`px-2 py-2 rounded-xl text-xs font-medium border transition-colors capitalize ${
                            selectedDate === iso
                              ? "bg-primary text-white border-primary"
                              : "border-border text-ink-light hover:border-primary hover:text-primary"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Hora dentro del rango (solo si la franja es flexible) */}
                {slot?.isFlexible ? (
                  <div>
                    <p className="text-sm font-medium text-ink mb-1.5">
                      Hora de inicio
                      <span className="text-ink-light font-normal">
                        {" "}· duración {activity.durationMin} min
                      </span>
                    </p>
                    <select
                      value={(startMin ?? startOptions[0] ?? "").toString()}
                      onChange={(e) => setStartMin(parseInt(e.target.value, 10))}
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {startOptions.map((t) => {
                        const end = Math.min(t + activity.durationMin, toMin(slot.endTime));
                        return (
                          <option key={t} value={t}>
                            {toHHMM(t)} – {toHHMM(end)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : (
                  slot && (
                    <p className="text-sm text-ink-light flex items-center gap-1.5">
                      <Clock3 className="w-3.5 h-3.5" />
                      Sesión de {slot.startTime} a {slot.endTime}
                    </p>
                  )
                )}

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    {error}
                  </p>
                )}
              </>
            )}
              </>
            )}
          </div>

          {/* Footer */}
          {savedEvent ? (
            <div className="p-5 pt-0">
              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Listo
              </button>
            </div>
          ) : (
            user &&
            activity.schedules.length > 0 && (
              <div className="p-5 pt-0 flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-full border border-border text-sm font-medium text-ink-light hover:bg-sand transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirmar
                </button>
              </div>
            )
          )}
        </div>
      </div>

      <Toast
        message={`"${activity.title}" añadida a tu agenda ✓`}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
