# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

---

## Project Overview

This is a modern B2B enterprise website starter built with **Next.js 15.5.2 + React 19.2.0 + TypeScript 5.9.3 + Tailwind CSS 3.4.18**. It supports English/Chinese internationalization, theme switching, and responsive design. Built on Cloudflare Workers for edge deployment with D1 database, R2 storage, and KV namespace support.

Project structure guardrails:

- `app/[locale]/` - Next.js App Router with locale-based routing (e.g. `en` / `zh`).
- `app/api/` - API routes for backend endpoints.
- `components/` - Shared UI components (Radix UI + Tailwind).
- `lib/` - Shared utilities and core logic.
- `i18n/` - Internationalization setup (next-intl).
- `messages/` - Translation files with critical/deferred split per locale.
- `types/` - TypeScript type definitions and declarations.
- `docs/` - Project documentation (Chinese).
- `wrangler/` - Wrangler configuration and state.
- `migrations/` - Database migrations (Cloudflare D1).
- `prisma/` - Database ORM configuration.
- `scripts/` - Automation and tooling scripts.
- `__tests__/` - Vitest unit tests.
- `public/` - Static assets.

Use the `@/` path alias for imports, and avoid `export *` re-exports (enforced by hooks and architecture checks).

---

## Essential Commands

```bash
# Development
pnpm install          # Install dependencies (Node 20.x, pnpm 8.15.0 required)
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Quality checks
pnpm type-check       # TypeScript type checking
pnpm lint:check       # ESLint checking
pnpm lint:fix         # Auto-fix ESLint issues
pnpm format:write     # Prettier formatting
pnpm format:check     # Prettier check
pnpm arch:check       # Architecture dependency checks
pnpm circular:check   # Check for circular dependencies
pnpm unused:check     # Check for unused code/dependencies

# Testing
pnpm test             # Run Vitest unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report
pnpm test:ui          # Run tests with UI

# Cloudflare Wrangler
pnpm wrangler         # Run Wrangler CLI directly
pnpm cf:dev           # Run Cloudflare Pages development server

# Database (Cloudflare D1)
pnpm db:migrate:local        # Apply local database migrations
pnpm db:migrate:test         # Apply test database migrations
pnpm db:migrate:prod         # Apply production database migrations
pnpm db:migrations:create    # Create new database migration
pnpm db:migrations:list      # List pending migrations

# Build & Deploy (Cloudflare Pages)
pnpm pages:build             # Build for Cloudflare Pages
pnpm pages:deploy            # Deploy to Cloudflare Pages (test)
pnpm pages:deploy:test       # Deploy to Cloudflare Pages (test environment)
pnpm pages:deploy:prod       # Deploy to Cloudflare Pages (production)

# Storage (Cloudflare R2 & KV)
pnpm r2:create:test          # Create R2 bucket for test environment
pnpm r2:create:prod          # Create R2 bucket for production
pnpm kv:create:test          # Create KV namespace for test
pnpm kv:create:prod          # Create KV namespace for production

# Full validation
pnpm security:check          # npm audit + semgrep security scan


⸻

Architecture

Directory Structure
	•	app/[locale]/ - Next.js App Router with locale-based routing (en / zh).
	•	app/api/ - API routes for backend endpoints.
	•	components/ - Shared UI components (Radix UI + Tailwind).
	•	lib/ - Shared utilities and core logic.
	•	i18n/ - Internationalization setup (next-intl).
	•	messages/ - Translation files with critical/deferred split per locale.
	•	types/ - TypeScript type definitions and declarations.
	•	docs/ - Project documentation (Chinese).
	•	wrangler/ - Wrangler configuration and state.
	•	migrations/ - Database migrations (Cloudflare D1).
	•	prisma/ - Database ORM configuration.
	•	scripts/ - Automation and tooling scripts.
	•	__tests__/ - Vitest unit tests.
	•	public/ - Static assets.

Internationalization

The app uses next-intl with a layered translation architecture:
	•	messages/{locale}/critical.json - First-paint translations (Header, Footer, Hero, core navigation).
	•	messages/{locale}/deferred.json - Lazy-loaded translations used after initial render.

Testing Structure
	•	Unit tests: Vitest + Testing Library in __tests__/**/*.test.ts(x).
	•	Test setup: vitest.setup.ts.
	•	For React Testing Library, prefer role/text-based queries instead of brittle selectors. For critical logic, add edge-case tests (i18n fallback, feature flags, SSR vs CSR boundaries) and run pnpm test:coverage after significant changes.

⸻

Code Style
	•	Use the @/ path alias for imports (configured in tsconfig.json).
	•	Avoid export * re-exports (blocked by pre-commit hooks and architecture rules).
	•	ESLint forbids Jest imports; use Vitest APIs instead.
	•	Follow Conventional Commits: feat|fix|docs|style|refactor|test|chore(scope): summary.
	•	Components must use PascalCase; hooks and general functions use camelCase; files generally use kebab-case.
	•	Formatting and linting expectations:
	•	Prettier: 2-space indentation, single quotes where configured, consistent import ordering, Tailwind class ordering.
	•	ESLint: maximum 3 parameters per function, prefer const, no console in application code (except in clearly-marked dev-only sections), and security rules enabled.

⸻

Commit & PR Guidelines
	•	Commits must follow Conventional Commits, with subject lines ≤ 72 characters. Lefthook runs format/type/lint/architecture checks on commit.
	•	Pull requests should include an issue link, a concise description of the change scope, and test evidence (pnpm test output). For UI changes, include screenshots or short videos. Keep PRs small and focused whenever possible.

⸻

Key Configuration Files
	•	next.config.ts - Next.js config with MDX, next-intl, and Cloudflare Pages compatibility.
	•	vitest.config.ts - Vitest config with jsdom environment and coverage thresholds.
	•	wrangler.toml - Cloudflare Wrangler configuration (local development).
	•	wrangler.test.toml - Cloudflare Wrangler configuration (test environment).
	•	wrangler.prod.toml - Cloudflare Wrangler configuration (production).
	•	.dev.vars - Local development environment variables (Cloudflare Workers format).

⸻

Environment Variables

The project uses two types of environment variables:

.env.local (Next.js development mode)

# Core
NODE_ENV=development

# Resend Email Service (for contact form notifications)
RESEND_API_KEY=
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=

# Rate limiting (KV-backed)
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60

# Analytics & logging
ANALYTICS_ENABLED=true
ANALYTICS_SINK=log
LOG_LEVEL=INFO
LOG_FORMAT=json
LOG_INCLUDE_TIMESTAMP=true

# Database & cache
DATABASE_QUERY_TIMEOUT=5000
CACHE_DEFAULT_TTL=3600

# Performance monitoring
ENABLE_PERFORMANCE_MONITORING=true
SLOW_QUERY_THRESHOLD_MS=1000

.dev.vars (Cloudflare Workers development mode)

# Signing secret for signed URLs (file downloads, etc.)
SIGNING_SECRET=dev-secret

# Feature flags and tuning
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

Optional:
	•	ENABLE_WHATSAPP_CHAT / NEXT_PUBLIC_WHATSAPP_NUMBER - WhatsApp floating button.
	•	ENABLE_SENTRY_BUNDLE - Enable Sentry (disabled by default for performance reasons).

⸻

Security & Configuration
	•	Store secrets only in .dev.vars (for local) or Cloudflare dashboard secrets (for remote). Never commit real credentials. New code paths must avoid export * re-exports to satisfy security lint rules.
	•	Conductor-related automation is currently disabled: Next.js 15.5 + next-intl tooling is still evolving, and will be enabled only after official support is stable. Do not attempt to enable Conductor until explicitly instructed.

⸻

**Agent Instructions (English Translation)**

---

### 1. Global Communication & Language
- All thought processes and replies to the **user** must be written in Chinese, while keeping technical identifiers (e.g., `lint`, `hook`, `coverage`, `alias`, `Server Component`, `useEffect`, etc.) in English.
- Do not fabricate facts; when uncertain about behavior or framework details, explicitly state “uncertain” and then consult the official documentation or source code.

---

### 2. MCP Tools: Ace (acemcp) and Serena (must be used first)

**Tool repositories (background only):**
- Ace‑Mcp‑Node (acemcp): https://github.com/yeuxuan/Ace-Mcp-Node
- Serena MCP Server (serena): https://github.com/oraios/serena

#### 2.1 General Principles
When the project has already been set up in Claude Code / Codex with:
- `acemcp` (Ace‑Mcp‑Node)
- `serena` (Serena MCP server)

you must follow these rules:
1. For any **non‑trivial** code‑related issue (understanding existing implementation, debugging, refactoring, or developing new features), you must **actively use Ace / Serena**, not rely only on conversational context or personal experience.
2. Do not answer questions about project structure, architecture, data flow, or implementation details **without first invoking Ace / Serena**.
3. If a tool is unavailable or a call fails, clearly tell the user that the tool context is missing and explain that the subsequent answer will be based on assumptions, which carries higher risk.

#### 2.2 Ace (acemcp): Repository‑wide Semantic Search (`search_context`)
Ace‑Mcp‑Node provides a standard MCP tool `search_context` that performs a semantic search over the whole codebase and returns snippets with file paths and line numbers.

**Usage rules:**
- When you do **not know** where a particular business logic, route, middleware, or configuration lives, first call Ace’s `search_context`.
- Example natural‑language queries:
  - “multi‑language routing and next‑intl integration”
  - “Cloudflare D1 migrations and prisma schema”
  - “rate limiting implementation for contact form”
- Use Ace’s results to:
  - Pinpoint relevant directories/files (e.g., `app/api/**`, `lib/**`, `migrations/**`).
  - Identify existing services/utilities/hooks/components.
  - Verify whether tests, documentation, or similar features already exist and can be reused.

**Prohibited actions:**
- Do not assert “this feature must be in file X” based solely on memory or prior conversation; always verify with `search_context`.
- Do not describe the “current state of the project” without first examining Ace’s search results.

#### 2.3 Serena: Semantic‑level Code Understanding & Precise Editing
Serena MCP server offers LSP‑based, project‑wide semantic capabilities, allowing you to:
- Understand symbol‑level structure (function, component, type, variable definitions and references).
- Navigate precisely to a symbol’s definition and all its call sites.
- Perform “scalpel‑style” edits (insert/replace near a symbol rather than overwriting an entire file).
- Read/write files, run tests, execute terminal commands (exact abilities depend on the client‑exposed tools).

In Claude Code you should:
- Treat Serena as the **default entry point** for comprehension and modification, not manually scan large files or rely on plain‑text greps.
- Typical calls (names depend on the actual Serena tools exposed) include:
  - `find_symbol` / `get_symbols_overview`: quickly build a structural view of a file or module.
  - `find_referencing_symbols`: locate where a component, hook, or service is used.
  - Symbol‑level edit tools (insert/replace at a symbol) for safe, incremental changes.

**Prohibited actions:**
- When Serena is available, you must **not guess** whether a function is called elsewhere; always confirm with the reference‑query tool.
- Avoid whole‑file rewrites for small changes; prefer Serena’s symbol‑level editing.

#### 2.4 Recommended Workflow (must be followed first)
For any task that is **not documentation‑only** and will affect code behavior:

1. **High‑level reconnaissance with Ace (`search_context`)**
   - Locate the feature entry point, API route, service layer, configuration, and tests related to the requirement/problem.

2. **Semantic structuring with Serena**
   - Use symbol‑overview tools on the key files to see component/function boundaries.
   - Use reference queries on critical functions/components to understand call relationships.

3. **Design solution (explain in Chinese to the user)**
   - State which modules will be changed, what abstractions will be introduced, and the potential impact scope.

4. **Apply precise modifications with Serena**
   - Perform incremental insert/replace operations at the symbol level, not whole‑file overwrites.
   - Keep diffs small, focused, and readable.

5. **Run verification commands (if environment permits)**
   - Via Serena‑exposed terminal tools, execute:
     - `pnpm type-check`
     - `pnpm lint:check`
     - `pnpm test` / `pnpm test:coverage`

**You may skip Ace / Serena only when *all* the following are true:**
- You are creating a **very small, loosely‑coupled new file** (e.g., a simple utility or documentation example).
- The new file does **not** need to reuse or modify existing logic.
- The user has explicitly expressed no concern about the risk.

---

### 3. Documentation & Official Sources (`context7` / official docs)
Before making any code/style/configuration change, you should consult `context7` (or an equivalent official‑documentation tool) for the latest recommended practices:

- Next.js (App Router, data fetching, routing, metadata, etc.)
- React 19 / React Server Components
- Tailwind, Prisma, Cloudflare Workers / Pages / D1 / R2 / KV

Only when the change is purely a **documentation update** (recording the current state or clarifying explanations) and does **not** alter behavior or design decisions may you skip `context7`.

If official docs, the current project state, and the user’s request conflict:
- Clearly describe the discrepancy and associated risks.
- Offer at least one solution that **strictly follows official best practices**, and one **compromise** that aligns more closely with the existing implementation, letting the user choose.

---

### 4. Avoid Hard‑coding & i18n Rules
- Business copy, language strings, colors, spacing, thresholds, etc., must **not** be hard‑coded inside components.
  - **Copy**: must go through the `messages` directory i18n configuration (critical / deferred).
  - **Design constants** (colors, spacing, etc.): managed via Tailwind config or design tokens.
  - **Business thresholds / config**: centralized in a config or constants module, not scattered across components.
- When adding new copy:
  - Add a key to the appropriate `messages/{locale}/critical.json` or `deferred.json`.
  - Components should reference the i18n key, never write the literal text directly.

---

### 5. Additional Constraints & Practices
- **TypeScript**
  - Treat `any` as a last resort; prefer precise types, unions, and `satisfies`.
  - Follow the project’s strict settings; avoid blunt `@ts-ignore` hacks.
- **React / Next.js**
  - Prefer Server Components; use `"use client"` only when interaction, browser APIs, or hooks are truly needed.
  - Avoid unnecessary `useEffect`; if a behavior can be achieved via props or render logic, do not add an effect.
- **Risk disclosure**
  - If you spot obvious architectural problems or technical debt, state them outright and provide an actionable improvement plan (can be phased).

---

### 6. Moving Forward
When the user replies “continue”, you may proceed to the next logical step (e.g., from design to concrete implementation, or from a single‑file edit to required companion refactor) **as long as you respect all constraints in this CLAUDE.md**. In your response, you must still explain which actions you performed and which tools (Ace / Serena / context7, etc.) you used.
```
