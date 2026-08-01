"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import { TrendingUp, DollarSign, Package, Users, BarChart3 } from "lucide-react";
import { formatCurrency } from "@cpms/utils";

const COLORS = ["#d0532b", "#10b981", "#df643c", "#8b5cf6", "#ad3c19", "#e5bda6", "#ec4899"];

export default function ReportsPage() {
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState("all");

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div>
      <div className="page-header"><div className="page-title-block"><h1>Reports & Analytics</h1></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 300, borderRadius: 14 }} />
        ))}
      </div>
    </div>
  );

  const { kpis, spendByVendor, projectUtil } = data ?? {};

  // Material category mockup (since we don't have granular spend by category in real time)
  const materialPieData = [
    { name: "Structural",  value: 38 },
    { name: "Finishing",   value: 25 },
    { name: "Electrical",  value: 15 },
    { name: "Plumbing",    value: 12 },
    { name: "Hardware",    value: 7  },
    { name: "Safety",      value: 3  },
  ];

  // Monthly trend (mock progressive data)
  const trendData = [
    { month: "Jan", spend: 850000,  pos: 4 },
    { month: "Feb", spend: 1200000, pos: 6 },
    { month: "Mar", spend: 980000,  pos: 5 },
    { month: "Apr", spend: 1450000, pos: 8 },
    { month: "May", spend: kpis?.totalSpend ? Math.min(kpis.totalSpend, 1800000) : 1800000, pos: 10 },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Reports & Analytics</h1>
          <p>Financial insights, material utilization, and operational performance</p>
        </div>
      </div>

      {/* KPI summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Procurement Spend",  value: formatCurrency(kpis?.totalSpend ?? 0),    icon: <DollarSign size={18} />, color: "amber"   },
          { label: "Active Vendors",           value: kpis?.totalVendors ?? 0,                  icon: <Users size={18} />,      color: "success"  },
          { label: "Materials Tracked",        value: kpis?.totalMaterials ?? 0,                icon: <Package size={18} />,    color: "info"     },
          { label: "Active Projects",          value: kpis?.activeProjects ?? 0,                icon: <BarChart3 size={18} />,  color: "purple"   },
        ].map((k) => (
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className={`kpi-icon ${k.color}`}>{k.icon}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Spend trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Monthly Procurement Spend</h3>
              <p style={{ fontSize: 12, marginTop: 2 }}>Spend volume over the past 5 months</p>
            </div>
            <TrendingUp size={18} style={{ color: "var(--brand-amber)" }} />
          </div>
          <div className="card-body" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#d0532b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d0532b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bg-border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), "Spend"]}
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--bg-border-strong)", borderRadius: 10, color: "var(--text-primary)", fontSize: 13 }}
                />
                <Area type="monotone" dataKey="spend" stroke="#d0532b" strokeWidth={2} fill="url(#spendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend by vendor */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Spend by Vendor</h3>
              <p style={{ fontSize: 12, marginTop: 2 }}>Distribution of procurement spend</p>
            </div>
          </div>
          <div className="card-body" style={{ height: 260 }}>
            {spendByVendor?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendByVendor} barSize={28} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--bg-border)" />
                  <XAxis type="number" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip formatter={(v: number) => [formatCurrency(v), "Spend"]} contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--bg-border-strong)", borderRadius: 10, color: "var(--text-primary)", fontSize: 13 }} />
                  <Bar dataKey="spend" fill="var(--brand-amber)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: "100%" }}>
                <p>No spend data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Material category breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Material Category Mix</h3>
              <p style={{ fontSize: 12, marginTop: 2 }}>Breakdown by material type</p>
            </div>
          </div>
          <div className="card-body" style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={materialPieData} cx="40%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={3} dataKey="value">
                  {materialPieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  layout="vertical" align="right" verticalAlign="middle"
                  formatter={(value) => <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{value}</span>}
                />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--bg-border-strong)", borderRadius: 10, color: "var(--text-primary)", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget utilization */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Project Budget Utilization</h3>
              <p style={{ fontSize: 12, marginTop: 2 }}>Spend vs. budget per project</p>
            </div>
          </div>
          <div className="card-body">
            {projectUtil?.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {projectUtil.map((p: any) => {
                  const pct = Math.min(100, (p.spent / p.budget) * 100);
                  const color = pct > 80 ? "danger" : pct > 60 ? "amber" : "success";
                  return (
                    <div key={p.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            {formatCurrency(p.spent)} of {formatCurrency(p.budget)}
                          </div>
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: `var(--color-${color === "amber" ? "warning" : color})` }}>
                          {pct.toFixed(0)}%
                        </div>
                      </div>
                      <div className="progress-bar" style={{ height: 8 }}>
                        <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 40 }}>
                <p>No active projects to display</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PO volume trend */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3>Purchase Order Volume</h3>
            <p style={{ fontSize: 12, marginTop: 2 }}>Number of POs raised per month</p>
          </div>
        </div>
        <div className="card-body" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bg-border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--bg-border-strong)", borderRadius: 10, color: "var(--text-primary)", fontSize: 13 }} />
                <Line type="monotone" dataKey="pos" stroke="var(--brand-amber-light)" strokeWidth={2} dot={{ fill: "var(--brand-amber-light)", r: 4 }} name="POs Raised" />
              </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
