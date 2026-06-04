"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Waves, LogIn, LogOut, LayoutDashboard, ChevronDown, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/actividades", label: "Explorar" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/proveedores", label: "Para proveedores" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar el menú de usuario al hacer clic fuera
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const isProvider = user?.accountType === "proveedor";
  const dashboardHref = isProvider ? "/proveedor/dashboard" : "/agenda";
  const profileHref = isProvider ? "/proveedor/perfil" : "/perfil";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Waves className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-800 text-ink text-base leading-tight hidden sm:block">
              Re-descubre
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-light hover:text-ink transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-1 py-0.5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoading && !user && (
              <Link
                href="/agenda"
                className="text-sm font-medium text-ink-light hover:text-ink transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-3 py-2"
              >
                Mi agenda
              </Link>
            )}

            {isLoading ? (
              // Esqueleto mientras carga la sesión
              <div className="w-8 h-8 rounded-full bg-border animate-pulse" />
            ) : user ? (
              // Usuario autenticado: avatar + menú desplegable
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-full pl-1 pr-2 py-1 hover:bg-sand transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-label="Menú de usuario"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-border">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-primary">
                        {user.displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-ink max-w-[120px] truncate hidden lg:block">
                    {user.displayName}
                  </span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-ink-light transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-border py-1.5 z-50">
                    <Link
                      href={dashboardHref}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-sand transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-ink-light" />
                      {isProvider ? "Mi panel" : "Mi agenda"}
                    </Link>
                    <Link
                      href={profileHref}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-sand transition-colors"
                    >
                      <UserRound className="w-4 h-4 text-ink-light" />
                      Mi perfil
                    </Link>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-sand transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-ink-light" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Sin sesión
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-sm font-medium text-ink-light hover:text-ink transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-3 py-2"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
            )}

            <Link
              href="/actividades"
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Explorar
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-ink hover:bg-sand transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-ink py-3 px-2 rounded-lg hover:bg-sand transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                {/* Información del usuario autenticado */}
                <div className="flex items-center gap-3 py-3 px-2 border-t border-border mt-1">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 border border-border">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-primary">
                        {user.displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-ink truncate">{user.displayName}</span>
                </div>
                <Link
                  href={dashboardHref}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-medium text-ink py-3 px-2 rounded-lg hover:bg-sand transition-colors duration-200"
                >
                  <LayoutDashboard className="w-4 h-4 text-ink-light" />
                  {isProvider ? "Mi panel" : "Mi agenda"}
                </Link>
                <Link
                  href={profileHref}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-medium text-ink py-3 px-2 rounded-lg hover:bg-sand transition-colors duration-200"
                >
                  <UserRound className="w-4 h-4 text-ink-light" />
                  Mi perfil
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut(); }}
                  className="flex items-center gap-2 text-base font-medium text-ink py-3 px-2 rounded-lg hover:bg-sand transition-colors duration-200 text-left"
                >
                  <LogOut className="w-4 h-4 text-ink-light" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/agenda"
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-ink py-3 px-2 rounded-lg hover:bg-sand transition-colors duration-200"
                >
                  Mi agenda
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-medium text-ink py-3 px-2 rounded-lg hover:bg-sand transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
              </>
            )}

            <Link
              href="/actividades"
              onClick={() => setMenuOpen(false)}
              className="mt-2 text-center text-base font-medium bg-primary text-white py-3 px-4 rounded-full hover:bg-primary-dark transition-colors duration-200"
            >
              Explorar actividades
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
