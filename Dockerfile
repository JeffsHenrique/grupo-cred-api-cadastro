FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache bash

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN chmod +x docker-entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["./docker-entrypoint.sh"]
