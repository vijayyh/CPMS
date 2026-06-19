"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Building2, Package, FolderKanban, ClipboardList,
  ShoppingCart, DollarSign, TrendingUp, AlertTriangle,
  ArrowUpRight, CheckCircle2, Clock, Truck,
} from "lucide-react";
import { formatCurrency, formatDate, getStatusBadge, getStatusLabel } from "@/lib/utils";
import Link from "next/link";

interface DashboardData {
  kpis: {
    totalVendors:   number;
    totalMaterials: number;
    activeProjects: number;
    pendingIndents: number;
    openPOs:        number;
    totalSpend:     number;
  };
  recentPOs:      any[];
  recentIndents:  any[];
  spendByVendor:  { name: string; spend: number }[];
  projectUtil:    { name: string; budget: number; spent: number; status: string }[];
}

const CHART_COLORS = ["#d0532b", "#10b981", "#df643c", "#8b5cf6", "#ad3c19", "#e5bda6"];

export default function DashboardPage() {
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!data)   return <div className="empty-state">Failed to load dashboard data.</div>;

  const { kpis, recentPOs, recentIndents, spendByVendor, projectUtil } = data;

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="page-title-block">
          <h1>Command Dashboard</h1>
          <p>Real-time overview of your construction operations</p>
        </div>
        <div className="page-actions">
          <Link href="/procurement/indents" className="btn btn-secondary btn-sm">
            <ClipboardList size={14} /> New Indent
          </Link>
          <Link href="/procurement/orders" className="btn btn-primary btn-sm">
            <ShoppingCart size={14} /> New PO
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KPICard
          label="Total Spend"
          value={formatCurrency(kpis.totalSpend)}
          icon={<DollarSign size={20} />}
          color="amber"
          trend="+12.4% this month"
          trendUp={true}
        />
        <KPICard
          label="Active Vendors"
          value={kpis.totalVendors.toString()}
          icon={<Building2 size={20} />}
          color="cyan"
          trend="All contracts valid"
          trendUp={true}
        />
        <KPICard
          label="Active Projects"
          value={kpis.activeProjects.toString()}
          icon={<FolderKanban size={20} />}
          color="success"
          trend="On schedule"
          trendUp={true}
        />
        <KPICard
          label="Open POs"
          value={kpis.openPOs.toString()}
          icon={<ShoppingCart size={20} />}
          color="info"
          trend="Awaiting delivery"
          trendUp={false}
        />
        <KPICard
          label="Pending Indents"
          value={kpis.pendingIndents.toString()}
          icon={<ClipboardList size={20} />}
          color="amber"
          trend="Needs your review"
          trendUp={false}
        />
        <KPICard
          label="Materials Tracked"
          value={kpis.totalMaterials.toString()}
          icon={<Package size={20} />}
          color="purple"
          trend="In master catalog"
          trendUp={true}
        />
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Vendor Spend Bar Chart */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <h3>Spend by Vendor</h3>
              <p style={{ fontSize: 12, marginTop: 2 }}>Total purchase amounts per supplier</p>
            </div>
            <TrendingUp size={18} style={{ color: "var(--brand-amber)" }} />
          </div>
          <div className="card-body" style={{ height: 280 }}>
            {spendByVendor.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendByVendor} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bg-border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v: number) => [formatCurrency(v), "Spend"]}
                    contentStyle={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--bg-border-strong)",
                      borderRadius: 10,
                      color: "var(--text-primary)",
                      fontSize: 13,
                    }}
                    cursor={{ fill: "var(--bg-hover)" }}
                  />
                  <Bar dataKey="spend" fill="var(--brand-amber)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ padding: 40 }}>
                <p>No spend data yet — create your first Purchase Order</p>
              </div>
            )}
          </div>
        </div>

        {/* Project Budget Utilization */}
        <div className="card chart-card" style={{ flex: "0 0 340px" }}>
          <div className="card-header">
            <div>
              <h3>Budget Utilization</h3>
              <p style={{ fontSize: 12, marginTop: 2 }}>Spend vs. budget per site</p>
            </div>
            <FolderKanban size={18} style={{ color: "var(--color-info)" }} />
          </div>
          <div className="card-body">
            {projectUtil.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {projectUtil.map((p) => {
                  const pct = Math.min(100, (p.spent / p.budget) * 100);
                  const color = pct > 80 ? "danger" : pct > 60 ? "amber" : "success";
                  return (
                    <div key={p.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                            {formatCurrency(p.spent)} of {formatCurrency(p.budget)}
                          </div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: `var(--color-${color === "amber" ? "warning" : color})` }}>
                          {pct.toFixed(0)}%
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 40 }}>
                <p>No active projects yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity tables row */}
      <div className="activity-row">
        {/* Recent POs */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Recent Purchase Orders</h3>
              <p style={{ fontSize: 12, marginTop: 2 }}>Latest procurement activity</p>
            </div>
            <Link href="/procurement/orders" className="btn btn-ghost btn-sm">
              View All <ArrowUpRight size={13} />
            </Link>
          </div>
          <div style={{ overflowX: "auto" }}>
            {recentPOs.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Vendor</th>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPOs.map((po) => (
                    <tr key={po.id}>
                      <td>
                        <Link href={`/procurement/orders`} className="font-mono text-amber">
                          {po.poNumber}
                        </Link>
                      </td>
                      <td style={{ fontWeight: 500 }}>{po.vendor?.name}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{po.project?.name}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(po.grandTotal)}</td>
                      <td><span className={`badge ${getStatusBadge(po.status)}`}>{getStatusLabel(po.status)}</span></td>
                      <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{formatDate(po.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><ShoppingCart size={24} /></div>
                <p>No purchase orders yet</p>
                <Link href="/procurement/orders" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>Create First PO</Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Indents */}
        <div className="card" style={{ flex: "0 0 380px" }}>
          <div className="card-header">
            <div>
              <h3>Pending Indents</h3>
              <p style={{ fontSize: 12, marginTop: 2 }}>Material requests awaiting approval</p>
            </div>
            <Link href="/procurement/indents" className="btn btn-ghost btn-sm">
              View All <ArrowUpRight size={13} />
            </Link>
          </div>
          <div style={{ padding: "8px 0" }}>
            {recentIndents.length > 0 ? (
              recentIndents.map((indent) => (
                <div key={indent.id} className="indent-row">
                  <div className="indent-icon">
                    <ClipboardList size={15} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{indent.indentNo}</span>
                      <span className={`badge ${getStatusBadge(indent.status)}`}>{getStatusLabel(indent.status)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {indent.project?.name} · by {indent.raisedBy?.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-disabled)", marginTop: 2 }}>
                      Required by {formatDate(indent.requiredBy)}
                    </div>
                  </div>
                  <div>
                    <span className={`badge badge-sm ${indent.urgency === "URGENT" ? "badge-danger" : indent.urgency === "HIGH" ? "badge-amber" : "badge-muted"}`} style={{ fontSize: 10 }}>
                      {indent.urgency}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><ClipboardList size={24} /></div>
                <p>No pending indents</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 1200px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .charts-row {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .chart-card { flex: 1; }

        .activity-row {
          display: flex;
          gap: 16px;
        }

        .activity-row > .card:first-child { flex: 1; }

        .indent-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 20px;
          border-bottom: 1px solid var(--bg-border);
          transition: background var(--transition-fast);
        }

        .indent-row:last-child { border-bottom: none; }
        .indent-row:hover { background: var(--bg-hover); }

        .indent-icon {
          width: 32px;
          height: 32px;
          background: var(--bg-elevated);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          flex-shrink: 0;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}

function KPICard({
  label, value, icon, color, trend, trendUp,
}: {
  label: string; value: string; icon: React.ReactNode;
  color: string; trend: string; trendUp: boolean;
}) {
  return (
    <div className={`kpi-card ${color}`}>
      <div className={`kpi-icon ${color}`}>{icon}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-trend ${trendUp ? "up" : "down"}`}>
        <TrendingUp size={12} />
        {trend}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div className="skeleton" style={{ height: 28, width: 220, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: 300 }} />
      </div>
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card" style={{ padding: 24, height: 140 }}>
            <div className="skeleton" style={{ height: 44, width: 44, borderRadius: 10, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 28, width: 100, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: 80 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
