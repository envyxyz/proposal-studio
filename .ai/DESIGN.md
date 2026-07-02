---
version: alpha
name: Studio Proposal System
description: A client-facing document system built for delivery inside a dark, cinematic desktop-mockup frame. Every deliverable — agreement, invoice, guide, report — is a single ivory paper card floating on a near-black wine-toned canvas, framed by bold uppercase condensor headlines and a black footer bar. The voice is print-studio minimal: no color, no icons, no decoration — just black ink on cream paper, numbered like a manual.

colors:
  primary: "#101010"
  primary-active: "#000000"
  on-primary: "#F5F1E6"
  secondary: "#2A0F16"
  ink: "#101010"
  ink-secondary: "#3A3630"
  ink-muted: "#6E685F"
  ink-faint: "#A39C90"
  canvas: "#150A0D"
  canvas-soft: "#1F1013"
  surface: "#F5F1E6"
  surface-card: "#F7F3E9"
  hairline: "#101010"
  hairline-dark: "#3A2A2E"
  accent-eyebrow: "#D8D2C4"

typography:
  display-lg:
    fontFamily: "Anton"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: "-1.5px"
  display-md:
    fontFamily: "Anton"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-1px"
  heading-1:
    fontFamily: "Anton"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-1px"
  heading-2:
    fontFamily: "Anton"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.5px"
  heading-3:
    fontFamily: "DM Sans"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.1px"
  title:
    fontFamily: "DM Sans"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0px"
  body-md:
    fontFamily: "DM Sans"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0px"
  body-sm:
    fontFamily: "DM Sans"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0px"
  button:
    fontFamily: "DM Sans"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.2px"
  caption:
    fontFamily: "DM Sans"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.2px"
  eyebrow:
    fontFamily: "DM Sans"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.4px"

rounded:
  xs: 2px
  sm: 4px
  md: 6px
  lg: 0px
  xl: 0px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xs}"
    padding: "{spacing.sm} {spacing.lg}"
    typography: "{typography.button}"
  button-primary-pressed:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xs}"
    padding: "{spacing.sm} {spacing.lg}"
    typography: "{typography.button}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.xs}"
    padding: "{spacing.sm} {spacing.lg}"
    typography: "{typography.button}"
  button-utility:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
    typography: "{typography.caption}"
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.on-primary}"
    borderBottom: "{colors.hairline-dark}"
    padding: "{spacing.sm} {spacing.lg}"
  footer:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    padding: "{spacing.sm} {spacing.lg}"
    typography: "{typography.caption}"
  section-eyebrow:
    description: "The numbered slide label (e.g. 02) sitting above every section headline."
    textColor: "{colors.accent-eyebrow}"
    typography: "{typography.eyebrow}"
    marginBottom: "{spacing.xxs}"
  section-header:
    description: "The bold condensed section title on the dark canvas."
    textColor: "{colors.on-primary}"
    typography: "{typography.display-md}"
    marginBottom: "{spacing.sm}"
  section-intro-block:
    description: "The dark filled caption strip beneath a section header, explaining the deliverable in plain language."
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    padding: "{spacing.sm} {spacing.md}"
    rounded: "{rounded.xs}"
  document-card:
    description: "The core surface. Every deliverable renders as a single ivory paper card floating over the dark canvas."
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    padding: "{spacing.xl}"
    rounded: "{rounded.xs}"
    shadow: "elevated"
  document-title:
    description: "The oversized black headline at the top of a document card (INVOICE, CLIENT AGREEMENT, WEBSITE GUIDE)."
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
  document-footer-bar:
    description: "The full-width black bar closing out every document card."
    backgroundColor: "{colors.primary}"
    height: "{spacing.md}"
  data-table:
    description: "The line-item / metric table used in invoices and monthly reports."
    headerBackground: "{colors.primary}"
    headerTextColor: "{colors.on-primary}"
    headerTypography: "{typography.eyebrow}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.xs} {spacing.sm}"
    rowBorder: "{colors.hairline}"
  data-table-total-row:
    description: "The summed total row inside the invoice table, set on a black band."
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.title}"
  qr-block:
    description: "The square QR payment code paired with bank/PayPal detail lines."
    borderColor: "{colors.hairline}"
    size: "{spacing.xxl}"
    padding: "{spacing.xxs}"
  badge-pill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: "{spacing.xxs} {spacing.sm}"
    typography: "{typography.caption}"
  metric-stat-block:
    description: "The large numeral + label pairing used in the Monthly Report (17 334, 4.30MIN, 5.3%)."
    textColor: "{colors.ink}"
    numeralTypography: "{typography.heading-1}"
    labelTypography: "{typography.eyebrow}"
  feature-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.xs}"
    padding: "{spacing.lg}"
  ex-pricing-tier:
    description: "Default pricing tier card."
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  ex-pricing-tier-featured:
    description: "Featured/highlighted tier — polarity-flipped."
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  ex-product-selector:
    description: "What's Included summary card."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  ex-cart-drawer:
    description: "Order/subscription summary drawer."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    item-divider: "{colors.hairline}"
  ex-app-shell-row:
    description: "Sidebar nav row. Active state uses brand primary."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm} {spacing.md}"
  ex-data-table-cell:
    description: "Data table th + td. Header uses eyebrow typography."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.eyebrow}"
    bodyTypography: "{typography.body-sm}"
    cellPadding: "{spacing.sm} {spacing.md}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card with text-input primitives."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  ex-modal-card:
    description: "Modal dialog surface with elevated shadow."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  ex-empty-state-card:
    description: "Empty-state illustration frame."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xxl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification — feature-card shape + medium shadow."
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.sm} {spacing.md}"
    typography: "{typography.body-sm}"
---

## Overview

The canvas is a near-black wine gradient ({colors.canvas} into {colors.canvas-soft}), a dim studio-desk backdrop that never competes for attention. Every deliverable sits on top of it as one isolated ivory rectangle ({colors.surface-card}), lit like a printed page laid on a dark desk. There is no gradient, no icon set, no color accenting inside the document itself — the only two values that ever touch paper are {colors.ink} and {colors.surface-card}.

Typographic voice runs on a hard contrast: oversized condensed uppercase display type ({typography.display-lg}, {typography.display-md}) for section titles and document mastheads, dropped against small, quiet {typography.body-sm} and {typography.eyebrow} copy for everything explanatory. Nothing in the middle of that scale is used — headlines shout, body text is administrative and small, and there is no mid-weight heading doing filler work.

The primary accent is {colors.primary} itself — pure near-black — used not as a "color" but as a structural device: the intro caption strip under each section header, the invoice total row, the table header band, the closing footer bar on every document. It appears constantly but always as a solid block, never as a tint or a gradient.

**Key Characteristics:**
- Every deliverable is a single card on {colors.surface-card}, never a multi-panel layout
- Section titles use {typography.display-md} in all-caps, always preceded by a numbered {typography.eyebrow} label
- Body and paragraph copy stays at {typography.body-sm} to {typography.body-md} — never larger
- Structural black bands ({colors.primary}) carry table headers, totals, and footers
- Border radius across the entire system is near-zero ({rounded.xs}) — this is a print-inspired system, not a rounded app UI
- Numeric data (traffic, revenue, session stats) is rendered as bare large numerals with an {typography.eyebrow} label underneath, no charts or icons
- The dark {colors.canvas} frame is fixed across every document, giving the deck a consistent "studio delivery" wrapper

## Colors

### Brand & Accent
- **primary** `{colors.primary}` `#101010` — the single structural accent. Used for intro caption strips, table headers, total rows, footer bars, badges.
- **primary-active** `{colors.primary-active}` `#000000` — pressed/active state, pure black.
- **secondary** `{colors.secondary}` `#2A0F16` — the warm wine undertone blended into the dark canvas gradient.
- **on-primary** `{colors.on-primary}` `#F5F1E6` — ivory text set on any black band.

### Surface
- **canvas** `{colors.canvas}` `#150A0D` — the outer dark background every document card floats on.
- **canvas-soft** `{colors.canvas-soft}` `#1F1013` — secondary dark tone for gradient falloff and sidebar rows.
- **surface** `{colors.surface}` `#F5F1E6` — general ivory surface for cards outside the document mock.
- **surface-card** `{colors.surface-card}` `#F7F3E9` — the paper tone of the deliverable document itself.
- **hairline** `{colors.hairline}` `#101010` — thin dividing rules inside a document card (table rows, section splits).
- **hairline-dark** `{colors.hairline-dark}` `#3A2A2E` — dividers used on the dark canvas (nav-bar underline).

### Text
- **ink** `{colors.ink}` `#101010` — primary text, used for all document copy and headlines on paper.
- **ink-secondary** `{colors.ink-secondary}` `#3A3630` — secondary body copy inside a document.
- **ink-muted** `{colors.ink-muted}` `#6E685F` — supporting labels, table sub-notes.
- **ink-faint** `{colors.ink-faint}` `#A39C90` — placeholder and disabled text.
- **accent-eyebrow** `{colors.accent-eyebrow}` `#D8D2C4` — the muted warm tone used for the numbered eyebrow label on the dark canvas.

### Semantic
This system has no explicit error/success/warning palette in the source material. If status colors are required, introduce them as a separate accent group rather than repurposing {colors.primary}.

## Typography

### Font Family
Display: **Anton**, fallback `Impact, "Arial Narrow Bold", sans-serif` — a heavy, tightly-tracked condensed sans used exclusively for section titles and document mastheads (INVOICE, CLIENT AGREEMENT, WEBSITE GUIDE, MONTHLY REPORT).
Body: **DM Sans**, fallback `-apple-system, "Segoe UI", sans-serif` — used for every line of running copy, table content, and labels.

### Hierarchy
| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| display-lg | 64px | 400 | 1.0 | -1.5px | Document masthead (INVOICE, AGREEMENT) |
| display-md | 40px | 400 | 1.02 | -1px | Section title on dark canvas (02 INVOICE & PAYMENT) |
| heading-1 | 32px | 400 | 1.05 | -1px | Large stat numerals (17 334) |
| heading-2 | 24px | 400 | 1.1 | -0.5px | Sub-document headers |
| heading-3 | 16px | 700 | 1.2 | -0.1px | Table section labels (TRAFIC INSIGHT) |
| title | 14px | 700 | 1.3 | 0px | Total row label, bold inline emphasis |
| body-md | 14px | 400 | 1.55 | 0px | Paragraph copy, guide text |
| body-sm | 12px | 400 | 1.5 | 0px | Table cell content, fine print |
| button | 13px | 700 | 1.0 | 0.2px | CTA labels |
| caption | 10px | 500 | 1.4 | 0.2px | Footer bar text, micro-labels |
| eyebrow | 11px | 700 | 1.0 | 0.4px | Numbered section label, table headers |

### Principles
Display type is always uppercase, always condensed, and never paired with a subhead of similar weight — the jump from {typography.display-md} straight to {typography.body-md} is intentional and should not be softened with an intermediate heading. Table and stat labels always run in {typography.eyebrow}, uppercase, small, and slightly tracked out, functioning as captions rather than headings.

### Note on Font Substitutes
Anton is open-source (Google Fonts) and safe to ship directly. If a licensed alternative is preferred, Archivo Black or Bebas Neue are the closest structural matches for the same condensed, high-impact masthead role.

## Layout

### Spacing System
- xxs: 4px — icon-to-label gaps, tight table padding
- xs: 8px — inline gaps, badge padding
- sm: 12px — table cell padding, button vertical padding
- md: 16px — card internal rhythm, nav padding
- lg: 24px — section gaps, document card padding baseline
- xl: 32px — document card outer padding
- xxl: 48px — canvas breathing room around the floating document card

### Grid & Container
The document card is a fixed-width single column (portrait, letter-like proportions) centered on the dark canvas — there is no multi-column grid inside the deliverable itself. Max card width sits around 640px on desktop, scaling down proportionally on narrower viewports while keeping the same aspect ratio.

### Whitespace Philosophy
Space is used to isolate, not to organize — the dark canvas exists almost entirely to give the ivory card room to breathe. Inside the card, sections are separated by hard black rules ({colors.hairline}) rather than by generous vertical whitespace, keeping the document feel dense and administrative rather than airy.

### Responsive Strategy
| Name | Width | Key Changes |
|---|---|---|
| Mobile | <480px | Document card fills ~92% of viewport width; display-lg drops to display-md scale |
| Tablet | 480–768px | Card width fixes at ~420px; table columns retain full layout |
| Desktop | 768–1200px | Card centers at ~640px max-width with full canvas margin |
| Wide | >1200px | Canvas margin increases; card width stays capped, never stretches |

**Touch Targets:** All buttons and pills maintain a minimum 44px tap height regardless of visual padding compression at small sizes.

**Collapsing Strategy:** Data tables (invoice, monthly report) collapse three-column layouts into stacked label/value pairs below 480px rather than allowing horizontal scroll.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | {colors.hairline} 1px border only, no shadow | Table rows, inline dividers |
| Level 1 — Soft | Subtle multi-layer shadow at ~15% opacity black | The floating document-card against {colors.canvas} |
| Level 2 — Elevated | Deeper shadow, ~30% opacity, larger blur radius | Modal cards, any overlay surface above the document |

The document card should read as a physically placed sheet of paper on a dark desk, not as a UI panel — elevation exists to sell that physicality, not to signal interactivity.

## Shapes

### Border Radius Scale
| Token | Value | Use |
|---|---|---|
| xs | 2px | Buttons, badges, footer bars |
| sm | 4px | Nav rows, small utility surfaces |
| md | 6px | Utility buttons |
| lg | 0px | Document card corners (sharp, print-accurate) |
| xl | 0px | Large containers (kept sharp to match the paper aesthetic) |
| full | 9999px | Pill badges only |

### Photography Geometry
Any supporting imagery (the desk/laptop mockup backdrop) stays uncropped and full-bleed behind the document card, never framed in a rounded container — the sharpness of {rounded.lg} at 0px extends to photography as well, reinforcing the flat, printed-page feel.

## Components

**No hover states documented.**

### Navigation
**nav-bar** — a dark strip anchoring the top of the frame, {colors.canvas} background with {colors.hairline-dark} underline, text in {colors.on-primary} at {typography.caption}.

### Buttons
**button-primary** — solid {colors.primary} fill, {colors.on-primary} text, {rounded.xs} corners, {typography.button} label.
**button-primary-pressed** — darkens to {colors.primary-active} on press, same shape and type as button-primary.
**button-secondary** — transparent fill with {colors.hairline} border and {colors.ink} text, same {rounded.xs} shape.
**button-utility** — small {colors.canvas-soft} fill for secondary actions, {typography.caption} label.

### Cards & Containers
**document-card** — the central surface of the whole system: {colors.surface-card} background, {spacing.xl} padding, {rounded.xs} corners, Level 1 shadow against the canvas.
**document-title** — the masthead text inside a document-card, set in {typography.display-lg} and {colors.ink}.
**document-footer-bar** — a full-width {colors.primary} band of {spacing.md} height closing every document card.
**feature-card** — general-purpose ivory card outside the document mock, {colors.surface} background with {colors.hairline} border.

### Inputs & Forms
This system has no visible form inputs in the source material; if inputs are added, they should inherit {rounded.xs}, {colors.hairline} borders, and {typography.body-sm} for entered text to stay consistent with the document aesthetic.

### Signature Components
**section-eyebrow** — the numbered label (01, 02, 06, 08) preceding every section title, set in {typography.eyebrow} and {colors.accent-eyebrow}.
**section-header** — the bold {typography.display-md} section title on the dark canvas, always paired with a section-eyebrow above it.
**section-intro-block** — the solid {colors.primary} caption strip explaining the section in plain language, {typography.body-md} text in {colors.on-primary}.
**data-table** — the structured line-item table (invoice items, report metrics), header band in {colors.primary} with {typography.eyebrow} labels, body rows in {typography.body-sm} separated by {colors.hairline}.
**data-table-total-row** — the closing total row of an invoice table, rendered as a full {colors.primary} band with {typography.title} text.
**qr-block** — the square payment QR code framed by a thin {colors.hairline} border, paired with bank/PayPal detail lines in {typography.body-sm}.
**metric-stat-block** — the large bare numeral ({typography.heading-1}) with an {typography.eyebrow} label underneath, used for traffic and performance stats.
**badge-pill** — small {colors.primary} pill with {colors.on-primary} {typography.caption} text, {rounded.full}.

### Examples (illustrative)
**ex-pricing-tier** / **ex-pricing-tier-featured** — standard vs. polarity-flipped pricing card, following the same sharp-corner, high-contrast logic as the document-card.
**ex-product-selector** — a "what's included" summary card on {colors.surface}.
**ex-cart-drawer** — order summary drawer with {colors.hairline} item dividers.
**ex-app-shell-row** — sidebar nav row on {colors.canvas} with {colors.primary} active indicator.
**ex-data-table-cell** — generic table cell pairing {typography.eyebrow} headers with {typography.body-sm} bodies.
**ex-auth-form-card**, **ex-modal-card** — generic {colors.surface} overlay surfaces at {rounded.xl} for contexts outside the strict document system.
**ex-empty-state-card** — large-padding empty state on {colors.canvas-soft}.
**ex-toast** — small transient notification matching feature-card shape logic.

## Do's and Don'ts

**Do:**
- Keep every deliverable to a single {colors.surface-card} card — never split a document across multiple panels
- Always precede a section title with a {typography.eyebrow} numbered label
- Use {colors.primary} as a solid band for structure (headers, totals, footers) — never as a tint
- Keep border radius at {rounded.xs} or 0 throughout — this system reads as print, not app
- Render stats as bare {typography.heading-1} numerals with {typography.eyebrow} captions, no charts
- Reserve {typography.display-lg} exclusively for the document masthead, not for marketing headlines

**Don't:**
- Don't introduce a mid-weight heading between {typography.display-md} and {typography.body-md} — the jump is intentional
- Don't round document-card corners past {rounded.xs} — it breaks the printed-paper illusion
- Don't tint {colors.primary} to a gray or apply gradients to it — it must stay solid black
- Don't add icons or color-coded charts to metric-stat-block — the system is deliberately numeral-only
- Don't place more than one document-card per screen at full size — the dark canvas exists to isolate a single deliverable
- Don't use {colors.accent-eyebrow} for body copy — it is reserved for the numbered section label only