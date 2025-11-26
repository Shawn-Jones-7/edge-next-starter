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
pnpm db:migrate:local # Apply local database migrations
pnpm db:migrate:test  # Apply test database migrations
pnpm db:migrate:prod  # Apply production database migrations
pnpm db:migrations:create # Create new database migration
pnpm db:migrations:list # List pending migrations

# Build & Deploy (Cloudflare Pages)
pnpm pages:build      # Build for Cloudflare Pages
pnpm pages:deploy     # Deploy to Cloudflare Pages (test)
pnpm pages:deploy:test # Deploy to Cloudflare Pages (test environment)
pnpm pages:deploy:prod # Deploy to Cloudflare Pages (production)

# Storage (Cloudflare R2 & KV)
pnpm r2:create:test   # Create R2 bucket for test environment
pnpm r2:create:prod   # Create R2 bucket for production
pnpm kv:create:test   # Create KV namespace for test
pnpm kv:create:prod   # Create KV namespace for production

# Full validation
pnpm security:check   # npm audit + semgrep security scan
```

---

## Architecture

### Directory Structure

- `app/[locale]/` - Next.js App Router with locale-based routing (`en` / `zh`).
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

### Internationalization

The app uses **next-intl** with a layered translation architecture:

- `messages/{locale}/critical.json` - First-paint translations (Header, Footer, Hero, core navigation).
- `messages/{locale}/deferred.json` - Lazy-loaded translations used after initial render.

### Testing Structure

- Unit tests: Vitest + Testing Library in `__tests__/**/*.test.ts(x)`.
- Test setup: `vitest.setup.ts`.
- For React Testing Library, prefer role/text-based queries instead of brittle selectors. For critical logic, add edge-case tests (i18n fallback, feature flags, SSR vs CSR boundaries) and run `pnpm test:coverage` after significant changes.

---

## Code Style

- Use the `@/` path alias for imports (configured in `tsconfig.json`).
- Avoid `export *` re-exports (blocked by pre-commit hooks and architecture rules).
- ESLint forbids Jest imports; use Vitest APIs instead.
- Follow Conventional Commits: `feat|fix|docs|style|refactor|test|chore(scope): summary`.
- Components must use PascalCase; hooks and general functions use camelCase; files generally use kebab-case.
- Formatting and linting expectations:
  - Prettier: 2-space indentation, single quotes where configured, consistent import ordering, Tailwind class ordering.
  - ESLint: maximum 3 parameters per function, prefer `const`, no `console` in application code (except in clearly-marked dev-only sections), and security rules enabled.

---

## Commit & PR Guidelines

- Commits must follow Conventional Commits, with subject lines ≤ 72 characters. Lefthook runs format/type/lint/architecture checks on commit.
- Pull requests should include an issue link, a concise description of the change scope, and test evidence (`pnpm test` output). For UI changes, include screenshots or short videos. Keep PRs small and focused whenever possible.

---

## Key Configuration Files

- `next.config.ts` - Next.js config with MDX, next-intl, and Cloudflare Pages compatibility.
- `vitest.config.ts` - Vitest config with jsdom environment and coverage thresholds.
- `wrangler.toml` - Cloudflare Wrangler configuration (local development).
- `wrangler.test.toml` - Cloudflare Wrangler configuration (test environment).
- `wrangler.prod.toml` - Cloudflare Wrangler configuration (production).
- `.dev.vars` - Local development environment variables (Cloudflare Workers format).

---

## Environment Variables

The project uses two types of environment variables:

### `.env.local` (Next.js development mode)

```bash
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
```

### `.dev.vars` (Cloudflare Workers development mode)

```bash
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
```

Optional:

- `ENABLE_WHATSAPP_CHAT` / `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp floating button.
- `ENABLE_SENTRY_BUNDLE` - Enable Sentry (disabled by default for performance reasons).

---

## Security & Configuration

- Store secrets only in `.dev.vars` (for local) or Cloudflare dashboard secrets (for remote). Never commit real credentials. New code paths must avoid `export *` re-exports to satisfy security lint rules.
- Conductor-related automation is currently disabled: Next.js 15.5 + next-intl tooling is still evolving, and will be enabled only after official support is stable. Do not attempt to enable Conductor until explicitly instructed.

---

## Agent Instructions

- All thinking steps and all responses to the **user** must be in Chinese. Professional/technical terms (e.g. lint, hook, coverage, alias) should remain in English.
- Before making any code/style/configuration change, you **must** consult official documentation via context7 (and associated tools) to align with the latest best practices, rather than relying on memory.
- For documentation-only updates that merely record information or summarize the current state without impacting behavior or design decisions, you may skip context7 when it is clearly unnecessary.
- Avoid hardcoding: content, languages, colors, spacing, and other design or business constants should come from configuration, translation files, or design tokens. New copy must go through i18n (the `messages` directory). New colors or sizes must be introduced via the theme / tokens or Tailwind configuration, not as raw literals in application code.
