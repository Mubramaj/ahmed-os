---
title: Feature documentation template
---

# Feature doc template (docs/features/**)

## File placement

- Prefer: `docs/features/<area>/` with a local `README.md` index.
- Filename: `kebab-case.md`.

## Template

Use this skeleton:

```markdown
# <Feature Name>

> Intent (Diátaxis): usually **Explanation** for the overview + **Reference** for the contract. If both get large, split into multiple docs and link them from the feature `README.md`.

## Scope
- In scope:
- Out of scope:

## User story / goal
- Who:
- What:
- Why:

## Key concepts
- Term A:
- Term B:

## Data model (high level)
- Models involved:
- Key associations:
- Important validations/constraints:

## Lifecycle / state machine (if applicable)
- States:
- Transitions:

## API & frontend contract (if applicable)
- Endpoints:
- Request/response shapes:
- Error cases:
- Backward/forward compatibility notes:

## Implementation notes
- Key files:
- Important invariants:
- Concurrency / locking notes (if any):
- Edge cases and “gotchas”:
- Data migrations / backfills (if any):

## Testing & verification
- Unit tests:
- Integration tests:
- Manual QA checklist:

## Rollout & monitoring (if applicable)
- Flags:
- Metrics/logs to watch:
- Backout plan:
```

## Index updates

Add the new link to:
- `docs/features/<area>/README.md` (preferred), otherwise
- `docs/developers/README.md` under “Features”.

