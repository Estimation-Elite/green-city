# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo of real estate project landing pages for GreenCity Immobilier / MonMeilleurBien. Each app is a standalone Next.js site for a specific residential program. Content is in French.

## Commands

```bash
pnpm dev                              # Run all apps in dev mode
pnpm build                            # Build all apps (via Turbo)
pnpm lint                             # Lint all packages
pnpm typecheck                        # Type-check all packages

# Target a single app
pnpm --filter @repo/home-spirit-2 dev
pnpm --filter @repo/home-spirit-2 build

# Inside an app directory
next dev / next build / tsc --noEmit / eslint
```

No test framework is configured.

## Architecture

**Monorepo**: Turbo + pnpm workspaces (`apps/*`, `packages/*`)

### Apps (`apps/`)

Each app (`home-spirit-2`, `l-archipel`, `park-view`, `revelation`) is a Next.js 16 site using the App Router. They share an identical structure:

- `src/app/page.tsx` - Composes the landing page from section components
- `src/app/layout.tsx` - Root layout with GTM, Toaster, metadata
- `src/app/api/lead/` and `src/app/api/rdv/` - Lead capture and visit booking endpoints
- `src/components/sections/` - App-specific sections wrapping shared UI components
- `src/components/layout/` - App-specific Header/Footer (wrapping shared ones)
- `src/data/<project-name>.ts` - All content, copy, images, and config for the project
- `src/app/globals.css` - Per-app color theme via CSS variables (`--color-primary`, `--color-accent`, etc.)
- `middleware.ts` - GTM preview mode
- `Dockerfile` - Multi-stage Docker build (node:20-alpine, standalone output)

### Packages (`packages/`)

- **`@repo/ui`** - Shared UI components: primitives (Button, Input, Carousel), layout (Header, Footer), and landing page sections (Hero, ContactForm, PhotoGallery, LeadModal, VisitWizard, etc.). Uses Radix UI, Embla Carousel, Framer Motion, Lucide icons.
- **`@repo/core`** - Business logic: API route handlers (`leadHandler`, `rdvHandler`) with GreenCity ERP API integration, analytics (GTM, event tracking). Uses modular sub-path exports (`@repo/core/api-routes`, `@repo/core/analytics/GTM`, etc.).
- **`@repo/utils`** - `cn()` utility (clsx + tailwind-merge)
- **`@repo/config-eslint`** - Shared ESLint config (neostandard)
- **`@repo/config-typescript`** - Shared tsconfig

### Key Patterns

- **Data-driven content**: Each app defines all its content in `src/data/<project-name>.ts` (text, images, nav links, config). Section components import from this file.
- **Theming**: Each app has its own color scheme defined as CSS custom properties in `globals.css`, consumed by Tailwind utilities.
- **API integration**: Lead/RDV form submissions are sent to the GreenCity ERP API via `GREENCITY_API_URL`, `GREENCITY_API_KEY`, and `GREENCITY_API_SECRET` env vars.
- **Phone verification (OTP)**: Same timing as mon-meilleur-bien — verification **gates** lead creation. Submitting a form triggers `/api/send-otp` (strict `libphonenumber-js/max` validation: FR mobiles only); the lead/RDV is only POSTed once `/api/verify-otp` validates the 6-digit code (`usePhoneOtp`'s `onVerified` callback runs the form's `submitLead`). A prospect who never validates the code is never sent to GreenCity/Brevo. On success, verify-otp records the phone in an in-memory **verified registry** (globalThis, 15 min TTL); `leadHandler`/`rdvHandler` read it to stamp the lead server-side: "Téléphone vérifié par SMS." appended to the GreenCity `comment` (the ERP is create-only, no dedicated field) and `TELEPHONE_VERIFIE: true` on the Brevo contact. A registry miss (UI bypassed) still creates the lead, unstamped, with a `lead.phone_unverified` warn log. `phone.ts` (`normalizePhoneE164`) stays loose in the handlers as a payload safety net. Test number `+33612345678` bypasses Twilio in every environment (any 6-digit code accepted, registry included) — it is the way to walk the full flow locally; real numbers always go through Twilio.
- **New project creation**: Copy an existing app, update `package.json` name, Dockerfile filter, data file, and `globals.css` colors.

## Tech Stack

- Next.js 16 (App Router, React Server Components, React Compiler enabled)
- React 19, TypeScript 5, Tailwind CSS 4
- Standalone output mode for Docker deployment
- `transpilePackages: ["@repo/utils", "@repo/ui", "@repo/core"]` in each app's `next.config.ts`

## Environment Variables

- `GTM_ID` - Google Tag Manager container ID
- `GREENCITY_API_URL` - GreenCity ERP API base URL (defaults to `https://greencity.erp.iwit.pro`)
- `GREENCITY_API_KEY` - GreenCity API key
- `GREENCITY_API_SECRET` - GreenCity API secret
- `GREENCITY_RESIDENCE_NAME` - Residence name used to resolve the GreenCity residence id (overrides the handler's `defaultResidenceName`)
- `BREVO_API_KEY` - Brevo API key (contact upserts, transactional emails, verified-phone flag)
- `BREVO_ALL_LEADS_LIST_ID` - Brevo "Tous leads" registry list id
- `BREVO_NURTURING_LIST_ID` - Brevo nurturing list id (COLD leads)
- `BREVO_TEMPLATE_ID_LEAD_ACKNOWLEDGMENT` - Brevo template id for the brochure acknowledgment email
- `BREVO_TEMPLATE_ID_RDV_CONFIRMATION` - Brevo template id for the RDV confirmation email
- `TWILIO_ACCOUNT_SID` - Twilio account SID (phone verification)
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_VERIFY_SERVICE_SID` - Twilio Verify service SID. Use a **dedicated GreenCity service** (its friendly name appears in the SMS text — sharing MonMeilleurBien's service would brand the SMS wrong); one service is shared across the 4 apps.
