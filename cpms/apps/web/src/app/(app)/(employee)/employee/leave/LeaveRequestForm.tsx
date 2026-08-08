"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { requestLeave } from "./actions";

const LEAVE_TYPES = ["CASUAL", "SICK", "PAID"];

export default function LeaveRequestForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ startDate: "", endDate: "", type: "CASUAL", reason: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await requestLeave(form);
    setLoading(false);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Leave request submitted");
    setOpen(false);
    setForm({ startDate: "", endDate: "", type: "CASUAL", reason: "" });
    router.refresh();
  }

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
        <Plus size={14} /> Request Leave
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div><h3>Request Leave</h3><p style={{ fontSize: 13, color: "var(--text-muted)" }}>Submit a new time-off request</p></div>
              <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <div className="form-group">
                    <label className="form-label">Start Date *</label>
                    <input className="form-input" type="date" required value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date *</label>
                    <input className="form-input" type="date" required value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ gridColumn: "1/-1" }}>
                    <label className="form-label">Leave Type</label>
                    <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: "1/-1" }}>
                    <label className="form-label">Reason *</label>
                    <textarea className="form-textarea" required value={form.reason} style={{ minHeight: 70 }}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Briefly explain the reason for leave…" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</> : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
