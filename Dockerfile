# Build target for production
FROM node:alpine AS build

ARG APP_API_URL
ENV REACT_APP_API_URL=$APP_API_URL

WORKDIR /app/ui

COPY package.json package-lock.json ./
RUN NODE_ENV=production npm ci

COPY . .

RUN npm run build

# Production target
FROM node:alpine
WORKDIR /app

COPY --from=build /app/ui/build /app/kwaai-ui
RUN npm install -g serve

# Copy the certificates
COPY localhost.pem /app/localhost.pem
COPY localhost-key.pem /app/localhost-key.pem

# Setup the environment
ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT [ "serve" ]
CMD [ "-s", "/app/kwaai-ui", "--ssl-cert", "/app/localhost.pem", "--ssl-key", "/app/localhost-key.pem" ]
