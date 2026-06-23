-- =============================================================================
-- Re-descubre app — Fix de privilegios (GRANT) y política de avatar en Storage
-- Pegar en el SQL Editor de Supabase Dashboard y ejecutar.
-- =============================================================================
--
-- Soluciona:
--   1. Error 42501 "permission denied for table ..." al insertar/leer.
--      Faltaban los GRANT a nivel de tabla para anon/authenticated. RLS solo
--      filtra FILAS; sin estos GRANT el rol no puede ni tocar la tabla.
--   2. Error 400 al subir el avatar del proveedor. La política antigua exigía
--      que el proveedor ya existiera, pero el avatar se sube ANTES de crear el
--      registro. Ahora basta con que la carpeta raíz coincida con el uid.
-- =============================================================================


-- =============================================================================
-- 1. PRIVILEGIOS A NIVEL DE TABLA (los que aplica Supabase por defecto)
-- =============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Tablas existentes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Secuencias existentes
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Privilegios por defecto para tablas/secuencias que se creen en el futuro
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;


-- =============================================================================
-- 2. POLÍTICA DE AVATAR EN STORAGE (sin dependencia del registro de proveedor)
-- =============================================================================

-- Eliminar la política antigua que exigía proveedor existente
DROP POLICY IF EXISTS "Providers can upload their avatar" ON storage.objects;

-- Subir avatar: el usuario autenticado solo puede escribir en su propia carpeta
-- (la ruta es `${uid}/avatar.ext`)
CREATE POLICY "Users can upload their own provider avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'provider-avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Actualizar/sobrescribir su propio avatar (uploadProviderAvatar usa upsert: true,
-- por lo que también necesita permiso de UPDATE sobre el objeto existente)
CREATE POLICY "Users can update their own provider avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'provider-avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
