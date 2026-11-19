# T03: Copy for Slack and empty-note guard
Covers: R4, R8, R10, R11. Depends on: T01.

## User Story
As a learner, I want one button that copies my note with the day's header, and that waits until I have written something, so that I can paste it straight into Slack for the end-of-day standup without retyping and never paste an empty standup by accident.

## Scope
- A button labelled "Copy for Slack" in the note area.
- Pressing it puts this on the clipboard: a header line, then the note on the next line.
- The header line is `**[<day title>]** (<status>)`. The day title is the full title shown at the top of the day page. The status is "Completed" if the day is ticked at that moment, otherwise "In Progress".
- A message after the copy: success or failure.
- The button works with the keyboard.
- While the note is empty, the button cannot be used and a hint explains why. A note that contains only spaces or line breaks counts as empty.

## Out of scope
- Sending anything to Slack. The learner pastes by hand.
- Checking how the header looks in Slack. The Client does that before release (see the index).
- Writing and saving the note (T01).

## Messages
Each message appears after its action and clears as soon as the learner edits the note again. None is shown when the page loads. Messages do not replace each other; each one clears on its own. The hint is not a temporary message: it is shown exactly while the note is empty, including on page load.

| Message | Appears when | Clears when |
|---|---|---|
| "Copied to your clipboard" | The copy worked | The learner edits the note again |
| "Copy did not work. Select your note and copy it manually." | The browser blocks copying | The learner edits the note again, or presses the button again (the new result replaces it) |
| "Write a note first to copy it." (hint) | The note is empty | The note has text |

## Acceptance Criteria
- Given Day 12 is ticked and the note is "Built login fix" then a line break then "Wrote tests", when the learner presses the button, then the clipboard contains exactly these three lines: `**[Day 12 — Kickoff and planning]** (Completed)`, then `Built login fix`, then `Wrote tests`.
- Given the same note and Day 12 not ticked, when the learner presses the button, then the first line ends with "(In Progress)".
- Given Day 15, when the learner presses the button, then the first line starts with `**[Day 15 — Review, merge, demo — Final checkpoint]**`.
- Given the copy worked, then the learner sees "Copied to your clipboard", and a screen reader announces it.
- Given the browser blocks copying, when the learner presses the button, then the learner sees "Copy did not work. Select your note and copy it manually." and the note stays as it was.
- Given a learner uses only the keyboard, when they press Tab, then the button can be reached and pressed with Enter or Space.
- Given the learner never presses the button, then nothing is copied or sent anywhere.
- Given an empty note, when the page loads, then the "Copy for Slack" button cannot be pressed and the hint "Write a note first to copy it." is visible next to it.
- Given an empty note, when the learner tries to press the button, then nothing is copied and the clipboard is unchanged.
- Given an empty note, when the learner types at least one character that is not a space or line break, then the button becomes usable and the hint disappears.
- Given a note that contains only spaces and line breaks, then the button cannot be pressed and the hint is shown.
- Given a note with text, when the learner deletes all of it, then the button cannot be pressed again and the hint comes back.
- Given a screen reader user, when the button cannot be pressed, then the hint is read out with it.

## Edge Cases
- The learner typed less than 2 seconds ago and the note is not yet saved: the copy uses the latest text on screen.
- The learner ticks or unticks the day after copying: the next copy uses the new status.
- The note has several line breaks: they are kept exactly as typed.
- The learner has a saved note, reloads the page, and the note loads: the button is usable as soon as the note is shown.

## Open questions
None.
