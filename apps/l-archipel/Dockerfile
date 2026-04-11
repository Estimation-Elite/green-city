FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/l-archipel build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/l-archipel/.next/standalone ./
COPY --from=builder /app/apps/l-archipel/.next/static ./apps/l-archipel/.next/static
COPY --from=builder /app/apps/l-archipel/public ./apps/l-archipel/public

CMD ["node", "apps/l-archipel/server.js"]
