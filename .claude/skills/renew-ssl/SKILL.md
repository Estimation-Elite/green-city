---
name: renew-ssl
description: Renew SSL certificates on the green-city IONOS VPS server via the Nginx Proxy Manager API
disable-model-invocation: true
argument-hint: "[app-name or 'all']"
allowed-tools: Bash(sshpass *), Bash(curl *), Bash(dig *), Read
---

# Renew SSL certificates

Renew SSL certificates on the green-city server via the Nginx Proxy Manager API. If `$ARGUMENTS` is empty or `all`, renew all proxy hosts. If an app name is specified, renew only the proxy host(s) matching that app's domain(s).

## Server

| Server     | Host           | NPM container       |
| ---------- | -------------- | -------------------- |
| green-city | 217.160.246.17 | nginx-proxy-manager  |

All apps are behind this single Nginx Proxy Manager instance.

## Credentials

- **SSH credentials**: stored in `.server` at the repo root (`HOTE`, `USER`, `MDP`). Read it to get the password. NEVER display passwords to the user.
- **NPM API credentials**: email `gestion@artech-group.fr`, password `Gwm=h)?9XuvDhgU`

## Renewal steps

### Step 1: Get NPM API token

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> \
  'curl -s http://127.0.0.1:81/api/tokens -X POST -H "Content-Type: application/json" \
  -d '"'"'{"identity":"gestion@artech-group.fr","secret":"Gwm=h)?9XuvDhgU"}'"'"''
```

Extract the `token` field from the JSON response.

### Step 2: List proxy hosts

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> \
  "curl -s http://127.0.0.1:81/api/nginx/proxy-hosts -H 'Authorization: Bearer <TOKEN>'"
```

For each proxy host, note the `id`, `domain_names`, `certificate_id`, and all other fields needed for the PUT request.

If `$ARGUMENTS` specifies an app name, filter to only the proxy host(s) whose `domain_names` match that app. Otherwise, process all proxy hosts.

### Step 3: Delete the existing certificate

For each proxy host to renew:

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> \
  "curl -s -X DELETE http://127.0.0.1:81/api/nginx/certificates/<CERT_ID> -H 'Authorization: Bearer <TOKEN>'"
```

### Step 4: Recreate the proxy host with a new certificate

Write the JSON payload to a file on the server to avoid shell escaping issues, then PUT:

```bash
sshpass -p '<MDP>' ssh -o StrictHostKeyChecking=no root@<HOTE> bash -c 'cat > /tmp/ph.json << '"'"'EOF'"'"'
{"domain_names":[<DOMAINS>],"forward_scheme":"<SCHEME>","forward_host":"<FWD_HOST>","forward_port":<FWD_PORT>,"certificate_id":"new","ssl_forced":true,"block_exploits":true,"allow_websocket_upgrade":true,"http2_support":true,"meta":{"letsencrypt_email":"gestion@artech-group.fr","letsencrypt_agree":true},"advanced_config":"","locations":[]}
EOF
curl -s -X PUT "http://127.0.0.1:81/api/nginx/proxy-hosts/<HOST_ID>" \
  -H "Authorization: Bearer '"<TOKEN>"'" \
  -H "Content-Type: application/json" \
  -d @/tmp/ph.json && rm /tmp/ph.json'
```

Preserve the original `forward_host`, `forward_port`, `forward_scheme`, and `domain_names` from Step 2.

### Step 5: Verify

Check the response contains a valid `certificate` object with a future `expires_on` date. Report the result to the user:

- App / domain name
- Domains covered
- Certificate expiry date
- Success or failure

## Important notes

- Process proxy hosts sequentially to avoid rate-limiting by Let's Encrypt.
- If no proxy hosts are configured, inform the user.
- If certificate creation fails (Internal Error), it usually means DNS is not pointing to the server. Inform the user which domains failed.
- The NPM API listens on IPv4 (`127.0.0.1`), not `localhost`.
- Let's Encrypt certificates are valid for 90 days. Renew when they have less than 30 days remaining.
