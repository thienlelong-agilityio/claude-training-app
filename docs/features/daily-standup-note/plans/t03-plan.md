# Plan: T03 Copy for Slack and empty-note guard
Ticket: [t03-copy-for-slack.md](../tickets/t03-copy-for-slack.md). Covers: R4, R8, R10, R11. Depends on: T01 ([t01-plan.md](t01-plan.md)).
Status: ready for engineer review.

## Files that change
| File | Change | Why (R / AC) |
|---|---|---|
| `src/lib/standup-copy.ts` | new: pure logic, no React or DOM imports. Decides whether a note counts as empty, and builds the text to copy (header line, then the note) | R4, R11, T03 AC1 to AC3, AC11, E3 |
| `src/lib/standup-copy.test.ts` | new: Vitest cases for the logic above | R4, R11, T03 AC1 to AC3, AC11, E3 |
| `src/components/CopyForSlack.tsx` | new: client component with the "Copy for Slack" button, the empty-note hint and the two result messages | R4, R8, R10, R11, T03 AC1 to AC13, E1, E2, E4 |
| `src/components/NoteArea.tsx` | edit: one import and one line that renders `CopyForSlack` in the free spot below the messages, only after the saved note has loaded | R11, T03 AC8, E4 |

Not changed, on purpose: `src/lib/notes.ts`, `src/lib/progress.ts` (only read), `src/components/CompletionCard.tsx`, `src/data/capstone-days.ts` (only read), `src/app/schedule/[dayId]/page.tsx`. Ticking and sign-in stay as they are today.

## Order of work
1. **Copy text and empty check as pure logic, with tests.** The header is `**[<day title>]** (<status>)`. The day title is the `title` already shown at the top of each day page (for example `Day 12 — Kickoff and planning`), so no title is retyped. The status is "Completed" or "In Progress". The text is the header, a line break, then the note exactly as typed, with its line breaks. A note with only spaces or line breaks counts as empty. The header format lives in one place, so the Slack release check can change it in one line. Cites: R4, R11, T03 AC1 to AC3, AC11, E3. Done when: `npm test` passes the cases under Proof.
2. **The button and the hint.** A button labelled "Copy for Slack". While the note is empty, the hint "Write a note first to copy it." is shown next to it, from page load, and the button does nothing. The button is marked not usable with `aria-disabled` and is tied to the hint with `aria-describedby`, so it stays reachable by keyboard and a screen reader reads the hint with it. It is a normal button, so Enter and Space work. Cites: R10, R11, T03 AC6, AC8 to AC13, E4. Done when: an empty note shows the hint and a press copies nothing; one typed character enables the button and removes the hint; deleting the text brings the hint back.
3. **Pressing the button.** Build the text from the note on screen (the text T01 passes in, not the saved copy), the day title, and whether the day is ticked right now. Write it to the clipboard. On success show "Copied to your clipboard". If the browser blocks it or has no clipboard, show "Copy did not work. Select your note and copy it manually." and leave the note alone. Nothing is copied unless the button is pressed. Cites: R4, R8, T03 AC1, AC2, AC4, AC5, AC7, E1, E2. Done when: Day 12 ticked with a two-line note puts exactly three lines on the clipboard; unticking and pressing again ends the first line with "(In Progress)".
4. **Message rules.** Both messages sit in a `role="status"` area owned by this component, always in the page. Each clears as soon as the note text changes. A new press replaces an older failure message. Nothing is shown on page load. The hint is not a message: it follows the empty state. Cites: R8, R10, T03 AC4, Msg. Done when: after a copy, typing one character removes the message; after a failure then a success, only the success shows.
5. **Put it in the note area.** Add one line in `NoteArea.tsx`, in the free spot T01 leaves below the messages, passing the day id and the text on screen. Render it only after the saved note has loaded, so a learner with a saved note never sees the hint flash. Cites: R11, T03 E4. Done when: after a reload with a saved note, the button is usable as soon as the note appears.
6. **Release check, no code.** Before release the Client pastes a sample copy into Slack (TC-48). If literal asterisks show, change the header format in the one place from step 1 to `*[Day X — Title]*`, update the ticket and the tests. Cites: R4, spec concern 4.
7. **Before commit:** `npm test`, `npm run build`, `npm run lint`. If T02 has landed first, rebase and run them again.

## Risks
- **What could break:** nothing that exists today is edited except one line in `NoteArea.tsx`. Progress is only read, never written.
- **Riskiest step: step 3, the status word.** The ticket says the status is "Completed" when the day is ticked at that moment (R4, TC-42). The tick state lives inside `CompletionCard`, which this ticket does not change. The plan reads it when the button is pressed, with `loadLocalProgress()`. This is accurate because ticking writes the progress store before it waits for anything else (`toggleDayComplete` saves locally first, then syncs). Two cases can still disagree with the screen: the browser refuses the progress write, or the write throws. Both already break ticking today. If TC-42 or the review shows a real mismatch, the fix is a small client wrapper that holds the tick state, which would touch `CompletionCard`; raise it with the engineer before doing it.
- **Disabled button and screen readers.** A button with the native `disabled` attribute cannot be focused, so TC-40 (focus the button and hear the hint) could not work. `aria-disabled` keeps it focusable. The cost is that a click or Enter must be ignored in code (step 2). TC-37 checks exactly this.
- **Clipboard rules of the browser.** Copying works only from a press and on a secure page (`localhost` counts). On other pages there is no clipboard and the failure message must show, not an error. The call must start inside the press handler.
- **Header in Slack (spec concern 4, TC-48).** Not provable in code. The one-place header format makes the fix cheap.
- **Stale message.** If the message clears on a note change, it must not clear itself on the first render or when T01 loads the saved text.
- **Options not taken:**
  - Native `disabled` on the button: not focusable, breaks TC-40.
  - An old-style fallback that copies through a hidden text box: it would hide a real failure, and the ticket wants the failure message and a manual copy.
  - Lifting the tick state into a wrapper now: more change to files T01 and T02 do not touch otherwise, for a case that works today.
  - Sharing T01's `role="status"` area: two owners would clear each other's messages.
- **Choices made here (the ticket leaves them to Engineering):**
  - The status is read from the progress store when the button is pressed.
  - The button uses `aria-disabled`, not `disabled`.
  - The title comes from the existing day data, not a copy of it.
  - The note is copied as typed. Leading and trailing spaces are kept (default for G7).
  - A message is not cleared by ticking or unticking, only by editing the note, as the ticket says (default for G8).
  - Both result messages are announced by a screen reader, like T01's messages (default for G5).
- **Gaps in the ticket, with the default above. Each needs an answer from the BA, to be logged in the ticket's Open questions:** G7 leading and trailing spaces on copy; G8 whether a message clears when the day is ticked or unticked. (G5 is shared with T01.)

## Proof
| What | How |
|---|---|
| Header, status word and note for every day, ticked and not ticked | TC-32 (Unit) |
| Several line breaks kept; 500-character note; text that looks like formatting copied as typed | TC-43, TC-46, TC-47 (Unit) |
| Spaces and line breaks only count as empty | TC-39 (Unit) |
| Copy from the page, with the exact three lines | TC-31 (E2E) |
| Nothing copied unless the button is pressed | TC-36 (E2E) |
| Empty note: button not usable, hint shown, clipboard unchanged | TC-37 (E2E) |
| Button turns on with text and off when emptied | TC-38 (E2E) |
| Copy uses the text on screen before the 2-second save | TC-41 (E2E) |
| Status follows ticking after a copy | TC-42 (E2E) |
| Button usable as soon as a saved note loads | TC-44 (E2E) |
| Success message announced; keyboard use with Enter and Space | TC-33, TC-34 (Manual) |
| Browser blocks copying; message replaced then cleared | TC-35, TC-45 (Manual) |
| Hint read out with the button | TC-40 (Manual) |
| Header looks right in Slack | TC-48 (Manual, the Client, before release) |

Commands before commit: `npm test`, `npm run build`, `npm run lint`. The five Unit cases above are the ones QA can turn into Vitest tests as soon as step 1 fixes the function names. E2E and Manual cases are run by hand and recorded in `test-matrix.md` until a browser test tool is approved.

## Shared seams
T02 runs in parallel with this ticket. Both start from the merged T01.
- **One file in common: `NoteArea.tsx`.** This ticket adds one line in the free spot below the messages. T02 adds its own line in the free spot under the label. The two lines are far apart, so the merge should not conflict. Whoever lands second rebases and runs `npm test` and `npm run build` again.
- **What this ticket needs from T01:** the day id, the text on screen (including text not yet saved), and a way to know the saved note has loaded. T01's plan states the first two; confirm the third exists in `NoteArea.tsx` when T01 lands, and use it. If it does not, ask T01's author to expose it rather than reading storage here.
- **Live region:** this ticket owns its own `role="status"` area.
- **Files this ticket must not edit:** `notes.ts`, `page.tsx`, `progress.ts`, `CompletionCard.tsx`, and T02's files.
