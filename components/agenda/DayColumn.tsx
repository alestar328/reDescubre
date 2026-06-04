"use client";

import { Plus, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getCategoryById } from "@/lib/mock-data";
import type { AgendaItemView } from "@/lib/supabase/queries";
import ActivityChip from "./ActivityChip";
import { cn } from "@/lib/utils";

interface DayColumnProps {
  dayName: string;
  date: Date;
  items: AgendaItemView[];
  isToday?: boolean;
  onRemove?: (id: string) => void;
}

function LoadBar({ count }: { count: number }) {
  const color =
    count === 0
      ? "#E8E4DC"
      : count === 1
      ? "#22C55E"
      : count === 2
      ? "#F59E0B"
      : "#EF4444";

  const width = count === 0 ? "0%" : count === 1 ? "50%" : count === 2 ? "80%" : "100%";

  return (
    <div className="h-1 bg-border rounded-full overflow-hidden mt-1">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ backgroundColor: color, width }}
      />
    </div>
  );
}

export default function DayColumn({ dayName, date, items, isToday, onRemove }: DayColumnProps) {
  const overloaded = items.length >= 3;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border transition-colors",
        isToday ? "border-primary bg-primary/5" : "border-border bg-card"
      )}
    >
      {/* Day header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                isToday ? "text-primary" : "text-ink-light"
              )}
            >
              {dayName}
            </p>
            <p className={cn("text-lg font-display font-bold", isToday ? "text-primary" : "text-ink")}>
              {date.getDate()}
            </p>
          </div>
          {overloaded && (
            <span title="Puede ser demasiado para un día">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </span>
          )}
        </div>
        <LoadBar count={items.length} />
      </div>

      {/* Activity chips */}
      <div className="flex flex-col gap-1.5 px-2 pb-2 flex-1">
        {items.map((item) => {
          const category = getCategoryById(item.categoryId);
          return (
            <ActivityChip
              key={item.id}
              title={item.activityTitle}
              startTime={item.startTime}
              endTime={item.endTime}
              color={category?.color ?? "#FF5C35"}
              bgColor={category?.bgColor ?? "#FFE8E0"}
              status={item.status}
              onRemove={onRemove ? () => onRemove(item.id) : undefined}
            />
          );
        })}

        {/* Add slot */}
        <Link
          href="/actividades"
          className="flex items-center gap-1 text-xs text-ink-light hover:text-primary transition-colors mt-1 px-1 py-1 rounded-lg hover:bg-sand min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir</span>
        </Link>
      </div>
    </div>
  );
}
