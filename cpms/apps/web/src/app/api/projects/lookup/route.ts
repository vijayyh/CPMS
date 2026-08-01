import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  
  if (!code) {
    return NextResponse.json({ error: "Project code is required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { code },
    select: {
      id: true,
      name: true,
      location: true,
      code: true,
      manager: {
        select: { name: true }
      }
    }
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}
