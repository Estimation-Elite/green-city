FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/leads build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/leads/.next/standalone ./
COPY --from=builder /app/apps/leads/.next/static ./apps/leads/.next/static

EXPOSE 3000

CMD ["node", "apps/leads/server.js"]
