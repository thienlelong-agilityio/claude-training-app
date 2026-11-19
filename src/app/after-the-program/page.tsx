'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CAPSTONE_DAYS } from '@/data/capstone-days';
import { loadLocalProgress, type LegacyProgressMap } from '@/lib/progress';

export default function AfterTheProgramPage() {
  const [progress, setProgress] = useState<LegacyProgressMap>({});

  useEffect(() => {
    setProgress(loadLocalProgress());
  }, []);

  const count = CAPSTONE_DAYS.filter((d) => progress[d.id] === true).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="text-xs font-semibold uppercase tracking-wider text-violet-700">
        CAPSTONE · DAYS 12–15 · CROSS-FUNCTIONAL
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">After the program</h1>
      <p className="mt-6 text-2xl font-bold">{count} / 4 Capstone days marked complete</p>
      <ul className="mt-4 space-y-1">
        {CAPSTONE_DAYS.map((d) => (
          <li key={d.id}>
            {progress[d.id] === true ? '✓' : '○'} {d.title}
          </li>
        ))}
      </ul>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md border border-violet-200 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50"
      >
        ← Back to Schedule
      </Link>
    </div>
  );
}
