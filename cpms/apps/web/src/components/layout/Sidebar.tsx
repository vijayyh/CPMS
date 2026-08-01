"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Building2, Package, ShoppingCart, FolderKanban,
  BarChart3, ChevronDown, ChevronRight, HardHat, ClipboardList,
  FileText, Truck, Users, Settings, LogOut, PanelLeftClose, PanelLeftOpen,
  Star, Hexagon, Mail, Phone, IndianRupee, CheckCircle2, Calendar
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string; icon: React.ReactNode }[];
};

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={22} /> },
  { label: "All Projects", href: "/projects", icon: <FolderKanban size={22} /> },
  { label: "Vendors", href: "/vendors", icon: <Building2 size={22} /> },
  { label: "Materials", href: "/materials", icon: <Package size={22} /> },
  {
    label: "Procurement",
    icon: <ShoppingCart size={22} />,
    children: [
      { label: "Material Indents", href: "/procurement/indents", icon: <ClipboardList size={18} /> },
      { label: "Purchase Orders", href: "/procurement/orders", icon: <FileText size={18} /> },
      { label: "Goods Receipts", href: "/procurement/grn", icon: <Truck size={18} /> },
    ],
  },
  {
    label: "Projects & Sites",
    icon: <FolderKanban size={22} />,
    children: [
      { label: "Labour Logs", href: "/projects/labour", icon: <Users size={18} /> },
    ],
  },
  { label: "Reports", href: "/reports", icon: <BarChart3 size={22} /> },
  { label: "Finance", href: "/finance", icon: <IndianRupee size={22} /> },
];

const MANAGER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/manager/dashboard", icon: <LayoutDashboard size={22} /> },
  { label: "All Projects", href: "/projects", icon: <FolderKanban size={22} /> },
  { label: "Vendors", href: "/vendors", icon: <Building2 size={22} /> },
  { label: "Materials", href: "/manager/materials", icon: <Package size={22} /> },
  {
    label: "Procurement",
    icon: <ShoppingCart size={22} />,
    children: [
      { label: "Material Indents", href: "/manager/procurement/indents", icon: <ClipboardList size={18} /> },
      { label: "Purchase Orders", href: "/manager/procurement/orders", icon: <FileText size={18} /> },
      { label: "Goods Receipts", href: "/manager/procurement/grn", icon: <Truck size={18} /> },
    ],
  },
  {
    label: "Projects & Sites",
    icon: <FolderKanban size={22} />,
    children: [
      { label: "Labour Logs", href: "/projects/labour", icon: <Users size={18} /> },
    ],
  },
  { label: "Reports", href: "/manager/reports", icon: <BarChart3 size={22} /> },
  { label: "Finance", href: "/manager/finance", icon: <IndianRupee size={22} /> },
];

const EMPLOYEE_NAV: NavItem[] = [
  { label: "Dashboard", href: "/employee/dashboard", icon: <LayoutDashboard size={22} /> },
  { label: "My Attendance", href: "/employee/attendance", icon: <ClipboardList size={22} /> },
  { label: "My Daily Wages", href: "/employee/wages", icon: <IndianRupee size={22} /> },
  { label: "My Assigned Project", href: "/employee/my-project", icon: <Building2 size={22} /> },
  { label: "Today's Tasks", href: "/employee/tasks", icon: <CheckCircle2 size={22} /> },
  { label: "Announcements", href: "/employee/announcements", icon: <Mail size={22} /> },
  { label: "Leave Requests", href: "/employee/leave", icon: <Calendar size={22} /> },
  { label: "Profile", href: "/employee/profile", icon: <Users size={22} /> },
];

const VENDOR_NAV: NavItem[] = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: <LayoutDashboard size={22} /> },
];

const SITE_MANAGER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/site-manager/dashboard", icon: <LayoutDashboard size={22} /> },
];

const PROCUREMENT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/procurement/dashboard", icon: <LayoutDashboard size={22} /> },
  { label: "Vendors", href: "/vendors", icon: <Building2 size={22} /> },
];

const ACCOUNTS_NAV: NavItem[] = [
  { label: "Dashboard", href: "/accounts/dashboard", icon: <LayoutDashboard size={22} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "MANAGER";
  
  let currentNav = ADMIN_NAV;
  if (userRole === "MANAGER") currentNav = MANAGER_NAV;
  else if (userRole === "EMPLOYEE") currentNav = EMPLOYEE_NAV;
  else if (userRole === "VENDOR") currentNav = VENDOR_NAV;
  else if (userRole === "SITE_ENGINEER") currentNav = SITE_MANAGER_NAV;
  else if (userRole === "PROCUREMENT") currentNav = PROCUREMENT_NAV;
  else if (userRole === "ACCOUNTS") currentNav = ACCOUNTS_NAV;

  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [projectsData, setProjectsData] = useState<{activeProjectId: string | null, projects: any[]}>({ activeProjectId: null, projects: [] });

  useEffect(() => {
    fetch('/api/user/projects')
      .then(res => res.json())
      .then(data => {
        if (data.projects) setProjectsData(data);
      })
      .catch(console.error);
  }, []);

  const switchWorkspace = async (projectId: string) => {
    try {
      const res = await fetch('/api/user/workspace', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId })
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to switch workspace", err);
    }
  };

  const activeProject = projectsData.projects.find(p => p.id === projectsData.activeProjectId);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Procurement: true,
    "Projects & Sites": true,
  });

  function toggleGroup(label: string) {
    if (collapsed) setCollapsed(false);
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function isActive(href: string) {
    if (href.endsWith('/dashboard')) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <div className="sidebar-wrapper">
      <aside className={`sidebar glass-panel ${collapsed ? 'collapsed' : ''}`}>

        {/* Workspace Selector (Header) */}
        <div className="sidebar-header" style={{ cursor: "pointer" }} onClick={() => !collapsed && setWorkspaceOpen(!workspaceOpen)}>
          <div className="sidebar-logo-box">
            <Hexagon size={20} strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="sidebar-workspace">
              <span className="workspace-name">{activeProject ? activeProject.name : "CPMS Enterprise"}</span>
              <span className="workspace-role" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {userRole} Workspace <ChevronDown size={12} />
              </span>
            </div>
          )}
          <button className="sidebar-collapse-btn" onClick={(e) => { e.stopPropagation(); setCollapsed(!collapsed); }}>
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>

          {/* Workspace Dropdown */}
          {!collapsed && workspaceOpen && (
            <div className="glass-panel" style={{ position: 'absolute', top: '100%', left: 20, right: 20, zIndex: 100, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>Switch Workspace</div>
              {projectsData.projects.length === 0 && <div style={{ fontSize: 12, padding: '4px 8px', color: 'var(--text-secondary)' }}>No projects found.</div>}
              {projectsData.projects.map(p => (
                <button
                  key={p.id}
                  onClick={(e) => { e.stopPropagation(); switchWorkspace(p.id); }}
                  style={{
                    background: p.id === projectsData.activeProjectId ? 'var(--bg-active)' : 'transparent',
                    border: 'none', textAlign: 'left', padding: '8px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', flexDirection: 'column'
                  }}
                  className="nav-child-item"
                >
                  <span style={{ fontSize: 13, fontWeight: p.id === projectsData.activeProjectId ? 600 : 500, color: p.id === projectsData.activeProjectId ? 'var(--brand-primary)' : 'var(--text-primary)' }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pinned / Favorites (Optional section for premium feel) */}
        {!collapsed && (
          <div className="sidebar-favorites">
            <div className="sidebar-section-title">Pinned</div>
            <Link href="/projects" className="favorite-link">
              <Star size={14} className="favorite-icon" />
              <span>Skyline Tower A</span>
            </Link>
          </div>
        )}

        <div className="sidebar-divider" />

        {/* Navigation */}
        <nav className="sidebar-nav">
          {!collapsed && <div className="sidebar-section-title">Main Menu</div>}

          {currentNav.map((item) => {
            if (item.href) {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`nav-item ${active ? "active" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              );
            }

            const isOpen = openGroups[item.label] ?? false;
            const childActive = item.children?.some((c) => isActive(c.href));

            return (
              <div key={item.label} className="nav-group">
                <button
                  className={`nav-item ${childActive ? "child-active" : ""}`}
                  onClick={() => toggleGroup(item.label)}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-chevron">
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                    </>
                  )}
                </button>

                {!collapsed && isOpen && (
                  <div className="nav-children">
                    {item.children?.map((child) => {
                      const active = isActive(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`nav-child-item ${active ? "active" : ""}`}
                        >
                          <span className="nav-child-icon">{child.icon}</span>
                          <span className="nav-child-label">{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="nav-group">
            <button
              className="nav-item"
              onClick={() => setSettingsOpen(!settingsOpen)}
              title={collapsed ? "Settings" : undefined}
            >
              <span className="nav-icon"><Settings size={20} /></span>
              {!collapsed && (
                <>
                  <span className="nav-label">Settings</span>
                  <span className="nav-chevron">
                    {settingsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                </>
              )}
            </button>

            {!collapsed && settingsOpen && (
              <div className="nav-children">
                <button
                  className="nav-child-item nav-logout"
                  style={{ width: "100%", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: "8px 12px" }}
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <span className="nav-child-icon"><LogOut size={16} /></span>
                  <span className="nav-child-label">Log Out</span>
                </button>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="sidebar-company-info">
              <div className="company-info-title">CPMS Support</div>
              <div className="company-info-item">
                <Mail size={12} /> support@cpms.com
              </div>
              <div className="company-info-item">
                <Phone size={12} /> +1 (800) 555-0199
              </div>
            </div>
          )}
        </div>
      </aside>

      <style>{`
        .sidebar-wrapper {
          padding: 16px 0 16px 16px; /* Floating offset */
          height: 100vh;
          display: flex;
          flex-shrink: 0;
          z-index: 50;
        }

        .sidebar {
          width: var(--sidebar-width);
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: width var(--transition-base);
          overflow: hidden;
        }

        .sidebar.collapsed {
          width: var(--sidebar-collapsed-width);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          position: relative;
        }

        .sidebar.collapsed .sidebar-header {
          justify-content: center;
          padding: 20px 12px;
        }

        .sidebar-logo-box {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px var(--brand-glow);
        }

        .sidebar-workspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .workspace-name {
          font-weight: 700;
          font-size: 15px;
          color: var(--text-title);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .workspace-role {
          font-size: 11px;
          font-weight: 600;
          color: var(--brand-primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sidebar-collapse-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-collapse-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .sidebar.collapsed .sidebar-collapse-btn {
          position: absolute;
          right: -12px;
          top: 28px;
          background: var(--bg-card-solid);
          border: 1px solid var(--bg-border);
          border-radius: 50%;
          box-shadow: var(--shadow-float-sm);
          opacity: 0;
        }

        .sidebar.collapsed:hover .sidebar-collapse-btn {
          opacity: 1;
          right: -12px;
        }

        .sidebar-divider {
          height: 1px;
          background: var(--bg-border);
          margin: 0 20px;
        }

        .sidebar-favorites {
          padding: 16px 20px;
        }

        .sidebar-section-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          margin-top: 16px;
          padding-left: 16px;
        }
        
        .sidebar-nav > .sidebar-section-title:first-child {
          margin-top: 0;
        }

        .favorite-link {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          padding: 8px 12px;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .favorite-link:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .favorite-icon {
          color: var(--color-warning);
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar.collapsed .sidebar-nav {
          padding: 24px 12px;
          align-items: center;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          background: transparent;
          border: 1px solid transparent;
          width: 100%;
          cursor: pointer;
          transition: all var(--transition-base);
          position: relative;
          text-align: left;
        }

        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 12px;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          margin-bottom: 8px;
        }

        .nav-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: var(--bg-active);
          color: var(--brand-primary);
          font-weight: 600;
          border-color: rgba(255, 107, 53, 0.1);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .sidebar.collapsed .nav-item.active {
          background: var(--bg-active);
          color: var(--brand-primary);
          box-shadow: var(--shadow-float-sm);
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: inherit;
          transition: transform var(--transition-fast);
        }

        .nav-item:hover .nav-icon {
          transform: scale(1.05);
        }

        .nav-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-chevron {
          color: var(--text-muted);
        }



        .nav-children {
          padding: 4px 0 4px 38px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-child-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .nav-child-item:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }

        .nav-child-item.active {
          color: var(--brand-primary);
          font-weight: 600;
        }

        .nav-child-icon {
          opacity: 0.7;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid var(--bg-border);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar.collapsed .sidebar-footer {
          padding: 20px 12px;
          align-items: center;
        }

        .nav-logout:hover {
          color: var(--color-danger);
          background: rgba(239, 68, 68, 0.1);
        }

        .sidebar-company-info {
          margin-top: 12px;
          padding: 12px;
          border-radius: var(--radius-md);
          background: var(--bg-hover);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .company-info-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .company-info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .company-info-item svg {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
