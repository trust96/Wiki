# Backend image — build from the monorepo root (Yarn workspace context):
#   docker build -f be/Dockerfile --target backend-development -t wiki-be-dev .
#   docker build -f be/Dockerfile --target backend-production -t wiki-be-prod .
#
# Prefer the root Dockerfile when building the full stack (shared deps cache with frontend).

FROM node:20-bookworm-slim AS base

WORKDIR /workspace

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable

FROM base AS deps

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY dashboard/package.json ./dashboard/package.json
COPY be/package.json ./be/package.json
COPY site/package.json ./site/package.json

RUN yarn install --immutable

FROM deps AS backend-development

ENV NODE_ENV=development
WORKDIR /workspace

COPY be ./be
RUN yarn workspace wiki_server prisma generate

EXPOSE 5000
CMD ["yarn", "workspace", "wiki_server", "dev"]

FROM deps AS backend-build

WORKDIR /workspace
COPY be ./be
RUN yarn workspace wiki_server prisma generate \
  && yarn workspace wiki_server build

FROM deps AS backend-prod-deps

WORKDIR /workspace
RUN yarn workspaces focus wiki_server \
  && yarn cache clean --all

FROM base AS backend-production

ENV NODE_ENV=production
WORKDIR /workspace

COPY --from=backend-prod-deps /workspace/package.json ./package.json
COPY --from=backend-prod-deps /workspace/yarn.lock ./yarn.lock
COPY --from=backend-prod-deps /workspace/.yarnrc.yml ./.yarnrc.yml
COPY --from=backend-prod-deps /workspace/.yarn ./.yarn
COPY --from=backend-prod-deps /workspace/node_modules ./node_modules
COPY --from=backend-prod-deps /workspace/be/package.json ./be/package.json

COPY --from=backend-build /workspace/be/dist ./be/dist
COPY --from=backend-build /workspace/be/prisma ./be/prisma
COPY --from=backend-build /workspace/be/prisma.config.ts ./be/prisma.config.ts

EXPOSE 5000
CMD ["sh", "-c", "yarn workspace wiki_server prisma migrate deploy && node ./be/dist/server.js"]
