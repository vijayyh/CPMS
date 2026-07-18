import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const projects = await prisma.project.findMany({
    where: status ? { status: status as any } : {},
    include: {
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
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const project = await prisma.project.create({
    data: {
      ...body,
      budget:    Number(body.budget),
      startDate: new Date(body.startDate),
      endDate:   body.endDate ? new Date(body.endDate) : undefined,
    },
  });
  return NextResponse.json(project, { status: 201 });
}
