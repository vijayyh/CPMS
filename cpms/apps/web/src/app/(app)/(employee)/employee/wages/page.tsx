import { IndianRupee } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@cpms/utils";

const STATUS_BADGE: Record<string, string> = {
  PAID:       "badge-success",
  PENDING:    "badge-amber",
  PROCESSING: "badge-info",
};

export default async function WagesPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const wages = userId
    ? await prisma.dailyWage.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 30,
      })
    : [];

  const totalPaid    = wages.filter((w) => w.status === "PAID").reduce((s, w) => s + w.amount, 0);
  const totalPending  = wages.filter((w) => w.status !== "PAID").reduce((s, w) => s + w.amount, 0);

  return (
    <div className="animate-fade-in flex flex-col w-full max-w-7xl mx-auto md:px-0" style={{ gap: '40px', paddingBottom: '96px', paddingLeft: '16px', paddingRight: '16px' }}>

      {/* 1. HERO SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between" style={{ gap: '24px' }}>
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-title)]">My Daily Wages</h1>
          <p className="text-base text-muted font-medium">View your earnings and payment history.</p>
        </div>
      </section>

      {/* 2. SUMMARY */}
      <section className="grid grid-cols-2 md:grid-cols-2" style={{ gap: '16px' }}>
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col bg-[var(--bg-card)]" style={{ padding: '20px' }}>
          <span className="text-[10px] text-muted uppercase tracking-widest font-black">Total Paid</span>
          <span className="text-2xl font-black text-[var(--color-success)]" style={{ marginTop: '8px' }}>{formatCurrency(totalPaid)}</span>
        </div>
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col bg-[var(--bg-card)]" style={{ padding: '20px' }}>
          <span className="text-[10px] text-muted uppercase tracking-widest font-black">Pending / Processing</span>
          <span className="text-2xl font-black text-[var(--color-warning)]" style={{ marginTop: '8px' }}>{formatCurrency(totalPending)}</span>
        </div>
      </section>

      {/* 3. CONTENT CONTAINER */}
      <section className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '32px' }}>
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-12 overflow-hidden shadow-float-sm bg-[var(--bg-card)]" style={{ minHeight: '420px' }}>
          <div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)] shadow-inner" style={{ padding: '8px' }}>
                <IndianRupee size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">Earnings Snapshot</h3>
            </div>
          </div>

          {wages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: '32px 24px', gap: '32px' }}>
              <span className="text-muted font-medium text-sm">Wage history will appear here.</span>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Expected Date</th>
                    <th>Paid On</th>
                  </tr>
                </thead>
                <tbody>
                  {wages.map((w) => (
                    <tr key={w.id}>
                      <td style={{ fontWeight: 600 }}>{formatDate(w.date)}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(w.amount)}</td>
                      <td><span className={`badge ${STATUS_BADGE[w.status] ?? "badge-muted"}`}>{w.status}</span></td>
                      <td>{w.expectedDate ? formatDate(w.expectedDate) : "—"}</td>
                      <td>{w.paymentDate ? formatDate(w.paymentDate) : "—"}</td>
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
