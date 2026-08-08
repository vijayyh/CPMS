import { ClipboardList, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@cpms/utils";

const STATUS_BADGE: Record<string, string> = {
  PRESENT: "badge-success",
  LATE:    "badge-amber",
  ABSENT:  "badge-danger",
};

function formatTime(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

export default async function AttendancePage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const records = userId
    ? await prisma.attendance.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 30,
      })
    : [];

  const totalHours = records.reduce((s, r) => s + r.hoursWorked, 0);
  const presentDays = records.filter((r) => r.status === "PRESENT").length;

  return (
    <div className="animate-fade-in flex flex-col w-full max-w-7xl mx-auto md:px-0" style={{ gap: '40px', paddingBottom: '96px', paddingLeft: '16px', paddingRight: '16px' }}>

      {/* 1. HERO SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between" style={{ gap: '24px' }}>
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-title)]">My Attendance</h1>
          <p className="text-base text-muted font-medium">View your daily clock in/out history and working hours.</p>
        </div>
      </section>

      {/* 2. SUMMARY */}
      <section className="grid grid-cols-2 md:grid-cols-3" style={{ gap: '16px' }}>
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col bg-[var(--bg-card)]" style={{ padding: '20px' }}>
          <span className="text-[10px] text-muted uppercase tracking-widest font-black">Days Present (30d)</span>
          <span className="text-2xl font-black text-[var(--text-title)]" style={{ marginTop: '8px' }}>{presentDays}</span>
        </div>
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col bg-[var(--bg-card)]" style={{ padding: '20px' }}>
          <span className="text-[10px] text-muted uppercase tracking-widest font-black">Total Hours (30d)</span>
          <span className="text-2xl font-black text-[var(--text-title)]" style={{ marginTop: '8px' }}>{totalHours.toFixed(1)}h</span>
        </div>
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col bg-[var(--bg-card)]" style={{ padding: '20px' }}>
          <span className="text-[10px] text-muted uppercase tracking-widest font-black">Records</span>
          <span className="text-2xl font-black text-[var(--text-title)]" style={{ marginTop: '8px' }}>{records.length}</span>
        </div>
      </section>

      {/* 3. CONTENT CONTAINER */}
      <section className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '32px' }}>
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-12 overflow-hidden shadow-float-sm bg-[var(--bg-card)]" style={{ minHeight: '420px' }}>
          <div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shadow-inner" style={{ padding: '8px' }}>
                <ClipboardList size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">Attendance History</h3>
            </div>
          </div>

          {records.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: '32px 24px', gap: '32px' }}>
              <span className="text-muted font-medium text-sm">Attendance records will appear here.</span>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Status</th>
                    <th>Hours</th>
                    <th>Overtime</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{formatDate(r.date)}</td>
                      <td><Clock size={12} style={{ display: "inline", marginRight: 4, opacity: 0.6 }} />{formatTime(r.clockIn)}</td>
                      <td><Clock size={12} style={{ display: "inline", marginRight: 4, opacity: 0.6 }} />{formatTime(r.clockOut)}</td>
                      <td><span className={`badge ${STATUS_BADGE[r.status] ?? "badge-muted"}`}>{r.status}</span></td>
                      <td>{r.hoursWorked ? `${r.hoursWorked}h` : "—"}</td>
                      <td>{r.overtime ? `${r.overtime}h` : "—"}</td>
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
