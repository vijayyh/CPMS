# CPMS Developer Command Reference

This file contains all the essential commands you will need to run while working on this repository. 
All commands should be run from the **root directory** of the project (`c:\Users\vijay\OneDrive\Desktop\CPMS\cpms>`) using your terminal.

---

## 🎨 Design & Figma Sync

### 1. Update Figma Styles (Free Plan Workflow)
**Command:** `npx ts-node scripts/generate-css.ts`
**When to run it:** Every time you update colors, fonts, or spacing in Figma and export a new `tokens.json` (or `design-tokens.tokens.json`) file into your project.
**What it does:** Reads your exported JSON file and perfectly translates it into CSS variables for both the Web and Mobile apps simultaneously.

### 2. Auto-Sync Figma Styles (Enterprise Workflow)
**Command:** `npm run figma:pull`
**When to run it:** If you upgrade to a paid Figma plan with API Variables access.
**What it does:** Reaches out to the Figma API directly, downloads your variables securely, and generates the CSS files all in one click.

---

## 🚀 Starting the App

### 1. Run the Development Server
**Command:** `npm run dev`
**When to run it:** Whenever you sit down to start coding and want to see your app running on `localhost:3000`.
**What it does:** Starts the local development server for your web and mobile apps, and automatically seeds your database so you can log in.

### 2. Run with Turbo (Faster caching)
**Command:** `npm run turbo-dev`
**When to run it:** Once the project grows very large, you can use Turbo to cache builds and start the server much faster.

---

## 🗄️ Database Management (Prisma)

### 1. Generate the Database Client
**Command:** `npm run db:generate`
**When to run it:** Every time you change your `prisma/schema.prisma` file (like adding a new table or column).
**What it does:** Generates the TypeScript types so your code editor knows exactly what your database looks like and can give you autocomplete.

### 2. Push Changes to the Database
**Command:** `npm run db:push`
**When to run it:** After you change your `prisma/schema.prisma` file and want to actually apply those changes to your live Supabase database.
**What it does:** Syncs your local schema to the actual remote database.

### 3. Open Database Studio (Visualizer)
**Command:** `npm run db:studio`
**When to run it:** When you want to see all the data inside your database visually, like an Excel spreadsheet.
**What it does:** Opens a Prisma Studio UI in your web browser.

---

## 🧹 Code Quality

### 1. Build the App for Production
**Command:** `npm run build`
**When to run it:** When you are ready to deploy the app to Vercel or the App Store.
**What it does:** Compiles all the React code, minifies it, and prepares it for production release.

### 2. Run the Linter
**Command:** `npm run lint`
**When to run it:** Before you push code to GitHub.
**What it does:** Scans your entire codebase for syntax errors, formatting issues, or unused variables and warns you about them.
