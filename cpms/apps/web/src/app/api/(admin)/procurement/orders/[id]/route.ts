import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireRole, unauthorized, PROCUREMENT_WRITE_ROLES } from "@/lib/rbac";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return unauthorized();
  const denied = requireRole(session, PROCUREMENT_WRITE_ROLES);
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json();
  const po = await prisma.purchaseOrder.update({ where: { id }, data: body });
  return NextResponse.json(po);
}
