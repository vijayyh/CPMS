"use client";

import { Bell, Search, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { getInitials } from "@/lib/utils";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard":            "Dashboard",
  "/vendors":              "Vendors",
  "/vendors/new":          "Add Vendor",
  "/materials":            "Materials",
  "/procurement/indents":  "Material Indents",
  "/procurement/orders":   "Purchase Orders",
  "/procurement/grn":      "Goods Receipts",
  "/projects":             "Projects & Sites",
  "/projects/new":         "New Project",
  "/projects/labour":      "Labour Logs",
  "/reports":              "Reports",
  "/settings":             "Settings",
};

interface TopBarProps {
  userName: string;
  userRole: string;
}

export default function TopBar({ userName, userRole }: TopBarProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.reduce<{ label: string; href: string }[]>(
    (acc, seg, i) => {
      const href = "/" + segments.slice(0, i + 1).join("/");
      const label = BREADCRUMB_MAP[href] ?? (seg.length === 25 ? "Detail" : seg.charAt(0).toUpperCase() + seg.slice(1));
      acc.push({ label, href });
      return acc;
    },
    []
  );

  return (
    <header className="topbar">
      {/* Breadcrumbs */}
      <div className="topbar-breadcrumbs">
        <span className="breadcrumb-root">CPMS</span>
        {crumbs.map((c, i) => (
          <span key={c.href} className="breadcrumb-item">
            <ChevronRight size={12} style={{ color: "var(--text-disabled)" }} />
            <span className={i === crumbs.length - 1 ? "breadcrumb-current" : "breadcrumb-link"}>
              {c.label}
            </span>
          </span>
        ))}
      </div>

      {/* Right actions */}
      <div className="topbar-actions">
        {/* Search */}
        <div className="topbar-search">
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Quick search…"
            className="topbar-search-input"
          />
          <kbd className="topbar-kbd">⌘K</kbd>
        </div>

        {/* Notifications */}
        <button className="topbar-icon-btn" id="notifications-btn">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>

        {/* User */}
        <div className="topbar-user">
          <div className="topbar-user-info">
            <span className="topbar-user-name">{userName}</span>
            <span className="topbar-user-role">{userRole}</span>
          </div>
          <div className="avatar avatar-md">{getInitials(userName)}</div>
        </div>
      </div>

      <style>{`
        .topbar {
          height: var(--topbar-height);
          background: var(--bg-surface);
          border-bottom: 1px solid var(--bg-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          gap: 20px;
          flex-shrink: 0;
        }

        .topbar-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
          min-width: 0;
        }

        .breadcrumb-root {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-disabled);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .breadcrumb-link {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .breadcrumb-current {
          font-size: 13px;
          color: var(--text-primary);
          font-weight: 600;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .topbar-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-elevated);
          border: 1px solid var(--bg-border-strong);
          border-radius: var(--radius-md);
          padding: 7px 12px;
          cursor: text;
          transition: all var(--transition-fast);
        }

        .topbar-search:hover {
          border-color: rgba(255,255,255,0.18);
        }

        .topbar-search-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-sans);
          font-size: 13px;
          color: var(--text-primary);
          width: 180px;
        }

        .topbar-search-input::placeholder { color: var(--text-disabled); }

        .topbar-kbd {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-disabled);
          background: var(--bg-card);
          border: 1px solid var(--bg-border-strong);
          border-radius: 4px;
          padding: 1px 5px;
        }

        .topbar-icon-btn {
          width: 36px;
          height: 36px;
          background: var(--bg-elevated);
          border: 1px solid var(--bg-border-strong);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          transition: all var(--transition-fast);
        }

        .topbar-icon-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .topbar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px 6px 6px;
          background: var(--bg-elevated);
          border: 1px solid var(--bg-border-strong);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .topbar-user:hover {
          border-color: rgba(255,255,255,0.18);
        }

        .topbar-user-info {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .topbar-user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .topbar-user-role {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          font-weight: 500;
        }
      `}</style>
    </header>
  );
}
