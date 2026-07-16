"use client";

import { useSession } from "next-auth/react";
import { format } from "date-fns";
import {
  Clock, CheckCircle2, Sun, AlertTriangle, IndianRupee,
  Calendar, Briefcase, FileText, Activity, ShieldAlert,
  Bell, FileOutput, ShieldCheck, Contact
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Employee";
  const router = useRouter();

  return (
    <div className="animate-fade-in flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      
      {/* 1. HERO SECTION (Greeting & Quick Info) */}
      <section className="glass-panel p-6 md:p-8 rounded-2xl border border-[var(--bg-border-solid)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Good Morning, {userName}</h1>
          <p className="text-sm text-muted mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--brand-primary)] text-white">EMPLOYEE</span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--brand-secondary)] text-white">EMP-1024</span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[var(--color-info)] text-white">Morning Shift (9AM - 5PM)</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--bg-border-solid)] flex-1 md:flex-none">
            <div className="p-2 rounded-lg bg-[var(--color-info)]/20 text-[var(--color-info)]"><Briefcase size={18} /></div>
            <div className="flex flex-col">
              <span className="text-xs text-muted">Current Site</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">Skyline Tower A</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--bg-border-solid)] flex-1 md:flex-none">
            <div className="p-2 rounded-lg bg-[var(--color-warning)]/20 text-[var(--color-warning)]"><Sun size={18} /></div>
            <div className="flex flex-col">
              <span className="text-xs text-muted">Weather</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">28°C, Clear</span>
            </div>
          </div>
        </div>
      </section>

      {/* 11. QUICK ACTIONS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] transition-all hover:-translate-y-1" onClick={() => router.push('/employee/attendance')}>
          <div className="p-3 rounded-xl bg-[var(--color-success)]/10 text-[var(--color-success)]"><Clock size={24} /></div>
          <span className="text-sm font-semibold">Mark Attendance</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] transition-all hover:-translate-y-1" onClick={() => router.push('/employee/leave')}>
          <div className="p-3 rounded-xl bg-[var(--color-warning)]/10 text-[var(--color-warning)]"><Calendar size={24} /></div>
          <span className="text-sm font-semibold">Request Leave</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] transition-all hover:-translate-y-1" onClick={() => router.push('/employee/wages')}>
          <div className="p-3 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"><IndianRupee size={24} /></div>
          <span className="text-sm font-semibold">View Payslip</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] transition-all hover:-translate-y-1" onClick={() => alert('Emergency help requested!')}>
          <div className="p-3 rounded-xl bg-[var(--color-danger)]/10 text-[var(--color-danger)]"><ShieldAlert size={24} /></div>
          <span className="text-sm font-semibold">Emergency Help</span>
        </button>
      </section>

      {/* BENTO GRID FOR EMPLOYEE */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 2. TODAY'S ATTENDANCE */}
        <div className="glass-panel rounded-2xl border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-4 min-h-[220px]">
          <div className="flex justify-between items-start p-5 border-b border-[var(--bg-border-solid)]">
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Today's Attendance</h3>
              <p className="text-xs text-muted">Daily tracking</p>
            </div>
            <div className="px-2 py-1 text-[10px] font-bold rounded bg-[var(--color-success)]/20 text-[var(--color-success)]">PRESENT</div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted font-medium">Clock In</span>
              <span className="font-semibold text-[var(--color-success)]">08:45 AM</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted font-medium">Clock Out</span>
              <span className="font-semibold text-muted">--:-- PM</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-[var(--bg-border-solid)]">
              <span className="font-bold text-[var(--text-primary)]">Working Hours</span>
              <span className="font-bold text-[var(--text-primary)]">4h 15m</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-[var(--color-warning)]">Overtime</span>
              <span className="font-semibold text-[var(--color-warning)]">0h 0m</span>
            </div>
          </div>
        </div>

        {/* 3. TODAY'S WAGE */}
        <div className="glass-panel rounded-2xl border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-4 min-h-[220px]">
          <div className="flex justify-between items-start p-5 border-b border-[var(--bg-border-solid)]">
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">My Earnings</h3>
              <p className="text-xs text-muted">Wage summary</p>
            </div>
            <div className="px-2 py-1 text-[10px] font-bold rounded bg-[var(--color-info)]/20 text-[var(--color-info)]">PROCESSING</div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted font-medium">Today's Wage</span>
              <span className="font-semibold text-[var(--text-primary)]">₹850</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted font-medium">Weekly</span>
              <span className="font-semibold text-[var(--text-primary)]">₹5,100</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-[var(--bg-border-solid)]">
              <span className="font-bold text-[var(--text-primary)]">Monthly Expected</span>
              <span className="font-bold text-[var(--color-success)]">₹23,450</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted font-medium">Due Date</span>
              <span className="font-semibold text-[var(--text-primary)]">5th Aug</span>
            </div>
          </div>
        </div>

        {/* 4. WORK PROGRESS */}
        <div className="glass-panel rounded-2xl border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-4 min-h-[220px]">
          <div className="flex justify-between items-start p-5 border-b border-[var(--bg-border-solid)]">
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Work Progress</h3>
              <p className="text-xs text-muted">Shift completion</p>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--bg-border-solid)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--brand-primary)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="100.48" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--text-primary)]">60%</span>
                <span className="text-[10px] text-muted">Completed</span>
              </div>
            </div>
            <div className="w-full flex justify-between text-xs">
              <span className="text-muted truncate mr-2">Target: Lay Foundation</span>
              <span className="font-semibold text-[var(--color-warning)] whitespace-nowrap">3h left</span>
            </div>
          </div>
        </div>

        {/* 5. ASSIGNED PROJECT */}
        <div className="glass-panel rounded-2xl border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-6 min-h-[220px]">
          <div className="flex justify-between items-start p-5 border-b border-[var(--bg-border-solid)]">
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Assigned Project</h3>
              <p className="text-xs text-muted">Current site details</p>
            </div>
            <div className="px-2 py-1 text-[10px] font-bold rounded bg-[var(--color-success)]/20 text-[var(--color-success)]">ACTIVE</div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center">
            <h4 className="text-lg font-bold text-[var(--text-title)] mb-4">Skyline Tower A</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <span className="block text-xs text-muted mb-1">Location</span>
                <span className="font-semibold text-sm text-[var(--text-primary)]">Andheri East, Mumbai</span>
              </div>
              <div>
                <span className="block text-xs text-muted mb-1">Manager</span>
                <span className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-1"><Contact size={14}/> Rajesh Kumar</span>
              </div>
              <div>
                <span className="block text-xs text-muted mb-1">Phase</span>
                <span className="font-semibold text-sm text-[var(--color-info)]">Foundation</span>
              </div>
              <div>
                <span className="block text-xs text-muted mb-1">Finish Date</span>
                <span className="font-semibold text-sm text-[var(--text-primary)]">Dec 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. TODAY'S TASKS */}
        <div className="glass-panel rounded-2xl border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-6 min-h-[220px]">
          <div className="flex justify-between items-start p-5 border-b border-[var(--bg-border-solid)]">
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Today's Tasks</h3>
              <p className="text-xs text-muted">Your responsibilities</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-4 p-4 border-b border-[var(--bg-border-solid)]">
              <div className="p-2 rounded bg-[var(--color-success)]/10 text-[var(--color-success)]"><CheckCircle2 size={16}/></div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[var(--text-primary)]">Unload Cement Bags</div>
                <div className="text-xs text-muted mt-0.5">09:00 AM - 11:00 AM</div>
              </div>
              <div className="text-[10px] font-bold px-2 py-1 rounded bg-[var(--color-success)]/10 text-[var(--color-success)]">Completed</div>
            </div>
            <div className="flex items-center gap-4 p-4 border-b border-[var(--bg-border-solid)]">
              <div className="p-2 rounded bg-[var(--color-warning)]/10 text-[var(--color-warning)]"><Clock size={16}/></div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[var(--text-primary)]">Lay Foundation Sector B</div>
                <div className="text-xs text-muted mt-0.5">11:30 AM - 04:00 PM</div>
              </div>
              <div className="text-[10px] font-bold px-2 py-1 rounded bg-[var(--color-warning)]/10 text-[var(--color-warning)]">In Progress</div>
            </div>
            <div className="flex items-center gap-4 p-4 opacity-60">
              <div className="p-2 rounded bg-[var(--bg-hover)] text-muted"><Activity size={16}/></div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[var(--text-primary)]">Site Cleanup</div>
                <div className="text-xs text-muted mt-0.5">04:30 PM - 05:00 PM</div>
              </div>
              <div className="text-[10px] font-bold px-2 py-1 rounded bg-[var(--bg-border)] text-muted">Pending</div>
            </div>
          </div>
        </div>

        {/* 10. MY PERFORMANCE */}
        <div className="glass-panel rounded-2xl border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-4 min-h-[220px]">
          <div className="flex justify-between items-start p-5 border-b border-[var(--bg-border-solid)]">
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Performance</h3>
              <p className="text-xs text-muted">Monthly stats</p>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted font-medium">Attendance %</span>
              <span className="font-bold text-[var(--color-success)]">98%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted font-medium">Productivity</span>
              <span className="font-bold text-[var(--color-info)]">Excellent</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted font-medium">Tasks Done</span>
              <span className="font-semibold text-[var(--text-primary)]">45/48</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-[var(--bg-border-solid)]">
              <span className="font-bold text-[var(--text-primary)]">Monthly Rating</span>
              <span className="font-bold text-[var(--color-warning)] text-base">4.8 ★</span>
            </div>
          </div>
        </div>

        {/* 9. LEAVE */}
        <div className="glass-panel rounded-2xl border border-[var(--bg-border-solid)] flex flex-col col-span-1 md:col-span-4 min-h-[220px]">
          <div className="flex justify-between items-start p-5 border-b border-[var(--bg-border-solid)]">
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Leave Balance</h3>
              <p className="text-xs text-muted">Available time off</p>
            </div>
          </div>
          <div className="p-5 flex flex-col gap-3 flex-1 justify-center">
            <div className="flex justify-between items-center bg-[var(--bg-hover)] p-3 rounded-xl border border-[var(--bg-border-solid)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--color-info)]/10 text-[var(--color-info)]"><Calendar size={16}/></div>
                <span className="font-semibold text-sm text-[var(--text-primary)]">Casual Leave</span>
              </div>
              <span className="font-bold text-lg text-[var(--text-primary)]">12</span>
            </div>
            <div className="flex justify-between items-center bg-[var(--bg-hover)] p-3 rounded-xl border border-[var(--bg-border-solid)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--color-danger)]/10 text-[var(--color-danger)]"><Activity size={16}/></div>
                <span className="font-semibold text-sm text-[var(--text-primary)]">Sick Leave</span>
              </div>
              <span className="font-bold text-lg text-[var(--text-primary)]">5</span>
            </div>
            <button className="mt-1 w-full py-2.5 bg-[var(--brand-primary)] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm">
              Apply Leave
            </button>
          </div>
        </div>

        {/* 8. SAFETY & 7. ANNOUNCEMENTS */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6 min-h-[220px]">
          
          <div className="glass-panel rounded-2xl border border-[var(--bg-border-solid)] overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-[var(--bg-border-solid)] bg-[var(--color-danger)]/10 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[var(--color-danger)] flex items-center gap-2">
                <ShieldCheck size={16}/> Safety Score: 100/100
              </h3>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1 justify-center bg-[var(--bg-card)]">
              <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)]">
                <AlertTriangle size={16} className="text-[var(--color-warning)] flex-shrink-0"/>
                <span>Helmet mandatory on site!</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-primary)]">
                <CheckCircle2 size={16} className="text-[var(--color-success)] flex-shrink-0"/>
                <span>PPE Checklist Verified</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-[var(--bg-border-solid)] overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-[var(--bg-border-solid)] flex items-center gap-2 bg-[var(--bg-hover)]">
              <Bell size={16} className="text-[var(--color-info)]"/>
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Announcements</h3>
            </div>
            <div className="p-4 text-sm text-muted bg-[var(--bg-card)] flex-1">
              <p className="mb-2"><span className="font-semibold text-[var(--text-primary)]">Tomorrow:</span> Site inspection by clients. Ensure cleanliness.</p>
              <p className="text-[10px] uppercase font-bold text-muted opacity-80 mt-2">Posted by Admin • 2h ago</p>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}
