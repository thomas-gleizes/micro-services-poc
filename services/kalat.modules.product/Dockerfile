FROM node:lts-alpine3.19 as builder

RUN corepack enable && corepack prepare yarn@4.9.2 --activate

WORKDIR /app

COPY . .

RUN yarn workspaces focus --production && \
    yarn install && \
    yarn build && \
    yarn cache clear --all

FROM node:lts-alpine3.19 as runner

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

USER nestjs

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/src/main.js"]
