"use client";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="text-sm text-[rgb(var(--muted))] mt-1">Sign in to manage your portfolio</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
        <p className="mt-4 text-xs text-[rgb(var(--muted))]">
          Default: admin@example.com / admin123 (change in <code>.env</code>)
        </p>
      </form>
    </div>
  );
}
