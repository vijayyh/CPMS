"use client";

import { useSession } from "next-auth/react";
import { format } from "date-fns";
import {
  Clock, CheckCircle2, Sun, AlertTriangle, IndianRupee,
  Calendar, Briefcase, FileText, Activity, ShieldAlert,
  Bell, FileOutput, ShieldCheck, Contact, Users, MapPin, Target,
  ArrowRight, Building2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Employee";
  const router = useRouter();

  return (
    <div className="animate-fade-in flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="glass-panel p-6 md:p-8 rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] relative overflow-hidden flex flex-col gap-6">
        <div className="flex flex-col gap-1 relative z-10">
          <h1 className="text-h1">Good Morning, {userName}</h1>
          <p className="text-body font-medium text-muted">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 relative z-10 mt-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
            <Users size={14} /><span className="text-badge">Employee</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] border border-[var(--brand-secondary)]/20">
            <Contact size={14} /><span className="text-badge">EMP-1024</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-info)]/10 text-[var(--color-info)] border border-[var(--color-info)]/20">
            <Clock size={14} /><span className="text-badge">Morning Shift</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--bg-border-solid)]">
            <MapPin size={14} className="text-[var(--color-success)]" /><span className="text-badge">Skyline Tower A</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--bg-border-solid)]">
            <Sun size={14} className="text-[var(--color-warning)]" /><span className="text-badge">28°C Clear</span>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACTIONS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <button className="flex flex-col items-start gap-4 p-5 md:p-6 rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] text-left group" onClick={() => router.push('/employee/attendance')}>
          <div className="p-3 rounded-xl bg-[var(--color-success)]/10 text-[var(--color-success)] transition-transform group-hover:scale-110"><Clock size={28} /></div>
          <div>
            <span className="block text-label font-bold mb-1">Mark Attendance</span>
            <span className="block text-caption text-muted">Clock in/out</span>
          </div>
        </button>
        <button className="flex flex-col items-start gap-4 p-5 md:p-6 rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] text-left group" onClick={() => router.push('/employee/leave')}>
          <div className="p-3 rounded-xl bg-[var(--color-warning)]/10 text-[var(--color-warning)] transition-transform group-hover:scale-110"><Calendar size={28} /></div>
          <div>
            <span className="block text-label font-bold mb-1">Request Leave</span>
            <span className="block text-caption text-muted">View balance</span>
          </div>
        </button>
        <button className="flex flex-col items-start gap-4 p-5 md:p-6 rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] text-left group" onClick={() => router.push('/employee/wages')}>
          <div className="p-3 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] transition-transform group-hover:scale-110"><IndianRupee size={28} /></div>
          <div>
            <span className="block text-label font-bold mb-1">View Payslip</span>
            <span className="block text-caption text-muted">Salary details</span>
          </div>
        </button>
        <button className="flex flex-col items-start gap-4 p-5 md:p-6 rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--color-danger)]/30 text-left group" onClick={() => alert('Emergency help requested!')}>
          <div className="p-3 rounded-xl bg-[var(--color-danger)]/10 text-[var(--color-danger)] transition-transform group-hover:scale-110"><ShieldAlert size={28} /></div>
          <div>
            <span className="block text-label font-bold text-[var(--color-danger)] mb-1">Emergency Help</span>
            <span className="block text-caption text-muted">Alert site manager</span>
          </div>
        </button>
      </section>

      {/* 3. BENTO GRID */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* ATTENDANCE */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-4 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-[var(--bg-border-solid)] bg-[var(--bg-card)]/50">
            <h3 className="text-h3">Attendance</h3>
            <span className="badge badge-success">Present</span>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-4 border-b border-[var(--bg-border-solid)] border-dashed">
              <span className="text-body font-medium">Clock In</span>
              <span className="text-body font-bold text-[var(--color-success)]">08:45 AM</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-[var(--bg-border-solid)] border-dashed">
              <span className="text-body font-medium">Clock Out</span>
              <span className="text-body font-bold text-muted">--:-- PM</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-[var(--bg-border-solid)] border-dashed">
              <span className="text-body font-medium">Working Hours</span>
              <span className="text-body font-bold text-[var(--text-title)]">4h 15m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body font-medium">Overtime</span>
              <span className="text-body font-bold text-[var(--color-warning)]">0h 0m</span>
            </div>
          </div>
        </div>

        {/* WORK PROGRESS (REDESIGNED) */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-4 overflow-hidden relative">
          <div className="flex justify-between items-center p-6 border-b border-[var(--bg-border-solid)] bg-[var(--bg-card)]/50">
            <h3 className="text-h3">Shift Progress</h3>
            <span className="badge badge-info">Active</span>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center gap-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--bg-border-solid)" strokeWidth="6" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--brand-primary)" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset="100.48" strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-[var(--text-title)]">60<span className="text-xl">%</span></span>
                <span className="text-caption text-muted mt-1 uppercase tracking-wide">Completed</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col items-center p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--bg-border-solid)]">
                <span className="text-caption text-muted mb-1">Hours Left</span>
                <span className="text-label font-bold text-[var(--color-warning)]">3h 45m</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-lg bg-[var(--bg-hover)] border border-[var(--bg-border-solid)]">
                <span className="text-caption text-muted mb-1">Target</span>
                <span className="text-label font-bold text-[var(--text-title)] text-center line-clamp-1 w-full px-1">Foundation</span>
              </div>
            </div>
          </div>
        </div>

        {/* SALARY / EARNINGS */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-4 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-[var(--bg-border-solid)] bg-[var(--bg-card)]/50">
            <h3 className="text-h3">Earnings</h3>
            <span className="badge badge-warning">Processing</span>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="flex flex-col items-center text-center pb-6 border-b border-[var(--bg-border-solid)]">
              <span className="text-caption text-muted mb-2 uppercase tracking-wide">Today's Wage</span>
              <span className="text-[40px] font-black leading-none text-[var(--brand-primary)]">₹850</span>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-body font-medium">Weekly Accrued</span>
                <span className="text-label font-bold text-[var(--text-title)]">₹5,100</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-[var(--color-success)]/10 rounded-lg border border-[var(--color-success)]/20">
                <span className="text-body font-bold text-[var(--color-success)]">Monthly Est.</span>
                <span className="text-h4 text-[var(--color-success)]">₹23,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-caption text-muted">Next Payout</span>
                <span className="text-caption font-medium text-[var(--text-title)]">5th August</span>
              </div>
            </div>
          </div>
        </div>

        {/* ASSIGNED PROJECT */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-6 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-[var(--bg-border-solid)] bg-[var(--bg-card)]/50">
            <h3 className="text-h3">Assigned Project</h3>
            <button className="text-caption font-semibold text-[var(--brand-primary)] flex items-center gap-1 hover:underline">
              View Details <ArrowRight size={14}/>
            </button>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] flex items-center justify-center text-white shadow-lg">
                <Building2 size={24} />
              </div>
              <div>
                <h4 className="text-h4 mb-1">Skyline Tower A</h4>
                <p className="text-caption text-muted flex items-center gap-1"><MapPin size={12}/> Andheri East, Mumbai</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <div className="flex flex-col gap-2">
                <span className="text-caption uppercase tracking-wider text-muted font-semibold flex items-center gap-2"><Contact size={14}/> Manager</span>
                <span className="text-label font-bold text-[var(--text-title)]">Rajesh Kumar</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-caption uppercase tracking-wider text-muted font-semibold flex items-center gap-2"><Target size={14}/> Current Phase</span>
                <span className="badge badge-info self-start mt-1">Foundation</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-caption uppercase tracking-wider text-muted font-semibold flex items-center gap-2"><Calendar size={14}/> Finish Date</span>
                <span className="text-label font-bold text-[var(--text-title)]">Dec 2026</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-caption uppercase tracking-wider text-muted font-semibold flex items-center gap-2"><Users size={14}/> Crew Size</span>
                <span className="text-label font-bold text-[var(--text-title)]">145 Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* TODAY'S TASKS (REDESIGNED) */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-6 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-[var(--bg-border-solid)] bg-[var(--bg-card)]/50">
            <h3 className="text-h3">Today's Tasks</h3>
            <span className="badge badge-secondary">3 Remaining</span>
          </div>
          <div className="flex-1 flex flex-col p-2">
            
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-[var(--bg-hover)] transition-colors group cursor-pointer border-b border-[var(--bg-border-solid)] last:border-0">
              <div className="mt-1 p-2 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]"><CheckCircle2 size={20}/></div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <span className="text-label font-bold line-through opacity-70">Unload Cement Bags</span>
                  <span className="badge badge-success scale-90 origin-right">Done</span>
                </div>
                <span className="text-caption text-muted">09:00 AM - 11:00 AM</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-[var(--bg-hover)] transition-colors group cursor-pointer border-b border-[var(--bg-border-solid)] last:border-0 border-l-2 border-l-[var(--color-warning)]">
              <div className="mt-1 p-2 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)]"><Clock size={20}/></div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <span className="text-label font-bold text-[var(--text-title)]">Lay Foundation Sector B</span>
                  <span className="badge badge-warning scale-90 origin-right">In Progress</span>
                </div>
                <span className="text-caption font-semibold text-[var(--brand-primary)]">11:30 AM - 04:00 PM</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-[var(--bg-hover)] transition-colors group cursor-pointer border-b border-[var(--bg-border-solid)] last:border-0">
              <div className="mt-1 p-2 rounded-full border-2 border-[var(--text-muted)] text-[var(--text-muted)] flex items-center justify-center"><div className="w-5 h-5"/></div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <span className="text-label font-bold text-[var(--text-title)]">Site Cleanup</span>
                  <span className="badge text-muted border border-dashed border-[var(--text-muted)] scale-90 origin-right bg-transparent">Pending</span>
                </div>
                <span className="text-caption text-muted">04:30 PM - 05:00 PM</span>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
