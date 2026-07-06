"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/profile", label: "Profile", icon: "👤" },
  { href: "/admin/skills", label: "Skills", icon: "🛠️" },
  { href: "/admin/projects", label: "Projects", icon: "📁" },
  { href: "/admin/experience", label: "Experience", icon: "💼" },
  { href: "/admin/education", label: "Education", icon: "🎓" },
  { href: "/admin/services", label: "Services", icon: "✨" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "💬" },
  { href: "/admin/messages", label: "Messages", icon: "📨" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/admin/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-[rgb(var(--muted))]">
        Loading...
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex md:flex-col w-64 border-r border-[rgb(var(--border))] bg-[rgb(var(--card))]">
        <div className="p-5 border-b border-[rgb(var(--border))]">
          <Link href="/" className="font-bold text-lg">Portfolio Admin</Link>
          <p className="text-xs text-[rgb(var(--muted))] mt-1">{session.user?.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = pathname === n.href || (n.href !== "/admin" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-accent-500/10 text-accent-600 dark:text-accent-500 font-medium"
                    : "hover:bg-[rgb(var(--bg))] text-[rgb(var(--muted))]"
                }`}
              >
                <span>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[rgb(var(--border))] space-y-1">
          <Link href="/" className="block px-3 py-2 rounded-lg text-sm hover:bg-[rgb(var(--bg))]">
            🏠 View site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[rgb(var(--bg))] text-red-500"
          >
            🚪 Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden border-b border-[rgb(var(--border))] p-3 flex items-center justify-between">
          <Link href="/admin" className="font-bold">Admin</Link>
          <button onClick={() => signOut()} className="text-sm text-red-500">Sign out</button>
        </header>
        <div className="md:hidden border-b border-[rgb(var(--border))] overflow-x-auto">
          <div className="flex gap-1 p-2 min-w-max">
            {nav.map((n) => {
              const active = pathname === n.href || (n.href !== "/admin" && pathname?.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${
                    active ? "bg-accent-500 text-white" : "bg-[rgb(var(--card))]"
                  }`}
                >
                  {n.icon} {n.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex-1 p-6 sm:p-8 max-w-5xl w-full mx-auto">{children}</div>
      </div>
    </div>
  );
}
