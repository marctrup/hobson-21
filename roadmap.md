# Roadmap

## Back Office — classroom Phase 1A
- [x] Replace the entrance with the classroom layout, five section tabs and six exact supplied owl images, retaining the admin gate and existing destinations.
- [x] Verify desktop/mobile arrangement, private entrance and layout-only selection; 19 checks pass, all six hosted images return 200 image/png, preview build clean. Local screenshot checks used exact uploaded-image responses because localhost does not serve hosted asset URLs. Not published.
- [ ] Add animations and destination transitions only after Marc approves the Phase 1A classroom arrangement.

## Prototype Contacts — Places view removed
- [x] Remove the Places view and its tab, leaving one directory with a search field; a place named in conversation now filters that directory. 8 checks pass; browser verified no Places control, filtered answers and unchanged person cards. Not published.

## Prototype Unit — compliance responsibilities and preferred contacts
- [x] Add read-only Compliance Responsibilities and Preferred contacts sections at Unit Group and Unit level from one typed simulated module (scoped records, shared Legionella referenced not duplicated, Flat's plumbing exception overrides the group default, no dashboard/dates/statuses). Label renamed from "Legal responsibilities" to "Compliance Responsibilities" on request.
- [x] Verify group, Gym and Flat views in the preview; 63 Prototype Unit checks pass and the build is clean. Not published.

## Homepage — customer testimonials
- [x] Redesign as two equal remarks (no ranked weight) with the user's new attributions ("CEO of a Family Office", "CEO of a large central London commercial agent"); two columns on desktop, stacked on mobile.
- [x] Verify wording, attributions, placement, both widths in the preview; homepage checks pass and the build is clean. Not published.


## Prototype Work — ongoing and completed overview
- [x] Simplify to two job views with an Ongoing attention filter, parent-job entry and consistent deduplicated briefing counts.
- [x] Verify filtering, search, parent-first navigation, dynamic decisions and completed-lease navigation in the live preview without page errors; all 246 frontend checks pass and preview is clean. Prototype Unit unchanged; not published.

## Prototype Work — tenancy renewal alignment
- [x] Align the renewal briefing and focused subtasks while preserving paper review, conversation, draft and approval state.
- [x] Verify starts, evidence, Side Letter finding/uncertainty, contextual guidance and edited-email approval/history round trips in the browser without errors; 132 component checks pass, preview clean. Prototype Unit and Burlington Gardens unchanged; not published.

## Prototype Work — working and not commenced
- [x] Add an independent not-commenced scenario with explicit, recorded internal start actions and planned journeys; retain the earlier scenario.
- [x] Verify both starts, parent status and scenario restoration in the browser without errors; 126 component checks and 22 activity/lifecycle checks pass, preview clean. Prototype Unit unchanged; not published.

## Prototype Work — focused subtasks
- [x] Separate each roof activity from the parent briefing, retaining requested evidence, guidance, controls and job-level history.
- [x] Verify all three journeys, evidence and edited-notification approval in the browser without page errors; component regression checks and state/authority tests pass, preview clean. Prototype Unit unchanged; not published.

## Prototype Work — clear activity journeys
- [x] Add independent roof-activity timelines with requested evidence and existing approval views.
- [x] Verify action-specific approval, contact holds, fresh attempts and overview consistency; 228 frontend tests pass and all three activities plus edited-notification sending verified in-browser without page errors. Prototype Unit unchanged; not published.

## Prototype Documents — adding a paper
- [x] Move PDF image decoders to public/wasm and fetch after client mount; no source binary imports remain, genuine lease rendering and Stage 1 browser flow pass, eleven tests pass and preview build is clean. Not published.
- [x] Implement and verify the local Stage 1 conversation, paper selection, confirmation/change and restart; eleven focused tests pass, example and arbitrary-upload paths checked in-browser with no page errors. Not published.
- [x] Use the supplied genuine Russell Square House PDF for the example and seventy-page preview; hosted asset confirmed as application/pdf, real cover visually checked, PDF decoders bundled and small-screen controls corrected. Local browser checks replayed the hosted PDF response because localhost does not serve the hosted asset path.

## Prototype Unit — publishing password
- [x] Configure a separate server-held Unit password and admission flag; 34 targeted checks passed and browser verified wrong-password refusal, configured-password admission, reload persistence and independent Work protection. Password verification deployed; website not published.

## Prototype Unit — Paragon map entry
- [x] Open on the full map with the existing Paragon sample marker and conversational setup invitation; add an illustrative group cover. All 33 targeted checks pass; browser verified opening, photograph loading, returning to the full map and starting setup with no page errors. Not published.

## Prototype Unit — description reuse and photographs
- [x] Enable copying current details and descriptions without separate Save, retaining replacement approvals.
- [x] Add session-only Unit photographs, main-photo thumbnails and compact map reference; preserve Unit Group covers.
- [x] All 73 Prototype Unit checks pass; browser verified draft copying, three-photo upload, main selection, preview, navigation, creation and unchanged group cover with no page errors. Not published.

## Prototype Unit — guide a useful building answer
- [x] Clarify the building question with quiet examples; propose named, classified Units from short descriptions and retain focused follow-up context. All 41 focused checks pass; browser verified twelve-Unit mixed-use proposal, twelve offices from a kinds follow-up, floor clarification, local confirmation, divider and reset with real map tiles and no page errors. No records created; not published.

## Prototype Unit — postcode lookup enhancement
- [x] Add six simulated postcode choices with four initially visible, context-aware flat selection and approximate search-area map; preserve confirmation, building setup and navigation. All 33 focused checks pass; private-entrance browser walkthrough verified choices, both Flat 2 paths, filtering, rejection, postcode continuation and existing building proposal with loaded map tiles and no page errors. No records created; not published.

## Prototype Unit — understanding the building
- [x] Extend confirmed Finchley Road Stanley House with natural building descriptions, provisional architectural grouping and focused clarification; map, reset and other paths preserved with no records created. All three examples, unexpected input, divider resizing and restart verified in the browser without page errors; 27 focused checks pass. Not published.

## Prototype Unit — intelligent address discovery
- [x] Add illustrative Finchley Road lookup records, natural and partial address handling, candidate selection and explicit confirmation; all five supplied inputs, postcode continuation, rejection, correction and map states verified in the browser with no page errors. Twenty focused checks pass; no records created, Prototype Work untouched, Iteration 3 not started. Not published.

## Prototype Unit — map as part of the conversation
- [x] Keep the real map visible throughout; animate the Stanley House proposal, use a compact adjacent label and distinct confirmed marker, preserve correction and unknown-address safeguards, and stop before structure setup. Nine focused tests pass; tiles, confirmation, correction, return to the example, persistent map and divider resizing verified in the browser without page errors. Not published.

## Prototype Unit — finding the location
- [x] Extend only Unit Group setup with an address conversation, a Stanley House map proposal, explicit confirmation and correction; preserve other paths and create no records. Nine focused tests pass; real map tiles, proposal, alternative-address safeguards, return to the example, confirmation, divider resizing and restart verified in the browser without runtime errors. Not published.

## Prototype Unit — conversation-first entry
- [x] Remove the Portfolio Add button, open with Hobson's invitation and a quiet suggested reply, preserve the three acknowledgements and typed input, and verify the map remains unchanged. Five focused tests pass; private entrance, all choices, restart and typed replies verified in the browser without errors. Not published.

## Prototype Unit — opening setup conversation
- [x] Add the Portfolio action and three local conversational choices with individual acknowledgements, allow restarting, and preserve the map and Prototype Work. Four focused tests pass; all three responses and restart checked in the browser with no errors. Not published.

## Rename /prototype to /prototype-work
- [x] Move the gated demonstration to /prototype-work; /prototype redirects there rather than 404, robots.txt disallows the new address, and the pass phrase gate is unchanged. 60 component tests pass, build clean, redirect/gate/work surface checked in a test browser. Not published.
- [x] Remove every trace of the two retired prototype pages — routes, redirects and robots.txt entries gone.



## Iteration 22A — use known paper context
- [x] Show distinct illustrative receipt, identification/linking and effect-check states; auto-file the established happy path, isolate the uncertain-placement preview, remove repeated chat prompts, and preserve renewal findings and approvals. Browser flow verified through the private entrance; not published.

## Iteration 22 — identify, place and link the Side Letter
- [x] Add illustrative identification and confirmed filing through the existing Desk, with alternative places, mismatch safeguards and one shared record; pending review, original findings and other work preserved. 49 checks pass; attachment, mismatch, filing, job Papers and reopening verified through the private entrance; preview clean. Not published.

## Visible chat paperclip
- [x] Show the sample-paper paperclip in ordinary Hobson chat as well as renewal guidance; reuse the existing receipt flow; 32 tests pass and build is clean. On-screen review remains blocked by the private entrance.

## Retire the Nugent Terrace rent conversation
- [x] Remove the prefilled Flat 2 rent question and its dedicated scripted reply, references and download controls; current work and ordinary chat preserved; 49 component tests pass and build is clean. Browser review could not pass the private entrance while its verification remained pending.

## Remove "chat is locked" from the prototype
- [x] Replace every locked composer with a working chat box that answers honestly for the current view; 70 tests pass (one new composer test) and sending was checked in a test browser.

## Resizable prototype work area
- [x] Reflow overview and all three journeys to their available width as the divider moves; 17 focused tests pass, browser dragging verified at 427px and 966px work widths with no overflow and preserved evidence/selection.

## What I'm Up To on phones
- [x] Make the overview, journeys, papers and guidance comfortable on narrow screens; 36 focused tests pass and flows verified at 320, 390, 768 and 1280px, preserving the simulations.

## Prototype privacy gate

- [x] Put /prototype behind a server-verified pass phrase so a direct address never reveals the demonstration; entrance only for the session, wrong phrases refused, rate limited, robots.txt disallows the route; 66 tests pass and the closed door verified on screen.
- [ ] Publish when Marc asks, so hobsonschoice.ai/prototype-work shows the current demonstration behind the pass phrase (the old /prototype address now redirects there).

## Glass Workboard — remove roof completion simulation
- [x] Remove only the artificial roof completion controls, outcome and records; investigation and completed Flat 3 lease preserved, shared state-derived counts verified, 22 tests pass and preview flow checked.

## Iteration 20 refinement — completed lease
- [x] Make only The lease, made clear (Stanley House · Flat 3) selectable with three completed activities, consistent illustrative findings and paper references; 21 tests pass, summary/evidence explored on screen and original three accomplishments preserved.

## Iteration 20 correction — completion access
- [x] Connect the existing successful-completion preview beside Preview needs help on the normal lease-review desk; 20 tests pass and on-screen records, overview placement and restored paused investigation verified without changing other behaviour.

## Job Papers / Map toggle
- [x] Add job-scoped Papers / Map controls to the roof-leak and tenancy-renewal headers, preserve journey state and verify both views; 37 tests pass and both map locations and paper previews checked on screen.

## Iteration 20 — successful completion
- [x] Add a reversible completed roof-repair demonstration with on-demand illustrative records, preserved attempts, distinct completed outcomes and shared overview counts; 35 focused tests and the complete on-screen flow verified.

## Iteration 19 — roof leak attempts
- [x] Iteration 19A: compact closing summary, on-demand activity history and retained-knowledge explanation; overview and active behaviour preserved; 30 tests and on-screen flow verified.
- [x] Add confirmed End work and Start again, preserve read-only attempts and unsent drafts, remove ended decisions; 30 focused tests and the complete browser flow pass, including reopening the overview.

## What I'm Up To — work journey
- [x] Implement Iteration 7: keep chat near 30% beside readable work, reduce repeated guidance, and keep the mentioned side letter Awaiting paper without fabricated evidence; focused tests and desktop/tablet interaction checks pass.
- [x] Remove Meet Hobson and Meet my team from /prototype, including their introductory surfaces; direct portfolio entry and absent controls verified.
- [x] Connect header guidance to the existing conversation, simulate the 2024 side-letter instruction once, and verify preserved findings, pause state and paper evidence.
- [x] Make original-lease findings and the unfinished variation check selectable with one inline evidence expansion; verify paper previews and unchanged journey/pause state.
- [x] Replace the individual report layout with a selectable journey and desk; keep pause visible and verify all four steps without changing work status.
- [x] Refine only current work with selectable illustrative papers, original-lease findings and outstanding uncertainty; verify previews and pause behaviour.
- [x] Open the Stanley House tenancy renewal journey with completed findings, paper extracts, current and next work.
- [x] Add illustrative pause/resume and guidance through the existing conversation; verify return navigation and preserved work.

## What I'm Up To — work overview
- [x] Replace only the existing content panel with illustrative Needs you, In progress and Completed work.
- [x] Verify the screen in the existing shell, including scrolling and unchanged navigation.

## Tutorials library
- [x] Add the Tutorials page, connect the Learn tile, and verify layout and related links with clearly labelled video placeholders.
- [x] Add Tutorials to search-engine discovery and refresh crawler copies before publication.

- [x] Tighten flagged database policies and grants
- [x] Restrict privileged database function execution
- [x] Harden edge-function authentication and validation
- [x] Remove or upgrade vulnerable production dependencies
- [x] Re-run security scanners, linter, and regression suites
- [x] Record remaining external platform actions and blockers

## Supabase account actions

- Enable leaked-password protection.
- Reduce one-time-code expiry to the recommended duration.
- Schedule the available PostgreSQL security upgrade.

## Web Summit Lisbon 2026 announcement

- [x] Add announcement strip above the menu, homepage mention and footer link
- [x] Build "Where to meet me" page (/web-summit) with Event structured data, Q&A blocks and email call-to-action
- [x] Add route to sitemap, llms.txt and crawler snapshot list
- [ ] Confirm the stand/meeting point on the day (9 Nov 2026) — spot not known in advance; visitors email rochelle.t@hobsonschoice.ai and Marc confirms when known
- [ ] After the show (ends 12 Nov 2026): remove the EventStrip only (SHOW_EVENT flag); KEEP the /web-summit page — convert it to a post-show recap so the indexed URL and citations stay live (SEO/GEO/AEO value)
- [x] Refresh crawler copies on the next publish so search engines pick up the new page
- [x] Trim repetitive copy on /web-summit: removed the "What I shall show you" and "The particulars" sections; reworded the Q&A to avoid restating the header

- 2026-10-01: Web Summit page — In short + Questions restyled to Editorial manuscript layout (hairline label rule, italic serif answer card, ruled Q&A list with brass CTAs); email removed from body text, kept only in the mailto CTAs. seo:update passed.

## Learn cards (6 Oct 2026)
- [x] Revert card/page headers to Case Studies, Glossary, Tutorials (incl. footer, llms.txt, chatbot knowledge)
- [x] Card descriptions in third person where they were first person
- [x] Iteration 8: morning briefing — new greeting figures, single "Show me what needs me" action opening What I've Done focused on Needs you, chat preserved
- [x] Iteration 10: approval before action — "Preview approval stage" demo in the tenancy renewal journey; draft email preview, "What approving this allows", Approve and send / Change before sending / Not now; Needs you reflects the awaiting approval; investigation state preserved
- [x] Iteration 11: approval as a step within the work journey — extended journey (Completed / Investigation in progress / Prepared / Needs you / Next), "Why I'm asking" and "Before I send" readiness, sticky approval actions, edits gated on readiness, investigation preserved.
- [x] Iteration 12: What I've Done redesigned — briefing, compact Needs you decisions with "Review decision", "What I'm looking after" (one job, one place, activity lines: working/waiting/needs-you), quieter "What I've accomplished"; Flat 6 never duplicated.

- [x] Iteration 13: Burlington Gardens roof leak — one work item with three parallel activities (lease review working, contractor waiting, insurer needs-you); selectable activities change only the desk view; briefing count updated to 5; tenancy renewal unchanged
- [x] Iteration 14: shared roof-leak data source; insurer decision in Needs you (3 decisions); state icons (activity/clock/hand); counts derived; briefing updated to 5 jobs / 3 reviews; Review decision opens roof journey at insurer activity
- [x] Iteration 15: roof leak journey reshaped — Happening now as independent activities (no timeline), What I've done as collapsible selectable history with recorded outcomes on the Desk; selection never changes status
- [x] Iteration 16: Guide Hobson across parallel work — one Guide button, visible "Regarding:" context with scope switch, "Guide this activity" on the lease desk, shopfront-roof instruction (lease only) and investigation-wide contact hold; other activities unchanged, idempotent, state persists across chat/overview
- [x] Iteration 17 — Managing holds and permissions: summary follows the hold; insurer "On hold at your request" with "Still required: Your approval"; lift via "You can contact people again."; hold never equals approval; overview Needs you count follows the hold.

- [x] Iteration 18: When Hobson needs help (roof leak lease review)
- [x] Label renamed "What I've Done" → "What I'm Up To" (overview heading, aria-label, nav rail item, breadcrumb, both "Back to…" buttons, tests). The roof journey's own past-tense "What I've done" history list and the mobile work log keep their wording.
- [x] Hobson's owl in conversations: the purple owl now sits beside Hobson's opening message in every conversation (/prototype-unit and /prototype-work), never repeated beside later messages and never on user messages; later Hobson messages keep alignment with an invisible spacer.
- [x] Owl beside every Hobson turn (user request): the owl now returns with the first message of each of Hobson's turns in both prototype conversations, not just the conversation opening; continuation messages stay aligned with the spacer and user messages still never show it. All 91 checks pass; verified in a test browser on both pages. Not published.

## Prototype Unit — map, Unit details and descriptions
- [x] Add optional physical-details Excel download/upload, identity matching and confirmed review, shared with current Map editors and Chat; retain map and add resettable browser persistence. 57 targeted checks pass; genuine download/upload, replacement approval, direct editing, Chat read-back, fresh download and reload verified in browser. Not published.
- [x] Paragon Centre with gym and illustrative flat, lifted map, compact rows, Unit/occupation hover, inline editor with shared facilities, place context; 54 Unit checks pass, browser verified. Not published.
- [x] Remove Gas supply from Unit facilities: the field, its label and its sample value are gone from the Unit editor, the details model and the demonstration record. 52 Unit checks pass; live preview shows Floor area, Bedrooms, Bathrooms, Shared facilities and Outside space only. Not published.

## Prototype Unit — larger Unit photographs
- [x] Make each Unit's photograph in the units list expand on hover and open large when tapped or clicked, so small thumbnails are usable on mobile.
- [x] Enlarged further on request: hovering or focusing a thumbnail now floats a 480×340 preview beside it (outside the panel, so nothing clips it); clicking or tapping still opens the full view. Verified 478×338 in the live preview at desktop, four thumbnail checks pass, build clean. Not published.

- [x] Replace /prototype-contacts with conversation-led Contacts simulation (people / services / places, spreadsheet review)

## Prototype Compliance — Compliance controls
- [x] Rename the area to "Compliance controls" across the menu, headings, search, buttons and Hobson's copy; note plainly that frequencies are set by hand for now, automatic refreshing from external sources being deliberately not built yet.
- [x] Remove the "Next renewal" and "Where" columns from the list, leaving each control with its renewal frequency and the edit control; six compliance checks pass and the page was checked in the preview. Not published.

## Prototype Compliance — By place as a simple list
- [x] Replace the By place coverage chart with a plain list of each Unit Group and Unit showing only the categories of compliance it needs; nothing else shown, places with nothing recorded say so. Eleven compliance checks pass and the list was verified in the preview. Not published.

## Prototype Contacts — plain Locations card
- [x] Back Office: each selected colleague introduces themselves first using their existing hover contribution and own owl; embedded work and independent prototypes are preserved. All five verified live, return visits show no duplicates, and 12 checks pass. Not published.
- [x] Inside a contact's card show only **Locations**: each place with what they do and where, no pills/arrows, no summary counts, no repeated name; the same list opens full-width under a directory row with a finder for long lists.
- [x] Verified the contact card and an expanded directory row in the live preview (no console errors); contacts checks pass and the build is clean. Not published.
