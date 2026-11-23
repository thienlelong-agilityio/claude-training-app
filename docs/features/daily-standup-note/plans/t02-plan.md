# Plan: T02 Storage notice and sign-in / sign-out persistence
Ticket: [t02-storage-notice-and-sign-in.md](../tickets/t02-storage-notice-and-sign-in.md). Covers: R6, R7, R9, R12. Depends on: T01 ([t01-plan.md](t01-plan.md)).
Status: ready for engineer review.

## Files that change
| File | Change | Why (R / AC) |
|---|---|---|
| `src/lib/storage-notice.ts` | new: pure function that returns the storage line for a signed-out or signed-in learner. No React or DOM imports | R9, T02 AC1, AC2, AC3 |
| `src/lib/storage-notice.test.ts` | new: Vitest cases for the two lines | R9, T02 AC1 to AC3 |
| `src/components/StorageNotice.tsx` | new: client component that reads the signed-in state and shows the line | R9, T02 AC1, AC2, AC4, E1 |
| `src/components/NoteArea.tsx` | edit: one import and one line that renders `StorageNotice` in the free spot under the label | R9, T02 AC1, AC2 |

Not changed, on purpose: `src/lib/notes.ts`, `src/lib/progress.ts`, `src/components/CompletionCard.tsx`, `src/app/login/page.tsx`, `src/app/schedule/[dayId]/page.tsx`. The sentence "Saved to your Google account" on the completion box stays as it is (ticket out of scope, spec concern 6).

## Order of work
1. **The two lines as a pure function, with tests.** Signed out: "Saved in this browser only." Signed in: "Saved in this browser. Sign-in here is a practice version and does not carry notes to other devices." Exact text from the ticket. Cites: R9, T02 AC1, AC2, AC3. Done when: `npm test` passes cases showing both strings are exactly as above and neither contains "cloud", "Google" or "sync" (any case).
2. **The component.** After the page has loaded in the browser, read the signed-in state once with `loadAuthUser()` and show the matching line as plain text. Before that read, show nothing, so a signed-in learner never sees "this browser only" for a moment. The line is not a temporary message, so it is not in a live region. If reading the state fails, show the signed-out line. Cites: R9, T02 AC1, AC2, AC4, E1. Done when: a signed-out page shows the first line and, after signing in on `/login` and opening a day, the second.
3. **Put it in the note area.** Add one line in `NoteArea.tsx`, in the free spot T01 leaves under the label. Do not move or restyle anything else there. Cites: R9, T02 AC1, AC2. Done when: the line appears inside the note area on Days 12 to 15.
4. **Check the persistence rules, no code.** Notes are stored under a key that does not contain the signed-in name (T01 plan), and signing in or out never touches that key, nor the completed-day progress. Walk the cases below. Cites: R6, R7, R12, T02 AC5 to AC10, E2, E3. Done when: TC-25 to TC-29 pass. If one fails, the defect is in T01's storage or in the sign-in page; stop and raise it on the ticket rather than patching around it here.
5. **Before commit:** `npm test`, `npm run build`, `npm run lint`. If T03 has landed first, rebase and run them again.

## Risks
- **What could break:** nothing that exists today is edited except one line in `NoteArea.tsx`. Sign-in, progress and notes are untouched, so R7 holds by construction.
- **Riskiest step: step 4.** Most of this ticket's criteria (AC5 to AC10, E2, E3) describe behavior that T01's storage choice already delivers. If T01 stored notes under the signed-in name, or cleared them on sign-in, those criteria would fail. This plan trusts T01's key and proves it with E2E cases, not with new code.
- **Two lines that disagree.** A signed-in learner sees "Saved to your Google account (name)" in the completion box and "Saved in this browser. Sign-in here is a practice version..." in the note area, on the same screen (TC-30). The spec accepts this as a known limitation. Do not repeat or change the old sentence, and keep the new line visually separate from it.
- **Typing, then signing in within 2 seconds (TC-29).** This ticket cannot fix it. It relies on T01 saving pending text when the learner leaves the page. If TC-29 fails, the defect is T01's.
- **Wrong line on first paint.** The page is built ahead of time and cannot know who is signed in. Reading in the browser after load, and showing nothing until then, avoids showing a wrong claim.
- **Options not taken:**
  - Listening for sign-in changes (`storage` and `training-auth-changed` events, as `Header.tsx` does). The ticket says the line only has to be correct when the page loads, because signing in happens on another page. It would add code for a case the ticket excludes.
  - Putting the two strings inside `NoteArea.tsx`. They would be hard to test in Node and would make this PR edit more of the shared file.
  - Folding this ticket into T03 or T01. It is a very small PR (one function, one component, one line), but the ticket pack kept it apart so it can run in parallel and be reviewed alone. Engineer's call if the PR is too small to be worth a review.
- **Choices made here (the ticket leaves them to Engineering):**
  - Show nothing until the signed-in state is read, then show one of the two lines.
  - If the state cannot be read, show the signed-out line. If storage cannot be read, the learner cannot be signed in, and T01 shows its own failure message when a save is refused.
- **Gaps in the ticket:** none found for T02. The test matrix lists no Spec Gap for it.

## Proof
| What | How |
|---|---|
| Exact text of both lines, no mention of cloud or Google | New unit cases in `src/lib/storage-notice.test.ts`, and TC-23, TC-24 (E2E) |
| Line follows sign-in and sign-out | TC-24 (E2E) |
| Note is not on another browser | TC-25 (Manual, two browsers) |
| Note kept through sign-in, a second sign-in and sign-out; 500 characters kept | TC-26 (E2E) |
| Different name and email, same browser, same notes | TC-27 (E2E) |
| Completed days kept through sign-in and sign-out | TC-28 (E2E) |
| Sign in within 2 seconds of typing | TC-29 (E2E, depends on T01 step 5) |
| Old "Google account" sentence unchanged | TC-30 (E2E) |

Commands before commit: `npm test`, `npm run build`, `npm run lint`. The E2E and Manual cases are run by hand and recorded in `test-matrix.md`, as in the T01 plan, until a browser test tool is approved.

## Shared seams
T03 runs in parallel with this ticket. Both start from the merged T01.
- **One file in common: `NoteArea.tsx`.** This ticket adds one line in the free spot under the label. T03 adds its own line in the free spot below the messages. The two lines are far apart, so the merge should not conflict. Whoever lands second rebases and runs `npm test` and `npm run build` again.
- **No shared data.** This ticket reads the signed-in state by itself. It does not use the note text, the day id or the ticked state.
- **Files this ticket must not edit:** `notes.ts`, `page.tsx`, `progress.ts`, `CompletionCard.tsx`, the login page, and T03's files.
