"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ActivityForm, { type ActivityFormData } from "@/components/provider/ActivityForm";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { getProviderByUserId, createActivity, uploadActivityImage } from "@/lib/supabase/queries";
import type { InsertActivity, InsertSchedule } from "@/lib/supabase/types";

export default function NuevaActividadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [providerId, setProviderId] = useState<string | null>(null);

  // Obtener el ID del proveedor del usuario autenticado
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    getProviderByUserId(supabase, user.id).then((p) => {
      if (p) setProviderId(p.id);
    });
  }, [user]);

  async function handleSubmit(data: ActivityFormData) {
    if (!providerId) return;

    const supabase = createClient();

    // Subir imágenes y obtener URLs públicas
    const imageUrls: string[] = [];
    for (const img of data.images) {
      if (img.startsWith("data:")) {
        const res = await fetch(img);
        const blob = await res.blob();
        const file = new File([blob], `activity-${Date.now()}.jpg`, { type: blob.type });
        const url = await uploadActivityImage(supabase, providerId, file);
        if (url) imageUrls.push(url);
      } else if (img.startsWith("http")) {
        imageUrls.push(img);
      }
    }

    const activity: InsertActivity = {
      provider_id: providerId,
      title: data.title,
      description: data.description,
      why_this_activity: data.whyThisActivity || null,
      category_id: data.categoryId,
      duration_min: data.durationMin,
      is_free: data.isFree,
      has_free_trial_class: data.hasFreeTrialClass,
      price: data.isFree ? null : data.price,
      price_label: data.priceLabel,
      min_age: data.minAge,
      max_age: data.maxAge,
      location: data.location || null,
      neighborhood: data.neighborhood || null,
      city: data.city,
      country: "España",
      is_published: true,
    };

    const schedules: InsertSchedule[] = data.schedules.map((s) => ({
      activity_id: "",   // createActivity lo sobreescribe con el id real
      weekday: s.weekday,
      start_time: s.startTime,
      end_time: s.endTime,
      is_flexible: s.isFlexible ?? false,
    }));

    const { error } = await createActivity(supabase, activity, schedules, imageUrls);

    if (!error) {
      router.push("/proveedor/dashboard");
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-surface">
      {/* Sub-nav */}
      <div className="border-b border-border bg-white sticky top-16 z-30">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-12">
            <Link href="/proveedor/dashboard" className="text-sm font-medium text-ink-light hover:text-ink transition-colors">
              Panel
            </Link>
            <Link href="/proveedor/actividades/nueva" className="text-sm font-medium text-primary border-b-2 border-primary pb-0.5">
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
            <h1 className="font-display font-bold text-2xl text-ink">Nueva actividad</h1>
            <p className="text-sm text-ink-light mt-0.5">
              Completa los datos para que los jóvenes puedan encontrarla.
            </p>
          </div>
        </div>

        <ActivityForm onSubmit={handleSubmit} submitLabel="Publicar actividad" />
      </div>
    </div>
  );
}
