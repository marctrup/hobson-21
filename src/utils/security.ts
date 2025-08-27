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

// Check if user has admin role based on user roles data
export function isActualAdmin(userRoles: Array<{ role: string }> | null): boolean {
  return userRoles?.some(role => role.role === 'admin') ?? false;
}