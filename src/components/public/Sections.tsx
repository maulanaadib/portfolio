import { prisma } from "@/lib/prisma";

type SocialLinks = { github?: string; linkedin?: string; twitter?: string; instagram?: string; website?: string };

function parseSocial(s: string | null | undefined): SocialLinks {
  if (!s) return {};
  try { return JSON.parse(s) as SocialLinks; } catch { return {}; }
}

export function socialIcon(key: string): string {
  const map: Record<string, string> = {
    github: "GitHub",
    linkedin: "LinkedIn",
    twitter: "Twitter",
    instagram: "Instagram",
    website: "Website",
  };
  return map[key] ?? key;
}

export async function Hero() {
  const profile = await prisma.profile.findFirst();
  if (!profile) {
    return (
      <section className="container-x pt-32 pb-20 text-center">
        <p className="text-[rgb(var(--muted))]">
          Profile belum diisi. <a href="/admin/login" className="text-accent-500 underline">Login admin</a> untuk mulai.
        </p>
      </section>
    );
  }
  return (
    <section className="container-x pt-32 pb-20 text-center">
      <div className="max-w-3xl mx-auto">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-28 h-28 rounded-full mx-auto mb-6 object-cover border-2 border-accent-500"
          />
        ) : (
          <div className="w-28 h-28 rounded-full mx-auto mb-6 bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-4xl text-white font-bold">
            {profile.fullName.charAt(0)}
          </div>
        )}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          Hi, I'm <span className="text-accent-500">{profile.fullName}</span>
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-[rgb(var(--muted))]">{profile.title}</p>
        {profile.tagline && <p className="mt-3 text-[rgb(var(--muted))]">{profile.tagline}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-primary">
              📄 Download CV
            </a>
          )}
          <a href="#contact" className="btn-secondary">
            ✉️ Contact Me
          </a>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
          {profile.location && <span className="text-[rgb(var(--muted))]">📍 {profile.location}</span>}
          {Object.entries(parseSocial(profile.socialLinks)).map(([k, v]) =>
            v ? (
              <a key={k} href={v} target="_blank" rel="noreferrer" className="text-[rgb(var(--muted))] hover:text-accent-500">
                {socialIcon(k)}
              </a>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}

export async function About() {
  const profile = await prisma.profile.findFirst();
  if (!profile) return null;
  return (
    <section id="about" className="container-x py-20">
      <div className="max-w-3xl mx-auto">
        <h2 className="section-title">About Me</h2>
        <p className="section-subtitle">A little bit about who I am and what I do</p>
        <div className="mt-8 text-lg leading-relaxed text-[rgb(var(--muted))] whitespace-pre-line">
          {profile.bio}
        </div>
        <div className="mt-8 grid sm:grid-cols-2 gap-4 text-sm">
          {profile.email && (
            <div className="card p-4">
              <div className="text-[rgb(var(--muted))]">Email</div>
              <a href={`mailto:${profile.email}`} className="font-medium hover:text-accent-500">{profile.email}</a>
            </div>
          )}
          {profile.phone && (
            <div className="card p-4">
              <div className="text-[rgb(var(--muted))]">Phone</div>
              <a href={`tel:${profile.phone}`} className="font-medium hover:text-accent-500">{profile.phone}</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export async function Skills() {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  if (skills.length === 0) return null;
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});
  return (
    <section id="skills" className="container-x py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Skills</h2>
        <p className="section-subtitle">Technologies and tools I work with</p>
        <div className="mt-10 space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {items.map((s) => (
                  <div key={s.id} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-sm text-[rgb(var(--muted))]">{s.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[rgb(var(--border))] overflow-hidden">
                      <div className="h-full bg-accent-500 transition-all" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function Projects() {
  const projects = await prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  if (projects.length === 0) return null;
  return (
    <section id="projects" className="container-x py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">Projects</h2>
        <p className="section-subtitle">Selected work and case studies</p>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const tags = p.tags.split(",").map((t) => t.trim()).filter(Boolean);
            return (
              <article key={p.id} className="card overflow-hidden flex flex-col hover:border-accent-500 transition-colors">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="h-44 w-full object-cover" />
                ) : (
                  <div className="h-44 w-full bg-gradient-to-br from-accent-500/30 to-accent-700/30 flex items-center justify-center text-5xl">
                    🗂️
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg">{p.title}</h3>
                    {p.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-500">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-[rgb(var(--muted))] flex-1">{p.description}</p>
                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-[rgb(var(--border))]/50 text-[rgb(var(--muted))]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    {p.demoUrl && (
                      <a href={p.demoUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm py-1.5 px-3">
                        Live Demo
                      </a>
                    )}
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noreferrer" className="btn-secondary text-sm py-1.5 px-3">
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export async function Experience() {
  const [experiences, educations] = await Promise.all([
    prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] }),
    prisma.education.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] }),
  ]);
  if (experiences.length === 0 && educations.length === 0) return null;
  return (
    <section id="experience" className="container-x py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Experience & Education</h2>
        <p className="section-subtitle">My professional journey</p>
        <div className="mt-10 grid md:grid-cols-2 gap-10">
          {experiences.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Work</h3>
              <div className="space-y-6 border-l-2 border-[rgb(var(--border))] pl-6">
                {experiences.map((e) => (
                  <div key={e.id} className="relative">
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-accent-500 border-4 border-[rgb(var(--bg))]" />
                    <div className="text-sm text-[rgb(var(--muted))]">
                      {e.startDate} — {e.endDate ?? "Present"}
                    </div>
                    <h4 className="font-semibold mt-1">{e.position}</h4>
                    <div className="text-sm">
                      {e.company}
                      {e.location ? ` · ${e.location}` : ""}
                    </div>
                    {e.description && (
                      <p className="mt-2 text-sm text-[rgb(var(--muted))] whitespace-pre-line">{e.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {educations.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Education</h3>
              <div className="space-y-6 border-l-2 border-[rgb(var(--border))] pl-6">
                {educations.map((e) => (
                  <div key={e.id} className="relative">
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-accent-500 border-4 border-[rgb(var(--bg))]" />
                    <div className="text-sm text-[rgb(var(--muted))]">
                      {e.startDate} — {e.endDate ?? "Present"}
                    </div>
                    <h4 className="font-semibold mt-1">{e.degree}</h4>
                    <div className="text-sm">
                      {e.school}
                      {e.field ? ` · ${e.field}` : ""}
                    </div>
                    {e.description && (
                      <p className="mt-2 text-sm text-[rgb(var(--muted))] whitespace-pre-line">{e.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export async function Services() {
  const services = await prisma.service.findMany({ orderBy: [{ order: "asc" }] });
  if (services.length === 0) return null;
  return (
    <section id="services" className="container-x py-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title">Services</h2>
        <p className="section-subtitle">What I can do for you</p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.id} className="card p-6 hover:border-accent-500 transition-colors">
              <div className="text-3xl mb-3">{s.icon ?? "✨"}</div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-[rgb(var(--muted))]">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function Testimonials() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: [{ order: "asc" }] });
  if (testimonials.length === 0) return null;
  return (
    <section className="container-x py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title text-center">Testimonials</h2>
        <p className="section-subtitle text-center">What people say</p>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <figure key={t.id} className="card p-6">
              <blockquote className="text-[rgb(var(--muted))] italic">"{t.content}"</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-white flex items-center justify-center font-bold">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  {(t.role || t.company) && (
                    <div className="text-xs text-[rgb(var(--muted))]">
                      {[t.role, t.company].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function Contact() {
  const profile = await prisma.profile.findFirst();
  return (
    <section id="contact" className="container-x py-20">
      <div className="max-w-3xl mx-auto">
        <h2 className="section-title text-center">Get In Touch</h2>
        <p className="section-subtitle text-center">Have a question or want to work together?</p>
        <form
          action="/api/contact"
          method="POST"
          className="mt-10 card p-6 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input id="name" name="name" required className="input" placeholder="Your name" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className="input" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="subject">Subject</label>
            <input id="subject" name="subject" className="input" placeholder="What's this about?" />
          </div>
          <div>
            <label className="label" htmlFor="content">Message</label>
            <textarea id="content" name="content" required rows={5} className="input" placeholder="Your message..." />
          </div>
          <button type="submit" className="btn-primary w-full sm:w-auto">Send Message</button>
        </form>
        {profile?.email && (
          <p className="mt-6 text-center text-sm text-[rgb(var(--muted))]">
            Or reach out directly: <a href={`mailto:${profile.email}`} className="text-accent-500 hover:underline">{profile.email}</a>
          </p>
        )}
      </div>
    </section>
  );
}
