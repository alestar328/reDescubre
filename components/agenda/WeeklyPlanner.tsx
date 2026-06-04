"use client";

import { useState } from "react";
import type { AgendaItemView } from "@/lib/supabase/queries";
import DayColumn from "./DayColumn";
import EmptyState from "@/components/common/EmptyState";

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

interface WeeklyPlannerProps {
  items: AgendaItemView[];
  onRemove?: (id: string) => void;
}

function toLocalISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function WeeklyPlanner({ items, onRemove }: WeeklyPlannerProps) {
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [activeTab, setActiveTab] = useState(0); // for mobile

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  function getItemsForDay(date: Date): AgendaItemView[] {
    const dateStr = toLocalISODate(date);
    return items.filter((item) => item.date === dateStr);
  }

  const weekLabel = `${weekStart.getDate()} ${weekStart.toLocaleString("es-ES", { month: "long" })} – ${addDays(weekStart, 6).getDate()} ${addDays(weekStart, 6).toLocaleString("es-ES", { month: "long" })}`;

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          className="flex items-center gap-1 text-sm font-medium text-ink-light hover:text-ink transition-colors px-3 py-2 rounded-lg hover:bg-sand"
        >
          ← Anterior
        </button>
        <span className="text-sm font-medium text-ink capitalize">{weekLabel}</span>
        <button
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          className="flex items-center gap-1 text-sm font-medium text-ink-light hover:text-ink transition-colors px-3 py-2 rounded-lg hover:bg-sand"
        >
          Siguiente →
        </button>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid md:grid-cols-7 gap-2">
        {days.map((day, i) => {
          const dayItems = getItemsForDay(day);
          const isToday = day.getTime() === today.getTime();
          return (
            <DayColumn
              key={i}
              dayName={DAY_NAMES[i]}
              date={day}
              items={dayItems}
              isToday={isToday}
              onRemove={onRemove}
            />
          );
        })}
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {days.map((day, i) => {
            const dayItems = getItemsForDay(day);
            const isToday = day.getTime() === today.getTime();
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-colors ${
                  activeTab === i
                    ? "bg-primary text-white"
                    : isToday
                    ? "bg-primary/10 text-primary"
                    : "bg-card border border-border text-ink-light"
                }`}
              >
                <span className="text-xs font-semibold">{DAY_NAMES[i]}</span>
                <span className="text-sm font-bold">{day.getDate()}</span>
                {dayItems.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-current mt-0.5 opacity-60" />
                )}
              </button>
            );
          })}
        </div>

        {/* Single day view */}
        {(() => {
          const day = days[activeTab];
          const dayItems = getItemsForDay(day);
          const isToday = day.getTime() === today.getTime();
          if (dayItems.length === 0) {
            return (
              <EmptyState
                title="Día libre"
                description="No hay actividades programadas. ¡Añade una!"
                actionLabel="Explorar actividades"
                actionHref="/actividades"
                icon="☀️"
              />
            );
          }
          return (
            <DayColumn
              dayName={DAY_NAMES[activeTab]}
              date={day}
              items={dayItems}
              isToday={isToday}
              onRemove={onRemove}
            />
          );
        })()}
      </div>
    </div>
  );
}
