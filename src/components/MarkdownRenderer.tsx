import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = ''
}) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
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
          p: ({ children }) => (
            <p className="mb-4 last:mb-0">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc mb-4 ml-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal mb-4 ml-6">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="mb-1">{children}</li>
          ),
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
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-8 border-border" />,
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
        {content}
      </ReactMarkdown>
    </div>
  );
};
