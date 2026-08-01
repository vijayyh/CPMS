import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { status, approvedById } = await req.json();
  const indent = await prisma.materialIndent.update({
    where: { id },
    data: {
      status,
      ...(approvedById ? { approvedById } : {}),
    },
  });
  return NextResponse.json(indent);
}
