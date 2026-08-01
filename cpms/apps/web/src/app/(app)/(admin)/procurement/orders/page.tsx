"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart, Plus, FileText, Truck, X, Loader2, ChevronDown,
  DollarSign, Calendar, Building2,
} from "lucide-react";
import { formatCurrency, formatDate, getStatusBadge, getStatusLabel } from "@cpms/utils";

const PO_STATUSES = ["", "DRAFT", "SENT", "ACKNOWLEDGED", "PARTIALLY_RECEIVED", "RECEIVED", "CANCELLED"];

export default function PurchaseOrdersPage() {
  const [orders,  setOrders]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState("");
  const [showNew, setShowNew] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  function load() {
    setLoading(true);
    const p = new URLSearchParams();
    if (status) p.set("status", status);
    fetch(`/api/procurement/orders?${p}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d); setLoading(false); });
  }

  useEffect(() => { load(); }, [status]);

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/procurement/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  const totalValue = orders.reduce((s, o) => s + o.grandTotal, 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Purchase Orders</h1>
          <p>Manage procurement orders sent to vendors</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          <Plus size={15} /> New PO
        </button>
      </div>

      {/* Summary bar */}
      <div className="card" style={{ padding: "14px 24px", marginBottom: 20, display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>{orders.length}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Total POs</span>
        </div>
        <div style={{ width: 1, background: "var(--bg-border)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "var(--brand-amber)" }}>{formatCurrency(totalValue)}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Total Value</span>
        </div>
        <div style={{ width: 1, background: "var(--bg-border)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "var(--color-success)" }}>
            {orders.filter((o) => o.status === "RECEIVED").length}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Received</span>
        </div>
        <div style={{ width: 1, background: "var(--bg-border)" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "var(--color-info)" }}>
            {orders.filter((o) => ["DRAFT", "SENT", "ACKNOWLEDGED"].includes(o.status)).length}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Open</span>
        </div>
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {PO_STATUSES.map((s) => (
          <button key={s} className={`btn btn-sm ${status === s ? "btn-primary" : "btn-secondary"}`} onClick={() => setStatus(s)}>
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 14 }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><ShoppingCart size={28} /></div>
          <h4>No purchase orders</h4>
          <p>Create your first PO to start procurement</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowNew(true)}>
            <Plus size={14} /> Create PO
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map((order) => (
            <PORow key={order.id} order={order}
              expanded={expanded === order.id}
              onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
              onStatusChange={(s: string) => updateStatus(order.id, s)}
            />
          ))}
        </div>
      )}

      {showNew && <NewPOModal onClose={() => setShowNew(false)} onSave={() => { setShowNew(false); load(); }} />}
    </div>
  );
}

function PORow({ order: o, expanded, onToggle, onStatusChange }: any) {
  const nextStatus: Record<string, string> = {
    DRAFT: "SENT", SENT: "ACKNOWLEDGED", ACKNOWLEDGED: "PARTIALLY_RECEIVED", PARTIALLY_RECEIVED: "RECEIVED",
  };
  const next = nextStatus[o.status];

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer" }} onClick={onToggle}>
        <div style={{
          width: 40, height: 40,
          background: "var(--bg-elevated)",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--brand-amber)", flexShrink: 0,
        }}>
          <FileText size={18} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 13 }}>{o.poNumber}</span>
            <span className={`badge ${getStatusBadge(o.status)}`}>{getStatusLabel(o.status)}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            <Building2 size={11} style={{ display: "inline", marginRight: 4 }} />
            {o.vendor?.name} · {o.project?.name} · {o.lineItems?.length} items
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--brand-amber)" }}>{formatCurrency(o.grandTotal)}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Expected {formatDate(o.expectedDate)}</div>
        </div>

        {next && (
          <button
            className="btn btn-success btn-sm"
            onClick={(e) => { e.stopPropagation(); onStatusChange(next); }}
          >
            <Truck size={13} /> Mark {getStatusLabel(next)}
          </button>
        )}
        {o.status !== "CANCELLED" && o.status !== "RECEIVED" && (
          <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onStatusChange("CANCELLED"); }}>Cancel</button>
        )}

        <ChevronDown size={16} style={{ color: "var(--text-muted)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--bg-border)", padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            <InfoBox label="Vendor" value={o.vendor?.name} />
            <InfoBox label="Project" value={o.project?.name} />
            <InfoBox label="Payment Terms" value={o.paymentTerms || "—"} />
            <InfoBox label="Delivery Address" value={o.deliveryAddress} />
            <InfoBox label="Expected Date" value={formatDate(o.expectedDate)} />
            <InfoBox label="Created By" value={o.createdBy?.name} />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Qty</th>
                  <th>Unit Rate</th>
                  <th>Tax %</th>
                  <th>Amount</th>
                  <th>Total</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {o.lineItems?.map((li: any) => (
                  <tr key={li.id}>
                    <td style={{ fontWeight: 600 }}>{li.material?.name}</td>
                    <td>{li.quantity} {li.material?.unit}</td>
                    <td>₹{li.unitRate}</td>
                    <td>{li.taxPercent}%</td>
                    <td>{formatCurrency(li.amount)}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(li.totalAmount)}</td>
                    <td>
                      {li.receivedQty > 0 ? (
                        <span style={{ color: "var(--color-success)", fontWeight: 600 }}>{li.receivedQty}</span>
                      ) : <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} style={{ textAlign: "right", fontWeight: 600, padding: "12px 16px", color: "var(--text-muted)", fontSize: 12 }}>
                    Subtotal + Tax:
                  </td>
                  <td style={{ fontWeight: 800, fontSize: 16, color: "var(--brand-amber)", padding: "12px 16px" }}>
                    {formatCurrency(o.grandTotal)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{value || "—"}</div>
    </div>
  );
}

function NewPOModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [vendors,   setVendors]   = useState<any[]>([]);
  const [projects,  setProjects]  = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [form, setForm] = useState({
    vendorId: "", projectId: "", expectedDate: "", deliveryAddress: "", paymentTerms: "30 days net", notes: "", status: "SENT",
  });
  const [items, setItems] = useState([{ materialId: "", quantity: "", unitRate: "", taxPercent: "18", remarks: "" }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/vendors").then((r) => r.json()).then(setVendors);
    fetch("/api/projects").then((r) => r.json()).then(setProjects);
    fetch("/api/materials").then((r) => r.json()).then(setMaterials);
  }, []);

  function addItem() { setItems([...items, { materialId: "", quantity: "", unitRate: "", taxPercent: "18", remarks: "" }]); }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)); }

  const total = items.reduce((s, item) => {
    const qty  = Number(item.quantity) || 0;
    const rate = Number(item.unitRate) || 0;
    const tax  = Number(item.taxPercent) || 18;
    return s + qty * rate * (1 + tax / 100);
  }, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/procurement/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lineItems: items }),
      });
      onSave();
    } finally { setLoading(false); }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 760 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div><h3>Create Purchase Order</h3><p style={{ fontSize: 13, color: "var(--text-muted)" }}>Issue a PO to a vendor for material procurement</p></div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div className="form-group">
                <label className="form-label">Vendor *</label>
                <select className="form-select" required value={form.vendorId} onChange={(e) => setForm({ ...form, vendorId: e.target.value })}>
                  <option value="">Select vendor…</option>
                  {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Project / Site *</label>
                <select className="form-select" required value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                  <option value="">Select project…</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Expected Delivery *</label>
                <input className="form-input" type="date" required value={form.expectedDate} onChange={(e) => setForm({ ...form, expectedDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Terms</label>
                <input className="form-input" value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Delivery Address *</label>
                <input className="form-input" required value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} placeholder="Site address for delivery" />
              </div>
            </div>

            {/* Line items */}
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4>Line Items</h4>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: "var(--brand-amber)", fontWeight: 700 }}>
                    Est. Total: {formatCurrency(total)}
                  </span>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}><Plus size={13} /> Add Item</button>
                </div>
              </div>
              {items.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px auto", gap: 8, marginBottom: 8, alignItems: "end" }}>
                  <div>
                    {i === 0 && <label className="form-label">Material</label>}
                    <select className="form-select" value={item.materialId} onChange={(e) => { const a = [...items]; a[i].materialId = e.target.value; setItems(a); }}>
                      <option value="">Select…</option>
                      {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    {i === 0 && <label className="form-label">Quantity</label>}
                    <input className="form-input" type="number" min={0} value={item.quantity} onChange={(e) => { const a = [...items]; a[i].quantity = e.target.value; setItems(a); }} />
                  </div>
                  <div>
                    {i === 0 && <label className="form-label">Unit Rate (₹)</label>}
                    <input className="form-input" type="number" min={0} value={item.unitRate} onChange={(e) => { const a = [...items]; a[i].unitRate = e.target.value; setItems(a); }} />
                  </div>
                  <div>
                    {i === 0 && <label className="form-label">Tax %</label>}
                    <input className="form-input" type="number" value={item.taxPercent} onChange={(e) => { const a = [...items]; a[i].taxPercent = e.target.value; setItems(a); }} />
                  </div>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeItem(i)}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Creating…</> : `Create PO · ${formatCurrency(total)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
