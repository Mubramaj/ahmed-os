---
name: project-documentation
description: Creates or updates project documentation in `docs/` using repo conventions. Use when the user asks to “document” a feature, architecture decision, bugfix investigation, security note, developer guide, or when adding/updating Markdown docs in those directories.
---

# Project documentation (docs + UI docs)

## Purpose

This skill standardizes how we write documentation in this repo:
- Repo docs live under `docs/` (features, architecture, developers, performance, security, investigations).

## Non-negotiables

- **Always update the nearest index**: add a link in the closest relevant `README.md` (e.g. `docs/developers/README.md`, `docs/features/<area>/README.md`).
- **Naming**
  - **Bugfix/security investigations**: `YYYY-MM-DD-short-title.md` (match existing convention).
  - **Everything else**: consistent `kebab-case.md`.
- **Style is mixed by doc type**: use the matching template below.
- **Pick one primary intent (Diátaxis)**: the doc should be clearly one of **how-to**, **reference**, or **explanation**. Avoid mixing “step-by-step” with long rationale in the same page; link out instead.

## Workflow (follow in order)

### 1) Ask 3 clarifying questions (required)

Ask the user (briefly):
- **Doc type**: feature, architecture/ops, developer guide, bugfix investigation, security investigation/fix.
- **Target location**: exact folder path under `docs/`.
- **What changed**: links to PR/branch, key files, and whether to include API/frontend contract, rollout notes, or testing notes.
If unclear, also ask:
- **Doc intent**: is this mostly a **how-to** (task steps), **reference** (facts/spec), or **explanation** (why/architecture)?

If the user already provided this info, don’t re-ask—summarize it back as assumptions.

### 2) Choose a template

Pick the reference template that matches the doc type:
- Feature docs: see [reference/features.md](reference/features.md)
- Architecture/ops docs: see [reference/architecture.md](reference/architecture.md)
- Developer guides: see [reference/developers.md](reference/developers.md)
- Bugfix investigations: see [reference/bugfix-investigation.md](reference/bugfix-investigation.md)
- Security investigations/fixes: see [reference/security.md](reference/security.md)

### 3) Create or update the doc file

- Prefer **updating an existing doc** if one exists for the topic.
- If creating a new file:
  - use the naming rules above
  - include a short “Scope” section to prevent doc creep
  - keep it skimmable with a clear index and headings

### 4) Update the nearest `README.md` index (always)

Rules:
- Add a bullet link in the most relevant section.
- Keep ordering consistent with existing index style (usually grouped by subheading).
- If no appropriate section exists, add a minimal new one (don’t reorganize the entire file).

### 5) Quality checklist (quick pass)

Use this checklist before finishing:
- The doc answers “**what is it**”, “**how it works**”, and “**how to test / verify**”.
- Names/paths match the repo’s structure and vocabulary.
- Links are relative and stable.
- For risky changes: includes “rollout/monitoring” notes.

## Output format

When delivering docs:
- Provide the **final file path(s)** created/updated.
- Provide a **short summary** of what was added.
- If you updated an index, mention which `README.md` was changed and where the new link lives.

