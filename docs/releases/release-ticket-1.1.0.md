# Release ticket: AI Tools - Training 1.1.0
Status: DRAFT, not approved.
- **Version:** 1.1.0 (PROPOSED: a new feature, so a minor version)
- **Base:** `3e32844` ("baseline v1.0 capstone training app", chosen by the user; the repo has no tag)
- **Head SHA:** `32fcfc43acda972281e8db2f0d56c3a26e9ef114` (`origin/main`)
- **Included PRs:** #4
- **Date:** 2026-11-23

## Scope
| Feature (`<slug>`) | Tickets (`<slug>/Tnn`) | PRs |
|---|---|---|
| `daily-standup-note` | `daily-standup-note/T01` only | #4 (merged) |

Not in this release, by the user's choice: `daily-standup-note/T02` (storage line, sign-in and sign-out notes) and `daily-standup-note/T03` (Copy for Slack). Neither has a PR.

Other changes (no feature): none counted. The skill counts merged PRs only. Commits in the range with no PR are listed under "Open items" below.

## Availability evidence
| Capability | Page and component that show it | Status |
|---|---|---|
| Note box on Days 12 to 15, counter, "Saved" and the other messages | `src/app/schedule/[dayId]/page.tsx` renders `NoteArea` (`src/components/NoteArea.tsx`) for each day, right after `CompletionCard` | Active |
| Per-day saving in the browser | `src/lib/notes.ts`, used only by `NoteArea` | Active |
| Copy for Slack button and empty-note hint (T03) | The code has only a comment placeholder in `NoteArea.tsx` | Planned (not built) |
| Storage line, sign-in and sign-out checks (T02) | No component | Planned (not built) |

`NoteArea` is used only in the day page. No other page imports it.

## Claims check
Verified means the code, or a unit test in `src/lib/notes.test.ts`, matches the claim. No claim was exercised in a browser: every manual case in `test-matrix.md` is NOT RUN.

| Claim in the release notes | Source | Result |
|---|---|---|
| A box labelled "What I shipped today" appears on Days 12 to 15 next to the completion box | `NoteArea.tsx:108-110`, `page.tsx:115-116`, days in `capstone-days.ts` | Verified |
| Each day has its own note, shown only on its page | key `training_note_<day id>` in `notes.ts:9`, `key={day.id}` in `page.tsx:116`, `NoteArea` used nowhere else | Verified |
| Saves about 2 seconds after you stop typing and shows "Saved" | `NoteArea.tsx:13`, `46-59`, `126` | Verified |
| Counter shows characters left; line breaks count | `NoteArea.tsx:121`, `notes.ts:41-47` | Verified |
| Up to 500 characters; typing at the limit is refused | `notes.ts:4`, `107-119` | Verified |
| A paste that is too long keeps the first 500 characters and shows a message | `notes.ts:118`, `NoteArea.tsx:123-125` | Verified |
| Keep editing after marking the day complete; ticking never changes the note | `NoteArea.tsx` never reads progress; `CompletionCard.tsx` unchanged in the range | Verified |
| Saved only in the browser, not on other devices; signing in does not move it | `notes.ts` uses browser storage only; `login/page.tsx` has no note code | Verified |
| If saving is refused, a message shows and the text stays on screen | `notes.ts:65-78`, `NoteArea.tsx:127-131` | Verified |
| "Copy for Slack" and the storage line are not available | no component for them | Verified |

## Risks
| Area | Finding (by area and severity only) | Files |
|---|---|---|
| Saved-data compatibility | New per-day keys are separate from the progress data, so older progress `{ "day-12": true }` is untouched. Low | `src/lib/notes.ts` |
| Text lost before the delayed save | The pending text is saved when the learner leaves, hides the tab or closes it. Not exercised in a browser (TC-16, TC-17 NOT RUN). Medium | `src/components/NoteArea.tsx`, `src/lib/notes.ts` |
| User text rendering | The text is shown inside a text box only. No `dangerouslySetInnerHTML` in the app. Low | `src/components/NoteArea.tsx` |
| Paste versus typing | Which edits count as a paste depends on the browser's input event type, and on IME input. Open question G9. Medium to low | `src/components/NoteArea.tsx` |
| Character counting | Uses `Intl.Segmenter` and falls back to code points in old browsers. Low | `src/lib/notes.ts` |
| Two tabs, damaged saved data | Behavior is an assumption (G1, G2). Low | `src/lib/notes.ts` |
| Clipboard, sign-in, `package.json` | Not changed in this release | none |

## Review results
| Source | Result | Disposition |
|---|---|---|
| CI check on PR #4 and on the head commit | success | none needed |
| Claude review bot on PR #4 | "No issues found. Checked for bugs and CLAUDE.md compliance." | none needed |
| `/code-review`, ultrareview, a person | Not run, or not seen | not run |

## Verification
Default is NOT RUN. A row is filled only with a result that was seen.

| Check | Result |
|---|---|
| `npm test` | NOT RUN here (the CI job runs it, see the CI row) |
| `npm run lint` | NOT RUN here (the CI job runs it) |
| `npm run build` (also checks types) | NOT RUN here (the CI job runs it) |
| CI for the head SHA | success (`CI`, push event) |
| Manual cases in `test-matrix.md` (there is no E2E runner) | PASS 0, FAIL 0, BLOCKED 0, NOT RUN 48 |

## Rollback
- The PR was merged with a merge commit, so revert it with `git revert -m 1 32fcfc4` (or redeploy the previous version).
- **Data compatibility on rollback:** the previous version ignores the per-day note keys, so notes stay in the browser and are not shown. They appear again when this version is released again. Older progress data is not touched by this release.

## Open items for the person approving
1. T02 and T03 have no PR. The user chose to release T01 alone. The ready check was overridden for this.
2. Commits in the range with no PR are not counted: a direct commit that changes the footer text and adds a login success message (`99302d0`). It is visible to learners. Decide whether to mention it in the release notes ("Other changes" currently says none).
3. All 48 manual cases are NOT RUN, so nothing has been tried by hand in a browser.
4. Spec gaps G1 to G9 in `test-matrix.md` are open. The code follows the assumptions listed there.
5. Local `main` is one commit ahead of `origin/main` (a skill file, not part of the head SHA). Push it or leave it; it does not change this release.

## Go / No-go checklist
- [ ] Ready check passed (overridden: T02 and T03 not built; local `main` ahead by one unpushed commit)
- [ ] Every claim in the release notes is Verified, or the claim was removed (code-verified only, see the note above)
- [ ] No unresolved Important review finding (bot found none; no human review seen)
- [ ] Verification results recorded (CI success; manual cases NOT RUN)
- [ ] Rollback understood
- [ ] Release notes reviewed by a person

Approved by:
