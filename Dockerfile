FROM node:18-alpine AS front
WORKDIR /home/js/src
COPY . /home/js/src/
EXPOSE 5000
RUN npm run build && npm run start&