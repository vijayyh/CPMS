import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const logs = await prisma.labour.findMany({
      include: {
        project: { select: { id: true, name: true, code: true } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const log = await prisma.labour.create({
    data: {
      projectId:     body.projectId,
      date:          new Date(body.date),
      labourType:    body.labourType,
      count:         Number(body.count),
      dailyRate:     Number(body.dailyRate),
      totalCost:     Number(body.count) * Number(body.dailyRate),
      supervisorName: body.supervisorName,
      notes:         body.notes,
    },
  });
  return NextResponse.json(log, { status: 201 });
}
