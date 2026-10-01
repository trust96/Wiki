FROM node:20-bookworm-slim AS deps

WORKDIR /workspace

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY dashboard/package.json ./dashboard/package.json
COPY be/package.json ./be/package.json
COPY site/package.json ./site/package.json

RUN yarn install

FROM deps AS development

WORKDIR /workspace
COPY dashboard ./dashboard

EXPOSE 3000
CMD ["sh", "-c", "BACKEND_PROXY_TARGET=http://backend-dev:5000 yarn --cwd dashboard dev --host 0.0.0.0 --port 3000"]

FROM deps AS build

WORKDIR /workspace
COPY dashboard ./dashboard

RUN yarn --cwd dashboard build

FROM nginx:1.27-alpine AS production

COPY dashboard/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dashboard/dist /usr/share/nginx/html

EXPOSE 80
