# Release ticket: <product name> <version>
Status: DRAFT, not approved.
- **Version:** <x.y.z> (PROPOSED or given)
- **Base:** <tag or sha>
- **Head SHA:** <sha of origin/main>
- **Included PRs:** <#n, #n>
- **Date:** <YYYY-MM-DD>

## Scope
| Feature (`<slug>`) | Tickets (`<slug>/Tnn`) | PRs |
|---|---|---|
| <feature> | <tickets> | <#n> |

Other changes (no feature): <PRs, or "None.">

## Availability evidence
| Capability | Page and component that show it | Status |
|---|---|---|
| <capability> | <route under `src/app`, component under `src/components`> | Active / Built, not yet available / Planned (not built) |

## Claims check
| Claim in the release notes | Source (code, test, spec, PR) | Result |
|---|---|---|
| <sentence from the release notes> | <path:line or PR #n> | Verified / Differs / UNVERIFIED |

## Risks
| Area | Finding (by area and severity only) | Files |
|---|---|---|
| <`src/lib/`, localStorage compatibility, XSS, clipboard or sign-in, `package.json`, other> | <finding> | <files> |

## Review results
| Source | Result | Disposition |
|---|---|---|
| <CI, bot review, `/code-review`, person> | <what it reported> | fixed / deferred / won't fix |

Record only results that were seen. Write "Not run" otherwise.

## Verification
Default every row to NOT RUN. Fill a row only with a result that was seen.

| Check | Result |
|---|---|
| `npm test` | <PASS / FAIL / NOT RUN> |
| `npm run lint` | <PASS / FAIL / NOT RUN> |
| `npm run build` (also checks types) | <PASS / FAIL / NOT RUN> |
| CI for the head SHA | <success / failure / not found> |
| Manual cases in `test-matrix.md` (there is no E2E runner) | <PASS n, FAIL n, BLOCKED n, NOT RUN n> |

## Rollback
- Revert the merge commit of each included PR, or redeploy the previous tag (<tag>).
- **Data compatibility on rollback:** <new saved-data keys are ignored by the previous version; older saved data such as `{ "day-12": true }` still loads; anything else to check.>

## Go / No-go checklist
- [ ] Ready check passed (no open PR, CI green, `main` equals `origin/main`, tree clean)
- [ ] Every claim in the release notes is Verified, or the claim was removed
- [ ] No unresolved Important review finding
- [ ] Verification results recorded
- [ ] Rollback understood
- [ ] Release notes reviewed by a person

Approved by:
