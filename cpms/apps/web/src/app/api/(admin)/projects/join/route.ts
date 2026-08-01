import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { code } = body;

  if (!code) {
    return NextResponse.json({ error: "Project code is required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { code }
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const userId = (session.user as any).id;

  // Check if already a member
  const existingMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId: project.id
      }
    }
  });

  if (existingMember) {
    // If pending, accept it
    if (existingMember.status === "PENDING") {
      await prisma.projectMember.update({
        where: { id: existingMember.id },
        data: { status: "ACTIVE" }
      });
    }
  } else {
    // Create new active membership
    await prisma.projectMember.create({
      data: {
        userId,
        projectId: project.id,
        role: (session.user as any).role || "EMPLOYEE",
        status: "ACTIVE"
      }
    });
  }

  // Set as currently active project in User table
  await prisma.user.update({
    where: { id: userId },
    data: { assignedProjectId: project.id }
  });

  return NextResponse.json({ success: true, projectId: project.id });
}
