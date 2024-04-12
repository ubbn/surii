# ARG NODE_VERSION=current-alpine
# FROM node:$NODE_VERSION AS base

# ARG PNPM_VERSION=latest

# RUN apk update \ 
#   && apk add --no-cache libc6-compat \
#   && corepack enable \
#   && corepack prepare pnpm@$PNPM_VERSION --activate
FROM ubbn/pnpm:8.10.5

ARG GID=10001
ARG UID=10001
RUN sed -i '/node/d' /etc/passwd \
  && echo "node:x:$UID:$GID::/home/node:/bin/sh" >> /etc/passwd \
  && echo "node:!:$(($(date +%s) / 60 / 60 / 24)):0:99999:7:::" >> /etc/shadow \
  && echo "node:x:$GID:" >> /etc/group \
  && chown node: /home/node
