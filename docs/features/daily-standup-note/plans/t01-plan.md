# Plan: T01 Daily note input, auto-save and independence from completion
Ticket: [t01-note-input-autosave.md](../tickets/t01-note-input-autosave.md). Covers: R1, R2, R3, R5, R7, R10, R13, R14. Depends on: none.
Status: ready for engineer review.

## Files that change
| File | Change | Why (R / AC) |
|---|---|---|
| `src/lib/notes.ts` | new: pure logic, no React or DOM imports. Reads and writes one note per day, applies the 500-character limit, counts characters left | R1, R13, R14, T01 AC2, AC3, AC4, AC5, E1, E2, E3 |
| `src/lib/notes.test.ts` | new: Vitest cases for the logic above | R7, R13, R14, T01 AC4, AC14 |
| `src/components/NoteArea.tsx` | new: client component with the label "What I shipped today", the text box, the counter, the three messages, the 2-second save | R1, R2, R10, R13, R14, T01 AC1 to AC3, AC8 to AC10, E4 to E6 |
| `src/app/schedule/[dayId]/page.tsx` | edit: render `NoteArea` right after `CompletionCard`, with `key` set to the day id | R1, T01 AC1, AC5, AC6 |

Not changed, on purpose: `src/lib/progress.ts`, `src/components/CompletionCard.tsx`, `src/app/login/page.tsx`, the overview page. Ticking, completed-day progress and sign-in stay exactly as they are today (R7, R3).

## Order of work
1. **Logic and its tests (`notes.ts`, `notes.test.ts`).** Functions: load a day's note, save a day's note (returns whether it worked), apply an edit (given the old text and the new text, returns the kept text and whether it was shortened), characters left. Cites: R13, R14, T01 AC2, AC4, E1, E2, E3. Done when: `npm test` passes the cases listed under Proof.
2. **The component, static part.** Label, text box, counter. The note loads after the page mounts, as `CompletionCard` does, and the box stays disabled until then so the learner cannot type into a box that will be overwritten. Counter is always visible and shows "500 characters left" on an empty note. Cites: R1, R10, R14, T01 AC1, AC2, AC8. Done when: Days 12 to 15 each show an empty labelled box next to their completion box.
3. **Editing, counter and messages.** On every change: apply the limit, update the counter, clear "Saved" and the save-failure message, and show "Your note was shortened to 500 characters." only when more than one character was cut in at once (a paste). Typing at the limit is refused silently. Cites: R14, R13, T01 AC2, E1, E2, Msg. Done when: 500 typed characters show "0 characters left" and one more is refused; a 600-character paste keeps 500 and shows the message, which disappears on the next edit.
4. **Auto-save.** Save 2 seconds after the last change. On success show "Saved". If saving fails show "Could not save your note. It may be lost if you leave this page." and keep the text on screen. All messages sit in one `role="status"` area that is always in the page, so a screen reader announces them. Cites: R10, R13, T01 AC3, AC8, E3, E5. Done when: a deleted note is saved as empty and shows "Saved"; a refused save shows the failure message.
5. **Do not lose the latest text.** Save the pending text at once when the component is removed (the learner opens another page) and when the page is hidden or closed (reload, tab close). Only save if something is pending. Cites: R13, T01 AC4, E4, E6. Done when: typing then opening the overview within 2 seconds, or ticking the day then reloading within 2 seconds, keeps the text.
6. **Wire into the day page.** Add `NoteArea` after `CompletionCard` in the existing block, with `key={day.id}` so moving from one day to another starts a fresh component and saves the old day's pending text under the old day. Cites: R1, T01 AC1, AC5, AC6. Done when: each day shows only its own note, and no other page shows any note.
7. **Prove independence from completion.** No code: notes use their own storage keys, so ticking cannot change them and the progress store is untouched. Walk the manual cases for ticking, unticking and v1.0 progress. Cites: R2, R3, R7, T01 AC7, AC9 to AC14, E6, E7. Done when: the cases TC-06, TC-08, TC-09, TC-15 and TC-17 pass.
8. **Before commit:** `npm test`, `npm run build`, `npm run lint`. Commit the plan first, then the code.

## Risks
- **What could break:** the existing ticking and progress. Mitigation: no edit to `progress.ts` or `CompletionCard.tsx`, and notes never go in the `training_progress` key. If a note were stored there it would be deleted, because `loadLocalProgress` keeps only true or false values and `saveLocalProgress` rewrites the whole map (R7, TC-06).
- **Riskiest step: step 5 (losing text before the 2-second save).** It is the top risk in the test plan (TC-16, TC-17). The save must run on unmount and on page hide, and must not run twice or for the wrong day. React development mode mounts, unmounts and mounts again, so the pending flag must guard against a save of unchanged text.
- **Day-to-day navigation.** Moving between two day pages can reuse the same component, and a late save would write Day 12 text under Day 13. The `key` on `NoteArea` and a day id captured when the save is scheduled prevent this (TC-04).
- **Blocking the browser's storage.** In this app `loadLocalProgress` reads `window.localStorage` outside its `try`, so with all site data blocked the existing completion box may already fail before the note does. `notes.ts` must catch its own errors and return "not saved". To test TC-18 reliably, make only saving fail (for example replace `setItem` with a function that throws in the browser console), and treat a page crash with everything blocked as an existing problem, not a T01 defect. Report it to the BA if the test is run the strict way.
- **Caret jump.** A text box whose value is cut by code moves the cursor to the end when text is cut. It happens only when the limit is hit, and is accepted.
- **Options not taken:**
  - HTML `maxLength` on the text box. It cannot tell a paste from typing, so the "shortened" message could not be shown, and it counts differently from the counter.
  - One storage key holding all days' notes. A damaged value would hide every day, and two tabs on different days could overwrite each other. One key per day avoids both.
  - Saving on every keystroke. The ticket asks for 2 seconds after the learner stops typing.
- **Choices made here (the ticket leaves them to Engineering):**
  - Storage key per day, `training_note_<day id>` (for example `training_note_day-12`), in the browser's local storage. The key does not contain the signed-in name, so signing in or out cannot move or hide a note (R6, R12, and T02's criteria hold by construction).
  - Characters are counted as the learner sees them: an emoji counts as one, and a cut never splits one.
  - A note loaded from storage that is somehow longer than 500 is shown cut to 500 and is not saved until the learner edits.
- **Gaps in the ticket, with the default this plan uses. Each needs an answer from the BA, to be logged in the ticket's Open questions. If an answer differs, steps 1 to 4 change.**
  - G1 (TC-19) damaged saved note: shown as an empty note, no message.
  - G2 (TC-20) same day in two tabs: the last save wins and the other tab does not update.
  - G3 emoji and accents, and "1 characters left": an emoji counts as one, and the wording stays "N characters left" for every N.
  - G4 counter on load: shown for a saved note.
  - G5 screen reader and the two other messages: all three messages are announced.
  - G6 paste into a note that is already long: the first 500 characters of the whole new text are kept.

## Proof
| What | How |
|---|---|
| Limit, cut, characters left, save and load, per-day keys, save failure, damaged data, progress untouched | New unit cases in `src/lib/notes.test.ts` (listed below) |
| Note area on each day, counter, auto-save, reload, line breaks, one note per day, not on other pages | TC-01 to TC-05, TC-21, TC-22 (E2E, run by hand until browser tooling is chosen) |
| Existing progress, tick and untick independence, edits on ticked and unticked days | TC-06, TC-08, TC-09, TC-15, TC-17 (E2E) |
| Limit and paste behavior, messages clear on edit, delete note | TC-10 to TC-14 (E2E) |
| Latest text is kept when leaving the page | TC-16 (E2E) |
| Save refused | TC-18 (E2E, see Risks for how to run it) |
| Keyboard and screen reader | TC-07 (Manual) |
| Damaged data (TC-19, Unit), two tabs (TC-20, Manual) | Use the G1 and G2 assumptions below. Not blocked; change them if the BA answers differently |

New unit cases, in `src/lib/notes.test.ts`:
- a saved note loads back exactly, with its line breaks;
- notes of two different days stay apart;
- a missing or damaged value loads as an empty note;
- a save into a storage that throws returns "not saved" and does not throw;
- 500 characters are kept, 501 typed one by one are cut to 500 with no message, a 600-character paste is cut to 500 and reported as shortened, a paste of exactly 500 is not reported;
- an emoji at the cut is not split; line breaks count as characters;
- saving a note leaves the `training_progress` value byte for byte unchanged, and old progress such as `{"day-12":true}` still loads.

Commands before commit: `npm test`, `npm run build`, `npm run lint`.

The 33 E2E cases in the matrix have no automated runner today. Vitest here runs only in Node, and adding a browser test tool needs an install, which has not been approved. Until it is, the E2E cases are run by hand and recorded in `test-matrix.md`.

## Shared seams
T02 and T03 run in parallel after this ticket lands. This ticket leaves them these points, and nothing else:
- **One file in common: `NoteArea.tsx`.** Each of T02 and T03 adds exactly one new component file of its own and one line in `NoteArea.tsx`. To keep the two lines apart, the layout of `NoteArea` is, top to bottom: label, a free spot for T02's storage line, text box, counter, messages, a free spot for T03's copy row. T01 leaves a blank line at each free spot and no comment or placeholder.
- **For T03:** `NoteArea` holds the current text on screen (including text not yet saved) and the day id. T03's component receives the text as a property, so the copy uses what the learner sees and its own messages can clear when the text changes. T03 decides how it learns whether the day is ticked and what the day's title is, in its own plan. Reading the ticked state when the button is pressed is possible without touching `CompletionCard`: ticking writes the progress store before it waits.
- **Also for T03: a "saved note has loaded" flag.** `NoteArea` already waits for the note to load before enabling the text box (step 2). Keep that as one named value inside `NoteArea` that T03's line can use, so T03 can render its row only after the note has loaded. T03 must not read storage to find out.
- **For T02:** the note's storage key does not depend on the signed-in name, so T02 adds only the storage line and its checks. T02 reads the signed-in state by itself.
- **Live regions:** each ticket owns its own `role="status"` area. T03 does not reuse the T01 one.
- **Files T02 and T03 must not edit:** `notes.ts` (its save and load behavior), `page.tsx`, `progress.ts`, `CompletionCard.tsx`.
