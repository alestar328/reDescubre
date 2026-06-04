"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ActivityImagePlaceholder from "@/components/activities/ActivityImagePlaceholder";

interface ActivityImageCarouselProps {
  images: string[];
  categoryId: string;
  imageColor: string;
  alt: string;
  className?: string;
}

/**
 * Carrusel de imágenes para la cabecera del detalle de actividad.
 * Permite navegar entre todas las fotos que subió el proveedor.
 * Si no hay imágenes, muestra el placeholder de categoría.
 */
export default function ActivityImageCarousel({
  images,
  categoryId,
  imageColor,
  alt,
  className = "",
}: ActivityImageCarouselProps) {
  const [index, setIndex] = useState(0);

  // Sin imágenes → placeholder de categoría
  if (images.length === 0) {
    return (
      <ActivityImagePlaceholder
        categoryId={categoryId}
        imageColor={imageColor}
        alt={alt}
        className={className}
      />
    );
  }

  // Una sola imagen → sin controles
  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={images[0]}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
    );
  }

  const goTo = (i: number) => setIndex((i + images.length) % images.length);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  return (
    <div className={`relative overflow-hidden group bg-ink/5 ${className}`}>
      <Image
        key={index}
        src={images[index]}
        alt={`${alt} — imagen ${index + 1} de ${images.length}`}
        fill
        priority={index === 0}
        className="object-cover"
        sizes="100vw"
      />

      {/* Degradado inferior para legibilidad de los controles */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {/* Flecha anterior */}
      <button
        type="button"
        onClick={prev}
        aria-label="Imagen anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-ink shadow-md hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-primary opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Flecha siguiente */}
      <button
        type="button"
        onClick={next}
        aria-label="Imagen siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-ink shadow-md hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-primary opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Contador */}
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur">
        {index + 1} / {images.length}
      </div>

      {/* Puntos de navegación */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir a la imagen ${i + 1}`}
            className={`h-1.5 rounded-full transition-all focus:outline-none ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
