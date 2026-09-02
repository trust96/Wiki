# Wiki

Monorepo. Each space has its own agent and `guidelines/` folder. Nested `AGENTS.md` files apply when working in that tree; more specific instructions win.

| Space | Path | Stack |
| --- | --- | --- |
| Dashboard | `dashboard/` | React 19 + Vite + Mantine |
| Backend | `backend/` | Laravel |
| Site | `site/` | Pug + Vite |

Product intent lives in `specs/`. Do not apply dashboard React conventions to backend PHP, or the reverse.

Canonical GitHub repo is [trust96/Wiki](https://github.com/trust96/Wiki). Push feature branches to `origin` (`trust96/Wiki`) and open PRs there against `main`. Do not open PRs on `GrilliA/Wiki` (`personal` remote).

When a space has no `AGENTS.md` yet, do not invent conventions from another space.
