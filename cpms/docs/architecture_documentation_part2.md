# CPMS Technical Documentation – Part 2: Execution, Auth & API

## STEP 4 — FILE BY FILE ANALYSIS (CORE FILES)

While it is impossible to list every single UI file in one document, here is the analysis of the most critical foundational files that dictate how the application behaves.

### `apps/web/src/lib/auth.ts`
- **Purpose**: Configures NextAuth.js (v5 Beta) to handle authentication for the web application.
- **Responsibilities**: Validating user credentials against the PostgreSQL database using Prisma, hashing comparisons via bcrypt, and issuing JWT tokens.
- **Logic**:
  - Uses the `Credentials` provider.
  - Queries `prisma.user.findUnique` for the provided email.
  - Uses `bcrypt.compare` to validate the password hash.
  - Includes `callbacks` for `jwt` and `session` to inject the user's `id` and `role` directly into the token and session object. This is crucial for Role-Based Access Control (RBAC).
- **Security**: Uses a secure `AUTH_SECRET` environment variable to sign the JWT tokens. Passwords are never returned to the client.

### `apps/web/src/lib/prisma.ts`
- **Purpose**: Initializes and exports the Prisma Client.
- **Responsibilities**: Ensuring that only a single instance of the Prisma Client is instantiated during development to prevent connection limit exhaustion due to Next.js Hot Module Replacement (HMR).
- **Logic**:
  - Checks if `globalForPrisma.prisma` exists. If not, it creates a new client using `createPrismaClient()`.
  - Uses `@prisma/adapter-pg` combined with `pg.Pool` connected via `DIRECT_DATABASE_URL` or `DATABASE_URL` to facilitate connection pooling natively in serverless environments.

### `apps/mobile/src/core/api.ts`
- **Purpose**: Wraps the standard `fetch` API for the React Native mobile application to communicate with the Next.js API routes (BFF).
- **Responsibilities**: Injecting authentication tokens, resolving the correct backend URL based on the environment (Local Dev vs. Prod), and handling global 401 Unauthorized responses.
- **Logic**:
  - Dynamically determines the `API_BASE_URL`. In development mode (`__DEV__`), it extracts the IP address from `expo-constants` to route requests from a physical phone to the local laptop's Next.js server (`http://<IP>:3000`).
  - Reads the `sessionToken` from `useAuthStore` (Zustand).
  - Crucially, it sets the `Cookie` header manually (`authjs.session-token=<token>`) to spoof browser behavior, allowing the Next.js NextAuth implementation to authenticate the mobile app without requiring a separate mobile-only JWT architecture.

### `prisma/schema.prisma`
- **Purpose**: Defines the entire database schema for CPMS.
- **Responsibilities**: Generating the Prisma Client types and serving as the source of truth for the database layout.
- **Data flow**: Represents 13+ distinct models across Auth, Vendors, Material Catalog, Projects, Procurement (Indents, PO, GRN), Inventory, and HR.
- **Performance considerations**: Includes indices (implicitly on `@unique` fields) and cascading deletes (`onDelete: Cascade`) to ensure referential integrity (e.g., if a Project is deleted, its Labour logs are deleted).

---

## STEP 5 — EXECUTION FLOW

This outlines the exact flow of data when a user performs a core action: **Raising a Material Indent**.

### The Request Flow (Indent Creation)
1. **User Action**: A Site Engineer clicks "New Indent" on the dashboard (`apps/web/src/app/(app)/dashboard/page.tsx`).
2. **React Renders**: The browser navigates to `/procurement/indents/new` (client-side navigation). A form renders.
3. **User Input**: The user selects a Project, a Material, sets the Quantity, and clicks "Submit".
4. **API Call**: The form's `onSubmit` handler fires a `POST` request to `/api/procurement/indents`.
5. **Next.js Server (BFF)**: The request hits `apps/web/src/app/api/procurement/indents/route.ts`.
6. **Authentication Verification**: Inside the route, `await auth()` is called. NextAuth checks the encrypted `HttpOnly` cookie. If valid, it returns the session (including `user.id` and `user.role`).
7. **Database Query**: The route extracts the `items` array from the request body. It calls `prisma.materialIndent.create()`.
   - It generates an indent number (e.g., `IND-KXYZ`).
   - It assigns `raisedById` from the authenticated session.
   - It performs a nested write: creating the `Indent` and the related `IndentLineItem`s simultaneously within a transaction.
8. **Supabase Responds**: PostgreSQL executes the `INSERT` statements and returns the created record to Prisma.
9. **Server Responds**: The API route returns a `201 Created` JSON response to the client.
10. **UI Updates**: The client receives the 201 response, displays a success toast (via `sonner`), and redirects the user back to the `/procurement/indents` listing page.

---

## STEP 6 — API DOCUMENTATION

The backend consists of Next.js Route Handlers (`app/api/.../route.ts`). All APIs require an authenticated session.

### 1. Authentication (`/api/auth/register`)
- **Endpoint**: `POST /api/auth/register`
- **Purpose**: Register a new employee/user.
- **Input (JSON)**: `name`, `email`, `password`, `role`
- **Authentication**: Public (Currently, though in a real ERP this should be protected to Admin only).
- **Validation**: Checks for missing fields and existing emails.
- **Output (201)**: `{ user: { name, email } }`

### 2. Material Indents (`/api/procurement/indents`)
- **Endpoint**: `GET /api/procurement/indents`
- **Purpose**: Fetch all indents.
- **Query Params**: `?status=PENDING` (optional).
- **Output (200)**: Array of `MaterialIndent` objects, joined with `project`, `raisedBy`, `approvedBy`, and nested `items` (with `material` names).
- **Endpoint**: `POST /api/procurement/indents`
- **Purpose**: Create a new material indent.
- **Input (JSON)**: `projectId`, `requiredBy`, `urgency`, `notes`, `items: [{ materialId, requestedQty, unit, remarks }]`
- **Authentication**: Requires a valid NextAuth session. The `raisedById` is automatically inferred from the session token.
- **Output (201)**: The created `MaterialIndent` object.

### 3. Dashboard Stats (`/api/dashboard/stats`)
*(Inferred from UI requirements)*
- **Endpoint**: `GET /api/dashboard/stats`
- **Purpose**: Populate the KPI Bento grid on the dashboard.
- **Output**: Aggregated data such as `Total Spend`, `Active Vendors`, `Pending Indents`.

---

## STEP 7 — DATABASE

**Database Type**: PostgreSQL (Hosted on Supabase).
**ORM**: Prisma.

### Core Tables & Relationships

1. **`User` Table**: Central authentication table.
   - Contains `role` enum (`ADMIN`, `MANAGER`, `SITE_ENGINEER`, `PROCUREMENT`, `ACCOUNTS`, `VENDOR`, `EMPLOYEE`).
   - Has one-to-many relationships with `Project` (as manager), `MaterialIndent` (as raiser/approver), and `PurchaseOrder` (as creator).

2. **`Vendor` & `VendorContract` Tables**:
   - `Vendor` stores business details.
   - `VendorContract` is a join table linking a `Vendor` to a `Material` with a `negotiatedRate` and `validTo` date.

3. **`Project` Table**:
   - Represents a construction site. Tracks `budget`, `status`, and links to a manager (`User`).
   - Serves as the parent for `SiteInventory`, `MaterialIndent`, and `Labour` logs.

4. **Procurement Tables (`MaterialIndent`, `PurchaseOrder`, `GoodsReceipt`)**:
   - Represent the 3-way matching process in supply chain.
   - **Indent**: Site requests material. (Status: `DRAFT` -> `APPROVED`)
   - **PO**: Procurement orders material from Vendor based on Indent. (Status: `DRAFT` -> `SENT`)
   - **GRN**: Site receives material against PO. (Status: `DRAFT` -> `CONFIRMED`)
   - Each of these has a respective `LineItem` table (e.g., `IndentLineItem`) to allow requesting multiple materials per document.

5. **`SiteInventory` Table**:
   - Tracks stock levels.
   - Uses a composite unique key: `@@unique([projectId, materialId])`.
   - Updated automatically when a GRN is `CONFIRMED` (adds to `currentStock`) or when material is consumed (adds to `consumedStock`).

---

## STEP 8 — AUTHENTICATION

### How Authentication Works (NextAuth + Next.js + React Native)
1. **The Web App Login**:
   - User goes to `/login`.
   - Submits email/password.
   - NextAuth's `CredentialsProvider` intercepts the request.
   - NextAuth validates against the database (`bcrypt.compare`).
   - NextAuth generates a JWT (`session: { strategy: "jwt" }`).
   - A secure `HttpOnly` cookie is set in the user's browser.
   - Protected routes (like `/dashboard`) use middleware or layout checks to verify this cookie.

2. **The Mobile App Login**:
   - User submits credentials on the mobile app.
   - Mobile app makes a standard POST request to `/api/auth/callback/credentials` (NextAuth's default endpoint).
   - The response includes a `Set-Cookie` header.
   - The mobile app intercepts this token and stores it securely using `expo-secure-store` (managed via `authStore.ts`).
   - For all subsequent API requests from the mobile app, `api.ts` attaches this token manually into the `Cookie` header (`authjs.session-token=...`), tricking the Next.js backend into thinking the request is coming from a standard web browser.

### Role Based Access Control (RBAC)
- User roles (`ADMIN`, `MANAGER`, `SITE_ENGINEER`, etc.) are defined in the Prisma Schema.
- In `auth.ts`, the `jwt` callback explicitly adds `user.role` to the token payload.
- In the frontend (e.g., `DashboardPage`), components conditionally render based on `session.user.role`. For example: `const canSeeFinance = isAdmin || isAccounts;` determines if the user sees the "Total Spend" charts.
- API Routes (should) validate the `session.user.role` before allowing mutations, preventing a `SITE_ENGINEER` from approving their own `MaterialIndent`.

---
*End of Part 2. The documentation will continue in the next parts.*
