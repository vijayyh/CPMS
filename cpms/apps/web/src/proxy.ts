import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req: any) => {
  const { pathname } = req.nextUrl;

  const publicPaths = ["/login", "/signup", "/api/auth", "/api/seed", "/api/check-user"];
  const isPublic    = publicPaths.some((p) => pathname.startsWith(p));

  if (!req.auth && !isPublic) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (req.auth && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (req.auth && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const role = (req.auth?.user as any)?.role;

  const restrictedForEmployee = [
    '/vendors',
    '/materials',
    '/procurement',
    '/projects',
    '/reports',
    '/settings',
    '/admin',
    '/api/vendors',
    '/api/materials',
    '/api/procurement',
    '/api/projects',
    '/api/dashboard'
  ];

  if (role === 'EMPLOYEE') {
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/employee/dashboard', req.url));
    }

    const isRestricted = restrictedForEmployee.some(p => pathname.startsWith(p));
    if (isRestricted) {
      return NextResponse.redirect(new URL('/employee/dashboard', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
