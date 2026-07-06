import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Wipe existing content (idempotent)
  await prisma.message.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.service.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.profile.deleteMany();

  // Profile
  await prisma.profile.create({
    data: {
      fullName: "Your Name",
      title: "Full-Stack Developer",
      tagline: "Building thoughtful products with modern web technologies.",
      bio: "I'm a developer passionate about crafting clean user experiences and robust backends. I love working across the full stack — from database schema to pixel-perfect UI — and shipping work that lasts.\n\nWhen I'm not coding, you'll find me exploring new tools, writing about what I learn, and contributing to open source.",
      avatarUrl: "",
      location: "Jakarta, Indonesia",
      email: "you@example.com",
      phone: "",
      resumeUrl: "",
      socialLinks: JSON.stringify({
        github: "https://github.com/yourname",
        linkedin: "https://linkedin.com/in/yourname",
        twitter: "",
        instagram: "",
        website: "",
      }),
    },
  });

  // Skills
  await prisma.skill.createMany({
    data: [
      { name: "TypeScript", category: "Frontend", level: 90, order: 0 },
      { name: "React", category: "Frontend", level: 90, order: 1 },
      { name: "Next.js", category: "Frontend", level: 85, order: 2 },
      { name: "Tailwind CSS", category: "Frontend", level: 90, order: 3 },
      { name: "Node.js", category: "Backend", level: 85, order: 0 },
      { name: "PostgreSQL", category: "Backend", level: 75, order: 1 },
      { name: "Prisma", category: "Backend", level: 80, order: 2 },
      { name: "Git", category: "Tools", level: 90, order: 0 },
      { name: "Docker", category: "Tools", level: 70, order: 1 },
      { name: "Vercel", category: "Tools", level: 85, order: 2 },
    ],
  });

  // Projects
  await prisma.project.createMany({
    data: [
      {
        title: "TaskFlow",
        slug: "taskflow",
        description: "A collaborative task manager with real-time updates and keyboard-first design.",
        content: "TaskFlow is a real-time kanban-style task manager built with Next.js, Prisma, and WebSockets.",
        imageUrl: "",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com/yourname/taskflow",
        tags: "Next.js, TypeScript, Prisma, WebSockets",
        featured: true,
        order: 0,
      },
      {
        title: "BlogKit",
        slug: "blogkit",
        description: "A minimal, MDX-powered blog template with great DX and SEO.",
        imageUrl: "",
        demoUrl: "https://example.com",
        repoUrl: "https://github.com/yourname/blogkit",
        tags: "Astro, MDX, Tailwind",
        featured: true,
        order: 1,
      },
      {
        title: "DevTools CLI",
        slug: "devtools-cli",
        description: "A command-line tool that automates repetitive dev workflows.",
        imageUrl: "",
        demoUrl: "",
        repoUrl: "https://github.com/yourname/devtools-cli",
        tags: "Node.js, TypeScript, CLI",
        featured: false,
        order: 2,
      },
    ],
  });

  // Experience
  await prisma.experience.createMany({
    data: [
      {
        company: "Acme Inc",
        position: "Senior Full-Stack Developer",
        location: "Remote",
        startDate: "2023-01",
        endDate: null,
        description: "Leading frontend architecture for a B2B SaaS platform. Mentored 2 junior engineers.",
        order: 0,
      },
      {
        company: "Startup Studio",
        position: "Full-Stack Developer",
        location: "Jakarta",
        startDate: "2021-03",
        endDate: "2022-12",
        description: "Built MVPs for 4 startups across fintech, healthtech, and edtech.",
        order: 1,
      },
    ],
  });

  // Education
  await prisma.education.createMany({
    data: [
      {
        school: "University of Example",
        degree: "Bachelor's Degree",
        field: "Computer Science",
        startDate: "2017-09",
        endDate: "2021-06",
        description: "Graduated with honors. Focus on software engineering and distributed systems.",
        order: 0,
      },
    ],
  });

  // Services
  await prisma.service.createMany({
    data: [
      { title: "Web Development", description: "End-to-end web apps with modern stacks.", icon: "💻", order: 0 },
      { title: "API Design", description: "RESTful and GraphQL APIs that scale.", icon: "🔌", order: 1 },
      { title: "Technical Consulting", description: "Architecture reviews and stack recommendations.", icon: "🧭", order: 2 },
    ],
  });

  // Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Jane Doe",
        role: "Product Manager",
        company: "Acme Inc",
        content: "One of the most thoughtful engineers I've worked with. They ship clean code and clear communication in equal measure.",
        order: 0,
      },
      {
        name: "John Smith",
        role: "CTO",
        company: "StartupX",
        content: "Took our messy prototype and turned it into a production-grade platform in 6 weeks. Highly recommend.",
        order: 1,
      },
    ],
  });

  console.log("✅ Seeded successfully");
  console.log("👤 Profile, skills, projects, experience, education, services, testimonials created.");
  console.log("🔐 Login at /admin/login with: admin@example.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
