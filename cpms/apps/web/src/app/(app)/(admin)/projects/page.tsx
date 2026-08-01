"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban, Plus, MapPin, DollarSign, Users, Calendar,
  X, Loader2, CheckCircle, ArrowUpRight, Search
} from "lucide-react";
import { formatCurrency, formatDate, getStatusBadge, getStatusLabel } from "@cpms/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "success", PLANNING: "info", ON_HOLD: "amber", COMPLETED: "muted",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [status,   setStatus]   = useState("ACTIVE");
  const [showNew,  setShowNew]  = useState(false);
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const canEdit = userRole === "ADMIN" || userRole === "PROCUREMENT";

  function load() {
    setLoading(true);
    const p = new URLSearchParams();
    if (status) p.set("status", status);
    fetch(`/api/projects?${p}`)
      .then((r) => r.json())
      .then((d) => { setProjects(d); setLoading(false); });
  }

  useEffect(() => { load(); }, [status]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Projects & Sites</h1>
          <p>Monitor all active construction sites and their resources</p>
        </div>
        <div className="page-actions">
          {canEdit && (
            <button className="btn btn-primary" onClick={() => setShowNew(true)}>
              <Plus size={15} /> New Project
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="projects-toolbar">
        <div className="search-bar">
          <Search size={14} className="search-icon" />
          <input
            className="form-input"
            placeholder="Search projects, location, client…"
            // onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["", "ACTIVE", "ON_HOLD", "COMPLETED"].map((s) => (
            <button
              key={s}
              className={`btn btn-sm ${status === s ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setStatus(s)}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="project-stats-bar">
        <div className="project-stat-item">
          <span className="project-stat-num">{projects.length}</span>
          <span className="project-stat-lbl">Total Projects</span>
        </div>
        <div className="project-stat-sep" />
        <div className="project-stat-item">
          <span className="project-stat-num text-success">
            {projects.filter((p) => p.status === "ACTIVE").length}
          </span>
          <span className="project-stat-lbl">Active</span>
        </div>
        <div className="project-stat-sep" />
        <div className="project-stat-item">
          <span className="project-stat-num text-info">
            {projects.reduce((s, p) => s + (p._count?.purchaseOrders || 0), 0)}
          </span>
          <span className="project-stat-lbl">Purchase Orders</span>
        </div>
      </div>

      {loading ? (
        <div className="projects-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><FolderKanban size={28} /></div>
          <h4>No projects found</h4>
          <p>Create your first construction project to start tracking</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowNew(true)}>
            <Plus size={14} /> Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}

      {showNew && <NewProjectModal onClose={() => setShowNew(false)} onSave={() => { setShowNew(false); load(); }} />}

      <style>{`
        .projects-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .projects-toolbar .search-bar input { width: 300px; }

        .project-stats-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          background: var(--bg-card);
          border: 1px solid var(--bg-border);
          border-radius: var(--radius-lg);
          padding: 14px 24px;
          margin-bottom: 24px;
        }

        .project-stat-item { display: flex; flex-direction: column; gap: 2px; }
        .project-stat-num  { font-size: 20px; font-weight: 800; color: var(--text-primary); }
        .project-stat-lbl  { font-size: 11px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; }
        .project-stat-sep  { width: 1px; height: 36px; background: var(--bg-border); }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 16px;
        }

        .skeleton-card {
          height: 260px;
          border-radius: 14px;
        }
      `}</style>
    </div>
  );
}

function ProjectCard({ project: p }: { project: any }) {
  const spent  = p.purchaseOrders?.reduce((s: number, o: any) => s + o.grandTotal, 0) ?? 0;
  const pct    = Math.min(100, (spent / p.budget) * 100);
  const color  = pct > 80 ? "danger" : pct > 60 ? "amber" : "success";

  return (
    <Link href={`/projects/${p.id}`} style={{ textDecoration: "none" }}>
      <div className="card" style={{ padding: 22, transition: "all 200ms", cursor: "pointer" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand-amber)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40,
              background: `var(--color-${STATUS_COLORS[p.status] === "muted" ? "" : STATUS_COLORS[p.status]}-bg, var(--bg-elevated))`,
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: `var(--color-${STATUS_COLORS[p.status] === "muted" ? "" : STATUS_COLORS[p.status]}, var(--text-muted))`,
            }}>
              <FolderKanban size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text-title)", letterSpacing: "-0.5px" }}>{p.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{p.code}</div>
            </div>
          </div>
          <span className={`badge ${getStatusBadge(p.status)}`}>{getStatusLabel(p.status)}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text-secondary)" }}>
            <MapPin size={12} style={{ color: "var(--text-muted)" }} />{p.location} · Client: {p.client}
          </div>
          {p.manager && (
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text-secondary)" }}>
              <Users size={12} style={{ color: "var(--text-muted)" }} />PM: {p.manager.name}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text-secondary)" }}>
            <Calendar size={12} style={{ color: "var(--text-muted)" }} />{formatDate(p.startDate)}
            {p.endDate && ` → ${formatDate(p.endDate)}`}
          </div>
        </div>

        {/* Budget utilization */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Budget Utilization</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: `var(--color-${color === "amber" ? "warning" : color})` }}>{pct.toFixed(0)}%</span>
          </div>
          <div className="progress-bar">
            <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatCurrency(spent)} spent</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatCurrency(p.budget)} budget</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, paddingTop: 14, borderTop: "1px solid var(--bg-border)" }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {p._count?.purchaseOrders ?? 0} POs
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {p._count?.indents ?? 0} indents
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {p._count?.labourLogs ?? 0} labour logs
          </div>
        </div>
      </div>
    </Link>
  );
}

function NewProjectModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    name: "", location: "", client: "", budget: "",
    startDate: "", endDate: "", status: "ACTIVE", description: "",
  });
  const [loading, setLoading] = useState(false);
  const [createdProject, setCreatedProject] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedProject(data);
      }
    } finally { setLoading(false); }
  }

  if (createdProject) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => { onSave(); onClose(); }}>
        <div className="bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] rounded-[var(--radius-xl)] shadow-2xl w-full max-w-md flex flex-col overflow-hidden text-center" onClick={(e) => e.stopPropagation()}>
          <div className="p-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center mb-2">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-2xl font-black text-[var(--text-title)]">Project Created!</h3>
            <p className="text-sm font-medium text-muted">You can now share this Project ID with your employees so they can join.</p>
            
            <div className="w-full bg-[var(--bg-app)] border border-[var(--bg-border-solid)] rounded-lg p-4 mt-2 mb-2 select-all cursor-pointer">
              <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Project ID</div>
              <div className="text-2xl font-black text-[var(--brand-primary)] tracking-wider">{createdProject.code}</div>
            </div>
            
            <button className="btn bg-[var(--brand-primary)] text-white hover:opacity-90 px-8 py-3 rounded-lg font-bold w-full mt-4" onClick={() => { onSave(); onClose(); }}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] rounded-[var(--radius-xl)] shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start p-6 border-b border-[var(--bg-border-solid)] bg-[var(--bg-hover)]">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-black text-[var(--text-title)] flex items-center gap-2">
              <FolderKanban size={20} className="text-[var(--brand-primary)]"/> New Construction Project
            </h3>
            <p className="text-sm font-bold text-muted">Register a new site in the system</p>
          </div>
          <button className="btn btn-ghost p-2 rounded-full hover:bg-[var(--bg-app)] text-muted hover:text-[var(--text-primary)] transition-colors" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex flex-col gap-6 flex-1 bg-[var(--bg-app)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Project Info */}
              <div className="col-span-1 md:col-span-2 flex flex-col gap-4 p-5 rounded-xl border border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)]">
                <h4 className="text-sm font-black text-[var(--text-title)] uppercase tracking-wider mb-2 border-b border-[var(--bg-border-solid)] pb-2">Project Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label className="text-xs font-bold text-muted uppercase tracking-wide">Project Name <span className="text-[var(--color-danger)]">*</span></label>
                    <input className="input-base p-2.5 text-sm font-medium" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Greenfield Tower A" />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-wide">Description</label>
                    <textarea className="input-base p-2.5 text-sm font-medium resize-y min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Project scope, notes…" />
                  </div>
                </div>
              </div>

              {/* Execution Info */}
              <div className="col-span-1 md:col-span-2 flex flex-col gap-4 p-5 rounded-xl border border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)]">
                <h4 className="text-sm font-black text-[var(--text-title)] uppercase tracking-wider mb-2 border-b border-[var(--bg-border-solid)] pb-2">Execution & Budget</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted uppercase tracking-wide">Status <span className="text-[var(--color-danger)]">*</span></label>
                    <select className="input-base p-2.5 text-sm font-medium" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      {["PLANNING", "ACTIVE", "ON_HOLD"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted uppercase tracking-wide">Total Budget (₹) <span className="text-[var(--color-danger)]">*</span></label>
                    <input className="input-base p-2.5 text-sm font-medium" type="number" required value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="50000000" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted uppercase tracking-wide">Start Date <span className="text-[var(--color-danger)]">*</span></label>
                    <input className="input-base p-2.5 text-sm font-medium" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted uppercase tracking-wide">Expected End Date</label>
                    <input className="input-base p-2.5 text-sm font-medium" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="col-span-1 md:col-span-2 flex flex-col gap-4 p-5 rounded-xl border border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)]">
                <h4 className="text-sm font-black text-[var(--text-title)] uppercase tracking-wider mb-2 border-b border-[var(--bg-border-solid)] pb-2">Location & Client</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted uppercase tracking-wide">Location <span className="text-[var(--color-danger)]">*</span></label>
                    <input className="input-base p-2.5 text-sm font-medium" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Whitefield, Bangalore" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted uppercase tracking-wide">Client Name <span className="text-[var(--color-danger)]">*</span></label>
                    <input className="input-base p-2.5 text-sm font-medium" required value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Client company name" />
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="p-4 border-t border-[var(--bg-border-solid)] bg-[var(--bg-hover)] flex justify-end gap-3 shrink-0">
            <button type="button" className="btn bg-[var(--bg-app)] border border-[var(--bg-border-solid)] text-[var(--text-primary)] hover:bg-[var(--bg-card-solid)] px-6 py-2 rounded-lg font-bold" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn bg-[var(--brand-primary)] text-white hover:opacity-90 px-8 py-2 rounded-lg font-bold shadow-sm shadow-[var(--brand-primary)]/20 flex items-center gap-2" disabled={loading}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
