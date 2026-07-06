import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Editable personal portfolio built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
