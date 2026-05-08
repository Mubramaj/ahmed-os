---
title: Developer guide documentation template
---

# Developer guide template (docs/developers/**)

## File placement

- Prefer: `docs/developers/`.
- Filename: `kebab-case.md`.

## Template

Use this skeleton:

```markdown
# <Guide Title>

> Intent (Diátaxis): **How-to guide**. Keep it task-oriented and copy/paste friendly. If you need rationale, link to an Explanation doc.

## What this is
- One paragraph summary.

## When you need this
- Symptom / situation:

## Quick start
```bash
<the 1-3 commands most people need>
```

## Details

### Prerequisites
- Tools/services required:
- Versions (if relevant):

### Configuration
- Files to edit (paths):
- Important defaults:

### Common workflows
- Task A:
- Task B:

## Verification
- How to confirm it worked:
- Expected output:

## Troubleshooting

### <Common issue 1>
- Cause:
- Fix:

### <Common issue 2>
- Cause:
- Fix:

## Safety / rollback
- How to undo safely:
- Data-loss warnings:

## References
- Related docs in `docs/`:
- Related code paths:
```

## Index updates

Add the new link to `docs/developers/README.md` under the most relevant subsection.

