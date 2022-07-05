FROM node:alpine as build
WORKDIR /app
COPY ./package.json ./package-lock.json /app/
RUN npm i
COPY . /app
RUN npm run build
FROM nginx:1.16.0-alpine
COPY --from=build /app/public /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]