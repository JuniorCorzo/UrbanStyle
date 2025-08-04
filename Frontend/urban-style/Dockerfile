FROM node:22.17.1-alpine3.22 AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod

FROM base AS build-deps

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

FROM build-deps AS build

COPY .env.development .env
COPY . .

RUN pnpm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
ENTRYPOINT ["node", "./dist/server/entry.mjs"]
