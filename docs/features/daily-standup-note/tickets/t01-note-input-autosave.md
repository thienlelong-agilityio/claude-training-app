# T01: Daily note input, auto-save and independence from completion
Covers: R1, R2, R3, R5, R7, R10, R13, R14. Depends on: none.

## User Story
As a learner, I want to write a few lines about what I shipped today right next to the "Mark Day X as complete" box, and keep editing them after I tick the day complete, without ever losing them, so that I do not have to remember it at standup time and can correct or add to what I shipped.

## Scope
- A note area on each of the four day pages (Days 12, 13, 14, 15), in the same area as the completion box.
- The note area has a visible label "What I shipped today". It starts empty.
- One note per day. Each note is shown only on its own day's page.
- The note saves by itself, and the learner sees a short "Saved" message.
- Limit of 500 characters, with a counter.
- The note stays editable whether the day is ticked or not.
- Ticking or unticking the day never changes or removes the note.

## Out of scope
- The copy button and the empty-note guard (T03).
- The line saying where the note is saved, and what happens when signing in or out (T02).
- Any change to how ticking a day works today (progress is unchanged).

## Messages
The counter "N characters left" is always visible and updates as the learner types. The messages below follow one rule: each appears after its action, clears as soon as the learner edits the note again, and none is shown when the page loads. Messages do not replace each other; each one clears on its own.

| Message | Appears when | Clears when |
|---|---|---|
| "Saved" | The note has been saved (2 seconds after the learner stops typing) | The learner edits the note again |
| "Your note was shortened to 500 characters." | The learner pastes text that makes the note longer than 500 characters | The learner edits the note again |
| "Could not save your note. It may be lost if you leave this page." | The browser does not allow saving | The learner edits the note again |

## Acceptance Criteria
- Given a learner opens the page for Day 12, 13, 14 or 15, when the page loads, then an empty note area labelled "What I shipped today" appears next to that day's "Mark Day X as complete" box.
- Given an empty note, when the learner types, then a counter shows how many of the 500 characters are left, and every character counts, including line breaks. For example, after typing 12 characters it shows "488 characters left".
- Given the learner stops typing, when 2 seconds pass, then the note is saved and the message "Saved" appears.
- Given a saved note, when the learner reloads the page or leaves and comes back to the same day page, then the note appears exactly as typed, with its line breaks.
- Given notes written on Day 12 and on Day 13, when the learner opens each day's page, then each page shows only its own note.
- Given a learner has a note, when they open the overview page or any other page, then the note text is not shown there.
- Given a learner had days marked complete before this feature, when they open a day page or the overview, then those days still show as completed ("✓ Completed" on the overview).
- Given a learner uses only the keyboard, when they press Tab, then they can reach the note area and type in it, and the "Saved" message is announced by a screen reader.
- Given a day is ticked complete and has a note, when the learner edits the note, then the edit is accepted and saved ("Saved" appears).
- Given a day is not ticked and has a note, when the learner edits the note, then the edit is accepted and saved ("Saved" appears).
- Given a ticked day with a note, when the learner unticks it, then the note text is unchanged and still editable, and the day shows as not completed.
- Given an unticked day with a note, when the learner ticks it, then the note text is unchanged.
- Given a day with a note, when the learner ticks and unticks it several times, then the note is identical each time.
- Given a learner with days ticked before this feature, when they tick or untick a day, then the other days' progress does not change.

## Edge Cases
- The learner types up to 500 characters: further typing is not accepted and the counter shows "0 characters left".
- The learner pastes text longer than the limit: only the first 500 characters are kept, and the message "Your note was shortened to 500 characters." appears.
- The learner deletes the whole note: the empty note is saved and "Saved" appears.
- The learner leaves the page less than 2 seconds after the last keystroke: the latest text is still saved.
- The browser does not allow saving: the learner sees "Could not save your note. It may be lost if you leave this page." and the text stays on screen.
- The learner ticks the day less than 2 seconds after typing: both the tick and the latest text are kept.
- The note is empty and the learner ticks or unticks the day: the note stays empty and nothing else changes.

## Open questions
None.
