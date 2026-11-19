---
name: ticket-pack
description: Convert vague feature briefs into intent.md, Open Questions, Spec Artifact, and Given/When/Then Ticket Pack passing the Zero-questions test
---

# Ticket Pack (BA skill)

## Where files go
- Work inside the change's folder `docs/features/<feature-slug>/`. Read the approved `intent.md` there, and write `spec.md` and the tickets next to it.
- Tickets go in `docs/features/<feature-slug>/tickets/`, one file per ticket, named `t01-<short-slug>.md`, `t02-...`.
- Use plain lowercase names with no version suffixes. Git history is the version record.
- `spec.md` starts with `From: intent.md. Status: draft.` and numbers its requirements (R1, R2, ...) so tickets can cite them.

## Phase 1 — Intake
- Never assume missing requirements.
- Produce `intent.md` with three sections: **What**, **Why**, **Constraints**.
- List 5–7 sharp **Open Questions** for the Client, covering UX, edge cases, and data sync (guest vs signed-in, offline, legacy data).
- Stop and wait for the Client's answers before Phase 2.

## Phase 2 — Spec & Tickets (after the Client answers)
- Produce `spec.md` with: **Scope**, **Out of scope**, **Data schema**, **UI behavior**.
- Break the work into independent tickets, each under 4 hours.
- Every ticket MUST include:
  - **User Story** — As a <role>, I want <goal>, so that <benefit>.
  - **Acceptance Criteria** — Given / When / Then.
  - **Edge Cases**.
- **Zero-questions test:** a developer could implement the ticket without asking a single question. If not, rewrite it.
