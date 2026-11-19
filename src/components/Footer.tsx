import Link from 'next/link';

const LINKS = ['Overview', 'Fundamentals', 'Developer', 'BA/QA', 'Courses', 'Schedule'];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 py-8">
      <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-4 px-6 text-sm text-gray-600">
        <p>
          AI Tools - Training — Plan. Feature and course names were verified against the official
          documentation on 2026-10-07; re-check the linked pages before each week.
        </p>
        <nav className="flex flex-wrap gap-4">
          {LINKS.map((l) => (
            <Link key={l} href="/" className="hover:text-gray-900">
              {l}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
