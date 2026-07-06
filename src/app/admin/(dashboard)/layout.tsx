import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/guards";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
