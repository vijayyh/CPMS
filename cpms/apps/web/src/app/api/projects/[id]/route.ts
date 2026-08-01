import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      manager: { select: { name: true, email: true, role: true } },
      labourLogs: { orderBy: { date: "desc" }, take: 30 },
      indents: {
        orderBy: { createdAt: "desc" }, take: 10,
        include: { raisedBy: { select: { name: true } }, items: { include: { material: { select: { name: true } } } } },
      },
      purchaseOrders: {
        orderBy: { createdAt: "desc" }, take: 10,
        include: { vendor: { select: { name: true } } },
      },
      siteInventory: {
        include: { material: { select: { name: true, unit: true, category: true } } },
        orderBy: { lastUpdated: "desc" },
      },
    },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const project = await prisma.project.update({ where: { id }, data: body });
  return NextResponse.json(project);
}
