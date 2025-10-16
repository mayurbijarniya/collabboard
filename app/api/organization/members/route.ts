import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

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
        isAdmin: true,
      },
    });

    if (!user?.organizationId) {
      return NextResponse.json({ error: "No organization found" }, { status: 403 });
    }

    // Get all members of the same organization
    const members = await db.user.findMany({
      where: {
        organizationId: user.organizationId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isAdmin: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ 
      members,
      currentUser: {
        id: session.user.id,
        isAdmin: user.isAdmin,
      }
    });
  } catch (error) {
    console.error("Error fetching organization members:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}