#

## Pour lancer le dev

cd /home/vincent/clients/monmeilleurbien/dev/green-city
pnpm dev

## Pour tester les apps

Lancer toutes les apps en mode dev (chacune sur son port, voir la sortie console) :

```bash
pnpm dev
```

Lancer une seule app :

```bash
pnpm --filter @repo/home-spirit-2 dev
pnpm --filter @repo/l-archipel dev
pnpm --filter @repo/park-view dev
pnpm --filter @repo/revelation dev
```

Vérifier les types et le lint sur tout le monorepo :

```bash
pnpm typecheck
pnpm lint
```

Builder une app (vérifie qu'elle compile pour la prod) :

```bash
pnpm --filter @repo/home-spirit-2 build
```

Tester les endpoints de capture de lead / RDV en local :

```bash
# Lead
curl -X POST http://localhost:3000/api/lead \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","phone":"0600000000"}'

# RDV
curl -X POST http://localhost:3000/api/rdv \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","phone":"0600000000","date":"2026-06-01","time":"10:00"}'
```

Les variables `GREENCITY_API_URL`, `GREENCITY_API_KEY`, `GREENCITY_API_SECRET` doivent être présentes dans le `.env` de l'app pour que les endpoints poussent vraiment vers l'ERP.

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
