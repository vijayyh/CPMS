"use client";
import { useState, useEffect } from "react";
import { Building2, Search, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function JoinProjectPage() {
  const [projectCode, setProjectCode] = useState("");
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectCode || projectCode.length < 5) {
      setProjectDetails(null);
      setError("");
      return;
    }
    const timeoutId = setTimeout(async () => {
      setIsLookingUp(true);
      setError("");
      try {
        const res = await fetch(`/api/projects/lookup?code=${projectCode}`);
        if (res.ok) {
          const data = await res.json();
          setProjectDetails(data);
        } else {
          setProjectDetails(null);
          setError("Project not found. Please check the code and try again.");
        }
      } catch (err) {
        setProjectDetails(null);
        setError("Error looking up project");
      } finally {
        setIsLookingUp(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [projectCode]);

  const handleJoin = async () => {
    if (!projectDetails) return;
    setIsJoining(true);
    try {
      const res = await fetch("/api/projects/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: projectCode })
      });
      
      if (res.ok) {
        toast.success(`Successfully joined ${projectDetails.name}!`);
        window.location.href = "/"; // reload to default dashboard which will now point to this project
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to join project.");
      }
    } catch (e) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-title)]">Join a Project</h1>
        <p className="text-[var(--text-secondary)] mt-2">Enter the Project ID provided by your administrator to join the workspace.</p>
      </div>

      <div className="glass-panel p-6 mb-6">
        <label className="text-sm font-semibold text-[var(--text-title)] mb-2 block">Project ID</label>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            className="w-full bg-[var(--bg-card)] border border-[var(--bg-border)] rounded-full pl-12 pr-12 py-3 text-[var(--text-title)] outline-none focus:border-[var(--brand-primary)] transition-colors"
            placeholder="e.g. PROJ-001"
            value={projectCode}
            onChange={(e) => setProjectCode(e.target.value)}
          />
          {isLookingUp && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--brand-primary)] spin" />}
        </div>
        {error && <p className="text-[var(--color-danger)] text-sm mt-2 ml-4 font-medium">{error}</p>}
      </div>

      {projectDetails && (
        <div className="glass-panel p-6 border border-[var(--brand-primary)]" style={{ background: 'rgba(255, 107, 53, 0.05)' }}>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary)] flex items-center justify-center text-white shrink-0 shadow-lg">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-title)]">{projectDetails.name}</h2>
              <p className="text-[var(--text-secondary)]">{projectDetails.location}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--bg-border)]">
              <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-1">Project Code</div>
              <div className="text-[var(--text-title)] font-medium">{projectDetails.code}</div>
            </div>
            <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--bg-border)]">
              <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-1">Administrator</div>
              <div className="text-[var(--text-title)] font-medium">{projectDetails.manager?.name || "Unassigned"}</div>
            </div>
          </div>

          <button 
            onClick={handleJoin} 
            disabled={isJoining}
            className="w-full bg-[var(--brand-primary)] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isJoining ? (
              <><Loader2 size={18} className="spin" /> Joining...</>
            ) : (
              <>Join Project Workspace <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
