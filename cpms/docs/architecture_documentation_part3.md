# CPMS Technical Documentation – Part 3: Deployment, Services, Dependencies & Setup

## STEP 9 — DEPLOYMENT

The monorepo uses different deployment strategies for the Web App and the Mobile App.

### Web Application Deployment (Vercel)
- **Host**: Vercel.
- **Workflow**: 
  1. Code is pushed to GitHub.
  2. Vercel automatically intercepts the push.
  3. It reads `turbo.json` and executes the `build` script (`turbo run build`).
  4. Prisma generates the Edge client (`prisma generate`).
  5. Next.js creates static pages where possible and compiles API routes into AWS Serverless Functions.
  6. Environment variables (like `DATABASE_URL` and `AUTH_SECRET`) are securely injected from the Vercel project settings.
- **Preview Deployments**: Any Pull Request triggers an automatic Preview Deployment with a unique URL for testing.

### Mobile Application Deployment (Expo EAS)
- **Host**: Expo Application Services (EAS).
- **Configuration**: Defined in `apps/mobile/eas.json` and `app.json`.
- **Workflow**:
  1. Development builds are created using `eas build --profile development`. This creates a custom development client (APK for Android, IPA for iOS) that supports hot-reloading on physical devices.
  2. Production builds are triggered via `eas build --profile production`. This compiles the React Native code into a standalone `.apk` or `.aab` for the Google Play Store, and an `.ipa` for the Apple App Store.
  3. **Over The Air (OTA) Updates**: Because Expo is used, minor JavaScript and CSS changes can be pushed directly to users' phones without going through the App Store review process (using `expo-updates`).

---

## STEP 10 — EXTERNAL SERVICES

1. **Supabase (Database Provider)**
   - **Purpose**: Hosts the PostgreSQL database.
   - **Configuration**: Connected via `DATABASE_URL` with `?pgbouncer=true` for connection pooling.
   - **Authentication**: Connects using a secure password encoded in the URI.

2. **Vercel (Hosting Provider)**
   - **Purpose**: Hosts the frontend web application and the BFF API routes.
   - **Role**: Automatically scales serverless API functions to handle traffic spikes.

3. **Figma (Design System Source of Truth)**
   - **Purpose**: Holds the UI designs, colors, typography, and spacing tokens.
   - **Configuration**: Connects via `FIGMA_ACCESS_TOKEN` and `FIGMA_FILE_ID` in the `.env` file.
   - **How it's used**: The project pulls design tokens from Figma via the API to maintain 1:1 parity between design and code.

---

## STEP 11 — FIGMA INTEGRATION

The project implements a **Design-to-Code Pipeline**.

- **Workflow**: 
  1. A designer updates a color (e.g., Primary Brand Color) in Figma.
  2. A developer runs `pnpm figma:pull`.
  3. **`scripts/sync-figma-tokens.ts`**: Connects to the Figma REST API. It fetches the document (or variables) and writes them to a JSON file (`tokens.json`). *(Note: On free Figma plans, it mocks this by generating a static JSON to prove the pipeline works)*.
  4. **`scripts/generate-css.ts`**: Reads `tokens.json` and converts it into CSS variables (e.g., `--brand-primary: #2563eb`).
  5. The CSS is written to `apps/web/src/styles/design-tokens.css` and `apps/mobile/design-tokens.css`.
- **Tailwind Mapping**: `tailwind.config.js` maps Tailwind utility classes directly to these CSS variables (e.g., `colors: { brand: 'var(--brand-primary)' }`).
- **Result**: Changing a color in Figma automatically cascades down to both the Next.js website and the Expo mobile app without manually touching UI code.

---

## STEP 12 — DEPENDENCY ANALYSIS

Key dependencies listed in `package.json` files:

### Root Level
- `turbo` (v2): Core build orchestrator.
- `prisma` (v7.8.0): CLI for database migrations.
- `ts-node`: To run TypeScript utility scripts (like Figma syncing) directly.

### Web App (`apps/web`)
- `next` (v16), `react` (v19): The core React framework.
- `next-auth` (v5 beta): Crucial for session management.
- `@prisma/adapter-pg` & `pg`: Required for Prisma to work efficiently in edge/serverless environments.
- `recharts`: Used for the Spend Analytics and Budget Utilization charts on the dashboard.
- `react-hook-form` & `zod`: Standard libraries for robust form validation (e.g., when creating a PO).
- `lucide-react`: Icon set.
- `bcryptjs`: For hashing passwords.

### Mobile App (`apps/mobile`)
- `expo` (v57), `react-native` (v0.86): Mobile frameworks.
- `nativewind` (v4.2): Enables using Tailwind classes inside React Native components.
- `zustand` (v5): State management for the session token.
- `react-native-chart-kit`: Likely used (or intended) for mobile dashboard charts.
- `expo-secure-store`: Used to securely save the JWT/session token on the mobile device (encrypted using the device's keystore).

---

## STEP 13 — ENVIRONMENT VARIABLES

Located in `.env` at the root.

1. **`DATABASE_URL`**
   - **Purpose**: The connection string used by the Prisma Client at runtime.
   - **Requirement**: Must include `?pgbouncer=true` to route through Supabase's transaction pooler.
   - **Security**: Extremely critical. Grants full read/write access to the database.

2. **`DIRECT_DATABASE_URL`**
   - **Purpose**: Used by the Prisma CLI for `db:push` and migrations.
   - **Requirement**: Bypasses the connection pooler to perform schema changes directly on port 5432.

3. **`FIGMA_ACCESS_TOKEN` & `FIGMA_FILE_ID`**
   - **Purpose**: Authenticates the `figma:pull` script against the Figma REST API.
   - **Security**: Read-only access to Figma files. 

4. **`AUTH_SECRET`** *(Not in .env, but referenced in auth.ts)*
   - **Purpose**: Used by NextAuth to encrypt session cookies. 
   - **Requirement**: Must be set in production via Vercel dashboard.

---

## STEP 14 — CODE QUALITY REVIEW

- **Architecture**: Excellent use of a BFF (Backend-for-Frontend) pattern within a monorepo. Sharing Tailwind configs and UI logic between Web and Native is a modern, scalable approach.
- **Security**: Passwords are appropriately hashed using bcrypt. NextAuth is configured securely using HTTPOnly cookies. However, API routes currently lack robust Role-Based Access Control (RBAC) authorization checks *inside* the route handlers (e.g., verifying `session.user.role === 'PROCUREMENT'`).
- **Performance**: Turborepo caching will significantly speed up CI/CD. The use of Prisma with `pgbouncer` prevents connection exhaustion.
- **Maintainability**: The separation of `apps/` and `packages/` is textbook monorepo design. The Figma design token pipeline ensures the UI remains consistent.

**Suggested Improvements:**
1. Implement Zod validation on API route inputs. Currently, endpoints like `/api/procurement/indents` blindly accept `req.json()` and pass it to Prisma, which could lead to unexpected errors or injections.
2. Centralize RBAC logic into a utility function (e.g., `hasRole(session, ['ADMIN', 'MANAGER'])`) and use it at the top of every protected API route.

---
*End of Part 3. The documentation will conclude in Part 4.*
