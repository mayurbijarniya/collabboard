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
    const body = await request.json();

    // Get user's organization
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!user?.organization) {
      return NextResponse.json({ error: "User not in organization" }, { status: 403 });
    }

    // Verify checklist item belongs to user's organization
    const existingItem = await db.checklistItem.findFirst({
      where: {
        id,
        note: {
          deletedAt: null,
          board: {
            organizationId: user.organization.id,
          },
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Checklist item not found" }, { status: 404 });
    }

    // Update checklist item
    const checklistItem = await db.checklistItem.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(checklistItem);
  } catch (error) {
    console.error("Error updating checklist item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
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

    // Verify checklist item belongs to user's organization
    const existingItem = await db.checklistItem.findFirst({
      where: {
        id,
        note: {
          deletedAt: null,
          board: {
            organizationId: user.organization.id,
          },
        },
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Checklist item not found" }, { status: 404 });
    }

    // Delete checklist item
    await db.checklistItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
