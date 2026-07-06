"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type SocialLinks = { github?: string; linkedin?: string; twitter?: string; instagram?: string; website?: string };
type Profile = {
  fullName: string;
  title: string;
  tagline: string | null;
  bio: string;
  avatarUrl: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  resumeUrl: string | null;
  socialLinks: string | null;
};

export function ProfileForm({ initial }: { initial: Profile | null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: initial?.fullName ?? "",
    title: initial?.title ?? "",
    tagline: initial?.tagline ?? "",
    bio: initial?.bio ?? "",
    avatarUrl: initial?.avatarUrl ?? "",
    location: initial?.location ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    resumeUrl: initial?.resumeUrl ?? "",
  });
  const [social, setSocial] = useState<SocialLinks>(() => {
    if (!initial?.socialLinks) return {};
    try { return JSON.parse(initial.socialLinks) as SocialLinks; } catch { return {}; }
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, socialLinks: social }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(typeof d.error === "string" ? d.error : "Failed to save");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="text-[rgb(var(--muted))] mt-1">Your main information shown on the homepage</p>

      <div className="mt-6 card p-6 space-y-4 max-w-3xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full name *</label>
            <input className="input" value={form.fullName} onChange={set("fullName")} required />
          </div>
          <div>
            <label className="label">Title * <span className="text-[rgb(var(--muted))] font-normal">(e.g. Full-Stack Developer)</span></label>
            <input className="input" value={form.title} onChange={set("title")} required />
          </div>
        </div>
        <div>
          <label className="label">Tagline <span className="text-[rgb(var(--muted))] font-normal">(short subtitle)</span></label>
          <input className="input" value={form.tagline ?? ""} onChange={set("tagline")} />
        </div>
        <div>
          <label className="label">About me *</label>
          <textarea className="input" rows={6} value={form.bio} onChange={set("bio")} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Avatar URL</label>
            <input className="input" type="url" value={form.avatarUrl ?? ""} onChange={set("avatarUrl")} placeholder="https://..." />
          </div>
          <div>
            <label className="label">Resume/CV URL</label>
            <input className="input" type="url" value={form.resumeUrl ?? ""} onChange={set("resumeUrl")} placeholder="https://.../cv.pdf" />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location ?? ""} onChange={set("location")} placeholder="Jakarta, Indonesia" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email ?? ""} onChange={set("email")} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone ?? ""} onChange={set("phone")} />
          </div>
        </div>

        <div>
          <label className="label">Social links</label>
          <div className="grid sm:grid-cols-2 gap-3">
            {(["github", "linkedin", "twitter", "instagram", "website"] as const).map((k) => (
              <div key={k}>
                <label className="text-xs text-[rgb(var(--muted))] capitalize">{k}</label>
                <input
                  className="input"
                  type="url"
                  value={social[k] ?? ""}
                  onChange={(e) => setSocial({ ...social, [k]: e.target.value })}
                  placeholder={`https://${k}.com/...`}
                />
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <div>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
