---
name: deploy-app
description: Build and deploy any app from the monorepo to the green-city IONOS VPS server
disable-model-invocation: true
argument-hint: "[app-name]"
allowed-tools: Bash(docker *), Bash(sshpass *), Bash(source *), Read
---

# Deploy an app to the server

Deploy the app `$ARGUMENTS` to the green-city IONOS VPS server.

## App → Server mapping

All apps are deployed to the same server.

| App             | Host           | Remote directory     |
| --------------- | -------------- | -------------------- |
| l-archipel      | 217.160.246.17 | /opt/l-archipel      |
| park-view-old   | 217.160.246.17 | /opt/park-view-OLD   |
| park-view-2-old | 217.160.246.17 | /opt/park-view-2-OLD |
| revelation      | 217.160.246.17 | /opt/revelation      |
| roof-garden     | 217.160.246.17 | /opt/roof-garden     |
| park-view       | 217.160.246.17 | /opt/park-view       |
| home-spirit-2   | 217.160.246.17 | /opt/home-spirit-2   |

## Credentials

Server credentials are stored in the `.server` file at the repo root. It contains `HOTE` (host IP), `USER`, and `MDP` (password). Read it to get the credentials. NEVER display passwords to the user.

## Deployment steps

Before starting, confirm with the user which app to deploy if `$ARGUMENTS` is empty or ambiguous.

### Step 1: Validate

- Verify `$ARGUMENTS` is a valid app name from the table above.
- Read the `.server` file to get `HOTE` and `MDP`.
- Verify that `apps/$ARGUMENTS/Dockerfile` exists. If not, create one by copying `apps/roof-garden/Dockerfile` and replacing all occurrences of `roof-garden` with `$ARGUMENTS`.

### Step 2: Build the Docker image

Run from the **repo root**:

```bash
docker build -f apps/$ARGUMENTS/Dockerfile -t $ARGUMENTS:latest .
```

### Step 3: Export the image

```bash
docker save $ARGUMENTS:latest | gzip > $ARGUMENTS.tar.gz
```

### Step 4: Transfer to the server

```bash
sshpass -p '<MDP>' scp $ARGUMENTS.tar.gz root@<HOTE>:/opt/$ARGUMENTS/
```

### Step 5: Update .env on the server

If the app has an `.env` file, transfer it:

```bash
sshpass -p '<MDP>' scp apps/$ARGUMENTS/.env root@<HOTE>:/opt/$ARGUMENTS/.env
```

If the app has no `.env` file, skip this step.

### Step 6: Load and restart on the server

```bash
sshpass -p '<MDP>' ssh root@<HOTE> \
  "cd /opt/$ARGUMENTS && docker load < $ARGUMENTS.tar.gz && rm $ARGUMENTS.tar.gz && docker compose up -d && docker image prune -f"
```

### Step 7: Verify

```bash
sshpass -p '<MDP>' ssh root@<HOTE> "docker ps --filter name=$ARGUMENTS --format '{{.Status}}'"
```

Report the container status to the user.

### Step 8: Cleanup

Remove the local tar.gz file:

```bash
rm $ARGUMENTS.tar.gz
```

## Important notes

- Always build from the **repo root**, not from the app directory.
- The build can take a few minutes — inform the user.
- If the build fails, show the error and stop. Do NOT transfer a broken image.
- If disk space is low on the server, run cleanup: `docker system prune -a -f && docker builder prune -a -f`
- If the user only wants to update the `.env` (no rebuild), use: `sshpass -p '<MDP>' scp apps/$ARGUMENTS/.env root@<HOTE>:/opt/$ARGUMENTS/.env && sshpass -p '<MDP>' ssh root@<HOTE> "cd /opt/$ARGUMENTS && docker compose restart app"`
