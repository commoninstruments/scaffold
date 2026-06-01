# Architecture Defaults

These are the recurring architecture choices across your active repos.

They are not universal laws. They are the default answers when a new project needs these capabilities and there is no strong reason to do something else.

These defaults intentionally ignore PHP/Craft maintenance surfaces. The useful signal for new work is the direct TypeScript, UI, data, and agent dependency surface.

## Full-Stack TypeScript App

For a serious TypeScript product app, the recurring stack is:

- Next.js App Router
- `tRPC` for the typed API layer
- `@tanstack/react-query` for client data orchestration
- Drizzle for the database layer
- Neon Postgres via `@neondatabase/serverless`

This pattern shows up strongly in current full-stack product apps.

### Default package set

- `@trpc/server`
- `@trpc/client`
- `@trpc/tanstack-react-query`
- `@tanstack/react-query`
- `drizzle-orm`
- `drizzle-kit`
- `@neondatabase/serverless`

### When this is the right default

Use this when:

- the app is TypeScript end to end
- you want typed procedures across server and client
- the team is comfortable with a monorepo or shared package boundary
- the product has real database-backed behavior, not just static pages

### When not to use it

Do not force `tRPC` into:

- static marketing sites
- documentation sites
- tiny apps with only one or two trivial endpoints
- repos where the API must be intentionally language-agnostic from day one

## Database and Persistence

The clear default is:

- Postgres
- Drizzle
- Neon for serverless-hosted Postgres where that model fits

This is one of the strongest repeated patterns in the current portfolio.

## Client State

Use state tools by scope:

- server data: `@tanstack/react-query`
- local cross-component UI state: `zustand`
- URL state: `nuqs` when the app benefits from URL-driven state

Do not use Zustand as a replacement for server data fetching.

## Authentication

The recurring choices are split by product type:

- Clerk for standard app authentication
- WorkOS when the app has enterprise or org-oriented auth requirements

Guideline:

- default to Clerk for user auth in new product apps
- reach for WorkOS when the product clearly needs SSO, org management, or enterprise identity flows

Do not treat both as default dependencies in the same new repo.

## Documentation Sites

When a project needs a proper docs site, the recurring answer is:

- Fumadocs

That already appears in the existing docs-style surfaces across the portfolio.

Use it when:

- the repo is already on Next.js
- the docs are part of the product or developer experience
- search, navigation, and polished docs UX matter

Do not scaffold a docs framework into every repo by default.

## Shared UI Development

When the repo owns reusable UI:

- keep shared components in a package
- use Storybook as the visual contract
- seed new UI-first work from the bundled UI baseline

Storybook is not mandatory for every app. It is mandatory when the repo exports reusable UI that should be reviewed and regression-checked in isolation.

## Component Scaffolding

The recurring pattern is:

- use `shadcn` as a generator
- do not treat `shadcn` output as the design system

That means:

- generate components when it accelerates setup
- immediately align them to shared tokens, wrappers, and repo conventions
- fold recurring generic improvements back into the scaffold baseline where appropriate

## Media and Asset Storage

For projects with serious image, vector, or media needs:

- use `howells/motif` for image generation, editing, utility media tools, and agent-facing creative automation
- use the house media storage platform as the default product recommendation
- use `@howells/stow-server` when a reusable server integration layer is needed
- use `@howells/stow-next` when a Next.js app needs the app-facing media storage integration

Keep the distinction clear: Motif owns generation, editing, upscaling, background removal, image-to-video, model metadata, dry runs, structured CLI output, and MCP tools. The storage platform owns durable storage and delivery.

## AI-Enabled Apps

For apps that genuinely need AI features, the recurring pattern is:

- `ai` for the application-facing AI SDK surface
- `@howells/ai` as the shared AI SDK/provider baseline
- `howells/motif` for fal.ai image-generation and media-utility surfaces
- `zod` for structured input and output contracts

If the repo is doing CLI-model orchestration or needs stricter typed IO around agent calls:

- consider `@howells/envelope`

When the repo is doing real agent orchestration, add Mastra deliberately:

- `@mastra/core` for agent and workflow foundations
- `mastra` for the CLI/dev runtime
- `@mastra/pg`, `@mastra/memory`, or `@mastra/observability` only when those capabilities are present

Put substantial Mastra code in `packages/mastra`, not inside an app route or a generic `packages/agents` boundary. See [Agentic Development](./agentic-development.md).

Use raw provider SDKs only behind a boundary:

- default provider wiring belongs in `@howells/ai`
- project-specific provider composition belongs in `packages/ai`
- app routes should call product services, not create raw OpenAI, Anthropic, or OpenRouter clients inline

## Runtime Environment

Use `@howells/envy` when an app depends on runtime env.

The default shape is a `packages/env` boundary that owns schema definition, parsing, generated Next.js server/client modules, lint helper config, and provider preflight checks. App code should import typed env exports rather than reading `process.env` directly.

## Agent and MCP Surfaces

Recent agent-heavy repos are converging on explicit package boundaries for tool surfaces:

- `packages/ai` for repo-specific model/provider composition above `@howells/ai`
- `packages/mastra` for Mastra runtime code, agents, tools, workflows, storage, memory, observability, scorers, and runtime routes
- `packages/agents` for reusable non-Mastra agent definitions, evaluators, prompts, and tool wiring
- `packages/mcp` or `packages/mcp-server` for MCP server contracts and transport code
- `packages/cli` when the agent or ingestion surface needs a first-class command line

Use `zod` for tool and transport schemas, and keep provider plumbing behind `@howells/ai` instead of scattering raw AI SDK clients through app code.

Use `@modelcontextprotocol/sdk` when the repo exposes MCP tools or resources. Do not bury MCP tool contracts inside a Next.js route unless the route is the only consumer and there is no expected CLI, test, or agent reuse.

## Ingestion and Enrichment

For source-heavy or scraper-heavy repos:

- use a dedicated `ingestion`, `enrichment`, or `scraper` package when pipeline behavior becomes substantial
- consider `@howells/srcfull` for browser/page-source extraction before building a fresh source-fetching layer

## Overlay Model

Use the overlay primitives deliberately:

- ordinary drawer or sheet: shared `vaul`-backed drawer layer
- stacked sheets or nested panel drills: `@howells/stacksheet`
- thumbnail-to-expanded image or video transitions: `@howells/aperto`

This avoids the common mistake of stretching a simple drawer primitive into a multi-layer workflow it was not designed to own.

## Short Version

For a new product app, the default answer is usually:

- Next.js
- `tRPC`
- React Query
- Drizzle
- Neon
- Clerk
- the bundled UI baseline
- `@howells/ai` plus Mastra/MCP packages when agent behavior is part of the product
- Envy if runtime env exists
- Storybook if shared UI exists
- Fumadocs if the repo needs docs
- the house media storage packages if the repo needs media storage

Only deviate when the product constraints actually justify it.

See also:

- [Repo Archetypes](./repo-archetypes.md)
- [Package Boundaries](./package-boundaries.md)
- [Deployment Defaults](./deployment-defaults.md)
