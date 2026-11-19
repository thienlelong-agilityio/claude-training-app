import type { BadgeVariant } from '@/data/capstone-days';

const STYLES: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  checkpoint: 'bg-emerald-100 text-emerald-800',
};

export default function Badge({ label, variant }: { label: string; variant: BadgeVariant }) {
  return (
    <span className={`rounded-md px-2.5 py-0.5 text-xs font-medium ${STYLES[variant]}`}>
      {label}
    </span>
  );
}
