# Monorepo image for the Yarn workspace (dashboard + be + site).
# Shared `deps` stage is reused by frontend and backend targets via BuildKit cache.

FROM node:20-bookworm-slim AS base

WORKDIR /workspace

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable

# ---------------------------------------------------------------------------
# Install all workspace dependencies once
# ---------------------------------------------------------------------------
FROM base AS deps

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY dashboard/package.json ./dashboard/package.json
COPY be/package.json ./be/package.json
COPY site/package.json ./site/package.json
COPY packages/api-contracts/package.json ./packages/api-contracts/package.json

RUN yarn install --immutable

# ---------------------------------------------------------------------------
# Backend development
# ---------------------------------------------------------------------------
FROM deps AS backend-development

ENV NODE_ENV=development
WORKDIR /workspace

COPY packages/api-contracts ./packages/api-contracts
COPY be ./be

RUN yarn workspace @wiki/api-contracts build \
  && yarn workspace wiki_server prisma generate

EXPOSE 5000
CMD ["yarn", "workspace", "wiki_server", "dev"]

# ---------------------------------------------------------------------------
# Frontend development
# ---------------------------------------------------------------------------
FROM deps AS frontend-development

ENV NODE_ENV=development
WORKDIR /workspace

COPY packages/api-contracts ./packages/api-contracts
COPY dashboard ./dashboard

RUN yarn workspace @wiki/api-contracts build

EXPOSE 3000
CMD ["yarn", "workspace", "wiki_client", "dev", "--host", "0.0.0.0", "--port", "3000"]

# ---------------------------------------------------------------------------
# Backend build (Prisma generate + tsc)
# ---------------------------------------------------------------------------
FROM deps AS backend-build

WORKDIR /workspace
COPY packages/api-contracts ./packages/api-contracts
COPY be ./be

RUN yarn workspace wiki_server prisma generate \
  && yarn workspace wiki_server build

# Focus install for wiki_server only (drops dashboard/site packages)
FROM deps AS backend-prod-deps

WORKDIR /workspace
RUN yarn workspaces focus wiki_server \
  && yarn cache clean --all

# ---------------------------------------------------------------------------
# Backend production
# ---------------------------------------------------------------------------
FROM base AS backend-production

ENV NODE_ENV=production
WORKDIR /workspace

COPY --from=backend-prod-deps /workspace/package.json ./package.json
COPY --from=backend-prod-deps /workspace/yarn.lock ./yarn.lock
COPY --from=backend-prod-deps /workspace/.yarnrc.yml ./.yarnrc.yml
COPY --from=backend-prod-deps /workspace/.yarn ./.yarn
COPY --from=backend-prod-deps /workspace/node_modules ./node_modules
COPY --from=backend-prod-deps /workspace/be/package.json ./be/package.json
COPY --from=backend-prod-deps /workspace/packages/api-contracts ./packages/api-contracts

COPY --from=backend-build /workspace/be/dist ./be/dist
COPY --from=backend-build /workspace/be/prisma ./be/prisma
COPY --from=backend-build /workspace/be/prisma.config.ts ./be/prisma.config.ts
COPY --from=backend-build /workspace/packages/api-contracts/dist ./packages/api-contracts/dist

WORKDIR /workspace
EXPOSE 5000
CMD ["sh", "-c", "yarn workspace wiki_server prisma migrate deploy && node ./be/dist/server.js"]

# ---------------------------------------------------------------------------
# Frontend build + nginx production (same-server public entrypoint)
# ---------------------------------------------------------------------------
FROM deps AS frontend-build

WORKDIR /workspace
COPY packages/api-contracts ./packages/api-contracts
COPY dashboard ./dashboard
RUN yarn workspace @wiki/api-contracts build \
  && yarn workspace wiki_client build

FROM nginx:1.27-alpine AS frontend-production

COPY dashboard/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /workspace/dashboard/dist /usr/share/nginx/html

EXPOSE 80
