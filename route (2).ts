import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    // Only allow setup when no users exist
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json(
        { error: "Setup already completed. Super Admin exists." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: Role.SUPER_ADMIN,
      },
    });

    // Also ensure Levelock event exists (run seed logic lightly)
    const eventCount = await prisma.event.count();
    if (eventCount === 0) {
      // Minimal event creation if seed was not run
      await prisma.event.create({
        data: {
          name: "Levelock",
          tagline: "Register. Compete. Claim the Crown.",
          description:
            "Levelock is a 3-day online gaming championship for players aged 18+.",
          category: "online gaming",
          startDate: new Date("2026-11-15"),
          endDate: new Date("2026-11-17"),
          startTime: "17:00",
          endTime: "00:00",
          timezone: "Asia/Kolkata",
          venueName: "Online (Virtual Event)",
          organizerName: "Levelock Esports",
          organizerEmail: "contact@levelock.in",
          primaryColor: "#00D4FF",
          secondaryColor: "#A855F7",
          backgroundColor: "#08080F",
          isPublished: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Super Admin created successfully",
      userId: user.id,
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({
      setupRequired: userCount === 0,
      userCount,
    });
  } catch {
    return NextResponse.json({ setupRequired: true, userCount: 0 });
  }
}
