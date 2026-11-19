# Intent: Daily standup note
Author: Thien Le (Training Lead). Status: approved.

Source: `client-brief.md` (same folder)

## Problem
At the end of each day, learners give a 10-minute standup in Slack about what they shipped that day. Today they retype everything from memory, because the training app has no place to write it down. The "Mark Day X as complete" checkbox only records done or not done, not what was actually delivered.

## Proposed outcome
- A quick spot on each day's page, right next to the "Mark Day X as complete" checkbox, where a learner jots a few lines about what they shipped today.
- A quick copy button, so the learner can paste that note straight into Slack for the end-of-day standup without retyping.

## Affected users and systems
- **Users:** learners on the Days 12–15 Capstone. The lead, who runs the standup, sees the result only through what learners paste into Slack.
- **App:** the page for each Capstone day, next to the completion checkbox.
- **Slack:** the learner pastes by hand. The brief does not ask for any Slack connection.

## Constraints
- The first release of the app deliberately left out standup notes and the Slack copy button. This feature adds them; everything else that release left out stays out of scope.
- Learners' existing completed-day progress must stay intact after this feature is added.
- Sign-in and sync stay as they are today (a practice version, not a real Google account).

## Open questions
1. What should end up in Slack: only the learner's note, or the note together with the day's title (e.g. "Day 12 — Kickoff and planning")?
   - **Client answer:** Include the day's title and status header: `**[Day X — Title]** (Completed|In Progress)` followed by the note on a new line.
2. Should learners still be able to edit or keep their note if they uncheck a completed day, and can they edit it after the day is marked complete?
   - **Client answer:** Yes — learners can edit notes even after marking the day complete, and unchecking the day must keep the note intact.
3. Is the note private to the learner, or should the lead or other learners be able to see it inside the app, not only in Slack?
   - **Client answer:** Private to the learner inside the app; leads and teammates only see it when pasted into Slack.
4. Should a signed-in learner's note be available on another device or browser, or is it enough that it stays where it was written?
   - **Client answer:** Yes — for signed-in learners, notes should follow their account across browsers/devices (within our current practice sync setup).
5. How will we know this works (for example, most learners use the copy button at the end-of-day standup, or standup prep time drops)?
   - **Client answer:** Success measure: at least 80% of learners use the copy button for daily standups during Capstone Days 12–15, cutting standup prep to under 1 minute.
