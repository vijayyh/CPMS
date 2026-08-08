import Link from "next/link";
import { AlertCircle, Users, ClipboardList, Package, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getStatusBadge, getStatusLabel } from "@cpms/utils";

export default async function SiteManagerDashboard() {
  const session = await auth();
  const userName = session?.user?.name ?? "there";
  const assignedProjectId = (session?.user as any)?.assignedProjectId as string | null | undefined;

  if (!assignedProjectId) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-500 p-6 rounded-xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-lg mb-1">No Project Assigned</h3>
            <p className="mb-4">You are not currently assigned to a project site.</p>
            <Link href="/projects/join" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--brand-primary)] text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
              Join a Project <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [project, labourLogs, pendingIndents, inventoryCount] = await Promise.all([
    prisma.project.findUnique({
      where: { id: assignedProjectId },
      include: { manager: { select: { name: true } } },
    }),
    prisma.labour.findMany({
      where: { projectId: assignedProjectId },
      orderBy: { date: "desc" },
      take: 6,
    }),
    prisma.materialIndent.count({ where: { projectId: assignedProjectId, status: { in: ["DRAFT", "SUBMITTED"] } } }),
    prisma.siteInventory.count({ where: { projectId: assignedProjectId } }),
  ]);

  if (!project) return null;

  const monthlyLabourCost = labourLogs.reduce((s, l) => s + l.totalCost, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-title)] mb-2">Welcome, {userName}</h1>
          <p className="text-[var(--text-secondary)]">{project.name} · {project.location}</p>
        </div>
        <div className="bg-[var(--bg-card)] px-4 py-2 rounded-lg border border-[var(--bg-border)] shadow-sm">
          <div className="text-xs text-[var(--text-muted)] font-semibold uppercase">Project Status</div>
          <span className={`badge ${getStatusBadge(project.status)}`}>{getStatusLabel(project.status)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<ClipboardList size={20} />} color="orange" label="Pending Indents" value={String(pendingIndents)} />
        <StatCard icon={<Users size={20} />} color="blue" label="Recent Labour Spend" value={formatCurrency(monthlyLabourCost)} />
        <StatCard icon={<Package size={20} />} color="purple" label="Materials in Stock" value={String(inventoryCount)} />
      </div>

      <div className="flex gap-4">
        <Link href="/procurement/indents/new" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--brand-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors shadow-sm">
          Raise Material Indent
        </Link>
        <Link href="/projects/labour" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--bg-card)] border border-[var(--bg-border)] text-sm font-medium rounded-lg hover:bg-[var(--bg-hover)] transition-colors shadow-sm">
          Log Labour
        </Link>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-[var(--bg-border)]">
          <h2 className="text-xl font-bold text-[var(--text-title)]">Recent Labour Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-hover)]">
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Labour Type</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Count</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Cost</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Supervisor</th>
              </tr>
            </thead>
            <tbody>
              {labourLogs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">No labour logs yet for this project.</td></tr>
              ) : (
                labourLogs.map((l) => (
                  <tr key={l.id} className="border-b border-[var(--bg-border)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="p-4 text-[var(--text-secondary)]">{formatDate(l.date)}</td>
                    <td className="p-4 font-medium text-[var(--text-primary)]">{l.labourType}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{l.count}</td>
                    <td className="p-4 font-semibold text-[var(--text-primary)]">{formatCurrency(l.totalCost)}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{l.supervisorName ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, color, label, value }: { icon: React.ReactNode; color: string; label: string; value: string }) {
  const colorMap: Record<string, string> = {
    green:  "bg-green-500/10 text-green-500",
    blue:   "bg-blue-500/10 text-blue-500",
    orange: "bg-orange-500/10 text-orange-500",
    purple: "bg-purple-500/10 text-purple-500",
  };
  return (
    <div className="glass-panel p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[var(--text-secondary)] font-medium">{label}</h3>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</div>
      </div>
      <div className="text-3xl font-bold text-[var(--text-primary)]">{value}</div>
    </div>
  );
}
