---
name: duplicate-app
description: Clone an existing app to create a new real estate project landing page
argument-hint: "<source-app> <new-app-name>"
---

# Duplicate an app to create a new project landing page

Clone an existing app to create a new one. The user provides the source app and the new app name via `$ARGUMENTS` (e.g. `roof-garden mon-projet`).

## Prerequisites

Before starting, confirm with the user:
1. The **source app** to clone — must be an existing app in `apps/` (recommended: `roof-garden` for data-driven apps)
2. The **new app name** — must be lowercase, kebab-case (e.g. `mon-projet`)
3. Ask if they have project info: project name, city, developer/promoter, apartment types, pricing, key features, photos/renders, brochure PDF

Parse `$ARGUMENTS` to extract both values. If only one value is provided, ask for the missing one.

## Step 1: Validate the source app

Check that `apps/<source-app>` exists. If not, list available apps and ask the user to pick one.

## Step 2: Copy the app directory

```bash
cp -r apps/<source-app> apps/<new-app>
```

## Step 3: Update package.json

In `apps/<new-app>/package.json`, change the `name` field:
```json
"name": "@repo/<new-app>"
```

## Step 4: Update the Dockerfile

If `apps/<new-app>/Dockerfile` exists, replace all occurrences of `<source-app>` with `<new-app>`:
- `pnpm --filter @repo/<new-app> build`
- `COPY --from=builder /app/apps/<new-app>/...`
- `CMD ["node", "apps/<new-app>/server.js"]`

If the source app did not have a Dockerfile, create one by copying `apps/roof-garden/Dockerfile` and replacing `roof-garden` with `<new-app>`.

## Step 5: Copy the .env

```bash
cp apps/<source-app>/.env apps/<new-app>/.env
```

If the source has no `.env`, create a minimal one:
```
GTM_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=
```

## Step 6: Rename the data file

If the source app has a data file at `src/data/<source-app>.ts`:

```bash
mv apps/<new-app>/src/data/<source-app>.ts apps/<new-app>/src/data/<new-app>.ts
```

Then update ALL import paths in `apps/<new-app>/src/` from `@/data/<source-app>` to `@/data/<new-app>`.

## Step 7: Install dependencies

Run from the repo root:
```bash
pnpm install
```

This regenerates the lockfile to include the new workspace package.

## Step 8: Verify the build

```bash
pnpm --filter @repo/<new-app> build
```

All pages must generate without errors. If the build fails, fix the issue before continuing.

## Step 9: Update the deploy skill

Add the new app to the deploy skill's mapping table in `.claude/skills/deploy-app/SKILL.md`:

| App        | Host           | Remote directory  |
| ---------- | -------------- | ----------------- |
| <new-app>  | 217.160.246.17 | /opt/<new-app>    |

No need to update `.server` — all apps share the same server.

## Step 10: Remind the user of remaining customization

After the clone + build is successful, remind the user they need to customize these files with the project's real content:

### Data file (main customization point)

`src/data/<new-app>.ts` — This single file contains ALL project content:
- `siteConfig` — projectName, city, developer
- `headerData` — logo, nav links, CTA
- `heroData` — background image, headline, subtitle, stats, countdown, CTAs
- `valuePropositionData` — section title, benefit items
- `equipmentData` — features list, CTA banner
- `testimonialsData` — reviews, stats
- `conversationsData` — sample conversations
- `virtualTourData` — categories, coming soon message
- `photoGalleryData` — photos with alt, tags, descriptions
- `proximityData` — nearby POIs with durations
- `projectOverviewData` — overview image, features, tabs
- `locationMapData` — map image, distance stats
- `connectivityData` — transport options, financing options
- `contactData` — phone, email, address, WhatsApp, pricing info, situation options
- `footerData` — project name, developer, logo, contact info, legal links

### Layout & metadata

- `src/app/layout.tsx` — title, description, OpenGraph metadata

### Colors (`src/app/globals.css`)

- `--color-brand-primary` — main project color
- `--color-brand-accent` — accent / CTA color
- `--color-brand-success` — success state
- `--color-brand-dark` — dark variant
- `--color-brand-light` — light variant
- `--color-brand-navy` — navy variant (optional)
- Component tokens: `--color-primary`, `--color-ring`, etc.

### Images (`public/images/`)

- Project renders/photos (hero, gallery, rooms, overview, map)
- Logo file (e.g. `greencity-logo.png` or project-specific logo)

### Documents (`public/documents/`)

- Brochure PDF if available

## Important notes

- The new app name must be valid for npm packages (lowercase, kebab-case).
- Do NOT modify the source app.
- If the user provides project info (brief, renders, etc.), proceed to customize the files listed in Step 10 right away.
- The recommended source app is `roof-garden` (Pattern A: data-driven, uses shared `@repo/ui` components). Using `park-view-2` as source requires more customization work since all content is hardcoded in individual components.
