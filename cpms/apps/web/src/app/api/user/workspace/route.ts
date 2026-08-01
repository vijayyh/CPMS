import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { projectId } = body;

  if (!projectId) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  const userId = (session.user as any).id;

  // Verify the user is actually a member of this project
  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId
      }
    }
  });

  if (!membership || membership.status !== "ACTIVE") {
    return NextResponse.json({ error: "You are not an active member of this project" }, { status: 403 });
  }

  // Set as currently active project in User table
  await prisma.user.update({
    where: { id: userId },
    data: { assignedProjectId: projectId }
  });

  return NextResponse.json({ success: true, projectId });
}
