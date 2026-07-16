"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import {
  Building2, Package, FolderKanban, ShoppingCart, 
  TrendingUp, ClipboardList, AlertCircle, Plus, FileText,
  Clock, CheckCircle2, Sun, ArrowUpRight, CloudRain,
  IndianRupee, Users
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from "recharts";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PLACEHOLDER_CHART_DATA = [
  { name: "Jan", spend: 40 },
  { name: "Feb", spend: 30 },
  { name: "Mar", spend: 50 },
  { name: "Apr", spend: 20 },
  { name: "May", spend: 60 },
  { name: "Jun", spend: 45 },
];

const PLACEHOLDER_VENDOR_DATA = [
  { id: "v1", name: "UltraTech", spend: 12 },
  { id: "v2", name: "Tata Steel", spend: 25 },
  { id: "v3", name: "L&T Const.", spend: 8 },
  { id: "v4", name: "Asian Paints", spend: 4.5 },
];

const PLACEHOLDER_BUDGET_UTILIZATION = [
  { id: "p1", name: "Skyline Tower A", budget: 50, spent: 30 },
  { id: "p2", name: "Metro Station North", budget: 80, spent: 65 },
  { id: "p3", name: "Highway Expansion", budget: 120, spent: 110 },
];

const PLACEHOLDER_ACTIVITIES = [
  { id: 1, type: "PO", title: "PO-2024-001 created", time: "10m ago", status: "Approved", icon: <ShoppingCart size={14} />, color: "var(--color-info)" },
  { id: 2, type: "Indent", title: "IND-882 submitted", time: "1h ago", status: "Review", icon: <ClipboardList size={14} />, color: "var(--color-warning)" },
  { id: 3, type: "Issue", title: "Concrete delay", time: "2h ago", status: "Open", icon: <AlertCircle size={14} />, color: "var(--color-danger)" },
  { id: 4, type: "Task", title: "Site Log Filed", time: "3h ago", status: "Done", icon: <CheckCircle2 size={14} />, color: "var(--color-success)" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const userRole = (session?.user as any)?.role || "MANAGER";
  
  const isAdmin = userRole === "ADMIN" || userRole === "MANAGER";
  const isSiteEngineer = userRole === "SITE_ENGINEER";
  const isAccounts = userRole === "ACCOUNTS";
  const isProcurement = userRole === "PROCUREMENT";
  const isVendor = userRole === "VENDOR";

  const canSeeEngineering = isAdmin || isSiteEngineer;
  const canSeeFinance = isAdmin || isAccounts;
  const canSeeProcurement = isAdmin || isProcurement;

  const router = useRouter();

  const dummySparkline = [
    { value: 20 }, { value: 35 }, { value: 25 }, { value: 45 }, { value: 40 }, { value: 60 }
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section glass-panel">
        <div className="hero-content">
          <div className="hero-greeting">
            <h1>Good Morning, {userName}</h1>
            <p className="hero-date">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
          </div>
          <div className="hero-widgets">
            <div className="hero-widget">
              <div className="widget-icon bg-info"><FolderKanban size={18} /></div>
              <div className="widget-info">
                <span className="widget-label">Active Sites</span>
                <span className="widget-value">4 Projects</span>
              </div>
            </div>
            <div className="hero-widget">
              <div className="widget-icon bg-warning"><Sun size={18} /></div>
              <div className="widget-info">
                <span className="widget-label">Weather (Mumbai)</span>
                <span className="widget-value">28°C, Clear</span>
              </div>
            </div>
            <div className="hero-widget">
              <div className="widget-icon bg-success"><CheckCircle2 size={18} /></div>
              <div className="widget-info">
                <span className="widget-label">Today's Progress</span>
                <span className="widget-value">On Track</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACTIONS */}
      <section className="quick-actions-grid">
        <button className="quick-action-btn glass-panel glass-panel-hoverable" onClick={() => router.push('/procurement/indents/new')}>
          <div className="qa-icon" style={{ color: 'var(--color-info)' }}><ClipboardList size={20} /></div>
          <span>New Indent</span>
        </button>
        {canSeeFinance && (
          <button className="quick-action-btn glass-panel glass-panel-hoverable" onClick={() => router.push('/procurement/orders/new')}>
            <div className="qa-icon" style={{ color: 'var(--brand-primary)' }}><ShoppingCart size={20} /></div>
            <span>New PO</span>
          </button>
        )}
        <button className="quick-action-btn glass-panel glass-panel-hoverable" onClick={() => router.push('/projects/issues/new')}>
          <div className="qa-icon" style={{ color: 'var(--color-danger)' }}><AlertCircle size={20} /></div>
          <span>Log Issue</span>
        </button>
        <button className="quick-action-btn glass-panel glass-panel-hoverable" onClick={() => router.push('/projects/labour/new')}>
          <div className="qa-icon" style={{ color: 'var(--color-success)' }}><Users size={20} /></div>
          <span>Labour Log</span>
        </button>
      </section>

      {/* 3. BENTO GRID KPI & ANALYTICS */}
      <section className="bento-grid">
        
        {/* Hero KPI: Total Spend (Spans 8 cols) */}
        {canSeeFinance && (
          <div className="bento-item glass-panel glass-panel-hoverable col-span-8 finance-hero">
            <div className="bento-header">
              <div className="bento-title">Total Spend (YTD)</div>
              <div className="bento-badge badge-success"><TrendingUp size={12}/> +12.4%</div>
            </div>
            <div className="bento-body row-layout">
              <div className="finance-huge">
                <span className="currency">₹</span>24.5L
              </div>
              <div className="finance-chart">
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={dummySparkline}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="var(--brand-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Medium KPI: Active Vendors */}
        {canSeeFinance && (
          <div className="bento-item glass-panel glass-panel-hoverable col-span-4 kpi-standard">
            <div className="bento-header">
              <div className="kpi-icon-wrap bg-info"><Building2 size={20} /></div>
              <div className="bento-badge badge-info">18 Total</div>
            </div>
            <div className="bento-body">
              <div className="kpi-value">18</div>
              <div className="kpi-label">Active Vendors</div>
              <div className="kpi-trend text-success"><TrendingUp size={14}/> 2 added this week</div>
            </div>
          </div>
        )}

        {/* Medium KPI: Pending Indents */}
        {canSeeEngineering && (
          <div className="bento-item glass-panel glass-panel-hoverable col-span-3 kpi-standard">
            <div className="bento-header">
              <div className="kpi-icon-wrap bg-warning"><ClipboardList size={20} /></div>
            </div>
            <div className="bento-body">
              <div className="kpi-value">12</div>
              <div className="kpi-label">Pending Indents</div>
              <div className="kpi-trend text-warning"><AlertCircle size={14}/> Needs review</div>
            </div>
          </div>
        )}

        {/* Medium KPI: Materials Tracked */}
        {canSeeEngineering && (
          <div className="bento-item glass-panel glass-panel-hoverable col-span-3 kpi-standard">
            <div className="bento-header">
              <div className="kpi-icon-wrap bg-secondary"><Package size={20} /></div>
            </div>
            <div className="bento-body">
              <div className="kpi-value">245</div>
              <div className="kpi-label">Materials Tracked</div>
              <div className="kpi-trend text-success"><CheckCircle2 size={14}/> In catalog</div>
            </div>
          </div>
        )}

        {/* Medium KPI: Open Issues */}
        {canSeeEngineering && (
          <div className="bento-item glass-panel glass-panel-hoverable col-span-3 kpi-standard">
            <div className="bento-header">
              <div className="kpi-icon-wrap bg-danger"><AlertCircle size={20} /></div>
            </div>
            <div className="bento-body">
              <div className="kpi-value">3</div>
              <div className="kpi-label">Open Issues</div>
              <div className="kpi-trend text-danger"><Clock size={14}/> Requires attention</div>
            </div>
          </div>
        )}
        
        {/* Medium KPI: Overdue Tasks */}
        {canSeeEngineering && (
          <div className="bento-item glass-panel glass-panel-hoverable col-span-3 kpi-standard">
            <div className="bento-header">
              <div className="kpi-icon-wrap bg-success"><CheckCircle2 size={20} /></div>
            </div>
            <div className="bento-body" style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div className="kpi-label" style={{ opacity: 0.5 }}>No Overdue Tasks</div>
            </div>
          </div>
        )}

        {/* Charts & Lists (Row 3) */}
        
        {/* Spend Analytics */}
        {canSeeFinance && (
          <div className="bento-item glass-panel col-span-8">
            <div className="bento-header with-border">
              <div className="header-titles">
                <h3>Spend Analytics</h3>
                <p>Monthly procurement expenditure (in Lakhs)</p>
              </div>
            </div>
            <div className="bento-body" style={{ height: 320, padding: '24px 12px 12px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PLACEHOLDER_CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpendChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.5}/>
                      <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0.0}/>
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bg-border-solid)" />
                  <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tickFormatter={(v) => `₹${v}L`} tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip
                    formatter={(v: number) => [`₹${v}L`, "Spend"]}
                    contentStyle={{ background: "var(--bg-card-solid)", border: "1px solid var(--bg-border)", borderRadius: 12, boxShadow: "var(--shadow-float-md)", color: "var(--text-primary)", fontWeight: 600 }}
                    itemStyle={{ color: "var(--color-success)", fontWeight: 700 }}
                    cursor={{ stroke: 'var(--bg-border)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="spend" 
                    stroke="var(--color-success)" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorSpendChart)" 
                    activeDot={{ r: 6, fill: "var(--bg-card-solid)", stroke: "var(--color-success)", strokeWidth: 3, style: { filter: "url(#glow)" } }} 
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bento-item glass-panel col-span-4">
          <div className="bento-header with-border">
            <div className="header-titles">
              <h3>Recent Activity</h3>
              <p>Latest platform updates</p>
            </div>
            <button className="btn-link">View All</button>
          </div>
          <div className="bento-body list-body">
            {PLACEHOLDER_ACTIVITIES.map((act) => (
              <div key={act.id} className="activity-row">
                <div className="act-icon-wrap" style={{ background: act.color + '15', color: act.color }}>
                  {act.icon}
                </div>
                <div className="act-content">
                  <div className="act-title">{act.title}</div>
                  <div className="act-meta">{act.time}</div>
                </div>
                <div className="act-status">{act.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Utilization */}
        {canSeeFinance && (
          <div className="bento-item glass-panel col-span-6">
            <div className="bento-header with-border">
              <div className="header-titles">
                <h3>Budget Utilization</h3>
                <p>Project spend vs allocation</p>
              </div>
            </div>
            <div className="bento-body list-body">
              {PLACEHOLDER_BUDGET_UTILIZATION.map((proj) => {
                const perc = (proj.spent / proj.budget) * 100;
                const statusColor = perc > 90 ? 'var(--color-danger)' : perc > 75 ? 'var(--color-warning)' : 'var(--color-success)';
                return (
                  <div key={proj.id} className="budget-row">
                    <div className="budget-info">
                      <span className="proj-name">{proj.name}</span>
                      <span className="proj-stats">₹{proj.spent}L / ₹{proj.budget}L</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${perc}%`, background: statusColor, boxShadow: `0 0 12px ${statusColor}` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Spend by Vendor */}
        {canSeeFinance && (
          <div className="bento-item glass-panel col-span-6">
            <div className="bento-header with-border">
              <div className="header-titles">
                <h3>Top Vendors</h3>
                <p>By PO Value (in Lakhs)</p>
              </div>
            </div>
            <div className="bento-body" style={{ height: 240, padding: '24px 12px 12px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PLACEHOLDER_VENDOR_DATA} layout="vertical" barSize={24} margin={{ left: 30, right: 10 }}>
                  <defs>
                    <linearGradient id="colorVendor" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--color-info)" stopOpacity={0.6}/>
                      <stop offset="100%" stopColor="var(--color-info)" stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--bg-border-solid)" />
                  <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "var(--text-primary)", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(v: number) => [`₹${v}L`, "PO Value"]}
                    contentStyle={{ background: "var(--bg-card-solid)", border: "1px solid var(--bg-border)", borderRadius: 12, boxShadow: "var(--shadow-float-md)", color: "var(--text-primary)", fontWeight: 600 }}
                    itemStyle={{ color: "var(--color-info)", fontWeight: 700 }}
                    cursor={{ fill: "var(--bg-hover)" }}
                  />
                  <Bar 
                    dataKey="spend" 
                    fill="url(#colorVendor)" 
                    radius={[0, 8, 8, 0]} 
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </section>

      <style>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Hero Section */
        .hero-section {
          padding: 32px 40px;
          background: linear-gradient(135deg, rgba(255,107,53,0.08), transparent);
          position: relative;
          overflow: hidden;
        }

        .dark .hero-section {
          background: linear-gradient(135deg, rgba(255,107,53,0.05), transparent);
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, var(--brand-glow) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 0;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 24px;
        }

        .hero-greeting h1 {
          font-size: 28px;
          margin-bottom: 4px;
        }

        .hero-date {
          font-size: 15px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .hero-widgets {
          display: flex;
          gap: 24px;
        }

        .hero-widget {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--bg-hover);
          padding: 12px 20px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--bg-border);
        }

        .widget-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: white;
        }
        
        .bg-info { background: var(--color-info); }
        .bg-warning { background: var(--color-warning); }
        .bg-success { background: var(--color-success); }
        .bg-danger { background: var(--color-danger); }
        .bg-secondary { background: var(--brand-secondary); }

        .widget-info {
          display: flex; flex-direction: column;
        }

        .widget-label { font-size: 11px; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .widget-value { font-size: 15px; font-weight: 700; color: var(--text-title); }

        /* Quick Actions Grid */
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-title);
        }

        .qa-icon {
          width: 36px; height: 36px;
          background: var(--bg-card-solid);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow-float-sm);
        }

        /* Bento Grid */
        .col-span-12 { grid-column: span 12; }
        .col-span-8  { grid-column: span 8; }
        .col-span-6  { grid-column: span 6; }
        .col-span-4  { grid-column: span 4; }
        .col-span-3  { grid-column: span 3; }

        .bento-item {
          display: flex;
          flex-direction: column;
        }

        .bento-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px 24px 0;
        }

        .bento-header.with-border {
          padding: 24px;
          border-bottom: 1px solid var(--bg-border-solid);
          align-items: center;
        }

        .header-titles h3 { font-size: 17px; margin-bottom: 2px; }
        .header-titles p { font-size: 12px; color: var(--text-muted); font-weight: 500; }

        .btn-link {
          background: none; border: none; font-size: 13px; font-weight: 600; color: var(--brand-primary); cursor: pointer;
        }
        .btn-link:hover { text-decoration: underline; }

        /* KPI Specifics */
        .finance-hero .bento-title { font-size: 14px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
        
        .row-layout { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 32px; gap: 40px; }
        .finance-huge { font-size: 48px; font-weight: 800; color: var(--text-title); letter-spacing: -2px; }
        .finance-huge .currency { font-size: 24px; color: var(--text-muted); margin-right: 4px; vertical-align: super; }
        
        .finance-chart { flex: 1; height: 80px; }

        .kpi-standard { padding-bottom: 24px; }
        .kpi-icon-wrap { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: var(--shadow-float-sm); }
        .bento-body { flex: 1; display: flex; flex-direction: column; padding: 20px 24px 0; }
        
        .kpi-value { font-size: 32px; font-weight: 800; color: var(--text-title); line-height: 1.1; margin-bottom: 4px; letter-spacing: -1px; }
        .kpi-label { font-size: 14px; font-weight: 600; color: var(--text-secondary); margin-bottom: 16px; }
        .kpi-trend { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; }
        
        .text-success { color: var(--color-success); }
        .text-warning { color: var(--color-warning); }
        .text-danger { color: var(--color-danger); }

        /* Lists */
        .list-body { padding: 0; }
        .activity-row {
          display: flex; align-items: center; gap: 16px; padding: 16px 24px;
          border-bottom: 1px solid var(--bg-border-solid);
          transition: background var(--transition-fast);
        }
        .activity-row:last-child { border-bottom: none; }
        .activity-row:hover { background: var(--bg-hover); }
        
        .act-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .act-content { flex: 1; }
        .act-title { font-size: 14px; font-weight: 600; color: var(--text-title); }
        .act-meta { font-size: 12px; color: var(--text-muted); font-weight: 500; }
        .act-status { font-size: 12px; font-weight: 700; color: var(--text-secondary); background: var(--bg-hover); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--bg-border-solid); }

        .budget-row { padding: 16px 24px; border-bottom: 1px solid var(--bg-border-solid); transition: all var(--transition-fast); }
        .budget-row:last-child { border-bottom: none; }
        .budget-row:hover { background: var(--bg-hover); transform: scale(1.01); border-radius: var(--radius-md); }
        .budget-info { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; }
        .proj-name { font-size: 14px; font-weight: 600; color: var(--text-title); }
        .proj-stats { font-size: 13px; font-weight: 700; color: var(--text-secondary); }
        .progress-track { height: 12px; background: rgba(255,255,255,0.05); border-radius: 6px; overflow: visible; box-shadow: var(--shadow-inner); border: 1px solid var(--bg-border-solid); }
        .progress-fill { height: 100%; border-radius: 6px; transition: width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1); }

        @media (max-width: 1200px) {
          .col-span-3 { grid-column: span 6; }
          .col-span-4 { grid-column: span 6; }
          .col-span-8 { grid-column: span 12; }
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .col-span-6 { grid-column: span 12; }
          .hero-widgets { flex-direction: column; gap: 12px; }
          .hero-widget { width: 100%; }
          .row-layout { flex-direction: column; align-items: flex-start; gap: 16px; padding-bottom: 24px; }
        }
      `}</style>
    </div>
  );
}
