/**
 * Tipos TypeScript que reflejan el esquema de la base de datos.
 * Generados manualmente desde 001_initial_schema.sql.
 * Para regenerarlos automáticamente: npx supabase gen types typescript --project-id bbklmczvhlflnozcpdgj
 */

export type AccountType = "explorer" | "beneficiary" | "proveedor";
export type AgendaStatus = "planned" | "confirmed" | "attended";

// ---------------------------------------------------------------------------
// Tipos de filas (Row = lo que devuelve SELECT)
// ---------------------------------------------------------------------------

export interface DbProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  account_type: AccountType | null;
  beneficiary_name: string | null;
  beneficiary_age: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbProvider {
  id: string;
  user_id: string;
  name: string;
  description: string;
  bio: string | null;
  website: string | null;
  location: string | null;
  neighborhood: string | null;
  city: string;
  country: string;
  avatar_url: string | null;
  cover_image_url: string | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbActivity {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  why_this_activity: string | null;
  category_id: string;
  duration_min: number;
  is_free: boolean;
  has_free_trial_class: boolean;
  price: number | null;
  price_label: string;
  min_age: number;
  max_age: number;
  location: string | null;
  neighborhood: string | null;
  city: string;
  country: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbActivitySchedule {
  id: string;
  activity_id: string;
  weekday: string;
  start_time: string;  // "HH:MM:SS"
  end_time: string;
  is_flexible: boolean; // true = ventana flexible (el cliente elige su hora dentro del rango)
}

export interface DbActivityImage {
  id: string;
  activity_id: string;
  url: string;
  sort_order: number;
  created_at: string;
}

export interface DbProviderReview {
  id: string;
  provider_id: string;
  user_id: string;
  activity_id: string | null;
  stars: number;
  comment: string | null;
  created_at: string;
}

export interface DbAgendaItem {
  id: string;
  user_id: string;
  activity_id: string;
  date: string;           // "YYYY-MM-DD"
  start_time: string;
  end_time: string;
  status: AgendaStatus;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Tipos de actividad con relaciones incluidas (resultado de joins)
// ---------------------------------------------------------------------------

export interface DbActivityFull extends DbActivity {
  activity_schedules: DbActivitySchedule[];
  activity_images: Pick<DbActivityImage, "url" | "sort_order">[];
  providers: Pick<DbProvider, "name" | "website" | "avatar_url">;
}

// ---------------------------------------------------------------------------
// Tipos de inserción (omite campos auto-generados)
// ---------------------------------------------------------------------------

export type InsertProvider = Omit<DbProvider, "id" | "rating" | "review_count" | "is_verified" | "created_at" | "updated_at">;
export type InsertActivity = Omit<DbActivity, "id" | "created_at" | "updated_at">;
export type InsertSchedule = Omit<DbActivitySchedule, "id">;
export type InsertAgendaItem = Omit<DbAgendaItem, "id" | "created_at">;

export type UpdateProvider = Partial<Omit<InsertProvider, "user_id">>;
export type UpdateActivity = Partial<Omit<InsertActivity, "provider_id">>;
