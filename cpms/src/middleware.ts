import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
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
    '/api/dashboard' // Employee has their own dashboard UI, maybe we shouldn't block /api/dashboard if it's used? Actually we'll skip dashboard API here and handle it in the handler if needed.
  ];

  if (role === 'EMPLOYEE') {
    if (req.nextUrl.pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/employee/dashboard', req.nextUrl));
    }

    const isRestricted = restrictedForEmployee.some(path => req.nextUrl.pathname.startsWith(path));
    if (isRestricted) {
      return NextResponse.redirect(new URL('/employee/dashboard', req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
