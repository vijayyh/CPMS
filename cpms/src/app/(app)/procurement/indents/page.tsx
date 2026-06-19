"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList, Plus, CheckCircle, XCircle, AlertTriangle,
  X, Loader2, Calendar, Search, ChevronDown,
} from "lucide-react";
import { formatDate, formatDateTime, getStatusBadge, getStatusLabel } from "@/lib/utils";

export default function IndentsPage() {
  const [indents,  setIndents]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [status,   setStatus]   = useState("");
  const [showNew,  setShowNew]  = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  function load() {
    setLoading(true);
    const p = new URLSearchParams();
    if (status) p.set("status", status);
    fetch(`/api/procurement/indents?${p}`)
      .then((r) => r.json())
      .then((d) => { setIndents(d); setLoading(false); });
  }

  useEffect(() => { load(); }, [status]);

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/procurement/indents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  const counts = {
    all:       indents.length,
    DRAFT:     indents.filter((i) => i.status === "DRAFT").length,
    SUBMITTED: indents.filter((i) => i.status === "SUBMITTED").length,
    APPROVED:  indents.filter((i) => i.status === "APPROVED").length,
    REJECTED:  indents.filter((i) => i.status === "REJECTED").length,
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Material Indents</h1>
          <p>Review and approve material requisitions from PMs and site engineers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          <Plus size={15} /> New Indent
        </button>
      </div>

      {/* Status tabs with counts */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {([
          { key: "", label: "All", count: counts.all },
          { key: "DRAFT",     label: "Draft",     count: counts.DRAFT },
          { key: "SUBMITTED", label: "Submitted",  count: counts.SUBMITTED },
          { key: "APPROVED",  label: "Approved",   count: counts.APPROVED },
          { key: "REJECTED",  label: "Rejected",   count: counts.REJECTED },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            className={`btn btn-sm ${status === tab.key ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setStatus(tab.key)}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                background: status === tab.key ? "rgba(0,0,0,0.2)" : "var(--bg-hover)",
                borderRadius: 10,
                padding: "1px 7px",
                fontSize: 11,
                fontWeight: 700,
                marginLeft: 2,
              }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 14 }} />
          ))}
        </div>
      ) : indents.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><ClipboardList size={28} /></div>
          <h4>No indents found</h4>
          <p>Create a material indent to request materials for a site</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowNew(true)}>
            <Plus size={14} /> New Indent
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {indents.map((indent) => (
            <IndentRow
              key={indent.id}
              indent={indent}
              expanded={expanded === indent.id}
              onToggle={() => setExpanded(expanded === indent.id ? null : indent.id)}
              onApprove={() => updateStatus(indent.id, "APPROVED")}
              onReject={() => updateStatus(indent.id, "REJECTED")}
            />
          ))}
        </div>
      )}

      {showNew && <NewIndentModal onClose={() => setShowNew(false)} onSave={() => { setShowNew(false); load(); }} />}
    </div>
  );
}

function IndentRow({ indent, expanded, onToggle, onApprove, onReject }: any) {
  const urgencyColor: Record<string, string> = {
    LOW: "badge-info", NORMAL: "badge-muted", HIGH: "badge-amber", URGENT: "badge-danger",
  };

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer" }}
        onClick={onToggle}
      >
        <div style={{
          width: 40, height: 40,
          background: "var(--bg-elevated)",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-muted)", flexShrink: 0,
        }}>
          <ClipboardList size={18} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 13 }}>{indent.indentNo}</span>
            <span className={`badge ${getStatusBadge(indent.status)}`}>{getStatusLabel(indent.status)}</span>
            <span className={`badge ${urgencyColor[indent.urgency] || "badge-muted"}`} style={{ fontSize: 10 }}>{indent.urgency}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {indent.project?.name} · Raised by {indent.raisedBy?.name} · {indent.items?.length} items
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>Required by</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{formatDate(indent.requiredBy)}</div>
        </div>

        {indent.status === "SUBMITTED" && (
          <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-success btn-sm" onClick={onApprove}>
              <CheckCircle size={13} /> Approve
            </button>
            <button className="btn btn-danger btn-sm" onClick={onReject}>
              <XCircle size={13} /> Reject
            </button>
          </div>
        )}

        <ChevronDown
          size={16}
          style={{
            color: "var(--text-muted)",
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 200ms",
          }}
        />
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--bg-border)", padding: 20 }}>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Requested Qty</th>
                  <th>Approved Qty</th>
                  <th>Unit</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {indent.items?.map((item: any) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.material?.name}</td>
                    <td>{item.requestedQty}</td>
                    <td>{item.approvedQty ?? "—"}</td>
                    <td><span className="badge badge-muted">{item.unit}</span></td>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{item.remarks || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {indent.notes && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: 8, fontSize: 13, color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase" }}>Notes: </strong>
              {indent.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NewIndentModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [projects,  setProjects]  = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [form, setForm] = useState({
    projectId: "", urgency: "NORMAL", requiredBy: "", status: "SUBMITTED", notes: "",
  });
  const [items, setItems] = useState([{ materialId: "", requestedQty: "", unit: "KG", remarks: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(setProjects);
    fetch("/api/materials").then((r) => r.json()).then(setMaterials);
  }, []);

  function addItem() { setItems([...items, { materialId: "", requestedQty: "", unit: "KG", remarks: "" }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/procurement/indents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      onSave();
    } finally { setLoading(false); }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div><h3>New Material Indent</h3><p style={{ fontSize: 13, color: "var(--text-muted)" }}>Raise a material requisition for a site</p></div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Project / Site *</label>
                <select className="form-select" required value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                  <option value="">Select project…</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Urgency</label>
                <select className="form-select" value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
                  {["LOW", "NORMAL", "HIGH", "URGENT"].map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Required By *</label>
                <input className="form-input" type="date" required value={form.requiredBy} onChange={(e) => setForm({ ...form, requiredBy: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ minHeight: 60 }} placeholder="Any special requirements…" />
              </div>
            </div>

            <div style={{ marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4>Material Items</h4>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}><Plus size={13} /> Add Item</button>
              </div>
              {items.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 8, marginBottom: 8, alignItems: "end" }}>
                  <div>
                    {i === 0 && <label className="form-label">Material</label>}
                    <select className="form-select" value={item.materialId} onChange={(e) => { const a = [...items]; a[i].materialId = e.target.value; setItems(a); }}>
                      <option value="">Select material…</option>
                      {materials.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
                    </select>
                  </div>
                  <div>
                    {i === 0 && <label className="form-label">Quantity</label>}
                    <input className="form-input" type="number" min={0} placeholder="Qty" value={item.requestedQty}
                      onChange={(e) => { const a = [...items]; a[i].requestedQty = e.target.value; setItems(a); }} />
                  </div>
                  <div>
                    {i === 0 && <label className="form-label">Unit</label>}
                    <input className="form-input" value={item.unit} onChange={(e) => { const a = [...items]; a[i].unit = e.target.value; setItems(a); }} />
                  </div>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeItem(i)} style={{ marginBottom: 0 }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</> : "Submit Indent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
