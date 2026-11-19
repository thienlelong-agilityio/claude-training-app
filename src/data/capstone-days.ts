export type BadgeVariant = 'default' | 'checkpoint';

export interface BadgeItem {
  label: string;
  variant: BadgeVariant;
}

export interface ContentBullet {
  /** Optional bold lead-in before the text (e.g. "Rule of the day:") */
  lead?: string;
  /** Body text. Wrap inline code in backticks (e.g. `/loop`, `CLAUDE.md`) for RichText. */
  text: string;
  /** Optional external link rendered inline at the end of the text */
  link?: { label: string; href: string };
}

export interface ContentSection {
  heading?: string;
  bullets: ContentBullet[];
}

export interface CalloutBox {
  variant: 'exercise' | 'checkpoint';
  badge: string;
  badgeSubtext?: string;
  lead?: string;
  text?: string;
  bullets?: string[];
}

export interface SkillItem {
  name: string;
  description: string;
  setupHint: string;
}

export interface NavLinkRef {
  label: string;
  href: string;
}

export type CapstoneDayId = 'day-12' | 'day-13' | 'day-14' | 'day-15';

export interface CapstoneDay {
  id: CapstoneDayId;
  dayNumber: number;
  eyebrow: string;
  title: string;
  shortTitle: string;
  badges: BadgeItem[];
  intro?: string;
  sections: ContentSection[];
  callouts?: CalloutBox[];
  skills: SkillItem[];
  prev?: NavLinkRef;
  next?: NavLinkRef;
}

const EYEBROW = 'CAPSTONE · DAYS 12–15 · CROSS-FUNCTIONAL';

export const CAPSTONE_DAYS: CapstoneDay[] = [
  {
    id: 'day-12',
    dayNumber: 12,
    eyebrow: EYEBROW,
    title: 'Day 12 — Kickoff and planning',
    shortTitle: 'Kickoff and planning',
    badges: [{ label: 'Everyone', variant: 'default' }],
    intro:
      'One real-ish mini-product: “client” (the lead) wants a feature for the training app.',
    sections: [
      {
        bullets: [
          { text: 'Lead briefs the feature roughly on purpose (vague, like real clients).' },
          {
            text: 'BA runs intake: extract requirements, open questions back to "client", ticket pack + spec artifact. QA drafts the test matrix from the criteria. Devs ask questions only through the tickets (that\'s the point).',
          },
          {
            lead: 'Course (leads):',
            text: 'finish',
            link: {
              label: 'AI-native SDLC playbook.',
              href: 'https://academy.claude.com/courses/ai-native-sdlc-playbook',
            },
          },
        ],
      },
    ],
    skills: [
      {
        name: 'Ticket-pack writing (story + Given/When/Then + open questions)',
        description: 'Core BA skill; the zero-questions test makes quality measurable',
        setupHint: 'See Day 5 for the setup steps.',
      },
    ],
    prev: undefined,
    next: { label: 'Day 13 — Build', href: '/schedule/day-13' },
  },
  {
    id: 'day-13',
    dayNumber: 13,
    eyebrow: EYEBROW,
    title: 'Day 13 — Build',
    shortTitle: 'Build',
    badges: [{ label: 'Everyone', variant: 'default' }],
    sections: [
      {
        bullets: [
          { text: 'Devs implement in parallel isolated sessions, plan mode first, PRs per ticket.' },
          { text: 'QA authors the automated suite alongside; BA updates the spec as questions resolve.' },
          {
            lead: 'Rule of the day:',
            text: 'every artifact of work (spec, tests, PRs, notes) is Claude-assisted and human-edited.',
          },
        ],
      },
    ],
    skills: [
      {
        name: 'Plan mode',
        description:
          'Approve the plan before any code is written — the biggest lever for trusting agentic work on real tickets',
        setupHint:
          'Press `Shift+Tab` in Claude Code to enter Plan Mode before editing any files. Review and approve the plan before switching to Auto Mode.',
      },
      {
        name: 'Git worktrees + parallel sessions',
        description: 'Two tickets in flight, two isolated agents, zero crosstalk',
        setupHint:
          'Open a second session in Claude Code Desktop with git worktree isolation enabled so each ticket runs on its own isolated branch and folder.',
      },
    ],
    prev: { label: 'Day 12 — Kickoff and planning', href: '/schedule/day-12' },
    next: { label: 'Day 14 — Test and harden', href: '/schedule/day-14' },
  },
  {
    id: 'day-14',
    dayNumber: 14,
    eyebrow: EYEBROW,
    title: 'Day 14 — Test and harden',
    shortTitle: 'Test and harden',
    badges: [{ label: 'Everyone', variant: 'default' }],
    sections: [
      {
        bullets: [
          { text: 'QA regression + automated suite in CI; `/loop` babysits the build.' },
          { text: 'Devs run `/code-review` (ultrareview if anything touched auth/data); fix findings.' },
          { text: 'BA drafts client-facing release notes artifact.' },
        ],
      },
    ],
    skills: [
      {
        name: '`/loop`',
        description: 'Scheduled re-runs: watch a PR, babysit CI, morning maintenance',
        setupHint:
          'Run `/loop 5m check CI status on open PRs and fix failures` inside your Claude Code session.',
      },
      {
        name: '`/code-review` → ultrareview',
        description: 'Catch what tired humans miss; multi-agent cloud review for risky branches',
        setupHint:
          'Run `/code-review` for local multi-agent review, or `/code-review ultra` for deep cloud review on auth/data changes.',
      },
      {
        name: 'Release notes from merged PRs (artifact)',
        description: 'Client-facing value visible in minutes',
        setupHint:
          'Ask Claude to summarize merged PRs since the last tag into a client-facing Release Notes artifact.',
      },
    ],
    prev: { label: 'Day 13 — Build', href: '/schedule/day-13' },
    next: { label: 'Day 15 — Review, merge, demo — Final checkpoint', href: '/schedule/day-15' },
  },
  {
    id: 'day-15',
    dayNumber: 15,
    eyebrow: EYEBROW,
    title: 'Day 15 — Review, merge, demo — Final checkpoint',
    shortTitle: 'Review, merge, demo — Final checkpoint',
    badges: [
      { label: 'Everyone', variant: 'default' },
      { label: 'Checkpoint', variant: 'checkpoint' },
    ],
    sections: [
      {
        heading: 'Morning — review and merge:',
        bullets: [
          {
            text: "Cross-review: dev reviews QA's test code; QA reviews a dev PR; BA checks merged behavior against the acceptance criteria — gaps become same-day tickets.",
          },
          {
            text: 'Merge, tag a release, run the deploy; Remote-Control/Dispatch demo: approve and steer a session from a phone.',
          },
        ],
      },
      {
        heading: 'Afternoon — demo, retro, playbook:',
        bullets: [
          {
            text: 'Each pair demos 10 minutes — the flow, not slides: ticket → plan → PR → review → tests → artifact → shipped.',
          },
          {
            lead: 'Retro:',
            text: 'what to standardize (`CLAUDE.md` rules, skills, hooks, review checklist) — capture as repo issues owned by named people.',
          },
        ],
      },
    ],
    callouts: [
      {
        variant: 'exercise',
        badge: 'Exercise',
        lead: 'Personal playbook:',
        text: 'each person writes their one-page "how I work with Claude" — favorite workflows, prompts, guardrails — shared as artifacts.',
      },
      {
        variant: 'checkpoint',
        badge: 'Final checkpoint',
        badgeSubtext: 'Company-ready',
        bullets: [
          'Capstone shipped end-to-end.',
          "Every person has demonstrated their track's skill bar (Days 3/6/11 checklists all green).",
        ],
      },
    ],
    skills: [
      {
        name: 'Remote Control (`/rc`)',
        description: 'Steer a session from your phone',
        setupHint:
          'Run `/rc` in your local Claude Code session and scan or open the link from the Claude mobile app.',
      },
      {
        name: 'Dispatch (phone-kicked Code sessions, push alerts; Pro/Max only)',
        description: 'Hand a task over while commuting',
        setupHint:
          'Enable Dispatch in the Claude Desktop Cowork tab to kick off Code sessions remotely from mobile.',
      },
      {
        name: 'Personal “how I work with Claude” playbook',
        description: 'Guardrails and favorite workflows, shared',
        setupHint:
          'Draft a 1-page Markdown artifact covering your daily loop, favorite prompts, and safety guardrails, then share it with the team.',
      },
    ],
    prev: { label: 'Day 14 — Test and harden', href: '/schedule/day-14' },
    next: { label: 'After the program', href: '/after-the-program' },
  },
];

export function getCapstoneDay(id: string): CapstoneDay | undefined {
  return CAPSTONE_DAYS.find((d) => d.id === id);
}
