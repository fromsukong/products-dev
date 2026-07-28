---
id: TASK-004
title: Revisit All Product Specifications and Repository Tasks
status: active
priority: High
product: project-management
repo: products-md
related_tasks: []
assignee: "@fromsukong"
created_date: 2026-07-29
github_prs: []
---

# TASK-004: Revisit All Product Specifications and Repository Tasks

## 🎯 Context & Goal
Conduct a comprehensive review and audit of all high-level product PRDs (`products/`), repository specifications (`repos/<repo>/product/spec.md`), and active task lists (`repos/<repo>/product/task/active/`) across all public repositories.

---

## 🛠️ Target Repository
- **Repository**: [`products-md`](https://github.com/fromsukong/products-md)

---

## 📋 Action Items
- [ ] **Audit High-Level Product PRDs**:
  - Review [`products/ously/prd.md`](../../products/ously/prd.md)
  - Review [`products/project-management/prd.md`](../../products/project-management/prd.md)
  - Review [`products/personal-brand/prd.md`](../../products/personal-brand/prd.md)
- [ ] **Audit Repository Specifications**:
  - Review [`repos/ously-core/product/spec.md`](../../repos/ously-core/product/spec.md)
  - Review [`repos/ously-cli/product/spec.md`](../../repos/ously-cli/product/spec.md)
  - Review [`repos/ously-landing/product/spec.md`](../../repos/ously-landing/product/spec.md)
  - Review [`repos/products-web/product/spec.md`](../../repos/products-web/product/spec.md)
  - Review [`repos/fromsukong.com/product/spec.md`](../../repos/fromsukong.com/product/spec.md)
  - Review [`product/spec.md`](../spec.md) (Local `products-md` spec)
- [ ] **Audit Active & Archived Tasks**:
  - Verify task descriptions, priorities, and assignees across all repositories.

---

## ✅ Acceptance Criteria
- All PRD specifications, repository specs, and task lists are verified, up to date, and aligned with current engineering priorities.
- `node scripts/agent-helper.js graph` runs without errors and reflects all updated specifications.
