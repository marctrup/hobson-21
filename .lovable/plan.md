# Security remediation plan

## Outcome
Close the current database, server-function, and package vulnerabilities without removing public blog, status, pricing, contact, newsletter, or chatbot features.

## Work
1. **Tighten database access**
   - Remove direct public access to the chatbot knowledge base, email logs, contact messages, newsletter subscriptions, and reward records; their existing server functions will remain the only entry points.
   - Restrict feature requests, votes, and comments to signed-in users, with ownership checks for changes.
   - Keep deliberately public content readable only through narrow rules or safe public responses, rather than exposing unrestricted tables.
   - Add explicit grants matching every access rule and retain service access for server functions.

2. **Secure privileged database functions**
   - Remove public execution rights from trigger-only and internal privileged functions.
   - Grant signed-in access only to functions the product genuinely calls.
   - Harden role and CRM helpers so callers cannot inspect or alter another person's privileges.
   - Preserve server-only rate limiting and administrative operations.

3. **Secure server functions**
   - Add identity and role checks to privileged functions, including feature notifications and administrative imports/settings.
   - Validate request methods, body sizes, identifiers, and user ownership.
   - Keep intentionally public forms and chatbot endpoints public, but rate-limited and restricted to safe operations.
   - Stop logging personal information where it is not needed.

4. **Remove vulnerable packages**
   - Remove the unused machine-learning package and redundant type package.
   - Upgrade PDF, sanitisation, routing, charting, Markdown, and Supabase packages to patched releases.
   - Apply safe transitive overrides where needed and regenerate the lockfile.

5. **Resolve remaining platform findings**
   - Re-run the database linter, dependency scan, and full security scan.
   - Mark genuinely fixed persisted findings as fixed.
   - Identify any Supabase account settings that cannot be changed from the project—password leak protection, one-time-code lifetime, database version—and give exact dashboard actions rather than claiming they are fixed.
   - Treat deliberately public blog imagery/content as intentional only after confirming no private data is present.

6. **Regression verification**
   - Run frontend tests and all Supabase function tests.
   - Check the preview diagnostics and test key public and signed-in paths affected by the changes.
   - Record the security architecture decisions for future changes.

## Technical notes
- Security will remain deny-by-default: browser clients receive the minimum table and function privileges needed.
- Public submissions will go through validated server functions using server credentials; anonymous users will not write directly to tables.
- Role checks remain database-backed and cannot rely on browser storage.
- Public content stays public, but private operational data and internal configuration will not be enumerable.
