---
name: test-matrix
description: Generate a structured Test Matrix covering happy path, edge cases, sync/offline, and security from the tickets of a feature. Use after the tickets are written
---

# Test Matrix (QA skill)

## Where files go
- Read the tickets in `docs/features/<feature-slug>/tickets/`, and `spec.md` next to them.
- Write the matrix to `docs/features/<feature-slug>/test-matrix.md`.

## Steps
1. Read every Given / When / Then acceptance criterion in the tickets.
2. Output one Markdown table with columns:
   `ID | Ticket | Category | Scenario | Steps | Expected Result`
3. Cover all 4 categories:
   - **Happy Path**
   - **Edge Cases**
   - **Persistence/Sync** — Guest, Signed-in, Offline
   - **Security** — XSS / injection
4. Every acceptance criterion has at least one test case, and each ticket's edge cases appear in the matrix. The `Ticket` column cites the ticket number (T01...).
5. End with a **Spec Gaps** section listing every ambiguity or missing rule found in the spec or tickets. QA raises these through the tickets, not directly to developers.
