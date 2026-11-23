# Review instructions

Run three passes. Tag every finding with its pass name.

## Passes
- **Bugs:** logic errors, broken edge cases, lost data, wrong behavior on a boundary (for example exactly 500 characters).
- **Security:** `dangerouslySetInnerHTML` with user text, user text rendered as HTML, secrets in the diff.
- **Compliance:** the change matches the ticket in `docs/features/<slug>/tickets/`, `spec.md`, and the plan in `docs/features/<slug>/plans/`. Flag any file changed outside the plan's "Files that change" list.

## Project rules (an Important finding if broken)
- `src/lib/` files stay free of React, DOM and Next imports.
- Old saved progress (`{ "day-12": true }` under `training_progress`) still loads, and notes are never stored under that key.
- Existing completed-day progress and sign-in behavior are unchanged unless the ticket says so.
- Commit messages and the PR description carry no AI attribution.

## What Important means here
Important is for findings that break behavior, lose or leak data, or break a rule above. Style and naming are Nits.

## Cap the nits
At most five Nits per review. Summarize the rest as a count.

## Do not report
Anything `npm run lint` or `npm run build` already enforces, and the `docs/` text itself.
