
## Project Architecture Rules (CPMS Monorepo)

1. **Mobile Scope Only**: Your ONLY responsibility is to build the mobile application inside apps/mobile. DO NOT modify, refactor, rename, move, or delete ANY file inside apps/web.
2. **Web is the Source of Truth**: The website is the implementation reference. Every workflow, permission, dashboard, navigation flow, authentication flow, role-based rendering, API integration, business logic, validation, and feature must be replicated in the mobile app. Do NOT invent new workflows or simplify them.
3. **Role Based Access Control (RBAC)**: The mobile app MUST use the EXACT SAME RBAC implementation. Reuse existing role logic, permission logic, Zustand authentication state, user session, role flags, and permission checks. If an Admin logs in, show the Admin dashboard. If an Employee logs in, show the Employee dashboard.
4. **Dashboards**: Do NOT create one generic dashboard. Inspect apps/web and reuse the same logic, conditional rendering, permissions, APIs, and business logic. Redesign ONLY the layout for mobile (e.g., desktop sidebars become bottom navigation/drawers).
5. **Component Reuse**: Reuse existing logic from apps/web whenever possible. Move reusable code into packages ONLY IF NECESSARY. Do NOT duplicate logic.
6. **Authentication**: Reuse the same authentication flow, login APIs, session logic, and role loading logic.
7. **Backend**: Use EXACTLY the same backend, APIs, Supabase database, auth, business logic, and validation. Never duplicate backend logic or create another backend.

