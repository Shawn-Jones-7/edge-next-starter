# CLAUDE.md

**Guidelines for using Claude Code with this repository** – a complete reference in English.

---

## 1. Project Overview

A modern B2B website starter built with **Next.js 15.5.2**, **React 19.2.0**, **TypeScript 5.9.3** and **Tailwind CSS 3.4.18**.  
Features: English/Chinese i18n (`next‑intl`), theme switching, responsive design, edge deployment on Cloudflare Workers (D1, R2, KV).

### Core Directory Highlights

| Path            | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `app/[locale]/` | App Router pages with locale (`en`, `zh`)            |
| `app/api/`      | Backend API routes                                   |
| `components/`   | Shared UI components (Radix UI + Tailwind)           |
| `lib/`          | General utilities & core logic                       |
| `i18n/`         | `next‑intl` configuration                            |
| `messages/`     | Translation files (`critical.json`, `deferred.json`) |
| `types/`        | TypeScript definitions                               |
| `docs/`         | Project documentation (Chinese)                      |
| `wrangler/`     | Wrangler config & state                              |
| `migrations/`   | Cloudflare D1 migrations                             |
| `prisma/`       | Prisma ORM config                                    |
| `scripts/`      | Automation scripts                                   |
| `__tests__/`    | Vitest unit tests                                    |
| `public/`       | Static assets                                        |

> **Convention:** Use the `@/` alias for imports. `export *` re‑exports are prohibited (enforced by pre‑commit hooks and architecture checks).

---

## 2. Essential Commands

```bash
# Development
pnpm install          # install deps (Node 20.x, pnpm 8.15.0)
pnpm dev              # start dev server
pnpm build            # production build
pnpm start            # run production server

# Quality checks
pnpm type-check       # TypeScript check
pnpm lint:check       # ESLint
pnpm lint:fix         # auto‑fix ESLint
pnpm format:write     # Prettier format
pnpm format:check     # Prettier check
pnpm arch:check       # Architecture dependency check
pnpm circular:check   # Circular‑dependency detection
pnpm unused:check     # Unused code / dependencies

# Testing
pnpm test             # Vitest unit tests
pnpm test:watch       # watch mode
pnpm test:coverage    # coverage report
pnpm test:ui          # UI tests

# Cloudflare Wrangler
pnpm wrangler         # run Wrangler CLI
pnpm cf:dev           # Cloudflare Pages dev server

# Database (Cloudflare D1)
pnpm db:migrate:local         # local migrations
pnpm db:migrate:test          # test‑env migrations
pnpm db:migrate:prod          # prod migrations
pnpm db:migrations:create     # create new migration
pnpm db:migrations:list       # list pending migrations

# Build & Deploy (Cloudflare Pages)
pnpm pages:build              # build
pnpm pages:deploy             # deploy (test)
pnpm pages:deploy:test        # deploy (test env)
pnpm pages:deploy:prod        # deploy (prod)

# Storage (R2 & KV)
pnpm r2:create:test           # create R2 bucket (test)
pnpm r2:create:prod           # create R2 bucket (prod)
pnpm kv:create:test           # create KV namespace (test)
pnpm kv:create:prod           # create KV namespace (prod)

# Full validation
pnpm security:check           # npm audit + semgrep security scan
```

---

## 3. Architecture Overview

### 3.1 Directory Structure

(Repeated table from Section 1 for quick reference.)

### 3.2 Internationalization

`next‑intl`‑based layered translations:

- `messages/{locale}/critical.json` – first‑paint strings (Header, Footer, Hero, core navigation).
- `messages/{locale}/deferred.json` – lazy‑loaded strings used after initial render.

### 3.3 Testing

- **Unit tests** – Vitest + Testing‑Library under `__tests__/**/*.test.ts(x)`.
- **Setup** – `vitest.setup.ts`.
- **Guidelines** – Prefer role/text queries over brittle selectors; add edge‑case tests for i18n fallback, feature flags, SSR/CSR boundaries; run `pnpm test:coverage` after significant changes.

---

## 4. Code Style

- **Imports** – always `@/` alias (configured in `tsconfig.json`).
- **Exports** – no `export *`.
- **ESLint** – disallow Jest imports; use Vitest APIs.
- **Commit messages** – Conventional Commits (`feat|fix|docs|style|refactor|test|chore(scope): summary`).
- **Naming** – Components: PascalCase; hooks & regular functions: camelCase; files: kebab-case.

### Formatting & Lint

- Prettier: 2‑space indent, single quotes, consistent import order, Tailwind class order.
- ESLint: ≤ 3 parameters per function (use options object beyond), prefer `const`, no `console` in production code, security rules enabled.

---

## 5. Commit & PR Guidelines

- **Commits** – Conventional Commits, title ≤ 72 chars.
- **Pre‑commit** – `lefthook` runs format, type‑check, lint, architecture checks.
- **Pull Requests** – link an issue, concise change description, attach `pnpm test` output, provide screenshots/videos for UI changes, keep PRs small and focused.

---

## 6. Key Configuration Files

- `next.config.ts` – Next.js config (MDX, `next‑intl`, Cloudflare Pages compatibility).
- `vitest.config.ts` – Vitest config (jsdom, coverage thresholds).
- `wrangler.toml` / `wrangler.test.toml` / `wrangler.prod.toml` – Cloudflare Wrangler configs.
- `.dev.vars` – Cloudflare Workers dev environment variables (KV, R2, D1, etc.).

---

## 7. Environment Variables

### 7.1 `.env.local` (Next.js dev)

```dotenv
NODE_ENV=development
RESEND_API_KEY=
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60
ANALYTICS_ENABLED=true
ANALYTICS_SINK=log
LOG_LEVEL=INFO
LOG_FORMAT=json
LOG_INCLUDE_TIMESTAMP=true
DATABASE_QUERY_TIMEOUT=5000
CACHE_DEFAULT_TTL=3600
ENABLE_PERFORMANCE_MONITORING=true
SLOW_QUERY_THRESHOLD_MS=1000
```

### 7.2 `.dev.vars` (Cloudflare Workers dev)

```dotenv
SIGNING_SECRET=dev-secret
ANALYTICS_ENABLED=true
ANALYTICS_SINK=log
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60
LOG_LEVEL=INFO
LOG_FORMAT=json
LOG_INCLUDE_TIMESTAMP=true
DATABASE_QUERY_TIMEOUT=5000
CACHE_DEFAULT_TTL=3600
ENABLE_PERFORMANCE_MONITORING=true
SLOW_QUERY_THRESHOLD_MS=1000
```

_Optional:_ `ENABLE_WHATSAPP_CHAT` / `NEXT_PUBLIC_WHATSAPP_NUMBER`; `ENABLE_SENTRY_BUNDLE`.

---

## 8. Security & Configuration

- Store secrets only in `.dev.vars` (local) or Cloudflare Dashboard (remote). Never commit real credentials.
- New code paths must avoid `export *` to satisfy security lint rules.
- **Conductor** automation is disabled; enable only after official support for Next.js 15.5 + `next‑intl` is stable.

---

## 9. Agent Instructions

1. **Language** – All reasoning and replies must be in **Chinese**; technical identifiers (`lint`, `hook`, `useEffect`, etc.) stay in English.
2. **When uncertain** – State uncertainty explicitly and consult official docs or source code.

---

## 10. MCP Tools – Usage Guidelines

- **Ace (acemcp)** – Semantic code search (`search_context`). Use when you don’t know where a feature lives or need a broad view. Never assert file locations without a search.
- **Serena** – Symbol‑level navigation & fine‑grained edits (e.g., `get_symbols_overview`, `find_symbol`, `find_referencing_symbols`). Preferred for any change affecting code behavior.
- **Workflow** –
  1. **Ace** → locate entry points, APIs, config, tests.
  2. **Serena** → get symbol overviews, reference chains.
  3. **Design** → explain changes in Chinese, list impacted modules.
  4. **Implement** → use Serena’s incremental edits; keep diffs minimal.
  5. **Verify** → run type‑check, lint, tests if environment allows.

Skip Ace/Serena only for isolated, tiny utilities that don’t touch existing code.

---

## 11. Server/Client Component Best Practices _(compressed)_

### 1. Intl Usage

- **Server components** – `await getTranslations()` from `'next-intl/server'`.
- **Client components** – `useTranslations()` hook from `'next-intl'`.
- **Never mix** the two; using the hook in a server component throws `useContext`‑null errors during SSG.

### 2. Component Roles

- **Server components** – async page functions that return JSX directly; avoid nested function components that call hooks.
- **Client components** – start with `'use client'`; free to use React hooks, browser APIs, and interactive logic.

### 3. Boundary Handling

When a server component renders a client child (or uses navigation links from `@/i18n/navigation`), export the dynamic flag:

```ts
export const dynamic = 'force-dynamic';
```

### 4. When to Add the `dynamic` Flag

Add `dynamic = 'force-dynamic'` to any server component that:

- Calls client‑only APIs or hooks.
- Embeds a client component as a descendant.
- Uses navigation/link components that rely on client context.
- Triggers SSG errors because required context is missing.

### 5. Error Pages

- `app/error.tsx` – **client** component (handles runtime errors).
- `app/not-found.tsx` – **server** component (handles 404).
- Keep a `pages/_document.tsx` for internal Next.js compatibility.
- **Never** add the `dynamic` flag to these error pages – it breaks Next.js error handling.

### 6. Common Anti‑Patterns (avoid)

| ❌ Bad                                                                             | ✅ Good                                                |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Using `useTranslations()` in a server component.                                   | `await getTranslations()` in server component.         |
| Nesting a function component that calls hooks inside a server page.                | Render JSX directly after fetching translations.       |
| Forgetting `dynamic = 'force-dynamic'` when a server page includes a client child. | Export the flag whenever a client boundary is crossed. |

### 7. SSG vs SSR Troubleshooting

- **Error:** `TypeError: Cannot read properties of null (reading 'useContext')` → Move the hook to a client component or replace it with `getTranslations()`.
- **Nested components with hooks** → Inline JSX; eliminate the inner component.
- **Navigation components in server code** → Add `dynamic = 'force-dynamic'`.

### 8. Version Notes

| Version        | Status                                                    |
| -------------- | --------------------------------------------------------- |
| Next.js 15.1.8 | Stable for App Router + `next‑intl`.                      |
| Next.js 15.5.x | Known `_error` page generation bugs (HTML import errors). |
| React 18.3.1   | Compatible with Next.js 15.1.8.                           |
| React 19.x     | May have compatibility issues with Next.js 15.x.          |

---

## 12. Documentation & Official Sources

- Pure documentation updates (no behavior change) can be edited directly.
- If official docs conflict with the current repo state, present both the _official‑first_ solution and a _compromise_ that respects existing code; let the user decide.

---

## 13. Avoid Hard‑coding & i18n Rules

- All business copy, strings, colors, spacing, thresholds, etc., must go through the `messages` directory (critical / deferred) or Tailwind/design‑token configs.
- When adding new copy: add a key to the appropriate `messages/{locale}` file and reference it in components.

---

## 14. Additional Constraints & Practices

- **TypeScript** – avoid `any`; prefer precise types, `unknown` + type guards, `satisfies`. No `@ts-ignore` unless absolutely necessary and documented.
- **React / Next.js** – favor Server Components; use `'use client'` only for truly interactive parts.
- **useEffect** – eliminate unnecessary `useEffect`; achieve behavior via props or render logic when possible.

---

## 15. Risk Disclosure

If architectural problems or technical debt are spotted, describe them in Chinese, propose an actionable improvement plan (can be phased), and ask the user whether to prioritize them.

---

## 16. Moving Forward

When the user replies with **“继续”** (“continue”), proceed to the next logical step (design → implementation, single‑file edit → required refactor) while respecting all constraints and best practices outlined above.

---
