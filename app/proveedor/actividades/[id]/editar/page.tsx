"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import ActivityForm, { type ActivityFormData } from "@/components/provider/ActivityForm";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import {
  getProviderByUserId,
  getActivityById,
  updateActivity,
  uploadActivityImage,
} from "@/lib/supabase/queries";
import type { Activity } from "@/lib/mock-data";
import type { InsertSchedule, UpdateActivity } from "@/lib/supabase/types";

export default function EditarActividadPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const activityId = params.id as string;

  const [activity, setActivity] = useState<Activity | null | undefined>(undefined); // undefined = cargando
  const [providerId, setProviderId] = useState<string | null>(null);

  // Cargar actividad y verificar que pertenece al proveedor autenticado
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    Promise.all([
      getProviderByUserId(supabase, user.id),
      getActivityById(supabase, activityId),
    ]).then(([provider, act]) => {
      if (!provider || !act || act.providerId !== provider.id) {
        setActivity(null); // no encontrada o no pertenece al proveedor
      } else {
        setProviderId(provider.id);
        setActivity(act);
      }
    });
  }, [user, activityId]);

  async function handleSubmit(data: ActivityFormData) {
    if (!activity || !providerId) return;

    const supabase = createClient();

    // Subir imágenes nuevas (data: URLs) y conservar URLs ya subidas
    const newImageUrls: string[] = [];
    for (const img of data.images) {
      if (img.startsWith("data:")) {
        const res = await fetch(img);
        const blob = await res.blob();
        const file = new File([blob], `activity-${Date.now()}.jpg`, { type: blob.type });
        const url = await uploadActivityImage(supabase, providerId, file);
        if (url) newImageUrls.push(url);
      } else if (img.startsWith("http")) {
        newImageUrls.push(img);
      }
    }

    const updates: UpdateActivity = {
      title: data.title,
      description: data.description,
      why_this_activity: data.whyThisActivity || null,
      category_id: data.categoryId,
      duration_min: data.durationMin,
      is_free: data.isFree,
      has_free_trial_class: data.hasFreeTrialClass,
      price: data.isFree ? null : data.price,
      price_label: data.priceLabel,
      booking_url: data.bookingUrl.trim() || null,
      min_age: data.minAge,
      max_age: data.maxAge,
      location: data.location || null,
      neighborhood: data.neighborhood || null,
      city: data.city,
    };

    const schedules: InsertSchedule[] = data.schedules.map((s) => ({
      activity_id: activityId,
      weekday: s.weekday,
      start_time: s.startTime,
      end_time: s.endTime,
      is_flexible: s.isFlexible ?? false,
    }));

    const { error } = await updateActivity(
      supabase,
      activityId,
      updates,
      schedules,
      newImageUrls.length > 0 ? newImageUrls : undefined
    );

    if (!error) {
      router.push("/proveedor/dashboard");
    }
  }

  // Estado de carga
  if (activity === undefined) {
    return (
      <div className="pt-16 min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-ink-light" />
      </div>
    );
  }

  // Actividad no encontrada o no autorizada
  if (activity === null) {
    return (
      <div className="pt-16 min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-ink-light mx-auto" />
          <p className="font-display font-semibold text-ink">Actividad no encontrada</p>
          <Link href="/proveedor/dashboard" className="text-sm text-primary hover:underline">
            Volver al panel
          </Link>
        </div>
      </div>
    );
  }

  const initialData: Partial<ActivityFormData> = {
    title: activity.title,
    description: activity.description,
    whyThisActivity: activity.whyThisActivity,
    categoryId: activity.categoryId,
    durationMin: activity.durationMin,
    isFree: activity.priceType === "free",
    hasFreeTrialClass: false,
    // El flag no se guarda como columna: se infiere de la etiqueta "Desde €X"
    isVariablePrice: activity.priceLabel.startsWith("Desde"),
    price: activity.price,
    priceLabel: activity.priceLabel,
    bookingUrl: activity.bookingUrl ?? "",
    minAge: activity.minAge,
    maxAge: activity.maxAge,
    location: activity.location,
    neighborhood: activity.neighborhood,
    city: activity.city,
    schedules: activity.schedules,
    images: activity.imagePath ? [activity.imagePath] : [],
  };

  return (
    <div className="pt-16 min-h-screen bg-surface">
      {/* Sub-nav */}
      <div className="border-b border-border bg-white sticky top-16 z-30">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-12">
            <Link href="/proveedor/dashboard" className="text-sm font-medium text-ink-light hover:text-ink transition-colors">
              Panel
            </Link>
            <Link href="/proveedor/actividades/nueva" className="text-sm font-medium text-ink-light hover:text-ink transition-colors">
              Nueva actividad
            </Link>
            <Link href="/proveedor/perfil" className="text-sm font-medium text-ink-light hover:text-ink transition-colors">
              Mi perfil
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/proveedor/dashboard" className="text-ink-light hover:text-ink transition-colors focus:outline-none">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-2xl text-ink">Editar actividad</h1>
            <p className="text-sm text-ink-light mt-0.5 line-clamp-1">{activity.title}</p>
          </div>
        </div>

        <ActivityForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}
