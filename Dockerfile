# syntax=docker/dockerfile:1

FROM node:lts-alpine
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm install --production
CMD [ "npm", "run", "build-export-start" ]
