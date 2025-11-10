// Shared validation utilities for edge functions
import { z } from "npm:zod@3.23.8";

// HTML escape function to prevent XSS in email templates
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .trim()
    .max(50, "Phone must be less than 50 characters")
    .optional()
    .nullable(),
  reason: z.string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message must be less than 5000 characters"),
});

// Pilot application validation schema
export const pilotApplicationSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  company: z.string()
    .trim()
    .min(1, "Company is required")
    .max(200, "Company must be less than 200 characters"),
  role: z.string()
    .trim()
    .min(1, "Role is required")
    .max(100, "Role must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .trim()
    .max(50, "Phone must be less than 50 characters")
    .optional()
    .nullable(),
  preferredContact: z.string()
    .trim()
    .max(50, "Preferred contact must be less than 50 characters")
    .optional()
    .nullable(),
  businessTypes: z.array(z.string()).optional().nullable(),
  website: z.string()
    .trim()
    .max(500, "Website URL must be less than 500 characters")
    .optional()
    .nullable(),
  help: z.string()
    .trim()
    .max(5000, "Help description must be less than 5000 characters")
    .optional()
    .nullable(),
});

// Feature request validation schema
export const featureRequestSchema = z.object({
  title: z.string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string()
    .trim()
    .max(5000, "Description must be less than 5000 characters")
    .optional()
    .nullable(),
  category: z.string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
  author_name: z.string()
    .trim()
    .min(1, "Author name is required")
    .max(100, "Author name must be less than 100 characters"),
  author_id: z.string().uuid("Invalid author ID"),
});
