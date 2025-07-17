FROM node:lts-slim

RUN apt update && apt install -y xdg-utils procps
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
