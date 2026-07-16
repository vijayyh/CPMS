"use client";

import { Bell, Search, ChevronDown, Sun, Moon, Plus, Settings, LogOut, FileText, AlertCircle, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface TopBarProps {
  userName: string;
  userRole: string;
}

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: "Vendor Expiry", text: "UltraTech contract expires in 3 days", read: false, variant: "warning" },
  { id: 2, type: "PO Overdue", text: "PO-2024-001 delivery overdue by 2 days", read: false, variant: "danger" },
  { id: 4, type: "Pending Indent", text: "IND-882 awaits your approval", read: true, variant: "info" },
];

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard":            "Overview",
  "/vendors":              "Vendors",
  "/materials":            "Materials Catalog",
  "/procurement/indents":  "Material Indents",
  "/procurement/orders":   "Purchase Orders",
  "/procurement/grn":      "Goods Receipts",
  "/projects":             "Projects & Sites",
  "/projects/labour":      "Labour Logs",
  "/reports":              "Analytics",
  "/settings":             "Workspace Settings",
};

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

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map(n => ({...n, read: true})));
  const clearAll = () => setNotifications([]);
  const markRead = (id: number) => setNotifications(notifications.map(n => n.id === id ? {...n, read: true} : n));

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const newRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (newRef.current && !newRef.current.contains(event.target as Node)) {
        setIsNewOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Theme Management
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, check if dark mode is active
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="topbar-wrapper">
      <header className="topbar glass-panel">
        
        {/* Left: Breadcrumb Context */}
        <div className="topbar-left">
          <div className="topbar-breadcrumb">
            <span className="breadcrumb-root">CPMS</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {pathname === '/dashboard' ? 'Overview' : (crumbs[crumbs.length - 1]?.label || 'Detail')}
            </span>
          </div>
        </div>

        {/* Center: Global Command Search */}
        <div className="topbar-center">
          <div className="command-search">
            <Search size={16} className="command-icon" />
            <input type="text" placeholder="Search projects, vendors, POs..." className="command-input" />
            <div className="command-shortcut">⌘K</div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="topbar-right">
          
          {/* Quick Create */}
          <div className="relative" ref={newRef}>
            <button className="btn-pill quick-add" onClick={() => setIsNewOpen(!isNewOpen)}>
              <Plus size={16} />
              <span>New</span>
            </button>
            
            {isNewOpen && (
              <div className="glass-panel menu-dropdown" style={{ width: '220px', left: 0, right: 'auto' }}>
                <div className="menu-group">
                  <Link href="/procurement/indents/new" className="menu-item" onClick={() => setIsNewOpen(false)}>
                    <FileText size={14} /> New Indent
                  </Link>
                  <Link href="/procurement/orders/new" className="menu-item" onClick={() => setIsNewOpen(false)}>
                    <ShoppingCart size={14} /> New Purchase Order
                  </Link>
                  <Link href="/projects/issues/new" className="menu-item" onClick={() => setIsNewOpen(false)}>
                    <AlertCircle size={14} /> Log Issue
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="topbar-divider" />

          {/* Theme Toggle */}
          <button className="btn-icon theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button className="btn-icon" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount}</span>
              )}
            </button>

            {isNotifOpen && (
              <div className="glass-panel notif-dropdown">
                <div className="notif-header">
                  <h4>Notifications</h4>
                  <div className="notif-actions">
                    <button onClick={markAllRead}>Mark Read</button>
                    <button onClick={clearAll} className="danger">Clear</button>
                  </div>
                </div>
                <div className="notif-body">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} onClick={() => markRead(n.id)} className={`notif-item ${n.read ? 'read' : 'unread'}`}>
                        <div className={`notif-indicator bg-${n.variant}`} />
                        <div className="notif-content">
                          <div className="notif-type">{n.type}</div>
                          <div className="notif-text">{n.text}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <div className="profile-pill" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="profile-avatar">{getInitials(userName)}</div>
              <div className="profile-info">
                <span className="profile-name">{userName}</span>
              </div>
              <ChevronDown size={14} className="profile-chevron" />
            </div>

            {isProfileOpen && (
              <div className="glass-panel menu-dropdown">
                <div className="menu-header">
                  <span className="menu-name">{userName}</span>
                  <span className="menu-role">{userRole}</span>
                </div>
                <div className="menu-group">
                  <Link href="/settings" className="menu-item" onClick={() => setIsProfileOpen(false)}>
                    <Settings size={14} /> Workspace Settings
                  </Link>
                  <button className="menu-item text-danger" onClick={() => signOut({ callbackUrl: "/login" })}>
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      <style>{`
        .topbar-wrapper {
          padding: 16px 40px 0;
          z-index: 40;
          position: sticky;
          top: 0;
        }

        .topbar {
          height: var(--topbar-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          gap: 24px;
          border-radius: var(--radius-full);
        }

        .topbar-left {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .topbar-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .breadcrumb-root {
          color: var(--text-muted);
        }

        .breadcrumb-separator {
          color: var(--bg-border);
        }

        .breadcrumb-current {
          color: var(--text-title);
          font-weight: 600;
        }

        .topbar-center {
          flex: 2;
          display: flex;
          justify-content: center;
        }

        .command-search {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0,0,0,0.03);
          border: 1px solid var(--bg-border);
          border-radius: var(--radius-full);
          padding: 8px 16px;
          width: 100%;
          max-width: 480px;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-inner);
        }

        .dark .command-search {
          background: rgba(255,255,255,0.03);
        }

        .command-search:focus-within, .command-search:hover {
          background: var(--bg-card-solid);
          box-shadow: var(--shadow-float-sm), 0 0 0 2px var(--brand-glow);
          border-color: rgba(255, 107, 53, 0.3);
        }

        .command-icon {
          color: var(--text-muted);
        }

        .command-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-family: var(--font-sans);
          font-size: 14px;
          color: var(--text-title);
        }

        .command-input::placeholder { color: var(--text-muted); }

        .command-shortcut {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          background: var(--bg-card);
          border: 1px solid var(--bg-border);
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 600;
        }

        .topbar-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
        }

        .btn-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background: var(--brand-glow);
          color: var(--brand-primary);
          font-weight: 600;
          font-size: 13px;
          border: 1px solid rgba(255, 107, 53, 0.2);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-pill:hover {
          background: var(--brand-primary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .btn-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          position: relative;
        }

        .btn-icon:hover {
          background: var(--bg-card-solid);
          color: var(--brand-primary);
          border-color: var(--bg-border);
          box-shadow: var(--shadow-float-sm);
        }

        .theme-toggle:hover {
          transform: rotate(15deg);
        }

        .notif-badge {
          position: absolute;
          top: -2px; right: -2px;
          background: var(--color-danger);
          color: white;
          font-size: 10px;
          font-weight: 700;
          width: 16px; height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-card);
        }

        .topbar-divider {
          width: 1px;
          height: 24px;
          background: var(--bg-border);
        }

        .profile-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px 6px 6px;
          background: rgba(0,0,0,0.02);
          border: 1px solid var(--bg-border);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .dark .profile-pill {
          background: rgba(255,255,255,0.02);
        }

        .profile-pill:hover {
          background: var(--bg-card-solid);
          box-shadow: var(--shadow-float-sm);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-secondary), var(--brand-primary));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        .profile-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-title);
        }

        .profile-chevron {
          color: var(--text-muted);
        }

        .relative { position: relative; }
        
        .menu-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 240px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          z-index: 100;
          animation: fadeIn 0.2s ease-out;
        }
        
        .menu-header {
          padding: 12px;
          border-bottom: 1px solid var(--bg-border);
          margin-bottom: 8px;
          display: flex;
          flex-direction: column;
        }
        
        .menu-name { font-weight: 600; font-size: 14px; color: var(--text-title); }
        .menu-role { font-size: 11px; font-weight: 600; color: var(--brand-primary); text-transform: uppercase; margin-top: 2px; }

        .menu-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          cursor: pointer;
          background: transparent;
          border: none;
          transition: all var(--transition-fast);
        }

        .menu-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .menu-item.text-danger:hover {
          color: var(--color-danger);
          background: rgba(239, 68, 68, 0.1);
        }
        
        .notif-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 360px;
          padding: 0;
          overflow: hidden;
          z-index: 100;
        }

        .notif-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--bg-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notif-header h4 { margin: 0; }

        .notif-actions button {
          background: none; border: none;
          font-size: 12px; font-weight: 600;
          color: var(--text-muted); cursor: pointer;
          margin-left: 12px;
        }
        .notif-actions button:hover { color: var(--text-title); }
        .notif-actions button.danger:hover { color: var(--color-danger); }

        .notif-body {
          max-height: 320px; overflow-y: auto;
        }

        .notif-empty {
          padding: 32px; text-align: center; color: var(--text-muted); font-size: 13px;
        }

        .notif-item {
          display: flex; gap: 16px; padding: 16px 20px;
          border-bottom: 1px solid var(--bg-border);
          cursor: pointer; transition: background var(--transition-fast);
        }
        .notif-item:hover { background: var(--bg-hover); }
        .notif-item.read { opacity: 0.6; }
        
        .notif-indicator { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; }
        .bg-warning { background: var(--color-warning); }
        .bg-danger { background: var(--color-danger); }
        .bg-info { background: var(--color-info); }

        .notif-content { flex: 1; }
        .notif-type { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 2px; }
        .notif-text { font-size: 13px; color: var(--text-title); line-height: 1.4; }

        @media (max-width: 1024px) {
          .topbar-center { display: none; }
        }
        @media (max-width: 768px) {
          .topbar-wrapper { padding: 12px 20px 0; }
        }
      `}</style>
    </div>
  );
}
