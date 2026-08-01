import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, projectCode } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, password, role)" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    let assignedProjectId = null;
    if (projectCode) {
      const proj = await prisma.project.findUnique({
        where: { code: projectCode }
      });
      if (proj) {
        assignedProjectId = proj.id;
      }
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        assignedProjectId,
      },
    });

    return NextResponse.json(
      {
        user: {
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}
