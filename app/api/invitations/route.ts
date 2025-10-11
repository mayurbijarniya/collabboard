import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, role = "MEMBER" } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
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

    // Check if user is already in organization
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser?.organizationId === user.organization.id) {
      return NextResponse.json({ error: "User is already in organization" }, { status: 400 });
    }

    // Create invitation
    const invitation = await db.organizationInvite.create({
      data: {
        organizationId: user.organization.id,
        email,
        role,
        invitedBy: user.id,
      },
    });

    // Send invitation email
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "noreply@collabboard.app",
        to: email,
        subject: `You're invited to join ${user.organization.name} on CollabBoard`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1f2937;">You're invited to join ${user.organization.name}</h1>
            <p>You've been invited to collaborate on CollabBoard. Click the link below to accept the invitation:</p>
            <a href="${process.env.NEXTAUTH_URL}/invite/${invitation.id}" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
              Accept Invitation
            </a>
            <p style="color: #6b7280; font-size: 14px;">
              This invitation will expire in 7 days. If you don't have an account, you'll be prompted to create one.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Error sending invitation email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Error creating invitation:", error);
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

    // Get pending invitations
    const invitations = await db.organizationInvite.findMany({
      where: {
        organizationId: user.organization.id,
        acceptedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        invitedBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
