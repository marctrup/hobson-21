# Press coverage and article validation

## Outcome
Make the Property Investors Bureau publication clearly visible on both the relevant Hobson article and `/press`, while strengthening the article’s search-engine signals.

## Changes
- Refine the existing `/press` Independent Coverage entry to match the supplied publication title, author, date, external link, and internal Hobson article link.
- Add a restrained “Also published by Property Investors Bureau” strip below the article byline, with an external-link icon and a new-tab link.
- Apply the supplied article title, description, canonical URL, indexability, single-H1 treatment, and connected Article, Person, and Organization structured data for this specific article.
- Add the “About Marc Trup” author section and natural links to the founder page and relevant Hobson solution pages.
- Confirm the article remains linked from the blog index and sitemap.
- Add this dynamic article route to crawler-ready snapshot generation so its full rendered text and metadata are present in initial HTML.

## Technical details
- Scope the PIB strip, metadata overrides, and author section to `/blog/how-ai-recognises-patterns-tenancy-agreements` only.
- Reuse existing Editorial Stationery tokens and components; no large promotional banner.
- Preserve the database-authored article body rather than duplicating or rewriting it in frontend code.
- Verify desktop and mobile rendering, external/internal link targets, one H1, canonical metadata, structured data, initial snapshot content, and the full frontend regression suite.
