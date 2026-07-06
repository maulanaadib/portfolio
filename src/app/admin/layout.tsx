// Server layout: just a passthrough. Login page renders its own UI.
// The protected dashboard pages live under /admin/(dashboard) and have their own layout.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
