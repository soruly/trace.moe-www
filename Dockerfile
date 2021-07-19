# syntax=docker/dockerfile:1

FROM node:lts-alpine AS build
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm run build
RUN npm run export


FROM nginx:stable-alpine
COPY --from=build /app/out/ /usr/share/nginx/html/
