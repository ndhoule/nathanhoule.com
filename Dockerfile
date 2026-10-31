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
# Runtime base (node:24-alpine with development-time deps trimmed out to reduce image size)
#

FROM node:24-alpine AS runtime-base

RUN rm -rf \
  /opt/yarn-* \
  /usr/local/bin/corepack \
  /usr/local/bin/npm \
  /usr/local/bin/npx \
  /usr/local/bin/yarn \
  /usr/local/bin/yarnpkg \
  /usr/local/include/node \
  /usr/local/lib/node_modules
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs nodejs

#
# App runner
#

FROM scratch AS app

COPY --from=runtime-base / /

WORKDIR /app

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV NODE_ENV=production
ENV HOST=127.0.0.1
ENV PORT=3000

COPY --from=app-builder --chown=astro:nodejs /app/dist ./dist

USER 1001
EXPOSE 3000

CMD ["node", "dist/server/entry.mjs"]
