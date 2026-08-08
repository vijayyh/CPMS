import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authSecret } from "@/lib/auth";

// Issues a real NextAuth-compatible session token directly in the response body,
// so mobile clients don't have to scrape Set-Cookie headers (which fetch on native
// platforms cannot reliably read) or guess the cookie name NextAuth is using.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body?.email;
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const secureCookie = new URL(req.url).protocol === "https:";
  const cookieName = secureCookie ? "__Secure-authjs.session-token" : "authjs.session-token";

  const token = await encode({
    secret: authSecret,
    salt: cookieName,
    token: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.avatar ?? null,
      role: user.role,
      assignedProjectId: user.assignedProjectId,
    },
  });

  return NextResponse.json({
    token,
    cookieName,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedProjectId: user.assignedProjectId,
    },
  });
}
