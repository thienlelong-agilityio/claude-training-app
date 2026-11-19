---
name: privacy-and-ux
description: Policy rules for features that handle user-written text, copy or share it elsewhere, keep per-user data, or sync between devices. Apply whenever writing or reviewing a spec or ticket for such a feature, and flag conflicts as areas of concern
---

# Privacy and UX policy (training app)

Policy owner: Training Lead (to be confirmed). Changes to this skill need the owner's sign-off.

## Rules
1. **Private by default.** Anything a learner writes is visible only to that learner inside the app. It reaches other people only when the learner copies or shares it on purpose.
2. **Explicit sharing.** Copying or sharing text outside the app happens only after a clear learner action (for example pressing a copy button). Never send it automatically.
3. **Say where it is stored.** The screen tells the learner whether their text stays in this browser (guest) or follows their account (signed in).
4. **No silent data loss.** Existing learner data (progress, notes) is never deleted or overwritten without the learner choosing it. Unchecking, signing out, or signing in must not erase written text.
5. **Confirm every action.** After saving or copying, the learner sees a plain message that it worked. If it fails, the message says what happened and what to do next, in plain language.
6. **Accessible.** Every field has a visible label. Everything works with the keyboard. Messages are announced to screen readers.
7. **Practice-version honesty.** While sign-in and sync are a practice version, the wording must not promise real cloud storage or real Google accounts.

## How to apply
- When writing a spec, check each requirement against these rules. If one conflicts with a rule, or the intent is silent on something a rule covers, add it to **Areas of concern** with an owner. Do not decide silently.
- When writing tickets, copy any rule that applies into the ticket's acceptance criteria or edge cases.
- List this skill under `Skills applied` in the spec header.
