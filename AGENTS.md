# Architecture rules

- Privileged Edge Functions must validate the caller's JWT in code and require the database-backed admin role; platform JWT checks are defence in depth.
- Anonymous submissions must pass through validated, rate-limited Edge Functions; browsers never write sensitive tables directly.
- Database API privileges are deny-by-default: grant only operations required by matching RLS policies and trusted server functions.
- Keep tutorial entries in a typed content collection with optional YouTube IDs; missing videos render explicit placeholders, never unrelated footage.
- Keep the prototype work overview in a dedicated display-only component with illustrative data, separate from action-card state, so the landing screen cannot trigger real work or approvals.