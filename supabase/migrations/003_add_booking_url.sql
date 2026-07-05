-- =============================================================================
-- 003: Enlace de reservas externo
-- Algunos proveedores gestionan la asistencia en su propia plataforma
-- (Booksy, Calendly, su web...). Si booking_url está presente, la ficha y el
-- modal de agenda muestran un CTA "Reservar" que lleva a ese enlace.
-- =============================================================================

ALTER TABLE public.activities
  ADD COLUMN booking_url TEXT;
