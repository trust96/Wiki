# Wiki

Monorepo. Each space has its own agent and `guidelines/` folder. Nested `AGENTS.md` files apply when working in that tree; more specific instructions win.

| Space | Path | Stack |
| --- | --- | --- |
| Dashboard | `dashboard/` | React 19 + Vite + Mantine |
| Backend | `backend/` | Laravel |
| Site | `site/` | Pug + Vite |

Product intent lives in `specs/`. Do not apply dashboard React conventions to backend PHP, or the reverse.

When a space has no `AGENTS.md` yet, do not invent conventions from another space.
