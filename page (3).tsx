import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getEvent() {
  try {
    const event = await prisma.event.findFirst({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    return event;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const event = await getEvent();

  const name = event?.name ?? "Levelock";
  const tagline = event?.tagline ?? "Register. Compete. Claim the Crown.";
  const description =
    event?.description ??
    "Levelock is a 3-day online gaming championship for players aged 18+. Compete in intense elimination matches over two days, then battle for the crown on the final day.";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-[#00D4FF]/20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-orbitron text-xl font-bold tracking-wider text-[#00D4FF] neon-text">
            {name.toUpperCase()}
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#B0B0C0]">
            <Link href="/about" className="hover:text-[#00D4FF] transition">
              About
            </Link>
            <Link href="/agenda" className="hover:text-[#00D4FF] transition">
              Agenda
            </Link>
            <Link href="/register" className="hover:text-[#00D4FF] transition">
              Register
            </Link>
            <Link href="/contact" className="hover:text-[#00D4FF] transition">
              Contact
            </Link>
          </nav>
          <Link
            href="/register"
            className="px-5 py-2 rounded-lg bg-[#00D4FF] text-[#08080F] font-semibold text-sm hover:bg-[#A855F7] hover:text-white transition-all hover:scale-105"
          >
            Register Now
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00D4FF]/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <h1 className="font-orbitron text-5xl md:text-7xl font-extrabold tracking-tight text-white neon-text">
            {name.toUpperCase()}
          </h1>
          <p className="text-xl md:text-2xl text-[#00D4FF] font-medium tracking-wide">
            {tagline}
          </p>
          <p className="text-[#B0B0C0] max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-lg bg-[#00D4FF] text-[#08080F] font-bold text-lg hover:bg-[#A855F7] hover:text-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,212,255,0.4)]"
            >
              Register Now
            </Link>
            <Link
              href="/about"
              className="px-8 py-3.5 rounded-lg border border-[#00D4FF]/50 text-[#00D4FF] font-semibold text-lg hover:bg-[#00D4FF]/10 transition"
            >
              Learn More
            </Link>
          </div>

          {event && (
            <div className="pt-10 flex flex-wrap justify-center gap-6 text-sm text-[#B0B0C0]">
              <div className="px-4 py-2 rounded-full border border-[#00D4FF]/20 bg-[#00D4FF]/5">
                📅 {new Date(event.startDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                –{" "}
                {new Date(event.endDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="px-4 py-2 rounded-full border border-[#A855F7]/20 bg-[#A855F7]/5">
                🕔 {event.startTime} – {event.endTime} IST
              </div>
              <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5">
                🌐 Fully Online
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#A855F7]/30 bg-[#08080F] py-10">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm text-[#B0B0C0]">
          <div>
            <div className="font-orbitron text-[#00D4FF] font-bold mb-3">
              {name.toUpperCase()}
            </div>
            <p className="leading-relaxed">
              Online gaming championship. Register. Compete. Claim the Crown.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Quick Links</div>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-[#00D4FF]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#00D4FF]">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#00D4FF]">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Contact</div>
            <p>{event?.organizerEmail ?? "contact@levelock.in"}</p>
            <p className="mt-1">{event?.organizerPhone ?? "+91-XXXXXXXXXX"}</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-white/5 text-center text-xs text-[#666]">
          © {new Date().getFullYear()} {event?.organizerName ?? "Levelock Esports"}. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
