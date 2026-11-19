---
name: write-spec
description: Turn an approved intent.md into spec.md (numbered requirements, design, how each constraint is met, open questions, areas of concern with owners) using the policy skills. Use after the product owner approves intent.md and before tickets are written
---

# Write spec.md (Stage 2 — Design)

The product owner does not write the spec. Claude writes it from the approved `intent.md`, constrained by the policy skills. The product owner then reviews it against the idea.

## Inputs
- `docs/features/<feature-slug>/intent.md`. It must have `Status: approved`. If it does not, stop and tell the user. Do not start Design on a draft.
- `client-brief.md` in the same folder, for context.
- Policy skills that apply (for example `privacy-and-ux`). Read each one and list it in the header.

## Output
`docs/features/<feature-slug>/spec.md`, next to `intent.md`. Plain lowercase name, no version suffix.

## Steps
1. Read `intent.md` fully, including every Client answer under the open questions.
2. **If the feature extends something that already exists,** take a quick read-only look at how it behaves today (the screens and data it touches). Record what you find in a `Current behavior` section, in user language. Do not change anything, and do not design from the code: technical findings go under "For Engineering" or into areas of concern. If a requirement would not work with today's behavior, add it to the areas of concern. Skip this step for a brand-new feature.
3. Apply the policy skills as constraints. Where the intent and a policy skill conflict, or two policies conflict, do not choose silently: record it as an area of concern.
4. Write `spec.md` with the template below.
5. Number the requirements (R1, R2, ...) so tickets, plans and reviews can cite them.
6. Re-read the spec against the intent. Check that every Client answer became a requirement or a constraint, and that every open question is answered or carried forward.
7. Show the draft to the product owner. Do not set the status past `ready for product owner review`.
8. Stop. Do not write tickets. That is the next step (`/ticket-pack`).

## Template

```markdown
# Spec: <short title>
From: intent.md (<date or commit>). Status: ready for product owner review.
Skills applied: <policy skill names, or "none">

## Requirements
R1. <One testable statement of what the user can do or what must be true.>
R2. ...

## Current behavior
<Only for features that extend something existing: how it works today, in user language, with no code names.>

## Design
<How it behaves for the user: the flow, what is shown, what happens on each action. Business and user language.>
<Technical choices (storage, structure, endpoints, components) are listed as "For Engineering" and decided in plan.md, not here.>

## How each constraint in the intent is met
| Constraint | Met by |
|---|---|
| <constraint from intent.md> | <R-number or design element> |

## Open questions from the intent
<Each open question with its Client answer, or "carried forward" with who must answer.>

## Areas of concern
1. <Concern.> Owner: <role or team who must resolve it>.
```

## Rules
- Every requirement is one testable statement and traces to the intent. Do not add requirements the intent does not support. If something seems missing, add it to the areas of concern.
- Use the Client's decisions as written. Do not reinterpret or soften them.
- Keep user and business language. Do not name code files, components, or storage keys unless the originator did.
- Every area of concern has an owner. Resolve concerns with their owners before engineering sees the spec.
- One spec per intent.

## Hand-off
- The product owner reviews the spec, resolves the areas of concern with their owners, then commits `spec.md` next to `intent.md`. The pair records what was asked for and what was decided.
- A human teammate decides whether to move to the next step. Then run `/ticket-pack` to break the spec into tickets.
