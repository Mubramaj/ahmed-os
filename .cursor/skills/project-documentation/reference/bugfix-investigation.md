---
title: Bugfix investigation / postmortem template
---

# Bugfix investigation template (`docs/bugfix-investigations/**`)

## File placement

- Folder: `docs/bugfix-investigations/`
- Filename: `YYYY-MM-DD-short-title.md`

## Template

Use this skeleton (blameless, timeline-driven):

```markdown
# <Short title>

**Date:** YYYY-MM-DD
**Severity:** <Low|Medium|High|Critical>
**Environment:** <prod|staging|dev|mixed>
**Status:** <Investigating|Fixed|Mitigated|Monitoring>
**Affected areas:** <services/features>
**Files changed:** 
- `<path>`

---

## Executive summary
- What happened (1–3 bullets):
- User impact:
- Root cause (one sentence):
- Fix (one sentence):

## Impact
- Who was affected:
- What broke:
- How long:
- Data corruption risk:
- Any financial impact (if relevant):

## Detection
- How we noticed:
- Why monitoring did/didn’t catch it:
- What should alert next time:

## Timeline (UTC)
| Time | Event |
|---|---|
| 12:34 | Detected via ... |
| 12:50 | Mitigation applied ... |
| 13:20 | Root cause identified ... |
| 14:10 | Fix deployed ... |

## Root cause analysis
### What actually broke
- Precise description of the broken invariant:

### Why it broke (5-whys style)
1. Why:
2. Why:
3. Why:

### Contributing factors
- Concurrency/race window:
- Missing validation:
- Unsafe assumptions:

## Fixes applied
- Primary fix:
- Defense-in-depth:
- Cleanup/refactor:

## Verification
- Tests added/updated:
- Manual verification:
- Production monitoring plan:

## What went well / what didn’t
### Went well
- ...

### Didn’t go well
- ...

### Where we got lucky (optional)
- ...

## Action items
| Priority | Action | Owner | Due | Status |
|---|---|---|---|---|
| P1 | Add alert for ... | @ | YYYY-MM-DD | todo |

## References
- Related PR(s):
- Related logs/metrics dashboards:
- Related docs:
```

