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
  console.log('MarkdownRenderer received content:', content?.substring(0, 100));
  
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-semibold mb-4 mt-6 text-foreground">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 mt-5 text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mb-2 mt-4 text-foreground">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold mb-2 mt-3 text-foreground">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="text-base leading-relaxed mb-4 last:mb-0 text-foreground">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc mb-4 ml-6 text-base">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal mb-4 ml-6 text-base">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="mb-1.5 text-foreground">{children}</li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith('mailto:') || href?.startsWith('tel:') ? undefined : '_blank'}
              rel={href?.startsWith('mailto:') || href?.startsWith('tel:') ? undefined : 'noopener noreferrer'}
              className="text-primary underline hover:text-primary/80 hover:no-underline"
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
            <blockquote className="border-l-4 border-primary pl-3 my-3 italic text-muted-foreground text-sm">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-6 border-border" />,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="max-w-full h-auto rounded-lg my-3"
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
