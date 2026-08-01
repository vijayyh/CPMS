import { Users } from "lucide-react";

export default function ProfilePage() {
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
          
          <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: '32px 24px', gap: '32px' }}>
            <span className="text-muted font-medium text-sm">Profile information will appear here.</span>
          </div>
        </div>
      </section>

    </div>
  );
}
