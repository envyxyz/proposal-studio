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

## Author

Built by [ameer<3](https://github.com/envyxyz)

[![GitHub](https://img.shields.io/badge/GitHub-envyxyz-1d1b20?style=flat-square&logo=github)](https://github.com/envyxyz)

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

If Proposal Studio saves you time, consider leaving a star.

[![Star](https://img.shields.io/github/stars/envyxyz/proposal-studio?style=social)](https://github.com/envyxyz/proposal-studio/stargazers)

</div>
