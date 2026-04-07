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
    "dev:all": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "howells-biome format --write .",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "check": "pnpm typecheck && pnpm lint && pnpm test",
    "check:affected": "turbo run build lint typecheck test --affected",
    "clean": "turbo run clean --continue=always && turbo clean",
    "prepare": "husky"
  },
  "devDependencies": {
    "@howells/lint": "^0.1.1",
    "@howells/typescript-config": "^0.1.0",
    "husky": "9.1.7",
    "lint-staged": "^16.2.7",
    "turbo": "2.9.3",
    "typescript": "5.9.3"
  },
  "lint-staged": {
    "*.{js,ts,jsx,tsx,json,jsonc,css,md}": "howells-biome format --write --no-errors-on-unmatched"
  },
  "engines": {
    "node": ">=20.19"
  }
}
```

Notes:

- replace `web` with the primary app package when needed
- if `test` is expensive, keep `check` light and create a heavier CI-only job

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
  "$schema": "https://biomejs.dev/schemas/2.4.10/schema.json",
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

For a non-UI or mixed repo, start with just:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.10/schema.json",
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

Use this when the repo is consuming shared UI from `patternmode`:

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
    "ui": "@patternmode/ui/components",
    "lib": "@patternmode/ui/lib"
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
pnpm typecheck || exit 1
pnpm lint || exit 1
pnpm test || exit 1
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
