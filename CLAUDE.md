# claude-training-app

Next.js 15 (App Router) + TypeScript + Tailwind CSS + Vitest.
Baseline v1.0 of the Days 12–15 Cross-functional Capstone pages from the AI Tools Training portal.

## Commands
- `npm run dev` — dev server at http://localhost:3000
- `npm test` — Vitest unit tests
- `npm run lint` — ESLint (next lint)
- `npm run build` — TypeScript check + Next.js production build

## Architecture
- `src/data/capstone-days.ts` — verbatim content for Days 12–15 (types + `CAPSTONE_DAYS`)
- `src/lib/progress.ts` — pure, testable storage + mock auth + mock cloud sync
- `src/components/` — UI components (`RichText`, `SkillAccordion`, `CompletionCard`, …)
- `src/app/` — Next.js routes (`/`, `/schedule/[dayId]`, `/login`, `/after-the-program`)

## Intent and spec artifacts (AI-native SDLC)
- One folder per change: `docs/features/<feature-slug>/` holding `client-brief.md` (source), `intent.md` (Stage 1), `spec.md` (Stage 2) and `tickets/`.
- Workflow, in order. Each step starts only after a person approves the one before:
  1. `/capture-intent` writes `intent.md` (BA/PO). Approved when its status is `approved`.
  2. `/write-spec` writes `spec.md` (PO reviews, resolves areas of concern with their owners).
  3. `/ticket-pack` writes `tickets/` (BA). Developers ask questions only through the tickets.
  4. `/test-matrix` writes `test-matrix.md` (QA).
  5. Developers then plan in plan mode and commit `plan.md` before any code.
- Policy skills (for example `privacy-and-ux`) are applied by `/write-spec` and `/ticket-pack`.

## Hard rules
- Keep `src/lib/progress.ts` free of React/DOM/Next imports so Vitest runs in Node.
- Never use `dangerouslySetInnerHTML` with user-supplied input.
- Preserve backward compatibility with legacy localStorage boolean data (`{ "day-12": true }` under `training_progress`).
- Always use Plan Mode before editing files on new feature tickets.
- Run `npm test` and `npm run build` before every commit.
- Commit messages and PR descriptions must NOT contain any AI attribution: no `Co-Authored-By: Claude`, no `Claude-Session` link, no "Generated with Claude Code", no mention of AI/Claude as author. Write them as plain, human-style messages.
