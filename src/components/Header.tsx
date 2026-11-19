'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadAuthUser, type MockUser } from '@/lib/progress';

export default function Header() {
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    const refresh = () => setUser(loadAuthUser());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('training-auth-changed', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('training-auth-changed', refresh);
    };
  }, []);

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-bold">
          AI Tools - Training
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Schedule
          </Link>
          {user ? (
            <Link
              href="/login"
              className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700"
            >
              {user.name}
            </Link>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
