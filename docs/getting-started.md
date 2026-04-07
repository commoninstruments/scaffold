# Getting Started

Use this sequence when creating a new repo.

## 1. Choose the repo shape

Default to a `pnpm` monorepo:

```text
apps/
packages/
docs/
```

Only add more top-level globs when the repo genuinely needs them.

## 2. Decide whether this is a UI project

If the project ships a UI:

- use `patternmode` as the upstream for shared UI
- default to Next.js App Router
- keep shared primitives in a package, not in the app
- include Storybook when the repo exports reusable UI

If the project is not UI-first:

- still use the same `pnpm`, TypeScript, Biome, Husky, and Turbo baseline
- prefer thinner workspace structure and fewer packages

## 3. Create the baseline files first

Start with these files before writing app code:

- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `biome.json`
- `tsconfig.json`
- `components.json` for UI repos
- `.husky/pre-commit`
- `AGENTS.md`

Use the snippets in [Config Snippets](./reference/config-snippets.md).

## 4. Install the shared config packages

For the current house baseline:

- `@howells/lint`
- `@howells/typescript-config`
- `turbo`
- `typescript`
- `husky`
- `lint-staged`

Do not start by hand-rolling repo-local lint or tsconfig wrappers.

## 5. Keep the scripts standard

At the root, keep these script names unless the repo has a real reason not to:

- `dev`
- `dev:all`
- `build`
- `lint`
- `format`
- `typecheck`
- `test`
- `check`
- `check:affected`
- `clean`
- `prepare`

The exact commands can vary by repo, but the script contract should stay stable.

## 6. Add the agent and rules layer deliberately

For repos that will use Codex and Arc heavily:

- add `AGENTS.md`
- add `.ruler/` or rules only if you want enforced local standards
- add `rules:apply` only when the repo really depends on that workflow

Do not cargo-cult the full `materia` rules system into every project.

## 7. Verify the baseline before feature work

Before real implementation begins, these should work:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

If those commands are already messy on day one, the repo standard is wrong.
