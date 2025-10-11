import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { noteId, content } = body;

    if (!noteId || !content) {
      return NextResponse.json({ error: "Note ID and content are required" }, { status: 400 });
    }

    // Get user's organization
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!user?.organization) {
      return NextResponse.json({ error: "User not in organization" }, { status: 403 });
    }

    // Verify note belongs to user's organization
    const note = await db.note.findFirst({
      where: {
        id: noteId,
        deletedAt: null,
        board: {
          organizationId: user.organization.id,
        },
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Get the next order number
    const lastItem = await db.checklistItem.findFirst({
      where: { noteId },
      orderBy: { order: "desc" },
    });

    const order = (lastItem?.order || 0) + 1;

    // Create checklist item
    const checklistItem = await db.checklistItem.create({
      data: {
        noteId,
        content,
        order,
      },
    });

    return NextResponse.json(checklistItem);
  } catch (error) {
    console.error("Error creating checklist item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
