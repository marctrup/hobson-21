import DOMPurify from 'dompurify';

// List of forbidden terms that could be used for impersonation
const FORBIDDEN_DISPLAY_NAMES = [
  'admin', 'administrator', 'mod', 'moderator', 'support', 'staff', 'team',
  'hobson', 'hobsons', 'hobsonschoice', 'hobson\'s choice', 'official',
  'system', 'bot', 'ai', 'assistant', 'service', 'help', 'customer service',
  'root', 'superuser', 'owner', 'founder', 'ceo', 'manager'
];

// Check if a display name contains forbidden terms
export function isDisplayNameAllowed(displayName: string): boolean {
  const normalized = displayName.toLowerCase().trim().replace(/[\s-_.]+/g, '');
  
  return !FORBIDDEN_DISPLAY_NAMES.some(forbiddenTerm => {
    const normalizedForbidden = forbiddenTerm.toLowerCase().replace(/[\s-_.]+/g, '');
    return normalized.includes(normalizedForbidden) || normalizedForbidden.includes(normalized);
  });
}

// Get validation error message for forbidden display names
export function getDisplayNameError(displayName: string): string | null {
  if (!isDisplayNameAllowed(displayName)) {
    return "This display name is not allowed. Please choose a different name that doesn't impersonate staff or system accounts.";
  }
  return null;
}

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: [] // Remove all attributes
  }).trim();
}

// Sanitize rich text content (for descriptions, posts, etc.)
export function sanitizeRichText(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: []
  }).trim();
}

// Sanitize blog content with safe HTML tags for rich content
export function sanitizeBlogContent(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ol', 'ul', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height', 'loading', 'decoding', 'sizes', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button', 'select', 'textarea'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style']
  });
}

// Rate limiting for client-side requests
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const key = `rate_limit_${identifier}`;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
}

// Input validation for search queries to prevent injection
export function validateSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters and limit length
  const sanitized = query
    .replace(/[<>'";&\\]/g, '') // Remove dangerous characters
    .trim()
    .slice(0, 100); // Limit length
  
  return sanitized;
}

// Check if user has admin role based on user roles data
export function isActualAdmin(userRoles: Array<{ role: string }> | null): boolean {
  return userRoles?.some(role => role.role === 'admin') ?? false;
}