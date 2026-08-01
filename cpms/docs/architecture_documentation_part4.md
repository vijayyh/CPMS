# CPMS Technical Documentation – Part 4: Data Flow, Knowledge Base & Teaching Guide

## STEP 15 — COMPLETE DATA FLOW

Let us trace the complete end-to-end data flow when an employee logs their daily attendance.

1. **User Input**: An employee opens the mobile app on the construction site and presses the "Clock In" button on the Attendance Tab (`apps/mobile/src/app/(app)/(tabs)/attendance.tsx`).
2. **React Hooks**: The button triggers a React state change, setting an `isLoading` boolean to `true` to disable the button and show a spinner.
3. **Core API Call**: The component calls an async function using the Axios/Fetch wrapper in `apps/mobile/src/core/api.ts`.
4. **Auth Injection**: The `api.ts` file retrieves the JWT session token from the `authStore` (Zustand) and injects it into the HTTP headers as a Cookie (`Cookie: authjs.session-token=xxx`).
5. **Network Request**: An HTTP POST request is sent over the cellular network to `https://cpms.vercel.app/api/attendance/clock-in` (assuming production).
6. **Vercel Edge/Serverless**: Vercel routes the request to the specific AWS Serverless Function mapped to that Next.js API route.
7. **Server Authentication**: The Next.js API route calls `await auth()`. NextAuth decodes the JWT using the `AUTH_SECRET`, verifies it, and returns the User ID and Role.
8. **Prisma ORM**: The API route validates the input and calls `prisma.attendance.create({...})`.
9. **Database Connection Pool**: Prisma sends the query to the Supabase connection pooler (`pgbouncer=true`), which queues and forwards it to the PostgreSQL database.
10. **Database Execution**: PostgreSQL inserts a new row into the `Attendance` table and returns the generated `id` and `clockIn` timestamp.
11. **Server Response**: Prisma receives the data, formats it into JSON, and the Next.js API route returns a `200 OK` response to the mobile client.
12. **Mobile UI Update**: The `api.ts` promise resolves. The React Native component sets `isLoading` back to `false` and updates its local state to display the clock-in time on the screen.

---

## STEP 16 — BUILD A KNOWLEDGE BASE

### Glossary & Terminology
- **Monorepo**: A single version control repository containing multiple applications and libraries.
- **BFF (Backend-for-Frontend)**: An architectural pattern where the backend API is tightly coupled to and designed specifically for the frontend applications.
- **Indent**: An internal request from a site engineer to the procurement department asking for specific materials (e.g., 50 bags of cement).
- **PO (Purchase Order)**: A legally binding document sent from the procurement department to a vendor, agreeing to purchase materials at a specific rate.
- **GRN (Goods Receipt Note)**: A document created at the site when a truck arrives, confirming that the requested materials have been physically received and accepted.
- **pgbouncer**: A lightweight connection pooler for PostgreSQL that prevents serverless functions from opening too many concurrent database connections.

### Developer Onboarding
1. Ensure Node.js v20+ and pnpm v9 are installed.
2. Clone the repo and run `pnpm install` at the root.
3. Setup a `.env` file with `DATABASE_URL` (Supabase connection string with `?pgbouncer=true`).
4. Run `pnpm db:push` to sync the schema to your local/dev database.
5. Run `pnpm db:generate` to generate the Prisma Client.
6. Run `pnpm dev` to start both the Web App (localhost:3000) and Mobile App (Expo Metro bundler) concurrently.

### Common Issues & Troubleshooting
- **Prisma Client not found**: You forgot to run `pnpm db:generate` after checking out a new branch.
- **Database Connection Limit Reached**: Ensure your `DATABASE_URL` ends with `?pgbouncer=true` and is using port `6543` (Supabase pooler), not `5432`.
- **Mobile app gets 401 Unauthorized**: Ensure `EXPO_PUBLIC_API_URL` is set correctly. If testing on a physical phone, the phone and the development laptop must be on the same Wi-Fi network.

---

## STEP 17 — TEACH ME

### 1. Turborepo (The Monorepo Manager)
- **What**: A build system for managing JavaScript monorepos.
- **Why**: When you have multiple apps (web, mobile) sharing code, building them sequentially takes forever.
- **How**: It uses caching. If you change a button in the Web App, Turborepo knows the Mobile App hasn't changed. When you run `pnpm build`, it skips building the Mobile app entirely and pulls the result from cache.
- **In this project**: It orchestrates the Next.js build and Expo build via `turbo.json`.

### 2. NextAuth.js (Session Management)
- **What**: An authentication library for Next.js.
- **Why**: Writing secure authentication (handling cookies, JWTs, CSRF tokens) from scratch is dangerous and error-prone.
- **How**: It intercepts login requests, validates them against your database, signs a JWT with a secret key, and tells the browser to store it securely.
- **In this project**: Used in `apps/web/src/lib/auth.ts` to manage employee logins and embed their Role into the JWT for RBAC.

### 3. Serverless Functions (Next.js APIs)
- **What**: Code that runs on-demand in the cloud without managing a dedicated server.
- **Why**: Cheaper and infinitely scalable. You don't pay for idle time.
- **How**: When a request hits `/api/procurement/indents`, Vercel spins up an isolated container, runs the script, returns the data, and shuts down the container.
- **In this project**: Replaces the need for a traditional Node.js/Express backend. All database interactions happen here.

### 4. NativeWind (Tailwind for React Native)
- **What**: A library that lets you write Tailwind CSS classes in React Native.
- **Why**: React Native traditionally uses `StyleSheet.create({})`. Learning two styling paradigms (Tailwind for web, StyleSheets for mobile) slows down development.
- **How**: NativeWind compiles Tailwind classes into native React Native StyleSheets at build time.
- **In this project**: Enables the UI package (`packages/ui`) to share identical styling logic between the Next.js dashboard and the Expo app.

### 5. Figma Design Tokens
- **What**: Extracting core design values (colors, spacing, fonts) from Figma into code automatically.
- **Why**: If marketing decides to change the primary brand color from Blue to Purple, developers traditionally have to hunt down hex codes across the codebase.
- **How**: A script queries the Figma API, extracts the hex codes, saves them as CSS variables (`--brand-primary: #8A2BE2`), and Tailwind uses those variables.
- **In this project**: Implemented via `scripts/sync-figma-tokens.ts`. This makes the CPMS brand visually scalable and guarantees Web and Mobile look exactly the same.

---
**End of Documentation.**
*You now have a complete, structural, architectural, and educational understanding of the CPMS platform.*
