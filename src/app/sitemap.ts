import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || "https://example.com";
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/#about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/#contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const projects = await prisma.project.findMany({
      where: { slug: { not: "" } },
      select: { slug: true, updatedAt: true },
    });
    projectEntries = projects.map((p) => ({
      url: `${base}/#project-${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    // DB not reachable at build time; return static entries only
  }

  return [...staticEntries, ...projectEntries];
}
