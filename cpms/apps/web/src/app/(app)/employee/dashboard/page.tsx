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
      
      {/* 1. HERO SECTION (Compressed & Cleaner) */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-h1 tracking-tight">Good Morning, {userName}</h1>
          <p className="text-body text-muted font-medium">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--bg-border)] shadow-sm">
            <MapPin size={16} className="text-[var(--brand-primary)]" />
            <span className="text-label font-semibold">Skyline Tower A</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--bg-border)] shadow-sm">
            <Sun size={16} className="text-[var(--color-warning)]" />
            <span className="text-label font-semibold">28°C Clear</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-info)]/10 text-[var(--color-info)] border border-[var(--color-info)]/20 shadow-sm">
            <Clock size={16} />
            <span className="text-badge">Morning Shift</span>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACTIONS (Action Buttons instead of Info Cards) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <button 
          className="flex flex-col items-center justify-center text-center gap-3 p-6 rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] group bg-tint-attendance"
          onClick={() => router.push('/employee/attendance')}
        >
          <div className="p-4 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] transition-transform duration-300 group-hover:scale-110 shadow-sm">
            <Clock size={28} strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-label font-bold mb-1">Mark Attendance</span>
            <span className="block text-caption text-muted">Clock in/out for the day</span>
          </div>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center text-center gap-3 p-6 rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] group bg-tint-leave"
          onClick={() => router.push('/employee/leave')}
        >
          <div className="p-4 rounded-full bg-[var(--color-warning)]/15 text-[var(--color-warning)] transition-transform duration-300 group-hover:scale-110 shadow-sm">
            <Calendar size={28} strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-label font-bold mb-1">Request Leave</span>
            <span className="block text-caption text-muted">View balances & apply</span>
          </div>
        </button>

        <button 
          className="flex flex-col items-center justify-center text-center gap-3 p-6 rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] group bg-tint-finance"
          onClick={() => router.push('/employee/wages')}
        >
          <div className="p-4 rounded-full bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] transition-transform duration-300 group-hover:scale-110 shadow-sm">
            <IndianRupee size={28} strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-label font-bold mb-1">View Payslip</span>
            <span className="block text-caption text-muted">Check salary details</span>
          </div>
        </button>

        <button 
          className="flex flex-col items-center justify-center text-center gap-3 p-6 rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--color-danger)]/30 group bg-tint-emergency"
          onClick={() => alert('Emergency help requested!')}
        >
          <div className="p-4 rounded-full bg-[var(--color-danger)]/15 text-[var(--color-danger)] transition-transform duration-300 group-hover:scale-110 shadow-sm">
            <ShieldAlert size={28} strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-label font-bold text-[var(--color-danger)] mb-1">Emergency Help</span>
            <span className="block text-caption text-[var(--color-danger)]/80">Alert site manager instantly</span>
          </div>
        </button>
      </section>

      {/* 3. BENTO GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ATTENDANCE CARD */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-4 overflow-hidden shadow-float-sm">
          <div className="flex justify-between items-center px-8 py-6 border-b border-[var(--bg-border-solid)] bg-[var(--bg-card)]/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)]">
                <Clock size={20} />
              </div>
              <h3 className="text-h3 font-bold">Attendance</h3>
            </div>
            <span className="badge badge-success px-3 py-1.5 text-xs">Present</span>
          </div>
          
          <div className="p-8 flex-1 flex flex-col gap-6">
            <div className="flex justify-between items-end pb-4 border-b border-[var(--bg-border-solid)]">
              <div className="flex flex-col gap-1">
                <span className="text-caption text-muted uppercase tracking-wider font-semibold">Clock In</span>
                <span className="text-h4 font-bold text-[var(--text-title)]">08:45 AM</span>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <span className="text-caption text-muted uppercase tracking-wider font-semibold">Clock Out</span>
                <span className="text-h4 font-bold text-muted">--:-- PM</span>
              </div>
            </div>

            <div className="flex flex-col gap-5 mt-2">
              <div className="flex justify-between items-center p-4 rounded-[var(--radius-lg)] bg-[var(--bg-hover)] border border-[var(--bg-border-solid)]">
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-[var(--brand-primary)]" />
                  <span className="text-label font-semibold">Working Hours</span>
                </div>
                <span className="text-h4 font-bold text-[var(--text-title)]">4h 15m</span>
              </div>

              <div className="flex justify-between items-center px-2">
                <span className="text-label text-muted font-medium">Overtime Logged</span>
                <span className="text-label font-bold text-[var(--color-warning)]">0h 0m</span>
              </div>
            </div>
          </div>
        </div>

        {/* WORK PROGRESS CARD */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-4 overflow-hidden shadow-float-sm relative bg-tint-project">
          <div className="flex justify-between items-center px-8 py-6 border-b border-[var(--bg-border-solid)] bg-[var(--bg-card)]/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--color-info)]/10 text-[var(--color-info)]">
                <Target size={20} />
              </div>
              <h3 className="text-h3 font-bold">Shift Progress</h3>
            </div>
            <span className="badge badge-info px-3 py-1.5 text-xs">Active</span>
          </div>

          <div className="p-8 flex-1 flex flex-col items-center justify-center gap-8">
            {/* Enlarged Chart */}
            <div className="relative w-48 h-48 flex items-center justify-center drop-shadow-xl">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--bg-border-solid)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--brand-primary)" strokeWidth="8" strokeDasharray="263.89" strokeDashoffset="105.55" strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(255,107,53,0.5)]" />
              </svg>
              <div className="flex flex-col items-center justify-center z-10 text-center">
                <span className="text-5xl font-black text-[var(--text-title)] tracking-tighter">60<span className="text-2xl text-[var(--brand-primary)]">%</span></span>
                <span className="text-xs text-muted mt-1 uppercase tracking-widest font-bold">Completed</span>
              </div>
            </div>

            {/* Labels grouped */}
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center text-center p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm">
                <span className="text-xs text-muted mb-1.5 uppercase tracking-widest font-bold">Time Left</span>
                <span className="text-label font-bold text-[var(--text-title)]">3h 45m</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm">
                <span className="text-xs text-muted mb-1.5 uppercase tracking-widest font-bold">Target</span>
                <span className="text-label font-bold text-[var(--text-title)] truncate w-full">Foundation</span>
              </div>
            </div>
          </div>
        </div>

        {/* EARNINGS CARD */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-4 overflow-hidden shadow-float-sm bg-tint-finance">
          <div className="flex justify-between items-center px-8 py-6 border-b border-[var(--bg-border-solid)] bg-[var(--bg-card)]/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--color-warning)]/10 text-[var(--color-warning)]">
                <IndianRupee size={20} />
              </div>
              <h3 className="text-h3 font-bold">Earnings</h3>
            </div>
            <span className="badge badge-warning px-3 py-1.5 text-xs">Processing</span>
          </div>

          <div className="p-8 flex-1 flex flex-col justify-between">
            <div className="flex flex-col items-center text-center pb-8 border-b border-[var(--bg-border-solid)]">
              <span className="text-xs text-muted mb-3 uppercase tracking-widest font-bold">Today's Wage</span>
              <span className="text-[56px] font-black leading-none text-[var(--brand-primary)] tracking-tighter drop-shadow-sm">
                <span className="text-3xl opacity-80 mr-1">₹</span>850
              </span>
            </div>
            
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex justify-between items-center p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm">
                <span className="text-label text-muted font-semibold">Weekly Accrued</span>
                <span className="text-h4 font-bold text-[var(--text-title)]">₹5,100</span>
              </div>
              
              <div className="flex justify-between items-center p-4 rounded-[var(--radius-lg)] bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-success)]/5 to-transparent"></div>
                <span className="text-label font-bold text-[var(--color-success)] relative z-10">Monthly Est.</span>
                <span className="text-h3 font-black text-[var(--color-success)] tracking-tight relative z-10">₹23,450</span>
              </div>
              
              <div className="flex justify-between items-center px-2 mt-2">
                <span className="text-caption text-muted font-medium">Next Payout Date</span>
                <span className="text-caption font-bold text-[var(--text-title)]">5th August</span>
              </div>
            </div>
          </div>
        </div>

        {/* ASSIGNED PROJECT CARD */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-6 overflow-hidden shadow-float-sm">
          <div className="flex justify-between items-center px-8 py-6 border-b border-[var(--bg-border-solid)] bg-[var(--bg-card)]/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                <Building2 size={20} />
              </div>
              <h3 className="text-h3 font-bold">Assigned Project</h3>
            </div>
            <button className="text-label font-semibold text-[var(--brand-primary)] flex items-center gap-2 hover:underline bg-[var(--brand-primary)]/5 px-4 py-2 rounded-full transition-colors hover:bg-[var(--brand-primary)]/10">
              View Details <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="p-8 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] flex items-center justify-center text-white shadow-lg shrink-0">
                <Building2 size={32} />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-h2 font-black text-[var(--text-title)] tracking-tight">Skyline Tower A</h2>
                <p className="text-body text-muted flex items-center gap-2 font-medium">
                  <MapPin size={16} className="text-[var(--text-secondary)]" /> Andheri East, Mumbai
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm">
                <div className="p-2.5 rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                  <Contact size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-muted font-bold mb-0.5">Manager</span>
                  <span className="text-label font-bold text-[var(--text-title)]">Rajesh Kumar</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm">
                <div className="p-2.5 rounded-full bg-[var(--color-info)]/10 text-[var(--color-info)]">
                  <Target size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-muted font-bold mb-0.5">Current Phase</span>
                  <span className="text-label font-bold text-[var(--color-info)]">Foundation</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm">
                <div className="p-2.5 rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                  <Calendar size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-muted font-bold mb-0.5">Finish Date</span>
                  <span className="text-label font-bold text-[var(--text-title)]">Dec 2026</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm">
                <div className="p-2.5 rounded-full bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
                  <Users size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-muted font-bold mb-0.5">Crew Size</span>
                  <span className="text-label font-bold text-[var(--text-title)]">145 Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TODAY'S TASKS CARD */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-6 overflow-hidden shadow-float-sm bg-tint-task">
          <div className="flex justify-between items-center px-8 py-6 border-b border-[var(--bg-border-solid)] bg-[var(--bg-card)]/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)]">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-h3 font-bold">Today's Tasks</h3>
            </div>
            <span className="badge badge-secondary px-3 py-1.5 text-xs shadow-sm">3 Remaining</span>
          </div>

          <div className="flex-1 flex flex-col p-8 gap-4">
            
            {/* Task 1: Done */}
            <div className="flex items-center gap-5 p-5 rounded-[var(--radius-lg)] bg-[var(--bg-card-solid)] hover:bg-[var(--bg-hover)] transition-all group cursor-pointer border border-[var(--bg-border-solid)] opacity-60 hover:opacity-100">
              <div className="shrink-0 text-[var(--color-success)]">
                <CheckCircle2 size={24} fill="currentColor" className="text-white dark:text-[var(--bg-card-solid)]" />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-label font-bold line-through text-muted text-base">Unload Cement Bags</span>
                <span className="text-caption text-muted font-semibold mt-0.5 flex items-center gap-1.5">
                  <Clock size={12} /> 09:00 AM - 11:00 AM
                </span>
              </div>
              <span className="badge badge-success shrink-0">Done</span>
            </div>

            {/* Task 2: In Progress */}
            <div className="flex items-center gap-5 p-5 rounded-[var(--radius-lg)] bg-[var(--bg-card-solid)] shadow-md transition-all group cursor-pointer border border-[var(--bg-border-solid)] border-l-4 border-l-[var(--color-warning)] hover:translate-y-[-2px]">
              <div className="shrink-0 text-[var(--color-warning)] animate-pulse">
                <Clock size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-label font-black text-[var(--text-title)] text-base tracking-tight">Lay Foundation Sector B</span>
                <span className="text-caption font-bold text-[var(--brand-primary)] mt-0.5 flex items-center gap-1.5">
                  <Clock size={12} /> 11:30 AM - 04:00 PM
                </span>
              </div>
              <span className="badge badge-warning shrink-0">In Progress</span>
            </div>

            {/* Task 3: Pending */}
            <div className="flex items-center gap-5 p-5 rounded-[var(--radius-lg)] bg-[var(--bg-card-solid)] hover:bg-[var(--bg-hover)] hover:shadow-md transition-all group cursor-pointer border border-[var(--bg-border-solid)]">
              <div className="shrink-0 w-6 h-6 rounded-full border-2 border-[var(--text-muted)] group-hover:border-[var(--brand-primary)] transition-colors" />
              <div className="flex-1 flex flex-col">
                <span className="text-label font-bold text-[var(--text-title)] text-base">Site Cleanup</span>
                <span className="text-caption text-muted font-semibold mt-0.5 flex items-center gap-1.5">
                  <Clock size={12} /> 04:30 PM - 05:00 PM
                </span>
              </div>
              <span className="badge badge-secondary shrink-0 group-hover:bg-[var(--bg-card)]">Pending</span>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
