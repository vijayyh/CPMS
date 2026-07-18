"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban, Plus, MapPin, DollarSign, Users, Calendar,
  X, Loader2, CheckCircle, ArrowUpRight,
} from "lucide-react";
import { formatCurrency, formatDate, getStatusBadge, getStatusLabel } from "@cpms/utils";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "success", PLANNING: "info", ON_HOLD: "amber", COMPLETED: "muted",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [status,   setStatus]   = useState("ACTIVE");
  const [showNew,  setShowNew]  = useState(false);

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
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          <Plus size={15} /> New Project
        </button>
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {["", "ACTIVE", "PLANNING", "ON_HOLD", "COMPLETED"].map((s) => (
          <button key={s} className={`btn btn-sm ${status === s ? "btn-primary" : "btn-secondary"}`} onClick={() => setStatus(s)}>
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 260, borderRadius: 14 }} />
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 }}>
          {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}

      {showNew && <NewProjectModal onClose={() => setShowNew(false)} onSave={() => { setShowNew(false); load(); }} />}
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
              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
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
    name: "", code: "", location: "", client: "", budget: "",
    startDate: "", endDate: "", status: "ACTIVE", description: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSave();
    } finally { setLoading(false); }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div><h3>New Construction Project</h3><p style={{ fontSize: 13, color: "var(--text-muted)" }}>Register a new site in the system</p></div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Project Name *</label>
                <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Greenfield Residential Tower A" />
              </div>
              <div className="form-group">
                <label className="form-label">Project Code *</label>
                <input className="form-input" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. PROJ-001" />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {["PLANNING", "ACTIVE", "ON_HOLD"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input className="form-input" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Whitefield, Bangalore" />
              </div>
              <div className="form-group">
                <label className="form-label">Client Name *</label>
                <input className="form-input" required value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="Client company name" />
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Total Budget (₹) *</label>
                <input className="form-input" type="number" required value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. 50000000" />
              </div>
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input className="form-input" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Expected End Date</label>
                <input className="form-input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Project scope, notes…" style={{ minHeight: 70 }} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Creating…</> : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
