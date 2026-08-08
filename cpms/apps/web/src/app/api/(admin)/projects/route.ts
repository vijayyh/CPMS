import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireRole, unauthorized, STAFF_ROLES, PROJECT_WRITE_ROLES } from "@/lib/rbac";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return unauthorized();
  const denied = requireRole(session, STAFF_ROLES);
  if (denied) return denied;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  
  const whereClause: any = {};
  if (status) whereClause.status = status as any;
  if ((session.user as any).role !== "ADMIN" && (session.user as any).assignedProjectId) {
    whereClause.id = (session.user as any).assignedProjectId;
  }

  const projects = await prisma.project.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      code: true,
      location: true,
      client: true,
      budget: true,
      startDate: true,
      endDate: true,
      status: true,
      manager: { select: { name: true, email: true } },
      _count:  { select: { labourLogs: true, indents: true, purchaseOrders: true } },
      purchaseOrders: { select: { grandTotal: true }, where: { status: { not: "CANCELLED" } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return unauthorized();
  const denied = requireRole(session, PROJECT_WRITE_ROLES);
  if (denied) return denied;
  const body = await req.json();

  // Find the highest existing project code
  const lastProject = await prisma.project.findFirst({
    orderBy: { createdAt: "desc" },
  });
  
  let nextCodeNumber = 1;
  if (lastProject && lastProject.code && lastProject.code.startsWith("PROJ-")) {
    const lastNumber = parseInt(lastProject.code.replace("PROJ-", ""), 10);
    if (!isNaN(lastNumber)) {
      nextCodeNumber = lastNumber + 1;
    } else {
      nextCodeNumber = (await prisma.project.count()) + 1;
    }
  } else {
    nextCodeNumber = (await prisma.project.count()) + 1;
  }
  
  const nextCode = `PROJ-${nextCodeNumber.toString().padStart(3, '0')}`;

  const project = await prisma.project.create({
    data: {
      ...body,
      code: nextCode,
      budget:    Number(body.budget),
      startDate: new Date(body.startDate),
      endDate:   body.endDate ? new Date(body.endDate) : undefined,
    },
  });
  
  // Assign creator as admin/manager of the project in ProjectMember
  await prisma.projectMember.create({
    data: {
      userId: (session.user as any).id,
      projectId: project.id,
      role: (session.user as any).role || "MANAGER",
      status: "ACTIVE"
    }
  });

  return NextResponse.json(project, { status: 201 });
}
