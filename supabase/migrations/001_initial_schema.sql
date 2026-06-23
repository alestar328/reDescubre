-- =============================================================================
-- Re-descubre app — Esquema inicial de base de datos
-- Pegar en el SQL Editor de Supabase Dashboard y ejecutar
-- =============================================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =============================================================================
-- TIPOS ENUMERADOS
-- =============================================================================

CREATE TYPE account_type AS ENUM ('explorer', 'beneficiary', 'proveedor');
CREATE TYPE agenda_status  AS ENUM ('planned', 'confirmed', 'attended');


-- =============================================================================
-- TABLA: profiles
-- Extiende auth.users. Se crea automáticamente tras el sign-up (trigger abajo).
-- =============================================================================

CREATE TABLE public.profiles (
  id               UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT        NOT NULL,
  display_name     TEXT,
  avatar_url       TEXT,
  account_type     account_type,               -- null hasta que el usuario complete el onboarding
  beneficiary_name TEXT,                       -- solo cuando account_type = 'beneficiary'
  beneficiary_age  SMALLINT CHECK (beneficiary_age BETWEEN 5 AND 30),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);


-- =============================================================================
-- TABLA: providers
-- Un usuario con account_type='proveedor' tiene un registro aquí (1:1).
-- =============================================================================

CREATE TABLE public.providers (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name             TEXT        NOT NULL,
  description      TEXT        NOT NULL,
  bio              TEXT,
  website          TEXT,
  location         TEXT,
  neighborhood     TEXT,
  city             TEXT        NOT NULL DEFAULT 'Barcelona',
  country          TEXT        NOT NULL DEFAULT 'España',
  avatar_url       TEXT,
  cover_image_url  TEXT,
  -- Rating calculado por trigger al insertar/eliminar en provider_reviews
  rating           NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  review_count     INTEGER     NOT NULL DEFAULT 0,
  is_verified      BOOLEAN     NOT NULL DEFAULT false,
  is_active        BOOLEAN     NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver proveedores activos
CREATE POLICY "Anyone can view active providers"
  ON public.providers FOR SELECT
  USING (is_active = true);

-- Solo el propietario puede modificar su registro
CREATE POLICY "Providers can update their own record"
  ON public.providers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create a provider"
  ON public.providers FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- =============================================================================
-- TABLA: activities
-- =============================================================================

CREATE TABLE public.activities (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id           UUID        NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title                 TEXT        NOT NULL,
  description           TEXT        NOT NULL,
  why_this_activity     TEXT,
  category_id           TEXT        NOT NULL,           -- 'exterior', 'playa', etc.
  duration_min          INTEGER     NOT NULL CHECK (duration_min > 0),
  is_free               BOOLEAN     NOT NULL DEFAULT false,
  has_free_trial_class  BOOLEAN     NOT NULL DEFAULT false,
  price                 NUMERIC(8,2),
  price_label           TEXT        NOT NULL DEFAULT '',
  min_age               SMALLINT    NOT NULL DEFAULT 12,
  max_age               SMALLINT    NOT NULL DEFAULT 25,
  location              TEXT,
  neighborhood          TEXT,
  city                  TEXT        NOT NULL DEFAULT 'Barcelona',
  country               TEXT        NOT NULL DEFAULT 'España',
  is_published          BOOLEAN     NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede ver actividades publicadas
CREATE POLICY "Anyone can view published activities"
  ON public.activities FOR SELECT
  USING (is_published = true);

-- El proveedor propietario puede ver todas sus actividades (incluso las no publicadas)
CREATE POLICY "Providers can view all their own activities"
  ON public.activities FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );

-- El proveedor propietario puede crear, editar y borrar sus actividades
CREATE POLICY "Providers can manage their activities"
  ON public.activities FOR INSERT
  WITH CHECK (
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can update their activities"
  ON public.activities FOR UPDATE
  USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can delete their activities"
  ON public.activities FOR DELETE
  USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );


-- =============================================================================
-- TABLA: activity_schedules
-- Franjas horarias semanales de cada actividad.
-- =============================================================================

CREATE TABLE public.activity_schedules (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID    NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  weekday     TEXT    NOT NULL,        -- 'Lunes', 'Martes', etc.
  start_time  TIME    NOT NULL,
  end_time    TIME    NOT NULL,
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

ALTER TABLE public.activity_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schedules of published activities"
  ON public.activity_schedules FOR SELECT
  USING (
    activity_id IN (
      SELECT id FROM public.activities WHERE is_published = true
    )
  );

CREATE POLICY "Providers can manage their activity schedules"
  ON public.activity_schedules FOR ALL
  USING (
    activity_id IN (
      SELECT a.id FROM public.activities a
      JOIN public.providers p ON p.id = a.provider_id
      WHERE p.user_id = auth.uid()
    )
  );


-- =============================================================================
-- TABLA: activity_images
-- Imágenes subidas a Supabase Storage para cada actividad.
-- =============================================================================

CREATE TABLE public.activity_images (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID        NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  sort_order  SMALLINT    NOT NULL DEFAULT 0,  -- 0 = imagen principal
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view images of published activities"
  ON public.activity_images FOR SELECT
  USING (
    activity_id IN (
      SELECT id FROM public.activities WHERE is_published = true
    )
  );

CREATE POLICY "Providers can manage their activity images"
  ON public.activity_images FOR ALL
  USING (
    activity_id IN (
      SELECT a.id FROM public.activities a
      JOIN public.providers p ON p.id = a.provider_id
      WHERE p.user_id = auth.uid()
    )
  );


-- =============================================================================
-- TABLA: provider_reviews
-- Valoraciones de proveedores por usuarios. Una por usuario+proveedor.
-- =============================================================================

CREATE TABLE public.provider_reviews (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID        NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID        REFERENCES public.activities(id) ON DELETE SET NULL,
  stars       SMALLINT    NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider_id, user_id)   -- una sola valoración por usuario y proveedor
);

ALTER TABLE public.provider_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON public.provider_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can submit a review"
  ON public.provider_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own review"
  ON public.provider_reviews FOR DELETE
  USING (auth.uid() = user_id);


-- =============================================================================
-- TABLA: agenda_items
-- Actividades añadidas a la agenda personal del usuario.
-- =============================================================================

CREATE TABLE public.agenda_items (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID          NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  date        DATE          NOT NULL,
  start_time  TIME          NOT NULL,
  end_time    TIME          NOT NULL,
  status      agenda_status NOT NULL DEFAULT 'planned',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  UNIQUE (user_id, activity_id, date)
);

ALTER TABLE public.agenda_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own agenda"
  ON public.agenda_items FOR ALL
  USING (auth.uid() = user_id);


-- =============================================================================
-- FUNCIÓN + TRIGGER: auto-crear profile al registrarse
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =============================================================================
-- FUNCIÓN + TRIGGER: recalcular rating del proveedor al cambiar una review
-- =============================================================================

CREATE OR REPLACE FUNCTION public.recalculate_provider_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  target_provider_id UUID;
BEGIN
  target_provider_id := COALESCE(NEW.provider_id, OLD.provider_id);

  UPDATE public.providers
  SET
    rating       = COALESCE((
                     SELECT ROUND(AVG(stars::numeric), 2)
                     FROM public.provider_reviews
                     WHERE provider_id = target_provider_id
                   ), 0),
    review_count = (
                     SELECT COUNT(*)
                     FROM public.provider_reviews
                     WHERE provider_id = target_provider_id
                   ),
    updated_at   = now()
  WHERE id = target_provider_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.provider_reviews
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_provider_rating();


-- =============================================================================
-- FUNCIÓN + TRIGGER: updated_at automático
-- =============================================================================

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER touch_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER touch_providers_updated_at
  BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER touch_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- =============================================================================
-- STORAGE BUCKETS (ejecutar en la consola SQL de Supabase)
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('activity-images',  'activity-images',  true, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('provider-avatars', 'provider-avatars', true, 2097152, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Política de lectura pública para las imágenes
CREATE POLICY "Public read access to activity images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('activity-images', 'provider-avatars'));

-- Proveedores pueden subir imágenes de actividades
CREATE POLICY "Providers can upload activity images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'activity-images'
    AND auth.uid() IN (SELECT user_id FROM public.providers)
  );

-- Proveedores pueden subir su avatar
CREATE POLICY "Providers can upload their avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'provider-avatars'
    AND auth.uid() IN (SELECT user_id FROM public.providers)
  );

-- Proveedores pueden borrar sus propias imágenes
CREATE POLICY "Providers can delete their images"
  ON storage.objects FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM public.providers));
