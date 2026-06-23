import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "../components/site-shell";
import { getDocs } from "../lib/docs";

export const metadata: Metadata = {
  description:
    "Browse the Howells Scaffold baseline for project shape, tooling, package boundaries, agent workflow, and launch readiness.",
  title: "Scaffold",
};

const HomePage = async () => {
  const docs = await getDocs();
  const featured = docs.filter((doc) =>
    [
      "/docs/getting-started",
      "/docs/reference/repo-archetypes",
      "/docs/reference/stack-decisions",
      "/docs/reference/agent-workflow",
    ].includes(doc.href),
  );

  return (
    <SiteShell docs={docs}>
      <section className="max-w-4xl">
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

      <section className="mt-20 grid gap-4 md:grid-cols-2">
        {featured.map((doc) => (
          <Link
            className="rounded-lg border border-border bg-panel p-5 transition-colors hover:border-accent"
            href={doc.href}
            key={doc.href}
          >
            <p className="text-xs font-semibold tracking-[0.14em] text-faint uppercase">
              {doc.section}
            </p>
            <h2 className="mt-4 text-2xl font-semibold">{doc.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{doc.description}</p>
          </Link>
        ))}
      </section>
    </SiteShell>
  );
};

export default HomePage;
