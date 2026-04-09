---
name: setup-server
description: Set up the green-city server (Docker, swap, NPM) and deploy an app for the first time
disable-model-invocation: true
argument-hint: "<app-name>"
allowed-tools: Bash(sshpass *), Bash(docker *), Bash(source *), Bash(rm *), Read, Edit
---

# Set up the server and deploy an app

Set up the green-city Linux (Ubuntu) server and deploy the app `$ARGUMENTS` for the first time. If the server is already set up (Docker installed, NPM running), skip directly to app deployment.

## Server

All apps are deployed to a single IONOS VPS server. Refer to the deploy-app skill for the current app list:
`.claude/skills/deploy-app/SKILL.md`

## Credentials

Server credentials are stored in the `.server` file at the repo root (`HOTE`, `USER`, `MDP`). Read it to get credentials. NEVER display passwords to the user.

## Setup steps

Before starting, confirm with the user:
1. Which app to deploy (if `$ARGUMENTS` is empty or ambiguous)
2. The **domain name(s)** that will point to this app

### Step 0: Validate and prepare credentials

- Verify `$ARGUMENTS` is a valid app name (check that `apps/$ARGUMENTS/` exists).
- Read `.server` to get `HOTE` and `MDP`.
- If `.server` does not exist, ask the user for the server IP and root password, then create it:

```
HOTE=<IP>
USER=ROOT
MDP=<PASSWORD>
```

### Step 1: Test SSH connectivity

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 root@<HOTE> "echo 'SSH OK'"
```

If this fails, stop and inform the user. The server may not be accessible or the password may be wrong.

### Step 2: Check if server is already set up

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> "docker --version && docker compose version && docker network ls --filter name=green-city-net -q"
```

If Docker is installed and the `green-city-net` network exists, skip to **Step 6** (the server is already set up from a previous app deployment).

### Step 3: Install Docker

Run via SSH on the remote server:

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> bash -c '
apt-get update && apt-get install -y ca-certificates curl &&
install -m 0755 -d /etc/apt/keyrings &&
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc &&
chmod a+r /etc/apt/keyrings/docker.asc &&
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" > /etc/apt/sources.list.d/docker.list &&
apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
'
```

Verify Docker is installed:

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> "docker --version && docker compose version"
```

### Step 4: Create 2 GB swap

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> bash -c '
if [ -f /swapfile ]; then
  echo "Swap already exists, skipping"
else
  fallocate -l 2G /swapfile &&
  chmod 600 /swapfile &&
  mkswap /swapfile &&
  swapon /swapfile &&
  echo "/swapfile none swap sw 0 0" >> /etc/fstab &&
  echo "Swap created successfully"
fi
'
```

### Step 5: Create shared Docker network and NPM

Create the shared Docker network that all apps and NPM will use:

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> "docker network create green-city-net"
```

Create the NPM directory and docker-compose file:

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> "mkdir -p /opt/npm"
```

Write the NPM docker-compose.yml:

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> cat > /opt/npm/docker-compose.yml << 'COMPOSE_EOF'
services:
  npm:
    image: jc21/nginx-proxy-manager:latest
    container_name: nginx-proxy-manager
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "81:81"
    volumes:
      - ./npm-data:/data
      - ./npm-letsencrypt:/etc/letsencrypt
    networks:
      - green-city-net

networks:
  green-city-net:
    external: true
COMPOSE_EOF
```

Start NPM:

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> "cd /opt/npm && docker compose up -d"
```

### Step 6: Create the app directory and docker-compose.yml

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> "mkdir -p /opt/$ARGUMENTS"
```

Write the app's docker-compose.yml:

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> cat > /opt/$ARGUMENTS/docker-compose.yml << 'COMPOSE_EOF'
services:
  app:
    image: APP_NAME:latest
    container_name: APP_NAME
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
    env_file:
      - .env
    networks:
      - green-city-net

networks:
  green-city-net:
    external: true
COMPOSE_EOF
```

**Important**: Replace `APP_NAME` with the actual app name in both the `image` and `container_name` fields.

### Step 7: Transfer the .env file

```bash
sshpass -p '<MDP>' scp -o StrictHostKeyChecking=no apps/$ARGUMENTS/.env root@<HOTE>:/opt/$ARGUMENTS/.env
```

If the app does not have a `.env` file yet, create a minimal one or skip (the app may not need it).

### Step 8: Build the Docker image locally

Verify that `apps/$ARGUMENTS/Dockerfile` exists. If not, create one by copying `apps/roof-garden/Dockerfile` and replacing all occurrences of `roof-garden` with `$ARGUMENTS`.

Run from the **repo root**:

```bash
docker build -f apps/$ARGUMENTS/Dockerfile -t $ARGUMENTS:latest .
```

This can take several minutes — inform the user. If the build fails, show the error and stop.

### Step 9: Export and transfer the image

```bash
docker save $ARGUMENTS:latest | gzip > $ARGUMENTS.tar.gz
```

```bash
sshpass -p '<MDP>' scp -o StrictHostKeyChecking=no $ARGUMENTS.tar.gz root@<HOTE>:/opt/$ARGUMENTS/
```

### Step 10: Load the image and start the container

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> \
  "cd /opt/$ARGUMENTS && docker load < $ARGUMENTS.tar.gz && rm $ARGUMENTS.tar.gz && docker compose up -d && docker image prune -f"
```

### Step 11: Verify containers are running

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
```

The app container (`$ARGUMENTS`) and `nginx-proxy-manager` should both be running. Report the status to the user.

### Step 12: Update the deploy-app skill

Add the new app entry to the mapping table in `.claude/skills/deploy-app/SKILL.md`:

| App          | Host           | Remote directory    |
| ------------ | -------------- | ------------------- |
| $ARGUMENTS   | 217.160.246.17 | /opt/$ARGUMENTS     |

### Step 13: Cleanup local tar.gz

```bash
rm $ARGUMENTS.tar.gz
```

### Step 14: Remind user about NPM and DNS configuration

After all steps are done, remind the user:

**If NPM is already running** (from a previous app deployment), just add a new Proxy Host:

**Nginx Proxy Manager — Add a Proxy Host:**
1. Access the NPM dashboard at `http://217.160.246.17:81`
2. Add a Proxy Host:
   - Domain Names: the domain(s) for this app
   - Forward Hostname: `$ARGUMENTS` (the container name on the `green-city-net` network)
   - Forward Port: `3000`
   - Enable: Websockets Support, Block Common Exploits
   - SSL tab: Request a new SSL certificate with Let's Encrypt, Force SSL, HTTP/2 Support
   - Email for Let's Encrypt: `gestion@artech-group.fr`

**If NPM is brand new** (first-time setup):
1. Default login: `admin@example.com` / `changeme` (change it on first login)
2. Update the credentials to: email `gestion@artech-group.fr`, password `Gwm=h)?9XuvDhgU`
3. Then add the Proxy Host as described above

**DNS setup:**
- Add an A record for each domain/subdomain pointing to `217.160.246.17`
- Wait for DNS propagation before requesting the SSL certificate in NPM

**Verification:**
```bash
curl -sk -o /dev/null -w '%{http_code}' https://<DOMAIN>/
```
Should return `200` once DNS + SSL are configured.

## Important notes

- Always build from the **repo root**, not from the app directory.
- The build can take a few minutes — inform the user.
- If the build fails, show the error and stop. Do NOT transfer a broken image.
- If Docker install fails, it may be because the server is not running Ubuntu. Ask the user to confirm the OS.
- If the server has very limited disk space, consider running `apt clean && rm -rf /tmp/*` before starting.
- All app containers must be on the `green-city-net` Docker network so NPM can reach them by container name.
