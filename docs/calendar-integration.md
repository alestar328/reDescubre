# Añadir actividades al calendario (Google / Apple / Outlook)

Esta funcionalidad permite que, tras añadir una actividad a su agenda dentro de
Re-descubre, el usuario la exporte a su **Google Calendar**, **Apple Calendar**
u **Outlook**, recibiendo así los recordatorios nativos de su móvil.

## Cómo funciona (resumen técnico)

Se usa el enfoque estándar de **enlaces de calendario + archivo `.ics`**, no la
API de Google Calendar. Motivos:

- **Apple no ofrece una API web de calendario.** El archivo `.ics` (RFC 5545)
  es la única vía para Apple Calendar, y además sirve para Google, Outlook y
  cualquier otra app.
- **Cero configuración de servicios ni OAuth.** No hay que registrar la app en
  Google Cloud, no se piden permisos extra al usuario, no se guardan tokens y no
  hay backend que mantener. Funciona de inmediato.
- Es lo que usan la mayoría de plataformas de eventos (Eventbrite, Meetup…).

### Piezas implementadas

| Archivo | Rol |
|---|---|
| `lib/calendar/calendar-export.ts` | Lógica pura: genera el enlace de Google, el de Outlook y el archivo `.ics`. Convierte la hora local de Madrid a UTC (con horario de verano correcto). |
| `components/calendar/AddToCalendarMenu.tsx` | Lista de botones (Google / Apple / Outlook / Descargar `.ics`). Reutilizable. |
| `components/calendar/AddToCalendarSheet.tsx` | Hoja modal que envuelve el menú, para usar desde la agenda. |
| `components/activities/AddToAgendaModal.tsx` | Tras guardar en la agenda, muestra el menú de calendario (estado de éxito). |
| `components/agenda/*` | Cada actividad de la agenda tiene un icono 📅 para exportarla cuando quieras. |

### Flujo UX

1. El usuario pulsa **"Añadir a mi agenda"** en una actividad y elige día/hora.
2. Al confirmar, se guarda en Supabase (`agenda_items`) **y** el modal cambia a
   un estado de éxito: _"¡Añadida a tu agenda! Añádela también a tu calendario"_
   con los botones de Google / Apple / Outlook.
3. Desde **Mi Agenda**, cada bloque de actividad tiene un icono de calendario
   para exportarla en cualquier momento (abre la hoja modal con las mismas
   opciones).

Comportamiento de cada botón:

- **Google Calendar / Outlook** → abre una pestaña nueva con el evento
  pre-rellenado (título, fecha/hora, ubicación, descripción y enlace a la
  actividad). El usuario solo pulsa "Guardar".
- **Apple Calendar / Descargar `.ics`** → descarga un archivo `.ics`. En
  macOS/iOS se abre directamente en la app Calendario; en Windows/Android lo
  abre la app de calendario por defecto.

---

## Configuración necesaria

### ✅ Lo que NO necesitas

- **No** hace falta proyecto en Google Cloud.
- **No** hace falta API key, OAuth, scopes ni pantalla de consentimiento.
- **No** hace falta nada en Apple.
- **No** hace falta migración de base de datos (se reutilizan los datos que ya
  tienes de la actividad: título, ubicación, descripción).

La funcionalidad ya está operativa al desplegar el código.

### 🔧 Recomendado (1 variable de entorno)

La zona horaria por defecto es `Europe/Madrid` (las actividades son presenciales
en Barcelona), definida en `lib/calendar/calendar-export.ts` (`DEFAULT_TZ`). Si
algún día hay actividades en otra zona, pásala por la propiedad `timeZone` del
evento. No requiere configuración para el caso actual.

Opcionalmente, para que el enlace "Ver actividad" del evento use el dominio de
producción en vez de `window.location.origin`, puedes definir:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://re-descubre.vercel.app
```

> Nota: el código actual ya construye la URL con `window.location.origin`, que
> funciona en cliente. La variable solo sería útil si en el futuro generas los
> `.ics` en el servidor.

---

## (Opcional / avanzado) Sincronización real con la API de Google Calendar

Solo si en el futuro quieres que la app **escriba directamente** en el Google
Calendar del usuario (sin que él pulse "Guardar"), o sincronizar cambios en dos
direcciones. **No es necesario para la funcionalidad actual** y añade bastante
mantenimiento. Pasos que requeriría:

1. **Google Cloud Console** → crear proyecto.
2. **APIs y servicios → Biblioteca** → habilitar **Google Calendar API**.
3. **Pantalla de consentimiento OAuth**:
   - Tipo de usuario: Externo.
   - Scopes: `https://www.googleapis.com/auth/calendar.events`.
   - Mientras esté en modo "Prueba", añade los correos de prueba. Para producción
     Google exige **verificación de la app** (revisión que puede tardar semanas,
     porque `calendar.events` es un scope sensible).
4. **Credenciales → ID de cliente OAuth** (tipo "Aplicación web"):
   - Orígenes autorizados: `https://re-descubre.vercel.app`, `http://localhost:3000`.
   - URI de redirección: `https://re-descubre.vercel.app/api/google/callback`.
5. Guardar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en variables de entorno de
   Vercel (el secret **nunca** en `NEXT_PUBLIC_*`).
6. Implementar el flujo OAuth (consentimiento → intercambio de código por tokens
   → guardar `refresh_token` por usuario en Supabase) y llamar a
   `POST https://www.googleapis.com/calendar/v3/calendars/primary/events`.

> Para **Apple** no existe equivalente: la sincronización directa solo es posible
> vía **CalDAV** con credenciales del usuario (complejo y poco habitual en web).
> Por eso el `.ics` sigue siendo la mejor opción multiplataforma.

**Recomendación:** quédate con el enfoque actual (enlaces + `.ics`) salvo que un
requisito de producto exija escritura automática en el calendario.
