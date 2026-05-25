"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/actividades", label: "Explorar" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/proveedores", label: "Para proveedores" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <Link
              href="/agenda"
              className="text-sm font-medium text-ink-light hover:text-ink transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-3 py-2"
            >
              Mi agenda
            </Link>
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
            <Link
              href="/agenda"
              onClick={() => setMenuOpen(false)}
              className="text-base font-medium text-ink py-3 px-2 rounded-lg hover:bg-sand transition-colors duration-200"
            >
              Mi agenda
            </Link>
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
