"use client";

import { X, CalendarPlus } from "lucide-react";
import AddToCalendarMenu from "./AddToCalendarMenu";
import type { CalendarEvent } from "@/lib/calendar/calendar-export";

interface AddToCalendarSheetProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

/** Hoja modal reutilizable para exportar un evento de la agenda a un calendario. */
export default function AddToCalendarSheet({
  event,
  onClose,
}: AddToCalendarSheetProps) {
  if (!event) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-slide-up max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2 min-w-0">
              <CalendarPlus className="w-5 h-5 text-primary shrink-0" />
              <h2 className="font-display font-bold text-ink truncate">
                Añadir al calendario
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-light hover:text-ink hover:bg-sand transition-colors shrink-0"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <p className="text-base font-display font-bold text-ink">
                {event.title}
              </p>
              <p className="text-sm text-ink-light capitalize">
                {new Date(`${event.date}T00:00:00`).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                {" · "}
                {event.startTime}–{event.endTime}
              </p>
            </div>
            <AddToCalendarMenu event={event} onPicked={() => onClose()} />
          </div>
        </div>
      </div>
    </>
  );
}
