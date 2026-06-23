import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface DocEntry {
  readonly description: string;
  readonly href: string;
  readonly section: string;
  readonly slug: string[];
  readonly title: string;
}

const DOCS_ROOT = path.join(process.cwd(), "docs");
const MARKDOWN_EXTENSION = ".md";
const TITLE_PATTERN = /^#\s+(?<title>.+)$/mu;

const titleFromContent = (content: string, fallback: string): string => {
  const heading = TITLE_PATTERN.exec(content)?.groups?.title;
  return heading ?? fallback;
};

const descriptionFromContent = (content: string): string => {
  const paragraph = content
    .split(/\n{2,}/u)
    .map((block) => block.trim())
    .find((block) => block.length > 0 && !block.startsWith("#") && !block.startsWith("```"));

  return paragraph?.replaceAll(/\s+/gu, " ") ?? "";
};

const titleFromFile = (relativePath: string): string => {
  const base = path.basename(relativePath, MARKDOWN_EXTENSION);
  return base
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const slugFromRelativePath = (relativePath: string): string[] => {
  const withoutExtension = relativePath.slice(0, -MARKDOWN_EXTENSION.length);
  if (withoutExtension === "README") {
    return ["overview"];
  }

  return withoutExtension.split(path.sep);
};

const sectionFromSlug = (slug: string[]): string => {
  if (slug[0] === "reference") {
    return "Reference";
  }

  if (slug[0] === "overview") {
    return "Overview";
  }

  return "Guide";
};

const markdownFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry): Promise<string[]> => {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(DOCS_ROOT, fullPath);

      if (relativePath.startsWith(path.join("reference", "ui-baseline", "source"))) {
        return [];
      }

      if (entry.isDirectory()) {
        return await markdownFiles(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith(MARKDOWN_EXTENSION)) {
        return [fullPath];
      }

      return [];
    }),
  );

  return files.flat();
};

export const getDocs = async (): Promise<DocEntry[]> => {
  const files = await markdownFiles(DOCS_ROOT);
  const entries = await Promise.all(
    files.map(async (file) => {
      const relativePath = path.relative(DOCS_ROOT, file);
      const content = await readFile(file, "utf-8");
      const slug = slugFromRelativePath(relativePath);

      return {
        description: descriptionFromContent(content),
        href: `/docs/${slug.join("/")}`,
        section: sectionFromSlug(slug),
        slug,
        title: titleFromContent(content, titleFromFile(relativePath)),
      } satisfies DocEntry;
    }),
  );

  return entries.toSorted((a, b) => {
    if (a.section !== b.section) {
      return a.section.localeCompare(b.section);
    }

    return a.title.localeCompare(b.title);
  });
};

export const getDoc = async (
  slug: string[],
): Promise<{
  readonly content: string;
  readonly entry: DocEntry;
} | null> => {
  const docs = await getDocs();
  const entry = docs.find((doc) => doc.slug.join("/") === slug.join("/"));

  if (!entry) {
    return null;
  }

  const relativePath =
    entry.slug.join("/") === "overview" ? "README.md" : `${entry.slug.join(path.sep)}.md`;
  const content = await readFile(path.join(DOCS_ROOT, relativePath), "utf-8");

  return { content, entry };
};
