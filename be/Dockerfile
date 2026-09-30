FROM node:20-bookworm-slim AS base

WORKDIR /app

# Prisma engines expect OpenSSL at runtime.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps

COPY package.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM deps AS build

COPY tsconfig.json ./
COPY types ./types
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate --schema=./prisma/schema/main.prisma \
  && npx tsc -p ./tsconfig.json

FROM deps AS development

ENV NODE_ENV=development
COPY tsconfig.json ./
COPY types ./types
COPY prisma ./prisma
COPY src ./src

EXPOSE 5000
CMD ["npm", "run", "dev"]

FROM base AS production

ENV NODE_ENV=production

COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema/main.prisma && node ./dist/server.js"]
