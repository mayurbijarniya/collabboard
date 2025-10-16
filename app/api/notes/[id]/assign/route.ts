import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const assignSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const noteId = (await params).id;
    const body = await request.json();

    let validatedBody;
    try {
      validatedBody = assignSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    const { userId } = validatedBody;

    // Check if current user is admin
    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        isAdmin: true,
        organizationId: true,
      },
    });

    if (!currentUser?.isAdmin) {
      return NextResponse.json({ error: "Only admins can reassign notes" }, { status: 403 });
    }

    // Verify the note exists and get its board info
    const note = await db.note.findUnique({
      where: { id: noteId },
      select: {
        id: true,
        board: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Verify current user has access to this note's board
    if (note.board.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Verify the target user exists and is in the same organization
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        organizationId: true,
      },
    });

    if (!targetUser || targetUser.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "Invalid user assignment" }, { status: 400 });
    }

    // Update the note assignment
    const updatedNote = await db.note.update({
      where: { id: noteId },
      data: {
        createdBy: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        checklistItems: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error("Error reassigning note:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}