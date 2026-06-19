"use client";

import { useEffect, useState } from "react";
import { Package, Plus, Search, X, Loader2, AlertTriangle, Tag, Scale } from "lucide-react";
import { getStatusBadge } from "@/lib/utils";

const CATEGORIES = ["STRUCTURAL", "FINISHING", "ELECTRICAL", "PLUMBING", "HARDWARE", "SAFETY", "OTHER"];
const UNITS = ["KG", "TONNE", "BAG", "PIECE", "SQFT", "SQMT", "CUBIC_MT", "LITRE", "METER", "ROLL"];
const CAT_COLORS: Record<string, string> = {
  STRUCTURAL: "badge-amber", FINISHING: "badge-info", ELECTRICAL: "badge-cyan",
  PLUMBING: "badge-purple", HARDWARE: "badge-muted", SAFETY: "badge-danger", OTHER: "badge-muted",
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("");
  const [showAdd,   setShowAdd]   = useState(false);

  function load() {
    setLoading(true);
    const p = new URLSearchParams();
    if (search)   p.set("search", search);
    if (category) p.set("category", category);
    fetch(`/api/materials?${p}`)
      .then((r) => r.json())
      .then((d) => { setMaterials(d); setLoading(false); });
  }

  useEffect(() => { load(); }, [search, category]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-block">
          <h1>Material Catalog</h1>
          <p>Master list of all construction materials tracked in the system</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={15} /> Add Material
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div className="search-bar">
          <Search size={14} className="search-icon" />
          <input className="form-input" placeholder="Search materials…" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button className={`btn btn-sm ${!category ? "btn-primary" : "btn-secondary"}`} onClick={() => setCategory("")}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c} className={`btn btn-sm ${category === c ? "btn-primary" : "btn-secondary"}`} onClick={() => setCategory(c)}>
              {c.charAt(0) + c.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => {
          const count = materials.filter((m) => m.category === cat).length;
          if (!count) return null;
          return (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className={`badge ${CAT_COLORS[cat]}`}>{cat}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{count}</span>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 160, borderRadius: 14 }} />
          ))}
        </div>
      ) : materials.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon"><Package size={28} /></div>
          <h4>No materials found</h4>
          <p>Add materials to your catalog to start tracking procurement</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add Material
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {materials.map((m) => <MaterialCard key={m.id} material={m} />)}
        </div>
      )}

      {showAdd && <AddMaterialModal onClose={() => setShowAdd(false)} onSave={() => { setShowAdd(false); load(); }} />}
    </div>
  );
}

function MaterialCard({ material: m }: { material: any }) {
  const bestPrice = m.contracts?.[0]?.negotiatedRate;
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            width: 40, height: 40,
            background: "var(--bg-elevated)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--brand-amber)",
          }}>
            <Package size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{m.name}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{m.code}</div>
          </div>
        </div>
        <span className={`badge ${CAT_COLORS[m.category] || "badge-muted"}`}>{m.category}</span>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
          <Scale size={12} style={{ color: "var(--text-muted)" }} />
          Unit: <strong>{m.unit}</strong>
        </div>
        {m.hsn && (
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            HSN: <strong>{m.hsn}</strong>
          </div>
        )}
      </div>

      {bestPrice && (
        <div style={{ padding: "8px 12px", background: "var(--brand-amber-muted)", borderRadius: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Best Price: </span>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--brand-amber)" }}>₹{bestPrice}/{m.unit}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>via {m.contracts[0]?.vendor?.name}</span>
        </div>
      )}

      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
        {m._count?.contracts ?? 0} vendor contract{m._count?.contracts !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

function AddMaterialModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({ name: "", code: "", category: "STRUCTURAL", unit: "KG", description: "", hsn: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add material");
      onSave();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div><h3>Add New Material</h3><p style={{ fontSize: 13, color: "var(--text-muted)" }}>Add to the master material catalog</p></div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error" style={{ marginBottom: 16 }}><AlertTriangle size={14} />{error}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Material Name *</label>
                <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Portland Cement 53 Grade" />
              </div>
              <div className="form-group">
                <label className="form-label">Material Code *</label>
                <input className="form-input" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. CEM-001" />
              </div>
              <div className="form-group">
                <label className="form-label">HSN Code</label>
                <input className="form-input" value={form.hsn} onChange={(e) => setForm({ ...form, hsn: e.target.value })} placeholder="e.g. 2523" />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Unit of Measure *</label>
                <select className="form-select" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Specifications, grade, brand notes…" style={{ minHeight: 70 }} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : "Add Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
