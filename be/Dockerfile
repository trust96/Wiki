# Prefer the monorepo root Dockerfile (shared Yarn workspace deps stage).
# Kept so `be/`-scoped docs/commands still resolve a Dockerfile.
#   docker build -f Dockerfile --target backend-development -t wiki-be-dev .
#   docker build -f Dockerfile --target backend-production -t wiki-be-prod .

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

FROM deps AS development
ENV NODE_ENV=development
COPY be ./be
RUN yarn workspace wiki_server prisma generate
EXPOSE 5000
CMD ["yarn", "workspace", "wiki_server", "dev"]

FROM deps AS build
COPY be ./be
RUN yarn workspace wiki_server prisma generate \
  && yarn workspace wiki_server build

FROM deps AS prod-deps
RUN yarn workspaces focus wiki_server \
  && yarn cache clean --all

FROM base AS production
ENV NODE_ENV=production
WORKDIR /workspace
COPY --from=prod-deps /workspace/package.json ./package.json
COPY --from=prod-deps /workspace/yarn.lock ./yarn.lock
COPY --from=prod-deps /workspace/.yarnrc.yml ./.yarnrc.yml
COPY --from=prod-deps /workspace/.yarn ./.yarn
COPY --from=prod-deps /workspace/node_modules ./node_modules
COPY --from=prod-deps /workspace/be/package.json ./be/package.json
COPY --from=build /workspace/be/dist ./be/dist
COPY --from=build /workspace/be/prisma ./be/prisma
COPY --from=build /workspace/be/prisma.config.ts ./be/prisma.config.ts
EXPOSE 5000
CMD ["sh", "-c", "yarn workspace wiki_server prisma migrate deploy && node ./be/dist/server.js"]
