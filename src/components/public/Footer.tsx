import { prisma } from "@/lib/prisma";

export async function Footer() {
  const profile = await prisma.profile.findFirst();
  const name = profile?.fullName ?? "Portfolio";
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[rgb(var(--border))] mt-24">
      <div className="container-x py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[rgb(var(--muted))]">
        <p>© {year} {name}. All rights reserved.</p>
        <p>
          Built with <span className="text-accent-500">Next.js</span>
        </p>
      </div>
    </footer>
  );
}
