#

## Pour lancer le dev

cd /home/vincent/clients/monmeilleurbien/dev/green-city
pnpm dev

## Pour dupliquer pour un nouveau projet

cp -r apps/roof-garden apps/nouveau-projet
Editer package.json (name), Dockerfile, src/data/roof-garden.ts (contenu), globals.css (couleurs)

## Chiffrement des .env (GPG)

Chiffrer tous les `.env` en `.env.gpg` :

```bash
for app in fb-leads-webhook home-spirit-2 l-archipel leads park-view revelation; do
  gpg --symmetric --cipher-algo AES256 --batch --yes --passphrase '<PASSPHRASE>' \
    -o "apps/$app/.env.gpg" "apps/$app/.env"
done
```

Déchiffrer tous les `.env.gpg` en `.env` :

```bash
for app in fb-leads-webhook home-spirit-2 l-archipel leads park-view revelation; do
  gpg --decrypt --batch --yes --passphrase '<PASSPHRASE>' \
    -o "apps/$app/.env" "apps/$app/.env.gpg"
done
```
