"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock3, MapPin, Globe, Plus } from "lucide-react";
import { Activity, getCategoryById } from "@/lib/mock-data";
import CategoryBadge from "@/components/common/CategoryBadge";
import PriceBadge from "@/components/common/PriceBadge";
import ActivityImagePlaceholder from "./ActivityImagePlaceholder";
import AddToAgendaModal from "./AddToAgendaModal";

interface ActivityCardProps {
  activity: Activity;
  animationDelay?: number;
}

export default function ActivityCard({ activity, animationDelay = 0 }: ActivityCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const durationText =
    activity.durationMin < 60
      ? `${activity.durationMin} min`
      : activity.durationMin % 60 === 0
      ? `${activity.durationMin / 60}h`
      : `${Math.floor(activity.durationMin / 60)}h ${activity.durationMin % 60}min`;

  return (
    <>
      <article
        className="group bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md opacity-0"
        style={{
          animationName: "fadeSlideUp",
          animationDuration: "400ms",
          animationTimingFunction: "ease",
          animationFillMode: "forwards",
          animationDelay: `${animationDelay}ms`,
        }}
      >
        {/* Image area */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link
            href={`/actividades/${activity.id}`}
            aria-label={`Ver ${activity.title}`}
            className="block w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
          >
            <ActivityImagePlaceholder
              categoryId={activity.categoryId}
              imageColor={activity.imageColor}
              imagePath={activity.imagePath}
              alt={activity.title}
              className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <CategoryBadge categoryId={activity.categoryId} />
          </div>
          <div className="absolute top-3 right-3 pointer-events-none">
            <PriceBadge priceType={activity.priceType} priceLabel={activity.priceLabel} />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-display font-bold text-ink text-base mb-1 line-clamp-1">
            <Link
              href={`/actividades/${activity.id}`}
              className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              {activity.title}
            </Link>
          </h3>
          <p className="text-sm text-ink-light line-clamp-2 mb-2 flex-1">
            {activity.description}
          </p>

          {/* Meta footer */}
          <div className="flex items-center justify-between text-xs text-ink-light mt-auto pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock3 className="w-3.5 h-3.5" />
                {durationText}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {activity.neighborhood}
              </span>
            </div>
            <span className="flex items-center gap-1 shrink-0 font-medium text-[11px] px-2 py-0.5 rounded-full bg-sand border border-border">
              <Globe className="w-3 h-3" />
              {activity.city}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            <Link
              href={`/actividades/${activity.id}`}
              className="flex-1 text-center text-sm font-medium border border-border text-ink py-2 rounded-full hover:bg-sand transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Ver más
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium bg-primary text-white px-3 py-2 rounded-full hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              aria-label="Añadir a agenda"
            >
              <Plus className="w-4 h-4" />
              Agenda
            </button>
          </div>
        </div>
      </article>

      <AddToAgendaModal
        activity={activity}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
