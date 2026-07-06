import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminHome() {
  const [profile, skills, projects, experiences, educations, services, testimonials, unreadMessages] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.count(),
      prisma.project.count(),
      prisma.experience.count(),
      prisma.education.count(),
      prisma.service.count(),
      prisma.testimonial.count(),
      prisma.message.count({ where: { read: false } }),
    ]);

  const stats = [
    { label: "Profile", value: profile ? "✓ Set" : "Empty", href: "/admin/profile", color: profile ? "text-green-500" : "text-amber-500" },
    { label: "Skills", value: skills, href: "/admin/skills" },
    { label: "Projects", value: projects, href: "/admin/projects" },
    { label: "Experience", value: experiences, href: "/admin/experience" },
    { label: "Education", value: educations, href: "/admin/education" },
    { label: "Services", value: services, href: "/admin/services" },
    { label: "Testimonials", value: testimonials, href: "/admin/testimonials" },
    { label: "Messages", value: unreadMessages, href: "/admin/messages", highlight: unreadMessages > 0 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-[rgb(var(--muted))] mt-1">Welcome back! Manage your portfolio content below.</p>

      {!profile && (
        <div className="mt-6 card p-4 border-amber-500/50 bg-amber-500/5">
          <p className="text-sm">
            <strong>Heads up:</strong> Your profile is empty.{" "}
            <Link href="/admin/profile" className="text-accent-500 underline">Set it up now</Link>{" "}
            to make the site look complete.
          </p>
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`card p-5 hover:border-accent-500 transition-colors ${
              s.highlight ? "border-accent-500 bg-accent-500/5" : ""
            }`}
          >
            <div className="text-sm text-[rgb(var(--muted))]">{s.label}</div>
            <div className={`text-2xl font-bold mt-1 ${s.color ?? ""}`}>{s.value}</div>
            {s.highlight && (
              <div className="text-xs text-accent-500 mt-1">Unread messages</div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-10 card p-5">
        <h2 className="font-semibold">Quick tips</h2>
        <ul className="mt-2 text-sm text-[rgb(var(--muted))] space-y-1 list-disc list-inside">
          <li>Start by filling in your Profile (name, title, bio, social links)</li>
          <li>Add 3-6 skills grouped by category (e.g. Frontend, Backend)</li>
          <li>Upload project showcases with images, demo, and source links</li>
          <li>Mark a project as "Featured" to highlight it</li>
        </ul>
      </div>
    </div>
  );
}
