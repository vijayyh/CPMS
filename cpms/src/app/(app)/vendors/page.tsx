"use client";

import { useEffect, useState } from "react";
import {
  Building2, Plus, Search, Filter, Star, Phone, Mail,
  MapPin, FileText, ShoppingCart, MoreVertical, CheckCircle,
  XCircle, AlertTriangle, X, Loader2,
} from "lucide-react";
import { formatDate, getStatusBadge, getStatusLabel } from "@/lib/utils";
import Link from "next/link";

interface Vendor {
  id:           string;
  name:         string;
  code:         string;
  contactName:  string;
  contactPhone: string;
  contactEmail: string;
  city:         string;
  status:       string;
  rating:       number;
  gstNumber:    string;
  createdAt:    string;
  _count:       { contracts: number; purchaseOrders: number };
}

export default function VendorsPage() {
  const [vendors, setVendors]   = useState<Vendor[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search,  setSearch]    = useState("");
  const [status,  setStatus]    = useState("");
  const [showAdd, setShowAdd]   = useState(false);

  function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    fetch(`/api/vendors?${params}`)
      .then((r) => r.json())
      .then((d) => { setVendors(d); setLoading(false); });
  }

  useEffect(() => { load(); }, [search, status]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Vendor Directory</h1>
          <p>Manage all your material suppliers and their contracts</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" id="add-vendor-btn" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Add Vendor
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="vendors-toolbar">
        <div className="search-bar">
          <Search size={14} className="search-icon" />
          <input
            className="form-input"
            placeholder="Search vendors, city, contact…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["", "ACTIVE", "INACTIVE", "BLACKLISTED"].map((s) => (
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
      <div className="vendor-stats-bar">
        <div className="vendor-stat-item">
          <span className="vendor-stat-num">{vendors.length}</span>
          <span className="vendor-stat-lbl">Total Vendors</span>
        </div>
        <div className="vendor-stat-sep" />
        <div className="vendor-stat-item">
          <span className="vendor-stat-num text-success">
            {vendors.filter((v) => v.status === "ACTIVE").length}
          </span>
          <span className="vendor-stat-lbl">Active</span>
        </div>
        <div className="vendor-stat-sep" />
        <div className="vendor-stat-item">
          <span className="vendor-stat-num text-amber">
            {vendors.reduce((s, v) => s + v._count.contracts, 0)}
          </span>
          <span className="vendor-stat-lbl">Total Contracts</span>
        </div>
        <div className="vendor-stat-sep" />
        <div className="vendor-stat-item">
          <span className="vendor-stat-num text-info">
            {vendors.reduce((s, v) => s + v._count.purchaseOrders, 0)}
          </span>
          <span className="vendor-stat-lbl">Purchase Orders</span>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      {loading ? (
        <div className="vendors-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="vendor-card skeleton-card">
              <div className="skeleton" style={{ height: 20, width: "60%", marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 14, width: "40%", marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: "80%" }} />
            </div>
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><Building2 size={28} /></div>
          <h4>No vendors found</h4>
          <p>Add your first vendor to get started with procurement</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add Vendor
          </button>
        </div>
      ) : (
        <div className="vendors-grid">
          {vendors.map((v) => (
            <VendorCard key={v.id} vendor={v} onRefresh={load} />
          ))}
        </div>
      )}

      {showAdd && (
        <AddVendorModal onClose={() => setShowAdd(false)} onSave={() => { setShowAdd(false); load(); }} />
      )}

      <style>{`
        .vendors-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .vendors-toolbar .search-bar input { width: 300px; }

        .vendor-stats-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          background: var(--bg-card);
          border: 1px solid var(--bg-border);
          border-radius: var(--radius-lg);
          padding: 14px 24px;
          margin-bottom: 24px;
        }

        .vendor-stat-item { display: flex; flex-direction: column; gap: 2px; }
        .vendor-stat-num  { font-size: 20px; font-weight: 800; color: var(--text-primary); }
        .vendor-stat-lbl  { font-size: 11px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.4px; }
        .vendor-stat-sep  { width: 1px; height: 36px; background: var(--bg-border); }

        .vendors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }

        .skeleton-card {
          background: var(--bg-card);
          border: 1px solid var(--bg-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          height: 200px;
        }

        .vendor-card-wrap {
          background: var(--bg-card);
          border: 1px solid var(--bg-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
          padding: 20px;
          transition: all var(--transition-base);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .vendor-card-wrap:hover {
          border-color: var(--brand-amber);
          box-shadow: 0 4px 20px rgba(245,158,11,0.1);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < Math.round(rating) ? "var(--brand-amber)" : "transparent"}
          stroke={i < Math.round(rating) ? "var(--brand-amber)" : "var(--text-disabled)"}
        />
      ))}
      <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function VendorCard({ vendor: v, onRefresh }: { vendor: Vendor; onRefresh: () => void }) {
  return (
    <Link href={`/vendors/${v.id}`} style={{ textDecoration: "none" }}>
      <div className="vendor-card-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 36, height: 36,
                background: "var(--brand-amber-muted)",
                borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--brand-amber)", fontWeight: 700, fontSize: 13,
                flexShrink: 0,
              }}>
                {v.name[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{v.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{v.code}</div>
              </div>
            </div>
          </div>
          <span className={`badge ${getStatusBadge(v.status)}`}>{getStatusLabel(v.status)}</span>
        </div>

        <StarRating rating={v.rating} />

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text-secondary)" }}>
            <Phone size={12} style={{ color: "var(--text-muted)" }} />
            {v.contactPhone}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text-secondary)" }}>
            <Mail size={12} style={{ color: "var(--text-muted)" }} />
            {v.contactEmail}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text-secondary)" }}>
            <MapPin size={12} style={{ color: "var(--text-muted)" }} />
            {v.city}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, paddingTop: 10, borderTop: "1px solid var(--bg-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}>
            <FileText size={12} style={{ color: "var(--text-muted)" }} />
            <span>{v._count.contracts} contracts</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}>
            <ShoppingCart size={12} style={{ color: "var(--text-muted)" }} />
            <span>{v._count.purchaseOrders} POs</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function AddVendorModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    name: "", code: "", contactName: "", contactPhone: "", contactEmail: "",
    address: "", city: "", gstNumber: "", panNumber: "", rating: 3,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });
      if (!res.ok) throw new Error("Failed to create vendor");
      onSave();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Add New Vendor</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Fill in the supplier details below</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error" style={{ marginBottom: 16 }}><AlertTriangle size={14} />{error}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ramesh Steel Co." />
              </div>
              <div className="form-group">
                <label className="form-label">Vendor Code *</label>
                <input className="form-input" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. VND-001" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Person *</label>
                <input className="form-input" required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="Full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input className="form-input" required value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" required value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="vendor@company.com" />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Address</label>
                <textarea className="form-textarea" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street address" style={{ minHeight: 60 }} />
              </div>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input className="form-input" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Mumbai" />
              </div>
              <div className="form-group">
                <label className="form-label">GST Number</label>
                <input className="form-input" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} placeholder="22AAAAA0000A1Z5" />
              </div>
              <div className="form-group">
                <label className="form-label">PAN Number</label>
                <input className="form-input" value={form.panNumber} onChange={(e) => setForm({ ...form, panNumber: e.target.value })} placeholder="AAAAA0000A" />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Rating (1-5)</label>
                <input className="form-input" type="number" min={1} max={5} step={0.5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="save-vendor-btn">
              {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : "Save Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
