import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  readonly content: string;
}

export const MarkdownContent = ({ content }: MarkdownContentProps) => (
  <article className="markdown max-w-3xl">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </article>
);
