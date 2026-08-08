import Link from "next/link";
import { ClipboardList, ShoppingCart, Package, Building2, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, getStatusBadge, getStatusLabel } from "@cpms/utils";

export default async function ProcurementDashboard() {
  const session = await auth();
  const userName = session?.user?.name ?? "there";

  const [pendingIndents, openPOs, materialsCount, activeVendors, recentIndents, recentPOs] = await Promise.all([
    prisma.materialIndent.count({ where: { status: "SUBMITTED" } }),
    prisma.purchaseOrder.count({ where: { status: { in: ["DRAFT", "SENT", "ACKNOWLEDGED"] } } }),
    prisma.material.count(),
    prisma.vendor.count({ where: { status: "ACTIVE" } }),
    prisma.materialIndent.findMany({
      where: { status: "SUBMITTED" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { project: { select: { name: true } }, raisedBy: { select: { name: true } } },
    }),
    prisma.purchaseOrder.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { vendor: { select: { name: true } }, project: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-title)] mb-2">Welcome, {userName}</h1>
          <p className="text-[var(--text-secondary)]">Review indents, issue purchase orders, and manage vendors.</p>
        </div>
        <Link href="/procurement/indents" className="flex items-center gap-2 bg-[var(--bg-card)] px-4 py-2 rounded-lg border border-[var(--bg-border)] shadow-sm text-sm font-semibold text-[var(--brand-primary)] hover:bg-[var(--bg-hover)] transition-colors">
          Review Indents <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<ClipboardList size={20} />} color="orange" label="Pending Indents" value={String(pendingIndents)} />
        <StatCard icon={<ShoppingCart size={20} />} color="blue" label="Open Purchase Orders" value={String(openPOs)} />
        <StatCard icon={<Package size={20} />} color="purple" label="Materials Tracked" value={String(materialsCount)} />
        <StatCard icon={<Building2 size={20} />} color="green" label="Active Vendors" value={String(activeVendors)} />
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-[var(--bg-border)] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-title)]">Indents Awaiting Review</h2>
          <Link href="/procurement/indents" className="text-sm font-semibold text-[var(--brand-primary)] hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-hover)]">
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Indent No.</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Project</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Raised By</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Required By</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {recentIndents.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">No indents pending review.</td></tr>
              ) : (
                recentIndents.map((i) => (
                  <tr key={i.id} className="border-b border-[var(--bg-border)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="p-4 font-medium text-[var(--text-primary)]">{i.indentNo}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{i.project.name}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{i.raisedBy.name}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{formatDate(i.requiredBy)}</td>
                    <td className="p-4"><span className="badge badge-amber">{i.urgency}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-[var(--bg-border)] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-title)]">Recent Purchase Orders</h2>
          <Link href="/procurement/orders" className="text-sm font-semibold text-[var(--brand-primary)] hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-hover)]">
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">PO Number</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Vendor</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Project</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPOs.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-[var(--text-muted)]">No purchase orders yet.</td></tr>
              ) : (
                recentPOs.map((po) => (
                  <tr key={po.id} className="border-b border-[var(--bg-border)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="p-4 font-medium text-[var(--text-primary)]">{po.poNumber}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{po.vendor.name}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{po.project.name}</td>
                    <td className="p-4"><span className={`badge ${getStatusBadge(po.status)}`}>{getStatusLabel(po.status)}</span></td>
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
