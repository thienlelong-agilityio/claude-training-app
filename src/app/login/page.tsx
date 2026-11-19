'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  DEFAULT_MOCK_USER,
  loadAuthUser,
  loadLocalProgress,
  mockCloudClient,
  saveAuthUser,
  type MockUser,
} from '@/lib/progress';

export default function LoginPage() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [name, setName] = useState(DEFAULT_MOCK_USER.name);
  const [email, setEmail] = useState(DEFAULT_MOCK_USER.email);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    const stored = loadAuthUser();
    if (stored) {
      setUser(stored);
      setName(stored.name);
      setEmail(stored.email);
    }
  }, []);

  async function signIn() {
    const next: MockUser = {
      name: name.trim() || DEFAULT_MOCK_USER.name,
      email: email.trim() || DEFAULT_MOCK_USER.email,
    };
    saveAuthUser(next);
    mockCloudClient.isSignedIn = true;
    mockCloudClient.user = next;
    await mockCloudClient.saveAll(loadLocalProgress());
    const wasSignedIn = user !== null;
    setUser(next);
    setMessage(wasSignedIn ? 'Changes saved successfully.' : 'Signed in successfully.');
    window.dispatchEvent(new Event('training-auth-changed'));
  }

  function signOut() {
    saveAuthUser(null);
    mockCloudClient.isSignedIn = false;
    mockCloudClient.user = null;
    setUser(null);
    setMessage('Signed out successfully.');
    window.dispatchEvent(new Event('training-auth-changed'));
  }

  const input = 'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm';
  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-gray-600">
        This is a mock Google sign-in. Nothing leaves your browser.
      </p>
      {user && (
        <p className="mt-4 text-sm">
          Signed in as {user.name} ({user.email})
        </p>
      )}
      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Display name
          </label>
          <input id="name" className={input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            className={input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => void signIn()}
          className="rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          {user ? 'Save changes' : 'Sign in with Google (Mock)'}
        </button>
        {user && (
          <button
            type="button"
            onClick={signOut}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Sign out
          </button>
        )}
      </div>
      <div aria-live="polite" role="status" className="mt-4 min-h-[2.25rem]">
        {message && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
            ✓ {message}
          </p>
        )}
      </div>
      <Link href="/" className="mt-4 inline-block text-sm text-violet-700 hover:underline">
        ← Back to Schedule
      </Link>
    </div>
  );
}
