# ADR-0001: Strict 1 Task = 1 Repository Constraint

> **Status**: Accepted  
> **Date**: 2026-07-29  
> **Author**: @fromsukong  

---

## Context
Features in multi-repository product suites (like `ously`) frequently span multiple repositories (e.g. `ously-core` engine and `ously-cli` user interface). Tracking multiple repositories inside a single task file causes ambiguity in pull request tracking, assignment, and status transitions.

---

## Decision
Every task file in `tasks/active/` strictly targets **exactly one single repository** (`repo: repo-name`). If a feature requires changes in 2 or more repositories, it must be split into separate task files and cross-linked via `related_tasks: [TASK-XXX]`.

---

## Consequences
- **Positive**: Clear 1-to-1 mapping between task files, Git repositories, and Pull Requests.
- **Positive**: Simple status management (`active` vs `archive`).
- **Trade-off**: Requires creating multiple task files for cross-cutting features, linked via `related_tasks`.
