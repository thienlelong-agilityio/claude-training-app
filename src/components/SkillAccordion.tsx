'use client';

import { useId, useState } from 'react';
import type { SkillItem } from '@/data/capstone-days';
import RichText from './RichText';

export default function SkillAccordion({ skill }: { skill: SkillItem }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div>
      <strong>
        <RichText text={skill.name} />
      </strong>{' '}
      — <RichText text={skill.description} />{' '}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="rounded-md border border-violet-200 bg-white px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-50"
      >
        {open ? '▾' : '▸'} How to set up
      </button>
      {open && (
        <div id={panelId} className="mt-2 ml-4 border-l-2 border-violet-200 pl-3 text-sm text-gray-600">
          <RichText text={skill.setupHint} />
        </div>
      )}
    </div>
  );
}
