import { z } from "zod";

const socialLink = z.string().url().or(z.literal(""));

export const profileSchema = z.object({
  fullName: z.string().min(1).max(120),
  title: z.string().min(1).max(160),
  tagline: z.string().max(280).optional().nullable(),
  bio: z.string().min(1).max(5000),
  avatarUrl: z.string().url().or(z.literal("")).optional().nullable(),
  location: z.string().max(160).optional().nullable(),
  email: z.string().email().or(z.literal("")).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  resumeUrl: z.string().url().or(z.literal("")).optional().nullable(),
  socialLinks: z
    .object({
      github: socialLink.optional(),
      linkedin: socialLink.optional(),
      twitter: socialLink.optional(),
      instagram: socialLink.optional(),
      website: socialLink.optional(),
    })
    .optional()
    .nullable(),
});

export const skillSchema = z.object({
  name: z.string().min(1).max(80),
  category: z.string().min(1).max(80),
  level: z.number().int().min(0).max(100).default(50),
  iconUrl: z.string().url().or(z.literal("")).optional().nullable(),
  order: z.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().min(1).max(160),
  slug: z
    .string()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  description: z.string().min(1).max(1000),
  content: z.string().max(20000).optional().nullable(),
  imageUrl: z.string().url().or(z.literal("")).optional().nullable(),
  demoUrl: z.string().url().or(z.literal("")).optional().nullable(),
  repoUrl: z.string().url().or(z.literal("")).optional().nullable(),
  tags: z.string().max(400).default(""),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const experienceSchema = z.object({
  company: z.string().min(1).max(160),
  position: z.string().min(1).max(160),
  location: z.string().max(160).optional().nullable(),
  startDate: z.string().min(1).max(40),
  endDate: z.string().max(40).optional().nullable(),
  description: z.string().max(2000).default(""),
  order: z.number().int().default(0),
});

export const educationSchema = z.object({
  school: z.string().min(1).max(160),
  degree: z.string().min(1).max(160),
  field: z.string().max(160).optional().nullable(),
  startDate: z.string().min(1).max(40),
  endDate: z.string().max(40).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  order: z.number().int().default(0),
});

export const serviceSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().min(1).max(1000),
  icon: z.string().max(40).optional().nullable(),
  order: z.number().int().default(0),
});

export const testimonialSchema = z.object({
  name: z.string().min(1).max(120),
  role: z.string().max(120).optional().nullable(),
  company: z.string().max(120).optional().nullable(),
  content: z.string().min(1).max(2000),
  avatarUrl: z.string().url().or(z.literal("")).optional().nullable(),
  order: z.number().int().default(0),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
