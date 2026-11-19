import Badge from '@/components/Badge';
import OverviewGrid from '@/components/OverviewGrid';
import { CAPSTONE_DAYS } from '@/data/capstone-days';

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Days 12–15 — Cross-functional capstone (everyone)
        </h1>
        <Badge label="Everyone" variant="default" />
      </div>
      <p className="mt-2 text-gray-600">
        Everyone, Days 12–15. One real-ish mini-product: “client” (the lead) wants a feature for the
        training app.
      </p>
      <div className="mt-8">
        <OverviewGrid days={CAPSTONE_DAYS} />
      </div>
    </div>
  );
}
