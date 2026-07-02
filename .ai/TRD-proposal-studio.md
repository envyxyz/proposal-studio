# Proposal Studio — Technical Requirements Document (TRD)

**Version:** 1.0  
**Author:** Engineering  
**Last Updated:** July 2, 2026  
**Status:** Draft — Pending Engineering Review  
**Source PRD:** [PRD-proposal-studio.md](file:///c:/Users/ameer/Desktop/client-proposal/.ai/PRD-proposal-studio.md)

---

## 1. Overview & Guiding Constraints

This document translates the Proposal Studio PRD into implementable engineering specifications. Every decision is filtered through four hard constraints:

1. **Self-hosted, single codebase.** One repository, one deployment artifact. No microservices unless the tradeoff is overwhelming (spoiler: it's not, except for PDF generation).
2. **Multi-tenant from day one.** Every database table, every query, every API route is tenant-scoped. V1 launches with single-user tenants, but the schema and middleware are ready for V2 multi-user tenants without migrations.
3. **Budget-conscious deployment.** Target: a single $12–$24/mo VPS (Hetzner, DigitalOcean, Railway) running everything. No AWS bill surprises, no Kubernetes. Docker Compose is the ceiling.
4. **Solo developer velocity.** Minimize moving parts. Prefer boring, well-documented tools over cutting-edge ones. If a library has been stable for 3+ years, it wins.

---

## 2. Frontend Architecture Decision

### Decision: Evolve the Prototype Inside Next.js — Do Not Rewrite

The existing prototype ([index.html](file:///c:/Users/ameer/Desktop/client-proposal/index.html), [app.js](file:///c:/Users/ameer/Desktop/client-proposal/app.js), [style.css](file:///c:/Users/ameer/Desktop/client-proposal/style.css)) is ~1,200 lines of vanilla HTML/CSS/JS. It works. The `contenteditable` + CSS variable design system + `gatherData()`/`restoreData()` serialization loop is genuinely clever and already solves the hardest UX problem (live WYSIWYG editing with zero framework overhead).

Rewriting this in React/Vue would take 3–4 weeks and introduce bugs the prototype doesn't have today. `contenteditable` and React's virtual DOM are famously hostile to each other — every React rich-text editor (Slate, TipTap, Lexical) exists because of this friction.

**What we do instead:**

```
next-app/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Login, signup, magic-link verify
│   │   ├── (dashboard)/            # Proposal list, client list, invoice list
│   │   ├── editor/[id]/            # The proposal editor
│   │   ├── portal/[slug]/          # Public client portal (SSR)
│   │   └── api/                    # API routes (or separate Express, see §3)
│   ├── components/                 # React components for dashboard, lists, modals
│   ├── editor/                     # The prototype — loaded as a standalone module
│   │   ├── editor.html             # The contenteditable page structure (no <head>, no <body>)
│   │   ├── editor.css              # style.css renamed, scoped to .editor-root
│   │   └── editor.js               # app.js refactored to export init(container, data) and gatherData()
│   └── lib/                        # Shared utilities, API client, auth helpers
├── prisma/
│   └── schema.prisma               # Database schema
└── docker-compose.yml
```

**The editor lives in an iframe or a DOM-isolated container.** Next.js handles routing, auth, dashboard UI, and API calls. The editor is initialized by calling `editor.init(containerEl, proposalData)` on mount, and the dashboard calls `editor.gatherData()` on save. This keeps the prototype's DOM manipulation intact while wrapping it in a proper application shell.

### Why Not a Full SPA Rewrite?

| Factor | Evolve (chosen) | Rewrite in React |
|---|---|---|
| **Time to V1** | ~6 weeks | ~10+ weeks |
| **contenteditable risk** | Zero — it already works | High — React re-render conflicts with cursor position, selection state |
| **Styling** | Keep existing CSS variable system verbatim | Would need to port 1,100 lines of CSS or fight a component library |
| **PDF fidelity** | Same HTML/CSS renders in Puppeteer | Must ensure React hydration matches Puppeteer render |
| **Maintenance** | One person can hold the editor in their head | Requires understanding React + a rich-text abstraction layer |

### Why Not Stay Pure Vanilla?

Because we need: client-side routing, auth state management, protected routes, server-side rendering for the client portal (SEO + performance), and API route handlers. Building those from scratch in vanilla JS is more work than using Next.js.

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          SINGLE VPS / CONTAINER                       │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                     Next.js Application                         │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │  │
│  │  │  Dashboard   │  │   Editor     │  │   Client Portal       │ │  │
│  │  │  (React)     │  │   (Vanilla)  │  │   (SSR + Vanilla)     │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘ │  │
│  │         │                 │                      │              │  │
│  │         ▼                 ▼                      ▼              │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │              API Routes (/api/*)                          │   │  │
│  │  │  ┌────────┐ ┌──────────┐ ┌─────────┐ ┌───────────────┐  │   │  │
│  │  │  │  Auth  │ │ Proposal │ │ Invoice │ │    Webhook    │  │   │  │
│  │  │  │ (JWT)  │ │   CRUD   │ │  CRUD   │ │   Handlers    │  │   │  │
│  │  │  └────────┘ └──────────┘ └─────────┘ └───────────────┘  │   │  │
│  │  └──────────────────────┬───────────────────────────────────┘   │  │
│  └─────────────────────────┼───────────────────────────────────────┘  │
│                            │                                          │
│  ┌─────────────────────────┼──────────────────────────────────────┐   │
│  │                    Data Layer                                   │   │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐  │   │
│  │  │ Postgres │    │  Redis   │    │  Local Disk / S3-compat  │  │   │
│  │  │  (main)  │    │ (sessions│    │  (MinIO or local /data)  │  │   │
│  │  │          │    │  + cache)│    │  logos, sigs, PDFs        │  │   │
│  │  └──────────┘    └──────────┘    └──────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  PDF Worker (Puppeteer - same process, pooled browser instance) │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────────┐
        │  Stripe  │   │  Resend  │   │  OpenAI /    │
        │(payments)│   │ (email)  │   │  Gemini (AI) │
        └──────────┘   └──────────┘   └──────────────┘
```

### Architecture Rationale

**Everything runs in a single Node.js process.** Next.js serves the frontend, handles API routes, runs the PDF worker (Puppeteer with a pooled browser instance), and connects to Postgres + Redis on the same VPS. This is intentional — for a bootstrapped solo project serving < 500 users, the operational simplicity of one process beats the theoretical scalability of microservices.

**When to split:** If PDF generation starts eating > 40% of CPU or queuing for > 10 seconds, extract it into a separate worker process on the same VPS, communicating via a Redis-backed BullMQ job queue. This is a 2-hour change, not an architectural rewrite.

---

## 4. Tech Stack

| Layer | Choice | Version | Why This, Why Not That |
|---|---|---|---|
| **Runtime** | Node.js | 20 LTS | Stable, matches frontend language. Not Bun — Bun's Postgres driver ecosystem is immature. |
| **Framework** | Next.js (App Router) | 15.x | SSR for client portal, API routes, file-based routing. Not Express standalone — we'd have to build routing, middleware, and static serving from scratch. |
| **ORM** | Prisma | 6.x | Type-safe queries, migration system, introspection. Not Drizzle — Prisma's migration tooling is more mature for a solo dev who needs `prisma migrate deploy` in CI. |
| **Database** | PostgreSQL | 16 | JSONB for proposal content, full-text search via `tsvector`, row-level security for multi-tenancy. Not MongoDB — relational integrity matters for invoices and signatures. |
| **Cache** | Redis | 7.x | Session store, rate limiting, job queue (BullMQ). Not in-memory — must survive process restart. |
| **File Storage** | MinIO (self-hosted S3) or local disk + signed URLs | Latest | Self-hosted constraint. MinIO is drop-in S3-compatible. Upgrade path to real S3/GCS is a config change. |
| **PDF** | Puppeteer | Latest | Headless Chrome. Renders the exact HTML/CSS from the editor. Not wkhtmltopdf (outdated rendering), not PDFKit (can't render our CSS). |
| **Auth** | NextAuth.js (Auth.js v5) | 5.x | Magic link + Google OAuth out of the box. Not Passport — more boilerplate for the same result. Not Clerk/Auth0 — external dependency, cost, self-hosted constraint. |
| **Email** | Resend | — | Simple API, generous free tier (100 emails/day). Not SendGrid — more complex setup, worse DX. |
| **Payments** | Stripe | — | Industry standard. Checkout Sessions for one-time invoice payments. Not PayPal — worse API, worse DX. |
| **AI** | OpenAI (gpt-4o-mini) | — | Best cost/quality ratio for structured text generation. ~$0.01 per draft. Not Gemini — slightly worse at following structured output schemas in testing. |
| **Deployment** | Docker Compose | — | Single `docker-compose up` brings up app + Postgres + Redis + MinIO. Not Kubernetes — overkill. Not bare metal — reproducibility matters. |

---

## 5. Data Model (PostgreSQL)

### 5.1 Multi-Tenancy Strategy

Every table (except `tenants` itself) carries a `tenant_id UUID NOT NULL` column with a foreign key to `tenants.id`. Every query includes `WHERE tenant_id = $1`. This is enforced at two levels:

1. **Application layer:** Prisma middleware automatically injects `tenant_id` into every `findMany`, `create`, `update`, and `delete` call based on the authenticated user's tenant.
2. **Database layer:** PostgreSQL Row-Level Security (RLS) policies as a defense-in-depth backup. If the application layer has a bug, the database won't leak cross-tenant data.

In V1, each user is their own tenant (1:1). In V2, a tenant has multiple users with roles.

### 5.2 Schema

```sql
-- ============================================================
-- TENANTS & USERS
-- ============================================================

CREATE TABLE tenants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,                           -- "Ameer's Studio", can be updated
    slug            TEXT UNIQUE NOT NULL,                    -- URL-safe tenant identifier
    plan            TEXT NOT NULL DEFAULT 'free',            -- 'free' | 'pro' | 'team'
    stripe_customer_id TEXT,                                 -- Stripe Customer object ID
    invoice_prefix  TEXT NOT NULL DEFAULT 'INV',             -- configurable invoice number prefix
    invoice_counter INTEGER NOT NULL DEFAULT 0,              -- auto-increment counter for invoice numbers
    settings        JSONB NOT NULL DEFAULT '{}',             -- tenant-wide defaults (timezone, date format, etc.)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email           TEXT UNIQUE NOT NULL,
    name            TEXT NOT NULL,
    avatar_url      TEXT,
    role            TEXT NOT NULL DEFAULT 'owner',           -- 'owner' | 'manager' | 'member' (V2)
    email_verified  BOOLEAN NOT NULL DEFAULT false,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- CLIENTS
-- ============================================================

CREATE TABLE clients (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    company         TEXT,
    email           TEXT,
    phone           TEXT,
    address         TEXT,
    notes           TEXT,
    brand_settings  JSONB NOT NULL DEFAULT '{}',             -- per-client design defaults (colors, fonts, logo URL)
    tags            TEXT[] NOT NULL DEFAULT '{}',             -- user-defined tags for filtering
    archived_at     TIMESTAMPTZ,                             -- soft-delete
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clients_tenant ON clients(tenant_id);
-- Full-text search index on client name + company
CREATE INDEX idx_clients_search ON clients USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(company, ''))
);

-- ============================================================
-- PROPOSALS
-- ============================================================

CREATE TYPE proposal_status AS ENUM (
    'draft', 'sent', 'viewed', 'signed', 'expired', 'archived'
);

CREATE TABLE proposals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),      -- creator
    client_id       UUID REFERENCES clients(id),             -- nullable for drafts without a client
    template_id     UUID REFERENCES templates(id) ON DELETE SET NULL,

    title           TEXT NOT NULL DEFAULT 'Untitled Proposal',
    slug            TEXT UNIQUE,                             -- generated on send, used for portal URL
    status          proposal_status NOT NULL DEFAULT 'draft',

    -- The full proposal payload — this is the exact JSON from gatherData()
    -- Contains: settings, pages, welcomeRows, guideRows, scopeRows,
    -- additionalRows, invoiceRows, paymentMethods, pageOrder, markHTML,
    -- qrImage, qrHidden, currency
    content         JSONB NOT NULL DEFAULT '{}',

    -- Denormalized from content for query convenience
    design_settings JSONB NOT NULL DEFAULT '{}',
    page_order      JSONB NOT NULL DEFAULT '[]',
    currency_symbol TEXT NOT NULL DEFAULT '$',

    -- Content hash for signature integrity
    -- SHA-256 of JSON.stringify(content) at time of send
    version_hash    TEXT,

    -- Portal settings
    sent_at         TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,                             -- optional link expiry
    password_hash   TEXT,                                    -- optional portal password (bcrypt)

    -- Metadata
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_proposals_tenant ON proposals(tenant_id);
CREATE INDEX idx_proposals_client ON proposals(client_id);
CREATE INDEX idx_proposals_status ON proposals(tenant_id, status);
CREATE INDEX idx_proposals_slug ON proposals(slug) WHERE slug IS NOT NULL;
CREATE INDEX idx_proposals_search ON proposals USING gin(
    to_tsvector('english', coalesce(title, ''))
);

-- ============================================================
-- PROPOSAL VERSIONS (for auto-save history)
-- ============================================================

CREATE TABLE proposal_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id     UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    content         JSONB NOT NULL,
    version_hash    TEXT NOT NULL,
    version_number  INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_versions_proposal ON proposal_versions(proposal_id);
-- Keep only last 25 versions per proposal — enforced by application logic on save

-- ============================================================
-- TEMPLATES
-- ============================================================

CREATE TABLE templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    name            TEXT NOT NULL,
    content         JSONB NOT NULL DEFAULT '{}',
    design_settings JSONB NOT NULL DEFAULT '{}',
    page_order      JSONB NOT NULL DEFAULT '[]',
    is_shared       BOOLEAN NOT NULL DEFAULT false,          -- V2: visible to all team members
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_templates_tenant ON templates(tenant_id);

-- ============================================================
-- SIGNATURES
-- ============================================================

CREATE TABLE signatures (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id     UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    signer_name     TEXT NOT NULL,
    signer_email    TEXT,
    signature_type  TEXT NOT NULL DEFAULT 'draw',            -- 'draw' | 'type'
    signature_url   TEXT NOT NULL,                           -- URL to signature image in storage
    ip_address      INET NOT NULL,
    user_agent      TEXT NOT NULL,
    document_hash   TEXT NOT NULL,                           -- SHA-256 of proposal content at sign-time
    signed_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_signatures_proposal ON signatures(proposal_id);

-- ============================================================
-- INVOICES
-- ============================================================

CREATE TYPE invoice_status AS ENUM (
    'draft', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled'
);

CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    client_id       UUID REFERENCES clients(id),
    proposal_id     UUID REFERENCES proposals(id) ON DELETE SET NULL, -- nullable for standalone invoices

    invoice_number  TEXT NOT NULL,                           -- e.g. "INV-001"
    status          invoice_status NOT NULL DEFAULT 'draft',

    currency_symbol TEXT NOT NULL DEFAULT '$',
    line_items      JSONB NOT NULL DEFAULT '[]',             -- [{title, description, qty, unit_price, total}]
    payment_methods JSONB NOT NULL DEFAULT '[]',             -- [{name, details}]

    subtotal        DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_rate        DECIMAL(5,2) NOT NULL DEFAULT 0,
    tax_amount      DECIMAL(12,2) NOT NULL DEFAULT 0,
    total           DECIMAL(12,2) NOT NULL DEFAULT 0,

    -- Payment tracking
    amount_paid     DECIMAL(12,2) NOT NULL DEFAULT 0,
    due_date        TIMESTAMPTZ,
    paid_at         TIMESTAMPTZ,

    -- Stripe
    stripe_payment_intent_id TEXT,
    stripe_checkout_url      TEXT,

    notes           TEXT,                                    -- "Payment is due within 7 days..."
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(tenant_id, status);
CREATE UNIQUE INDEX idx_invoices_number ON invoices(tenant_id, invoice_number);

-- ============================================================
-- EVENT LOG (activity feed + view tracking)
-- ============================================================

CREATE TYPE event_type AS ENUM (
    'proposal.created', 'proposal.updated', 'proposal.sent', 'proposal.viewed',
    'proposal.signed', 'proposal.expired', 'proposal.archived',
    'invoice.created', 'invoice.sent', 'invoice.viewed', 'invoice.paid',
    'invoice.reminder_sent',
    'client.created', 'client.updated'
);

CREATE TABLE events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    proposal_id     UUID REFERENCES proposals(id) ON DELETE CASCADE,
    invoice_id      UUID REFERENCES invoices(id) ON DELETE CASCADE,
    client_id       UUID REFERENCES clients(id) ON DELETE SET NULL,
    user_id         UUID REFERENCES users(id),               -- null for client-triggered events

    event           event_type NOT NULL,
    metadata        JSONB NOT NULL DEFAULT '{}',             -- { ip, user_agent, page_times: {...} }
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_tenant ON events(tenant_id);
CREATE INDEX idx_events_proposal ON events(proposal_id);
CREATE INDEX idx_events_invoice ON events(invoice_id);
CREATE INDEX idx_events_created ON events(tenant_id, created_at DESC);

-- ============================================================
-- ASSETS (file uploads metadata)
-- ============================================================

CREATE TABLE assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    filename        TEXT NOT NULL,
    mime_type       TEXT NOT NULL,
    size_bytes      INTEGER NOT NULL,
    storage_key     TEXT NOT NULL,                           -- path in MinIO/S3: "tenants/{tenant_id}/assets/{uuid}.{ext}"
    url             TEXT NOT NULL,                           -- signed URL or CDN URL
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assets_tenant ON assets(tenant_id);

-- ============================================================
-- WEBHOOK SUBSCRIPTIONS (V2 — schema ready now)
-- ============================================================

CREATE TABLE webhook_subscriptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    url             TEXT NOT NULL,                           -- target URL
    events          TEXT[] NOT NULL DEFAULT '{}',            -- which event_types to fire on
    secret          TEXT NOT NULL,                           -- HMAC signing secret
    active          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhooks_tenant ON webhook_subscriptions(tenant_id);
```

### 5.3 Schema Design Notes

**Why JSONB for `content` instead of normalized tables?**

The proposal content payload (from `gatherData()`) contains deeply nested, variable-length arrays (welcome rows, scope rows, invoice rows, etc.) with rich HTML in each field. Normalizing this into `proposal_rows`, `proposal_fields`, etc. would create dozens of joins for every load, and the content is always read and written as a single atomic blob. JSONB gives us:

- Atomic read/write of the entire proposal state
- Flexible schema — adding a new section type to the editor doesn't require a migration
- Indexable with GIN indexes if we ever need to query inside the content

**Why denormalized `design_settings`, `page_order`, `currency_symbol` alongside `content`?**

These fields exist in `content` JSONB too, but we duplicate them at the top level for:
- Dashboard filtering (e.g., "show all proposals using EUR")
- Template application (apply design settings without parsing the full content blob)
- Index-backed queries without JSONB path operators

---

## 6. API Surface

### 6.1 Authentication

All endpoints except `/api/auth/*` and `/api/portal/*` require a valid JWT in the `Authorization: Bearer <token>` header.

| Method | Route | Body / Params | Response | Notes |
|---|---|---|---|---|
| `POST` | `/api/auth/magic-link` | `{ email }` | `{ ok: true }` | Sends a 15-min magic link email via Resend. Creates tenant + user on first login. |
| `GET` | `/api/auth/verify?token=<jwt>` | — | `{ accessToken, refreshToken, user }` | Verifies magic link token, issues session. |
| `POST` | `/api/auth/google` | `{ idToken }` | `{ accessToken, refreshToken, user }` | Google OAuth — verify ID token server-side. |
| `POST` | `/api/auth/refresh` | `{ refreshToken }` | `{ accessToken }` | Issues new access token (15-min). Refresh token rotated (7-day). |
| `POST` | `/api/auth/logout` | — | `{ ok: true }` | Invalidates refresh token in Redis. |

**Token architecture:**
- **Access token:** JWT, 15-min expiry, contains `{ userId, tenantId, role }`. Stateless — not stored anywhere.
- **Refresh token:** Opaque UUID, 7-day expiry, stored in Redis keyed by `refresh:<tokenHash>`. HTTP-only cookie preferred, but also accepted in body for mobile clients.

### 6.2 Proposals

| Method | Route | Body / Params | Response | Notes |
|---|---|---|---|---|
| `GET` | `/api/proposals` | `?status=draft&client_id=...&page=1&limit=20&q=search` | `{ data: [...], total, page }` | Paginated, filterable. Always scoped to `tenant_id`. |
| `POST` | `/api/proposals` | `{ title, clientId?, templateId?, content? }` | `{ id, title, status, ... }` | Creates draft. If `templateId` provided, clones template content. |
| `GET` | `/api/proposals/:id` | — | Full proposal object | Includes latest `content` JSONB. |
| `PUT` | `/api/proposals/:id` | `{ content?, title?, clientId? }` | `{ id, updatedAt }` | Auto-save target. Debounced client-side (2s). Creates a version snapshot every 10th save. |
| `DELETE` | `/api/proposals/:id` | — | `{ ok: true }` | Soft-delete (sets `status: 'archived'`). |
| `POST` | `/api/proposals/:id/send` | `{ clientEmail?, expiresAt?, password? }` | `{ slug, portalUrl }` | Generates slug, computes `version_hash`, sets `status: 'sent'`, optionally sends email. |
| `POST` | `/api/proposals/:id/duplicate` | `{ title? }` | `{ id, ... }` | Deep-clones content, resets status to draft, strips slug. |
| `GET` | `/api/proposals/:id/versions` | `?page=1&limit=10` | `{ data: [...], total }` | Version history list. |
| `POST` | `/api/proposals/:id/versions/:vid/restore` | — | `{ id, content }` | Overwrites current content with the selected version. |

### 6.3 Client Portal (Unauthenticated)

These routes have no JWT requirement. They are rate-limited aggressively (20 req/min per IP).

| Method | Route | Body / Params | Response | Notes |
|---|---|---|---|---|
| `GET` | `/api/portal/:slug` | `?password=...` | Proposal content (read-only subset) | Returns `403` if password-protected and wrong/missing. Returns `410` if expired. |
| `POST` | `/api/portal/:slug/view` | `{ metadata: { userAgent, screenSize } }` | `{ ok: true }` | Logs `proposal.viewed` event. Only logs first view per IP per 24h. |
| `POST` | `/api/portal/:slug/sign` | `{ signerName, signerEmail, signatureImage (base64), signatureType }` | `{ ok: true, signedAt }` | Validates `document_hash` matches current proposal. Stores signature image in file storage. Sets proposal `status: 'signed'`. Triggers invoice auto-generation. |

### 6.4 Templates

| Method | Route | Body / Params | Response | Notes |
|---|---|---|---|---|
| `GET` | `/api/templates` | — | `[{ id, name, createdAt }]` | Tenant-scoped. V2 includes `is_shared` team templates. |
| `POST` | `/api/templates` | `{ name, content, designSettings, pageOrder }` | `{ id, name }` | |
| `PUT` | `/api/templates/:id` | `{ name?, content? }` | `{ id, updatedAt }` | |
| `DELETE` | `/api/templates/:id` | — | `{ ok: true }` | Hard-delete. |

### 6.5 Clients

| Method | Route | Body / Params | Response | Notes |
|---|---|---|---|---|
| `GET` | `/api/clients` | `?q=search&tag=shopify&page=1&limit=20` | `{ data: [...], total }` | Full-text search on name + company via `tsvector`. |
| `POST` | `/api/clients` | `{ name, company?, email?, phone?, address?, notes?, brandSettings?, tags? }` | `{ id, ... }` | |
| `GET` | `/api/clients/:id` | — | Client + document history (proposals + invoices with statuses) | |
| `PUT` | `/api/clients/:id` | Partial update | `{ id, updatedAt }` | |
| `DELETE` | `/api/clients/:id` | — | `{ ok: true }` | Soft-delete (`archived_at`). Preserves linked proposals/invoices. |

### 6.6 Invoices

| Method | Route | Body / Params | Response | Notes |
|---|---|---|---|---|
| `GET` | `/api/invoices` | `?status=unpaid&client_id=...&page=1&limit=20` | `{ data: [...], total }` | |
| `POST` | `/api/invoices` | `{ clientId, lineItems, currency, taxRate, paymentMethods, dueDate?, notes? }` | `{ id, invoiceNumber }` | Auto-generates invoice number from tenant's `invoice_prefix` + `invoice_counter`. |
| `GET` | `/api/invoices/:id` | — | Full invoice | |
| `PUT` | `/api/invoices/:id` | `{ status?, lineItems?, amountPaid?, paidAt? }` | `{ id, updatedAt }` | |
| `GET` | `/api/invoices/:id/pdf` | — | `application/pdf` stream | Generates PDF via Puppeteer (see §7.2). Cached in file storage for 24h. |
| `POST` | `/api/invoices/:id/pay` | — | `{ checkoutUrl }` | Creates Stripe Checkout Session, returns redirect URL. |

### 6.7 Assets

| Method | Route | Body / Params | Response | Notes |
|---|---|---|---|---|
| `POST` | `/api/assets/upload` | `multipart/form-data: file` | `{ id, url }` | Max 5MB. Accepts `image/*`. Stores in MinIO at `tenants/{tenantId}/assets/{uuid}.{ext}`. Returns a signed URL (1h expiry) or a permanent CDN URL. |

### 6.8 Webhooks (Outbound — V2 Ready)

| Method | Route | Body / Params | Response | Notes |
|---|---|---|---|---|
| `GET` | `/api/webhooks` | — | `[{ id, url, events, active }]` | |
| `POST` | `/api/webhooks` | `{ url, events }` | `{ id, secret }` | Auto-generates HMAC secret. |
| `DELETE` | `/api/webhooks/:id` | — | `{ ok: true }` | |

### 6.9 Stripe Webhook (Inbound)

| Method | Route | Body / Params | Response | Notes |
|---|---|---|---|---|
| `POST` | `/api/webhooks/stripe` | Stripe event payload | `200 OK` | Verifies `stripe-signature` header. Handles `checkout.session.completed` → marks invoice as paid. |

### 6.10 AI

| Method | Route | Body / Params | Response | Notes |
|---|---|---|---|---|
| `POST` | `/api/ai/draft` | `{ brief, clientId? }` | `{ content }` | Returns a proposal content JSONB blob. Rate-limited: 20/mo (Pro), 0 (Free). |

### 6.11 Dashboard / Aggregate

| Method | Route | Body / Params | Response | Notes |
|---|---|---|---|---|
| `GET` | `/api/dashboard` | — | `{ proposalsByStatus, invoicesByStatus, totalRevenue, recentEvents }` | Single aggregate query for the dashboard view. |

---

## 7. Third-Party Service Decisions

### 7.1 E-Signature: Build In-House

| Option | Cost | Pros | Cons |
|---|---|---|---|
| **DocuSign API** | $25/mo + $1.50/envelope | Legally advanced e-sig, audit trail built-in, trusted brand | Expensive per-document, external dependency, complex OAuth flow, overkill for freelancer proposals |
| **HelloSign (Dropbox Sign) API** | $20/mo + $1/signature | Simpler API than DocuSign, embedded signing | Still per-signature cost, external dependency |
| **Build in-house** ✅ | $0 | Full control, no per-signature cost, simple implementation | "Simple electronic signature" only — no AATL certificate authority chain |

**Decision: Build in-house.**

For our persona (freelancers sending proposals to small business clients), a "simple electronic signature" (capture pad + metadata) is sufficient and legally valid under ESIGN (US) and eIDAS (EU). We are not competing with DocuSign on legal defensibility — we're competing with "client said yes on WhatsApp."

**Implementation:**
1. **Draw mode:** HTML5 `<canvas>` with touch/mouse event listeners. Outputs a PNG via `canvas.toDataURL()`.
2. **Type mode:** Text input rendered in a script font (e.g., `Caveat` from Google Fonts). Rendered to PNG server-side via a small `<canvas>` to store a uniform format.
3. **On submit:** Capture `{ signerName, signerEmail, signatureImage (base64), ipAddress, userAgent, documentHash }`. Store signature PNG in MinIO. Compute `documentHash = SHA-256(JSON.stringify(proposal.content))` and compare against `proposal.version_hash` to verify the document hasn't been tampered with since send.
4. **Post-sign:** Proposal status → `signed`, content becomes immutable (API rejects `PUT` on signed proposals). Auto-generate invoice.

**Disclaimer in footer of every signed document:** *"This document was signed electronically. Electronic signatures are legally binding under the ESIGN Act (US) and eIDAS Regulation (EU). This signature does not carry certification authority chain validation."*

### 7.2 PDF Generation: Puppeteer (In-Process, Pooled)

| Option | Cost | Pros | Cons |
|---|---|---|---|
| **Puppeteer (headless Chrome)** ✅ | $0 (+ ~200MB RAM for browser instance) | Pixel-perfect rendering of our exact HTML/CSS, full control over page breaks, header/footer injection | Heavy on RAM, slower than library-based approaches (~2–4s per PDF) |
| **wkhtmltopdf** | $0 | Lighter than Puppeteer | Uses an ancient QtWebKit engine — our CSS variables, `calc()`, and custom fonts will render incorrectly |
| **PDFKit / jsPDF** | $0 | Lightweight, fast | Cannot render HTML/CSS at all — would require manually rebuilding every page in a programmatic drawing API |
| **DocRaptor API** | $15/mo for 125 docs | Good HTML/CSS rendering (uses Prince XML) | Per-document cost, external dependency, self-hosted constraint |

**Decision: Puppeteer, in-process with browser pooling.**

**Implementation:**
1. Launch a single Chromium instance on app startup via `puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })`.
2. Maintain a pool of 2 browser pages (tabs). When a PDF is requested, acquire a page from the pool.
3. Navigate the page to an internal URL: `http://localhost:${PORT}/internal/render/${proposalId}` — a Next.js route that renders the proposal in "print mode" (strips toolbar, settings panel, all editor controls — same as the existing `@media print` CSS).
4. Call `page.pdf({ format: 'A4', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } })`.
5. Store the resulting PDF buffer in MinIO at `tenants/{tenantId}/pdfs/{proposalId}-{hash}.pdf`.
6. Return a signed URL (1h expiry) or stream the file directly.

**Performance target:** < 5s per PDF. Cached — subsequent requests for the same `version_hash` return the stored PDF without re-rendering.

### 7.3 Stripe Integration

**Scope:** Invoice payments only (V1). Subscription billing for Pro/Team tiers (V1.1+).

**V1 flow — Invoice payments:**
1. User clicks "Generate Payment Link" on an invoice.
2. Backend creates a Stripe Checkout Session: `mode: 'payment'`, `line_items: [{ price_data: { currency, unit_amount: invoice.total * 100, product_data: { name: 'Invoice #INV-001' } }, quantity: 1 }]`, `success_url`, `cancel_url`, `metadata: { invoiceId, tenantId }`.
3. Store `stripe_checkout_url` and `stripe_payment_intent_id` on the invoice record.
4. Client views the invoice in the portal, clicks "Pay Now", is redirected to Stripe Checkout.
5. On `checkout.session.completed` webhook: look up `invoiceId` from metadata, set `status: 'paid'`, `paid_at: now()`, `amount_paid: session.amount_total / 100`. Log `invoice.paid` event.

**V1.1 flow — Subscription billing:**
1. On signup (magic link or OAuth), create a Stripe Customer.
2. When user selects Pro tier, create a Stripe Checkout Session with `mode: 'subscription'`.
3. Handle `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted` webhooks to sync plan status.

**Stripe environment:**
- Test mode for development and staging.
- Webhook endpoint: `/api/webhooks/stripe` — verified via `stripe.webhooks.constructEvent()` with the webhook signing secret.

### 7.4 Email (Resend)

**Why Resend over SendGrid:** Simpler API (single `resend.emails.send()` call), better React Email integration for templated emails, generous free tier (100/day = ~3,000/month — sufficient for V1 scale), and it's the go-to for Next.js projects.

**Email types (V1):**
1. **Magic link login** — `from: noreply@proposalstudio.io`, contains a one-time link.
2. **Proposal sent** — `from: {userName}@proposalstudio.io` (or noreply), contains the portal link.
3. **Proposal viewed** — notification to the sender.
4. **Proposal signed** — notification to the sender with signature details.
5. **Invoice payment received** — notification to the sender.

**V1.1:** Payment reminder emails (7/14/30 day overdue), scheduled via a cron job or BullMQ delayed job.

### 7.5 AI Draft Generation (OpenAI)

**Model:** `gpt-4o-mini` — best cost/quality for structured text. ~$0.003 per draft at ~2,000 output tokens.

**Prompt design:** System prompt instructs the model to output a JSON object matching the `gatherData()` schema. User prompt is the brief (e.g., "Shopify store migration, 50 products, custom theme, $3,000 budget"). The model generates:
- `scopeRows[]` with realistic service names, descriptions, and pricing
- `welcomeRows[]` with intro text
- `invoiceRows[]` mirroring scope items
- Boilerplate `agreement` text

**Validation:** The backend validates the AI output against a Zod schema before returning it to the client. If the AI output is malformed, return a 422 with a "generation failed" message.

---

## 8. Webhook Architecture (Outbound — CRM Sync)

### When It Fires

Whenever an event is logged in the `events` table, the application checks if the tenant has any active `webhook_subscriptions` matching that `event_type`. If so, it enqueues a webhook delivery job.

### Delivery Mechanism

```
Event logged → Check webhook_subscriptions → Enqueue BullMQ job → Worker POSTs to URL
```

**Payload format:**
```json
{
  "event": "proposal.signed",
  "timestamp": "2026-07-15T14:32:00Z",
  "data": {
    "proposalId": "uuid",
    "proposalTitle": "Web Design Proposal",
    "clientName": "Acme Corp",
    "clientEmail": "client@acme.com",
    "signerName": "John Doe",
    "signedAt": "2026-07-15T14:32:00Z"
  }
}
```

**Security:** Each delivery includes an `X-PS-Signature` header: `HMAC-SHA256(payload, webhookSecret)`. The recipient can verify the signature to ensure authenticity.

**Retry policy:** 3 attempts with exponential backoff (10s, 60s, 300s). After 3 failures, mark the subscription as `active: false` and notify the user via email.

**V1 note:** The `webhook_subscriptions` table and delivery infrastructure are built in V1 but not exposed via the API or UI. They are used internally for the Stripe webhook handler. External webhook management is a V2 feature.

---

## 9. File Storage

### Strategy: MinIO (Self-Hosted S3-Compatible)

For a single-VPS deployment, MinIO runs as a container alongside the app. It exposes an S3-compatible API, so the application code uses the `@aws-sdk/client-s3` package — the exact same code works against real AWS S3 if the deployment target changes.

**Bucket structure:**
```
proposal-studio/
├── tenants/
│   └── {tenant_id}/
│       ├── assets/          # logos, QR codes, inline images
│       │   └── {uuid}.{ext}
│       ├── signatures/      # signature PNGs
│       │   └── {signature_id}.png
│       └── pdfs/            # generated PDFs
│           └── {proposal_id}-{hash}.pdf
```

**Access control:**
- All objects are **private by default** — no public bucket policy.
- Access is via **pre-signed URLs** generated server-side with a configurable expiry.
  - Assets (logos, QR codes): 1-hour expiry, regenerated on each proposal load.
  - PDFs: 1-hour expiry, regenerated on download click.
  - Signatures: 24-hour expiry, only accessible by the tenant owner.

**Upgrade path:** To move to AWS S3, change the endpoint URL, access key, and secret key in the environment variables. Zero code changes.

**Disk budget:** MinIO data stored on a mounted volume (`/data/minio`). Budget ~10GB initially. At ~2MB per proposal (content + assets + PDF), that's ~5,000 proposals before needing to expand.

---

## 10. Security

### 10.1 Authentication & Authorization

| Concern | Implementation |
|---|---|
| **Password-less auth** | Magic link (email) or Google OAuth. No passwords stored — eliminates credential stuffing risk. |
| **JWT validation** | Access tokens verified on every API request via middleware. Checks `exp`, `iss`, `tenantId`. |
| **Tenant isolation** | Every DB query includes `WHERE tenant_id = $currentTenantId`. Prisma middleware auto-injects this. RLS policies as defense-in-depth. |
| **Role-based access (V2)** | `role` field on `users` table. Middleware checks `role` against a permission matrix per endpoint. V1: all users are `owner`. |

### 10.2 Client Portal Security

| Concern | Implementation |
|---|---|
| **Slug unpredictability** | Slugs are `nanoid(12)` — URL-safe, 12 characters, ~71 bits of entropy. Not sequential, not guessable. |
| **Optional password** | Portal password is bcrypt-hashed and stored on the proposal. Checked server-side before returning content. |
| **Link expiry** | `expires_at` checked on every portal request. Returns `410 Gone` after expiry. |
| **Rate limiting** | Portal routes: 20 req/min per IP via Redis-backed sliding window. Prevents scraping/brute-force. |
| **Content sanitization** | `contenteditable` HTML is sanitized with DOMPurify before storage (blocks `<script>`, `onerror`, etc.). Portal renders sanitized content only. |

### 10.3 Signed URL Expiry Matrix

| Resource | Expiry | Regeneration Trigger |
|---|---|---|
| **Asset URLs (logos, QR)** in editor | 1 hour | On each proposal load (`GET /api/proposals/:id`) |
| **Asset URLs** in client portal | 1 hour | On each portal load (`GET /api/portal/:slug`) |
| **PDF download** | 1 hour | On each download click (`GET /api/invoices/:id/pdf`) |
| **Signature image** (owner view) | 24 hours | On signature detail view |

### 10.4 Signature Integrity

1. When a proposal is sent (`/send`), compute `version_hash = SHA-256(JSON.stringify(content))` and store it.
2. When a client signs (`/sign`), compute the hash again from the live `content` and compare it against `version_hash`. If they don't match (the sender edited the proposal after sending — should be blocked by status, but defense-in-depth), reject the signature.
3. The `document_hash` stored on the signature record = the `version_hash` at sign-time. This is the tamper-evident seal.
4. After signing, `PUT /api/proposals/:id` is rejected with `409 Conflict` if `status === 'signed'`.

### 10.5 Input Validation & Sanitization

| Input | Validation |
|---|---|
| **All request bodies** | Validated against Zod schemas. Unknown fields stripped. |
| **`content` JSONB** | Validated structure (must have `_version`, `settings`, `pages`, etc.). Individual HTML fields sanitized with DOMPurify. |
| **File uploads** | MIME type checked against allowlist (`image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`). Max size: 5MB. SVG sanitized to strip embedded scripts. |
| **SQL** | All queries via Prisma (parameterized). No raw SQL interpolation. |
| **Portal slug** | Alphanumeric + hyphens only, validated via regex. |

### 10.6 Infrastructure Security

| Concern | Implementation |
|---|---|
| **TLS** | Caddy or Nginx reverse proxy with auto-provisioned Let's Encrypt certificates. |
| **HSTS** | `Strict-Transport-Security: max-age=31536000; includeSubDomains` |
| **CORS** | Allowlist: `app.proposalstudio.io` only. Portal routes allow `*` origin (public). |
| **CSP** | `Content-Security-Policy` header blocks inline scripts on portal pages. |
| **Secrets management** | All secrets (DB password, JWT secret, Stripe keys, Resend API key) in `.env` file, never committed. Docker secrets for production. |
| **DB backups** | Automated daily `pg_dump` to a separate volume. 30-day retention. Cron job on the VPS. |

---

## 11. Deployment

### 11.1 Docker Compose (Production)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://ps:${DB_PASSWORD}@db:5432/proposal_studio
      - REDIS_URL=redis://redis:6379
      - S3_ENDPOINT=http://minio:9000
      - S3_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - S3_SECRET_KEY=${MINIO_SECRET_KEY}
      - S3_BUCKET=proposal-studio
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - RESEND_API_KEY=${RESEND_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - APP_URL=https://app.proposalstudio.io
    depends_on:
      - db
      - redis
      - minio
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=proposal_studio
      - POSTGRES_USER=ps
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data
    restart: unless-stopped

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    volumes:
      - miniodata:/data
    environment:
      - MINIO_ROOT_USER=${MINIO_ACCESS_KEY}
      - MINIO_ROOT_PASSWORD=${MINIO_SECRET_KEY}
    restart: unless-stopped

  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddydata:/data
    restart: unless-stopped

volumes:
  pgdata:
  redisdata:
  miniodata:
  caddydata:
```

### 11.2 VPS Sizing

| Phase | VPS Spec | Monthly Cost | Handles |
|---|---|---|---|
| **Alpha / Beta** | 2 vCPU, 4GB RAM, 80GB SSD (Hetzner CX22) | ~$7/mo | < 50 users, < 10 concurrent |
| **V1 Launch** | 4 vCPU, 8GB RAM, 160GB SSD (Hetzner CX32) | ~$14/mo | < 500 users, < 50 concurrent |
| **Scale trigger** | When avg CPU > 70% sustained or PDF queue > 10s | Upgrade VPS or split PDF worker | |

### 11.3 CI/CD

1. Push to `main` → GitHub Actions builds Docker image → pushes to GitHub Container Registry.
2. SSH into VPS → `docker compose pull && docker compose up -d` (or use Watchtower for auto-pull).
3. `prisma migrate deploy` runs as part of the app entrypoint script.

---

## 12. Phased Build Plan

### Phase 1 — Foundation (Weeks 1–3)

| Task | Description | Depends On |
|---|---|---|
| **Project scaffold** | Next.js 15 app with App Router, Prisma, Docker Compose (Postgres + Redis + MinIO). CI pipeline. | — |
| **Database schema** | All tables from §5.2. Run `prisma migrate dev`. Seed data for testing. | Scaffold |
| **Auth system** | Magic link login via Resend + Google OAuth via NextAuth.js. JWT middleware. Tenant auto-creation on first login. | Schema, Resend account |
| **Editor integration** | Mount existing prototype in `/editor/[id]` page. Refactor `app.js` to export `init()` and `gatherData()`. Load proposal data from API on mount. | Scaffold |
| **Proposal CRUD API** | All `/api/proposals/*` endpoints. Auto-save (`PUT`) with debounce. | Schema, Auth |
| **Asset upload** | `/api/assets/upload` endpoint. MinIO integration. Replace base64 images in editor with signed URLs. | MinIO container |

**Milestone:** Authenticated user can log in, create a proposal in the editor, save it to the database, reload it, and upload a logo.

### Phase 2 — Client Portal & Signatures (Weeks 4–5)

| Task | Description | Depends On |
|---|---|---|
| **Client CRUD API** | All `/api/clients/*` endpoints. | Phase 1 |
| **Portal renderer** | SSR page at `/portal/[slug]`. Renders proposal in read-only mode (strip `contenteditable`, toolbar, settings panel). Design settings applied via CSS variables. | Phase 1 |
| **View tracking** | `POST /api/portal/:slug/view`. Log events. Deduplicate per IP/24h. | Portal |
| **Proposal send flow** | `POST /api/proposals/:id/send`. Generate slug, compute version hash, set status, optionally send email via Resend. | Portal, Resend |
| **E-signature capture** | Canvas signature pad on the Agreement page in the portal. Type-to-sign alternative. Submit to `POST /api/portal/:slug/sign`. Signature image stored in MinIO. Post-sign: lock proposal, log event. | Portal, MinIO |

**Milestone:** User can send a proposal link to a client. Client opens the link, views the proposal, signs it. Sender sees "Signed" status on dashboard.

### Phase 3 — Invoicing & PDF (Weeks 6–7)

| Task | Description | Depends On |
|---|---|---|
| **Invoice auto-generation** | On signature, create invoice from proposal's scope/service rows, currency, tax, payment methods. Auto-increment invoice number. | Phase 2 |
| **Invoice CRUD API** | All `/api/invoices/*` endpoints. Manual status updates. | Schema |
| **PDF generation** | Puppeteer integration. Internal render route. Browser pool (2 pages). PDF caching in MinIO. `GET /api/invoices/:id/pdf` and `GET /api/proposals/:id/pdf`. | Puppeteer, MinIO |
| **Stripe Checkout** | `POST /api/invoices/:id/pay` creates Checkout Session. Inbound webhook handler at `/api/webhooks/stripe` updates invoice status on payment. | Stripe account |
| **Dashboard** | React dashboard page at `/dashboard`. Proposals by status, invoices by status, total revenue, recent activity feed. All from `/api/dashboard`. | All APIs |

**Milestone:** Complete V1 flow — create proposal → send → client signs → invoice auto-generated → client pays via Stripe → status updates to "Paid" → visible on dashboard.

### Phase 4 — Polish & Launch Prep (Week 8)

| Task | Description | Depends On |
|---|---|---|
| **Template system** | Save proposal as template, create proposal from template. | Phase 1 |
| **Email notifications** | Proposal viewed, proposal signed, invoice paid — notification emails to the sender. | Resend, Phase 2–3 |
| **Error handling** | Global error boundary (React), API error responses (standardized format), toast notifications. | All |
| **Rate limiting** | Redis-backed sliding window. Auth routes: 10/min. Portal routes: 20/min. API routes: 100/min. | Redis |
| **Security hardening** | CSP headers, CORS, input sanitization audit, signed URL expiry verification, DOMPurify pass on all stored HTML. | All |
| **Deployment** | Docker Compose on Hetzner VPS. Caddy reverse proxy with Let's Encrypt. Automated DB backups. | All |
| **README & docs** | Developer setup guide, environment variable reference, deployment instructions. | All |

**Milestone: V1 launch-ready.** Internal dogfooding begins.

### Phase 5 — V1.1 Enhancements (Weeks 9–12)

- AI draft generation (OpenAI integration)
- Link expiry and password protection
- Payment reminder emails (BullMQ scheduled jobs)
- Design preset library (5–8 curated presets)
- Version history UI (restore to previous version)
- Per-client brand settings (auto-apply on new proposal)

### Phase 6 — V2 Multi-User (Weeks 13–20)

- Team invitations (email-based) with role assignment
- Role-based access control middleware (owner / manager / member)
- Shared template library (`is_shared` flag)
- Team activity log (all events visible to owner/manager)
- Approval workflow (member → manager review → send)
- Outbound webhook management UI
- White-label portal (custom domain via Caddy wildcard + tenant DNS verification)
- Team analytics dashboard

---

## 13. Open Decisions (Needs Input Before Coding Starts)

| # | Decision | Options | Recommendation | Impact If Deferred |
|---|---|---|---|---|
| 1 | **Domain & DNS** | `proposalstudio.io`, `proposalstudio.app`, or something else? | Secure a domain before email setup (Resend requires DNS verification). | Blocks email sending, portal URLs. |
| 2 | **VPS provider** | Hetzner (cheapest), DigitalOcean (more familiar), Railway (managed but pricier) | Hetzner CX22 at $7/mo. Best price/performance for Europe. If US latency matters, DigitalOcean NYC. | Can migrate later — Docker makes this portable. |
| 3 | **MinIO vs local disk** | MinIO container vs. saving files to a mounted volume and serving via Caddy | MinIO — signed URLs and S3-compatible API are worth the extra container. | Local disk works for V1 but requires custom signed URL logic and breaks S3 upgrade path. |
| 4 | **Editor isolation** | iframe vs. DOM container with scoped styles | iframe is safer (full CSS isolation) but complicates communication. DOM container is simpler but risks style leaks between Next.js and editor CSS. | Start with DOM container + CSS scoping (`.editor-root` prefix). Migrate to iframe only if style conflicts arise. |
| 5 | **Mobile editor** | Support editing on mobile in V1, or desktop-only? | Desktop-only for V1. The `contenteditable` + drag-and-drop UX doesn't translate well to mobile. Client portal should be mobile-responsive (read-only). | No impact — can add responsive editor CSS later without backend changes. |
