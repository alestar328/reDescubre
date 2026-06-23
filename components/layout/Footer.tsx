import Link from "next/link";
import { Waves } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Waves className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white">
                Re-descubre
              </span>
            </Link>
            <p className="text-sm text-white/60 max-w-xs">
              Actividades chulas para conectar contigo, con tus amigos o nuevos amigos. Menos pantallas, más vida — agenda actividades y añádelas a tu calendario personal.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wide">
              Explorar
            </p>
            <ul className="space-y-2">
              {[
                { href: "/actividades", label: "Todas las actividades" },
                { href: "/#como-funciona", label: "Cómo funciona" },
                { href: "/agenda", label: "Mi agenda" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Proveedores */}
          <div>
            <p className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wide">
              Proveedores
            </p>
            <ul className="space-y-2">
              {[
                { href: "/proveedores", label: "Añade tu actividad" },
                { href: "/proveedores", label: "Para academias" },
                { href: "/proveedores", label: "Contacto" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wide">
              Legal
            </p>
            <ul className="space-y-2">
              {[
                { href: "/privacidad", label: "Política de privacidad" },
                { href: "/terminos", label: "Términos y condiciones" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            © 2026 Re-descubre. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/40">
            Hecho con ❤️ en Barcelona
          </p>
        </div>
      </div>
    </footer>
  );
}
