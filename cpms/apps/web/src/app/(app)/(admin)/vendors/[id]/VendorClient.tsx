"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateVendorStatus, updateVendorNotes } from "./actions";
import { Building, MapPin, Phone, Mail, FileText, Briefcase, Receipt, Star, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

export default function VendorClient({ vendor }: { vendor: any }) {
  const [status, setStatus] = useState(vendor.status);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(vendor.notes || "");
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const canEdit = userRole === "ADMIN" || userRole === "PROCUREMENT";

  const setStatusAndNotify = async (newStatus: "ACTIVE" | "INACTIVE" | "BLACKLISTED") => {
    setStatus(newStatus);
    const res = await updateVendorStatus(vendor.id, newStatus);
    if (res.error) toast.error(res.error);
    else toast.success(`Vendor marked as ${newStatus}`);
  };

  const handleSaveNotes = async () => {
    const res = await updateVendorNotes(vendor.id, notes);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Notes updated successfully");
      setIsEditingNotes(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Profile Header */}
      <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-[var(--color-info)]/10 text-[var(--color-info)] flex items-center justify-center font-black text-2xl shadow-sm">
            {vendor.name.substring(0,2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-black text-[var(--text-title)] flex items-center gap-3">
              {vendor.name}
              <span className={`badge text-xs ${status === 'ACTIVE' ? 'badge-success' : status === 'BLACKLISTED' ? 'badge-danger' : 'badge-warning'}`}>{status}</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge badge-info text-xs">{vendor.code}</span>
              <div className="flex items-center text-[var(--color-warning)] text-xs font-bold gap-0.5">
                <Star size={12} fill="currentColor"/> {vendor.rating.toFixed(1)} Rating
              </div>
            </div>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex flex-col gap-2 bg-[var(--bg-hover)] p-3 rounded-lg border border-[var(--bg-border-solid)]">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted text-center md:text-left">Vendor Actions</label>
            <div className="flex flex-wrap gap-2">
              {status !== 'ACTIVE' && (
                <button 
                  onClick={() => setStatusAndNotify('ACTIVE')}
                  className="btn bg-[var(--color-success)] text-white hover:opacity-90 py-1.5 px-3 text-xs font-bold"
                >
                  Activate
                </button>
              )}
              {status === 'ACTIVE' && (
                <button 
                  onClick={() => setStatusAndNotify('INACTIVE')}
                  className="btn bg-[var(--color-warning)] text-white hover:opacity-90 py-1.5 px-3 text-xs font-bold"
                >
                  Mark Inactive
                </button>
              )}
              {status !== 'BLACKLISTED' && (
                <button 
                  onClick={() => setStatusAndNotify('BLACKLISTED')}
                  className="btn bg-[var(--color-danger)] text-white hover:opacity-90 py-1.5 px-3 text-xs font-bold"
                >
                  Blacklist (Block)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="flex flex-col gap-6 col-span-1 lg:col-span-1">
          <div className="bento-item glass-panel">
            <div className="bento-header with-border bg-[var(--bg-hover)]">
              <h3 className="font-black text-sm text-[var(--text-title)] flex items-center gap-2 m-0"><Briefcase size={16}/> Contact Information</h3>
            </div>
            <div className="bento-body flex flex-col gap-4 text-sm font-medium pb-6">
              <div className="flex items-start gap-3">
                <Building size={16} className="text-muted mt-0.5"/>
                <div className="flex flex-col"><span className="text-[10px] text-muted uppercase font-bold">Contact Person</span><span className="font-bold">{vendor.contactName}</span></div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-muted mt-0.5"/>
                <div className="flex flex-col"><span className="text-[10px] text-muted uppercase font-bold">Phone</span><span className="font-bold">{vendor.contactPhone}</span></div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-muted mt-0.5"/>
                <div className="flex flex-col"><span className="text-[10px] text-muted uppercase font-bold">Email</span><span className="font-bold">{vendor.contactEmail}</span></div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-muted mt-0.5"/>
                <div className="flex flex-col"><span className="text-[10px] text-muted uppercase font-bold">Address</span><span className="font-bold">{vendor.address}, {vendor.city}</span></div>
              </div>
            </div>
          </div>

          <div className="bento-item glass-panel">
            <div className="bento-header with-border bg-[var(--bg-hover)]">
              <h3 className="font-black text-sm text-[var(--text-title)] flex items-center gap-2 m-0"><ShieldAlert size={16}/> Tax & Compliance</h3>
            </div>
            <div className="bento-body flex flex-col gap-4 text-sm font-medium pb-6">
              <div className="flex flex-col"><span className="text-[10px] text-muted uppercase font-bold">GST Number</span><span className="font-bold font-mono">{vendor.gstNumber || 'Not Provided'}</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-muted uppercase font-bold">PAN Number</span><span className="font-bold font-mono">{vendor.panNumber || 'Not Provided'}</span></div>
              <div className="flex flex-col"><span className="text-[10px] text-muted uppercase font-bold">Bank Details</span><span className="font-bold text-xs">HDFC Bank - Acct ending in 4598<br/>IFSC: HDFC0001234</span></div>
            </div>
          </div>

          <div className="bento-item glass-panel">
            <div className="bento-header with-border bg-[var(--bg-hover)]">
              <h3 className="font-black text-sm text-[var(--text-title)] flex items-center gap-2 m-0"><FileText size={16}/> Documents</h3>
            </div>
            <div className="bento-body flex flex-col gap-2 pb-6">
              <div className="flex items-center justify-between p-2 bg-[var(--bg-hover)] rounded border border-[var(--bg-border-solid)] cursor-pointer hover:border-[var(--brand-primary)]">
                <div className="flex items-center gap-2"><FileText size={14} className="text-[var(--brand-primary)]"/><span className="text-xs font-bold">Vendor_Agreement.pdf</span></div>
                <span className="text-[10px] text-muted">2.4 MB</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[var(--bg-hover)] rounded border border-[var(--bg-border-solid)] cursor-pointer hover:border-[var(--brand-primary)]">
                <div className="flex items-center gap-2"><FileText size={14} className="text-[var(--color-danger)]"/><span className="text-xs font-bold">GST_Certificate.pdf</span></div>
                <span className="text-[10px] text-muted">1.1 MB</span>
              </div>
            </div>
          </div>

          <div className="bento-item glass-panel">
            <div className="bento-header with-border bg-[var(--bg-hover)]">
              <h3 className="font-black text-sm text-[var(--text-title)] flex items-center gap-2 m-0"><FileText size={16}/> Internal Notes</h3>
              {canEdit && !isEditingNotes && <button onClick={() => setIsEditingNotes(true)} className="text-xs text-[var(--brand-primary)] font-bold hover:underline">Edit</button>}
            </div>
            <div className="bento-body pb-6">
              {isEditingNotes ? (
                <div className="flex flex-col gap-2">
                  <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    className="input-base text-sm min-h-[100px] p-2"
                    placeholder="Add internal notes about this vendor..."
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsEditingNotes(false)} className="btn btn-outline py-1 px-3 text-xs">Cancel</button>
                    <button onClick={handleSaveNotes} className="btn btn-primary py-1 px-3 text-xs">Save Notes</button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap font-medium m-0">
                  {vendor.notes || <span className="text-muted italic">No notes available.</span>}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: POs and Contracts */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-4 flex flex-col gap-1">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Total Spend</span>
              <span className="text-xl font-black text-[var(--text-title)]">₹4,25,000</span>
              <span className="text-[10px] text-[var(--color-success)] font-bold mt-1">+12% this year</span>
            </div>
            <div className="glass-panel p-4 flex flex-col gap-1">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Payment Status</span>
              <span className="text-xl font-black text-[var(--color-warning)]">₹45,000 Due</span>
              <span className="text-[10px] text-muted font-bold mt-1">Next payment in 5 days</span>
            </div>
            <div className="glass-panel p-4 flex flex-col gap-1">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Contract Expiry</span>
              <span className="text-xl font-black text-[var(--text-title)]">12 Oct 2026</span>
              <span className="text-[10px] text-[var(--color-danger)] font-bold mt-1">Expires in 79 days</span>
            </div>
          </div>

          <div className="bento-item glass-panel flex-1">
            <div className="bento-header with-border bg-[var(--bg-hover)]">
              <h3 className="font-black text-[var(--text-title)] flex items-center gap-2 m-0"><Receipt size={18} className="text-[var(--color-success)]"/> Purchase Order History</h3>
            </div>
            <div className="bento-body flex flex-col gap-3 max-h-[500px] overflow-y-auto pb-6">
              {vendor.purchaseOrders.length === 0 && <p className="text-sm text-muted text-center p-4">No purchase orders found.</p>}
              {vendor.purchaseOrders.map((po: any) => (
                <div key={po.id} className="flex flex-col p-4 border border-[var(--bg-border-solid)] rounded-lg hover:border-[var(--brand-primary)] transition-colors gap-3 group bg-[var(--bg-app)]">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-[var(--text-title)] group-hover:text-[var(--brand-primary)] transition-colors">{po.poNumber}</span>
                      <span className="text-[10px] text-muted font-bold mt-1">Project: <span className="text-[var(--text-secondary)]">{po.project?.name || 'N/A'}</span></span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-base font-black text-[var(--color-success)]">₹{po.grandTotal.toLocaleString()}</span>
                      <span className={`badge text-[10px] ${po.status === 'RECEIVED' ? 'badge-success' : 'badge-warning'}`}>{po.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
