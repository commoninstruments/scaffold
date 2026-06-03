# Config Snippets

These are the canonical starting snippets for a new repo.

Adjust names and filters, but do not casually change the overall contract.

## Root `package.json`

```json
{
  "name": "my-project",
  "private": true,
  "packageManager": "pnpm@10.23.0",
  "scripts": {
    "dev": "turbo run dev --filter=web",
    "dev:all": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "howells-biome format --write .",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "check": "pnpm lint && pnpm typecheck && pnpm test",
    "check:affected": "turbo run build lint typecheck test --affected",
    "clean": "turbo run clean --continue=always && rm -rf .turbo",
    "prepare": "husky"
  },
  "devDependencies": {
    "@howells/lint": "^0.1.6",
    "@howells/typescript-config": "^0.1.2",
    "husky": "9.1.7",
    "lint-staged": "17.0.4",
    "tsx": "^4.22.0",
    "turbo": "2.9.12",
    "typescript": "6.0.3",
    "vitest": "^4.1.5"
  },
  "lint-staged": {
    "*.{js,ts,jsx,tsx,json,jsonc,css,md}": "howells-biome format --write --no-errors-on-unmatched"
  },
  "engines": {
    "node": ">=24.15.0 <25"
  }
}
```

Notes:

- replace `web` with the primary app package when needed
- if `test` is expensive, keep `check` light and create a heavier CI-only job
- `pnpm@10.23.0` is the observed majority baseline; move to pnpm 11 only as an intentional cross-repo update
- for published packages that can support Node 22, use `"node": ">=22.22.1"` in the package itself while keeping repo tooling on Node 24

## `.node-version`

```text
24.15.0
```

Keep local development, CI, and deployment runtimes on Node 24 LTS. Do not use Node 26 for the house baseline until it reaches LTS.

## Default workspace shape

For a full-stack product repo, start with the core shape:

```text
apps/
  web/
packages/
  db/
  trpc/                   # typed app API layer
  ui/
  typescript-config/
  tailwind-config/
  env/                    # when typed env is centralized
  motion/                 # when motion tokens/presets are shared
```

Add capability packages only when the repo needs them:

```text
apps/
  storybook/              # when shared UI exists
packages/
  auth/                   # when auth is shared
  ai/                     # only for repo-specific logic above @howells/ai
  mastra/                 # when Mastra owns agent/workflow runtime behavior
  agents/                 # when non-Mastra agent behavior is shared
  mcp/                    # when the repo exposes MCP tools or resources
  assets/                 # when assets are shared
  upload/                 # only if the repo has real upload/media behavior
```

This is a starting shape, not a checklist. Do not create empty packages just to satisfy either diagram.

## `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"

ignoredBuiltDependencies:
  - esbuild
  - sharp
  - unrs-resolver
```

If the repo genuinely needs extra workspaces such as `scripts/*`, add them explicitly.

## Root `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "stream",
  "globalDependencies": ["**/.env", "**/.env.local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"],
      "cache": false
    },
    "dev": {
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "cache": false,
      "persistent": true
    },
    "start": {
      "dependsOn": ["build"],
      "cache": false,
      "persistent": true
    },
    "lint": {
      "cache": false
    },
    "typecheck": {
      "cache": false
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**", "playwright-report/**", "test-results/**"],
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
```

Only add task-level `env` when a task actually needs it.

## Root `biome.json`

For a Next.js monorepo:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.14/schema.json",
  "extends": [
    "@howells/lint/biome/core",
    "@howells/lint/biome/react",
    "@howells/lint/biome/next"
  ],
  "files": {
    "includes": [
      "apps/**",
      "packages/**",
      "*.json",
      "*.md",
      "!**/.next/**",
      "!**/dist/**",
      "!**/storybook-static/**"
    ]
  },
  "root": true
}
```

The schema URL should track the Biome version pinned by `@howells/lint`. Do not bump it separately from the house lint package.

For a non-UI or mixed repo, start with just:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.14/schema.json",
  "extends": ["@howells/lint/biome/core"],
  "root": true
}
```

## Root `tsconfig.json`

For a UI-oriented monorepo root:

```json
{
  "extends": "@howells/typescript-config/bundler-dom-app",
  "compilerOptions": {
    "baseUrl": "."
  },
  "exclude": [
    "node_modules",
    "**/node_modules",
    "**/.next",
    "**/dist",
    "**/storybook-static"
  ]
}
```

For a Next.js app leaf:

```json
{
  "extends": "@howells/typescript-config/nextjs",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

For a React library leaf:

```json
{
  "extends": "@howells/typescript-config/react-library",
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

For a non-DOM package:

```json
{
  "extends": "@howells/typescript-config/bundler-no-dom-library-monorepo",
  "include": ["src/**/*.ts"]
}
```

## `components.json` for UI repos

Use this when the repo owns a local shared UI package seeded from the bundled UI baseline:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "packages/tailwind-config/shared-styles.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "packages/ui/src/components",
    "utils": "packages/ui/src/lib",
    "ui": "packages/ui/src/components",
    "lib": "packages/ui/src/lib"
  }
}
```

If the repo has its own local UI package, keep aliases aligned to that package rather than scattering local component paths across apps.

## `.husky/pre-commit`

```sh
pnpm lint-staged
pnpm lint
pnpm typecheck
```

Use this as the default. Only make it heavier when the repo truly needs that pressure.

## `.husky/pre-push`

Optional heavier gate:

```sh
pnpm lint || exit 1
pnpm typecheck || exit 1
pnpm test || exit 1
```

## Envy env boundary

Use this shape for repos with runtime env:

```ts
// packages/env/src/schema.ts
import { defineEnv, v } from "@howells/envy";
import { z } from "zod";

export const envSchema = defineEnv({
  server: {
    DATABASE_URL: v(z.url()),
  },
  public: {
    NEXT_PUBLIC_APP_URL: v(z.url()),
  },
});
```

```json
{
  "scripts": {
    "env:check": "envy check local --schema packages/env/src/schema.ts",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm env:check"
  }
}
```

For provider checks, prefer Envy's Vercel or Railway adapters over hand-written shell scripts.

## Assistant MCP config for Agentation

Use assistant-specific MCP config only for repos that want project-local Agentation MCP wiring. For Codex:

```toml
[mcp_servers.agentation]
command = "npx"
args = ["-y", "agentation-mcp", "server"]
```

## Next.js root layout snippet for Agentation

For App Router repos that use Agentation in development:

```tsx
import { Agentation } from "agentation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
```

Not every repo should have this.

## Minimal `AGENTS.md`

```md
# Project Instructions

- Continually explain what you are doing, especially with long and complex tasks.
- Prefer `rg` for search.
- Use `apply_patch` for file edits.
- Never add generic starter code when project-local patterns already exist.
```

Keep this short. It should constrain agent behavior, not restate your whole engineering philosophy.
