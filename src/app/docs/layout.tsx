import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

interface DocsRootLayoutProps {
  readonly children: ReactNode;
}

const DocsRootLayout = ({ children }: DocsRootLayoutProps) => (
  <DocsLayout {...baseOptions()} tree={source.getPageTree()}>
    {children}
  </DocsLayout>
);

export default DocsRootLayout;
