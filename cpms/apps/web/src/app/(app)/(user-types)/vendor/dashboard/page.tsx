import { getVendorDashboardData, acknowledgePurchaseOrder } from "./actions";
import { 
  Building2, 
  FileText, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";

export default async function VendorDashboard() {
  const data = await getVendorDashboardData();

  if (data.error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-lg mb-1">Access Restricted</h3>
            <p>{data.error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data.vendor || !data.recentRequests || data.activeContractsCount === undefined || data.pendingRequestsCount === undefined || data.totalOrderValue === undefined) {
    return null;
  }

  const { vendor, recentRequests, activeContractsCount, pendingRequestsCount, totalOrderValue } = data;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-title)] mb-2">Welcome, {vendor.name}</h1>
          <p className="text-[var(--text-secondary)]">Manage your purchase orders and contracts from CPMS.</p>
        </div>
        <div className="bg-[var(--bg-card)] px-4 py-2 rounded-lg border border-[var(--bg-border)] shadow-sm">
          <div className="text-xs text-[var(--text-muted)] font-semibold uppercase">Vendor Code</div>
          <div className="text-lg font-bold text-[var(--brand-primary)]">{vendor.code}</div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[var(--text-secondary)] font-medium">Pending Requests</h3>
            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg">
              <Clock size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {pendingRequestsCount}
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[var(--text-secondary)] font-medium">Active Contracts</h3>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <FileText size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {activeContractsCount}
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[var(--text-secondary)] font-medium">Total Orders Value</h3>
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            ₹{totalOrderValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Notifications / Pending Actions */}
      {pendingRequestsCount > 0 && (
        <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-xl shadow-sm">
          <h2 className="text-orange-500 font-bold text-lg mb-2 flex items-center gap-2">
            <AlertCircle size={20} /> Action Required
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            You have {pendingRequestsCount} new Purchase Order request{pendingRequestsCount > 1 ? 's' : ''} from the Procurement Manager. 
            Please review and acknowledge {pendingRequestsCount > 1 ? 'them' : 'it'}.
          </p>
        </div>
      )}

      {/* Recent Requests Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-[var(--bg-border)]">
          <h2 className="text-xl font-bold text-[var(--text-title)]">Recent Purchase Orders</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-hover)]">
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">PO Number</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Project</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--text-muted)]">
                    No recent purchase orders found.
                  </td>
                </tr>
              ) : (
                recentRequests.map(po => (
                  <tr key={po.id} className="border-b border-[var(--bg-border)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="p-4 font-medium text-[var(--text-primary)]">{po.poNumber}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{po.project.name}</td>
                    <td className="p-4 text-[var(--text-secondary)]">
                      {new Date(po.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-semibold text-[var(--text-primary)]">
                      ₹{po.grandTotal.toLocaleString()}
                    </td>
                    <td className="p-4">
                      {po.status === 'SENT' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20">
                          Pending Acknowledgment
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                          Acknowledged
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {po.status === 'SENT' ? (
                        <form action={async () => {
                          "use server";
                          await acknowledgePurchaseOrder(po.id);
                        }}>
                          <button type="submit" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--brand-primary)] text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                            <CheckCircle2 size={16} /> Acknowledge
                          </button>
                        </form>
                      ) : (
                        <span className="text-[var(--text-muted)] text-sm italic">Accepted</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}