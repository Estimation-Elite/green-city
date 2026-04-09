FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/park-view build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/park-view/.next/standalone ./
COPY --from=builder /app/apps/park-view/.next/static ./apps/park-view/.next/static
COPY --from=builder /app/apps/park-view/public ./apps/park-view/public

CMD ["node", "apps/park-view/server.js"]
