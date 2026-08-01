import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const orders = await prisma.purchaseOrder.findMany({
    where: status ? { status: status as any } : {},
    include: {
      vendor:    { select: { name: true, code: true } },
      project:   { select: { name: true, code: true } },
      createdBy: { select: { name: true } },
      lineItems: { include: { material: { select: { name: true, unit: true } } } },
      receipts:  { select: { id: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { lineItems, ...poData } = body;

  const poNumber = `PO-${Date.now().toString(36).toUpperCase()}`;

  // Compute totals
  let totalAmount = 0, taxAmount = 0;
  const processedItems = lineItems.map((item: any) => {
    const qty   = Number(item.quantity);
    const rate  = Number(item.unitRate);
    const tax   = Number(item.taxPercent ?? 18);
    const amt   = qty * rate;
    const taxAmt = amt * (tax / 100);
    totalAmount += amt;
    taxAmount   += taxAmt;
    return {
      materialId:  item.materialId,
      quantity:    qty,
      unitRate:    rate,
      taxPercent:  tax,
      amount:      amt,
      taxAmount:   taxAmt,
      totalAmount: amt + taxAmt,
      remarks:     item.remarks,
    };
  });

  const grandTotal = totalAmount + taxAmount;

  const po = await prisma.purchaseOrder.create({
    data: {
      ...poData,
      poNumber,
      createdById: (session.user as any).id,
      totalAmount,
      taxAmount,
      grandTotal,
      lineItems: { create: processedItems },
    },
    include: { lineItems: true, vendor: true, project: true },
  });
  return NextResponse.json(po, { status: 201 });
}
