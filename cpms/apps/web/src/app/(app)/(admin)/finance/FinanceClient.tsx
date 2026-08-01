"use client";

import { useSession } from "next-auth/react";
import {
  TrendingUp, TrendingDown, IndianRupee, Download, FileDown,
  Receipt, Wallet, CreditCard, PieChart, BarChart3, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function FinanceClient({ projects, vendors }: { projects: any[], vendors: any[] }) {
  const { data: session } = useSession();
  const router = useRouter();

  const userRole = (session?.user as any)?.role || "MANAGER";
  const isAdmin = userRole === "ADMIN" || userRole === "MANAGER";
  const isAccounts = userRole === "ACCOUNTS";
  const canSeeFinance = isAdmin || isAccounts;

  if (!canSeeFinance) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">You do not have permission to view this page.</p>
      </div>
    );
  }

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Financial Dashboard Report", 14, 20);

      (doc as any).autoTable({
        startY: 30,
        head: [['Metric', 'Value']],
        body: [
          ['Today\'s Spend', '₹45K'],
          ['Weekly Spend', '₹3.2L'],
          ['Monthly Spend', '₹12.8L'],
          ['Total YTD Spend', '₹24.5L'],
          ['Pending Invoices', '14 (₹4.2L Due)'],
          ['Recent Payments', '₹1.8L (Last 7 days)'],
        ],
      });

      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Project', 'Budget', 'Spent']],
        body: projects.map(p => [p.name, `₹${p.budget.toLocaleString()}`, `₹${p.spent.toLocaleString()}`]),
      });

      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Vendor', 'Total Spend']],
        body: vendors.map(v => [v.name, `₹${v.spend.toLocaleString()}`]),
      });

      doc.save("financial-report.pdf");
      toast.success("PDF Exported Successfully");
    } catch (e) {
      toast.error("Failed to export PDF");
    }
  };

  const exportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      const metricsData = [
        ['Metric', 'Value'],
        ['Today\'s Spend', '₹45K'],
        ['Weekly Spend', '₹3.2L'],
        ['Monthly Spend', '₹12.8L'],
        ['Total YTD Spend', '₹24.5L'],
        ['Pending Invoices', '14'],
        ['Recent Payments', '₹1.8L'],
      ];

      const projectsData = [
        ['Project', 'Budget', 'Spent'],
        ...projects.map(p => [p.name, p.budget, p.spent])
      ];

      const vendorsData = [
        ['Vendor', 'Total Spend'],
        ...vendors.map(v => [v.name, v.spend])
      ];

      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(metricsData), "Metrics");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(projectsData), "Projects");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(vendorsData), "Vendors");

      XLSX.writeFile(wb, "financial-report.xlsx");
      toast.success("Excel Exported Successfully");
    } catch (e) {
      toast.error("Failed to export Excel");
    }
  };

  return (
    <div className="dashboard-container animate-fade-in p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6">

      {/* Back & Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm font-bold text-muted hover:text-[var(--text-title)] transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--bg-border-solid)] pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-[var(--color-success)] rounded-lg text-white flex items-center justify-center shadow-md w-12 h-12">
              <IndianRupee size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-title)] tracking-tight">Financial Dashboard</h1>
              <p className="text-sm text-muted font-medium mt-1">Real-time spend, budget tracking, and invoice management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={exportPDF} className="btn btn-outline border-[var(--bg-border-solid)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] flex items-center shadow-sm" style={{ padding: '8px 16px', fontSize: '14px', borderRadius: 'var(--radius-md)', gap: '8px', fontWeight: 600 }}>
              <FileDown size={16} className="text-[var(--color-danger)]" /> Export PDF
            </button>
            <button onClick={exportExcel} className="btn btn-outline border-[var(--bg-border-solid)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] flex items-center shadow-sm" style={{ padding: '8px 16px', fontSize: '14px', borderRadius: 'var(--radius-md)', gap: '8px', fontWeight: 600 }}>
              <Download size={16} className="text-[var(--color-success)]" /> Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

        <div className="glass-panel glass-panel-hoverable p-4 flex flex-col cursor-pointer group hover:border-[var(--brand-primary)]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted mb-2 truncate">Today's Spend</span>
          <div className="flex items-end justify-between">
            <span className="text-xl font-black text-[var(--text-title)] tracking-tight">₹45K</span>
            <span className="text-[10px] font-bold text-[var(--color-success)] flex items-center"><TrendingUp size={12} className="mr-0.5" /> 2%</span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hoverable p-4 flex flex-col cursor-pointer group hover:border-[var(--brand-primary)]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted mb-2 truncate">Weekly Spend</span>
          <div className="flex items-end justify-between">
            <span className="text-xl font-black text-[var(--text-title)] tracking-tight">₹3.2L</span>
            <span className="text-[10px] font-bold text-[var(--color-danger)] flex items-center"><TrendingDown size={12} className="mr-0.5" /> 5%</span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hoverable p-4 flex flex-col cursor-pointer group hover:border-[var(--brand-primary)]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted mb-2 truncate">Monthly Spend</span>
          <div className="flex items-end justify-between">
            <span className="text-xl font-black text-[var(--brand-primary)] tracking-tight">₹12.8L</span>
            <span className="text-[10px] font-bold text-[var(--color-success)] flex items-center"><TrendingUp size={12} className="mr-0.5" /> 12%</span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hoverable p-4 flex flex-col cursor-pointer group hover:border-[var(--brand-primary)]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted mb-2 truncate">Total YTD</span>
          <div className="flex items-end justify-between">
            <span className="text-xl font-black text-[var(--text-title)] tracking-tight">₹24.5L</span>
            <span className="text-[10px] font-bold text-[var(--color-success)] flex items-center"><TrendingUp size={12} className="mr-0.5" /> 8%</span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hoverable p-4 flex flex-col cursor-pointer group relative overflow-hidden hover:border-[var(--color-warning)]">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 text-[var(--color-warning)] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300"><Receipt size={40} /></div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted mb-2 relative z-10 truncate">Pending Invoices</span>
          <div className="flex items-end justify-between relative z-10">
            <span className="text-xl font-black text-[var(--text-title)] tracking-tight">14</span>
            <span className="text-[10px] font-bold text-[var(--color-warning)]">₹4.2L Due</span>
          </div>
        </div>

        <div className="glass-panel glass-panel-hoverable p-4 flex flex-col cursor-pointer group relative overflow-hidden hover:border-[var(--color-info)]">
          <div className="absolute -top-2 -right-2 p-4 opacity-5 text-[var(--color-info)] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"><CreditCard size={40} /></div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted mb-2 relative z-10 truncate">Recent Payments</span>
          <div className="flex items-end justify-between relative z-10">
            <span className="text-xl font-black text-[var(--text-title)] tracking-tight">₹1.8L</span>
            <span className="text-[10px] font-bold text-[var(--color-info)] truncate max-w-[50%] text-right">Last 7 days</span>
          </div>
        </div>

      </div>

      {/* Detailed Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Project-wise Spend */}
        <div className="bento-item glass-panel">
          <div className="bento-header with-border bg-[var(--bg-hover)]">
            <div className="flex items-center gap-3 text-[var(--text-title)] m-0">
              <div className="p-2 bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] rounded-md">
                <BarChart3 size={18} />
              </div>
              <h3 className="text-sm font-black tracking-tight m-0">Project-wise Spend</h3>
            </div>
          </div>

          <div className="bento-body flex flex-col gap-5 pb-6">
            {projects.length === 0 && <p className="text-sm text-muted text-center p-4">No active projects.</p>}
            {projects.map(p => {
              const perc = Math.min(100, Math.round((p.spent / (p.budget || 1)) * 100));
              return (
                <Link href={`/projects/${p.id}`} key={p.id} className="flex flex-col gap-2 group cursor-pointer p-2 -m-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[var(--text-title)] group-hover:text-[var(--brand-primary)] transition-colors">{p.name}</span>
                    <span className="text-sm font-black text-[var(--text-secondary)]">₹{p.spent.toLocaleString()} <span className="text-muted font-bold text-xs ml-1">/ ₹{p.budget.toLocaleString()}</span></span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-border-solid)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--brand-secondary)] rounded-full transition-all duration-1000 group-hover:bg-[var(--brand-primary)]" style={{ width: `${perc}%` }}></div>
                  </div>
                  <div className="text-[10px] text-muted font-bold text-right uppercase tracking-widest">{perc}% Utilized</div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Vendor-wise Spend */}
        <div className="bento-item glass-panel">
          <div className="bento-header with-border bg-[var(--bg-hover)]">
            <div className="flex items-center gap-3 text-[var(--text-title)] m-0">
              <div className="p-2 bg-[var(--color-info)]/10 text-[var(--color-info)] rounded-md">
                <PieChart size={18} />
              </div>
              <h3 className="text-sm font-black tracking-tight m-0">Vendor-wise Spend</h3>
            </div>
          </div>

          <div className="bento-body flex flex-col gap-1 pb-6">
            {vendors.length === 0 && <p className="text-sm text-muted text-center p-4">No active vendors.</p>}
            {vendors.map(v => (
              <Link href={`/vendors/${v.id}`} key={v.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[var(--color-info)]/10 text-[var(--color-info)] flex items-center justify-center font-black text-xs group-hover:bg-[var(--color-info)] group-hover:text-white transition-colors">
                    {v.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[var(--text-title)] group-hover:text-[var(--brand-primary)] transition-colors">{v.name}</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted mt-0.5">{v.status === 'ACTIVE' ? 'Active Supplier' : v.status}</span>
                  </div>
                </div>
                <span className="text-sm font-black text-[var(--text-secondary)] group-hover:text-[var(--text-title)] transition-colors">₹{v.spend.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
