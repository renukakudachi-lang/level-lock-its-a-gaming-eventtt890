import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getData() {
  try {
    const event = await prisma.event.findFirst({
      where: { isPublished: true },
      include: {
        ticketTypes: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        formFields: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      },
    });
    return event;
  } catch {
    return null;
  }
}

export default async function RegisterPage() {
  const event = await getData();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass border-b border-[#00D4FF]/20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-orbitron text-xl font-bold text-[#00D4FF]">
            {event?.name?.toUpperCase() ?? "LEVELLOCK"}
          </Link>
          <Link href="/" className="text-sm text-[#B0B0C0] hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-16">
        <h1 className="font-orbitron text-3xl font-bold text-center mb-2">
          Registration
        </h1>
        <p className="text-center text-[#B0B0C0] mb-10">
          Secure your spot for {event?.name ?? "Levelock"}
        </p>

        <div className="glass p-8 rounded-xl space-y-6">
          <p className="text-sm text-[#B0B0C0]">
            This is the starter registration page. The full dynamic form (driven by
            FormField records in the database), ticket generation, QR code creation,
            and confirmation email will be completed in the next iteration.
          </p>

          {event?.ticketTypes && event.ticketTypes.length > 0 && (
            <div>
              <h2 className="font-semibold mb-3">Available Ticket Types</h2>
              <ul className="space-y-2">
                {event.ticketTypes.map((t) => (
                  <li
                    key={t.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div>
                      <div className="font-medium">{t.name}</div>
                      {t.description && (
                        <div className="text-xs text-[#888] mt-0.5">{t.description}</div>
                      )}
                    </div>
                    <div className="text-[#00D4FF] font-semibold">
                      {Number(t.price) === 0 ? "Free" : `₹${t.price}`}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 text-center text-sm text-[#666]">
            Full registration form + QR ticket generation coming in the next update.
          </div>
        </div>
      </main>
    </div>
  );
}
