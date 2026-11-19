# Tickets: Daily standup note

Spec: [spec.md](../spec.md) (approved). Intent: [intent.md](../intent.md).

| Ticket | Title | Covers | Depends on |
|---|---|---|---|
| [T01](t01-note-input-autosave.md) | Daily note input, auto-save and independence from completion | R1, R2, R3, R5, R7, R10, R13, R14 | none |
| [T02](t02-storage-notice-and-sign-in.md) | Storage notice and sign-in / sign-out persistence | R6, R7, R9, R12 | T01 |
| [T03](t03-copy-for-slack.md) | Copy for Slack and empty-note guard | R4, R8, R10, R11 | T01 |

## Requirement coverage
R1 T01 · R2 T01 · R3 T01 · R4 T03 · R5 T01 · R6 T02 · R7 T01, T02 · R8 T01 (saved), T03 (copy) · R9 T02 · R10 T01, T03 · R11 T03 · R12 T02 · R13 T01 · R14 T01. Every requirement is covered.

## Order of work (Day 13, one PR per ticket)
- **T01 is the critical path.** It is the largest ticket and the other two need it. Land it first.
- **T02 and T03 can then run in parallel**, each in its own worktree.
- **Shared area warning:** T02 and T03 both add to the same note area on the day page. Engineering decides in `plan.md` how to split the work so the two PRs do not conflict.

## Release check (not a ticket)
Before release, the Client pastes a sample copied note into Slack and checks the header line (spec, concern 4). If literal asterisks show, the header changes to single asterisks and T03 is updated.

## Choices written into the tickets by the BA, for the product owner to confirm
These were needed so a developer does not have to ask. The spec did not state them.
- The exact wording of the messages and labels: "What I shipped today", "Saved", "Copy for Slack", "Copied to your clipboard", "Write a note first to copy it.", and the failure messages.
- Saving happens 2 seconds after the learner stops typing.
- A pasted note longer than 500 characters is cut to the first 500, with a message.
- If the browser does not allow saving, the learner sees a message and keeps the text on screen.
- Notes belong to the browser, not to the practice account name, so two people sharing a browser share notes (T02).
- A note of only spaces or line breaks counts as empty (T03).
- Message lifecycle: a message appears after its action and clears as soon as the learner edits the note again. No message is shown when the page loads. Messages do not replace each other.
