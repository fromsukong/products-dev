---
id: TASK-003
title: Maintain 3-Step Markdown Project Management System
status: active
priority: Medium
product: project-management
repo: products-md
related_tasks: []
assignee: "@fromsukong"
created_date: 2026-07-29
github_prs: []
---

# TASK-003: Maintain 3-Step Markdown Project Management System

## 🎯 Context & Goal
Maintain `products-md` as a lightweight Submodule & Sparse Checkout Aggregator pulling singular `product/` folders across repositories under `@fromsukong`.

---

## 🛠️ Target Repository
- **Repository**: [`products-md`](https://github.com/fromsukong/products-md)

---

## 📋 Action Items
- [x] Create `product/spec.md` in `products-md`.
- [x] Configure sparse checkout to target `product/` folder in submodules.
- [ ] Run `node scripts/agent-helper.js graph` to verify submodules.

---

## ✅ Acceptance Criteria
- Agent helper CLI correctly parses `product/spec.md` and `product/task/active/`.
