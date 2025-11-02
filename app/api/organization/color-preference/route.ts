import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { NOTE_COLORS } from "@/lib/constants";

const orgColorPreferenceSchema = z.object({
  color: z.enum(NOTE_COLORS).nullable(),
});

// Get organization's default color
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        organizationId: true,
        organization: {
          select: {
            defaultNoteColor: true,
          },
        },
      },
    });

    if (!user?.organizationId) {
      return NextResponse.json({ error: "No organization found" }, { status: 403 });
    }

    return NextResponse.json({
      defaultNoteColor: user.organization?.defaultNoteColor,
    });
  } catch (error) {
    console.error("Error fetching organization color preference:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update organization's default color (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { color } = orgColorPreferenceSchema.parse(body);

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        organizationId: true,
        isAdmin: true,
      },
    });

    if (!user?.organizationId) {
      return NextResponse.json({ error: "No organization found" }, { status: 403 });
    }

    if (!user.isAdmin) {
      return NextResponse.json({ error: "Only admins can set organization defaults" }, { status: 403 });
    }

    const updatedOrg = await db.organization.update({
      where: { id: user.organizationId },
      data: { defaultNoteColor: color },
      select: { defaultNoteColor: true },
    });

    return NextResponse.json({ 
      success: true, 
      defaultNoteColor: updatedOrg.defaultNoteColor 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid color", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating organization color preference:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}