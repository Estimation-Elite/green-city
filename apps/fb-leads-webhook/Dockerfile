FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/fb-leads-webhook build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/fb-leads-webhook/.next/standalone ./
COPY --from=builder /app/apps/fb-leads-webhook/.next/static ./apps/fb-leads-webhook/.next/static

EXPOSE 3000

CMD ["node", "apps/fb-leads-webhook/server.js"]
