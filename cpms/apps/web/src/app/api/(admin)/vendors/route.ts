import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireRole, unauthorized, STAFF_ROLES, PROCUREMENT_WRITE_ROLES } from "@/lib/rbac";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return unauthorized();
  const denied = requireRole(session, STAFF_ROLES);
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";

  const vendors = await prisma.vendor.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { name:        { contains: search, mode: "insensitive" } },
            { code:        { contains: search, mode: "insensitive" } },
            { contactName: { contains: search, mode: "insensitive" } },
            { city:        { contains: search, mode: "insensitive" } },
          ],
        } : {},
        status ? { status: status as any } : {},
        ((session.user as any).role !== "ADMIN" && (session.user as any).assignedProjectId)
          ? { projects: { some: { id: (session.user as any).assignedProjectId } } }
          : {},
      ],
    },
    include: {
      _count: { select: { contracts: true, purchaseOrders: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(vendors);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return unauthorized();
  const denied = requireRole(session, PROCUREMENT_WRITE_ROLES);
  if (denied) return denied;

  const body = await req.json();
  const vendor = await prisma.vendor.create({ data: body });
  return NextResponse.json(vendor, { status: 201 });
}
