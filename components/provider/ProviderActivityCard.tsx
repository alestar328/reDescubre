"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, MapPin, Edit2, Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Activity } from "@/lib/mock-data";
import { categories } from "@/lib/mock-data";
import CategoryBadge from "@/components/common/CategoryBadge";
import PriceBadge from "@/components/common/PriceBadge";
import { createClient } from "@/lib/supabase/client";
import { toggleActivityPublished, deleteActivity } from "@/lib/supabase/queries";

interface Props {
  activity: Activity;
}

export default function ProviderActivityCard({ activity }: Props) {
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(activity.isPublished ?? true);
  const [isToggling, setIsToggling] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const category = categories.find((c) => c.id === activity.categoryId);

  async function handleToggle() {
    if (isToggling) return;
    setIsToggling(true);
    const next = !isPublished;

    const supabase = createClient();
    const { error } = await toggleActivityPublished(supabase, activity.id, next);

    if (!error) {
      setIsPublished(next);
    }
    setIsToggling(false);
  }

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true);

    const supabase = createClient();
    const { error } = await deleteActivity(supabase, activity.id);

    if (!error) {
      router.refresh();
    } else {
      setIsDeleting(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden transition-opacity ${isPublished ? "border-border" : "border-border/50 opacity-70"}`}>
      {/* Imagen */}
      <div className="relative h-36 bg-sand">
        {activity.imagePath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activity.imagePath}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: activity.imageColor + "33" }}
          />
        )}
        {!isPublished && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-medium text-ink-light bg-white/80 px-2.5 py-1 rounded-full border border-border">
              Oculta
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-sm text-ink leading-tight line-clamp-2">
            {activity.title}
          </h3>
          <PriceBadge priceLabel={activity.priceLabel} priceType={activity.priceType} />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-light">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {activity.durationMin} min
          </span>
          {activity.neighborhood && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {activity.neighborhood}
            </span>
          )}
          {category && <CategoryBadge categoryId={activity.categoryId} />}
        </div>

        {/* Horarios */}
        <p className="text-xs text-ink-light">
          {activity.schedules.length} {activity.schedules.length === 1 ? "horario" : "horarios"} disponibles
        </p>

        {/* Acciones */}
        {confirmingDelete ? (
          <div className="flex items-center gap-2 pt-1 border-t border-border">
            <span className="flex-1 text-xs font-medium text-ink py-1.5">
              ¿Eliminar esta actividad?
            </span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors py-1.5 px-3 rounded-lg focus:outline-none disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Eliminar"
              )}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={isDeleting}
              className="text-xs font-medium text-ink-light hover:text-ink transition-colors py-1.5 px-3 rounded-lg hover:bg-sand focus:outline-none disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-1 border-t border-border">
            <Link
              href={`/proveedor/actividades/${activity.id}/editar`}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-ink hover:text-primary transition-colors py-1.5 rounded-lg hover:bg-primary/5 focus:outline-none"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </Link>

            <button
              type="button"
              onClick={handleToggle}
              disabled={isToggling}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-ink-light hover:text-ink transition-colors py-1.5 rounded-lg hover:bg-sand focus:outline-none disabled:opacity-50"
            >
              {isToggling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isPublished ? (
                <><EyeOff className="w-3.5 h-3.5" /> Ocultar</>
              ) : (
                <><Eye className="w-3.5 h-3.5" /> Publicar</>
              )}
            </button>

            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              aria-label="Eliminar actividad"
              className="flex items-center justify-center text-ink-light hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 focus:outline-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
