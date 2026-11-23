# Plans: Daily standup note
Spec: [spec.md](../spec.md). Tickets: [tickets/index.md](../tickets/index.md). Test matrix: [test-matrix.md](../test-matrix.md).
Status: ready for engineer review.

| Ticket | Plan | Files that change | Depends on |
|---|---|---|---|
| T01 Note input, auto-save, independence from completion | [t01-plan.md](t01-plan.md) | new `src/lib/notes.ts`, `src/lib/notes.test.ts`, `src/components/NoteArea.tsx`; edit `src/app/schedule/[dayId]/page.tsx` | none |
| T02 Storage notice and sign-in / sign-out | [t02-plan.md](t02-plan.md) | new `src/lib/storage-notice.ts`, `src/lib/storage-notice.test.ts`, `src/components/StorageNotice.tsx`; edit `src/components/NoteArea.tsx` (one line) | T01 |
| T03 Copy for Slack and empty-note guard | [t03-plan.md](t03-plan.md) | new `src/lib/standup-copy.ts`, `src/lib/standup-copy.test.ts`, `src/components/CopyForSlack.tsx`; edit `src/components/NoteArea.tsx` (one line) | T01 |

## File overlap
| File | Edited by | How the clash is avoided |
|---|---|---|
| `src/components/NoteArea.tsx` | T01 creates it. T02 and T03 each add one import and one line | T01 lays out a free spot under the label (T02) and one below the messages (T03). The two lines are far apart, so they merge without a conflict. Whoever lands second rebases and re-runs `npm test` and `npm run build` |
| `src/lib/progress.ts` | nobody edits it | T02 reads `loadAuthUser`, T03 reads `loadLocalProgress`. Read only |
| `src/components/CompletionCard.tsx`, `src/app/login/page.tsx` | nobody edits them | Ticking and sign-in stay as they are today (R7) |
| `src/app/schedule/[dayId]/page.tsx` | T01 only | T02 and T03 need nothing from it |

No other file is named by more than one plan.

## Seams T01 must leave (all are in `t01-plan.md`, "Shared seams")
- Layout of `NoteArea.tsx` with two free spots: under the label (T02) and below the messages (T03).
- The text on screen, including text not yet saved, and the day id, available inside `NoteArea` (T03).
- A named "saved note has loaded" value inside `NoteArea` (T03). This was missing from the T01 plan and has been added.
- A note storage key that does not contain the signed-in name, never touched by sign-in or sign-out (T02).
- No shared message area: T01 and T03 each own a `role="status"` area.

## Order of landing
1. **Commit the three plans and this index first**, in one `docs(plan)` commit on `main`, before anyone writes code. Worktrees are then created from that commit.
2. **T01 lands first.** It is the critical path (14 criteria, 7 edge cases) and T02 and T03 start from its merged code.
3. **T02 and T03 then run in parallel**, each in its own worktree, one pull request each. The first to land merges as is. The second rebases onto `main` and re-runs `npm test` and `npm run build`.
4. T02 is the smaller PR. If it turns out too small to review on its own, the engineer may fold it into T03's PR. Plans and tests do not change.

## Decisions that must agree across plans
| Decision | T01 | T02 | T03 |
|---|---|---|---|
| Where notes live | `training_note_<day id>`, one key per day | relies on it: no name in the key | does not read storage, receives the text from `NoteArea` |
| Messages | own `role="status"` area, clear on the next edit | no temporary messages | own `role="status"` area, clear when the text changes |
| Screen reader announcements (G5) | announces all three messages | not applicable | announces both result messages |
| What the learner sees before the browser has read storage | box disabled, nothing else shown | nothing shown | nothing shown (row not rendered until the note has loaded) |
| Progress and sign-in | untouched | untouched | progress read only at the moment of copy |

## Gaps from the test matrix, with the default each plan uses
**Decision (Training Lead): no one waits for these. The default below is the working assumption.** The BA may still confirm or change any of them in the ticket's `Open questions` (format in `/ticket-pack`, "Questions from developers"). If an answer differs, the plan named in the "Plan" column changes, and so does the matching test case.

| Gap | Question | Assumption used in the plans | Plan | Test case that uses it |
|---|---|---|---|---|
| G1 | Damaged saved note: what does the learner see? | empty note, no message | T01 | TC-19 |
| G2 | Same day in two tabs: which text wins? | last save wins, other tab does not update | T01 | TC-20 |
| G3 | Emoji, accents, "1 characters left" | emoji counts as one; wording stays "N characters left" | T01 | none |
| G4 | Counter on page load | shown for a saved note | T01 | none |
| G5 | Which messages a screen reader announces | all of them | T01, T03 | none |
| G6 | Paste into a long note | first 500 characters of the whole new text kept | T01 | none |
| G7 | Spaces at the start or end of the copied note | copied as typed | T03 | none |
| G8 | Does a result message clear when the day is ticked or unticked? | no, only editing the note clears it | T03 | none |

T02 has no gap.

## Not covered by any plan
- A runner for the 33 E2E cases. Vitest here runs in Node only, and a browser test tool needs an install that has not been approved. Until then E2E and Manual cases are run by hand and recorded in `test-matrix.md`.
- The Slack release check (TC-48), done by the Client before release.
- The known limitation that the completion box still says "Saved to your Google account" for a signed-in learner (spec concern 6).
