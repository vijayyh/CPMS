# CPMS Dashboard UI & Layout Guidelines

This document serves as the master **Design System and Layout Source of Truth** for all dashboards in the CPMS application (Employee, Site Manager, Procurement, Admin, etc.).

When building or updating a dashboard, **always reference this file first** to ensure consistency in sizing, spacing, interactive elements, and layout grids.

---

## 1. Grid Structure & Page Hierarchy

All dashboards must utilize a structured Bento-style grid system wrapped in a max-width container to maintain a clean, organized look across large monitors.

**Page Wrapper:**
```tsx
<div className="animate-fade-in flex flex-col w-full max-w-7xl mx-auto md:px-0" style={{ gap: '40px', paddingBottom: '96px', paddingLeft: '16px', paddingRight: '16px' }}>
```

**Grid Sections (Rows):**
- Grids use 12 columns: `<section className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '32px' }}>`
- **Primary Row (Above the Fold):** Use a 3-card layout where each card spans 4 columns (`col-span-1 lg:col-span-4`).
- **Secondary Row (Below the Fold):** Use a 2-card layout for deeper metrics where each card spans 6 columns (`col-span-1 lg:col-span-6`).

---

## 2. The Dashboard Card (Bento Box)

Every dashboard card must follow the exact same visual hierarchy and structural boundaries.

### A. The Container
Use `minHeight: '420px'` to ensure large, premium, iPad-like widgets that don't shrink dynamically. All cards must have the hover lift animation.
```tsx
<div className="glass-panel rounded-[var(--radius-xl)] border border-[var(--bg-border-solid)] flex flex-col col-span-1 lg:col-span-4 overflow-hidden shadow-float-sm hover:shadow-float-md transition-all duration-300 hover:-translate-y-1 bg-[var(--bg-card)]" style={{ minHeight: '420px' }}>
```

### B. The Isolated Header
Headers must be separated from the card body with a solid background and a bottom border.
**CRITICAL**: Use explicit inline styles `padding: '20px 24px'` to avoid Tailwind compiler issues.
```tsx
<div className="flex justify-between items-center border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0" style={{ padding: '20px 24px' }}>
  <div className="flex items-center" style={{ gap: '12px' }}>
    {/* Icon Wrapper */}
    <div className="rounded-lg bg-[var(--color-info)]/10 text-[var(--color-info)] shadow-inner" style={{ padding: '8px' }}>
      <Icon size={20} />
    </div>
    <h3 className="text-base font-bold tracking-tight text-[var(--text-title)] truncate">Card Title</h3>
  </div>
  {/* Status Badge */}
  <span className="badge badge-info text-xs font-bold whitespace-nowrap shrink-0 shadow-sm tracking-wide" style={{ padding: '6px 12px' }}>STATUS</span>
</div>
```

### C. The Generous Card Body
Content within the card must be given a massive amount of breathing room using inline styles `padding: '32px 24px'`. **Never let text touch the borders of the card.**
```tsx
<div className="flex-1 flex flex-col justify-center" style={{ padding: '32px 24px', gap: '32px' }}>
  {/* Card Content Goes Here */}
</div>
```

---

## 3. The "Tailwind Padding Bug" Rule (CRITICAL)

Due to conflicting Tailwind versions in the repository (`3.3.2` and `4.3.3` combined with Turbopack), **Tailwind utility classes for spacing (like `p-8`, `px-6`, `gap-8`) will frequently fail to compile and be ignored in the browser.**

**THE FIX:** You must strictly use **React inline styles** for any structural gap, padding, or margin inside the dashboards.
- ❌ BAD: `<div className="p-8 gap-4">`
- ✅ GOOD: `<div style={{ padding: '32px', gap: '16px' }}>`

---

## 4. Typography & Flex Safeguards

To prevent text from breaking the Bento layout on smaller screens, always enforce these text safeguards:
1. Wrap single-line metrics with `truncate`.
2. Add `whitespace-nowrap` to prevent badges or numbers from stacking vertically.
3. Add `shrink-0` to icons or badges to prevent them from squishing when text gets long.
4. Scale font sizes appropriately. Primary numbers inside boxes should be `text-4xl` or `text-3xl`, not `text-[64px]`.

---

## 5. Quick Actions (Buttons)

Quick action buttons across the top of the dashboard follow a uniform 4-column layout (`grid-cols-2 md:grid-cols-4`) with matching hover effects.

```tsx
<Link 
  href="/destination"
  className="flex flex-col items-center justify-center text-center rounded-[var(--radius-xl)] glass-panel glass-panel-hoverable border border-[var(--bg-border-solid)] group hover:shadow-md transition-all hover:-translate-y-1"
  style={{ gap: '12px', padding: '24px' }}
>
  <div className="rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]" style={{ padding: '14px' }}>
    <Icon size={24} strokeWidth={2.5} />
  </div>
  <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
    <span className="block text-sm md:text-base font-bold truncate text-[var(--text-title)]" style={{ marginBottom: '4px' }}>Action Name</span>
    <span className="hidden md:block text-xs text-muted font-medium">Subtext</span>
  </div>
</Link>
```

---

*AI Agents: Whenever you are asked to generate a new dashboard (e.g., Site Manager, Procurement, Vendor), load this document into your context first to construct the UI elements perfectly.*
