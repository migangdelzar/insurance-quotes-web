FROM oven/bun:1 AS build

WORKDIR /workspace

COPY package.json bun.lock bunfig.toml ./
COPY packages packages
COPY apps apps
COPY e2e/package.json e2e/package.json

RUN bun install --frozen-lockfile

ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN bun run --filter web build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/web/dist /usr/share/nginx/html

EXPOSE 80
