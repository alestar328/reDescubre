"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock3,
  MapPin,
  ChevronRight,
  Brain,
  ExternalLink,
  CalendarDays,
  Plus,
} from "lucide-react";
import { Activity, Category, Provider } from "@/lib/mock-data";
import CategoryBadge from "@/components/common/CategoryBadge";
import PriceBadge from "@/components/common/PriceBadge";
import ActivityImageCarousel from "@/components/activities/ActivityImageCarousel";
import AddToAgendaModal from "@/components/activities/AddToAgendaModal";

interface ActivityDetailClientProps {
  activity: Activity;
  category: Category | undefined;
  provider: Provider | undefined;
}

export default function ActivityDetailClient({
  activity,
  category,
  provider,
}: ActivityDetailClientProps) {
  const [selectedScheduleIdx, setSelectedScheduleIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const durationText =
    activity.durationMin < 60
      ? `${activity.durationMin} min`
      : activity.durationMin % 60 === 0
      ? `${activity.durationMin / 60}h`
      : `${Math.floor(activity.durationMin / 60)}h ${activity.durationMin % 60}min`;

  return (
    <>
      <div className="pt-16 min-h-screen bg-surface">
        {/* Hero: carrusel de imágenes subidas por el proveedor */}
        <ActivityImageCarousel
          images={activity.images ?? (activity.imagePath ? [activity.imagePath] : [])}
          categoryId={activity.categoryId}
          imageColor={activity.imageColor}
          alt={activity.title}
          className="w-full h-64 sm:h-80 lg:h-96"
        />

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-ink-light mb-5">
            <Link href="/" className="hover:text-ink transition-colors">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/actividades" className="hover:text-ink transition-colors">
              Actividades
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-medium line-clamp-1">{activity.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title + badge */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink">
                    {activity.title}
                  </h1>
                  <CategoryBadge categoryId={activity.categoryId} size="md" />
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display font-bold text-lg text-ink mb-2">
                  Sobre la actividad
                </h2>
                <p className="text-ink-light leading-relaxed">{activity.description}</p>
              </div>

              {/* Why this activity */}
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: category?.bgColor ?? "#fafaf8",
                  borderLeft: `4px solid ${category?.color ?? "#FF5C35"}`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Brain
                    className="w-5 h-5"
                    style={{ color: category?.color ?? "#FF5C35" }}
                  />
                  <h3
                    className="font-display font-bold text-base"
                    style={{ color: category?.textColor ?? "#1A1A2E" }}
                  >
                    ¿Por qué esta actividad?
                  </h3>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: category?.textColor ?? "#4A4A6A" }}
                >
                  {activity.whyThisActivity}
                </p>
              </div>

              {/* Schedules */}
              <div>
                <h2 className="font-display font-bold text-lg text-ink mb-3">
                  Horarios disponibles
                </h2>
                <div className="flex flex-wrap gap-2">
                  {activity.schedules.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedScheduleIdx(i)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-colors ${
                        selectedScheduleIdx === i
                          ? "border-primary bg-primary text-white"
                          : "border-border text-ink hover:border-primary hover:text-primary"
                      }`}
                    >
                      <CalendarDays className="w-4 h-4" />
                      {s.weekday} · {s.startTime}–{s.endTime}
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider */}
              {provider && (
                <div>
                  <h2 className="font-display font-bold text-lg text-ink mb-3">
                    Sobre el proveedor
                  </h2>
                  <div className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-border">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                      style={{ backgroundColor: category?.color ?? "#FF5C35" }}
                    >
                      {provider.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink">{provider.name}</p>
                      <p className="text-sm text-ink-light mt-0.5 mb-2">
                        {provider.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-ink-light flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {provider.location}
                        </span>
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Web
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky panel */}
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                {/* Price */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-3xl font-display font-extrabold text-ink">
                      {activity.priceType === "free" ? "Gratis" : `€${activity.price}`}
                    </p>
                    {activity.priceType === "paid" && (
                      <p className="text-sm text-ink-light">por sesión</p>
                    )}
                  </div>
                  <PriceBadge
                    priceType={activity.priceType}
                    priceLabel={activity.priceLabel}
                  />
                </div>

                {/* Meta */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-ink-light">
                    <Clock3 className="w-4 h-4 shrink-0" />
                    <span>{durationText} de duración</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-light">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{activity.location}</span>
                  </div>
                </div>

                {/* Selected schedule */}
                {activity.schedules[selectedScheduleIdx] && (
                  <div className="flex items-center gap-2 text-sm font-medium text-ink mb-5 p-3 bg-sand rounded-xl">
                    <CalendarDays className="w-4 h-4 text-primary shrink-0" />
                    <span>
                      {activity.schedules[selectedScheduleIdx].weekday},{" "}
                      {activity.schedules[selectedScheduleIdx].startTime}–
                      {activity.schedules[selectedScheduleIdx].endTime}
                    </span>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-full hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <Plus className="w-4 h-4" />
                  Añadir a mi agenda
                </button>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(activity.location + " Barcelona")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 flex items-center justify-center gap-2 text-sm font-medium text-ink-light border border-border py-2.5 rounded-full hover:bg-sand transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Ver en Google Maps
                </a>
              </div>

              {/* Age range */}
              <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-ink-light">Edad recomendada</span>
                <span className="font-semibold text-ink">
                  {activity.minAge}–{activity.maxAge} años
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddToAgendaModal
        activity={activity}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
