FROM node:lts-alpine3.19 as builder

RUN corepack enable && corepack prepare yarn@4.9.2 --activate

WORKDIR /app

COPY . .

RUN yarn workspaces focus --production && \
    yarn install && \
    yarn prisma generate && \
    yarn build && \
    yarn cache clear --all

FROM node:lts-alpine3.19 as runner

WORKDIR /app

RUN apk add --no-cache openssl
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

ENV PORT=80
ENV DATABASE_URL=postgresql://product:password@product_db:5432/product?schema=public
ENV KAFKA_BROKER=event_bus:9092
ENV KAFKA_CONSUMER_GROUP=product_service
ENV QUERY_TIMEOUT=45000
ENV NODE_ENV=production

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

USER nestjs

EXPOSE 80

CMD ["node", "dist/src/main.js"]
