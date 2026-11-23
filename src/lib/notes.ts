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

// One Segmenter for the whole module: the counter runs on every render.
let segmenter: Intl.Segmenter | null | undefined;

function getSegmenter(): Intl.Segmenter | null {
  if (segmenter === undefined) {
    segmenter =
      typeof Intl !== 'undefined' && 'Segmenter' in Intl
        ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
        : null;
  }
  return segmenter;
}

// Split into characters as the learner sees them (an emoji is one).
function toChars(text: string): string[] {
  const seg = getSegmenter();
  if (seg) return Array.from(seg.segment(text), (s) => s.segment);
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

export type FlushResult = 'none' | 'saved' | 'failed';

/**
 * Save the text that is waiting to be saved. Nothing pending means nothing is
 * saved. If saving fails the text stays pending, so the next flush retries it
 * and the failure is not forgotten.
 */
export function flushPending(
  dayId: string,
  text: string,
  pending: boolean,
  storage: NoteStorage | null = defaultStorage(),
): { result: FlushResult; pending: boolean } {
  if (!pending) return { result: 'none', pending: false };
  const ok = saveNote(dayId, text, storage);
  return ok ? { result: 'saved', pending: false } : { result: 'failed', pending: true };
}

export type EditKind = 'type' | 'paste';

/**
 * Apply an edit. Keeps the first 500 characters of the new text.
 * `kind` says how the text changed: typed (a keystroke) or pasted (paste, drop).
 * A typed character over the limit is refused silently and the old text is kept.
 * A paste over the limit is cut to 500 and `shortened` is true.
 * When `kind` is not given, an edit that adds more than one character counts as a paste.
 */
export function applyEdit(
  oldText: string,
  newText: string,
  kind?: EditKind,
): { text: string; shortened: boolean } {
  const newChars = countChars(newText);
  if (newChars <= NOTE_LIMIT) return { text: newText, shortened: false };
  const isPaste = kind ? kind === 'paste' : newChars - countChars(oldText) > 1;
  // Typing over the limit: refuse it and keep the old text,
  // so a character typed in the middle never pushes the end of the note out.
  if (!isPaste) return { text: cut(oldText), shortened: false };
  return { text: cut(newText), shortened: true };
}
