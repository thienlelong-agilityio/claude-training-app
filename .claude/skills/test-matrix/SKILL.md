---
name: test-matrix
description: Generate a structured Test Matrix covering happy path, edge cases, sync/offline, and security from a BA Ticket Pack
---

# Test Matrix (QA skill)

1. Read every Given / When / Then acceptance criterion in the Ticket Pack.
2. Output one Markdown table with columns:
   `ID | Ticket | Category | Scenario | Steps | Expected Result`
3. Cover all 4 categories:
   - **Happy Path**
   - **Edge Cases**
   - **Persistence/Sync** — Guest, Signed-in, Offline
   - **Security** — XSS / injection
4. End with a **Spec Gaps** section listing every ambiguity or missing rule found in the tickets.
