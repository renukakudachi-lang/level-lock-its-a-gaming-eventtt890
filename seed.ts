import { PrismaClient, RegistrationMode, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Levelock event data...");

  // Create default Super Admin only if none exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: Role.SUPER_ADMIN },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Levelock@2026", 12);
    await prisma.user.create({
      data: {
        name: "Levelock Admin",
        email: "admin@levelock.in",
        passwordHash,
        role: Role.SUPER_ADMIN,
      },
    });
    console.log("✅ Super Admin created: admin@levelock.in / Levelock@2026");
  }

  // Check if event already exists
  const existingEvent = await prisma.event.findFirst({
    where: { name: "Levelock" },
  });

  if (existingEvent) {
    console.log("ℹ️  Levelock event already exists, skipping seed.");
    return;
  }

  const event = await prisma.event.create({
    data: {
      name: "Levelock",
      tagline: "Register. Compete. Claim the Crown.",
      description:
        "Levelock is a 3-day online gaming championship for players aged 18+. Compete in intense elimination matches over two days, then battle for the crown on the final day. Only registered participants get full live-stream access. Limited slots. Secure your spot and prove you’re the best.",
      category: "online gaming",
      theme: "tech",
      startDate: new Date("2026-11-15T00:00:00+05:30"),
      endDate: new Date("2026-11-17T23:59:59+05:30"),
      startTime: "17:00",
      endTime: "00:00",
      timezone: "Asia/Kolkata",
      venueName: "Online (Virtual Event)",
      venueAddress: "Fully online – accessible via private stream link after registration",
      organizerName: "Levelock Esports",
      organizerEmail: "contact@levelock.in",
      organizerPhone: "+91-XXXXXXXXXX",
      websiteUrl: "https://www.levelock.in",
      socialLinks: {
        instagram: "@levelock.esports",
        whatsapp: "",
      },
      primaryColor: "#00D4FF",
      secondaryColor: "#A855F7",
      backgroundColor: "#08080F",
      textColor: "#E8E8F0",
      fontHeading: "Orbitron",
      fontBody: "Inter",
      registrationMode: RegistrationMode.OPEN,
      isPublished: true,
    },
  });

  console.log("✅ Event created:", event.name);

  // Default pages
  const pages = [
    { slug: "home", title: "Home", sortOrder: 0 },
    { slug: "about", title: "About the Event", sortOrder: 1 },
    { slug: "agenda", title: "Event Agenda", sortOrder: 2 },
    { slug: "speakers", title: "Speakers / Players", sortOrder: 3 },
    { slug: "sponsors", title: "Sponsors", sortOrder: 4 },
    { slug: "register", title: "Registration", sortOrder: 5 },
    { slug: "tickets", title: "Ticket Details", sortOrder: 6 },
    { slug: "contact", title: "Contact", sortOrder: 7 },
    { slug: "privacy", title: "Privacy Policy", sortOrder: 8 },
    { slug: "terms", title: "Terms and Conditions", sortOrder: 9 },
  ];

  for (const page of pages) {
    await prisma.eventPage.create({
      data: {
        eventId: event.id,
        slug: page.slug,
        title: page.title,
        isEnabled: true,
        sortOrder: page.sortOrder,
        content: {},
      },
    });
  }
  console.log("✅ Default pages created");

  // Ticket types
  const general = await prisma.ticketType.create({
    data: {
      eventId: event.id,
      name: "General Participant",
      description: "Full access to live streams and matches for registered players.",
      price: 0,
      capacity: 500,
      sortOrder: 0,
    },
  });

  const vip = await prisma.ticketType.create({
    data: {
      eventId: event.id,
      name: "VIP Participant",
      description: "Priority access, exclusive Discord channel, and merch eligibility.",
      price: 0,
      capacity: 50,
      sortOrder: 1,
    },
  });

  console.log("✅ Ticket types created");

  // Basic form fields for General
  const fields = [
    { label: "Full Name", fieldKey: "fullName", fieldType: "text", isRequired: true, sortOrder: 0 },
    { label: "Email Address", fieldKey: "email", fieldType: "email", isRequired: true, sortOrder: 1 },
    { label: "Mobile Number", fieldKey: "phone", fieldType: "phone", isRequired: true, sortOrder: 2 },
    { label: "City", fieldKey: "city", fieldType: "text", isRequired: false, sortOrder: 3 },
    { label: "Gaming ID / In-game Name", fieldKey: "gamingId", fieldType: "text", isRequired: true, sortOrder: 4 },
  ];

  for (const field of fields) {
    await prisma.formField.create({
      data: {
        eventId: event.id,
        ticketTypeId: general.id,
        ...field,
      },
    });
  }
  console.log("✅ Form fields created");

  // Default SPOC
  const spoc = await prisma.spoc.create({
    data: {
      eventId: event.id,
      name: "Registration Coordinator",
      designation: "Registration Manager",
      email: "register@levelock.in",
      phone: "+91-XXXXXXXXXX",
      whatsapp: "+91-XXXXXXXXXX",
      responsibility: "Handles all participant registrations and ticket queries",
    },
  });

  await prisma.spocAssignment.create({
    data: {
      spocId: spoc.id,
      ticketTypeId: general.id,
    },
  });

  await prisma.spocAssignment.create({
    data: {
      spocId: spoc.id,
      ticketTypeId: vip.id,
    },
  });

  console.log("✅ SPOC created and assigned");

  // Confirmation email template
  await prisma.emailTemplate.create({
    data: {
      eventId: event.id,
      name: "Registration Confirmation",
      subject: "You're in! Levelock Registration Confirmed – {{ticket_number}}",
      type: "confirmation",
      bodyHtml: `
        <div style="font-family: Inter, Arial, sans-serif; background:#08080F; color:#E8E8F0; padding:32px;">
          <h1 style="color:#00D4FF; font-family: Orbitron, sans-serif;">LEVELLOCK</h1>
          <p>Hi {{participant_name}},</p>
          <p>Your registration for <strong>Levelock</strong> is confirmed.</p>
          <p><strong>Ticket Number:</strong> {{ticket_number}}<br/>
          <strong>Registration ID:</strong> {{registration_id}}</p>
          <p>Show the QR code attached (or on your ticket page) at check-in.</p>
          <p>Your SPOC: {{spoc_name}} – {{spoc_email}} / {{spoc_phone}}</p>
          <p style="margin-top:24px; color:#B0B0C0;">Register. Compete. Claim the Crown.</p>
        </div>
      `,
      bodyText: "Hi {{participant_name}}, your Levelock registration is confirmed. Ticket: {{ticket_number}}",
    },
  });

  console.log("✅ Email template created");
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
