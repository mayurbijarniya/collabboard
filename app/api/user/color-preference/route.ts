import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { NOTE_COLORS } from "@/lib/constants";

const colorPreferenceSchema = z.object({
  color: z.enum(NOTE_COLORS).nullable(),
});

// Get user's color preference
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        preferredNoteColor: true,
        organization: {
          select: {
            defaultNoteColor: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      userPreference: user.preferredNoteColor,
      organizationDefault: user.organization?.defaultNoteColor,
    });
  } catch (error) {
    console.error("Error fetching color preference:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update user's color preference
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { color } = colorPreferenceSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { preferredNoteColor: color },
      select: { preferredNoteColor: true },
    });

    return NextResponse.json({ 
      success: true, 
      preferredNoteColor: updatedUser.preferredNoteColor 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid color", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating color preference:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}