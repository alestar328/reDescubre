/**
 * Funciones de consulta reutilizables para Supabase.
 * Todas las queries devuelven el tipo de dato que espera la UI (Activity, Provider, etc.)
 * mapeando desde el formato snake_case de la BD al camelCase del frontend.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Activity, Provider } from "@/lib/mock-data";
import type {
  DbActivityFull,
  DbProvider,
  DbProfile,
  InsertProvider,
  InsertActivity,
  InsertSchedule,
  UpdateProvider,
  UpdateActivity,
  AccountType,
  AgendaStatus,
} from "./types";

// ---------------------------------------------------------------------------
// Mappers DB → UI
// ---------------------------------------------------------------------------

function toHHMM(timeStr: string): string {
  // Supabase devuelve "HH:MM:SS", la UI espera "HH:MM"
  return timeStr.slice(0, 5);
}

export function mapDbProvider(row: DbProvider): Provider {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    bio: row.bio ?? undefined,
    location: row.location ?? "",
    city: row.city,
    country: row.country,
    website: row.website ?? "",
    avatarPath: row.avatar_url ?? undefined,
    coverImagePath: row.cover_image_url ?? undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
  };
}

export function mapDbActivity(row: DbActivityFull): Activity {
  const sortedImages = [...row.activity_images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.url);
  const mainImage = sortedImages[0];

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    whyThisActivity: row.why_this_activity ?? "",
    categoryId: row.category_id,
    providerId: row.provider_id,
    price: row.price,
    priceType: row.is_free ? "free" : "paid",
    priceLabel: row.price_label,
    durationMin: row.duration_min,
    minAge: row.min_age,
    maxAge: row.max_age,
    location: row.location ?? "",
    neighborhood: row.neighborhood ?? "",
    city: row.city,
    country: row.country,
    schedules: row.activity_schedules.map((s) => ({
      weekday: s.weekday,
      startTime: toHHMM(s.start_time),
      endTime: toHHMM(s.end_time),
      isFlexible: s.is_flexible ?? false,
    })),
    imageColor: "#FF5C35",                          // color por defecto hasta tener imagen
    imagePath: mainImage ?? "",
    images: sortedImages,
    isPublished: row.is_published,
  };
}

// ---------------------------------------------------------------------------
// Queries de perfil
// ---------------------------------------------------------------------------

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single<DbProfile>();
  return data;
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: {
    account_type?: AccountType;
    beneficiary_name?: string | null;
    beneficiary_age?: number | null;
    display_name?: string;
    avatar_url?: string;
  }
) {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);
  return { error };
}

// ---------------------------------------------------------------------------
// Queries de proveedor
// ---------------------------------------------------------------------------

export async function getProviderByUserId(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single<DbProvider>();
  return data ? mapDbProvider(data) : null;
}

export async function getProviderById(supabase: SupabaseClient, providerId: string) {
  const { data } = await supabase
    .from("providers")
    .select("*")
    .eq("id", providerId)
    .single<DbProvider>();
  return data ? mapDbProvider(data) : null;
}

export async function createProvider(supabase: SupabaseClient, data: InsertProvider) {
  const { data: row, error } = await supabase
    .from("providers")
    .insert(data)
    .select()
    .single<DbProvider>();
  return { provider: row ? mapDbProvider(row) : null, error };
}

export async function updateProviderData(
  supabase: SupabaseClient,
  providerId: string,
  updates: UpdateProvider
) {
  const { error } = await supabase
    .from("providers")
    .update(updates)
    .eq("id", providerId);
  return { error };
}

// ---------------------------------------------------------------------------
// Queries de actividades (públicas)
// ---------------------------------------------------------------------------

const ACTIVITY_SELECT = `
  *,
  activity_schedules (*),
  activity_images (url, sort_order),
  providers (name, website, avatar_url)
`;

export async function getPublishedActivities(supabase: SupabaseClient): Promise<Activity[]> {
  const { data } = await supabase
    .from("activities")
    .select(ACTIVITY_SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .returns<DbActivityFull[]>();
  return (data ?? []).map(mapDbActivity);
}

export async function getActivityById(supabase: SupabaseClient, id: string): Promise<Activity | null> {
  const { data } = await supabase
    .from("activities")
    .select(ACTIVITY_SELECT)
    .eq("id", id)
    .single<DbActivityFull>();
  return data ? mapDbActivity(data) : null;
}

// ---------------------------------------------------------------------------
// Queries de actividades del proveedor (incluye no publicadas)
// ---------------------------------------------------------------------------

export async function getProviderActivities(
  supabase: SupabaseClient,
  providerId: string
): Promise<Activity[]> {
  const { data } = await supabase
    .from("activities")
    .select(ACTIVITY_SELECT)
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false })
    .returns<DbActivityFull[]>();
  return (data ?? []).map(mapDbActivity);
}

// ---------------------------------------------------------------------------
// Mutations de actividades
// ---------------------------------------------------------------------------

export async function createActivity(
  supabase: SupabaseClient,
  activity: InsertActivity,
  schedules: InsertSchedule[],
  imageUrls: string[]
) {
  // 1. Crear la actividad
  const { data: actRow, error: actError } = await supabase
    .from("activities")
    .insert(activity)
    .select("id")
    .single<{ id: string }>();

  if (actError || !actRow) return { error: actError };

  // 2. Insertar horarios
  if (schedules.length > 0) {
    const { error: schError } = await supabase
      .from("activity_schedules")
      .insert(schedules.map((s) => ({ ...s, activity_id: actRow.id })));
    if (schError) return { error: schError };
  }

  // 3. Registrar URLs de imágenes (ya subidas a Storage)
  if (imageUrls.length > 0) {
    const { error: imgError } = await supabase
      .from("activity_images")
      .insert(
        imageUrls.map((url, i) => ({ activity_id: actRow.id, url, sort_order: i }))
      );
    if (imgError) return { error: imgError };
  }

  return { activityId: actRow.id, error: null };
}

export async function updateActivity(
  supabase: SupabaseClient,
  activityId: string,
  updates: UpdateActivity,
  newSchedules?: InsertSchedule[],
  newImageUrls?: string[]
) {
  const { error: updError } = await supabase
    .from("activities")
    .update(updates)
    .eq("id", activityId);

  if (updError) return { error: updError };

  // Reemplazar horarios si se proporcionan
  if (newSchedules !== undefined) {
    await supabase.from("activity_schedules").delete().eq("activity_id", activityId);
    if (newSchedules.length > 0) {
      await supabase
        .from("activity_schedules")
        .insert(newSchedules.map((s) => ({ ...s, activity_id: activityId })));
    }
  }

  // Agregar nuevas imágenes si se proporcionan
  if (newImageUrls !== undefined && newImageUrls.length > 0) {
    await supabase.from("activity_images").delete().eq("activity_id", activityId);
    await supabase
      .from("activity_images")
      .insert(newImageUrls.map((url, i) => ({ activity_id: activityId, url, sort_order: i })));
  }

  return { error: null };
}

export async function toggleActivityPublished(
  supabase: SupabaseClient,
  activityId: string,
  isPublished: boolean
) {
  const { error } = await supabase
    .from("activities")
    .update({ is_published: isPublished })
    .eq("id", activityId);
  return { error };
}

// ---------------------------------------------------------------------------
// Agenda del usuario
// ---------------------------------------------------------------------------

export async function addAgendaItem(
  supabase: SupabaseClient,
  item: {
    user_id: string;
    activity_id: string;
    date: string;        // "YYYY-MM-DD"
    start_time: string;  // "HH:MM"
    end_time: string;    // "HH:MM"
  }
) {
  const { error } = await supabase
    .from("agenda_items")
    .insert(item);
  return { error };
}

/** Item de agenda enriquecido con datos de la actividad para la UI. */
export interface AgendaItemView {
  id: string;
  activityId: string;
  activityTitle: string;
  activityDescription: string;
  categoryId: string;
  location: string;    // dirección legible para el calendario
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:MM"
  endTime: string;     // "HH:MM"
  status: AgendaStatus;
}

interface DbAgendaRow {
  id: string;
  activity_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: AgendaStatus;
  activities: {
    title: string;
    description: string;
    category_id: string;
    location: string | null;
    neighborhood: string | null;
    city: string | null;
  } | null;
}

export async function getAgendaItems(
  supabase: SupabaseClient,
  userId: string
): Promise<AgendaItemView[]> {
  const { data } = await supabase
    .from("agenda_items")
    .select(
      "id, activity_id, date, start_time, end_time, status, activities (title, description, category_id, location, neighborhood, city)"
    )
    .eq("user_id", userId)
    .order("date", { ascending: true })
    .returns<DbAgendaRow[]>();

  return (data ?? []).map((row) => ({
    id: row.id,
    activityId: row.activity_id,
    activityTitle: row.activities?.title ?? "Actividad",
    activityDescription: row.activities?.description ?? "",
    categoryId: row.activities?.category_id ?? "",
    location: [
      row.activities?.location,
      row.activities?.neighborhood,
      row.activities?.city,
    ]
      .filter(Boolean)
      .join(", "),
    date: row.date,
    startTime: toHHMM(row.start_time),
    endTime: toHHMM(row.end_time),
    status: row.status,
  }));
}

export async function removeAgendaItem(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("agenda_items").delete().eq("id", id);
  return { error };
}

// ---------------------------------------------------------------------------
// Upload de imágenes a Supabase Storage
// ---------------------------------------------------------------------------

export async function uploadActivityImage(
  supabase: SupabaseClient,
  providerId: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${providerId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("activity-images")
    .upload(path, file, { upsert: false });

  if (error) return null;

  const { data: urlData } = supabase.storage
    .from("activity-images")
    .getPublicUrl(path);

  return urlData.publicUrl;
}

export async function uploadProviderAvatar(
  supabase: SupabaseClient,
  userId: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from("provider-avatars")
    .upload(path, file, { upsert: true });

  if (error) return null;

  const { data: urlData } = supabase.storage
    .from("provider-avatars")
    .getPublicUrl(path);

  return urlData.publicUrl;
}
