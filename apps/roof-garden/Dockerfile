FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/roof-garden build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/roof-garden/.next/standalone ./
COPY --from=builder /app/apps/roof-garden/.next/static ./apps/roof-garden/.next/static
COPY --from=builder /app/apps/roof-garden/public ./apps/roof-garden/public

CMD ["node", "apps/roof-garden/server.js"]
