# UI Design & Dashboard Layout Rules

When building or updating UI components, especially dashboard cards and grids, ALWAYS refer to [docs/DASHBOARD_UI_GUIDELINES.md](file:///c:/Users/Vedx6/OneDrive/Desktop/CONSRUCTION/cpms/docs/DASHBOARD_UI_GUIDELINES.md) first as the absolute source of truth.

In addition, adhere to these structural formatting rules:

1. **Explicit, Isolated Headers**: Every card MUST have a dedicated header container that separates the title and status badges from the card body.
   - Example class for headers: `border-b border-[var(--bg-border-solid)] bg-[var(--bg-card-solid)] shrink-0` (Combine with explicit inline padding)
   - This ensures card titles never touch or bleed into the borders.

2. **Generous Inner Paddings & Gap via INLINE STYLES (CRITICAL)**: 
   - Due to conflicting Tailwind versions (`3.3.2` and `4.3.3`), Tailwind utility classes for padding (`p-8`, `px-6`) and spacing (`gap-8`) will often fail to compile and be ignored.
   - **YOU MUST ALWAYS USE REACT INLINE STYLES** for critical structural spacing. 
   - Example for card bodies: `style={{ padding: '32px 24px', gap: '32px' }}`
   - Example for card headers: `style={{ padding: '20px 24px' }}`
   - Example for flex containers: `style={{ gap: '16px' }}`

3. **Massive Height Prominence**: Dashboard widgets (especially in the main rows) should have explicit heights using inline styles (e.g., `style={{ minHeight: '420px' }}`) so they look like large, prominent iPad-style widgets. Do not let them shrink dynamically to their content height; they should stretch and cover the remaining viewport symmetrically.

4. **Uniform Movement & Interactions**: Apply consistent hover animations to all interactive panels and cards:
   - `transition-all duration-300 hover:-translate-y-1 hover:shadow-float-md`

5. **Visual Hierarchy & Typography**: 
   - Prevent texts from overlapping or wrapping awkwardly by heavily utilizing `truncate`, `whitespace-nowrap`, and `shrink-0` flex properties.
   - Limit massive font sizes (`text-[64px]`) inside smaller bento boxes; stick to `text-3xl` or `text-4xl` for primary metrics.
   - Prioritize only the top 3 critical cards (e.g., `col-span-4` each) for the top row (Above the Fold) and drop secondary metrics (Earnings, Details) to lower rows (e.g. `col-span-6`) to make the page gracefully scrollable.
