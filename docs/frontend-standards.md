---
description: Frontend standards for the semester planner (React + Vite + TypeScript, Tailwind, Zustand, date-fns, Vitest, Playwright).
alwaysApply: true
---

# Frontend Standards

The whole product is a frontend: a single-page app with no backend. These rules apply to all code in `src/` and `e2e/`.

## Technology Stack

| Area | Choice |
| --- | --- |
| Framework | React 19 + Vite + TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`, `@import 'tailwindcss'` in `src/index.css`) |
| State | Zustand with the `persist` middleware (`localStorage`, key `planner:v1`) |
| Dates | date-fns with the `es` locale |
| Unit / component tests | Vitest + Testing Library (jsdom) |
| E2E tests | Playwright (`e2e/`) |
| Lint | oxlint |
| Deploy | Vercel |

Do not add a router, HTTP client, UI kit or other state library without updating this document first.

## Project Structure

```
src/
├── domain/        # Pure types and functions: validation, date math, progress (no React)
├── store/         # Zustand store(s) and selectors
├── components/    # Reusable UI pieces (cards, modal, color picker, progress bar)
├── views/         # Screens: ThisWeekView, CalendarView, CourseView, TermSetup
├── lib/           # Small helpers (palette tokens, id generation, JSON backup)
├── test/          # Test setup
├── App.tsx
└── main.tsx
e2e/               # Playwright specs, one flow per main user story
```

- Put business rules (for example "end date after start date", "due date inside term", "overdue") in `src/domain/` as pure functions. Test them without rendering.
- Components get data through store selectors or props. They do not read `localStorage` directly.

## Coding Standards

- **Naming**: PascalCase for components and their files (`DeliverableCard.tsx`), camelCase for functions, hooks (`useActiveTerm`) and utility files, UPPER_SNAKE_CASE for constants (`STORAGE_KEY`).
- **Components**: function components with typed props (`type DeliverableCardProps = {...}`). One exported component per file.
- **Types**: domain types come from `src/domain/types.ts` and match [data-model.md](./data-model.md) exactly.
- **Language**: identifiers and comments in English, UI strings in Spanish (see base-standards §2).

## State Management (Zustand)

- One store (`usePlannerStore`) holding `terms`, `courses`, `deliverables` plus actions (`createTerm`, `addCourse`, `deleteCourse`, `addDeliverable`, `toggleDone`, `importData`, ...).
- Persist with `persist(..., { name: 'planner:v1', version: 1, migrate })`. Persist only data, not UI state (open modals, selected day).
- Actions enforce domain invariants (single active term, cascade delete). Validation helpers live in `src/domain/` and are reused by both forms and actions.
- Read with narrow selectors (`usePlannerStore((s) => s.courses)`) to avoid needless re-renders. Put derived lists (this week, by day, progress) in selector functions in `src/store/selectors.ts`.

## Dates (date-fns)

- Store ISO strings. Parse with `parseISO`, never `new Date(string)` for date-only values (that parses as UTC and shifts the day).
- Format for the UI with `format(date, pattern, { locale: es })`.
- Week and month math: `startOfWeek(..., { weekStartsOn: 1 })` (weeks start on Monday), `addDays`, `isWithinInterval`, `differenceInCalendarDays`.
- Make "now" injectable (a `now` parameter or a small clock helper) so tests are deterministic. In Vitest use `vi.setSystemTime`.

## UI / UX

- The app opens on **Esta semana**. Other views: monthly calendar and per-course view.
- The deliverable form is **one reusable modal**, opened from any view.
- Course color comes from the 8-token palette (`src/lib/palette.ts`), which maps tokens to Tailwind classes. Use full static class names so Tailwind can detect them (no `bg-${color}-500` string building).
- Overdue and not done: shown first, styled in red. Each card shows the course color, the type and the days left.
- Destructive actions (delete course, replace data on import) require confirmation.
- Responsive from 360px wide. Dark mode arrives in phase 3 via Tailwind `dark:` variants, so keep colors in a few shared classes.

### Accessibility

- Use semantic elements (`button`, `label`, `dialog`, headings in order).
- Every form input has an associated `<label>`. Validation errors are linked with `aria-describedby`.
- The modal traps focus, closes with Escape and returns focus to the trigger.
- Never use color as the only signal: overdue items also show text ("Vencida"), and course dots have accessible names.

## Testing Standards

- **TDD**: write the failing test first.
- **Coverage**: at least 70% (enforced in `vite.config.ts`).
- **Domain**: unit tests for every rule in `src/domain/`, including edge cases (same start and end date, due date at a term boundary, timezone day shifts).
- **Store**: test actions and selectors directly with `usePlannerStore.getState()`. `localStorage` is cleared after each test (`src/test/setup.ts`).
- **Components**: Testing Library, querying by role and accessible name (`getByRole('button', { name: 'Guardar' })`), using `@testing-library/user-event` for interaction.
- **E2E**: Playwright, one spec per main user story (`e2e/hu-01-create-term.spec.ts`, ...). Each test starts from empty storage. Assert on visible Spanish text and roles.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Type-check (`tsc -b`) and production build |
| `npm run lint` | oxlint |
| `npm test` | Unit and component tests |
| `npm run test:coverage` | Tests with coverage thresholds |
| `npm run test:e2e` | Playwright against the production build (`vite preview` on port 4173) |

## Git Workflow

- Feature branches per OpenSpec change: `feature/<change-name>` (for example `feature/hu-01-create-term`).
- Small, focused commits in English, imperative subject (`Add term creation form`).
- `main` is always deployable: Vercel publishes every push to `main`.
