FROM node:24-alpine AS base

ENV ASTRO_TELEMETRY_DISABLED=1
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable
WORKDIR /app

#
# Dependencies builder
#

FROM base AS deps-builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

#
# App builder
#

FROM base AS app-builder

ARG PUBLIC_MAPTILER_API_KEY
ENV PUBLIC_MAPTILER_API_KEY=$PUBLIC_MAPTILER_API_KEY

COPY --from=deps-builder /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

#
# App runner
#
# Uses Alpine's nodejs package rather than node:24-alpine: it links against system libraries and
# ships English-only ICU data, which roughly halves the image size. Alpine's nodejs package tracks
# the current Node LTS, so moving to a newer Alpine release can change the Node major version.
#

FROM alpine:3.24 AS app

RUN apk add --no-cache nodejs
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs nodejs

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=127.0.0.1
ENV PORT=3000

COPY --from=app-builder --chown=nodejs:nodejs /app/dist ./dist

USER 1001
EXPOSE 3000

CMD ["node", "dist/server/entry.mjs"]
