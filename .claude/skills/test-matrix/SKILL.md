---
name: test-matrix
description: Generate one lean test plan per feature (test-matrix.md) from its tickets - a Test Plan block, then a Cases table covering happy paths, edge cases, negative tests, and permission/data variations. The matrix is the checklist for both manual QA and automated tests. Use after the tickets are written
---

# Test Matrix (QA skill)

One test plan per feature. The matrix is a checklist that people tick off by hand and that automated tests are written from. Keep it lean: only cases that can catch a real defect, and every requirement still traced.

## Where files go
- Read `docs/features/<feature-slug>/tickets/` (every ticket and `index.md`) and `spec.md` next to them.
- Write `docs/features/<feature-slug>/test-matrix.md`. One file per feature, plain lowercase name, no version suffix.

## Before you start
- Every ticket's `Open questions` must say `None.` or have an answer. If not, list the open ones and stop.

## Steps
1. Read every Given / When / Then criterion and every edge case in the tickets, and every exact message in their `Messages` sections.
2. Write the `## Test Plan` block (see below).
3. Write the cases in four categories. The table must cover all four unless the pruning rule removes one.
   - **Happy path:** the normal flow, done as expected. One case per acceptance criterion, unless the pruning rule combines them.
   - **Edge case:** boundary values and timing. For example exactly at a limit, one over the limit, pasting more than the limit, leaving the page or pressing a button before a delayed save finishes, text made only of spaces or line breaks.
   - **Negative test:** actions that fail or are blocked. For example the browser blocks saving, the browser blocks the clipboard, pressing copy on an empty note, saved data that is damaged or unreadable.
   - **Permission / Data variation:** the same behavior for different roles and data. For example signed out versus signed in, changing the signed-in name or email in the same browser, data saved by an earlier version of the app, hostile text such as `<script>` or characters that break the output format, special characters, emoji, other languages, each relevant day or status.
4. **Add what you know breaks.** Add cases for known weak spots taken from the spec (resolved areas of concern), the policy skills, and how the feature behaves today: timing, two tabs or two people on one browser, changing state after an action, a message that must clear, output pasted into another tool. Start the Scenario of these cases with `Risk:`.
5. **Prune** with the Anti-Bloat rule below.
6. Check traceability: every acceptance criterion, every ticket edge case and every R-number appears in at least one case. End with a `## Coverage` summary.
7. End with a `## Spec Gaps` section: every ambiguity or missing rule found in the spec or tickets. QA raises these through the tickets (in their `Open questions`), not directly to developers.
8. Stop and hand over. QA reviews the matrix and developers use it as the checklist.

## Output layout
`test-matrix.md` has these parts, in this order:
1. Title, and a line linking `spec.md` and the tickets.
2. `## Test Plan`
3. `## Cases`
4. `## Removed on purpose`
5. `## Coverage`
6. `## Spec Gaps`

## Test Plan block
A short block right before the table. Keep each item to a line or a few bullets.

```markdown
## Test Plan
- **Scope:** <the tickets covered, for example T01, T02, T03, and the requirements they carry>
- **Environments:** <browsers, modes such as Guest vs Signed in, keyboard only, screen reader>
- **Data setup:** <seeded states, boundary strings, data saved by an earlier version>
- **Top Risks:** <3 to 5 highest-impact failure modes, one line each>
- **What's NOT tested:** <explicit exclusions and why>
```

## Cases table
Under `## Cases`, one Markdown table with exactly these 10 columns:

`ID | Ticket | Category | Variation (Role / Data) | Scenario | Steps | Expected Result | Type | Coverage | Status`

- **ID:** `TC-01`, `TC-02`, ... in one running sequence for the feature. Never reuse or renumber an ID.
- **Ticket:** the ticket number (T01, T02, T03).
- **Category:** `Happy path`, `Edge case`, `Negative test` or `Permission / Data variation`.
- **Variation (Role / Data):** who and with what data, as `<role> / <data>`. For example `Guest / Empty note`, `Signed in / 500 characters`.
- **Scenario:** what is checked, in user language. Start `Risk:` cases with `Risk:`.
- **Steps:** numbered or arrow-separated, concrete enough that a person or a test script can follow them without guessing (page, input, wait time, action).
- **Expected Result:** observable, and copied from the ticket. Use exact message text from `Messages`. Do not invent an expected result the ticket does not state: if it is missing, add it to Spec Gaps.
- **Type:** how the case is run, so automation knows what to code:
  - `Unit`: pure logic with no browser (for example building the copied text, the 500-character limit, reading and writing saved data).
  - `E2E`: needs the running app in a browser (screens, typing, ticking, signing in, messages).
  - `Manual`: needs a person or a real device or service (screen reader, real clipboard permission prompts, Slack, a second browser).
- **Coverage:** the requirement and the acceptance criterion or edge case the case checks, for example `R1, T01 AC1`. Use `T01 E2` for an edge case and `T01 Msg` for the Messages section.
- **Status:** the result of the case. Every case starts as `NOT RUN`, or `BLOCKED` when it waits on a Spec Gap. Use only these values:
  - `PASS`: the test ran and the observed result matched the expected result.
  - `FAIL`: the test ran and the observed result differed from the expected result.
  - `BLOCKED`: a dependency, an unresolved decision or a gate prevents meaningful execution.
  - `NOT RUN`: not executed yet.
  - `RETIRED`: superseded by another case. Keep the row and its ID. It counts as neither pass nor fail.
  - A `PASS` needs a test that ran and a check that matches the Expected Result. A case with no such check is not `PASS`.

Example row:

| ID | Ticket | Category | Variation (Role / Data) | Scenario | Steps | Expected Result | Type | Coverage | Status |
|---|---|---|---|---|---|---|---|---|---|
| TC-01 | T01 | Happy path | Guest / Empty note | Auto-save note after 2s pause | Open `/schedule/day-12` → type 12 characters → wait 2s → reload | Counter shows 488 characters left, "Saved" appears, note persists after reload | E2E | R13, R14, T01 AC1 | NOT RUN |

## Anti-Bloat and Pruning rule (Delete the nonsense)
- Aim for a lean, high-signal matrix. A small feature should not produce a 70-plus row table. If the table is long, look for rows to combine or remove before you hand over.
- **No duplicates.** Never write two cases for the same scenario in different words (for example the shared-browser behavior tested twice).
- **Combine trivial variations** into one row when the logic is identical, and name the variations in the row. For example Day 13 and Day 14 headers in one case, Enter and Space keyboard activation in one case, repeated tick and untick sequences in one case.
- **Do not combine** cases that can fail for different reasons, or that have different expected results. A case that checks two unrelated things is two cases.
- **Remove** cases that cannot fail for this feature, and categories the feature does not have (for example offline sync when the spec says data stays in one browser).
- **Keep 100% traceability.** Pruning must not leave any requirement, acceptance criterion or edge case without a case. Check the Coverage summary after pruning.
- List what you removed or combined, and why, under `## Removed on purpose`.

## Coverage summary
Under `## Coverage`: for each ticket, which cases cover its acceptance criteria, edge cases and messages; a line confirming R1 to Rn each have a case (or listing any that do not); and totals by category, by ticket and by `Type`.

## Rules
- Keep user and business language in Scenario and Expected Result. Technical choices are Engineering's.
- Carry over policy rules from the spec (for example `privacy-and-ux`) as cases.
- Case IDs are stable. When a case is replaced, mark it `RETIRED` and add a new one.
