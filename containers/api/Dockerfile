FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
RUN npm install --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/. .

EXPOSE 3000

RUN printf '#!/bin/sh\n\
echo "Waiting for PostgreSQL to be ready..."\n\
while ! nc -z $DB_HOST $DB_PORT; do\n\
  sleep 0.1\ndone\necho "PostgreSQL is ready!"\n\
echo "Running database migrations..."\n\
npm run migrate:up\n\
echo "Starting application..."\n\
npm run start:prod' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
