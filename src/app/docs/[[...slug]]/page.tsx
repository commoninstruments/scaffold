import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";

import { getMDXComponents } from "@/components/mdx";
import { source } from "@/lib/source";

interface DocPageProps {
  readonly params: Promise<{
    readonly slug?: string[];
  }>;
}

export const generateStaticParams = () => source.generateParams();

export const generateMetadata = async ({ params }: DocPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    return {};
  }

  return {
    description: page.data.description,
    title: page.data.title,
  };
};

const DocPage = async ({ params }: DocPageProps) => {
  const { slug } = await params;

  if (!slug) {
    redirect("/docs/overview");
  }

  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
};

export default DocPage;
