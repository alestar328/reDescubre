import type { Metadata } from "next";

/**
 * Política de Privacidad — página pública requerida por Google para la
 * pantalla de consentimiento de OAuth.
 * URL pública: https://redescubreapp.com/privacidad
 *
 * ⚠️ Revisa los valores marcados con TODO antes de publicar:
 *   - CONTACT_EMAIL: pon el correo del grupo de soporte que configuraste.
 *   - Datos de la entidad responsable (nombre legal / autónomo) si aplica.
 */

const BRAND = "Re-descubre app";
const SITE = "https://redescubreapp.com";
const CONTACT_EMAIL = "soporte-redescubre@googlegroups.com";
const LAST_UPDATED = "23 de junio de 2026";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: `Política de privacidad de ${BRAND}: qué datos recogemos, con qué fines y cuáles son tus derechos.`,
  alternates: { canonical: `${SITE}/privacidad` },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
        Política de Privacidad
      </h1>
      <p className="mt-2 text-sm text-ink/60">Última actualización: {LAST_UPDATED}</p>

      <div className="prose-policy mt-8 space-y-8 text-ink/90">
        <section className="space-y-3">
          <h2 className="text-xl font-bold">1. Responsable del tratamiento</h2>
          <p>
            El responsable del tratamiento de tus datos personales es el equipo de{" "}
            <strong>{BRAND}</strong> (en adelante, &laquo;la Plataforma&raquo;), accesible a través
            de{" "}
            <a href={SITE} className="text-primary underline">
              {SITE}
            </a>
            . Puedes contactarnos en cualquier momento escribiendo a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">2. Qué datos recogemos</h2>
          <p>Tratamos únicamente los datos necesarios para prestar el servicio:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Datos de tu cuenta de Google</strong> (cuando inicias sesión con Google):
              nombre, dirección de correo electrónico y foto de perfil. Estos datos nos los
              proporciona Google con tu consentimiento al autenticarte.
            </li>
            <li>
              <strong>Datos de perfil dentro de la Plataforma</strong>: la información que tú
              añades o editas en tu perfil (por ejemplo, preferencias de actividades).
            </li>
            <li>
              <strong>Datos de uso técnico</strong>: información básica de navegación necesaria para
              mantener tu sesión segura y para el funcionamiento del sitio.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">3. Con qué finalidad y base legal</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Crear y gestionar tu cuenta</strong> y permitirte el acceso a la Plataforma —
              base legal: ejecución del servicio que solicitas.
            </li>
            <li>
              <strong>Mostrarte actividades y contenidos relevantes</strong> — base legal: tu
              consentimiento y el interés legítimo en ofrecerte una buena experiencia.
            </li>
            <li>
              <strong>Garantizar la seguridad</strong> de la Plataforma y prevenir el fraude — base
              legal: interés legítimo.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">4. Con quién compartimos tus datos</h2>
          <p>
            No vendemos tus datos. Solo los compartimos con proveedores que nos ayudan a operar la
            Plataforma, que actúan como encargados del tratamiento bajo nuestras instrucciones:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Supabase</strong> — autenticación y base de datos donde se almacena tu cuenta.
            </li>
            <li>
              <strong>Vercel</strong> — alojamiento e infraestructura del sitio web.
            </li>
            <li>
              <strong>Google</strong> — proveedor de inicio de sesión cuando eliges autenticarte con
              tu cuenta de Google.
            </li>
          </ul>
          <p>
            Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo. En
            esos casos se aplican las garantías adecuadas (como las Cláusulas Contractuales Tipo de
            la UE).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">5. Cuánto tiempo conservamos tus datos</h2>
          <p>
            Conservamos tus datos mientras mantengas tu cuenta activa. Si solicitas la eliminación
            de tu cuenta, borraremos tus datos personales salvo aquellos que debamos conservar por
            obligación legal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">6. Tus derechos</h2>
          <p>
            Conforme al Reglamento General de Protección de Datos (RGPD), tienes derecho a acceder,
            rectificar, suprimir y portar tus datos, así como a oponerte o limitar su tratamiento y
            a retirar tu consentimiento en cualquier momento. Para ejercer estos derechos,
            escríbenos a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">
              {CONTACT_EMAIL}
            </a>
            . También puedes presentar una reclamación ante la Agencia Española de Protección de
            Datos (
            <a href="https://www.aepd.es" className="text-primary underline" rel="noopener noreferrer" target="_blank">
              www.aepd.es
            </a>
            ).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">7. Cookies</h2>
          <p>
            Utilizamos únicamente cookies técnicas necesarias para mantener tu sesión iniciada y
            garantizar el funcionamiento del sitio. No usamos cookies de publicidad de terceros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">8. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad para reflejar cambios en el servicio o en
            la normativa. Publicaremos siempre la versión vigente en esta misma página, indicando la
            fecha de última actualización.
          </p>
        </section>
      </div>
    </article>
  );
}
