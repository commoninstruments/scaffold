import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HomeLayout } from "fumadocs-ui/layouts/home";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export const metadata: Metadata = {
  description:
    "Browse the Howells Scaffold baseline for project shape, tooling, package boundaries, agent workflow, and launch readiness.",
  title: "Scaffold",
};

const HomePage = async () => {
  const featured = source
    .getPages()
    .filter((page) =>
      [
        "/docs/getting-started",
        "/docs/reference/repo-archetypes",
        "/docs/reference/stack-decisions",
        "/docs/reference/agent-workflow",
      ].includes(page.url),
    );

  return (
    <HomeLayout {...baseOptions()} className="px-6 py-16">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold tracking-[0.14em] text-faint uppercase">
          Howells Project Baseline
        </p>
        <h1 className="mt-6 text-5xl font-semibold leading-[1.04] tracking-[-0.02em] md:text-7xl">
          Start projects from the same operating baseline.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">
          Scaffold captures the shared defaults for project shape, tooling, package boundaries,
          agent workflow, deployment expectations, and launch readiness.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background"
            href="/docs/overview"
          >
            Read the docs
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold"
            href="/docs/reference/launch-checklist"
          >
            Launch checklist
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-5xl gap-4 md:grid-cols-2">
        {featured.map((page) => (
          <Link
            className="rounded-lg border border-border bg-panel p-5 transition-colors hover:border-accent"
            href={page.url}
            key={page.url}
          >
            <p className="text-xs font-semibold tracking-[0.14em] text-faint uppercase">
              Reference
            </p>
            <h2 className="mt-4 text-2xl font-semibold">{page.data.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
              {page.data.description}
            </p>
          </Link>
        ))}
      </section>
    </HomeLayout>
  );
};

export default HomePage;
