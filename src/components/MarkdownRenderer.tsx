import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { sanitizeBlogContent } from '@/utils/security';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = ''
}) => {
  // Check if content is primarily HTML (has structural HTML tags, not just inline formatting)
  const hasStructuralHtml = /<(div|section|article|header|footer|table|form)[^>]*>/i.test(content);
  
  // Check if content has markdown syntax
  const hasMarkdownSyntax = /^#{1,6}\s|^\*\*|^\*\s|^-\s|^\d+\.\s|^>\s|\[.*\]\(.*\)/m.test(content);
  
  // If it has structural HTML and no markdown syntax, use HTML renderer
  if (hasStructuralHtml && !hasMarkdownSyntax) {
    const sanitizedContent = sanitizeBlogContent(content);
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  }
  
  // Convert <br> tags to newlines for markdown processing
  const processedContent = content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/gi, ' ');
  
  // Render with react-markdown (supports inline HTML via rehype-raw)
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom heading styles
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-4 mt-6">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mb-3 mt-5">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-2 mt-4">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold mb-2 mt-3">{children}</h4>
          ),
          // Paragraph styling
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed">{children}</p>
          ),
          // List styling
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          // Link styling
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith('mailto:') || href?.startsWith('tel:') ? undefined : '_blank'}
              rel={href?.startsWith('mailto:') || href?.startsWith('tel:') ? undefined : 'noopener noreferrer'}
              className="text-blue-600 underline hover:text-blue-800 hover:no-underline"
            >
              {children}
            </a>
          ),
          // Bold and italic
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          // Code blocks
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm font-mono">{children}</code>
              </pre>
            );
          },
          // Horizontal rule
          hr: () => <hr className="my-8 border-border" />,
          // Images
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="max-w-full h-auto rounded-lg my-4"
              loading="lazy"
            />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
