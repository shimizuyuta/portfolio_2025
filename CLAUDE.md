# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build with Turbopack
npm run lint     # Run Biome linter (no auto-fix)
npm run format   # Format with Biome (writes changes)
```

No test framework is configured.

## Architecture

**Next.js 15 App Router, single-page portfolio site.**

- `src/app/page.tsx` — All page content lives here; sections use anchor IDs (`#about`, `#services`, `#portfolio`, `#faq`, `#contact`)
- `src/app/layout.tsx` — Root layout (client component); owns the mobile menu toggle state and sticky navigation
- `src/components/ui/` — shadcn/ui components (New York style) built on Radix UI primitives
- `src/lib/utils.ts` — `cn()` helper for merging Tailwind classes
- `src/lib/data.ts` — Static data type definitions; currently unused (content is hardcoded in `page.tsx`)

## Key Conventions

- **Linter/Formatter:** Biome (not ESLint/Prettier). Run `npm run lint` to check, `npm run format` to fix formatting.
- **Styling:** Tailwind CSS 4 with OKLch CSS variables for theming. Dark mode via `.dark` class. Use `cn()` for conditional class merging.
- **UI Components:** Add new shadcn/ui components via `npx shadcn@latest add <component>`. Config is in `components.json` (style: new-york, icons: lucide-react).
- **Path alias:** `@/*` resolves to `src/*`.
- **Content language:** Bilingual Japanese/English — maintain the existing mix when editing copy.
