FROM node:20-alpine AS base

#
# Dependencies builder
#

FROM base AS deps-builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn --immutable

#
# App builder
#

FROM base AS app-builder

ARG NEXT_PUBLIC_MAPTILER_API_KEY

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_MAPTILER_API_KEY=$NEXT_PUBLIC_MAPTILER_API_KEY

WORKDIR /app
COPY --from=deps-builder /app/node_modules ./node_modules
COPY . .
RUN yarn build

#
# App runner
#

FROM base AS app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app
RUN adduser --system --uid 1001 nextjs
RUN addgroup --system --gid 1001 nodejs

COPY --from=app-builder --chown=nextjs:nodejs /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=app-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=app-builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
ENV PORT 3000
EXPOSE 3000

CMD ["node", "server.js"]
