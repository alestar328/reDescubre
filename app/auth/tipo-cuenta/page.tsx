"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { User, Users, Building2, ArrowRight, Check, Loader2 } from "lucide-react";
import { useState, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/supabase/queries";

type TipoCuenta = "explorer" | "beneficiary" | "proveedor";

const options: { id: TipoCuenta; icon: React.ElementType; title: string; desc: string; badge?: string }[] = [
  {
    id: "explorer",
    icon: User,
    title: "Para mí",
    desc: "Voy a explorar y reservar actividades para mí mismo.",
  },
  {
    id: "beneficiary",
    icon: Users,
    title: "Para alguien más",
    desc: "Gestiono la agenda de mi hijo/a, alumno/a o persona a mi cargo.",
  },
  {
    id: "proveedor",
    icon: Building2,
    title: "Soy proveedor",
    desc: "Tengo una academia, escuela o taller y quiero publicar actividades.",
    badge: "Totalmente gratis",
  },
];

function TipoCuentaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("tipo") as TipoCuenta | null;
  const { user } = useAuth();

  const [selected, setSelected] = useState<TipoCuenta | null>(preselected);
  const [isSaving, setIsSaving] = useState(false);

  async function handleContinue() {
    if (!selected || isSaving) return;
    setIsSaving(true);

    // Persistir account_type en la tabla profiles
    if (user) {
      const supabase = createClient();
      await updateProfile(supabase, user.id, { account_type: selected });
    }

    if (selected === "proveedor") {
      router.push("/proveedor/registro");
    } else {
      router.push(`/auth/perfil?tipo=${selected}`);
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-sand px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink mb-2">
            ¿Cómo vas a usar Re-descubre?
          </h1>
          <p className="text-ink-light text-sm">
            Esto nos ayuda a personalizar tu experiencia.
          </p>
        </div>

        <div className="space-y-3">
          {options.map(({ id, icon: Icon, title, desc, badge }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              className={`
                w-full text-left flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-150 focus:outline-none
                ${selected === id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-ink/20 hover:bg-sand/60"
                }
              `}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${selected === id ? "bg-primary text-white" : "bg-sand text-ink-light"}`}>
                {selected === id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-semibold text-sm text-ink">{title}</span>
                  {badge && (
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-light mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected || isSaving}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3.5 rounded-full hover:bg-primary-dark transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Continuar
          {!isSaving && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function TipoCuentaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-16 bg-sand" />}>
      <TipoCuentaContent />
    </Suspense>
  );
}
