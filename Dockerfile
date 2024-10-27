# Development target
FROM node:alpine AS development

WORKDIR /app/ui

COPY package.json package-lock.json ./
RUN npm ci

VOLUME /app/ui
ENTRYPOINT [ "npm" ]
CMD [ "start" ]

# Build target for production
FROM node:alpine AS build

WORKDIR /app/ui

COPY package.json package-lock.json ./
RUN NODE_ENV=production npm ci
COPY . .
RUN npm run build

# Production target
FROM node:alpine

COPY --from=build /app/ui/build /app/kwaai-ui
RUN npm install -g serve

EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT [ "serve" ]
CMD [ "-s", "/app/kwaai-ui" ]
