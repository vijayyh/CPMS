import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireRole, unauthorized, INDENT_APPROVE_ROLES } from "@/lib/rbac";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return unauthorized();
  const denied = requireRole(session, INDENT_APPROVE_ROLES);
  if (denied) return denied;
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
