# Language Addition Template

Use this checklist when adding a new language to the Hobson AI website.

---

## Quick Setup (3 Steps)

### Step 1: Create Content File
Copy `content.ts` → `content-[code].ts` (e.g., `content-fr.ts`, `content-ae.ts`)

### Step 2: Register in LanguageContext
File: `src/contexts/LanguageContext.tsx`
```typescript
import { CONTENT_XX } from '@/config/content-xx';

const contentMap = {
  en: CONTENT,
  de: CONTENT_DE,
  xx: CONTENT_XX,  // Add new language
};
```

### Step 3: Add to Language Selector
File: `src/components/Homepage.tsx` (search for `languages` array)
```typescript
{ code: 'xx' as const, name: 'Language Name', flag: (/* SVG flag */) },
```

---

## Content File Structure

Your `content-[code].ts` file contains these sections to translate:

### Core Sections
| Section | Description | Lines (approx) |
|---------|-------------|----------------|
| `seo` | Page title, meta description | 2 strings |
| `header` | Logo alt text, navigation labels | 4 strings |
| `hero` | Main headline, subtitle, CTA button | 4 strings |
| `heroVisualization` | Demo UI text, labels | ~15 strings |
| `howItWorks` | Section title, 3 step descriptions | 8 strings |
| `cta` | Call-to-action section | 3 strings |

### Pricing Section
| Section | Description | Lines (approx) |
|---------|-------------|----------------|
| `pricing.title/subtitle` | Section headers | 5 strings |
| `pricing.billingToggle` | Monthly/Annual labels | 3 strings |
| `pricing.plans.*` | 4 plan names, taglines, features, buttons | ~25 strings |

### Features Section
| Section | Description | Lines (approx) |
|---------|-------------|----------------|
| `features.title/subtitle` | Section headers | 2 strings |
| `features.showcase` | Chat panel demo text | 8 strings |
| `features.cards` | 4 feature cards with titles, descriptions, features | ~40 strings |

### Forms & Dialogs
| Section | Description | Lines (approx) |
|---------|-------------|----------------|
| `form` | Pilot application form labels, placeholders | ~25 strings |
| `dialogs` | Success/anti-bot dialog text | 8 strings |
| `toasts` | Error/success messages | 4 strings |
| `contact` | Contact page form, validation, success messages | ~25 strings |

### Navigation & Footer
| Section | Description | Lines (approx) |
|---------|-------------|----------------|
| `navigation.links` | 3 nav items with labels and titles | 3 objects |
| `sharedFooter` | All footer text (product, company, copyright) | 12 strings |

### Chatbot
| Section | Description | Lines (approx) |
|---------|-------------|----------------|
| `chatbot` | Title, welcome message, placeholder, tooltips, errors | 8 strings |
| `chatbot.quickQuestions` | 36 FAQ questions with full/short versions | 36 objects |

---

## Additional Considerations

### 1. Currency & Pricing
In `pricing.plans`, update:
- `currency`: Symbol (e.g., "€", "$", "AED")
- `currencyPosition`: "before" or "after"
- `priceMonthly` / `priceAnnual`: Converted amounts

### 2. Feature Visibility (IMPORTANT)
**By default, non-UK sites only show Contact in navigation.** Blog and Learn are hidden.

This is already configured in `src/components/Homepage.tsx`:
```typescript
const hideExtraNavItems = isGerman || isUAE || isNewLanguage; // Add your language here
```

Files to update when adding a new language:
- `src/components/Homepage.tsx` - Add to `hideExtraNavItems` check (desktop & mobile nav)
- `src/components/GlobalHeader.tsx` - Add language check if using GlobalHeader
- `src/components/homepage/HomepageFooter.tsx` - Add language check for footer links

To re-enable Blog/Learn for a specific language later, simply remove it from the `hideExtraNavItems` check.

### 3. RTL Languages (Arabic, Hebrew, etc.)
Additional setup required:
- Add `dir="rtl"` to HTML element
- Mirror layouts in CSS
- Consider RTL-aware components

### 4. Images with Text
Check if any images contain baked-in text:
- `src/assets/` - Application assets
- `public/` - Static assets

If so, create localized versions and conditionally import.

### 5. Chatbot Behavior
The chatbot edge function (`supabase/functions/hobson-chat/index.ts`) automatically:
- Detects input language
- Responds in the detected language

No changes needed unless you want language-specific FAQ content.

---

## Testing Checklist

After adding a new language:

### Desktop Testing
- [ ] Language appears in dropdown selector
- [ ] All navigation items translated
- [ ] Hero section displays correctly
- [ ] Pricing shows correct currency
- [ ] All form labels translated
- [ ] Footer links and text translated
- [ ] Chatbot UI shows translated text
- [ ] Chatbot quick questions in new language
- [ ] Contact page fully translated
- [ ] Hidden features work correctly (if applicable)
- [ ] No broken layouts or overflow issues

### Mobile Testing
To test on mobile dimensions in Lovable:
1. Click the phone/tablet/computer icon above the preview window
2. Select mobile or tablet view

- [ ] Language selector accessible in mobile menu
- [ ] Mobile navigation shows correct translated items
- [ ] Hero text fits without overflow
- [ ] Pricing cards stack correctly
- [ ] Forms are usable on small screens
- [ ] Footer links readable and tappable
- [ ] Chatbot opens and works on mobile
- [ ] No horizontal scroll issues

---

## File Reference

| File | Purpose |
|------|---------|
| `src/config/content.ts` | Master English content |
| `src/config/content-de.ts` | German content |
| `src/config/content-[code].ts` | New language content |
| `src/contexts/LanguageContext.tsx` | Language switching logic |
| `src/components/Homepage.tsx` | Language selector UI |
| `src/components/GlobalHeader.tsx` | Header navigation |
| `src/components/homepage/HomepageFooter.tsx` | Footer |
| `src/components/HobsonChatbot.tsx` | Chatbot UI |
| `supabase/functions/hobson-chat/index.ts` | Chatbot backend |

---

## Estimated Translation Effort

| Category | String Count |
|----------|--------------|
| Core UI | ~50 strings |
| Pricing | ~30 strings |
| Features | ~50 strings |
| Forms & Dialogs | ~60 strings |
| Navigation & Footer | ~15 strings |
| Chatbot | ~45 strings |
| Chatbot FAQs | 36 × 2 = 72 strings |
| **Total** | **~320 strings** |

---

*Last updated: Based on content.ts structure*
