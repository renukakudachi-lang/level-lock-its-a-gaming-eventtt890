"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "Levelock Admin",
    email: "admin@levelock.in",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Setup failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-4xl">✅</div>
          <h1 className="font-orbitron text-2xl text-[#00D4FF]">Setup Complete!</h1>
          <p className="text-[#B0B0C0]">
            Super Admin created. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="font-orbitron text-3xl font-bold text-[#00D4FF] neon-text">
            LEVELLOCK
          </h1>
          <p className="mt-2 text-[#B0B0C0]">First-time Setup</p>
          <p className="mt-1 text-sm text-[#666]">
            Create the Super Admin account. This page works only when no users exist.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 glass p-8 rounded-xl">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-[#B0B0C0] mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0F0F1A] border border-white/10 focus:border-[#00D4FF] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm text-[#B0B0C0] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0F0F1A] border border-white/10 focus:border-[#00D4FF] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm text-[#B0B0C0] mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0F0F1A] border border-white/10 focus:border-[#00D4FF] outline-none transition"
              placeholder="Min 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm text-[#B0B0C0] mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0F0F1A] border border-white/10 focus:border-[#00D4FF] outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#00D4FF] text-[#08080F] font-bold hover:bg-[#A855F7] hover:text-white transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Super Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
