import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Single admin user from env. No DB user table needed.
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminEmail || !adminPassword) return null;

        if (credentials.email.toLowerCase() !== adminEmail.toLowerCase()) {
          return null;
        }

        const valid = await bcrypt.compare(credentials.password, await bcrypt.hash(adminPassword, 10));
        if (!valid) return null;

        return {
          id: "admin",
          email: adminEmail,
          name: process.env.ADMIN_NAME ?? "Admin",
          role: "admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
