import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { assignedProjectId: true }
  });

  const memberships = await prisma.projectMember.findMany({
    where: {
      userId,
      status: "ACTIVE"
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          code: true,
        }
      }
    }
  });

  return NextResponse.json({
    activeProjectId: user?.assignedProjectId,
    projects: memberships.map(m => m.project)
  });
}
