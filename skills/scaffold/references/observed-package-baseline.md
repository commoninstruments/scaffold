# Observed Package Baseline

This is the compact signal from the direct package inventory generated on `2026-05-17`.

Scope:

- projects under `~/Sites` touched since `2026-01-17`
- direct manifests only
- generated/runtime directories excluded
- Composer `vendor` and legacy PHP/Craft surfaces ignored for new-project defaults

## Inventory Counts

- Touched project directories: 118
- Projects with dependency manifests: 102
- Direct manifests parsed: 595
- Unique direct dependency packages: 2,105

## Strongest Defaults

The strongest direct-dependency signals are:

| Package | Projects | Interpretation |
|---------|----------|----------------|
| `typescript` | 90 | TypeScript is the universal baseline |
| `react` | 80 | React is the default UI runtime |
| `tailwindcss` | 75 | Tailwind is the default styling layer |
| `next` | 72 | Next.js is the default app/docs surface |
| `zod` | 54 | Schemas are a cross-cutting default |
| `@howells/lint` | 48 | House lint config is real shared infrastructure |
| `lucide-react` | 48 | Lucide is the default icon set |
| `vitest` | 47 | Vitest is the default test runner |
| `turbo` | 45 | Monorepo orchestration is normal |
| `motion` | 44 | Motion is the default animation library |
| `tsx` | 43 | TypeScript scripts are common enough to include |
| `@howells/typescript-config` | 40 | House tsconfig presets should be default |
| `drizzle-orm` | 33 | Drizzle is the default ORM/query layer |
| `@neondatabase/serverless` | 31 | Neon is the default serverless Postgres target |
| `ai` | 22 | AI SDK is part of the normal app surface |
| `@mastra/core` | 18 | Mastra is a real agent/workflow default when needed |
| `@modelcontextprotocol/sdk` | 18 | MCP is a recurring integration surface |

## Practical Reading

For new TypeScript product work, start from:

- `pnpm`
- TypeScript
- Next.js App Router
- React
- Tailwind 4
- Radix/shadcn-style primitives through a shared UI package
- `@howells/lint`
- `@howells/typescript-config`
- Turbo
- `tsx`
- Vitest
- Playwright when the repo has browser-level behavior
- Drizzle and Neon for persistence
- `tRPC` and React Query for typed app data flows
- `@howells/envy` for runtime environment handling
- `@howells/ai`, AI SDK, Mastra, and MCP packages when agent behavior is part of the product

This does not mean every package belongs in every repo. It means these are the defaults that now require the least justification.
