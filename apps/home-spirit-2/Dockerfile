FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/home-spirit-2 build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/home-spirit-2/.next/standalone ./
COPY --from=builder /app/apps/home-spirit-2/.next/static ./apps/home-spirit-2/.next/static
COPY --from=builder /app/apps/home-spirit-2/public ./apps/home-spirit-2/public

CMD ["node", "apps/home-spirit-2/server.js"]
