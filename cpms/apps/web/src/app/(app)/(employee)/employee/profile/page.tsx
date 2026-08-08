import { Users, Mail, Shield, Calendar, Building2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, getInitials } from "@cpms/utils";

export default async function ProfilePage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        include: { assignedProject: { select: { name: true } } },
      })
    : null;

  return (
    <div className="animate-fade-in flex flex-col w-full max-w-7xl mx-auto md:px-0" style={{ gap: '40px', paddingBottom: '96px', paddingLeft: '16px', paddingRight: '16px' }}>

      {/* 1. HERO SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between" style={{ gap: '24px' }}>
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-title)]">My Profile</h1>
          <p className="text-base text-muted font-medium">Manage your personal details and settings.</p>
        </div>
      </section>

      {/* 2. CONTENT CONTAINER */}
      <section className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '32px' }}>
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-12 overflow-hidden shadow-float-sm bg-[var(--bg-card)]" style={{ minHeight: '420px' }}>
          <div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shadow-inner" style={{ padding: '8px' }}>
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">Profile Details</h3>
            </div>
          </div>

          {!user ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: '32px 24px', gap: '32px' }}>
              <span className="text-muted font-medium text-sm">Profile information will appear here.</span>
            </div>
          ) : (
            <div className="flex flex-col" style={{ padding: '32px 24px', gap: '32px' }}>
              <div className="flex items-center" style={{ gap: '20px' }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] flex items-center justify-center text-white font-black text-xl shadow-xl shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="flex flex-col min-w-0" style={{ gap: '4px' }}>
                  <h2 className="text-2xl font-black text-[var(--text-title)] tracking-tight truncate">{user.name}</h2>
                  <span className="badge badge-info" style={{ width: "fit-content" }}>{user.role}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '16px' }}>
                <InfoRow icon={<Mail size={18} />} label="Email" value={user.email} />
                <InfoRow icon={<Shield size={18} />} label="Role" value={user.role} />
                <InfoRow icon={<Building2 size={18} />} label="Assigned Project" value={user.assignedProject?.name ?? "None"} />
                <InfoRow icon={<Calendar size={18} />} label="Member Since" value={formatDate(user.createdAt)} />
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
