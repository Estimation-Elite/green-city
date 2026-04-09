FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/revelation build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/revelation/.next/standalone ./
COPY --from=builder /app/apps/revelation/.next/static ./apps/revelation/.next/static
COPY --from=builder /app/apps/revelation/public ./apps/revelation/public

CMD ["node", "apps/revelation/server.js"]
