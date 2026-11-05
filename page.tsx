"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="font-orbitron text-3xl font-bold text-[#00D4FF] neon-text">
            LEVELLOCK
          </Link>
          <p className="mt-2 text-[#B0B0C0]">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 glass p-8 rounded-xl">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-[#B0B0C0] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0F0F1A] border border-white/10 focus:border-[#00D4FF] outline-none transition"
              placeholder="admin@levelock.in"
            />
          </div>

          <div>
            <label className="block text-sm text-[#B0B0C0] mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0F0F1A] border border-white/10 focus:border-[#00D4FF] outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#00D4FF] text-[#08080F] font-bold hover:bg-[#A855F7] hover:text-white transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-[#666]">
          First time?{" "}
          <Link href="/setup" className="text-[#00D4FF] hover:underline">
            Run Setup
          </Link>
        </p>
      </div>
    </div>
  );
}
