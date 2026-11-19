'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CapstoneDay } from '@/data/capstone-days';
import { loadLocalProgress, type LegacyProgressMap } from '@/lib/progress';
import Badge from './Badge';

export default function OverviewGrid({ days }: { days: CapstoneDay[] }) {
  const [progress, setProgress] = useState<LegacyProgressMap>({});

  useEffect(() => {
    setProgress(loadLocalProgress());
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {days.map((day) => {
        const done = progress[day.id] === true;
        return (
          <Link
            key={day.id}
            href={`/schedule/${day.id}`}
            className={`rounded-xl border p-4 transition hover:shadow-sm ${
              done ? 'border-emerald-400' : 'border-gray-200'
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-700">
              Day {day.dayNumber}
            </div>
            <div className="mt-1 font-bold">{day.shortTitle}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {day.badges.map((b) => (
                <Badge key={b.label} label={b.label} variant={b.variant} />
              ))}
            </div>
            {done && <div className="mt-3 text-xs font-medium text-emerald-700">✓ Completed</div>}
          </Link>
        );
      })}
    </div>
  );
}
