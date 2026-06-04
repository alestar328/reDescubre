"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Calendar, Mail, UserRound } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { getProfile, updateProfile } from "@/lib/supabase/queries";

const inputClass =
  "w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-ink-light/50";

const accountTypeLabel: Record<string, string> = {
  explorer: "Exploro para mí",
  beneficiary: "Gestiono para otra persona",
  proveedor: "Proveedor",
};

export default function PerfilPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, refreshProfile } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [accountType, setAccountType] = useState<string | null>(null);
  const [form, setForm] = useState({
    displayName: "",
    beneficiaryName: "",
    beneficiaryAge: "",
  });

  // Redirigir al login si no hay sesión
  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth/login");
  }, [authLoading, user, router]);

  // Si es proveedor, su perfil vive en /proveedor/perfil
  useEffect(() => {
    if (user?.accountType === "proveedor") router.replace("/proveedor/perfil");
  }, [user, router]);

  // Cargar datos del perfil
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    getProfile(supabase, user.id).then((p) => {
      if (p) {
        setAccountType(p.account_type);
        setForm({
          displayName: p.display_name ?? user.displayName ?? "",
          beneficiaryName: p.beneficiary_name ?? "",
          beneficiaryAge: p.beneficiary_age ? String(p.beneficiary_age) : "",
        });
      }
      setIsLoading(false);
    });
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    const supabase = createClient();
    const isBeneficiary = accountType === "beneficiary";

    await updateProfile(supabase, user.id, {
      display_name: form.displayName,
      ...(isBeneficiary
        ? {
            beneficiary_name: form.beneficiaryName || null,
            beneficiary_age: form.beneficiaryAge
              ? parseInt(form.beneficiaryAge, 10)
              : null,
          }
        : {}),
    });

    await refreshProfile();
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (authLoading || isLoading || !user) {
    return (
      <div className="pt-16 min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-ink-light" />
      </div>
    );
  }

  const isBeneficiary = accountType === "beneficiary";

  return (
    <div className="pt-16 min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-ink-light hover:text-ink transition-colors focus:outline-none">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-2xl text-ink">Mi perfil</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Identidad */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-border">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-2xl text-primary">
                    {form.displayName.charAt(0).toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm text-ink-light">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{user.email}</span>
                </p>
                {accountType && (
                  <span className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                    <UserRound className="w-3 h-3" />
                    {accountTypeLabel[accountType] ?? accountType}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="displayName">
                Tu nombre *
              </label>
              <input
                id="displayName"
                type="text"
                required
                value={form.displayName}
                onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Datos del beneficiario */}
          {isBeneficiary && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <h2 className="font-display font-semibold text-base text-ink">
                Persona a tu cargo
              </h2>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="beneficiaryName">
                  Nombre
                </label>
                <input
                  id="beneficiaryName"
                  type="text"
                  value={form.beneficiaryName}
                  onChange={(e) => setForm((p) => ({ ...p, beneficiaryName: e.target.value }))}
                  placeholder="Nombre"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="beneficiaryAge">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-ink-light" />
                    Edad
                  </span>
                </label>
                <input
                  id="beneficiaryAge"
                  type="number"
                  min={5}
                  max={30}
                  value={form.beneficiaryAge}
                  onChange={(e) => setForm((p) => ({ ...p, beneficiaryAge: e.target.value }))}
                  placeholder="Ej: 14"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Accesos rápidos */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <h2 className="font-display font-semibold text-base text-ink">Mi actividad</h2>
            <Link
              href="/agenda"
              className="flex items-center justify-between text-sm text-ink hover:text-primary transition-colors py-1"
            >
              <span>Ver mi agenda</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>

          {/* Guardar */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Guardando…" : "Guardar cambios"}
            </button>
            {saved && <span className="text-sm text-green-600 font-medium">¡Cambios guardados!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
