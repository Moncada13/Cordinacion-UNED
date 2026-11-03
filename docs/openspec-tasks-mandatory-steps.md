---
description: Enforce mandatory steps from openspec/config.yaml when creating tasks.md artifacts and ensure the agent executes all tests itself
alwaysApply: true
---

# OpenSpec Tasks: Mandatory Steps Enforcement

This project is a frontend-only app (no backend, API or database; data lives in `localStorage`). When creating or updating `tasks.md` artifacts in OpenSpec changes, you MUST:

## 1. Read openspec/config.yaml First

**BEFORE** creating or updating any `tasks.md` file, read `openspec/config.yaml` for the project context, rules and branch naming.

## 2. Mandatory Steps

All implementation tasks MUST include these steps in this order:

- **Step 0: Create Feature Branch (MUST BE FIRST)**: `feature/<change-name>` (e.g. `feature/hu-01-create-term`), created from `main` before any code change.
- **Steps 1..N**: implementation, TDD style. For each piece: write the failing test, implement, make it pass.
- **Step N+1: Review and Update Existing Tests (MANDATORY)**: adjust tests affected by the change.
- **Step N+2: Run Quality Gates (MANDATORY - AGENT MUST EXECUTE)**: `npm run lint`, `npm run build`, `npm run test:coverage` (coverage ≥ 70%).
- **Step N+3: E2E Testing with Playwright (MANDATORY for user-facing changes - AGENT MUST EXECUTE)**: add or update the spec in `e2e/` for the story and run `npm run test:e2e`.
- **Step N+4: Update Technical Documentation (MANDATORY)**: per `docs/documentation-standards.md`.

## 3. Test Execution Requirements - CRITICAL: Agent Must Execute

The coding agent MUST run every test step itself. **Never delegate testing to the user.** A step can only be marked `[x]` in `tasks.md` after it has been executed and passed.

### Step N+2 Report

Save a short report in the change folder: `openspec/changes/<change-name>/reports/YYYY-MM-DD-quality-gates.md` with:

```markdown
# Quality Gates - <change-name>

## Commands Executed
- npm run lint
- npm run build
- npm run test:coverage

## Results
- Tests: X passed, Y failed
- Coverage: lines X%, branches X%, functions X%, statements X%

## Outcome
- [ ] All gates passed / exceptions documented
```

### Step N+3: E2E with Playwright

1. Write or update `e2e/<story-id>-<slug>.spec.ts` covering the story's acceptance criteria, including at least one validation or error scenario.
2. Each test starts from empty `localStorage` (Playwright gives every test a fresh browser context).
3. When data must survive a reload (persistence), reload the page in the test and assert the data is still there.
4. Run `npm run test:e2e`. It builds the app and serves it on port 4173.
5. Optionally use the Playwright MCP tools to explore the UI interactively while writing the spec.
6. Record the scenarios and the result in `openspec/changes/<change-name>/reports/YYYY-MM-DD-e2e.md`.

## 4. Verification Checklist

Before finalizing any `tasks.md` file, verify:
- [ ] Step 0 (Create Feature Branch) is the FIRST step
- [ ] Implementation steps put the test before the code (TDD)
- [ ] All mandatory steps are included and marked "(MANDATORY)"
- [ ] Steps are numbered sequentially
- [ ] Test steps state "AGENT MUST EXECUTE"
- [ ] E2E step is present for user-facing changes
- [ ] Documentation step is present

## 5. When This Applies

- Creating `tasks.md` via `/opsx:propose`, `/opsx:ff` or `/opsx:continue`
- Updating existing `tasks.md` files
- Implementing tasks via `/opsx:apply`: the agent must execute the tests

## 6. Example Structure

```markdown
## 0. Setup: Create Feature Branch (MANDATORY - FIRST STEP)
- [ ] 0.1 Create branch `feature/hu-01-create-term` from main

## 1. Domain: term validation (TDD)
- [ ] 1.1 Write failing tests for `validateTerm` (name required, end after start)
- [ ] 1.2 Implement `validateTerm` in src/domain/term.ts

## 2. Store: createTerm action (TDD)
- [ ] 2.1 Write failing tests: new term becomes active, previous ones go to history, persisted under planner:v1
- [ ] 2.2 Implement the action in usePlannerStore

## 3. UI: term form (TDD)
- [ ] 3.1 Write failing component tests for the form and its Spanish error messages
- [ ] 3.2 Implement TermForm

## 4. Review and Update Existing Tests (MANDATORY)

## 5. Run Quality Gates (MANDATORY - AGENT MUST EXECUTE)
- [ ] 5.1 lint, build, test:coverage ≥ 70%
- [ ] 5.2 Report in reports/YYYY-MM-DD-quality-gates.md

## 6. E2E Testing with Playwright (MANDATORY - AGENT MUST EXECUTE)
- [ ] 6.1 e2e/hu-01-create-term.spec.ts: happy path, validation error, persistence after reload
- [ ] 6.2 Run npm run test:e2e and record the report

## 7. Update Technical Documentation (MANDATORY)
```

## Failure to Follow

If you create tasks without these mandatory steps, the user will need to fix `tasks.md` by hand. If you mark tasks complete without running the tests yourself, you are violating this rule.
