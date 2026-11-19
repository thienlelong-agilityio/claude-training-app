# T02: Storage notice and sign-in / sign-out persistence
Covers: R6, R7, R9, R12. Depends on: T01.

## User Story
As a learner, I want to know where my note is saved, and to see it stay put when I sign in or out, so that I do not expect to find it on another device and never lose what I wrote.

## Scope
- A short line in the note area that says where the note is saved, for a learner who is not signed in and for one who is signed in (practice sign-in).
- The notes belong to the browser being used. Signing in does not move a note to another browser or device.
- A note written before signing in is still there, unchanged, after signing in. A note is still there after signing out.
- Signing in or out does not change existing completed-day progress.

## Out of scope
- The existing sentence "Saved to your Google account" on the completion box. It stays as it is today (known limitation in the spec).
- Moving notes to other browsers or devices (not possible in the practice version).
- Changing how the practice sign-in works.
- Writing, saving and limiting the note (T01).

## Messages
The storage line is not a temporary message. It is always shown in the note area and is correct whenever the page is loaded. It does not need to change while the page stays open, because signing in happens on a separate page. This ticket adds no temporary messages.

## Acceptance Criteria
- Given a learner who is not signed in, when they see the note area, then it shows the line "Saved in this browser only."
- Given a learner who is signed in with the practice sign-in, when they see the note area, then it shows the line "Saved in this browser. Sign-in here is a practice version and does not carry notes to other devices."
- Given either line, then it does not say or suggest that the note is stored in the cloud or in a Google account.
- Given a learner signs in or out and then opens a day page, when the page loads, then the line matches their current state.
- Given a note written in one browser, when the same learner signs in on a different browser or device, then the note is not there, as the line says.
- Given a learner who is not signed in wrote a note on Day 12, when they sign in on the sign-in page and open Day 12, then the same note is shown exactly as written.
- Given a signed-in learner has a note on Day 12, when they sign out and open Day 12, then the note is still shown.
- Given a learner signs in with a different name or email than before on the same browser, when they open a day page, then the existing notes are still shown. Notes belong to the browser, not to the practice account name.
- Given a learner with days marked complete, when they sign in or out, then those days still show as completed.
- Given a 500-character note, when the learner signs in or out, then all 500 characters are still there.

## Edge Cases
- The line is correct whenever the page is loaded. It does not need to change while the page stays open, because signing in happens on a separate page.
- The learner signs in twice in a row: the note does not change.
- Two people share one browser and use different practice names: they see the same notes, because notes belong to the browser. This is expected in the practice version.

## Open questions
None.
