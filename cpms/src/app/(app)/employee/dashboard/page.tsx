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
    <div className="dashboard-container animate-fade-in employee-dashboard">
      
      {/* 1. HERO SECTION (Greeting & Quick Info) */}
      <section className="hero-section glass-panel">
        <div className="hero-content">
          <div className="hero-greeting">
            <h1>Good Morning, {userName}</h1>
            <p className="hero-date">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
            <div className="emp-badges mt-2">
              <span className="badge-primary">EMPLOYEE</span>
              <span className="badge-secondary">EMP-1024</span>
              <span className="badge-info">Morning Shift (9AM - 5PM)</span>
            </div>
          </div>
          <div className="hero-widgets">
            <div className="hero-widget">
              <div className="widget-icon bg-info"><Briefcase size={18} /></div>
              <div className="widget-info">
                <span className="widget-label">Current Site</span>
                <span className="widget-value">Skyline Tower A</span>
              </div>
            </div>
            <div className="hero-widget">
              <div className="widget-icon bg-warning"><Sun size={18} /></div>
              <div className="widget-info">
                <span className="widget-label">Weather</span>
                <span className="widget-value">28°C, Clear</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. QUICK ACTIONS */}
      <section className="quick-actions-grid">
        <button className="quick-action-btn glass-panel glass-panel-hoverable" onClick={() => router.push('/employee/attendance')}>
          <div className="qa-icon" style={{ color: 'var(--color-success)' }}><Clock size={20} /></div>
          <span>Mark Attendance</span>
        </button>
        <button className="quick-action-btn glass-panel glass-panel-hoverable" onClick={() => router.push('/employee/leave')}>
          <div className="qa-icon" style={{ color: 'var(--color-warning)' }}><Calendar size={20} /></div>
          <span>Request Leave</span>
        </button>
        <button className="quick-action-btn glass-panel glass-panel-hoverable" onClick={() => router.push('/employee/wages')}>
          <div className="qa-icon" style={{ color: 'var(--brand-primary)' }}><IndianRupee size={20} /></div>
          <span>View Payslip</span>
        </button>
        <button className="quick-action-btn glass-panel glass-panel-hoverable" onClick={() => alert('Emergency help requested!')}>
          <div className="qa-icon" style={{ color: 'var(--color-danger)' }}><ShieldAlert size={20} /></div>
          <span>Emergency Help</span>
        </button>
      </section>

      {/* BENTO GRID FOR EMPLOYEE */}
      <section className="bento-grid employee-bento">
        
        {/* 2. TODAY'S ATTENDANCE */}
        <div className="bento-item glass-panel col-span-4">
          <div className="bento-header with-border">
            <div className="header-titles">
              <h3>Today's Attendance</h3>
              <p>Daily tracking</p>
            </div>
            <div className="bento-badge badge-success">PRESENT</div>
          </div>
          <div className="bento-body employee-stats-body">
            <div className="stat-row">
              <span className="stat-label">Clock In</span>
              <span className="stat-value text-success">08:45 AM</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Clock Out</span>
              <span className="stat-value text-muted">--:-- PM</span>
            </div>
            <div className="stat-row mt-2 border-t pt-2 border-[var(--bg-border-solid)]">
              <span className="stat-label font-bold">Working Hours</span>
              <span className="stat-value font-bold">4h 15m</span>
            </div>
            <div className="stat-row">
              <span className="stat-label text-warning">Overtime</span>
              <span className="stat-value text-warning">0h 0m</span>
            </div>
          </div>
        </div>

        {/* 3. TODAY'S WAGE */}
        <div className="bento-item glass-panel col-span-4">
          <div className="bento-header with-border">
            <div className="header-titles">
              <h3>My Earnings</h3>
              <p>Wage summary</p>
            </div>
            <div className="bento-badge badge-info">PROCESSING</div>
          </div>
          <div className="bento-body employee-stats-body">
            <div className="stat-row">
              <span className="stat-label">Today's Wage</span>
              <span className="stat-value">₹850</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Weekly</span>
              <span className="stat-value">₹5,100</span>
            </div>
            <div className="stat-row mt-2 border-t pt-2 border-[var(--bg-border-solid)]">
              <span className="stat-label font-bold">Monthly Expected</span>
              <span className="stat-value font-bold text-success">₹23,450</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Due Date</span>
              <span className="stat-value">5th Aug</span>
            </div>
          </div>
        </div>

        {/* 4. WORK PROGRESS */}
        <div className="bento-item glass-panel col-span-4">
          <div className="bento-header with-border">
            <div className="header-titles">
              <h3>Work Progress</h3>
              <p>Shift completion</p>
            </div>
          </div>
          <div className="bento-body flex flex-col items-center justify-center p-6">
            <div className="progress-ring-container relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--bg-border-solid)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--brand-primary)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="100.48" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">60%</span>
                <span className="text-xs text-muted">Completed</span>
              </div>
            </div>
            <div className="text-center w-full">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted">Target: Lay Foundation</span>
                <span className="font-semibold text-warning">3h left</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. ASSIGNED PROJECT */}
        <div className="bento-item glass-panel col-span-6">
          <div className="bento-header with-border">
            <div className="header-titles">
              <h3>Assigned Project</h3>
              <p>Current site details</p>
            </div>
            <div className="bento-badge badge-success">ACTIVE</div>
          </div>
          <div className="bento-body employee-stats-body p-5">
            <h4 className="text-lg font-bold text-[var(--text-title)] mb-4">Skyline Tower A</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-muted mb-1">Location</span>
                <span className="font-semibold text-sm">Andheri East, Mumbai</span>
              </div>
              <div>
                <span className="block text-xs text-muted mb-1">Manager</span>
                <span className="font-semibold text-sm flex items-center gap-1"><Contact size={14}/> Rajesh Kumar</span>
              </div>
              <div>
                <span className="block text-xs text-muted mb-1">Phase</span>
                <span className="font-semibold text-sm text-info">Foundation</span>
              </div>
              <div>
                <span className="block text-xs text-muted mb-1">Finish Date</span>
                <span className="font-semibold text-sm">Dec 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. TODAY'S TASKS */}
        <div className="bento-item glass-panel col-span-6">
          <div className="bento-header with-border">
            <div className="header-titles">
              <h3>Today's Tasks</h3>
              <p>Your responsibilities</p>
            </div>
          </div>
          <div className="bento-body list-body p-0">
            <div className="activity-row">
              <div className="act-icon-wrap" style={{ background: 'var(--color-success)15', color: 'var(--color-success)' }}><CheckCircle2 size={16}/></div>
              <div className="act-content">
                <div className="act-title">Unload Cement Bags</div>
                <div className="act-meta">09:00 AM - 11:00 AM</div>
              </div>
              <div className="act-status text-success bg-[var(--color-success)15]">Completed</div>
            </div>
            <div className="activity-row">
              <div className="act-icon-wrap" style={{ background: 'var(--color-warning)15', color: 'var(--color-warning)' }}><Clock size={16}/></div>
              <div className="act-content">
                <div className="act-title">Lay Foundation Sector B</div>
                <div className="act-meta">11:30 AM - 04:00 PM</div>
              </div>
              <div className="act-status text-warning bg-[var(--color-warning)15]">In Progress</div>
            </div>
            <div className="activity-row opacity-60">
              <div className="act-icon-wrap bg-[var(--bg-hover)]"><Activity size={16}/></div>
              <div className="act-content">
                <div className="act-title">Site Cleanup</div>
                <div className="act-meta">04:30 PM - 05:00 PM</div>
              </div>
              <div className="act-status bg-[var(--bg-border)]">Pending</div>
            </div>
          </div>
        </div>

        {/* 10. MY PERFORMANCE */}
        <div className="bento-item glass-panel col-span-4">
          <div className="bento-header with-border">
            <div className="header-titles">
              <h3>Performance</h3>
              <p>Monthly stats</p>
            </div>
          </div>
          <div className="bento-body employee-stats-body p-5">
            <div className="stat-row">
              <span className="stat-label">Attendance %</span>
              <span className="stat-value text-success font-bold">98%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Productivity</span>
              <span className="stat-value text-info font-bold">Excellent</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Tasks Done</span>
              <span className="stat-value">45/48</span>
            </div>
            <div className="stat-row mt-2 pt-2 border-t border-[var(--bg-border-solid)]">
              <span className="stat-label font-bold">Monthly Rating</span>
              <span className="stat-value text-warning text-lg">4.8 ★</span>
            </div>
          </div>
        </div>

        {/* 9. LEAVE */}
        <div className="bento-item glass-panel col-span-4">
          <div className="bento-header with-border">
            <div className="header-titles">
              <h3>Leave Balance</h3>
              <p>Available time off</p>
            </div>
          </div>
          <div className="bento-body flex flex-col p-5 gap-3">
            <div className="flex justify-between items-center bg-[var(--bg-hover)] p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-info bg-opacity-20 text-info"><Calendar size={16}/></div>
                <span className="font-semibold text-sm">Casual Leave</span>
              </div>
              <span className="font-bold text-lg">12</span>
            </div>
            <div className="flex justify-between items-center bg-[var(--bg-hover)] p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-danger bg-opacity-20 text-danger"><Activity size={16}/></div>
                <span className="font-semibold text-sm">Sick Leave</span>
              </div>
              <span className="font-bold text-lg">5</span>
            </div>
            <button className="mt-2 w-full py-2 bg-[var(--brand-primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Apply Leave
            </button>
          </div>
        </div>

        {/* 8. SAFETY & 7. ANNOUNCEMENTS */}
        <div className="bento-item glass-panel col-span-4 flex flex-col gap-4 bg-transparent border-none shadow-none">
          
          <div className="glass-panel rounded-xl border border-[var(--bg-border)] overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-[var(--bg-border-solid)] bg-[var(--color-danger)15] flex items-center justify-between">
              <h3 className="font-bold text-sm text-[var(--color-danger)] flex items-center gap-2">
                <ShieldCheck size={16}/> Safety Score: 100/100
              </h3>
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1 justify-center bg-[var(--bg-card)]">
              <div className="flex items-center gap-3 text-sm font-medium">
                <AlertTriangle size={16} className="text-warning"/>
                <span>Helmet mandatory on site!</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 size={16} className="text-success"/>
                <span>PPE Checklist Verified</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl border border-[var(--bg-border)] overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-[var(--bg-border-solid)] flex items-center gap-2">
              <Bell size={16} className="text-info"/>
              <h3 className="font-bold text-sm">Announcements</h3>
            </div>
            <div className="p-4 text-sm text-muted">
              <p className="mb-2"><span className="font-semibold text-[var(--text-primary)]">Tomorrow:</span> Site inspection by clients. Ensure cleanliness.</p>
              <p className="text-xs">Posted by Admin • 2h ago</p>
            </div>
          </div>

        </div>

      </section>

      <style>{`
        .employee-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .emp-badges {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .emp-badges span {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
          letter-spacing: 0.5px;
        }

        .badge-primary { background: var(--brand-primary); color: white; }
        .badge-secondary { background: var(--brand-secondary); color: white; }
        .badge-info { background: var(--color-info); color: white; }

        .employee-bento .bento-item {
          min-height: 220px;
        }

        .employee-stats-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stat-value {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-title);
        }

        @media (max-width: 1024px) {
          .employee-bento .col-span-4 { grid-column: span 6; }
          .employee-bento .col-span-6 { grid-column: span 12; }
        }
        
        @media (max-width: 768px) {
          .employee-bento .col-span-4 { grid-column: span 12; }
        }
      `}</style>
    </div>
  );
}
