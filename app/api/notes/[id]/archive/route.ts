import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get user's organization
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!user?.organization) {
      return NextResponse.json({ error: "User not in organization" }, { status: 403 });
    }

    // Verify note belongs to user's organization
    const existingNote = await db.note.findFirst({
      where: {
        id,
        deletedAt: null,
        board: {
          organizationId: user.organization.id,
        },
      },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Archive note
    const note = await db.note.update({
      where: { id },
      data: { archivedAt: new Date() },
      include: {
        user: true,
        checklistItems: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error archiving note:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
