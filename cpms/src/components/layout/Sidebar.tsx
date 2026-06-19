"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Package,
  ShoppingCart,
  FolderKanban,
  BarChart3,
  ChevronDown,
  ChevronRight,
  HardHat,
  ClipboardList,
  FileText,
  Truck,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string; icon: React.ReactNode }[];
  badge?: string;
};

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    href:  "/dashboard",
    icon:  <LayoutDashboard size={17} />,
  },
  {
    label: "Vendors",
    href:  "/vendors",
    icon:  <Building2 size={17} />,
  },
  {
    label: "Materials",
    href:  "/materials",
    icon:  <Package size={17} />,
  },
  {
    label: "Procurement",
    icon:  <ShoppingCart size={17} />,
    children: [
      { label: "Material Indents", href: "/procurement/indents", icon: <ClipboardList size={15} /> },
      { label: "Purchase Orders",  href: "/procurement/orders",  icon: <FileText size={15} /> },
      { label: "Goods Receipts",   href: "/procurement/grn",     icon: <Truck size={15} /> },
    ],
  },
  {
    label: "Projects & Sites",
    icon:  <FolderKanban size={17} />,
    children: [
      { label: "All Projects", href: "/projects",        icon: <FolderKanban size={15} /> },
      { label: "Labour Logs",  href: "/projects/labour", icon: <Users size={15} /> },
    ],
  },
  {
    label: "Reports",
    href:  "/reports",
    icon:  <BarChart3 size={17} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({
    Procurement:       true,
    "Projects & Sites": true,
  });

  function toggle(label: string) {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function isActive(href: string) {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <HardHat size={20} />
        </div>
        <div>
          <div className="sidebar-brand-name">CPMS</div>
          <div className="sidebar-brand-sub">Construction Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>

        {NAV.map((item) => {
          if (item.href) {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`sidebar-link ${active ? "active" : ""}`}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
                {active && <span className="sidebar-active-bar" />}
              </Link>
            );
          }

          // Group with children
          const isOpen = open[item.label] ?? false;
          const childActive = item.children?.some((c) => isActive(c.href));

          return (
            <div key={item.label}>
              <button
                className={`sidebar-group-btn ${childActive ? "child-active" : ""}`}
                onClick={() => toggle(item.label)}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span className="sidebar-link-label">{item.label}</span>
                <span className="sidebar-chevron">
                  {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </span>
              </button>

              {isOpen && (
                <div className="sidebar-children">
                  {item.children?.map((child) => {
                    const active = isActive(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`sidebar-child-link ${active ? "active" : ""}`}
                      >
                        <span className="sidebar-child-icon">{child.icon}</span>
                        {child.label}
                        {active && <span className="sidebar-active-bar" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <Link href="/settings" className="sidebar-link">
          <span className="sidebar-link-icon"><Settings size={16} /></span>
          <span className="sidebar-link-label">Settings</span>
        </Link>
        <button
          className="sidebar-link sidebar-logout"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <span className="sidebar-link-icon"><LogOut size={16} /></span>
          <span className="sidebar-link-label">Sign Out</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background: var(--bg-surface);
          border-right: 1px solid var(--bg-border);
          display: flex;
          flex-direction: column;
          height: 100%;
          flex-shrink: 0;
          overflow: hidden;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 18px;
          border-bottom: 1px solid var(--bg-border);
        }

        .sidebar-logo {
          width: 38px;
          height: 38px;
          background: var(--brand-amber);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          flex-shrink: 0;
        }

        .sidebar-brand-name {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        .sidebar-brand-sub {
          font-size: 10px;
          color: var(--text-disabled);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-section-label {
          font-size: 10px;
          color: var(--text-disabled);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          padding: 8px 10px 4px;
          margin-bottom: 2px;
        }

        .sidebar-link,
        .sidebar-group-btn {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 10px;
          border-radius: var(--radius-md);
          font-size: 13.5px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          cursor: pointer;
          border: none;
          background: transparent;
          font-family: var(--font-sans);
          width: 100%;
          text-align: left;
          transition: all var(--transition-fast);
          position: relative;
        }

        .sidebar-link:hover,
        .sidebar-group-btn:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        .sidebar-link.active {
          background: var(--brand-amber-muted);
          color: var(--brand-amber);
          font-weight: 600;
          border: 1px solid rgba(245,158,11,0.12);
        }

        .sidebar-group-btn.child-active {
          color: var(--text-primary);
        }

        .sidebar-link-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          opacity: 0.8;
        }

        .sidebar-link.active .sidebar-link-icon {
          opacity: 1;
        }

        .sidebar-link-label {
          flex: 1;
          white-space: nowrap;
        }

        .sidebar-chevron {
          display: flex;
          align-items: center;
          color: var(--text-muted);
          transition: transform var(--transition-fast);
        }

        .sidebar-active-bar {
          width: 3px;
          height: 16px;
          background: var(--brand-amber);
          border-radius: 2px;
          position: absolute;
          right: 8px;
        }

        .sidebar-children {
          padding-left: 14px;
          margin-top: 2px;
          display: flex;
          flex-direction: column;
          gap: 1px;
          border-left: 1px solid var(--bg-border);
          margin-left: 18px;
        }

        .sidebar-child-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: var(--radius-md);
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-muted);
          text-decoration: none;
          transition: all var(--transition-fast);
          position: relative;
        }

        .sidebar-child-link:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        .sidebar-child-link.active {
          background: var(--brand-amber-muted);
          color: var(--brand-amber);
          font-weight: 600;
        }

        .sidebar-child-icon {
          display: flex;
          align-items: center;
          opacity: 0.75;
        }

        .sidebar-bottom {
          padding: 10px 10px 16px;
        }

        .sidebar-divider {
          height: 1px;
          background: var(--bg-border);
          margin-bottom: 8px;
        }

        .sidebar-logout {
          color: var(--text-muted);
        }

        .sidebar-logout:hover {
          background: var(--color-danger-bg);
          color: var(--color-danger);
        }
      `}</style>
    </aside>
  );
}
