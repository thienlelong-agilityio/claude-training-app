import { describe, expect, it } from 'vitest';
import { loadLocalProgress, saveLocalProgress } from './progress';
import {
  NOTE_LIMIT,
  applyEdit,
  charsLeft,
  loadNote,
  noteKey,
  saveNote,
  type NoteStorage,
} from './notes';

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  const storage: NoteStorage = {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
  };
  return { storage, data };
}

describe('save and load', () => {
  it('loads a saved note back exactly, with line breaks', () => {
    const { storage } = fakeStorage();
    const text = 'line one\nline two\n\nline four';
    expect(saveNote('day-12', text, storage)).toBe(true);
    expect(loadNote('day-12', storage)).toBe(text);
  });

  it('keeps notes of different days apart', () => {
    const { storage } = fakeStorage();
    saveNote('day-12', 'twelve', storage);
    saveNote('day-13', 'thirteen', storage);
    expect(loadNote('day-12', storage)).toBe('twelve');
    expect(loadNote('day-13', storage)).toBe('thirteen');
    expect(noteKey('day-12')).toBe('training_note_day-12');
  });

  it('loads a missing or unreadable value as an empty note', () => {
    expect(loadNote('day-12', fakeStorage().storage)).toBe('');
    const broken: NoteStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {},
    };
    expect(loadNote('day-12', broken)).toBe('');
    expect(loadNote('day-12', null)).toBe('');
  });

  it('shows a stored note longer than 500 cut to 500', () => {
    const { storage } = fakeStorage({ [noteKey('day-12')]: 'a'.repeat(700) });
    expect(loadNote('day-12', storage)).toHaveLength(NOTE_LIMIT);
  });

  it('returns false and does not throw when storage refuses the save', () => {
    const refusing: NoteStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
    };
    expect(saveNote('day-12', 'x', refusing)).toBe(false);
    expect(saveNote('day-12', 'x', null)).toBe(false);
  });

  it('saves an empty note', () => {
    const { storage, data } = fakeStorage({ [noteKey('day-12')]: 'old' });
    expect(saveNote('day-12', '', storage)).toBe(true);
    expect(data.get(noteKey('day-12'))).toBe('');
  });
});

describe('limit, cut and characters left', () => {
  it('counts characters left, line breaks included', () => {
    expect(charsLeft('')).toBe(500);
    expect(charsLeft('twelve chars')).toBe(488);
    expect(charsLeft('a\nb')).toBe(497);
  });

  it('keeps exactly 500 characters with no message', () => {
    const text = 'a'.repeat(500);
    expect(applyEdit('a'.repeat(499), text)).toEqual({ text, shortened: false });
    expect(charsLeft(text)).toBe(0);
  });

  it('cuts the 501st typed character silently', () => {
    let text = '';
    let last = { text, shortened: false };
    for (let i = 0; i < 501; i++) {
      last = applyEdit(text, text + 'a');
      text = last.text;
    }
    expect(text).toHaveLength(500);
    expect(last.shortened).toBe(false);
  });

  it('cuts a 600-character paste to 500 and reports it', () => {
    const result = applyEdit('', 'b'.repeat(600));
    expect(result.text).toBe('b'.repeat(500));
    expect(result.shortened).toBe(true);
  });

  it('does not report a paste of exactly 500', () => {
    expect(applyEdit('', 'c'.repeat(500)).shortened).toBe(false);
  });

  it('keeps the first 500 of the whole new text when pasting into a long note', () => {
    const old = 'a'.repeat(400);
    const result = applyEdit(old, old + 'b'.repeat(200));
    expect(result.text).toBe('a'.repeat(400) + 'b'.repeat(100));
    expect(result.shortened).toBe(true);
  });

  it('counts an emoji as one and never splits it at the cut', () => {
    const text = 'a'.repeat(499) + '👍🏽';
    expect(charsLeft(text)).toBe(0);
    expect(applyEdit('', text).text).toBe(text);
    const over = applyEdit('a'.repeat(499), 'a'.repeat(499) + '👍🏽👍🏽');
    expect(over.text).toBe('a'.repeat(499) + '👍🏽');
  });

  it('counts line breaks as characters when cutting', () => {
    const result = applyEdit('', '\n'.repeat(510));
    expect(result.text).toBe('\n'.repeat(500));
  });
});

describe('independence from progress', () => {
  it('leaves the training_progress value unchanged when a note is saved', () => {
    const progress = '{"day-12":true}';
    const { storage, data } = fakeStorage({ training_progress: progress });
    saveNote('day-12', 'shipped it', storage);
    expect(data.get('training_progress')).toBe(progress);
  });

  it('still loads old boolean progress', () => {
    const data = new Map([['training_progress', '{"day-12":true}']]);
    const store = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
    };
    expect(loadLocalProgress(store as never)).toEqual({ 'day-12': true });
    expect(typeof saveLocalProgress).toBe('function');
  });
});
