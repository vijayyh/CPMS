import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ── Indents ──────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const indents = await prisma.materialIndent.findMany({
    where: status ? { status: status as any } : {},
    include: {
      project:    { select: { name: true, code: true } },
      raisedBy:   { select: { name: true } },
      approvedBy: { select: { name: true } },
      items:      { include: { material: { select: { name: true, unit: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(indents);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { items, ...indentData } = body;

  const indentNo = `IND-${Date.now().toString(36).toUpperCase()}`;
  const indent   = await prisma.materialIndent.create({
    data: {
      ...indentData,
      indentNo,
      raisedById: (session.user as any).id,
      items: {
        create: items.map((item: any) => ({
          materialId:   item.materialId,
          requestedQty: Number(item.requestedQty),
          unit:         item.unit,
          remarks:      item.remarks,
        })),
      },
    },
    include: { items: true },
  });
  return NextResponse.json(indent, { status: 201 });
}
