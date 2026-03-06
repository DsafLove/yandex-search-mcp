FROM node:22 AS build
WORKDIR /app
COPY . .

RUN npm ci && npm run build

FROM node:22 AS base
WORKDIR /app
COPY . .
COPY --from=build /app/build .

RUN npm ci --omit=dev

FROM node:22-slim as runtime
WORKDIR /app
COPY package.json package-lock.json .
COPY --from=base /app/node_modules /app/build .

CMD ["node", "/app/yandex-search-mcp/build/index.js"]
