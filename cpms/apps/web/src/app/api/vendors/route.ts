import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const vendor = await prisma.vendor.create({ data: body });
  return NextResponse.json(vendor, { status: 201 });
}
