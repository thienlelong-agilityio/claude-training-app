import Link from 'next/link';

const LINKS = ['Overview', 'Fundamentals', 'Developer', 'BA/QA', 'Courses', 'Schedule'];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 py-8">
      <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-4 px-6 text-sm text-gray-600">
        <p>
          AI Tools - Training — Example app. This is a sample training app built to practice the
          Claude training course (Days 12–15 Capstone). Content is for learning only; check the
          official Claude documentation for the latest features and course names.
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
