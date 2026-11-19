'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  loadAuthUser,
  loadLocalProgress,
  mockCloudClient,
  toggleDayComplete,
  type MockUser,
} from '@/lib/progress';

export default function CompletionCard({ dayId, dayNumber }: { dayId: string; dayNumber: number }) {
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChecked(loadLocalProgress()[dayId] === true);
    setUser(loadAuthUser());
    setMounted(true);
  }, [dayId]);

  async function onChange(next: boolean) {
    const stored = loadAuthUser();
    mockCloudClient.isSignedIn = stored !== null;
    mockCloudClient.user = stored;
    setUser(stored);
    setChecked(next);
    const result = await toggleDayComplete(dayId, next, { cloud: mockCloudClient });
    setChecked(result[dayId] === true);
  }

  const inputId = `complete-${dayId}`;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 p-4">
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={!mounted}
        onChange={(e) => void onChange(e.target.checked)}
        className="h-4 w-4"
      />
      <label htmlFor={inputId} className="font-bold">
        Mark Day {dayNumber} as complete
      </label>
      <span className="text-sm text-gray-600">
        {user ? (
          <>
            Saved to your Google account ({user.name}) — sign out on the{' '}
            <Link href="/login" className="text-violet-700 hover:underline">
              Sign in page
            </Link>
            .
          </>
        ) : (
          <>
            Saved in this browser — sign in on the{' '}
            <Link href="/login" className="text-violet-700 hover:underline">
              Sign in page
            </Link>{' '}
            to sync.
          </>
        )}
      </span>
    </div>
  );
}
