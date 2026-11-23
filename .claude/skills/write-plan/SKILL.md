---
name: write-plan
description: Write the implementation plan (plan.md) for one ticket, or for every ticket of a feature, from the approved spec, the tickets and the test matrix. Run it in plan mode before any code. Use after /test-matrix, when developers start Stage 3 Build. Argument - a ticket number such as T01, or "all"
---

# Write Plan (Engineering skill)

Developers start in plan mode. This skill produces the written plan for a ticket, so the design is reviewed while changing it still means editing a document. The plan is committed as a `plan.md` before any code, and the pull request is later checked against it.

## How to call it
- `/write-plan T01`: plan one ticket.
- `/write-plan all`: plan every ticket in the pack, then check the plans against each other.
- No argument: ask which ticket, or "all". Do not guess.

## Where files go
- Read, all in `docs/features/<feature-slug>/`: `intent.md`, `spec.md`, `tickets/` (the ticket and `index.md`), and `test-matrix.md`.
- Read `CLAUDE.md` for the hard rules and commands, and the policy skills the spec lists.
- Write one plan per ticket to `docs/features/<feature-slug>/plans/t01-plan.md`, `t02-plan.md`, ... Plain lowercase names, no version suffix. Git history is the version record.
- `all` also writes `plans/index.md` (see "Plan set check").

## Before you start
- Work in plan mode. You may read the code and the docs. Write only the plan files above. Do not change source code, tests or config.
- The ticket's `Open questions` must say `None.` or have an answer. If not, list the open ones and stop. The question goes back through the ticket, not into the plan.
- `test-matrix.md` should exist. If it does not, say so and plan without TC references, then tell the user to run `/test-matrix`.
- A ticket that depends on another one (`Depends on: T01`) needs that plan to exist, or to be written in the same run. Plan the foundation ticket first.

## Steps
1. Read the ticket completely: every acceptance criterion, edge case and message. Read the R-numbers it covers in `spec.md`, and the spec's areas of concern that touch it.
2. Read the code the ticket will touch, read-only. Find where today's behavior lives: the page, the components, the stored data and the pure logic. Name real files. Do not invent file names; a new file is marked `new`.
3. Draft the plan with the template below.
4. **Interrogate the plan** before showing it. Answer each in the `Risks` section:
   - What could this change break that works today?
   - Which step is the most risky, and why?
   - What other options did you consider and not take, and why?
   - What does the ticket leave open that the code forces a choice on (for example how data is stored)? Write the choice and the reason.
5. Run the **zero-questions test** (see Rules). Fix the plan until it passes.
6. Link the plan to the proof: every acceptance criterion and edge case of the ticket must be reachable from a step, and every step from the Proof section.
7. Show the plan to the engineer. Do not set the status past `ready for engineer review`. The engineer corrects it, then accepts it.
8. Stop. Do not write code. After the engineer accepts, the plan is committed as its own commit, before the code.

## Plan template

```markdown
# Plan: T01 <ticket title>
Ticket: [t01-<slug>.md](../tickets/t01-<slug>.md). Covers: R1, R3. Depends on: none.
Status: ready for engineer review.

## Files that change
| File | Change | Why (R / AC) |
|---|---|---|
| `src/...` | new / edit: <what, in one line> | R13, T01 AC3 |

## Order of work
1. <Step.> Cites: R13, T01 AC3. Done when: <observable check>.
2. ...

## Risks
- <What could break, the riskiest step, spec concerns, Top Risks from test-matrix.md.>
- **Options not taken:** <alternative and why not.>
- **Choices made here:** <a decision the ticket leaves to Engineering, and why.>

## Proof
| What | How |
|---|---|
| <Behavior> | Test cases TC-01, TC-02 (Unit / E2E / Manual) |
Commands before commit: `npm test`, `npm run build`.

## Shared seams
<Only when other tickets run in parallel. What this ticket exposes or leaves open for them, and the files it must not touch. Write "None." if there is no such ticket.>
```

## Plan set check (`all` only)
After writing every plan, write `plans/index.md`:
- A table: ticket, plan, files that change, depends on.
- **File overlap:** every file named by more than one plan, and who edits it. If two parallel tickets edit the same file, change the plans so each adds its own new file and the shared file gets one small line from each, or tell the engineer which ticket should land first.
- **Seams the foundation ticket must leave** for the others (for example data it must pass down). Check each is in the foundation plan's `Shared seams`. If one is missing, add it there.
- **Order of landing:** which plan lands first, which can run in parallel in separate worktrees, and which rebase after a merge.
- Any decision in two plans that must agree (for example a data key or a shared message area).

## Rules
- **Zero-questions test:** read the plan as an engineer who never saw the conversation. List every question you would need answered to implement it. If the list is not empty, rewrite the plan until it is.
- Every step cites the R-number and the acceptance criterion it delivers. A step that serves none is out of scope: drop it or raise it as a question on the ticket.
- Take every decision from the spec and the ticket. If neither says, do not invent it. Raise it as a question in the ticket's `Open questions`, in the format of `/ticket-pack` ("Questions from developers"), and stop. A technical choice the ticket leaves to Engineering (storage, structure, components) is yours to make, and goes under `Choices made here`.
- Respect the hard rules in `CLAUDE.md`. For example: pure logic stays free of React, DOM and Next imports so tests run in Node; no `dangerouslySetInnerHTML` with user text; keep older saved data working.
- Proof comes from `test-matrix.md`: cite the TC IDs. A case that needs code the plan does not mention is a gap in the plan.
- No code in the plan. Names of files, functions and data are fine. Keep each plan short enough to review in one sitting.
- When the implementation departs from the plan, the engineer updates the plan in the same commit as the code.
- Commits and pull requests carry no AI attribution, as `CLAUDE.md` says.
