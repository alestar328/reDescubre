"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, ArrowRight, Loader2 } from "lucide-react";
import WeeklyPlanner from "@/components/agenda/WeeklyPlanner";
import AddToCalendarSheet from "@/components/calendar/AddToCalendarSheet";
import { categories } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import {
  getAgendaItems,
  removeAgendaItem,
  type AgendaItemView,
} from "@/lib/supabase/queries";
import type { CalendarEvent } from "@/lib/calendar/calendar-export";

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.max(0, eh * 60 + em - (sh * 60 + sm));
}

export default function AgendaClient() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [items, setItems] = useState<AgendaItemView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarEvent, setCalendarEvent] = useState<CalendarEvent | null>(null);

  // Redirigir al login si no hay sesión
  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth/login");
  }, [authLoading, user, router]);

  // Cargar agenda del usuario
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    getAgendaItems(supabase, user.id).then((data) => {
      setItems(data);
      setIsLoading(false);
    });
  }, [user]);

  async function handleRemove(id: string) {
    // Optimista: quitar de la UI y borrar en la BD
    const prev = items;
    setItems((curr) => curr.filter((i) => i.id !== id));
    const supabase = createClient();
    const { error } = await removeAgendaItem(supabase, id);
    if (error) setItems(prev); // revertir si falla
  }

  function handleAddToCalendar(item: AgendaItemView) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/actividades/${item.activityId}`
        : undefined;
    setCalendarEvent({
      title: item.activityTitle,
      description: item.activityDescription,
      location: item.location || undefined,
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      url,
    });
  }

  if (authLoading || isLoading || !user) {
    return (
      <div className="pt-16 min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-ink-light" />
      </div>
    );
  }

  // Datos de cabecera: para beneficiary mostramos la persona a cargo
  const headerName = user.beneficiary?.name ?? user.displayName;
  const headerAge = user.beneficiary?.age;

  // Resumen
  const total = items.length;
  const totalMinutes = items.reduce(
    (acc, it) => acc + minutesBetween(it.startTime, it.endTime),
    0
  );
  const totalHours = Math.round(totalMinutes / 60);
  const usedCategoryIds = [...new Set(items.map((i) => i.categoryId).filter(Boolean))];
  const usedCategories = categories.filter((c) => usedCategoryIds.includes(c.id));
  const isBalanced = usedCategoryIds.length >= 3;

  return (
    <div className="pt-16 min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-sand border-b border-border">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h1 className="font-display font-extrabold text-3xl text-ink">Mi Agenda</h1>
              </div>
              <p className="text-ink-light">
                Hola, <span className="font-semibold text-ink">{headerName}</span>
                {headerAge ? ` · ${headerAge} años` : ""}
              </p>
            </div>
            <Link
              href="/actividades"
              className="inline-flex items-center gap-2 bg-primary text-white font-medium px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors text-sm self-start sm:self-auto"
            >
              <span>+ Explorar actividades</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Planner */}
          <div className="flex-1 min-w-0">
            <WeeklyPlanner
              items={items}
              onRemove={handleRemove}
              onAddToCalendar={handleAddToCalendar}
            />
          </div>

          {/* Summary sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h2 className="font-display font-bold text-base text-ink">Resumen semanal</h2>

              <div className="flex gap-4">
                <div className="flex-1 bg-sand rounded-xl p-3 text-center">
                  <p className="text-2xl font-display font-extrabold text-ink">{total}</p>
                  <p className="text-xs text-ink-light mt-0.5">actividades</p>
                </div>
                <div className="flex-1 bg-sand rounded-xl p-3 text-center">
                  <p className="text-2xl font-display font-extrabold text-ink">{totalHours}h</p>
                  <p className="text-xs text-ink-light mt-0.5">de actividad</p>
                </div>
              </div>

              {usedCategories.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-ink-light mb-2">Categorías</p>
                  <div className="flex flex-wrap gap-1.5">
                    {usedCategories.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: cat.bgColor, color: cat.textColor }}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isBalanced && (
                <div
                  className="flex items-start gap-2 rounded-xl p-3"
                  style={{ backgroundColor: "#f0fdf4", borderColor: "#86efac" }}
                >
                  <span className="text-lg">🌟</span>
                  <p className="text-xs" style={{ color: "#15803d" }}>
                    ¡Semana equilibrada! Tienes variedad de actividades y tiempo para descansar.
                  </p>
                </div>
              )}

              <Link
                href="/actividades"
                className="flex items-center justify-center gap-2 w-full text-sm font-medium bg-primary text-white py-2.5 rounded-full hover:bg-primary-dark transition-colors"
              >
                Explorar más actividades
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Legend */}
            <div className="mt-4 bg-card border border-border rounded-2xl p-4 space-y-2">
              <p className="text-xs font-semibold text-ink-light uppercase tracking-wide mb-3">
                Leyenda
              </p>
              <div className="flex items-center gap-2 text-xs text-ink-light">
                <div className="w-4 h-4 rounded border-2 border-dashed border-ink-light" />
                Planificada
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-light">
                <div className="w-4 h-4 rounded border-2 border-primary bg-primary/10" />
                Confirmada
              </div>
              <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                <p className="text-xs font-semibold text-ink-light uppercase tracking-wide mb-2">
                  Carga diaria
                </p>
                {[
                  { color: "#E8E4DC", label: "Sin actividades" },
                  { color: "#22C55E", label: "1 actividad — ideal" },
                  { color: "#F59E0B", label: "2 actividades — bien" },
                  { color: "#EF4444", label: "3+ — demasiado" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-ink-light">
                    <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <AddToCalendarSheet
        event={calendarEvent}
        onClose={() => setCalendarEvent(null)}
      />
    </div>
  );
}
