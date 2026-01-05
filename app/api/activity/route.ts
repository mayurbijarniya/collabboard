import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, entityType, entityId, entityTitle, boardId } = await req.json();

    if (!action || !entityType || !entityId || !boardId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const activity = await db.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        entityTitle,
        boardId,
        userId: session.user.id,
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
      },
    });

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!boardId) {
      return NextResponse.json({ error: "Board ID required" }, { status: 400 });
    }

    // Verify user has access to this board via organization membership
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        organization: {
          include: {
            boards: {
              where: { id: boardId }
            }
          }
        }
      }
    });

    const hasAccess = user?.organization?.boards?.length ?? 0 > 0;

    if (!hasAccess) {
      return NextResponse.json({ error: "Board not found or access denied" }, { status: 403 });
    }

    const activities = await db.activityLog.findMany({
      where: { boardId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await db.activityLog.count({ where: { boardId } });

    return NextResponse.json({ activities, total });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
