FROM node:20-bookworm-slim AS base

WORKDIR /workspace

# Prisma engines expect OpenSSL at runtime.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY dashboard/package.json ./dashboard/package.json
COPY be/package.json ./be/package.json
COPY site/package.json ./site/package.json

RUN yarn install

FROM deps AS build

COPY be/tsconfig.json ./be/tsconfig.json
COPY be/types ./be/types
COPY be/prisma ./be/prisma
COPY be/src ./be/src

RUN yarn --cwd be prisma generate --schema=./prisma/schema/main.prisma \
  && yarn --cwd be tsc -p ./tsconfig.json

FROM deps AS development

ENV NODE_ENV=development

COPY be/tsconfig.json ./be/tsconfig.json
COPY be/types ./be/types
COPY be/prisma ./be/prisma
COPY be/src ./be/src

EXPOSE 5000
CMD ["sh", "-c", "cd be && npx nodemon --exec \"node --loader ts-node/esm\" src/server.ts"]

FROM base AS production

ENV NODE_ENV=production

COPY --from=deps /workspace/package.json ./package.json
COPY --from=deps /workspace/yarn.lock ./yarn.lock
COPY --from=deps /workspace/.yarnrc.yml ./.yarnrc.yml
COPY --from=deps /workspace/.yarn ./.yarn
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/be/package.json ./be/package.json
COPY --from=build /workspace/be/dist ./be/dist
COPY --from=build /workspace/be/prisma ./be/prisma

EXPOSE 5000
CMD ["sh", "-c", "cd be && npx prisma migrate deploy --schema=./prisma/schema/main.prisma && node ./dist/server.js"]
