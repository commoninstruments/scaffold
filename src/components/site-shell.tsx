import Link from "next/link";
import type { ReactNode } from "react";

import type { DocEntry } from "../lib/docs";

interface SiteShellProps {
  readonly activeHref?: string;
  readonly children: ReactNode;
  readonly docs: readonly DocEntry[];
}

export const SiteShell = ({ activeHref, children, docs }: SiteShellProps) => {
  const sections = new Map<string, DocEntry[]>();

  for (const doc of docs) {
    const sectionDocs = sections.get(doc.section);
    if (sectionDocs) {
      sectionDocs.push(doc);
    } else {
      sections.set(doc.section, [doc]);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link className="text-sm font-semibold tracking-[0.12em] uppercase" href="/">
            Scaffold
          </Link>
          <Link
            className="text-sm font-medium text-muted hover:text-foreground"
            href="/docs/overview"
          >
            Docs
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <nav aria-label="Project docs" className="space-y-8">
            {[...sections].map(([section, sectionDocs]) => (
              <div key={section}>
                <h2 className="text-xs font-semibold tracking-[0.14em] text-faint uppercase">
                  {section}
                </h2>
                <div className="mt-3 space-y-1">
                  {sectionDocs.map((doc) => {
                    const isActive = doc.href === activeHref;

                    return (
                      <Link
                        className={
                          isActive
                            ? "block rounded-md bg-panel px-3 py-2 text-sm font-medium text-foreground"
                            : "block rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-panel hover:text-foreground"
                        }
                        href={doc.href}
                        key={doc.href}
                      >
                        {doc.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
};
