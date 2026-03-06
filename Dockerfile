FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npx esbuild src/index.ts --bundle --platform=node --format=esm --packages=external --outfile=build/index.mjs

FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/build/index.mjs ./index.mjs

CMD ["node", "index.mjs"]
