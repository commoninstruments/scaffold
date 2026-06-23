import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkdownContent } from "../../../components/markdown-content";
import { SiteShell } from "../../../components/site-shell";
import { getDoc, getDocs } from "../../../lib/docs";

interface DocPageProps {
  readonly params: Promise<{
    readonly slug: string[];
  }>;
}

export const generateStaticParams = async () => {
  const docs = await getDocs();
  return docs.map((doc) => ({ slug: doc.slug }));
};

export const generateMetadata = async ({ params }: DocPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const doc = await getDoc(slug);

  if (!doc) {
    return {};
  }

  return {
    description: doc.entry.description,
    title: doc.entry.title,
  };
};

const DocPage = async ({ params }: DocPageProps) => {
  const { slug } = await params;
  const [doc, docs] = await Promise.all([getDoc(slug), getDocs()]);

  if (!doc) {
    notFound();
  }

  return (
    <SiteShell activeHref={doc.entry.href} docs={docs}>
      <MarkdownContent content={doc.content} />
    </SiteShell>
  );
};

export default DocPage;
