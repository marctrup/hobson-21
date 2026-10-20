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
- Keep workload entries in one typed collection shared by overview and briefing count derivation; roof work uses only its parent-owned investigation state, and the completed lease is the read-only completion example.
- Job Papers / Map controls open a context-only layer without navigating the shell or unmounting the journey; use job-specific illustrative papers and explicitly label approximate locations so state is preserved and unrelated evidence is never shown.
- Completed lease exploration uses a read-only journey and one typed illustrative source for findings and cited extracts; opening it never alters work counts or starts another job.
- Keep the prototype demonstration behind a pass phrase verified by a server function; the browser holds only a session flag, and any direct address must reveal the entrance rather than the work.
- On narrow screens, work occupies the available surface and the existing guidance conversation overlays it; shared journey navigation folds into a chooser so the desk remains reachable without changing simulation state.
- Work overview and journey layout breakpoints follow the resizable work container, not the browser width, so dragging the conversation divider preserves a readable desk.
- The ordinary Hobson composer’s sample-paper control opens the existing renewal guidance and receipt flow, so attachments remain job-scoped and never imply real uploads or completed reading.
- Supplied-paper identification and confirmed placement use one parent-owned illustrative record shared by the Desk and existing Papers views; filing never completes examination, and alternative locations never acquire the renewal tenancy link automatically.
