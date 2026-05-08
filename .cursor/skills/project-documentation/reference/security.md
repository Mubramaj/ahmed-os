---
title: Security fix / investigation template
---

# Security documentation template (`docs/security/**`)

## File placement

- Folder: `docs/security/` (or a subfolder if this is a larger investigation)
- Filename:
  - Security fix/advisory: `SECURITY_FIX_YYYY-MM-DD.md` (match existing repo pattern when appropriate)
  - Investigation: `YYYY-MM-DD-short-title.md`

## Template

Use this skeleton (advisory-style, reproducible verification):

```markdown
# <Security issue title>

**Date:** YYYY-MM-DD
**Severity:** <Low|Medium|High|Critical> (and/or CVSS if available)
**Status:** <Draft|Fixed|Mitigated|Monitoring>
**Vulnerability/Advisory:** <CVE/GHSA/link if applicable>

## Summary
- 2–5 bullets describing the issue and the fix.

## Impact
- What can an attacker do:
- Preconditions:
- Affected data:
- Scope (frontend/backend/infra):

## Affected versions / environments
- Versions affected:
- Environments affected:
- “We were here” note (if relevant):

## Exploitability (brief)
- Is it remotely exploitable:
- Auth required:
- User interaction required:

## Root cause
- What assumption failed:
- What code path / dependency was responsible:

## Actions taken
### 1) Code changes
- Files/paths:
- Key behavior changes:

### 2) Dependency / config changes (if any)
- Packages bumped:
- Config toggles:

## Mitigations / workarounds
- If a full fix isn’t deployed everywhere, list mitigations.

## Verification
```bash
<commands used to verify versions / behavior>
```
- What output indicates “fixed”:

## Rollout / monitoring
- Deployment plan:
- What to watch (alerts/log patterns):
- Backout plan:

## References
- Advisory link(s):
- PR/commit links:
- Related docs:
```

