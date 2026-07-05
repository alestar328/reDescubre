"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { categories } from "@/lib/mock-data";
import type { Activity } from "@/lib/mock-data";
import ScheduleEditor, { type ScheduleSlot } from "./ScheduleEditor";
import ImageUpload from "./ImageUpload";

// Subset de Activity usable en el formulario (sin campos generados por el servidor)
export type ActivityFormData = {
  title: string;
  description: string;
  whyThisActivity: string;
  categoryId: string;
  durationMin: number;
  isFree: boolean;
  hasFreeTrialClass: boolean;    // clase de prueba gratuita aunque la actividad sea de pago
  isVariablePrice: boolean;      // precio "desde X" (p. ej. talleres con niveles o materiales)
  price: number | null;
  priceLabel: string;
  minAge: number;
  maxAge: number;
  location: string;
  neighborhood: string;
  city: string;
  schedules: ScheduleSlot[];
  images: string[];              // base64/URLs temporales — TODO Supabase Storage
};

interface ActivityFormProps {
  initialData?: Partial<ActivityFormData>;
  onSubmit: (data: ActivityFormData) => Promise<void>;
  submitLabel?: string;
}

const defaultData: ActivityFormData = {
  title: "",
  description: "",
  whyThisActivity: "",
  categoryId: "exterior",
  durationMin: 60,
  isFree: false,
  hasFreeTrialClass: false,
  isVariablePrice: false,
  price: null,
  priceLabel: "",
  minAge: 12,
  maxAge: 25,
  location: "",
  neighborhood: "",
  city: "Barcelona",
  schedules: [],
  images: [],
};

const inputClass =
  "w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-ink-light/50";

const labelClass = "block text-sm font-medium text-ink mb-1.5";

// Etiqueta de precio que se muestra en tarjetas y fichas (PriceBadge)
export function buildPriceLabel(data: Pick<ActivityFormData, "isFree" | "isVariablePrice" | "price">): string {
  if (data.isFree) return "Gratis";
  if (data.price == null) return "";
  const amount = Number.isInteger(data.price) ? String(data.price) : data.price.toFixed(2);
  return data.isVariablePrice ? `Desde €${amount}` : `€${amount}/sesión`;
}

/**
 * Formulario compartido para crear y editar actividades.
 * TODO Supabase: en onSubmit, persistir con:
 *   supabase.from('activities').insert/update({ ...data, provider_id: session.user.id })
 *   Las imágenes se suben primero a Supabase Storage y se guardan sus URLs públicas.
 */
export default function ActivityForm({ initialData, onSubmit, submitLabel = "Guardar actividad" }: ActivityFormProps) {
  const [form, setForm] = useState<ActivityFormData>({ ...defaultData, ...initialData });
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  function set<K extends keyof ActivityFormData>(key: K, value: ActivityFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    await onSubmit({ ...form, priceLabel: buildPriceLabel(form) });
    setIsSaving(false);
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Sección: Información básica */}
      <fieldset className="space-y-5">
        <legend className="font-display font-semibold text-base text-ink border-b border-border pb-2 w-full">
          Información básica
        </legend>

        <div>
          <label className={labelClass} htmlFor="act-title">Nombre de la actividad *</label>
          <input
            id="act-title"
            type="text"
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ej: Paddle Surf para principiantes"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="act-category">Categoría *</label>
          <select
            id="act-category"
            required
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="act-desc">Descripción para los jóvenes *</label>
          <textarea
            id="act-desc"
            required
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe la actividad de forma atractiva para jóvenes de 12-25 años. ¿Qué van a hacer? ¿Qué incluye?"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="act-why">
            ¿Por qué esta actividad? <span className="text-ink-light font-normal">(opcional)</span>
          </label>
          <textarea
            id="act-why"
            rows={3}
            value={form.whyThisActivity}
            onChange={(e) => set("whyThisActivity", e.target.value)}
            placeholder="¿Qué habilidades o valores desarrolla? Esto aparece en la ficha de la actividad como motivación."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="act-duration">Duración (minutos) *</label>
          <input
            id="act-duration"
            type="number"
            required
            min={15}
            max={480}
            step={15}
            value={form.durationMin}
            onChange={(e) => set("durationMin", Number(e.target.value))}
            className={inputClass}
          />
          <p className="text-xs text-ink-light mt-1">
            {form.durationMin >= 60
              ? `${Math.floor(form.durationMin / 60)}h ${form.durationMin % 60 > 0 ? `${form.durationMin % 60}min` : ""}`
              : `${form.durationMin} min`}
          </p>
        </div>
      </fieldset>

      {/* Sección: Precio */}
      <fieldset className="space-y-4">
        <legend className="font-display font-semibold text-base text-ink border-b border-border pb-2 w-full">
          Precio
        </legend>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => set("isFree", false)}
            className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
              !form.isFree
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-white text-ink-light hover:border-ink/20"
            }`}
          >
            De pago
          </button>
          <button
            type="button"
            onClick={() => { set("isFree", true); set("price", null); }}
            className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-colors ${
              form.isFree
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-white text-ink-light hover:border-ink/20"
            }`}
          >
            Gratuita
          </button>
        </div>

        {!form.isFree && (
          <div className="space-y-3">
            <div>
              <label className={labelClass} htmlFor="act-price">
                {form.isVariablePrice ? "Precio desde (€) *" : "Precio (€) *"}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-light text-sm">€</span>
                <input
                  id="act-price"
                  type="number"
                  required
                  min={0}
                  step={0.5}
                  value={form.price ?? ""}
                  onChange={(e) => set("price", Number(e.target.value))}
                  placeholder="0.00"
                  className={`${inputClass} pl-8`}
                />
              </div>
              {form.price != null && form.price > 0 && (
                <p className="text-xs text-ink-light mt-1">
                  Se mostrará como: <span className="font-medium text-ink">{buildPriceLabel(form)}</span>
                </p>
              )}
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.isVariablePrice}
                onChange={(e) => set("isVariablePrice", e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-ink">Precio variable</span>
                <p className="text-xs text-ink-light">
                  El precio parte de una cantidad mínima y puede variar según nivel, materiales u opciones (p. ej. talleres de pintura)
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.hasFreeTrialClass}
                onChange={(e) => set("hasFreeTrialClass", e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-ink">Clase de prueba gratuita</span>
                <p className="text-xs text-ink-light">La primera sesión es gratis para nuevos participantes</p>
              </div>
            </label>
          </div>
        )}
      </fieldset>

      {/* Sección: Público */}
      <fieldset className="space-y-4">
        <legend className="font-display font-semibold text-base text-ink border-b border-border pb-2 w-full">
          Público objetivo
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="act-min-age">Edad mínima</label>
            <input
              id="act-min-age"
              type="number"
              min={5}
              max={99}
              value={form.minAge}
              onChange={(e) => set("minAge", Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="act-max-age">Edad máxima</label>
            <input
              id="act-max-age"
              type="number"
              min={5}
              max={99}
              value={form.maxAge}
              onChange={(e) => set("maxAge", Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {/* Sección: Ubicación */}
      <fieldset className="space-y-4">
        <legend className="font-display font-semibold text-base text-ink border-b border-border pb-2 w-full">
          Ubicación
        </legend>
        <div>
          <label className={labelClass} htmlFor="act-location">Dirección *</label>
          <input
            id="act-location"
            type="text"
            required
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Ej: Carrer de Pallars, 193"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="act-neighborhood">Barrio</label>
            <input
              id="act-neighborhood"
              type="text"
              value={form.neighborhood}
              onChange={(e) => set("neighborhood", e.target.value)}
              placeholder="Ej: Poblenou"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="act-city">Ciudad *</label>
            <input
              id="act-city"
              type="text"
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Barcelona"
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {/* Sección: Horarios */}
      <ScheduleEditor value={form.schedules} onChange={(s) => set("schedules", s)} />

      {/* Sección: Fotos */}
      <fieldset className="space-y-4">
        <legend className="font-display font-semibold text-base text-ink border-b border-border pb-2 w-full">
          Fotos
        </legend>
        <ImageUpload
          label="Foto principal"
          hint="Aparece en la tarjeta y la ficha de la actividad. Recomendado: 16:9, mín. 800px de ancho."
          maxFiles={1}
          aspectRatio="landscape"
          value={form.images.slice(0, 1)}
          onChange={(imgs) => set("images", [...imgs, ...form.images.slice(1)])}
        />
        <ImageUpload
          label="Fotos adicionales"
          hint="Hasta 4 fotos extra para la galería de la ficha."
          maxFiles={4}
          aspectRatio="landscape"
          value={form.images.slice(1)}
          onChange={(imgs) => set("images", [form.images[0] ?? "", ...imgs])}
        />
      </fieldset>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Guardando…" : savedOk ? "¡Guardado!" : submitLabel}
        </button>
        {savedOk && (
          <span className="text-sm text-green-600 font-medium">Los cambios se han guardado.</span>
        )}
      </div>
    </form>
  );
}
