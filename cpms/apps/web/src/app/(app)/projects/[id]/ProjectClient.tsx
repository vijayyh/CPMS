"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateProjectBudget, updateProjectStatus, addLabourLog, deleteLabourLog } from "./actions";
import { Trash2, Plus, Edit2, Users, Receipt, Building2, MapPin, Clock, CheckSquare, Camera, AlertTriangle, Calendar } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useSession } from "next-auth/react";

export default function ProjectClient({ project }: { project: any }) {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetVal, setBudgetVal] = useState(project.budget);
  
  // Labour form state
  const [labourType, setLabourType] = useState("Mason");
  const [count, setCount] = useState(1);
  const [rate, setRate] = useState(800);
  
  const [status, setStatus] = useState(project.status);
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const canEdit = userRole === "ADMIN" || userRole === "MANAGER"; // Admins and Managers can edit/invite

  // Invite state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("EMPLOYEE");
  const [isInviting, setIsInviting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (showInviteModal) {
      setIsLoadingUsers(true);
      fetch(`/api/users?excludeProjectId=${project.id}`)
        .then(res => res.json())
        .then(data => {
          setAvailableUsers(Array.isArray(data) ? data : []);
          setIsLoadingUsers(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoadingUsers(false);
        });
    }
  }, [showInviteModal, project.id]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      const res = await fetch("/api/projects/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, projectId: project.id, role: inviteRole })
      });
      if (res.ok) {
        toast.success("Invitation sent successfully!");
        setShowInviteModal(false);
        setInviteEmail("");
        setSearchQuery("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to invite user");
      }
    } catch (err) {
      toast.error("Error sending invite");
    } finally {
      setIsInviting(false);
    }
  };

  const setStatusAndNotify = async (newStatus: "ACTIVE" | "ON_HOLD" | "COMPLETED") => {
    setStatus(newStatus);
    const res = await updateProjectStatus(project.id, newStatus);
    if (res.error) toast.error(res.error);
    else toast.success(`Project marked as ${newStatus}`);
  };

  const handleUpdateBudget = async () => {
    const res = await updateProjectBudget(project.id, Number(budgetVal));
    if (res.error) toast.error(res.error);
    else {
      toast.success("Budget updated successfully!");
      setIsEditingBudget(false);
    }
  };

  const handleAddLabour = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addLabourLog(project.id, labourType, Number(count), Number(rate));
    if (res.error) toast.error(res.error);
    else {
      toast.success("Labour log added successfully!");
      setCount(1);
    }
  };

  const handleDeleteLabour = async (logId: string) => {
    const res = await deleteLabourLog(logId, project.id);
    if (res.error) toast.error(res.error);
    else toast.success("Labour log removed");
  };

  const totalLabourSpend = project.labourLogs.reduce((acc: number, l: any) => acc + l.totalCost, 0);

  const totalPOSpend = project.purchaseOrders.reduce((acc: number, po: any) => acc + po.grandTotal, 0);
  const totalSpend = totalLabourSpend + totalPOSpend;
  const budgetPct = Math.min(100, (totalSpend / project.budget) * 100);
  
  // Time calculation
  const start = new Date(project.startDate);
  const end = project.endDate ? new Date(project.endDate) : new Date();
  const today = new Date();
  const totalDays = differenceInDays(end, start) || 1;
  const daysElapsed = Math.max(0, Math.min(totalDays, differenceInDays(today, start)));
  const timePct = Math.min(100, (daysElapsed / totalDays) * 100);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Overview Card */}
      <div className="glass-panel p-6 flex flex-col md:flex-row justify-between md:items-center gap-6 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-primary)] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex items-center gap-4 z-10">
          <div className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] p-4 rounded-xl">
            <Building2 size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-[var(--text-title)]">{project.name}</h2>
              <span className={`badge ${project.status === 'ACTIVE' ? 'badge-success' : project.status === 'COMPLETED' ? 'badge-muted' : 'badge-warning'} text-[10px]`}>{project.status}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-muted text-sm font-bold mt-2">
              <div className="flex items-center gap-1.5"><MapPin size={14} /> {project.location}</div>
              <div className="flex items-center gap-1.5"><Users size={14} /> Manager: {project.manager?.name || 'Unassigned'}</div>
              <div className="flex items-center gap-1.5"><Calendar size={14} /> {format(start, 'MMM d, yyyy')} {project.endDate ? `- ${format(new Date(project.endDate), 'MMM d, yyyy')}` : '- Ongoing'}</div>
            </div>
            
            {canEdit && (
              <div className="mt-4 flex gap-2 flex-wrap">
                <button onClick={() => setShowInviteModal(true)} className="btn bg-[var(--brand-primary)] text-white hover:opacity-90 py-1 px-3 text-[10px] uppercase font-bold tracking-wider rounded shadow-md">Invite Member</button>
                {status !== 'ACTIVE' && (
                  <button onClick={() => setStatusAndNotify('ACTIVE')} className="btn bg-[var(--color-success)] text-white hover:opacity-90 py-1 px-3 text-[10px] uppercase font-bold tracking-wider rounded">Set Active</button>
                )}
                {status !== 'ON_HOLD' && (
                  <button onClick={() => setStatusAndNotify('ON_HOLD')} className="btn bg-[var(--color-warning)] text-white hover:opacity-90 py-1 px-3 text-[10px] uppercase font-bold tracking-wider rounded">Mark On Hold / Pending</button>
                )}
                {status !== 'COMPLETED' && (
                  <button onClick={() => setStatusAndNotify('COMPLETED')} className="btn bg-[var(--color-muted)] text-[var(--bg-card)] hover:opacity-90 py-1 px-3 text-[10px] uppercase font-bold tracking-wider rounded">Close Project</button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:items-end p-4 bg-[var(--bg-hover)] rounded-lg border border-[var(--bg-border-solid)] z-10 min-w-[200px]">
          <span className="text-xs uppercase tracking-widest font-black text-muted mb-1">Project Budget</span>
          {isEditingBudget && canEdit ? (
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={budgetVal} 
                onChange={e => setBudgetVal(e.target.value)}
                className="input-base w-32 py-1 px-2 text-lg font-black"
              />
              <button onClick={handleUpdateBudget} className="btn btn-primary py-1 px-3 text-sm">Save</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-[var(--text-title)] tracking-tight">₹{project.budget.toLocaleString()}</span>
              {canEdit && <button onClick={() => setIsEditingBudget(true)} className="p-1.5 hover:bg-[var(--bg-card-solid)] rounded-md text-muted hover:text-[var(--text-title)] border border-transparent hover:border-[var(--bg-border-solid)] transition-colors"><Edit2 size={14}/></button>}
            </div>
          )}
        </div>
      </div>

      {/* Analytics & Progress Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spend Metrics */}
        <div className="bento-item glass-panel col-span-1">
          <div className="bento-header with-border">
            <div className="flex items-center gap-2 text-muted">
              <Receipt size={18}/>
              <h3 className="text-sm font-black uppercase tracking-wider m-0">Financial Summary</h3>
            </div>
          </div>
          <div className="bento-body flex flex-col gap-4 pb-6">
            <div className="flex justify-between items-end border-b border-[var(--bg-border-solid)] pb-3">
              <span className="text-sm font-bold text-muted">Spend Till Date</span>
              <span className="text-xl font-black text-[var(--color-danger)]">₹{totalSpend.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end border-b border-[var(--bg-border-solid)] pb-3">
              <span className="text-sm font-bold text-muted">Budget Remaining</span>
              <span className="text-xl font-black text-[var(--color-success)]">₹{Math.max(0, project.budget - totalSpend).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-muted">Total Labour Cost</span>
              <span className="text-xl font-black text-[var(--color-warning)]">₹{totalLabourSpend.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="bento-item glass-panel col-span-1 lg:col-span-2">
          <div className="bento-header with-border">
            <div className="flex items-center gap-2 text-muted">
              <Clock size={18}/>
              <h3 className="text-sm font-black uppercase tracking-wider m-0">Progress Tracking</h3>
            </div>
          </div>
          <div className="bento-body flex flex-col gap-6 pb-6 mt-2">
            {/* Time vs Budget Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-muted uppercase tracking-wide">
                <span>Timeline Elapsed</span>
                <span>{timePct.toFixed(0)}%</span>
              </div>
              <div className="h-4 w-full bg-[var(--bg-hover)] rounded-full overflow-hidden border border-[var(--bg-border-solid)]">
                <div className="h-full bg-[var(--color-info)] transition-all duration-1000" style={{ width: `${timePct}%` }} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-muted uppercase tracking-wide">
                <span>Budget Utilization</span>
                <span className={budgetPct > 100 ? 'text-[var(--color-danger)]' : ''}>{budgetPct.toFixed(0)}%</span>
              </div>
              <div className="h-4 w-full bg-[var(--bg-hover)] rounded-full overflow-hidden border border-[var(--bg-border-solid)]">
                <div className={`h-full transition-all duration-1000 ${budgetPct > 90 ? 'bg-[var(--color-danger)]' : budgetPct > 70 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-success)]'}`} style={{ width: `${Math.min(100, budgetPct)}%` }} />
              </div>
            </div>

            {budgetPct > timePct + 15 && (
              <div className="flex items-center gap-2 bg-[var(--color-danger)]/10 text-[var(--color-danger)] p-3 rounded-lg border border-[var(--color-danger)]/20 text-sm font-bold">
                <AlertTriangle size={16}/> Warning: Budget utilization is significantly ahead of timeline progress!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Labour Logs Section */}
        <div className="flex flex-col gap-4">
          <div className="bento-item glass-panel h-[450px]">
            <div className="bento-header with-border bg-[var(--bg-hover)] shrink-0">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[var(--text-secondary)]"/>
                <h3 className="font-black text-[var(--text-title)] m-0">Daily Labour Logs</h3>
              </div>
              <span className="badge badge-warning text-xs font-bold shadow-sm">Total Spend: ₹{totalLabourSpend.toLocaleString()}</span>
            </div>
            
            <div className="bento-body flex flex-col gap-4 overflow-hidden">
              {/* Add form (Only admins can add labour logs according to new strict RBAC, or maybe let managers add? Plan said read-only for Site Managers on edits. We'll lock it down.) */}
              {canEdit && (
                <form onSubmit={handleAddLabour} className="flex gap-2 items-end bg-[var(--bg-app)] p-3 rounded-lg border border-[var(--bg-border-solid)] shrink-0">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[10px] font-bold text-muted uppercase">Type</label>
                    <select value={labourType} onChange={e => setLabourType(e.target.value)} className="input-base py-1.5 px-2 text-sm font-bold">
                      <option>Mason</option>
                      <option>Carpenter</option>
                      <option>Helper</option>
                      <option>Electrician</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 w-16">
                    <label className="text-[10px] font-bold text-muted uppercase">Count</label>
                    <input type="number" min="1" value={count} onChange={e => setCount(e.target.value as any)} className="input-base py-1.5 px-2 text-sm font-bold text-center" />
                  </div>
                  <div className="flex flex-col gap-1 w-20">
                    <label className="text-[10px] font-bold text-muted uppercase">Rate (₹)</label>
                    <input type="number" value={rate} onChange={e => setRate(e.target.value as any)} className="input-base py-1.5 px-2 text-sm font-bold" />
                  </div>
                  <button type="submit" className="btn btn-primary py-1.5 px-3 flex items-center justify-center shrink-0">
                    <Plus size={16} />
                  </button>
                </form>
              )}

              {/* List */}
              <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-2">
                {project.labourLogs.length === 0 && <p className="text-sm text-muted text-center p-4">No labour logged yet.</p>}
                {project.labourLogs.map((log: any) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border border-[var(--bg-border-solid)] rounded-lg hover:border-[var(--brand-primary)] transition-colors group shrink-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[var(--text-title)]">{log.count}x {log.labourType}</span>
                      <span className="text-[10px] uppercase font-bold text-muted">{format(new Date(log.date), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-[var(--color-danger)]">-₹{log.totalCost.toLocaleString()}</span>
                      {canEdit && (
                        <button onClick={() => handleDeleteLabour(log.id)} className="text-muted hover:text-[var(--color-danger)] opacity-0 group-hover:opacity-100 transition-opacity p-1">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Orders Section */}
        <div className="flex flex-col gap-4">
          <div className="bento-item glass-panel h-[450px]">
            <div className="bento-header with-border bg-[var(--bg-hover)] shrink-0">
              <div className="flex items-center gap-2">
                <Receipt size={18} className="text-[var(--color-info)]"/>
                <h3 className="font-black text-[var(--text-title)] m-0">Purchase Orders</h3>
              </div>
            </div>
            
            <div className="bento-body flex flex-col gap-3 overflow-y-auto">
              {project.purchaseOrders.length === 0 && <p className="text-sm text-muted text-center p-4">No purchase orders found.</p>}
              {project.purchaseOrders.map((po: any) => (
                <div key={po.id} className="flex flex-col p-3 border border-[var(--bg-border-solid)] rounded-lg hover:border-[var(--brand-primary)] transition-colors gap-2 shrink-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-[var(--text-title)]">{po.poNumber}</span>
                    <span className="badge badge-info text-[10px]">{po.status}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted uppercase">Vendor</span>
                      <span className="text-xs font-bold">{po.vendor?.name || 'Unknown'}</span>
                    </div>
                    <span className="text-sm font-black text-[var(--color-warning)]">₹{po.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Lower Dashboard: Pending Work & Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Work (Mocked) */}
        <div className="bento-item glass-panel">
          <div className="bento-header with-border bg-[var(--bg-hover)]">
            <div className="flex items-center gap-2">
              <CheckSquare size={18} className="text-[var(--brand-primary)]"/>
              <h3 className="font-black text-[var(--text-title)] m-0">Pending Tasks & Issues</h3>
            </div>
          </div>
          <div className="bento-body flex flex-col gap-3 pb-6">
            {[
              { task: "Approve ultra-tech cement invoice", urgency: "High", date: "Today" },
              { task: "Site inspection for Block B", urgency: "Medium", date: "Tomorrow" },
              { task: "Renew labor safety compliance", urgency: "High", date: "In 3 Days" },
              { task: "Clear debris from South Wing", urgency: "Low", date: "Next Week" }
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-[var(--bg-border-solid)] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${t.urgency === 'High' ? 'bg-[var(--color-danger)]' : t.urgency === 'Medium' ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-success)]'}`} />
                  <span className="text-sm font-bold text-[var(--text-title)]">{t.task}</span>
                </div>
                <span className="text-xs font-bold text-muted bg-[var(--bg-app)] px-2 py-1 rounded">{t.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Site Gallery (Mocked) */}
        <div className="bento-item glass-panel">
          <div className="bento-header with-border bg-[var(--bg-hover)]">
            <div className="flex items-center gap-2">
              <Camera size={18} className="text-[var(--color-success)]"/>
              <h3 className="font-black text-[var(--text-title)] m-0">Site Image Gallery</h3>
            </div>
            {canEdit && <button className="btn btn-sm btn-outline text-xs"><Plus size={12}/> Upload</button>}
          </div>
          <div className="bento-body grid grid-cols-3 gap-3 pb-6">
            {/* Placeholders */}
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="aspect-square bg-[var(--bg-app)] border border-[var(--bg-border-solid)] rounded-lg flex items-center justify-center group cursor-pointer hover:border-[var(--brand-primary)] transition-colors overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--bg-border)] to-[var(--bg-hover)] opacity-50" />
                <Camera size={24} className="text-muted group-hover:text-[var(--brand-primary)] opacity-50 transition-colors z-10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-xl w-full max-w-md p-6 border border-[var(--bg-border)] shadow-xl relative max-h-[90vh] overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-[var(--text-title)] mb-4 shrink-0">Invite Team Member</h3>
            
            <div className="mb-4 shrink-0">
              <input 
                type="text" 
                placeholder="Search by name or email to invite..." 
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value || ""); if (!availableUsers.some(u => u.email === inviteEmail)) setInviteEmail(""); }}
                className="input-base w-full p-2 text-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto min-h-[200px] border border-[var(--bg-border-solid)] rounded-lg p-2 mb-4 bg-[var(--bg-app)]">
              {isLoadingUsers ? (
                <div className="text-center p-4 text-sm text-muted">Loading users...</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {['ADMIN', 'MANAGER', 'SITE_ENGINEER', 'PROCUREMENT', 'ACCOUNTS', 'EMPLOYEE'].map(roleGroup => {
                    const filteredUsers = availableUsers.filter(u => 
                      u?.role === roleGroup && 
                      ((u?.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()) || 
                       (u?.email || "").toLowerCase().includes((searchQuery || "").toLowerCase()))
                    );

                    if (filteredUsers.length === 0) return null;

                    return (
                      <div key={roleGroup} className="flex flex-col gap-1">
                        <div className="text-[10px] font-black text-muted uppercase tracking-wider px-2 py-1 bg-[var(--bg-hover)] rounded">
                          {roleGroup.replace('_', ' ')}
                        </div>
                        {filteredUsers.map(u => (
                          <div 
                            key={u.id} 
                            onClick={() => { setInviteEmail(u.email); setInviteRole(u.role); }}
                            className={`p-2 rounded-md cursor-pointer text-sm flex items-center justify-between border transition-colors ${inviteEmail === u.email ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10' : 'border-transparent hover:bg-[var(--bg-hover)]'}`}
                          >
                            <div className="flex flex-col">
                              <span className="font-bold text-[var(--text-title)]">{u.name || "Unknown"}</span>
                              <span className="text-xs text-muted">{u.email}</span>
                            </div>
                            {inviteEmail === u.email && <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  
                  {availableUsers.length > 0 && availableUsers.filter(u => 
                    (u?.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()) || 
                    (u?.email || "").toLowerCase().includes((searchQuery || "").toLowerCase())
                  ).length === 0 && (
                    <div className="text-center p-4 text-sm text-muted">No users found.</div>
                  )}
                  {availableUsers.length === 0 && (
                    <div className="text-center p-4 text-sm text-muted">No eligible users to invite.</div>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleInvite} className="flex flex-col gap-4 shrink-0 mt-auto">
              {inviteEmail && !availableUsers.some(u => u.email === inviteEmail) && (
                <>
                  <div className="text-xs font-bold text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 p-2 rounded">
                    Inviting external user: {inviteEmail}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted uppercase">Role for this project</label>
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="input-base w-full p-2 mt-1">
                      <option value="MANAGER">Manager</option>
                      <option value="SITE_ENGINEER">Site Engineer</option>
                      <option value="PROCUREMENT">Procurement</option>
                      <option value="ACCOUNTS">Accounts</option>
                      <option value="EMPLOYEE">Employee / Worker</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-end pt-2 border-t border-[var(--bg-border)]">
                <button type="button" onClick={() => { setShowInviteModal(false); setSearchQuery(""); setInviteEmail(""); }} className="btn btn-outline py-2 px-4">Cancel</button>
                <button type="submit" disabled={isInviting || (!inviteEmail && !searchQuery)} onClick={(e) => {
                  if (!inviteEmail && (searchQuery || "").includes('@')) {
                    setInviteEmail(searchQuery);
                  }
                }} className="btn btn-primary py-2 px-4">{isInviting ? "Inviting..." : "Send Invite"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
