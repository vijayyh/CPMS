import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar  from "@/components/layout/TopBar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user?.name  ?? "User";
  const userRole = (session.user as any)?.role ?? "MANAGER";

  return (
    <SessionProvider session={session}>
      <div className="app-shell" style={{ position: "relative" }}>
        <Sidebar />
        <div className="main-content" style={{ position: "relative", zIndex: 1 }}>
          <TopBar userName={userName} userRole={userRole} />
          <main className="page-content">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </SessionProvider>
  );
}
