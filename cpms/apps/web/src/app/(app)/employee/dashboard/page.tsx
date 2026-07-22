"use client";

import { useSession } from "next-auth/react";
import { format } from "date-fns";
import {
  Clock, CheckCircle2, Sun, AlertTriangle, IndianRupee,
  Calendar, Briefcase, FileText, Activity, ShieldAlert,
  Bell, FileOutput, ShieldCheck, Contact, Users, MapPin, Target,
  ArrowRight, Building2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EmployeeDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Employee";

  return (
    <div className="animate-fade-in flex flex-col w-full max-w-7xl mx-auto md:px-0" style={{ gap: '40px', paddingBottom: '96px', paddingLeft: '16px', paddingRight: '16px' }}>
      
      {/* 1. HERO SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between" style={{ gap: '24px', marginTop: '8px' }}>
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text-title)]">Good Morning, {userName}</h1>
          <p className="text-body text-muted font-medium">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </div>

        <div className="flex flex-wrap items-center" style={{ gap: '12px' }}>
          <div className="flex items-center rounded-full bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm" style={{ gap: '8px', padding: '10px 20px' }}>
            <MapPin size={16} className="text-[var(--brand-primary)]" />
            <span className="text-sm font-bold text-[var(--text-title)]">Skyline Tower A</span>
          </div>
          <div className="flex items-center rounded-full bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm" style={{ gap: '8px', padding: '10px 20px' }}>
            <Sun size={16} className="text-[var(--color-warning)]" />
            <span className="text-sm font-bold text-[var(--text-title)]">28°C Clear</span>
          </div>
          <div className="flex items-center rounded-full bg-[var(--color-info)]/10 text-[var(--color-info)] border border-[var(--color-info)]/30 shadow-sm" style={{ gap: '8px', padding: '10px 20px' }}>
            <Clock size={16} />
            <span className="text-sm font-bold tracking-wide uppercase">Morning Shift</span>
          </div>
        </div>
      </section>

      {/* 2. QUICK ACTIONS */}
      <section className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '24px' }}>
        <Link 
          href="/employee/attendance"
          className="flex flex-col items-center justify-center text-center rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] group bg-tint-attendance hover:shadow-md transition-all hover:-translate-y-1"
          style={{ gap: '12px', padding: '24px' }}
        >
          <div className="rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm" style={{ padding: '14px' }}>
            <Clock size={24} strokeWidth={2.5} />
          </div>
          <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
            <span className="block text-sm md:text-base font-bold truncate text-[var(--text-title)]" style={{ marginBottom: '4px' }}>Mark Attendance</span>
            <span className="hidden md:block text-xs text-muted font-medium">Clock in/out</span>
          </div>
        </Link>
        
        <Link 
          href="/employee/leave"
          className="flex flex-col items-center justify-center text-center rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] group bg-tint-leave hover:shadow-md transition-all hover:-translate-y-1"
          style={{ gap: '12px', padding: '24px' }}
        >
          <div className="rounded-full bg-[var(--color-warning)]/15 text-[var(--color-warning)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-sm" style={{ padding: '14px' }}>
            <Calendar size={24} strokeWidth={2.5} />
          </div>
          <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
            <span className="block text-sm md:text-base font-bold truncate text-[var(--text-title)]" style={{ marginBottom: '4px' }}>Request Leave</span>
            <span className="hidden md:block text-xs text-muted font-medium">View balances</span>
          </div>
        </Link>

        <Link 
          href="/employee/wages"
          className="flex flex-col items-center justify-center text-center rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] group bg-tint-finance hover:shadow-md transition-all hover:-translate-y-1"
          style={{ gap: '12px', padding: '24px' }}
        >
          <div className="rounded-full bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm" style={{ padding: '14px' }}>
            <IndianRupee size={24} strokeWidth={2.5} />
          </div>
          <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
            <span className="block text-sm md:text-base font-bold truncate text-[var(--text-title)]" style={{ marginBottom: '4px' }}>View Payslip</span>
            <span className="hidden md:block text-xs text-muted font-medium">Check salary</span>
          </div>
        </Link>

        <button 
          onClick={() => toast.error('Emergency Help Requested!', { description: 'Site Manager has been alerted.', icon: <ShieldAlert size={20}/> })}
          className="flex flex-col items-center justify-center text-center rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--color-danger)]/30 group bg-tint-emergency hover:bg-[var(--color-danger)]/5 transition-all hover:-translate-y-1"
          style={{ gap: '12px', padding: '24px' }}
        >
          <div className="rounded-full bg-[var(--color-danger)]/15 text-[var(--color-danger)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-sm animate-pulse" style={{ padding: '14px' }}>
            <ShieldAlert size={24} strokeWidth={2.5} />
          </div>
          <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
            <span className="block text-sm md:text-base font-bold text-[var(--color-danger)] truncate" style={{ marginBottom: '4px' }}>Emergency Help</span>
            <span className="hidden md:block text-xs text-[var(--color-danger)]/80 font-medium">Alert manager</span>
          </div>
        </button>
      </section>

      {/* 3. PRIMARY ROW: Attendance | Shift Progress | Today's Tasks */}
      <section className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '32px' }}>

        {/* ATTENDANCE CARD */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-4 overflow-hidden shadow-float-sm hover:shadow-float-md transition-all duration-300 hover:-translate-y-1 bg-[var(--bg-card)]" style={{ minHeight: '420px' }}>
          <div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)] shadow-inner" style={{ padding: '8px' }}>
                <Clock size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">Attendance</h3>
            </div>
            <span className="badge badge-success text-xs font-bold whitespace-nowrap shrink-0 shadow-sm tracking-wide" style={{ padding: '6px 12px' }}>PRESENT</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center" style={{ padding: '32px 24px', gap: '32px' }}>
            <div className="flex justify-between items-end border-b border-[var(--bg-border-solid)]" style={{ paddingBottom: '24px', gap: '16px' }}>
              <div className="flex flex-col min-w-0" style={{ gap: '4px' }}>
                <span className="text-[10px] text-muted uppercase tracking-widest font-black whitespace-nowrap">Clock In</span>
                <span className="text-2xl md:text-3xl font-black text-[var(--text-title)] tracking-tight">08:45<span className="text-sm text-muted ml-1 font-bold">AM</span></span>
              </div>
              <div className="flex flex-col items-end text-right min-w-0" style={{ gap: '4px' }}>
                <span className="text-[10px] text-muted uppercase tracking-widest font-black whitespace-nowrap">Clock Out</span>
                <span className="text-2xl md:text-3xl font-black text-muted tracking-tight">--:--<span className="text-sm opacity-50 ml-1 font-bold">PM</span></span>
              </div>
            </div>

            <div className="flex flex-col" style={{ gap: '16px' }}>
              <div className="flex justify-between items-center rounded-xl bg-[var(--bg-hover)] border border-[var(--bg-border-solid)]" style={{ padding: '20px', gap: '8px' }}>
                <div className="flex items-center min-w-0" style={{ gap: '12px' }}>
                  <Activity size={18} className="text-[var(--brand-primary)] shrink-0" />
                  <span className="text-sm font-bold text-[var(--text-title)] truncate">Working Hours</span>
                </div>
                <span className="text-xl font-black text-[var(--brand-primary)] shrink-0">4h 15m</span>
              </div>

              <div className="flex justify-between items-center" style={{ padding: '0 12px', gap: '8px', marginTop: '4px' }}>
                <span className="text-xs text-muted font-bold truncate tracking-wide">Overtime Logged</span>
                <span className="text-sm font-black text-[var(--color-warning)] shrink-0">0h 0m</span>
              </div>
            </div>
          </div>
        </div>

        {/* WORK PROGRESS CARD */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-4 overflow-hidden shadow-float-sm bg-tint-project hover:shadow-float-md transition-all duration-300 hover:-translate-y-1" style={{ minHeight: '420px' }}>
          <div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-lg bg-[var(--color-info)]/10 text-[var(--color-info)] shadow-inner" style={{ padding: '8px' }}>
                <Target size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">Shift Progress</h3>
            </div>
            <span className="badge badge-info text-xs font-bold whitespace-nowrap shrink-0 shadow-sm tracking-wide" style={{ padding: '6px 12px' }}>ACTIVE</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center" style={{ padding: '32px 24px', gap: '40px' }}>
            <div className="relative w-40 h-40 flex items-center justify-center drop-shadow-xl">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--bg-border-solid)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--brand-primary)" strokeWidth="8" strokeDasharray="263.89" strokeDashoffset="105.55" strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(255,107,53,0.5)]" />
              </svg>
              <div className="flex flex-col items-center justify-center z-10 text-center">
                <span className="text-4xl font-black text-[var(--text-title)] tracking-tighter">60<span className="text-xl text-[var(--brand-primary)]">%</span></span>
                <span className="text-[10px] text-[var(--brand-primary)] uppercase tracking-widest font-black" style={{ marginTop: '4px' }}>Done</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2" style={{ gap: '16px' }}>
              <div className="flex flex-col items-center justify-center text-center rounded-xl bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm min-w-0" style={{ padding: '16px' }}>
                <span className="text-[10px] text-muted uppercase tracking-widest font-black whitespace-nowrap" style={{ marginBottom: '6px' }}>Time Left</span>
                <span className="text-base font-black text-[var(--text-title)] truncate max-w-full tracking-tight">3h 45m</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center rounded-xl bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm min-w-0" style={{ padding: '16px' }}>
                <span className="text-[10px] text-muted uppercase tracking-widest font-black whitespace-nowrap" style={{ marginBottom: '6px' }}>Target</span>
                <span className="text-base font-black text-[var(--text-title)] truncate max-w-full px-1 tracking-tight">Foundation</span>
              </div>
            </div>
          </div>
        </div>

        {/* TODAY'S TASKS CARD */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-4 overflow-hidden shadow-float-sm bg-tint-task hover:shadow-float-md transition-all duration-300 hover:-translate-y-1" style={{ minHeight: '420px' }}>
          <div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)] shadow-inner" style={{ padding: '8px' }}>
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">Today's Tasks</h3>
            </div>
            <Link href="/employee/tasks" className="badge badge-secondary text-xs font-bold shadow-sm hover:bg-[var(--bg-hover)] cursor-pointer transition-colors whitespace-nowrap shrink-0 tracking-wide" style={{ padding: '6px 12px' }}>
              3 LEFT
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center overflow-y-auto" style={{ padding: '32px 24px', gap: '16px' }}>
            
            {/* Task 1 */}
            <div className="flex items-center rounded-xl bg-[var(--bg-card-solid)] hover:bg-[var(--bg-hover)] transition-all group cursor-pointer border border-[var(--bg-border-solid)] opacity-60" style={{ padding: '20px', gap: '16px' }}>
              <div className="shrink-0 text-[var(--color-success)]">
                <CheckCircle2 size={24} fill="currentColor" className="text-white dark:text-[var(--bg-card-solid)]" />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-sm font-bold line-through text-muted truncate">Unload Cement</span>
                <span className="text-[10px] text-muted font-black uppercase tracking-wide flex items-center" style={{ marginTop: '4px', gap: '6px' }}>
                  <Clock size={12} className="shrink-0" /> <span className="truncate">09:00 AM</span>
                </span>
              </div>
            </div>

            {/* Task 2 */}
            <div className="flex items-center rounded-xl bg-[var(--bg-card-solid)] shadow-md transition-all group cursor-pointer border border-[var(--bg-border-solid)] border-l-[4px] border-l-[var(--color-warning)]" style={{ padding: '20px', gap: '16px' }}>
              <div className="shrink-0 text-[var(--color-warning)] animate-pulse">
                <Clock size={24} strokeWidth={2.5} />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-base font-black text-[var(--text-title)] tracking-tight truncate">Lay Foundation B</span>
                <span className="text-[10px] font-black uppercase tracking-wide text-[var(--brand-primary)] flex items-center" style={{ marginTop: '4px', gap: '6px' }}>
                  <Clock size={12} className="shrink-0" /> <span className="truncate">11:30 AM</span>
                </span>
              </div>
            </div>

            {/* Task 3 */}
            <div className="flex items-center rounded-xl bg-[var(--bg-card-solid)] hover:bg-[var(--bg-hover)] transition-all group cursor-pointer border border-[var(--bg-border-solid)]" style={{ padding: '20px', gap: '16px' }}>
              <div className="shrink-0 w-6 h-6 rounded-full border-2 border-[var(--text-muted)] group-hover:border-[var(--brand-primary)] transition-colors" />
              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-base font-black text-[var(--text-title)] truncate">Site Cleanup</span>
                <span className="text-[10px] text-muted font-black uppercase tracking-wide flex items-center" style={{ marginTop: '4px', gap: '6px' }}>
                  <Clock size={12} className="shrink-0" /> <span className="truncate">04:30 PM</span>
                </span>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 4. SECONDARY ROW: Earnings | Assigned Project */}
      <section className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '32px' }}>
        
        {/* EARNINGS CARD */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-6 overflow-hidden shadow-float-sm bg-tint-finance hover:shadow-float-md transition-all duration-300 hover:-translate-y-1" style={{ minHeight: '420px' }}>
          <div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-lg bg-[var(--color-warning)]/10 text-[var(--color-warning)] shadow-inner" style={{ padding: '8px' }}>
                <IndianRupee size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">Earnings Snapshot</h3>
            </div>
            <span className="badge badge-warning text-xs font-bold whitespace-nowrap shrink-0 shadow-sm tracking-wide" style={{ padding: '6px 12px' }}>PROCESSING</span>
          </div>

          <div className="flex-1 flex flex-col justify-center" style={{ padding: '32px 24px' }}>
            <div className="flex flex-col items-center text-center border-b border-[var(--bg-border-solid)]" style={{ paddingBottom: '32px' }}>
              <span className="text-[10px] text-muted uppercase tracking-widest font-black whitespace-nowrap" style={{ marginBottom: '12px' }}>Today's Wage</span>
              <span className="text-5xl font-black leading-none text-[var(--brand-primary)] tracking-tighter drop-shadow-md flex items-center">
                <span className="text-3xl opacity-80 font-bold" style={{ marginRight: '8px' }}>₹</span>850
              </span>
            </div>
            
            <div className="flex flex-col" style={{ gap: '16px', marginTop: '32px' }}>
              <div className="flex justify-between items-center rounded-xl bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm" style={{ padding: '20px', gap: '16px' }}>
                <span className="text-sm text-muted font-bold truncate tracking-wide">Weekly Accrued</span>
                <span className="text-xl font-black text-[var(--text-title)] shrink-0">₹5,100</span>
              </div>
              
              <div className="flex justify-between items-center rounded-xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 shadow-sm relative overflow-hidden" style={{ padding: '20px', gap: '16px' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-success)]/5 to-transparent"></div>
                <span className="text-sm font-bold text-[var(--color-success)] relative z-10 truncate tracking-wide">Monthly Est.</span>
                <span className="text-2xl font-black text-[var(--color-success)] tracking-tight relative z-10 shrink-0">₹23,450</span>
              </div>
              
              <div className="flex justify-between items-center" style={{ padding: '0 12px', gap: '16px', marginTop: '8px' }}>
                <span className="text-xs text-muted font-bold truncate tracking-wide">Next Payout Date</span>
                <span className="text-sm font-black text-[var(--text-title)] shrink-0 uppercase">5th August</span>
              </div>
            </div>
          </div>
        </div>

        {/* ASSIGNED PROJECT CARD */}
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-6 overflow-hidden shadow-float-sm hover:shadow-float-md transition-all duration-300 hover:-translate-y-1" style={{ minHeight: '420px' }}>
          <div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shadow-inner" style={{ padding: '8px' }}>
                <Building2 size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">Assigned Project</h3>
            </div>
            <Link 
              href="/employee/my-project"
              className="text-xs font-black text-[var(--brand-primary)] flex items-center hover:underline bg-[var(--brand-primary)]/5 rounded-full transition-colors hover:bg-[var(--brand-primary)]/10 shrink-0 border border-[var(--brand-primary)]/20"
              style={{ gap: '6px', padding: '6px 12px' }}
            >
              DETAILS <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col justify-center" style={{ padding: '32px 24px' }}>
            <div className="flex items-center px-2" style={{ gap: '24px', marginBottom: '32px' }}>
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] flex items-center justify-center text-white shadow-xl shrink-0">
                <Building2 size={28} />
              </div>
              <div className="flex flex-col min-w-0" style={{ gap: '4px' }}>
                <h2 className="text-3xl font-black text-[var(--text-title)] tracking-tight truncate">Skyline Tower A</h2>
                <p className="text-sm text-muted flex items-center font-bold truncate" style={{ gap: '8px' }}>
                  <MapPin size={16} className="text-[var(--text-secondary)] shrink-0" /> Andheri East, Mumbai
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '16px' }}>
              <div className="flex items-center rounded-xl bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm" style={{ gap: '12px', padding: '16px' }}>
                <div className="rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)] shrink-0 shadow-inner" style={{ padding: '10px' }}>
                  <Contact size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase tracking-widest text-muted font-black whitespace-nowrap" style={{ marginBottom: '4px' }}>Manager</span>
                  <span className="text-sm font-black text-[var(--text-title)] truncate">Rajesh Kumar</span>
                </div>
              </div>
              
              <div className="flex items-center rounded-xl bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm" style={{ gap: '12px', padding: '16px' }}>
                <div className="rounded-full bg-[var(--color-info)]/10 text-[var(--color-info)] shrink-0 shadow-inner" style={{ padding: '10px' }}>
                  <Target size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase tracking-widest text-muted font-black whitespace-nowrap" style={{ marginBottom: '4px' }}>Phase</span>
                  <span className="text-sm font-black text-[var(--color-info)] truncate">Foundation</span>
                </div>
              </div>

              <div className="flex items-center rounded-xl bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm" style={{ gap: '12px', padding: '16px' }}>
                <div className="rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)] shrink-0 shadow-inner" style={{ padding: '10px' }}>
                  <Calendar size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase tracking-widest text-muted font-black whitespace-nowrap" style={{ marginBottom: '4px' }}>Finish Date</span>
                  <span className="text-sm font-black text-[var(--text-title)] truncate">Dec 2026</span>
                </div>
              </div>

              <div className="flex items-center rounded-xl bg-[var(--bg-card-solid)] border border-[var(--bg-border-solid)] shadow-sm" style={{ gap: '12px', padding: '16px' }}>
                <div className="rounded-full bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] shrink-0 shadow-inner" style={{ padding: '10px' }}>
                  <Users size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase tracking-widest text-muted font-black whitespace-nowrap" style={{ marginBottom: '4px' }}>Crew Size</span>
                  <span className="text-sm font-black text-[var(--text-title)] truncate">145 Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
