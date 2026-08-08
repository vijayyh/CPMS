import { NextResponse } from "next/server";
import type { Session } from "next-auth";

// Internal staff roles — excludes VENDOR (external) and EMPLOYEE (site worker, self-service pages only)
export const STAFF_ROLES = ["ADMIN", "MANAGER", "PM", "SITE_ENGINEER", "PROCUREMENT", "ACCOUNTS"] as const;
export const PROCUREMENT_WRITE_ROLES = ["ADMIN", "MANAGER", "PROCUREMENT"] as const;
export const INDENT_RAISE_ROLES = ["ADMIN", "MANAGER", "PM", "SITE_ENGINEER", "PROCUREMENT"] as const;
export const INDENT_APPROVE_ROLES = ["ADMIN", "MANAGER"] as const;
export const GRN_ROLES = ["ADMIN", "MANAGER", "PROCUREMENT", "SITE_ENGINEER"] as const;
export const PROJECT_WRITE_ROLES = ["ADMIN", "MANAGER"] as const;
export const LABOUR_WRITE_ROLES = ["ADMIN", "MANAGER", "SITE_ENGINEER", "PM"] as const;

export function getRole(session: Session | null): string | null {
  return (session?.user as any)?.role ?? null;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/** Returns an error NextResponse if the session's role isn't in `allowed`, otherwise null. */
export function requireRole(session: Session | null, allowed: readonly string[]): NextResponse | null {
  const role = getRole(session);
  if (!role || !allowed.includes(role)) return forbidden();
  return null;
}