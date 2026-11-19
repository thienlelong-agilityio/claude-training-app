---
name: capture-intent
description: Turn an idea, ticket, or incident into a reviewed intent.md proto-spec (problem, proposed outcome, affected users and systems, constraints, open questions) through a short brainstorm, then commit it to the feature folder under docs/features/
---

# Capture as intent.md (Stage 1 — Intake)

The originator (not necessarily an engineer) describes what they want in their own words. Claude brainstorms with them, writes the result as `intent.md`, the originator corrects it, and it is committed so the product owner can review it. No formal language is required from the originator.

Intent can start from a person's idea, a filed ticket, or an alert/incident. The steps are the same for all three.

## Home
- Save to `docs/features/<feature-slug>/intent.md`. Keep all analysis documents under `docs/`, separate from the application code in `src/`. Create the folder if it does not exist.
- Use a short kebab-case slug, e.g. `docs/features/claims-status-self-service/intent.md`.
- One folder per change. Plain lowercase file names, no version suffixes or number prefixes (history comes from Git). Later stages add their files next to `intent.md`: `spec.md` (Design) and `tickets/` (ticket pack).

## Steps

1. **Listen first.** Let the originator describe the problem in their own words: what they cannot do today, who is affected, what better looks like, what is out of scope. If they pass a ticket, incident, or a client brief file, read it in full as the starting description and do not ask them to retell it. Only ask about what the brief leaves out or leaves vague. A client brief is kept as `client-brief.md` in the same `docs/features/<feature-slug>/` folder as the `intent.md` it feeds. If the brief lives elsewhere, move it there.
2. **Brainstorm until the idea is concrete.** Ask the questions a business analyst would ask, a few at a time, not a long form. Stay on BA/product decisions:
   - **User workflow** — who does what, when, and in what order.
   - **Business rules** — what must always or never happen.
   - **Scope boundaries** — what is in scope and what is explicitly out.
   - **Roles and permissions** — which user roles are affected, and who may see or change what.
   - **Data and privacy policy** — what information is involved, who may see it, how long it is kept.
   - **Success** — how we would know it worked (measurable if possible).
   Never assume a missing requirement. If something is unknown, record it as an open question instead of guessing. Defer micro-UI/UX details (exact button labels, timings, browser fallbacks) and every technical question to Stage 2 (`/ticket-pack` → `spec.md`).
3. **Write `intent.md`** with the template below, in the originator's own terms. Keep it short and human-readable.
4. **Originator corrects.** Show the draft, ask what Claude misunderstood, and update it. Repeat until the originator confirms it.
5. **Commit** `intent.md` to the intent home so author and timestamp join the record. The product owner reviews it from there; the accept or reject decision (merge or closed review) sends it into Design.
   - Write a plain commit message, e.g. `docs(intent): add <feature-slug> intent`.
   - Do not add any AI attribution (no `Co-Authored-By`, no session link, no "Generated with").
   - Commit only when the originator asks you to, or has confirmed the draft.

## Template

```markdown
# Intent: <short title>
Author: <name> (<team or role>). Status: draft.

## Problem
<What cannot be done today, who feels it, and the evidence or size of the pain.>

## Proposed outcome
<What better looks like, from the user's point of view.>

## Affected users and systems
<People, teams, and systems touched.>

## Constraints
<Hard limits: security, data, existing auth, compatibility, deadlines, out of scope.>

## Open questions
<3–5 high-value business/BA questions. One question per bullet, so a reviewer can answer each.>
```

### Open questions: keep them few and BA-focused
- Aim for **3–5** questions, not a long questionnaire. Pick the ones whose answers most change the scope or the business outcome. If more than 5 matter, ask the top 5 first and ask the rest in a later round.
- Each question must be answerable by the originator or product owner without technical knowledge.

| | Example | Why |
|---|---|---|
| Good (BA) | "Should learners still be able to edit or keep their note if they uncheck a completed day?" | A business rule about the user's workflow. |
| Bad (Dev) | "Should notes be stored under a new `training_notes` localStorage key?" | A storage design choice. It belongs to Stage 2 Design / Engineering. |

## Rules

### Language & Boundary Rule
- Keep `intent.md` 100% in business/user language, in the originator's own terms.
- Do **not** mention internal code symbols, component names, file paths, or storage keys (for example `CompletionCard` or a `localStorage` key) unless the originator explicitly brought them up.
- Do **not** ask the originator or Client engineering or implementation questions, such as database schema, storage key naming, or technical architecture. Those belong to Stage 2 Design / Engineering.

### General
- Write what is wanted, why, and under which constraints. Do **not** design the solution, split tickets, or write acceptance criteria. That is the next stage.
- Use the originator's words and terms. Do not invent facts, numbers, names, or systems.
- `Status` starts as `draft`. Only the product owner moves it forward.
- Keep one intent per file. If the idea has two separate goals, propose two intents.

## Measures (for the team, read from Git history)
- **Leading:** time from first conversation to a committed `intent.md` (target: hours, not weeks).
- **Lagging:** share of `intent.md` files the product owner accepts into Design, and the number of edits to `intent.md` after the first `spec.md` commit for the same change.
