# Planificador de cuatrimestre

A web app for UNED students: register the courses of the semester and see every task, project, exam and forum with its due date in one place, so you know in 5 seconds what is due this week.

> Status: **Phase 0 (base)**. Project scaffold, tooling and spec-driven workflow are in place; features arrive in phases 1–3.

## Stack

React + Vite + TypeScript · Tailwind CSS · Zustand (persisted to `localStorage`) · date-fns · Vitest + Testing Library · Playwright · Vercel. No backend.

## Getting started

```bash
npm install
npx playwright install chromium
npm run dev
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Type-check and build |
| `npm run lint` | oxlint |
| `npm test` / `npm run test:coverage` | Unit and component tests (coverage ≥ 70%) |
| `npm run test:e2e` | Playwright E2E |
| `npm run sync:ai-specs` | Mirror `ai-specs/` into `.claude/` and `.agents/` |

## Roadmap

- [x] Phase 0: Base (Vite, Specboot, OpenSpec, docs)
- [ ] Phase 1: Data: HU-01 create term, HU-02 courses, HU-03 deliverables, with persistence
- [ ] Phase 2: Views: HU-04 this week, HU-05 monthly calendar, HU-06 progress
- [ ] Phase 3: Polish: HU-07 JSON backup, dark mode, mobile, screenshots

## How it is built

Spec-driven with [OpenSpec](https://github.com/Fission-AI/OpenSpec) and [Specboot](https://github.com/rfonseca079/lidr-specboot). Each user story is an OpenSpec change (`/opsx:propose` → `/opsx:apply` → `/opsx:verify` → `/opsx:archive`). Development rules: [docs/base-standards.md](docs/base-standards.md).

Specboot content (`ai-specs/`, parts of `docs/`) is © LIDR.co under the MIT License, see [LICENSE.specboot](LICENSE.specboot).
