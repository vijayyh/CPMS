"use client";

import { useEffect, useState } from "react";
import {
  Users, Plus, Search, Calendar, DollarSign,
  Briefcase, X, Loader2, HardHat, ShieldAlert,
} from "lucide-react";
import { formatCurrency, formatDate } from "@cpms/utils";

const LABOUR_TYPES = ["Mason", "Carpenter", "Helper", "Electrician", "Plumber", "Painter", "Steel Fixer", "Supervisor"];

export default function LabourLogsPage() {
  const [logs, setLogs]       = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [labourType, setLabourType] = useState("");
  const [showModal, setShowModal]   = useState(false);

  function load() {
    setLoading(true);
    fetch("/api/projects/labour")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setLogs(d);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setProjects(d);
        }
      });
  }

  useEffect(() => { load(); }, []);

  const filteredLogs = logs.filter((l) => {
    const term = search.toLowerCase();
    const matchesSearch =
      l.project?.name?.toLowerCase().includes(term) ||
      l.supervisorName?.toLowerCase().includes(term) ||
      l.notes?.toLowerCase().includes(term);
    const matchesType = !labourType || l.labourType === labourType;
    return matchesSearch && matchesType;
  });

  const totalWorkers = filteredLogs.reduce((s, l) => s + l.count, 0);
  const totalCost = filteredLogs.reduce((s, l) => s + l.totalCost, 0);
  const uniqueDates = new Set(filteredLogs.map((l) => l.date.split("T")[0])).size;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Site Labour Logs</h1>
          <p>Monitor daily labour counts, supervisor logs, and wage disbursements</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Log Daily Labour
        </button>
      </div>

      {/* Summary Row */}
      <div className="summary-cards-row">
        <div className="card summary-glass-card">
          <div className="summary-icon-box purple">
            <Users size={18} />
          </div>
          <div>
            <div className="summary-val">{totalWorkers}</div>
            <div className="summary-lbl">Total Workers Logged</div>
          </div>
        </div>
        <div className="card summary-glass-card">
          <div className="summary-icon-box success">
            <DollarSign size={18} />
          </div>
          <div>
            <div className="summary-val text-success">{formatCurrency(totalCost)}</div>
            <div className="summary-lbl">Total Wage Payout</div>
          </div>
        </div>
        <div className="card summary-glass-card">
          <div className="summary-icon-box amber">
            <Calendar size={18} />
          </div>
          <div>
            <div className="summary-val text-amber">{uniqueDates}</div>
            <div className="summary-lbl">Active Days Logged</div>
          </div>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="toolbar-row">
        <div className="search-bar">
          <Search size={14} className="search-icon" />
          <input
            className="form-input"
            placeholder="Search by project, supervisor, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            className="form-select"
            value={labourType}
            onChange={(e) => setLabourType(e.target.value)}
            style={{ width: 180 }}
          >
            <option value="">All Labour Types</option>
            {LABOUR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 64, borderRadius: 14 }} />
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><HardHat size={28} /></div>
          <h4>No labour logs found</h4>
          <p>Create a log entry to start tracking on-site worker attendance</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
            <Plus size={14} /> Log Daily Labour
          </button>
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Construction Project</th>
                  <th>Labour Type</th>
                  <th>Count</th>
                  <th>Daily Rate</th>
                  <th>Total Cost</th>
                  <th>Supervisor</th>
                  <th>Notes / Activities</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((l) => (
                  <tr key={l.id} className="table-hover-row">
                    <td style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                      {formatDate(l.date)}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{l.project?.name}</div>
                      <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-disabled)" }}>
                        {l.project?.code}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{l.labourType}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{l.count} workers</td>
                    <td>₹{l.dailyRate}/day</td>
                    <td style={{ fontWeight: 800, color: "var(--color-success)" }}>
                      {formatCurrency(l.totalCost)}
                    </td>
                    <td>{l.supervisorName || <span style={{ color: "var(--text-disabled)" }}>—</span>}</td>
                    <td style={{ fontSize: 12, color: "var(--text-secondary)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={l.notes}>
                      {l.notes || <span style={{ color: "var(--text-disabled)" }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Modal */}
      {showModal && (
        <AddLabourModal
          projects={projects}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); load(); }}
        />
      )}

      <style>{`
        .summary-cards-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-glass-card {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .summary-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .summary-icon-box.purple { background: var(--color-purple-bg); color: var(--color-purple); }
        .summary-icon-box.success { background: var(--color-success-bg); color: var(--color-success); }
        .summary-icon-box.amber { background: var(--brand-amber-muted); color: var(--brand-amber); }

        .summary-val {
          font-size: 22px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 2px;
        }

        .summary-lbl {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .toolbar-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .table-hover-row {
          transition: background var(--transition-fast);
        }
        .table-hover-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
}

function AddLabourModal({ projects, onClose, onSave }: { projects: any[]; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    projectId: "", labourType: "Mason", count: "", dailyRate: "",
    date: new Date().toISOString().split("T")[0], supervisorName: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.projectId) {
      setError("Please select a project.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects/labour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save entry.");
      onSave();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  const total = (Number(form.count) || 0) * (Number(form.dailyRate) || 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Log Daily Labour</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Record daily attendance and wages for a construction project</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error" style={{ marginBottom: 16 }}><ShieldAlert size={14} />{error}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Project / Site *</label>
                <select
                  className="form-select"
                  required
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                >
                  <option value="">Select project site...</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Labour Type *</label>
                <select
                  className="form-select"
                  value={form.labourType}
                  onChange={(e) => setForm({ ...form, labourType: e.target.value })}
                >
                  {LABOUR_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  className="form-input"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Headcount (Workers) *</label>
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  required
                  value={form.count}
                  onChange={(e) => setForm({ ...form, count: e.target.value })}
                  placeholder="e.g. 15"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Daily Wage Rate (₹/head) *</label>
                <input
                  className="form-input"
                  type="number"
                  min={0}
                  required
                  value={form.dailyRate}
                  onChange={(e) => setForm({ ...form, dailyRate: e.target.value })}
                  placeholder="e.g. 650"
                />
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Supervisor In-Charge</label>
                <input
                  className="form-input"
                  value={form.supervisorName}
                  onChange={(e) => setForm({ ...form, supervisorName: e.target.value })}
                  placeholder="Supervisor name"
                />
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Task Notes / Activities</label>
                <textarea
                  className="form-textarea"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  style={{ minHeight: 60 }}
                  placeholder="Summarize blockwork, excavation, tiling tasks completed..."
                />
              </div>
              {total > 0 && (
                <div style={{ gridColumn: "1/-1", padding: "12px 16px", background: "var(--color-purple-bg)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Total Wage cost for entry</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--color-purple)" }}>{formatCurrency(total)}</div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Logging...</> : "Submit Log Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
