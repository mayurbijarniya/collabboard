import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get invitation
    const invitation = await db.organizationInvite.findUnique({
      where: { id },
      include: { organization: true },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Check if invitation is expired
    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invitation has expired" }, { status: 400 });
    }

    // Check if invitation is already accepted
    if (invitation.acceptedAt) {
      return NextResponse.json({ error: "Invitation already accepted" }, { status: 400 });
    }

    // Get or create user
    let user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // Create user if they don't exist
      user = await db.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          organizationId: invitation.organizationId,
          isAdmin: invitation.role === "ADMIN",
        },
      });
    } else {
      // Update existing user
      user = await db.user.update({
        where: { id: user.id },
        data: {
          organizationId: invitation.organizationId,
          isAdmin: invitation.role === "ADMIN",
        },
      });
    }

    // Mark invitation as accepted
    await db.organizationInvite.update({
      where: { id },
      data: {
        acceptedAt: new Date(),
        acceptedBy: user.id,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
