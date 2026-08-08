import { Calendar } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, getStatusBadge } from "@cpms/utils";
import LeaveRequestForm from "./LeaveRequestForm";

export default async function LeavePage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const requests = userId
    ? await prisma.leaveRequest.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="animate-fade-in flex flex-col w-full max-w-7xl mx-auto md:px-0" style={{ gap: '40px', paddingBottom: '96px', paddingLeft: '16px', paddingRight: '16px' }}>

      {/* 1. HERO SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between" style={{ gap: '24px' }}>
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-title)]">Leave Requests</h1>
          <p className="text-base text-muted font-medium">Manage your time off and view leave balance.</p>
        </div>
        <LeaveRequestForm />
      </section>

      {/* 2. CONTENT CONTAINER */}
      <section className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '32px' }}>
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-12 overflow-hidden shadow-float-sm bg-[var(--bg-card)]" style={{ minHeight: '420px' }}>
          <div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-lg bg-[var(--color-warning)]/10 text-[var(--color-warning)] shadow-inner" style={{ padding: '8px' }}>
                <Calendar size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">My Leave Requests</h3>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: '32px 24px', gap: '32px' }}>
              <span className="text-muted font-medium text-sm">No leave requests found.</span>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td><span className="badge badge-muted">{r.type}</span></td>
                      <td style={{ fontWeight: 600 }}>{formatDate(r.startDate)}</td>
                      <td style={{ fontWeight: 600 }}>{formatDate(r.endDate)}</td>
                      <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{r.reason}</td>
                      <td><span className={`badge ${getStatusBadge(r.status)}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
