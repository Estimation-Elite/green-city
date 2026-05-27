---
name: deploy-app
description: Build and deploy one or more apps from the monorepo to the green-city IONOS VPS server
disable-model-invocation: true
argument-hint: "[app-name]..."
allowed-tools: Bash(docker *), Bash(sshpass *), Bash(source *), Bash(rm *), Bash(ls *), Bash(md5sum *), Bash(grep *), Read
---

# Deploy one or more apps to the server

Deploy the apps passed in `$ARGUMENTS` to the green-city IONOS VPS server.

`$ARGUMENTS` is a **whitespace-separated list of app names**, or the special value `all` to deploy every app in the mapping table below. Examples:
- `/deploy-app l-archipel` → single app
- `/deploy-app l-archipel revelation home-spirit-2` → three apps
- `/deploy-app all` → every app listed in the mapping table

Throughout this skill, `<APP>` is a placeholder for the current app being processed. When there are multiple apps, you MUST loop through them and run the full deployment flow (steps 2–8) for each one.

## App → Server mapping

All apps are deployed to the same server (host `217.160.246.17`).

| App               | Remote directory       |
| ----------------- | ---------------------- |
| l-archipel        | /opt/l-archipel        |
| park-view-old     | /opt/park-view-OLD     |
| park-view-2-old   | /opt/park-view-2-OLD   |
| revelation        | /opt/revelation        |
| roof-garden       | /opt/roof-garden       |
| park-view         | /opt/park-view         |
| home-spirit-2     | /opt/home-spirit-2     |
| fb-leads-webhook  | /opt/fb-leads-webhook  |

### Name normalization

Users often drop the hyphen before trailing digits. Normalize before validating:

| User wrote       | Canonical app name |
| ---------------- | ------------------ |
| `home-spirit2`   | `home-spirit-2`    |
| `park-view2`     | `park-view`        *(or ask if unclear)* |
| `parkview-old`   | `park-view-old`    |
| `parkview2-old`  | `park-view-2-old`  |

If a name is ambiguous after normalization (e.g. user wrote `park-view2` — did they mean `park-view` or `park-view-2-old`?), ask the user before proceeding.

## Credentials

Server credentials are stored in the `.server` file at the repo root. It contains `HOTE` (host IP), `USER`, and `MDP` (password). Read it to get the credentials. NEVER display the password to the user.

## Global rules

- **Build sequentially, never in parallel.** Running multiple `docker build` at once saturates CPU/disk and can cause image-tag races. Complete one app's full flow (build → transfer → restart → verify) before starting the next.
- **Always transfer the local `.env`.** The copy on the server may be stale (changes to API keys, GTM IDs, etc. made locally). Even if the user doesn't mention `.env`, re-transfer it as part of every deploy.
- **Track progress with a todo list** when deploying more than one app, so the user sees which apps are done / in-flight / pending.

## Deployment steps (run for each `<APP>`)

### Step 1: Validate

- If `$ARGUMENTS` is `all`, expand it to the full list of apps from the mapping table.
- Normalize each user-provided name against the table above.
- If `$ARGUMENTS` is empty, ask the user which app(s) to deploy.
- Read the `.server` file to get `HOTE` and `MDP`.
- Verify that `apps/<APP>/Dockerfile` exists. If not, create one by copying `apps/roof-garden/Dockerfile` and replacing all occurrences of `roof-garden` with `<APP>`.
- Verify that `apps/<APP>/.env` exists (it usually does — it carries `GREENCITY_API_KEY`, `GREENCITY_API_SECRET`, `GTM_ID`, etc.).
- **Lint the `.env` content.** `docker compose up` refuses to start the container if it cannot parse the env file (e.g. a pasted `curl "..."` example, a stray unescaped `"`, a key with a space). Every non-empty, non-comment line MUST match `^[A-Za-z_][A-Za-z0-9_]*=`. Run this check from the repo root:

  ```bash
  grep -nvE '^\s*([A-Za-z_][A-Za-z0-9_]*=|#|$)' apps/<APP>/.env || echo "OK"
  ```

  If the output is `OK`, continue. Otherwise the matching lines are scratch notes / pasted commands / typos polluting the env file. Show them to the user and ask which of the following to do:
  1. **Fix the local `.env`** (recommended — move notes to a separate `notes.md`, or prefix each note line with `#`). Re-run the lint after editing.
  2. **Strip non-conforming lines on transfer only** (one-shot escape hatch — keeps the local `.env` untouched but uploads a cleaned copy). Implement by piping through `grep -E '^\s*([A-Za-z_][A-Za-z0-9_]*=|#|$)'` before `scp`-ing to a temp file, then transferring that file.
  3. **Abort.**

  NEVER auto-edit the user's local `.env` without their explicit choice — it may contain in-progress secrets or formatting they want to keep.

### Step 2: Build the Docker image

Run from the **repo root**:

```bash
docker build -f apps/<APP>/Dockerfile -t <APP>:latest .
```

### Step 3: Export the image

```bash
docker save <APP>:latest | gzip > <APP>.tar.gz
```

### Step 4: Transfer `.env` + image to the server

Always transfer the local `.env` (if it exists) to ensure the server runs with the latest config:

```bash
sshpass -p '<MDP>' scp apps/<APP>/.env root@<HOTE>:/opt/<APP>/.env
sshpass -p '<MDP>' scp <APP>.tar.gz      root@<HOTE>:/opt/<APP>/
```

If the app has no local `.env` file, skip the first line.

### Step 5: Load and restart on the server

```bash
sshpass -p '<MDP>' ssh root@<HOTE> \
  "cd /opt/<APP> && docker load < <APP>.tar.gz && rm <APP>.tar.gz && docker compose up -d && docker image prune -f"
```

### Step 6: Verify

```bash
sshpass -p '<MDP>' ssh root@<HOTE> "docker ps --filter name=<APP> --format '{{.Status}}'"
```

Report the container status to the user.

### Step 7: Cleanup

Remove the local tar.gz file:

```bash
rm <APP>.tar.gz
```

## Final report

When all apps are done, print a summary table:

| App | Status |
|---|---|
| \<APP\> | Up |
| ... | ... |

## Important notes

- Always build from the **repo root**, not from the app directory.
- The build can take a few minutes per app — inform the user.
- If a build fails, show the error and **stop the whole sequence**. Do NOT continue to the next app and do NOT transfer a broken image.
- If disk space is low on the server, run cleanup: `docker system prune -a -f && docker builder prune -a -f`
- If the user only wants to update the `.env` (no rebuild), use: `sshpass -p '<MDP>' scp apps/<APP>/.env root@<HOTE>:/opt/<APP>/.env && sshpass -p '<MDP>' ssh root@<HOTE> "cd /opt/<APP> && docker compose restart app"`
