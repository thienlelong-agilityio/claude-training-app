---
name: ticket-pack
description: Break an approved spec.md into independent Given/When/Then tickets that pass the zero-questions test. Use after the product owner has reviewed spec.md and resolved its areas of concern
---

# Ticket Pack (BA skill)

Intent is captured with `/capture-intent` and the spec is written with `/write-spec`. This skill starts from the approved spec and produces the tickets.

## Where files go
- Work inside the change's folder `docs/features/<feature-slug>/`. Read `intent.md` and `spec.md` there.
- Write tickets to `docs/features/<feature-slug>/tickets/`, one file per ticket, named `t01-<short-slug>.md`, `t02-...`.
- Use plain lowercase names with no version suffixes. Git history is the version record.

## Before you start
- `spec.md` must exist and its areas of concern must be resolved. If any is still open, list them and stop. Do not write tickets on top of an open concern.

## Steps
1. Read `spec.md` and the Client answers in `intent.md`.
2. Break the work into independent tickets, each under 4 hours. A ticket that depends on another says so in `Depends on`.
3. Cover every requirement: each R-number in the spec appears in at least one ticket. List any R-number you could not cover.
4. Write each ticket with the template below.
5. Apply the zero-questions test to each ticket. If a developer could not implement it without asking a question, rewrite it.
6. Add a short `tickets/index.md` listing each ticket, its title, the requirements it covers, and its dependencies.
7. Stop. Developers ask questions only through the tickets. Answers go back into the ticket.

## Ticket template

```markdown
# T01: <short title>
Covers: R1, R3. Depends on: none. Estimate: <under 4h>.

## User Story
As a <role>, I want <goal>, so that <benefit>.

## Acceptance Criteria
- Given <starting state>, when <action>, then <observable result>.
- ...

## Edge Cases
- <Situation and the expected behavior.>

## Out of scope
- <What this ticket does not do.>
```

## Rules
- **Zero-questions test:** a developer could implement the ticket without asking a single question. If not, rewrite it.
- Acceptance criteria are observable and testable. No "works well" or "is fast".
- Take every decision from the spec. If the spec does not say, do not invent it: raise it as an open question back to the product owner.
- Keep tickets in user and business language. Technical decisions are Engineering's, decided in plan mode, not written into tickets.
- Carry over any policy rules the spec lists (for example from `privacy-and-ux`) into the acceptance criteria or edge cases.
