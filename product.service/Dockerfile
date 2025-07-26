FROM node:lts-alpine3.19 as runner

RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare yarn@4.9.2 --activate

FROM runner AS builder

WORKDIR /app

COPY . .

RUN yarn install --immutable
RUN yarn prisma generate
RUN yarn build && yarn cache clean

FROM runner

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

ENV PORT=3000
ENV DATABASE_URL=postgresql://product:password@product_db:5432/product?schema=public
ENV KAFKA_BROKER=event_bus:9092
ENV KAFKA_GROUP_ID=product_service
ENV QUERY_TIMEOUT=45000
ENV NODE_ENV=production

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/yarn.lock /app/yarn.lock
COPY --from=builder /app/src/infrastructure/schemas/schema.prisma /app/schema.prisma

USER nestjs

EXPOSE 3000

CMD ["dist/src/main.js"]
