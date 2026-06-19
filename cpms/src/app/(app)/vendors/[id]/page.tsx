"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import {
  Building2, Phone, Mail, MapPin, Star, FileText, ShoppingCart,
  Package, Edit2, ArrowLeft, CheckCircle, XCircle, AlertTriangle,
  Plus, X, Loader2, Calendar, DollarSign,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusBadge, getStatusLabel } from "@/lib/utils";

export default function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params);
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "contracts" | "orders">("overview");

  function load() {
    fetch(`/api/vendors/${id}`)
      .then((r) => r.json())
      .then((d) => { setVendor(d); setLoading(false); });
  }

  useEffect(() => { load(); }, [id]);

  if (loading) return <div style={{ padding: 40 }}><div className="skeleton" style={{ height: 200, borderRadius: 14 }} /></div>;
  if (!vendor)  return <div className="empty-state">Vendor not found.</div>;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Link href="/vendors" className="btn btn-ghost btn-sm" style={{ marginBottom: 16, display: "inline-flex" }}>
          <ArrowLeft size={14} /> Back to Vendors
        </Link>

        {/* Header card */}
        <div className="card vendor-detail-header">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div style={{
              width: 64, height: 64,
              background: "var(--brand-amber-muted)",
              border: "2px solid rgba(245,158,11,0.3)",
              borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--brand-amber)", fontWeight: 800, fontSize: 24, flexShrink: 0,
            }}>
              {vendor.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <h1 style={{ fontSize: 22 }}>{vendor.name}</h1>
                <span className={`badge ${getStatusBadge(vendor.status)}`}>{getStatusLabel(vendor.status)}</span>
                <code className="font-mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>{vendor.code}</code>
              </div>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                  <Phone size={13} />{vendor.contactName} · {vendor.contactPhone}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                  <Mail size={13} />{vendor.contactEmail}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                  <MapPin size={13} />{vendor.city}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14}
                    fill={i < Math.round(vendor.rating) ? "var(--brand-amber)" : "transparent"}
                    stroke={i < Math.round(vendor.rating) ? "var(--brand-amber)" : "var(--text-disabled)"}
                  />
                ))}
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>{vendor.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm"><Edit2 size={13} /> Edit</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: 24, borderTop: "1px solid var(--bg-border)", paddingTop: 20 }}>
            {[
              { label: "Material Contracts", value: vendor.contracts?.length ?? 0, icon: <FileText size={15} />, color: "amber" },
              { label: "Purchase Orders",    value: vendor.purchaseOrders?.length ?? 0, icon: <ShoppingCart size={15} />, color: "info" },
              { label: "Total Spend", value: formatCurrency(vendor.purchaseOrders?.reduce((s: number, o: any) => s + o.grandTotal, 0) ?? 0), icon: <DollarSign size={15} />, color: "success" },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                flex: 1, paddingRight: 24, marginRight: 24,
                borderRight: i < 2 ? "1px solid var(--bg-border)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: `var(--color-${stat.color === "amber" ? "warning" : stat.color})`, marginBottom: 4 }}>
                  {stat.icon}
                  <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600 }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        {(["overview", "contracts", "orders"] as const).map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "overview" ? "Overview" : t === "contracts" ? "Material Contracts" : "Purchase Orders"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="card">
            <div className="card-header"><h4>Contact Details</h4></div>
            <div className="card-body">
              <DetailRow label="GST Number"  value={vendor.gstNumber || "—"} />
              <DetailRow label="PAN Number"  value={vendor.panNumber || "—"} />
              <DetailRow label="Address"     value={vendor.address || "—"} />
              <DetailRow label="City"        value={vendor.city} />
              <DetailRow label="Member Since" value={formatDate(vendor.createdAt)} />
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h4>Quick Stats</h4></div>
            <div className="card-body">
              <DetailRow label="Active Contracts" value={`${vendor.contracts?.filter((c: any) => c.isActive).length ?? 0} of ${vendor.contracts?.length ?? 0}`} />
              <DetailRow label="Total POs" value={vendor.purchaseOrders?.length ?? 0} />
              <DetailRow label="Notes" value={vendor.notes || "—"} />
            </div>
          </div>
        </div>
      )}

      {tab === "contracts" && (
        <div className="card">
          <div className="card-header">
            <h4>Material Contracts ({vendor.contracts?.length ?? 0})</h4>
            <span className="badge badge-success">Negotiated Rates</span>
          </div>
          {vendor.contracts?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Category</th>
                    <th>Rate</th>
                    <th>Min Order</th>
                    <th>Tax %</th>
                    <th>Valid Until</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vendor.contracts.map((c: any) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.material?.name}</td>
                      <td><span className="badge badge-muted">{c.material?.category}</span></td>
                      <td style={{ fontWeight: 600, color: "var(--brand-amber)" }}>₹{c.negotiatedRate}/{c.material?.unit}</td>
                      <td>{c.minOrderQty} {c.material?.unit}</td>
                      <td>{c.taxPercent}%</td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(c.validTo)}</td>
                      <td><span className={`badge ${c.isActive ? "badge-success" : "badge-muted"}`}>{c.isActive ? "Active" : "Expired"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No contracts yet</p></div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="card">
          <div className="card-header"><h4>Purchase Orders ({vendor.purchaseOrders?.length ?? 0})</h4></div>
          {vendor.purchaseOrders?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {vendor.purchaseOrders.map((po: any) => (
                    <tr key={po.id}>
                      <td><span className="font-mono text-amber">{po.poNumber}</span></td>
                      <td>{po.project?.name}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(po.grandTotal)}</td>
                      <td><span className={`badge ${getStatusBadge(po.status)}`}>{getStatusLabel(po.status)}</span></td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(po.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state"><p>No purchase orders for this vendor</p></div>
          )}
        </div>
      )}

      <style>{`
        .vendor-detail-header {
          padding: 24px;
        }
      `}</style>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid var(--bg-border)" }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}
