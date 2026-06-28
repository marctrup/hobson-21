# Hobson's Back Office — Implementation Plan

Reworks the Admin area inside the existing `/prototype` (`src/pages/Prototype.tsx`) in place. No new routes. All existing workflow/page designs (Black Book, Library, Compliance register, Workshop, Actions list) are preserved and become the *contents* of rooms.

---

## Phase 1 — Strip old Admin nav, establish two-region shell

**Files touched:** `src/pages/Prototype.tsx` (Admin branch only).

- Locate the existing Admin view branch (currently: left character rail + per-character page on the right).
- Remove the left-hand character rail/menu entirely from the Admin branch.
- Replace Admin layout with two regions:
  - **LEFT (permanent):** Hobson's existing chat panel (reuse the same chat component/state used elsewhere in `/prototype`, so composer, bubbles, narration, locked-input behaviour and pre-fill all work identically).
  - **RIGHT (single stage):** one container `<BackOfficeStage />` that renders whichever room is currently active.
- Wire the *existing* Magician / Broker / Inspector / Professor work areas to render inside the stage container (no visual redesign — just relocate the mount point).
- Keep breadcrumb + "Exit Admin" affordance at the top of the stage.

**Verify:** No left Admin rail. Hobson chat persists on the left. All four existing admin work areas still reachable and render unchanged inside the right stage.

---

## Phase 2 — The reactive stage

**Files touched:** `src/pages/Prototype.tsx`, new `src/pages/prototype/backOffice.ts` (helper config — see Phase 4).

- Add `activeRoomId` state on the Admin view (default = `"hallway"` on first entry, otherwise `null` returning view).
- Add a topic-detection helper `detectRoomFromMessage(text): roomId | null` driven by trigger phrases from the helper config (contacts/black book → broker, documents/lease → professor, compliance → inspector, workflow/automation → magician, actions/"on my desk" → actions room).
- Hook into Hobson's send-message path inside the Admin view: when a user message matches a helper's triggers, set `activeRoomId` to that helper and push a narration bubble from Hobson ("Let me bring up your black book…").
- Topic switch mid-conversation re-dresses the stage immediately; left chat history is preserved and never reset.
- Transition: 200ms cross-fade; `prefers-reduced-motion` → instant swap. No layout shift on the left.

**Verify:** Asking about contacts, documents, compliance, workflows, or actions swaps the room. Conversation thread on the left is continuous across swaps.

---

## Phase 3 — First-entry hallway vs returning view

**Files touched:** `src/pages/Prototype.tsx`.

- In-memory module-level flag `hasEnteredBackOffice` (NOT localStorage/sessionStorage) inside the prototype module. Persists for the tab session only.
- **First entry** (flag false): stage renders `<Hallway />` — elegant horizontal/grid layout of door cards, each showing the helper's owl visible inside the open doorway, room label, one-line domain. Hobson posts ONE welcome bubble ("Welcome to my back office…"). Set flag true on first render.
- **Returning entry** (flag true): stage renders `<BackOfficeHome />` — compact, calm default: small "Choose a room" strip of helper chips/tiles + a "Back office" breadcrumb home. No welcome bubble replay.
- Breadcrumb "Back office" link returns to hallway view on demand (does NOT replay welcome bubble — only the hallway visual).
- Clicking a door/chip sets `activeRoomId` to that helper. Hobson narrates the entry once.

**Verify:** First admin entry per session shows hallway + one welcome. Leaving a room and clicking "Back office" returns to hallway (no welcome). Reload mid-session = treated as fresh session (acceptable for prototype).

---

## Phase 4 — Extensible helper list + reusable room template

**New file:** `src/pages/prototype/backOffice.ts`

```ts
export type Helper = {
  id: "professor" | "inspector" | "broker" | "magician" | "keeper" | string;
  name: string;            // "The Professor"
  domain: string;          // "Documents & Knowledge"
  tagline: string;         // hallway one-liner
  avatarSrc: string;       // owl image
  themeAccent: string;     // tailwind class for room accent
  triggers: string[];      // phrases that route Hobson to this room
  status: "ready" | "coming-soon";
  renderRoom?: () => JSX.Element; // mounts existing design
  narration: { enter: string };   // Hobson's line on entry
};
export const HELPERS: Helper[] = [ ... ];
```

- Seed with the 5 current helpers; Keeper = `coming-soon` (dimmed door, locked room with friendly "coming soon" panel).
- Hallway maps `HELPERS` → door cards. Layout uses a wrapping grid (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-...`) so 3 or 9 entries both look intentional.
- New `<Room />` template (single component): shared skeleton with corner owl avatar (subtle "working" treatment), breadcrumb, theme accent strip, and a `{children}` slot that renders the helper's existing design via `helper.renderRoom()`.
- Each existing area (Broker contact cards, Professor library, Inspector register, Magician workshop, Actions list) is wrapped via `renderRoom` — no edits to their internals.
- `detectRoomFromMessage` reads `triggers` from the same list — adding a helper auto-extends routing.

**Verify:** Adding/removing an entry in `HELPERS` adds/removes a door + room with no other code change. Coming-soon door renders dimmed and opens a locked-room panel.

---

## Final acceptance

- No left Admin nav anywhere; Hobson permanent on left across all rooms.
- Topic shifts in chat re-dress the stage and Hobson narrates the handoff.
- First entry = hallway + one welcome; later entries = compact home, no replay; hallway reachable via breadcrumb.
- One helper list drives doors, rooms, routing, and narration.
- All existing workflow designs work unchanged inside rooms.
- Keyboard reachable; `prefers-reduced-motion` honoured; no console errors.

---

## Technical notes (non-user)

- All work scoped to the Admin branch of `Prototype.tsx`; non-admin scopes (Portfolio/Property/Unit) untouched.
- Reuse existing chat state — do not fork a parallel chat for Admin.
- Trigger detection: simple lowercase substring match against `triggers[]`; first match wins; ties broken by list order.
- Transition: CSS class swap on stage root with `motion-reduce:transition-none`.
- Owl "working" treatment: existing avatar + a subtle `animate-pulse` ring, disabled under reduced-motion.
- I will implement phases sequentially in one delivery, but commit logically per phase so each can be verified in isolation.
