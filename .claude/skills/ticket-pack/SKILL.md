---
name: ticket-pack
description: Break an approved spec.md into a few PR-sized Given/When/Then tickets that pass the zero-questions test and can run in parallel worktrees. Use after the product owner has reviewed spec.md and resolved its areas of concern, or to re-slice an existing pack
---

# Ticket Pack (BA skill)

Intent is captured with `/capture-intent` and the spec is written with `/write-spec`. This skill starts from the approved spec and produces the tickets. A ticket pack is the set of tickets plus the spec they come from.

## Where files go
- Work inside the change's folder `docs/features/<feature-slug>/`. Read `intent.md` and `spec.md` there.
- Write tickets to `docs/features/<feature-slug>/tickets/`, one file per ticket, named `t01-<short-slug>.md`, `t02-...`.
- Use plain lowercase names with no version suffixes. Git history is the version record.

## Before you start
- `spec.md` must exist and its areas of concern must be resolved. If any is still open, list them and stop. Do not write tickets on top of an open concern.

## Steps
1. Read `spec.md` and the Client answers in `intent.md`.
2. Slice the work into **PR-sized tickets**. Developers work on tickets in parallel worktrees and open one pull request per ticket, so size and shape matter.
   - **Size:** one ticket is one pull request that one developer can finish and a reviewer can review in one sitting. Aim for a small number of tickets, usually 2 to 5. If a ticket is too big for that, split it.
   - **Group:** put requirements into one ticket when they live in the same screen area or behavior and are always built together. Keep tickets apart only when they can be built in parallel after a shared base.
   - **Shape:** each ticket is a slice a user or tester can see working (for example "the learner can write a note"), not a technical layer (for example "build the storage"). Technical layers are Engineering's choice, made in plan mode.
   - **Dependencies:** one foundation ticket has no dependencies, and the others depend only on it. Avoid long chains, so the other tickets can run in parallel.
3. Cover every requirement: each R-number in the spec appears in at least one ticket. List any R-number you could not cover.
4. Write each ticket with the template below.
5. Run the **zero-questions test** on each ticket (see Rules). Fix the ticket until the test passes.
6. Settle open questions before hand-over. If a question needs the product owner and has no answer, list it and stop. Do not hand over a ticket with an unanswered question. A ticket is ready for a developer only when its `Open questions` section says `None.` or every question already has an answer.
7. Add `tickets/index.md`: a link to `spec.md`, a table of each ticket with its title, the requirements it covers and its dependencies, and a requirement coverage line. Add an **Order of work** note: which ticket is the critical path, which tickets can run in parallel, and a warning when parallel tickets touch the same screen area (Engineering plans the split in `plan.md`). List any wording or limits you chose that the spec did not state, for the product owner to confirm.
8. Stop and hand over: QA runs `/test-matrix` on the tickets. Developers read the tickets and ask questions only through them.

## Ticket template

```markdown
# T01: <short title>
Covers: R1, R3. Depends on: none.

## User Story
As a <role>, I want <goal>, so that <benefit>.

## Scope
- <What this ticket covers.>

## Out of scope
- <What this ticket does not do.>

## Messages
<Every message the learner sees: its exact text, when it appears, and when it clears. Write "No messages." if there are none.>

## Acceptance Criteria
- Given <starting state>, when <action>, then <observable result>.
- ...

## Edge Cases
- <Situation and the expected behavior.>

## Open questions
None.
```

`Open questions` says `None.` when the ticket is handed to a developer. Questions asked later are added there, see "Questions from developers".

## Message lifecycle
Every message shown to the user has an exact text, a moment it appears, and a moment it clears. Write them in the ticket's `Messages` section. Unless the spec says otherwise, use this default and state it in the ticket:
- A message appears after its action.
- It clears as soon as the learner edits the note again.
- Nothing is shown when the page loads.
- Messages do not replace each other; each one clears on its own rule.
- A hint tied to a state (for example "the note is empty") is shown exactly while that state holds, including on page load.

## Questions from developers
Developers ask questions **only through the ticket**. Their question is a comment on the ticket, written in its `Open questions` section:

```markdown
- **Q (dev, <date>):** <the question>
  - **A (BA, <date>):** <the answer, or "waiting for <who>">
```

- The BA answers in the same place and then updates the ticket body (scope, criteria, edge cases) so it is complete without the thread.
- If the answer changes or adds a requirement, the BA also updates `spec.md` and tells the product owner.
- A question that could not be answered from the ticket means the ticket failed the zero-questions test. Fix the ticket, not just the thread.
- Git history records who asked and answered, and when.

## Re-slicing a pack
Use this when merging or splitting tickets that already exist.
1. Count the acceptance criteria (`- Given` lines) and the edge cases in every old ticket before you change anything.
2. Carry over **every** criterion, edge case and exact UI string unchanged. Do not reword, merge or drop any. Remove a line only when it is word-for-word identical to one already in the new ticket.
3. Renumber the tickets, update `Covers` and `Depends on`, and rewrite `tickets/index.md`.
4. Delete the obsolete ticket files so only the new pack remains.
5. Count again. The totals must match the counts from step 1. Report both counts.
6. If other files cite the old ticket numbers (for example a test matrix), update them or tell the user.

## Rules
- **Zero-questions test:** read each ticket as a developer who has never seen the conversation. List every question you would need answered to build it. If the list is not empty, rewrite the ticket until it is.
- Acceptance criteria are observable and testable. No "works well" or "is fast".
- Take every decision from the spec. If the spec does not say, do not invent it: raise it as an open question back to the product owner (step 6). If the product owner delegates the choice to you, write it into the ticket and list it in the index for confirmation.
- Keep tickets in user and business language. Technical decisions are Engineering's, decided in plan mode, not written into tickets.
- Carry over any policy rules the spec lists (for example from `privacy-and-ux`) into the acceptance criteria or edge cases.
