"use client";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled
          ? "bg-[rgb(var(--bg))]/80 backdrop-blur-md border-b border-[rgb(var(--border))]"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Portfolio
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm hover:text-accent-500 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-[rgb(var(--card))] transition-colors"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <Link href="/admin/login" className="text-sm text-[rgb(var(--muted))] hover:text-accent-500">
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
