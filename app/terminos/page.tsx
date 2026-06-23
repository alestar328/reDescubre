import type { Metadata } from "next";

/**
 * Términos y Condiciones del Servicio — página pública requerida por Google
 * para la pantalla de consentimiento de OAuth (Terms of Service link).
 * URL pública: https://redescubreapp.com/terminos
 *
 * ⚠️ Revisa los valores marcados antes de publicar y considera una revisión
 * legal si la plataforma maneja pagos o datos de menores a gran escala.
 */

const BRAND = "Re-descubre app";
const SITE = "https://redescubreapp.com";
const CONTACT_EMAIL = "soporte-redescubre@googlegroups.com";
const LAST_UPDATED = "23 de junio de 2026";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: `Términos y condiciones de uso de ${BRAND}: derechos, obligaciones y reglas de la plataforma.`,
  alternates: { canonical: `${SITE}/terminos` },
  robots: { index: true, follow: true },
};

export default function TerminosPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
        Términos y Condiciones del Servicio
      </h1>
      <p className="mt-2 text-sm text-ink/60">Última actualización: {LAST_UPDATED}</p>

      <div className="prose-policy mt-8 space-y-8 text-ink/90">
        <section className="space-y-3">
          <h2 className="text-xl font-bold">1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar <strong>{BRAND}</strong> (en adelante, &laquo;la Plataforma&raquo;),
            disponible en{" "}
            <a href={SITE} className="text-primary underline">
              {SITE}
            </a>
            , aceptas quedar vinculado por estos Términos y Condiciones. Si no estás de acuerdo con
            ellos, te pedimos que no utilices la Plataforma.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">2. Descripción del servicio</h2>
          <p>
            {BRAND} es una plataforma que conecta a jóvenes y familias con actividades presenciales
            saludables en Barcelona y alrededores, ofrecidas por terceros proveedores (academias,
            escuelas, talleres y organizaciones). La Plataforma actúa como{" "}
            <strong>intermediario de descubrimiento</strong>: facilita encontrar y organizar
            actividades, pero no organiza ni imparte directamente dichas actividades.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">3. Menores de edad y consentimiento parental</h2>
          <p>
            La Plataforma está dirigida a jóvenes de 12 a 25 años. Si eres <strong>menor de
            edad</strong>, declaras que cuentas con el consentimiento y la supervisión de tu padre,
            madre o tutor legal para utilizar la Plataforma y para inscribirte en cualquier
            actividad. Los padres o tutores son responsables de revisar y aprobar el uso que los
            menores hacen del servicio. La contratación o asistencia a actividades por parte de
            menores requiere la autorización del responsable legal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">4. Registro y cuenta</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Para acceder a determinadas funciones debes crear una cuenta, que puedes iniciar con
              tu cuenta de Google.
            </li>
            <li>
              Te comprometes a proporcionar información veraz y a mantenerla actualizada.
            </li>
            <li>
              Eres responsable de la actividad que se realice desde tu cuenta y de mantener la
              confidencialidad de tu acceso.
            </li>
            <li>
              Puedes solicitar la eliminación de tu cuenta en cualquier momento escribiéndonos a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">
                {CONTACT_EMAIL}
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">5. Uso aceptable</h2>
          <p>Al utilizar la Plataforma te comprometes a no:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Usarla con fines ilícitos, fraudulentos o que perjudiquen a terceros.</li>
            <li>Publicar contenido falso, ofensivo, difamatorio o que infrinja derechos de otros.</li>
            <li>Intentar acceder sin autorización a sistemas, cuentas o datos de la Plataforma.</li>
            <li>Interferir en el funcionamiento normal del servicio o introducir software malicioso.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">6. Actividades y proveedores</h2>
          <p>
            Las actividades mostradas son ofrecidas por proveedores independientes. {BRAND} no
            garantiza la disponibilidad, calidad, seguridad ni idoneidad de las actividades, ni es
            parte de la relación contractual que pueda surgir entre el usuario y el proveedor. La
            información sobre precios, horarios y condiciones es responsabilidad de cada proveedor;
            te recomendamos verificarla directamente con ellos antes de inscribirte.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">7. Propiedad intelectual</h2>
          <p>
            La marca, el logotipo, el diseño y los contenidos propios de la Plataforma están
            protegidos por derechos de propiedad intelectual e industrial y pertenecen a {BRAND} o a
            sus licenciantes. No está permitido reproducirlos, distribuirlos ni utilizarlos sin
            autorización previa.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">8. Limitación de responsabilidad</h2>
          <p>
            La Plataforma se ofrece &laquo;tal cual&raquo;, especialmente durante su fase beta. En la
            medida permitida por la ley, {BRAND} no será responsable de los daños derivados del uso o
            de la imposibilidad de uso del servicio, ni de las actividades contratadas con
            proveedores terceros. Nada en estos términos limita la responsabilidad que no pueda
            excluirse legalmente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">9. Protección de datos</h2>
          <p>
            El tratamiento de tus datos personales se rige por nuestra{" "}
            <a href={`${SITE}/privacidad`} className="text-primary underline">
              Política de Privacidad
            </a>
            , que forma parte integrante de estos Términos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">10. Modificaciones y vigencia</h2>
          <p>
            Podemos modificar estos Términos para adaptarlos a cambios en el servicio o en la
            normativa. Publicaremos la versión vigente en esta página con su fecha de actualización.
            El uso continuado de la Plataforma tras una modificación implica su aceptación.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">11. Ley aplicable y jurisdicción</h2>
          <p>
            Estos Términos se rigen por la legislación española. Para cualquier controversia, las
            partes se someten a los juzgados y tribunales competentes conforme a la normativa
            aplicable en materia de consumidores y usuarios.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">12. Contacto</h2>
          <p>
            Para cualquier duda sobre estos Términos puedes escribirnos a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
