# syntax=docker/dockerfile:1

FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm install --production
CMD [ "npm", "run", "build-export-start" ]
