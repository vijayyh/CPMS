import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const grns = await prisma.goodsReceipt.findMany({
    include: {
      po:        { select: { poNumber: true, vendor: { select: { name: true } }, project: { select: { name: true } } } },
      createdBy: { select: { name: true } },
      items:     true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(grns);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { items, poId, ...grnData } = body;

  const grnNumber = `GRN-${Date.now().toString(36).toUpperCase()}`;

  const grn = await prisma.goodsReceipt.create({
    data: {
      ...grnData,
      poId,
      grnNumber,
      createdById: (session.user as any).id,
      status: "CONFIRMED",
      items: {
        create: items.map((item: any) => ({
          materialId:  item.materialId,
          orderedQty:  Number(item.orderedQty),
          receivedQty: Number(item.receivedQty),
          acceptedQty: Number(item.acceptedQty),
          rejectedQty: Number(item.rejectedQty ?? 0),
          unitRate:    Number(item.unitRate),
          totalAmount: Number(item.acceptedQty) * Number(item.unitRate),
          remarks:     item.remarks,
        })),
      },
    },
  });

  // Update PO received qty and status
  const po = await prisma.purchaseOrder.findUnique({
    where: { id: poId },
    include: { lineItems: true },
  });

  if (po) {
    for (const grnItem of items) {
      await prisma.pOLineItem.updateMany({
        where: { poId, materialId: grnItem.materialId },
        data: { receivedQty: { increment: Number(grnItem.acceptedQty) } },
      });

      // Update/create site inventory
      const project = await prisma.purchaseOrder.findUnique({
        where: { id: poId },
        select: { projectId: true },
      });

      if (project) {
        const mat = await prisma.material.findUnique({ where: { id: grnItem.materialId }, select: { unit: true } });
        await prisma.siteInventory.upsert({
          where: { projectId_materialId: { projectId: project.projectId, materialId: grnItem.materialId } },
          update: { currentStock: { increment: Number(grnItem.acceptedQty) }, lastUpdated: new Date() },
          create: {
            projectId:    project.projectId,
            materialId:   grnItem.materialId,
            currentStock: Number(grnItem.acceptedQty),
            unit:         mat?.unit ?? "PIECE",
          },
        });
      }
    }
    // Mark PO as received
    await prisma.purchaseOrder.update({
      where: { id: poId },
      data: { status: "RECEIVED" },
    });
  }

  return NextResponse.json(grn, { status: 201 });
}
