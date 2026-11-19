# Spec: Daily standup note
From: intent.md (approved, commit 9074e74). Status: approved.
Reviewed by: Thien Le (Training Lead, acting as product owner), 2026-11-19. All areas of concern resolved (see below).
Skills applied: write-spec, privacy-and-ux (skills at commit 4ed3d55)

## Requirements
R1. On each Capstone day's page (Days 12–15), next to "Mark Day X as complete", a learner can write a short note about what they shipped that day.
R2. A learner can edit their note at any time, including after the day is marked complete.
R3. Unchecking a completed day never changes or removes the note.
R4. A copy button puts this text on the learner's clipboard: a first line `**[Day X — Title]** (Completed|In Progress)`, then the note on a new line. The status word is "Completed" when the day is ticked and "In Progress" when it is not. Before release, the Client pastes a sample into Slack to check the header looks right (see concern 4).
R5. The note is private to the learner inside the app. No screen shows a learner's note to the lead or to other learners. Others see it only if the learner pastes it into Slack.
R6. A learner's note is saved in the browser they are using. In this practice version, signing in does not move the note to another browser or device (see concern 1).
R7. Learners' existing completed-day progress, and how sign-in works today, are unchanged by this feature.
R8. After saving or copying, the learner sees a clear message that it worked. If copying fails, the message says what happened and what to do next. (Policy: privacy-and-ux, rule 5.)
R9. The note area tells the learner that the note is saved in this browser, and that in this practice version signing in does not carry it to other devices. It does not promise real cloud storage or a real Google account. (Policy: privacy-and-ux, rules 3 and 7.)
R10. The note field has a visible label, works with the keyboard, and its confirmation messages are announced to screen readers. (Policy: privacy-and-ux, rule 6.)
R11. When the note is empty, the copy button cannot be used, and a short hint tells the learner to write a note first (see concern 5).
R12. When a learner who already wrote a note signs in, the existing note is kept and is not overwritten (see concern 3). (Policy: privacy-and-ux, rule 4.)
R13. The note saves automatically while the learner types, and the learner sees a short "Saved" message. (Decided by the product owner while the tickets were written, 2026-11-19.)
R14. A note can be at most 500 characters. The learner sees how many characters are left, and cannot type past the limit. (Decided by the product owner while the tickets were written, 2026-11-19.)

## Current behavior
- Each day's page has a "Mark Day X as complete" box. Ticking it is remembered in the learner's browser, and the overview page shows "✓ Completed" for that day. Unticking marks it not completed.
- A learner who is not signed in sees "Saved in this browser — sign in on the Sign in page to sync." A signed-in learner sees "Saved to your Google account (name)". Sign-in is a practice version: no real Google account is used.
- In the practice version, nothing a signed-in learner does is stored anywhere except in their own browser. Another browser or device never sees it.
- There is no place today to write a note on a day's page and no copy button.

## Design
- **Where:** the note area sits next to the completion box on each of the four day pages. It starts empty.
- **Writing and editing:** the learner types a few lines. The note stays editable whether the day is ticked or not. Ticking or unticking never touches the note (R2, R3).
- **Copy:** pressing the copy button copies the header line and the note as described in R4. The learner then sees a confirmation (R8). The button is not usable while the note is empty, and a hint explains why (R11).
- **Visibility:** the note appears only on the learner's own day page. It is not shown on the overview page or to anyone else (R5).
- **Where it is stored:** the note area says the note is saved in this browser and is not carried to other devices in this practice version (R6, R9).
- **Signing in:** a note written before signing in stays after signing in (R12).
- **Known limitation:** the existing sentence "Saved to your Google account" on the completion box is left as it is (concern 6). It is the original portal wording, and sign-in behavior is unchanged (R7).
- **For Engineering (decided in plan.md, not here):** how and where notes are stored; how the note is kept next to the existing progress without changing it (R7); how the existing note is protected when signing in (R12).

## How each constraint in the intent is met
| Constraint | Met by |
|---|---|
| The first release left out standup notes and the Slack copy button; this feature adds them and everything else stays out of scope | R1 and R4 are the only additions. No Slack connection, no usage tracking, no new account system. |
| Learners' existing completed-day progress must stay intact | R7 and R3. |
| Sign-in and sync stay as they are today (practice version) | R6, R7 and R12. See concerns 1 and 6. |

## Open questions from the intent
1. What goes into Slack? **Answered:** the day title and status header, then the note (R4). Format check in concern 4.
2. Can learners edit the note after completing, and does unchecking keep it? **Answered:** yes to both (R2, R3).
3. Is the note private? **Answered:** private in the app, visible to others only when pasted into Slack (R5).
4. Should a signed-in learner's note follow them across devices? **Answered by the Client: yes, within the practice sync setup. Decision (Training Lead):** the practice setup cannot carry notes across devices, so the note stays in the browser used (R6). See concern 1.
5. How do we know it works? **Answered:** at least 80% of learners use the copy button for daily standups during Days 12–15, cutting standup prep to under 1 minute. **Decision (Training Lead):** measured by a two-question survey after Day 15 (see concern 2).

## Areas of concern
1. **Cross-device notes are not possible with today's practice sync.** **Resolved:** the requirement is relaxed. The note is saved in the browser used, and the screen says so (R6, R9). A real cross-device sync would need a real backend, which is out of scope. Owner: Training Lead.
2. **The success measure cannot be measured in the app.** **Resolved:** measure it with a short survey after Day 15: "Did you use the copy button for your standup?" and "How long did standup preparation take?". No usage tracking is added to the app. Owner: Training Lead.
3. **Guest note versus account note on sign-in.** **Resolved:** the existing note is kept and never overwritten (R12). Owner: Client (the lead), decided here by the Training Lead.
4. **The header may look wrong in Slack.** **Resolved with a check:** the format stays as the Client specified (R4). Before release, the Client pastes a sample into Slack. If literal asterisks show, the header changes to single asterisks, `*[Day X — Title]*`. Owner: Client (the lead).
5. **Copy with an empty note.** **Resolved:** the copy button cannot be used while the note is empty, with a hint (R11). Owner: BA.
6. **Existing wording promises more than the practice version delivers.** **Resolved as a known limitation:** the sentence "Saved to your Google account" is not changed in this feature. The new note area is honest (R9). Owner: Training Lead.
