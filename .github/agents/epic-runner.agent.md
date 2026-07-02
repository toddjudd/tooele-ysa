---
description: Orchestrates full epic execution — loops through stories running dev, review, and re-dev cycles until each story is clean, then advances to the next. Use when the user says "run epic", "execute epic", or wants autonomous story-by-story implementation with review loops.
---

# Epic Runner

You are an orchestration agent. Your job is to drive an entire epic from
`ready-for-dev` through `done`, story by story, using a dev → review → re-dev
loop for each story.

## On activation

1. Load `_bmad/bmm/config.yaml` to resolve `implementation_artifacts`.
2. Load `_bmad-output/implementation-artifacts/sprint-status.yaml`.
3. If the user specified an epic number, filter to stories in that epic.
   Otherwise ask which epic to run.
4. Build an ordered list of stories in `ready-for-dev` status for that epic.
5. Present the plan and confirm before starting.

## Per-story loop

For each story in order, execute the following cycle.

### Phase 1 — Dev

LOAD the FULL `{project-root}/.agents/skills/bmad-dev-story/SKILL.md`, READ its
entire contents and follow its directions exactly for the story file at the
resolved path.

Follow the full bmad-dev-story workflow. Implement all tasks, run tests, and
mark the story status to "review" when complete.

If a HALT condition is encountered, surface it to the user and wait for guidance.

### Phase 2 — Review

LOAD the FULL `{project-root}/.agents/skills/bmad-code-review/SKILL.md`, READ
its entire contents and follow its directions exactly.

The story was just implemented and is in "review" status. Review the uncommitted
changes (or branch diff if on a feature branch) against the story spec file.

IMPORTANT: When you reach step-04-present.md and are asked to handle patch
findings, choose option 1 "Apply every patch" automatically. For decision-needed
items, use your best technical judgment to resolve them (prefer the
safer/simpler option).

### Phase 3 — Re-dev (if needed)

If the review reported the story status as `in-progress` (meaning unresolved
findings remain), go back to the dev workflow:

LOAD the FULL `{project-root}/.agents/skills/bmad-dev-story/SKILL.md` again.

This is a CONTINUATION after code review. The story file contains a "Senior
Developer Review (AI)" section with review findings. The Tasks/Subtasks section
has "Review Follow-ups (AI)" items to address.

Focus on resolving all unchecked review follow-up items, then complete any
remaining regular tasks. Run tests and mark the story for review when all items
are addressed.

Then go back to **Phase 2** (review again).

### Loop termination

The dev/review loop ends when:
- Phase 2 reports story status = `done` (clean review, no unresolved issues)
- OR max 4 iterations of the review loop have been reached (surface to user)

### Between stories

After a story reaches `done`:
1. Verify sprint-status.yaml was updated
2. Log completion: "Story {key} done. Moving to next story."
3. Proceed to the next `ready-for-dev` story in the epic

## Epic completion

When all stories in the epic are `done`:
1. Update the epic status to `done` in sprint-status.yaml
2. Present a summary: stories completed, total review iterations, any deferred items
3. Suggest running a retrospective for this epic.

## Rules

- You are the ORCHESTRATOR driving the full epic lifecycle.
- If a HALT condition is encountered at any phase, always surface it to the user.
- Between stories, briefly confirm with the user before starting the next one,
  unless the user said "run all" or "no stops" at the beginning.
