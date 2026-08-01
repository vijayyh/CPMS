import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const search   = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const materials = await prisma.material.findMany({
    where: {
      AND: [
        search ? { OR: [
          { name: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } },
        ] } : {},
        category ? { category: category as any } : {},
      ],
    },
    include: {
      _count: { select: { contracts: true } },
      contracts: {
        where: { isActive: true },
        include: { vendor: { select: { name: true } } },
        orderBy: { negotiatedRate: "asc" },
        take: 3,
      },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(materials);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const material = await prisma.material.create({ data: body });
  return NextResponse.json(material, { status: 201 });
}
