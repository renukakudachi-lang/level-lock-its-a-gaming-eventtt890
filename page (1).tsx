import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  let stats = {
    totalRegistrations: 0,
    confirmed: 0,
    checkedIn: 0,
    ticketTypes: 0,
  };

  try {
    const [total, confirmed, checkedIn, ticketTypes] = await Promise.all([
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "CONFIRMED" } }),
      prisma.checkIn.count(),
      prisma.ticketType.count(),
    ]);
    stats = { totalRegistrations: total, confirmed, checkedIn, ticketTypes };
  } catch {
    // DB may not be ready yet
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-[#0A0A12]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-orbitron text-lg font-bold text-[#00D4FF]">
            LEVELLOCK Admin
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#B0B0C0]">
              {session.user.name} ({session.user.role})
            </span>
            <Link
              href="/"
              className="text-[#00D4FF] hover:underline"
            >
              View Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-orbitron text-2xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="glass p-5 rounded-xl">
            <div className="text-3xl font-bold text-[#00D4FF]">
              {stats.totalRegistrations}
            </div>
            <div className="text-sm text-[#B0B0C0] mt-1">Total Registrations</div>
          </div>
          <div className="glass p-5 rounded-xl">
            <div className="text-3xl font-bold text-green-400">{stats.confirmed}</div>
            <div className="text-sm text-[#B0B0C0] mt-1">Confirmed</div>
          </div>
          <div className="glass p-5 rounded-xl">
            <div className="text-3xl font-bold text-[#A855F7]">{stats.checkedIn}</div>
            <div className="text-sm text-[#B0B0C0] mt-1">Checked In</div>
          </div>
          <div className="glass p-5 rounded-xl">
            <div className="text-3xl font-bold text-white">{stats.ticketTypes}</div>
            <div className="text-sm text-[#B0B0C0] mt-1">Ticket Types</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Event Configuration", href: "/admin/event", desc: "Name, dates, branding, colours" },
            { title: "Registrations", href: "/admin/registrations", desc: "View & manage all registrations" },
            { title: "Ticket Types", href: "/admin/tickets", desc: "Manage ticket categories" },
            { title: "QR Check-in", href: "/admin/checkin", desc: "Scan & validate tickets" },
            { title: "SPOCs", href: "/admin/spocs", desc: "Single Point of Contact management" },
            { title: "Email Templates", href: "/admin/emails", desc: "Confirmation & campaign templates" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass p-5 rounded-xl hover:border-[#00D4FF]/40 transition group"
            >
              <div className="font-semibold text-white group-hover:text-[#00D4FF] transition">
                {item.title}
              </div>
              <div className="text-sm text-[#B0B0C0] mt-1">{item.desc}</div>
            </Link>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 text-sm text-amber-200">
          <strong>Starter Note:</strong> This is the minimal foundation. Full CRUD modules,
          dynamic form builder, invitation system, Resend campaigns, and reminder scheduler
          will be expanded in subsequent versions. Core schema, auth, seed data, and deployment
          config are ready.
        </div>
      </main>
    </div>
  );
}
