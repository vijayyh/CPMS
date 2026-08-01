import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const invites = await prisma.projectMember.findMany({
    where: {
      userId,
      status: "PENDING"
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          code: true,
          location: true,
          manager: {
            select: { name: true }
          }
        }
      }
    }
  });

  return NextResponse.json(invites);
}

// Admin inviting a user
export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { email, projectId, role } = body;

  const userToInvite = await prisma.user.findUnique({
    where: { email }
  });

  if (!userToInvite) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: userToInvite.id,
        projectId
      }
    }
  });

  if (existing) {
    return NextResponse.json({ error: "User is already invited or in the project" }, { status: 400 });
  }

  const invite = await prisma.projectMember.create({
    data: {
      userId: userToInvite.id,
      projectId,
      role: role || userToInvite.role,
      status: "PENDING"
    }
  });

  return NextResponse.json(invite, { status: 201 });
}

// User accepting/rejecting an invite
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { inviteId, status } = body; // status: "ACTIVE" or "REJECTED"

  const invite = await prisma.projectMember.findUnique({
    where: { id: inviteId }
  });

  if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  if (invite.userId !== (session.user as any).id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updated = await prisma.projectMember.update({
    where: { id: inviteId },
    data: { status }
  });

  if (status === "ACTIVE") {
    // Also set as active workspace
    await prisma.user.update({
      where: { id: invite.userId },
      data: { assignedProjectId: invite.projectId }
    });
  }

  return NextResponse.json(updated);
}
