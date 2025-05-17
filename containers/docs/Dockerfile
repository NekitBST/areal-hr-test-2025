FROM node:22-alpine as build

WORKDIR /app

COPY docs/package*.json ./
RUN npm install

COPY docs/ .

RUN npm run docs:build

FROM nginx:alpine

COPY --from=build /app/.vitepress/dist/ /usr/share/nginx/html/docs/
COPY containers/docs/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 