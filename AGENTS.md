# Architecture rules

- Privileged Edge Functions must validate the caller's JWT in code and require the database-backed admin role; platform JWT checks are defence in depth.
- Anonymous submissions must pass through validated, rate-limited Edge Functions; browsers never write sensitive tables directly.
- Database API privileges are deny-by-default: grant only operations required by matching RLS policies and trusted server functions.
- Keep tutorial entries in a typed content collection with optional YouTube IDs; missing videos render explicit placeholders, never unrelated footage.
- Keep the prototype work overview and its work journey in dedicated illustrative components with local pause state, separate from action-card execution and approvals; handle sample guidance through the existing conversation with idempotent local work state so no real work or second chat is introduced.
- The staged, non-AI prototype conversation retains its existing transcript and input: AI Elements/AI SDK transport is incompatible with this simulation-only scope; guidance only unlocks the existing composer for the exact sample instruction, without migrating the chat system.
- Keep finding evidence local to the illustrative work journey with a single active inline expansion, reusing paper previews; inspecting evidence must not execute work or confirm unfinished checks.
- Treat guidance about an unavailable paper as an awaiting-paper state; reuse the existing resizable conversation beside work on desktop and overlay it on narrow screens so guidance never fabricates access or compresses the work surface.
- Keep roof investigation attempts in parent-owned local state shared with the existing composer; terminal end guards and fresh-attempt resets preserve read-only snapshots without leaking old guidance, approvals or pause state into new work or the tenancy example.
- Keep successful roof completion as a parent-owned reversible preview with typed illustrative records and shared count derivation, never mutate attempts; retain the original journey while previewing so returning restores its exact view and controls.