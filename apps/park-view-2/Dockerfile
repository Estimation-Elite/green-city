FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/park-view-2 build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/park-view-2/.next/standalone ./
COPY --from=builder /app/apps/park-view-2/.next/static ./apps/park-view-2/.next/static
COPY --from=builder /app/apps/park-view-2/public ./apps/park-view-2/public

CMD ["node", "apps/park-view-2/server.js"]
