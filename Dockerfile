FROM node:22-slim AS build
WORKDIR /app
COPY . .

RUN npm ci && npm run build

FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json .

RUN npm ci --omit=dev

COPY --from=build /app/build .

CMD ["node", "/app/yandex-search-mcp/build/index.js"]
