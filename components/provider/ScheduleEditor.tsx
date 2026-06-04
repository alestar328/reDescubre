"use client";

import { Plus, Trash2 } from "lucide-react";

export interface ScheduleSlot {
  weekday: string;
  startTime: string;
  endTime: string;
  isFlexible?: boolean;  // true = rango disponible (el cliente elige su hora); false = sesión de hora fija
}

const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

interface ScheduleEditorProps {
  value: ScheduleSlot[];
  onChange: (slots: ScheduleSlot[]) => void;
}

// Editor de horarios: permite añadir y eliminar franjas horarias con día y hora.
export default function ScheduleEditor({ value, onChange }: ScheduleEditorProps) {
  function addSlot() {
    onChange([...value, { weekday: "Lunes", startTime: "09:00", endTime: "10:00", isFlexible: false }]);
  }

  function removeSlot(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function updateSlot(index: number, field: keyof ScheduleSlot, val: string | boolean) {
    onChange(value.map((slot, i) => (i === index ? { ...slot, [field]: val } : slot)));
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-ink">Horarios</label>

      {value.length === 0 && (
        <p className="text-sm text-ink-light py-3 text-center bg-sand rounded-xl border border-border border-dashed">
          Añade al menos un horario para tu actividad
        </p>
      )}

      <div className="space-y-2">
        {value.map((slot, i) => (
          <div key={i} className="bg-sand rounded-xl px-3 py-2.5 border border-border space-y-2.5">
            <div className="flex items-center gap-2">
              {/* Día */}
              <select
                value={slot.weekday}
                onChange={(e) => updateSlot(i, "weekday", e.target.value)}
                className="flex-1 min-w-0 bg-white border border-border rounded-lg px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {WEEKDAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              {/* Hora inicio */}
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => updateSlot(i, "startTime", e.target.value)}
                className="w-28 bg-white border border-border rounded-lg px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <span className="text-xs text-ink-light shrink-0">—</span>

              {/* Hora fin */}
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => updateSlot(i, "endTime", e.target.value)}
                className="w-28 bg-white border border-border rounded-lg px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="button"
                onClick={() => removeSlot(i)}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-ink-light hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
                aria-label="Eliminar horario"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Tipo de franja: hora fija vs. rango flexible */}
            <div className="flex items-center justify-between gap-2 pl-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!slot.isFlexible}
                  onChange={(e) => updateSlot(i, "isFlexible", e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-xs font-medium text-ink">Rango flexible</span>
              </label>
              <span className="text-xs text-ink-light text-right">
                {slot.isFlexible
                  ? "El cliente elige su hora dentro de la ventana"
                  : "Sesión de hora fija"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSlot}
        className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors focus:outline-none focus:underline"
      >
        <Plus className="w-4 h-4" />
        Añadir horario
      </button>
    </div>
  );
}
