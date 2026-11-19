import Link from 'next/link';
import { notFound } from 'next/navigation';
import Badge from '@/components/Badge';
import CompletionCard from '@/components/CompletionCard';
import RichText from '@/components/RichText';
import SkillAccordion from '@/components/SkillAccordion';
import { CAPSTONE_DAYS, getCapstoneDay } from '@/data/capstone-days';

export function generateStaticParams() {
  return CAPSTONE_DAYS.map((d) => ({ dayId: d.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ dayId: string }> }) {
  const { dayId } = await params;
  const day = getCapstoneDay(dayId);
  return { title: day?.title ?? 'AI Tools - Training' };
}

const RELATED = ['Course catalog', 'Developer track', 'BA/QA track', 'Shared fundamentals'];

export default async function DayPage({ params }: { params: Promise<{ dayId: string }> }) {
  const { dayId } = await params;
  const day = getCapstoneDay(dayId);
  if (!day) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <nav className="text-sm text-gray-600">
        <Link href="/" className="text-violet-700 hover:underline">
          Schedule
        </Link>{' '}
        / Capstone / Day {day.dayNumber}
      </nav>

      <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-violet-700">
        {day.eyebrow}
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{day.title}</h1>
      <div className="mt-3 flex gap-2">
        {day.badges.map((b) => (
          <Badge key={b.label} label={b.label} variant={b.variant} />
        ))}
      </div>

      {day.intro && (
        <p className="mt-4 text-gray-700">
          <RichText text={day.intro} />
        </p>
      )}

      {day.sections.map((section, si) => (
        <div key={si}>
          {section.heading && <h3 className="mt-6 font-semibold">{section.heading}</h3>}
          <ul className="mt-2 list-disc space-y-2 pl-6">
            {section.bullets.map((b, bi) => (
              <li key={bi}>
                {b.lead && <strong>{b.lead} </strong>}
                <RichText text={b.text} />
                {b.link && (
                  <>
                    {' '}
                    <a
                      href={b.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-700 hover:underline"
                    >
                      {b.link.label}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {day.callouts?.map((c, ci) =>
        c.variant === 'exercise' ? (
          <div key={ci} className="mt-6 rounded-xl border border-violet-200 bg-violet-50/70 p-5">
            <span className="rounded-md bg-violet-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              {c.badge}
            </span>
            <p className="mt-3">
              <strong>{c.lead}</strong> {c.text}
            </p>
          </div>
        ) : (
          <div key={ci} className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-5">
            <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              {c.badge}
            </span>
            {c.badgeSubtext && <span className="ml-2 text-sm text-gray-600">{c.badgeSubtext}</span>}
            <ul className="mt-3 list-disc space-y-1 pl-6">
              {c.bullets?.map((b, bi) => (
                <li key={bi}>{b}</li>
              ))}
            </ul>
          </div>
        ),
      )}

      <h2 className="mb-4 mt-8 text-2xl font-bold">Skills today</h2>
      <ul className="list-disc space-y-3 pl-6">
        {day.skills.map((s, i) => (
          <li key={i}>
            <SkillAccordion skill={s} />
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <CompletionCard dayId={day.id} dayNumber={day.dayNumber} />
      </div>

      <p className="mt-6 text-sm text-gray-600">
        Related:{' '}
        {RELATED.map((r, i) => (
          <span key={r}>
            {i > 0 && ' · '}
            <Link href="/" className="text-violet-700 hover:underline">
              {r}
            </Link>
          </span>
        ))}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {day.prev ? (
          <Link
            href={day.prev.href}
            className="rounded-xl border border-gray-200 p-4 hover:border-violet-300"
          >
            <div className="text-xs text-gray-600">← Previous</div>
            <div className="font-medium">{day.prev.label}</div>
          </Link>
        ) : (
          <div />
        )}
        {day.next && (
          <Link
            href={day.next.href}
            className="rounded-xl border border-gray-200 p-4 text-right hover:border-violet-300"
          >
            <div className="text-xs text-gray-600">Next →</div>
            <div className="font-medium">{day.next.label}</div>
          </Link>
        )}
      </div>
    </div>
  );
}
