FROM node:23.7.0-alpine

# Enable pnpm which is already present in node image
RUN corepack enable && corepack install --global pnpm
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

ARG GID=10001
ARG UID=10001
RUN sed -i '/node/d' /etc/passwd \
  && echo "node:x:$UID:$GID::/home/node:/bin/sh" >> /etc/passwd \
  && echo "node:!:$(($(date +%s) / 60 / 60 / 24)):0:99999:7:::" >> /etc/shadow \
  && echo "node:x:$GID:" >> /etc/group \
  && chown node: /home/node
