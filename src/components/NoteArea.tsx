'use client';

import { useEffect, useRef, useState, type ChangeEvent, type CompositionEvent } from 'react';
import {
  applyEdit,
  charsLeft,
  flushPending,
  loadNote,
  type EditKind,
  type FlushResult,
} from '@/lib/notes';

const SAVE_DELAY_MS = 2000;

export default function NoteArea({ dayId }: { dayId: string }) {
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [shortened, setShortened] = useState(false);

  const textRef = useRef('');
  const pendingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleRef = useRef<() => void>(() => {});

  useEffect(() => {
    const initial = loadNote(dayId);
    textRef.current = initial;
    pendingRef.current = false;
    setText(initial);
    setLoaded(true);

    // Save the pending text now. Only when something is pending, so a
    // development-mode remount or a repeat event never saves unchanged text.
    function flush(): FlushResult {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const r = flushPending(dayId, textRef.current, pendingRef.current);
      pendingRef.current = r.pending;
      return r.result;
    }

    function onTimer() {
      const result = flush();
      if (result === 'saved') setSaved(true);
      if (result === 'failed') setSaveFailed(true);
    }

    function onHide() {
      if (document.visibilityState === 'hidden') onTimer();
    }

    scheduleRef.current = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onTimer, SAVE_DELAY_MS);
    };

    window.addEventListener('pagehide', onTimer);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pagehide', onTimer);
      document.removeEventListener('visibilitychange', onHide);
      scheduleRef.current = () => {};
      flush();
    };
  }, [dayId]);

  function commit(value: string, kind: EditKind) {
    const result = applyEdit(textRef.current, value, kind);
    // A refused keystroke changes nothing: leave the save state alone.
    if (result.text === textRef.current) {
      setText(result.text);
      if (result.shortened) setShortened(true);
      return;
    }
    textRef.current = result.text;
    pendingRef.current = true;
    setText(result.text);
    setShortened(result.shortened);
    setSaved(false);
    setSaveFailed(false);
    scheduleRef.current();
  }

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const native = e.nativeEvent as InputEvent;
    // While an IME is composing, show the text but do not refuse or cut it;
    // it is applied when the composition ends.
    if (native.isComposing) {
      setText(e.target.value);
      return;
    }
    const type = native.inputType ?? '';
    const kind: EditKind = type === 'insertText' || type === 'insertLineBreak' ? 'type' : 'paste';
    commit(e.target.value, kind);
  }

  function onCompositionEnd(e: CompositionEvent<HTMLTextAreaElement>) {
    commit(e.currentTarget.value, 'type');
  }

  const inputId = `note-${dayId}`;
  return (
    <div className="mt-4 rounded-xl border border-gray-200 p-4">
      <label htmlFor={inputId} className="font-bold">
        What I shipped today
      </label>

      <textarea
        id={inputId}
        value={text}
        disabled={!loaded}
        onChange={onChange}
        onCompositionEnd={onCompositionEnd}
        rows={5}
        className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm"
      />
      <div className="mt-1 text-sm text-gray-600">{charsLeft(text)} characters left</div>
      <div role="status" className="mt-1 min-h-5 text-sm">
        {shortened && (
          <span className="mr-3 text-amber-700">Your note was shortened to 500 characters.</span>
        )}
        {saved && <span className="text-emerald-700">Saved</span>}
        {saveFailed && (
          <span className="text-red-700">
            Could not save your note. It may be lost if you leave this page.
          </span>
        )}
      </div>
      {/* T03 slot: copy row */}
    </div>
  );
}
