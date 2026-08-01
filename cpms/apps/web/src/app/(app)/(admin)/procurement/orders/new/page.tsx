import { ShoppingCart, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewOrderPage() {
  return (
    <div className="animate-fade-in flex flex-col w-full max-w-7xl mx-auto md:px-0" style={{ gap: '40px', paddingBottom: '96px', paddingLeft: '16px', paddingRight: '16px' }}>
      
      {/* 1. HERO SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between" style={{ gap: '24px' }}>
        <div className="flex flex-col" style={{ gap: '8px' }}>
          <div className="flex items-center" style={{ gap: '12px' }}>
            <Link href="/dashboard" className="text-muted hover:text-[var(--brand-primary)] transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-title)]">Create Purchase Order</h1>
          </div>
          <p className="text-base text-muted font-medium" style={{ marginLeft: '36px' }}>Generate a new PO for a registered vendor.</p>
        </div>
      </section>

      {/* 2. FORM CONTAINER */}
      <section className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '32px' }}>
        <div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-12 overflow-hidden shadow-float-sm bg-[var(--bg-card)]">
          <div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
            <div className="flex items-center" style={{ gap: '12px' }}>
              <div className="rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shadow-inner" style={{ padding: '8px' }}>
                <ShoppingCart size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">PO Details</h3>
            </div>
            <span className="badge badge-warning text-xs font-bold whitespace-nowrap shrink-0 shadow-sm tracking-wide" style={{ padding: '6px 12px' }}>PENDING</span>
          </div>
          
          <div className="flex-1 flex flex-col" style={{ padding: '32px 24px', gap: '32px' }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '24px' }}>
              <div className="flex flex-col" style={{ gap: '8px' }}>
                <label className="text-sm font-bold text-[var(--text-title)]">Select Vendor</label>
                <select className="glass-panel p-3 rounded-lg border border-[var(--bg-border-solid)] bg-[var(--bg-hover)] text-sm font-medium">
                  <option>Select a vendor...</option>
                  <option>UltraTech Cement</option>
                  <option>Tata Steel</option>
                </select>
              </div>
              <div className="flex flex-col" style={{ gap: '8px' }}>
                <label className="text-sm font-bold text-[var(--text-title)]">Expected Delivery</label>
                <input type="date" className="glass-panel p-3 rounded-lg border border-[var(--bg-border-solid)] bg-[var(--bg-hover)] text-sm font-medium" />
              </div>
            </div>

            <div className="flex flex-col" style={{ gap: '8px' }}>
              <label className="text-sm font-bold text-[var(--text-title)]">Order Items</label>
              <div className="border border-dashed border-[var(--bg-border-solid)] rounded-xl flex flex-col items-center justify-center text-center p-8 bg-[var(--bg-hover)]">
                <span className="text-muted font-medium text-sm">Click here to add items to your order</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--bg-border-solid)]" style={{ marginTop: '16px' }}>
              <button className="flex items-center rounded-xl bg-[var(--brand-primary)] text-white font-bold hover:shadow-lg transition-all" style={{ padding: '12px 24px', gap: '8px' }}>
                <Save size={18} /> Generate PO
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
