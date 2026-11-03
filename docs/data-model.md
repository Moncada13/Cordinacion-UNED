# Data Model

The app has no backend or database. The domain has three entities: a **Term** (semester / cuatrimestre) has many **Courses**, and each Course has many **Deliverables**. Everything is stored in the browser.

```
Term 1 ──── * Course 1 ──── * Deliverable
```

## Entities

```ts
type Term = {
  id: string;
  name: string;          // "III Cuatrimestre 2026"
  startDate: string;     // ISO date, "2026-09-07"
  endDate: string;       // ISO date
  isActive: boolean;
};

type Course = {
  id: string;
  termId: string;
  name: string;          // "Matemática para Computación I"
  code?: string;         // UNED code, "03068"
  color: string;         // palette token
};

type Deliverable = {
  id: string;
  courseId: string;
  type: "task" | "project" | "exam" | "forum";
  title: string;
  dueAt: string;         // ISO date-time
  weight?: number;       // % of the final grade
  notes?: string;
  done: boolean;
};
```

### Term

| Field | Type | Rules |
| --- | --- | --- |
| `id` | `string` | Unique, generated with `crypto.randomUUID()`. |
| `name` | `string` | Required, trimmed, not empty. |
| `startDate` | `string` | ISO date (`yyyy-MM-dd`). Required. |
| `endDate` | `string` | ISO date. Required. Must be after `startDate`. |
| `isActive` | `boolean` | Exactly one term is active at a time. Creating a new term makes it active and moves the others to history (`isActive: false`). |

### Course

| Field | Type | Rules |
| --- | --- | --- |
| `id` | `string` | Unique. |
| `termId` | `string` | References an existing `Term.id`. |
| `name` | `string` | Required, trimmed, not empty. |
| `code` | `string?` | Optional UNED course code, e.g. `03068`. |
| `color` | `string` | One of the 8 palette tokens below. |

Deleting a course asks for confirmation and deletes all of its deliverables (cascade).

**Color palette tokens** (8): `red`, `orange`, `amber`, `emerald`, `teal`, `sky`, `indigo`, `pink`. Each token maps to Tailwind classes in a single palette module, so the stored value never contains raw CSS.

### Deliverable

| Field | Type | Rules |
| --- | --- | --- |
| `id` | `string` | Unique. |
| `courseId` | `string` | References an existing `Course.id`. |
| `type` | `"task" \| "project" \| "exam" \| "forum"` | Required. UI labels: Tarea, Proyecto, Examen, Foro. |
| `title` | `string` | Required, trimmed, not empty. |
| `dueAt` | `string` | ISO date-time with time. Should fall inside the term's `startDate`..`endDate`; if not, the UI shows a warning (it does not block saving). |
| `weight` | `number?` | Optional percentage of the grade, 0–100. |
| `notes` | `string?` | Optional free text. |
| `done` | `boolean` | `false` on creation. Toggled by "marcar como hecha". |

## Derived values (not stored)

- **Days left**: `differenceInCalendarDays(dueAt, today)`, computed with date-fns.
- **Overdue**: `!done && dueAt < now`. Overdue items are shown first and in red in the "Esta semana" view.
- **Course progress**: `done deliverables / total deliverables` per course.

## Persistence

- Stored in `localStorage` under a single versioned key: **`planner:v1`**.
- Written by the Zustand `persist` middleware. Its `version` option and `migrate` function handle format changes. Bump to `planner:v2` (or the persist `version`) when the shape changes, and add a migration.
- Stored shape:

```ts
type PlannerState = {
  terms: Term[];
  courses: Course[];
  deliverables: Deliverable[];
};
```

- **Backup (HU-07)**: export writes this same `PlannerState` as a JSON file. Import validates the format (shape and field types) and asks for confirmation before replacing the current data.
