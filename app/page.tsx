import Link from "next/link";
import {
  ArrowRight,
  TreePine,
  Waves,
  Palette,
  Users,
  GraduationCap,
  Dumbbell,
  CalendarDays,
  Building2,
} from "lucide-react";

import { activities, categories } from "@/lib/mock-data";
import ActivityCard from "@/components/activities/ActivityCard";
import ActivityCarousel from "@/components/home/ActivityCarousel";
import ExplorerIcon from "@/components/icons/ExplorerIcon";
import HappyIcon from "@/components/icons/HappyIcon";

const categoryIcons: Record<string, React.ElementType> = {
  exterior: TreePine,
  playa: Waves,
  artistica: Palette,
  social: Users,
  aprendizaje: GraduationCap,
  deporte: Dumbbell,
};

const howItWorks = [
  {
    step: "01",
    icon: ExplorerIcon,
    title: "Explorad juntos",
    desc: "Navega el catálogo de actividades con filtros por categoría, precio y barrio. Descubre lo que Barcelona tiene para ofrecer.",
  },
  {
    step: "02",
    icon: CalendarDays,
    title: "Armad la agenda",
    desc: "Selecciona las actividades que más te gustan y añádelas al planificador semanal. Máximo 2 al día para no saturar.",
  },
  {
    step: "03",
    icon: HappyIcon,
    title: "¡A disfrutar!",
    desc: "Llega puntual, desconecta el móvil y vive la experiencia. Después, valórala y descubre más.",
  },
];

const featuredActivities = activities.slice(0, 3);

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-start lg:items-center pt-16 overflow-hidden bg-sand">
        {/* Background wave */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V120H0V40Z"
            fill="#FAFAF8"
          />
        </svg>

        <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-sm font-medium mb-6">
              <Waves className="w-4 h-4" />
              Barcelona, verano 2026
            </div>
            <h1 className="font-display font-extrabold text-ink text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4">
              El verano que{" "}
              <span className="text-primary">recordarás</span>
            </h1>
            <p className="text-ink-light text-lg sm:text-xl mb-8 max-w-lg">
              Actividades chulas para conectar contigo y con otros.<br /><strong>Menos pantallas,</strong> más vida — agéndalas y añádelas a tu calendario personal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/actividades"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors duration-200 text-base shadow-md shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Explorar actividades
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center gap-2 border border-ink/20 text-ink font-semibold px-6 py-3 rounded-full hover:bg-white transition-colors duration-200 text-base focus:outline-none focus:ring-2 focus:ring-ink"
              >
                Cómo funciona
              </a>
            </div>
          </div>

          {/* Activity carousel */}
          <div className="h-80 lg:h-[420px]">
            <ActivityCarousel activities={activities} categories={categories} />
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 bg-surface">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink text-center mb-2">
            Encuentra tu actividad
          </h2>
          <p className="text-ink-light text-center mb-10">
            Seis categorías, cientos de opciones en Barcelona.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] ?? Waves;
              return (
                <Link
                  key={cat.id}
                  href={`/actividades?categoria=${cat.slug}`}
                  className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-card hover:border-transparent hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ ["--cat-color" as string]: cat.color }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                    style={{ backgroundColor: cat.bgColor }}
                  >
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: cat.color }} />
                  </div>
                  <span className="text-sm font-medium text-ink text-center">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-20 bg-sand">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-2">
              Cómo funciona
            </h2>
            <p className="text-ink-light max-w-md mx-auto">
              En tres pasos, pasáis de las pantallas a las experiencias reales.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <span className="font-display font-extrabold text-9xl text-primary/10 select-none leading-none">
                    {step}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="w-[72px] h-[72px] text-primary" />
                    </div>
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-ink mb-2">{title}</h3>
                <p className="text-sm text-ink-light max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actividades destacadas */}
      <section className="py-20 bg-surface">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-1">
                Actividades destacadas
              </h2>
              <p className="text-ink-light">Las más populares esta semana en Barcelona.</p>
            </div>
            <Link
              href="/actividades"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredActivities.map((activity, i) => (
              <ActivityCard key={activity.id} activity={activity} animationDelay={i * 80} />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/actividades"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Ver todas las actividades
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Para proveedores */}
      <section className="py-20 bg-ink">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/20 rounded-2xl mb-6">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
            ¿Tienes una academia, escuela o taller en Barcelona?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Llega a miles de jóvenes que buscan exactamente lo que ofreces. Sin comisión en fase beta.
          </p>
          <Link
            href="/proveedores"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-full hover:bg-primary-dark transition-colors duration-200 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-ink"
          >
            Añade tu actividad
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
