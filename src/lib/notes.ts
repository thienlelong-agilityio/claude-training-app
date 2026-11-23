// Pure note logic: no React, DOM or Next imports, so Vitest runs it in Node.
// One note per day, stored under its own key. Never touches `training_progress`.

export const NOTE_LIMIT = 500;

export type NoteStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function noteKey(dayId: string): string {
  return `training_note_${dayId}`;
}

function defaultStorage(): NoteStorage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

// Split into characters as the learner sees them (an emoji is one).
function toChars(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

export function countChars(text: string): number {
  return toChars(text).length;
}

export function charsLeft(text: string): number {
  return Math.max(0, NOTE_LIMIT - countChars(text));
}

function cut(text: string): string {
  const chars = toChars(text);
  return chars.length <= NOTE_LIMIT ? text : chars.slice(0, NOTE_LIMIT).join('');
}

/** Load one day's note. Missing, damaged or unreadable storage gives an empty note. */
export function loadNote(dayId: string, storage: NoteStorage | null = defaultStorage()): string {
  try {
    if (!storage) return '';
    const raw = storage.getItem(noteKey(dayId));
    return typeof raw === 'string' ? cut(raw) : '';
  } catch {
    return '';
  }
}

/** Save one day's note. Returns false (never throws) when saving is not possible. */
export function saveNote(
  dayId: string,
  text: string,
  storage: NoteStorage | null = defaultStorage(),
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(noteKey(dayId), text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Apply an edit. Keeps the first 500 characters of the new text.
 * `shortened` is true only when more than one character was added at once
 * (a paste) and the result went over the limit. Typing at the limit is cut silently.
 */
export function applyEdit(
  oldText: string,
  newText: string,
): { text: string; shortened: boolean } {
  const newChars = countChars(newText);
  if (newChars <= NOTE_LIMIT) return { text: newText, shortened: false };
  const added = newChars - countChars(oldText);
  return { text: cut(newText), shortened: added > 1 };
}
