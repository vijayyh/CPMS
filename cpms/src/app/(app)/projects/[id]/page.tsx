"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import {
  FolderKanban, MapPin, Users, Calendar, DollarSign,
  Package, Hammer, ClipboardList, ShoppingCart, Plus, X, Loader2, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusBadge, getStatusLabel } from "@/lib/utils";

const LABOUR_TYPES = ["Mason", "Carpenter", "Helper", "Electrician", "Plumber", "Painter", "Steel Fixer", "Supervisor"];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "inventory" | "labour" | "indents" | "orders">("overview");
  const [showLabour, setShowLabour] = useState(false);

  function load() {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => { setProject(d); setLoading(false); });
  }

  useEffect(() => { load(); }, [id]);

  if (loading) return <div style={{ padding: 40 }}><div className="skeleton" style={{ height: 200, borderRadius: 14 }} /></div>;
  if (!project) return <div className="empty-state">Project not found.</div>;

  const spent = project.purchaseOrders?.reduce((s: number, o: any) => s + o.grandTotal, 0) ?? 0;
  const pct   = Math.min(100, (spent / project.budget) * 100);
  const totalLabourCost = project.labourLogs?.reduce((s: number, l: any) => s + l.totalCost, 0) ?? 0;

  return (
    <div>
      <Link href="/projects" className="btn btn-ghost btn-sm" style={{ marginBottom: 16, display: "inline-flex" }}>
        <ArrowLeft size={14} /> Back to Projects
      </Link>

      {/* Header */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56,
            background: "var(--brand-amber-muted)",
            border: "2px solid rgba(245,158,11,0.3)",
            borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--brand-amber)", flexShrink: 0,
          }}>
            <FolderKanban size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <h1 style={{ fontSize: 22 }}>{project.name}</h1>
              <span className={`badge ${getStatusBadge(project.status)}`}>{getStatusLabel(project.status)}</span>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>{project.code}</code>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                <MapPin size={13} />{project.location}
              </span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Client: <strong>{project.client}</strong></span>
              {project.manager && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                  <Users size={13} />PM: <strong>{project.manager.name}</strong>
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                <Calendar size={13} />{formatDate(project.startDate)}
                {project.endDate && ` → ${formatDate(project.endDate)}`}
              </span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { label: "Budget", value: formatCurrency(project.budget), color: "amber" },
            { label: "Spent (POs)", value: formatCurrency(spent), color: "info" },
            { label: "Labour Cost", value: formatCurrency(totalLabourCost), color: "purple" },
            { label: "Remaining", value: formatCurrency(Math.max(0, project.budget - spent - totalLabourCost)), color: "success" },
          ].map((k) => (
            <div key={k.label} style={{ textAlign: "center", padding: "14px", background: "var(--bg-elevated)", borderRadius: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: `var(--color-${k.color === "amber" ? "warning" : k.color})` }}>{k.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Budget Utilization</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{pct.toFixed(1)}%</span>
          </div>
          <div className="progress-bar" style={{ height: 8 }}>
            <div className={`progress-fill ${pct > 80 ? "danger" : pct > 60 ? "amber" : "success"}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div className="tab-list">
          {[
            { key: "overview",   label: "Overview" },
            { key: "inventory",  label: `Inventory (${project.siteInventory?.length ?? 0})` },
            { key: "labour",     label: `Labour (${project.labourLogs?.length ?? 0})` },
            { key: "indents",    label: `Indents (${project.indents?.length ?? 0})` },
            { key: "orders",     label: `POs (${project.purchaseOrders?.length ?? 0})` },
          ].map((t) => (
            <button key={t.key} className={`tab-btn ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key as any)}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === "labour" && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowLabour(true)}>
            <Plus size={13} /> Add Labour
          </button>
        )}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="card">
            <div className="card-header"><h4>Project Details</h4></div>
            <div className="card-body">
              <DetailRow label="Description" value={project.description || "—"} />
              <DetailRow label="Total Labour Days" value={project.labourLogs?.reduce((s: number, l: any) => s + l.count, 0) ?? 0} />
              <DetailRow label="Total Indents" value={project.indents?.length ?? 0} />
              <DetailRow label="Total POs" value={project.purchaseOrders?.length ?? 0} />
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h4>Top Materials in Inventory</h4></div>
            <div className="card-body">
              {project.siteInventory?.slice(0, 5).map((inv: any) => (
                <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.material?.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{inv.material?.category}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, color: "var(--brand-amber)" }}>{inv.currentStock} {inv.material?.unit}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>in stock</div>
                  </div>
                </div>
              ))}
              {!project.siteInventory?.length && <p style={{ fontSize: 13 }}>No inventory received yet</p>}
            </div>
          </div>
        </div>
      )}

      {tab === "inventory" && (
        <div className="card">
          <div className="card-header">
            <h4>Site Inventory</h4>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Updated automatically when GRNs are confirmed</span>
          </div>
          {project.siteInventory?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Consumed</th>
                    <th>Wasted</th>
                    <th>Unit</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {project.siteInventory.map((inv: any) => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 600 }}>{inv.material?.name}</td>
                      <td><span className="badge badge-muted">{inv.material?.category}</span></td>
                      <td style={{ fontWeight: 700, color: "var(--brand-amber)" }}>{inv.currentStock} {inv.unit}</td>
                      <td style={{ color: "var(--color-info)" }}>{inv.consumedStock}</td>
                      <td style={{ color: inv.wastedStock > 0 ? "var(--color-danger)" : "var(--text-muted)" }}>{inv.wastedStock}</td>
                      <td><span className="badge badge-muted">{inv.unit}</span></td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(inv.lastUpdated)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No inventory yet. GRNs will update inventory automatically.</p></div>
          )}
        </div>
      )}

      {tab === "labour" && (
        <div className="card">
          <div className="card-header">
            <h4>Labour Log ({project.labourLogs?.length ?? 0} entries)</h4>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-purple)" }}>
              Total: {formatCurrency(totalLabourCost)}
            </div>
          </div>
          {project.labourLogs?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Count</th>
                    <th>Daily Rate</th>
                    <th>Total Cost</th>
                    <th>Supervisor</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {project.labourLogs.map((l: any) => (
                    <tr key={l.id}>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(l.date)}</td>
                      <td>
                        <span className="badge badge-purple">{l.labourType}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{l.count} workers</td>
                      <td>₹{l.dailyRate}/day</td>
                      <td style={{ fontWeight: 700, color: "var(--color-purple)" }}>{formatCurrency(l.totalCost)}</td>
                      <td style={{ fontSize: 12 }}>{l.supervisorName || "—"}</td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{l.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No labour logs yet</p></div>
          )}
        </div>
      )}

      {tab === "indents" && (
        <div className="card">
          <div className="card-header"><h4>Material Indents</h4></div>
          {project.indents?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Indent No.</th>
                    <th>Raised By</th>
                    <th>Items</th>
                    <th>Urgency</th>
                    <th>Required By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {project.indents.map((ind: any) => (
                    <tr key={ind.id}>
                      <td><span className="font-mono text-amber">{ind.indentNo}</span></td>
                      <td>{ind.raisedBy?.name}</td>
                      <td>{ind.items?.map((i: any) => i.material?.name).join(", ").slice(0, 40) || "—"}</td>
                      <td><span className={`badge ${ind.urgency === "URGENT" ? "badge-danger" : ind.urgency === "HIGH" ? "badge-amber" : "badge-muted"}`}>{ind.urgency}</span></td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(ind.requiredBy)}</td>
                      <td><span className={`badge ${getStatusBadge(ind.status)}`}>{getStatusLabel(ind.status)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No indents for this project</p></div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="card">
          <div className="card-header"><h4>Purchase Orders</h4></div>
          {project.purchaseOrders?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Vendor</th>
                    <th>Amount</th>
                    <th>Expected</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {project.purchaseOrders.map((po: any) => (
                    <tr key={po.id}>
                      <td><span className="font-mono text-amber">{po.poNumber}</span></td>
                      <td>{po.vendor?.name}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(po.grandTotal)}</td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(po.expectedDate)}</td>
                      <td><span className={`badge ${getStatusBadge(po.status)}`}>{getStatusLabel(po.status)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No POs for this project</p></div>
          )}
        </div>
      )}

      {showLabour && (
        <AddLabourModal projectId={id} onClose={() => setShowLabour(false)} onSave={() => { setShowLabour(false); load(); }} />
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid var(--bg-border)" }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function AddLabourModal({ projectId, onClose, onSave }: { projectId: string; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    labourType: "Mason", count: "", dailyRate: "", date: new Date().toISOString().split("T")[0],
    supervisorName: "", notes: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/projects/labour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, projectId }),
      });
      onSave();
    } finally { setLoading(false); }
  }

  const total = (Number(form.count) || 0) * (Number(form.dailyRate) || 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div><h3>Log Labour Entry</h3><p style={{ fontSize: 13, color: "var(--text-muted)" }}>Record daily labour attendance and cost</p></div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div className="form-group">
                <label className="form-label">Labour Type *</label>
                <select className="form-select" value={form.labourType} onChange={(e) => setForm({ ...form, labourType: e.target.value })}>
                  {LABOUR_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input className="form-input" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Number of Workers *</label>
                <input className="form-input" type="number" min={1} required value={form.count} onChange={(e) => setForm({ ...form, count: e.target.value })} placeholder="e.g. 10" />
              </div>
              <div className="form-group">
                <label className="form-label">Daily Rate (₹/person) *</label>
                <input className="form-input" type="number" min={0} required value={form.dailyRate} onChange={(e) => setForm({ ...form, dailyRate: e.target.value })} placeholder="e.g. 600" />
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Supervisor Name</label>
                <input className="form-input" value={form.supervisorName} onChange={(e) => setForm({ ...form, supervisorName: e.target.value })} placeholder="Site supervisor" />
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ minHeight: 60 }} placeholder="Work done today…" />
              </div>
              {total > 0 && (
                <div style={{ gridColumn: "1/-1", padding: "12px 16px", background: "var(--color-purple-bg)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Total Labour Cost for this entry</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-purple)" }}>{formatCurrency(total)}</div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : "Log Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
