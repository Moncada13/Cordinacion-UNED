# Development Guide

How to set up, run, test and deploy the semester planner.

## Prerequisites

- **Node.js** 20.19+ (developed with Node 26)
- **npm**
- **Git**
- **OpenSpec CLI** (optional, for the spec workflow): `npm install -g @fission-ai/openspec@latest`

There is no backend, database, Docker or environment file.

## Setup

```bash
git clone <repo-url>
cd planificador-cuatrimestre
npm install
npx playwright install chromium   # browsers for E2E tests
npm run dev                       # http://localhost:5173
```

## Testing

```bash
npm test                 # unit + component tests (Vitest)
npm run test:watch       # watch mode
npm run test:coverage    # with coverage, fails under 70%
npm run test:e2e         # Playwright: builds, serves on :4173, runs e2e/
```

## Quality checks before a commit

```bash
npm run lint && npm run build && npm run test:coverage
```

## Deployment (Vercel)

1. Push the repository to GitHub.
2. In Vercel: **Add New → Project**, import the repo. Vercel detects Vite automatically (build `npm run build`, output `dist`).
3. Every push to `main` deploys to production. Pushes to other branches get preview URLs.

## Spec-driven workflow (OpenSpec + Specboot)

Each phase or user story is an OpenSpec change:

```text
/enrich-us HU-01 ...        # optional: refine the story
/opsx:propose HU-01: ...    # proposal, specs, design, tasks
/opsx:apply                 # implement task by task (TDD)
/opsx:verify                # check the implementation against the artifacts
/adversarial-review         # independent review before archiving
/opsx:archive               # archive the change
/commit                     # focused commit(s)
```

In Antigravity the commands use a dash: `/opsx-propose`, `/opsx-apply`, ...

After editing anything in `ai-specs/`, run `npm run sync:ai-specs` to refresh `.claude/` and `.agents/`.
