import { Building2, MapPin, User, Calendar, Users, IndianRupee } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getStatusBadge } from "@cpms/utils";

export default async function MyProjectPage() {
  const session = await auth();
  const assignedProjectId = (session?.user as any)?.assignedProjectId as string | null | undefined;

  const project = assignedProjectId
    ? await prisma.project.findUnique({
        where: { id: assignedProjectId },
        include: {
          manager: { select: { name: true, email: true } },
          _count: { select: { staff: true } },
        },
      })
    : null;

  return (
    <div className="animate-fade-in flex flex-col w-full max-w-7xl mx-auto md:px-0" style={{ gap: '40px', paddingBottom: '96px', paddingLeft: '16px', paddingRight: '16px' }}>

      {/* 1. HERO SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between" style={{ gap: '24px' }}>
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-title)]">My Assigned Project</h1>
          <p className="text-base text-muted font-medium">View details about your current site and manager.</p>
        </div>
      </section>

      {/* 2. CONTENT CONTAINER */}
      <section className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '32px' }}>
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-12 overflow-hidden shadow-float-sm bg-[var(--bg-card)]" style={{ minHeight: '420px' }}>
          <div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-lg bg-[var(--color-info)]/10 text-[var(--color-info)] shadow-inner" style={{ padding: '8px' }}>
                <Building2 size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">Project Details</h3>
            </div>
            {project && <span className={`badge ${getStatusBadge(project.status)}`}>{project.status}</span>}
          </div>

          {!project ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: '32px 24px', gap: '16px' }}>
              <span className="text-muted font-medium text-sm">You are not currently assigned to a project.</span>
              <Link href="/projects/join" className="btn btn-primary btn-sm">Join a Project</Link>
            </div>
          ) : (
            <div className="flex flex-col" style={{ padding: '32px 24px', gap: '32px' }}>
              <div className="flex items-center" style={{ gap: '24px' }}>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] flex items-center justify-center text-white shadow-xl shrink-0">
                  <Building2 size={28} />
                </div>
                <div className="flex flex-col min-w-0" style={{ gap: '4px' }}>
                  <h2 className="text-2xl font-black text-[var(--text-title)] tracking-tight truncate">{project.name}</h2>
                  <p className="text-sm text-muted flex items-center font-bold truncate" style={{ gap: '8px' }}>
                    <MapPin size={16} className="shrink-0" /> {project.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '16px' }}>
                <InfoCard icon={<User size={18} />} label="Manager" value={project.manager?.name ?? "Unassigned"} />
                <InfoCard icon={<Building2 size={18} />} label="Client" value={project.client} />
                <InfoCard icon={<IndianRupee size={18} />} label="Budget" value={formatCurrency(project.budget)} />
                <InfoCard icon={<Calendar size={18} />} label="Start Date" value={formatDate(project.startDate)} />
                <InfoCard icon={<Calendar size={18} />} label="End Date" value={project.endDate ? formatDate(project.endDate) : "Ongoing"} />
                <InfoCard icon={<Users size={18} />} label="Team Size" value={String(project._count.staff)} />
              </div>

              {project.description && (
                <div style={{ padding: "16px 20px", background: "var(--bg-elevated)", borderRadius: 12 }}>
                  <span className="text-[10px] uppercase tracking-widest text-muted font-black" style={{ display: "block", marginBottom: 8 }}>Description</span>
                  <p className="text-sm text-[var(--text-secondary)]">{project.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center rounded-xl bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm" style={{ gap: '12px', padding: '16px' }}>
      <div className="rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)] shrink-0 shadow-inner" style={{ padding: '10px' }}>
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] uppercase tracking-widest text-muted font-black whitespace-nowrap" style={{ marginBottom: '4px' }}>{label}</span>
        <span className="text-sm font-black text-[var(--text-title)] truncate">{value}</span>
      </div>
    </div>
  );
}
