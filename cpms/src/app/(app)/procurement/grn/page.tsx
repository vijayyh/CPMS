"use client";

import { useEffect, useState } from "react";
import { Truck, Plus, X, Loader2, CheckCircle, ChevronDown } from "lucide-react";
import { formatCurrency, formatDate, getStatusBadge, getStatusLabel } from "@/lib/utils";

export default function GRNPage() {
  const [grns,    setGrns]    = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/procurement/grn")
      .then((r) => r.json())
      .then((d) => { setGrns(d); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Goods Receipt Notes</h1>
          <p>Record material deliveries arriving at construction sites</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          <Plus size={15} /> Record GRN
        </button>
      </div>

      <div className="card" style={{ padding: "14px 24px", marginBottom: 20, display: "flex", gap: 32 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{grns.length}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Total GRNs</div>
        </div>
        <div style={{ width: 1, background: "var(--bg-border)" }} />
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--color-success)" }}>
            {grns.filter((g) => g.status === "CONFIRMED").length}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Confirmed</div>
        </div>
        <div style={{ width: 1, background: "var(--bg-border)" }} />
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--brand-amber)" }}>
            {formatCurrency(grns.reduce((s, g) => s + g.items?.reduce((si: number, i: any) => si + i.totalAmount, 0), 0))}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Total Received Value</div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 14 }} />
          ))}
        </div>
      ) : grns.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><Truck size={28} /></div>
          <h4>No goods receipts yet</h4>
          <p>Record a GRN when materials arrive at the site</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowNew(true)}>
            <Plus size={14} /> Record First GRN
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {grns.map((grn) => (
            <div key={grn.id} className="card" style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer" }}
                onClick={() => setExpanded(expanded === grn.id ? null : grn.id)}>
                <div style={{ width: 40, height: 40, background: "var(--color-success-bg)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-success)" }}>
                  <Truck size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 13 }}>{grn.grnNumber}</span>
                    <span className={`badge ${getStatusBadge(grn.status)}`}>{getStatusLabel(grn.status)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    PO: {grn.po?.poNumber} · {grn.po?.vendor?.name} → {grn.po?.project?.name} · {grn.items?.length} materials
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{formatDate(grn.receivedDate)}</div>
                  {grn.vehicleNo && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Vehicle: {grn.vehicleNo}</div>}
                </div>
                <ChevronDown size={16} style={{ color: "var(--text-muted)", transform: expanded === grn.id ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
              </div>

              {expanded === grn.id && (
                <div style={{ borderTop: "1px solid var(--bg-border)", padding: 20 }}>
                  {grn.invoiceNo && (
                    <div style={{ display: "flex", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Invoice: <strong>{grn.invoiceNo}</strong></span>
                      {grn.driverName && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Driver: <strong>{grn.driverName}</strong></span>}
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Received by: <strong>{grn.createdBy?.name}</strong></span>
                    </div>
                  )}
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>Ordered</th>
                        <th>Received</th>
                        <th>Accepted</th>
                        <th>Rejected</th>
                        <th>Rate</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grn.items?.map((item: any) => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 600 }}>{item.material?.name ?? "—"}</td>
                          <td>{item.orderedQty}</td>
                          <td>{item.receivedQty}</td>
                          <td style={{ color: "var(--color-success)", fontWeight: 600 }}>{item.acceptedQty}</td>
                          <td style={{ color: item.rejectedQty > 0 ? "var(--color-danger)" : "var(--text-muted)" }}>{item.rejectedQty}</td>
                          <td>₹{item.unitRate}</td>
                          <td style={{ fontWeight: 700 }}>{formatCurrency(item.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showNew && <NewGRNModal onClose={() => setShowNew(false)} onSave={() => { setShowNew(false); load(); }} />}
    </div>
  );
}

function NewGRNModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [orders,  setOrders]  = useState<any[]>([]);
  const [form, setForm] = useState({ poId: "", vehicleNo: "", driverName: "", invoiceNo: "", notes: "" });
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/procurement/orders?status=SENT")
      .then((r) => r.json())
      .then((d) => {
        const open = d.filter((o: any) => !["CANCELLED", "RECEIVED"].includes(o.status));
        setOrders(open);
      });
  }, []);

  function selectPO(poId: string) {
    setForm({ ...form, poId });
    const po = orders.find((o) => o.id === poId);
    if (po) {
      setItems(po.lineItems.map((li: any) => ({
        materialId:  li.materialId,
        materialName: li.material?.name,
        orderedQty:  li.quantity,
        receivedQty: li.quantity,
        acceptedQty: li.quantity,
        rejectedQty: 0,
        unitRate:    li.unitRate,
      })));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/procurement/grn", {
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
          <div><h3>Record Goods Receipt (GRN)</h3><p style={{ fontSize: 13, color: "var(--text-muted)" }}>Confirm materials received at site</p></div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Purchase Order *</label>
                <select className="form-select" required value={form.poId} onChange={(e) => selectPO(e.target.value)}>
                  <option value="">Select PO to receive…</option>
                  {orders.map((o) => <option key={o.id} value={o.id}>{o.poNumber} — {o.vendor?.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Number</label>
                <input className="form-input" value={form.vehicleNo} onChange={(e) => setForm({ ...form, vehicleNo: e.target.value })} placeholder="e.g. MH 01 AB 1234" />
              </div>
              <div className="form-group">
                <label className="form-label">Driver Name</label>
                <input className="form-input" value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} placeholder="Driver's name" />
              </div>
              <div className="form-group">
                <label className="form-label">Invoice Number</label>
                <input className="form-input" value={form.invoiceNo} onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })} placeholder="Vendor invoice no." />
              </div>
            </div>

            {items.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <h4 style={{ marginBottom: 12 }}>Received Materials</h4>
                {items.map((item, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, marginBottom: 8, alignItems: "end" }}>
                    <div>
                      {i === 0 && <div className="form-label">Material</div>}
                      <div className="form-input" style={{ cursor: "default", color: "var(--text-secondary)" }}>{item.materialName}</div>
                    </div>
                    <div>
                      {i === 0 && <div className="form-label">Ordered</div>}
                      <div className="form-input" style={{ cursor: "default", color: "var(--text-muted)" }}>{item.orderedQty}</div>
                    </div>
                    <div>
                      {i === 0 && <label className="form-label">Accepted</label>}
                      <input className="form-input" type="number" min={0} max={item.orderedQty}
                        value={item.acceptedQty}
                        onChange={(e) => {
                          const a = [...items];
                          a[i].acceptedQty = Number(e.target.value);
                          a[i].rejectedQty = a[i].orderedQty - a[i].acceptedQty;
                          setItems(a);
                        }}
                      />
                    </div>
                    <div>
                      {i === 0 && <div className="form-label">Rejected</div>}
                      <div className="form-input" style={{ cursor: "default", color: items[i].rejectedQty > 0 ? "var(--color-danger)" : "var(--text-muted)" }}>
                        {items[i].rejectedQty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success" disabled={loading || !form.poId}>
              {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><CheckCircle size={14} /> Confirm Receipt</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
