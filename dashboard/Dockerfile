# Prefer the monorepo root Dockerfile (shared Yarn workspace deps stage).
# Kept for dashboard-scoped builds:
#   docker build -f Dockerfile --target frontend-development -t wiki-fe-dev .
#   docker build -f Dockerfile --target frontend-production -t wiki-fe-prod .

FROM node:20-bookworm-slim AS base
WORKDIR /workspace
RUN corepack enable

FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY dashboard/package.json ./dashboard/package.json
COPY be/package.json ./be/package.json
COPY site/package.json ./site/package.json
RUN yarn install --immutable

FROM deps AS development
ENV NODE_ENV=development
COPY dashboard ./dashboard
EXPOSE 3000
CMD ["yarn", "workspace", "wiki_client", "dev", "--host", "0.0.0.0", "--port", "3000"]

FROM deps AS build
COPY dashboard ./dashboard
RUN yarn workspace wiki_client build

FROM nginx:1.27-alpine AS production
COPY dashboard/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dashboard/dist /usr/share/nginx/html
EXPOSE 80
