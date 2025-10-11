import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { expiresInDays = 7, maxUses = 10 } = body;

    // Get user's organization
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!user?.organization) {
      return NextResponse.json({ error: "User not in organization" }, { status: 403 });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Generate unique token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create self-serve invite
    const selfServeInvite = await db.organizationSelfServeInvite.create({
      data: {
        organizationId: user.organization.id,
        token,
        expiresAt,
        maxUses,
        createdBy: user.id,
      },
    });

    return NextResponse.json({
      id: selfServeInvite.id,
      token,
      expiresAt,
      maxUses,
      inviteUrl: `${process.env.NEXTAUTH_URL}/invite/self-serve?token=${token}`,
    });
  } catch (error) {
    console.error("Error creating self-serve invite:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { organization: true },
    });

    if (!user?.organization) {
      return NextResponse.json({ error: "User not in organization" }, { status: 403 });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get active self-serve invites
    const selfServeInvites = await db.organizationSelfServeInvite.findMany({
      where: {
        organizationId: user.organization.id,
        expiresAt: {
          gt: new Date(),
        },
        uses: {
          lt: db.organizationSelfServeInvite.fields.maxUses,
        },
      },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(selfServeInvites);
  } catch (error) {
    console.error("Error fetching self-serve invites:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
