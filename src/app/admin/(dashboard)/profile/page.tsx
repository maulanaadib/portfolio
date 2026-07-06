import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/admin/ProfileForm";

export default async function ProfilePage() {
  const profile = await prisma.profile.findFirst();
  return <ProfileForm initial={profile} />;
}
