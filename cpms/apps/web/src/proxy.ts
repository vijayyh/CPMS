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

  const role = (req.auth?.user as any)?.role;
  
  const getRoleDashboard = (r: string) => {
    switch (r) {
      case 'ADMIN':
      case 'MANAGER': return '/dashboard';
      case 'VENDOR': return '/vendor/dashboard';
      case 'SITE_ENGINEER': return '/site-manager/dashboard';
      case 'ACCOUNTS': return '/accounts/dashboard';
      case 'PROCUREMENT': return '/procurement/dashboard';
      case 'EMPLOYEE': return '/employee/dashboard';
      default: return '/dashboard'; // fallback
    }
  };

  const targetDashboard = getRoleDashboard(role);
  if (req.auth && (pathname === "/login" || pathname === "/" || pathname === "/dashboard")) {
    if (pathname !== targetDashboard) {
      return NextResponse.redirect(new URL(targetDashboard, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
