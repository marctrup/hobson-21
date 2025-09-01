import React from 'react';
import { sanitizeBlogContent } from '@/utils/security';

interface SecureContentRendererProps {
  content: string;
  className?: string;
}

export const SecureContentRenderer: React.FC<SecureContentRendererProps> = ({
  content,
  className = ''
}) => {
  // Sanitize the content to prevent XSS attacks
  const sanitizedContent = sanitizeBlogContent(content);
  
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};