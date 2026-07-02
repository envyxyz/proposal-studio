# Proposal Studio

**Proposal Studio** is a professional, self-hosted B2B SaaS application designed for freelancers, agency owners, and service providers (e.g., Shopify & e-commerce developers) to design, customize, e-sign, and invoice client proposals all in one place.

This project transitions a single-file interactive prototype into a clean, modern, multi-tenant ready **Next.js** application. It features a fully sandboxed design customization editor, real-time client page compilation, support for offline backup imports/exports, dynamic invoice calculations, and local headless PDF printing.

---

## Key Features

*   **Multi-Page Interactive Builder:** Compile full multi-page proposals including cover pages, project scope, timelines, invoice sheets, and e-signature modules.
*   **Sandboxed Design System:** Customize layout styles (typography scales, heading fonts, title styling, background color, accent colors, and line borders) completely scoped to the document canvas. The app shell (toolbar, settings panel, menus) remains clean, unaffected, and optimized.
*   **Invoice Theming & Currency Settings:** Change invoice currency symbols dynamically and update all sub-totals instantly. Customize bank details, logos, and add or remove payment methods with QR code integration.
*   **JSON Portability:** Easily import or export the entire proposal payload to local files for backup or template sharing.
*   **Multi-Tenancy Foundation:** Pre-configured with a Prisma ORM schema ready for multi-user, tenant-isolated operations from day one.
*   **Headless PDF Printing:** Pre-tested headless Puppeteer script for automated high-fidelity server-side PDF generation.

---

## Technology Stack

*   **Frontend:** Next.js 16 (App Router) / React 19 / Tailwind CSS v4
*   **Database & ORM:** PostgreSQL / Redis / Prisma ORM
*   **Infrastructure:** Docker Compose
*   **PDF Compiler:** Node.js / Puppeteer

---

## Local Development Setup

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [Docker & Docker Compose](https://www.docker.com/)

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Launch Local Database & Cache Services

Spin up the local PostgreSQL database and Redis caching container:

```bash
docker compose up -d
```

### 3. Setup Database Schema (Prisma)

Apply migrations and synchronize database schemas:

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

The server will start running on **[http://localhost:3000](http://localhost:3000)**.
To access the live proposal editor prototype, navigate directly to **[http://localhost:3000/preview.html](http://localhost:3000/preview.html)**.

---

## 📦 Deploying to GitHub Pages (Static Export)

If you wish to host the Proposal Studio frontend prototype statically on **GitHub Pages**, configure Next.js for static export:

1. Open `next.config.ts` and set `output: 'export'`:
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: "export",
     images: {
       unoptimized: true, // Required for static export
     },
   };

   export default nextConfig;
   ```
2. Build the project:
   ```bash
   npm run build
   ```
   This compiles the application and outputs a static folder called `/out`.
3. Upload the contents of the `/out` directory directly to your GitHub repository's hosting branch (`gh-pages`), or use Vercel/Netlify for serverless hosting.
